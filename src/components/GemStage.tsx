"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { BASE, GEMS } from "@/lib/site";

// One WebGL scene drives both the intro and the hero, so there is never a cut between them.
const FOV = 40;
const CAM_Z = 60;
const TAN = Math.tan(((FOV / 2) * Math.PI) / 180);

// Intro timeline, seconds after the textures load.
const T_POP = 1.35; //   gems spiral in from the depth onto a wide ring
const T_GATHER = 2.0; // ring spins up and shrinks onto the logo petals -> impact
const T_HOLD = 2.45; //  logo on screen
const T_FLY = 3.45; //   logo flies into the hero, gems scatter
const SHARDS = 16; //    block-break particles per gem on impact

// Per gem (GEMS order): screen x/y in -1..1, depth, base roll.
const LAYOUT_WIDE = [
  [-0.7, 0.5, -6, 0.3], [0.66, 0.58, -2, -0.4], [0.86, 0.02, -12, 0.6], [0.62, -0.52, 4, -0.2],
  [0.3, -0.86, -16, 0.9], [-0.36, -0.86, -14, -0.7], [-0.64, -0.4, 6, 0.5], [-0.88, 0.06, -10, -0.3],
];
const LAYOUT_TALL = [
  [-0.62, 0.8, -6, 0.3], [0.66, 0.84, -2, -0.4], [0.05, 0.93, -18, 0.6], [0.8, 0.52, -10, -0.2],
  [0.55, -0.86, -4, 0.9], [-0.05, -0.92, -16, -0.7], [-0.62, -0.82, 2, 0.5], [-0.82, 0.5, -12, -0.3],
];

type Pose = { x: number; y: number; z: number; s: number; rz: number; ry: number };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutBack = (t: number) => 1 + 2.7 * (t - 1) ** 3 + 1.7 * (t - 1) ** 2;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const easeOutQuart = (t: number) => 1 - (1 - t) ** 4;

function loadPixels(src: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      resolve(ctx.getImageData(0, 0, img.width, img.height));
    };
    img.onerror = reject;
    img.src = src;
  });
}

/** Extrudes a pixel-art texture into voxels, like a held Minecraft item. Hidden faces are skipped. */
function voxelGeometry({ width: w, height: h, data }: ImageData) {
  const solid = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h && data[(y * w + x) * 4 + 3] > 127;
  const pos: number[] = [];
  const nor: number[] = [];
  const col: number[] = [];
  const c = new THREE.Color();
  const D = 0.75;
  const face = (v: number[][], n: number[], shade: number) => {
    for (const i of [0, 1, 2, 0, 2, 3]) {
      pos.push(...v[i]);
      nor.push(...n);
      col.push(c.r * shade, c.g * shade, c.b * shade);
    }
  };
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      if (!solid(x, y)) continue;
      const i = (y * w + x) * 4;
      c.setRGB(data[i] / 255, data[i + 1] / 255, data[i + 2] / 255, THREE.SRGBColorSpace);
      const x0 = x - w / 2, x1 = x0 + 1, y1 = h / 2 - y, y0 = y1 - 1;
      face([[x0, y0, D], [x1, y0, D], [x1, y1, D], [x0, y1, D]], [0, 0, 1], 1);
      face([[x1, y0, -D], [x0, y0, -D], [x0, y1, -D], [x1, y1, -D]], [0, 0, -1], 0.8);
      if (!solid(x - 1, y)) face([[x0, y0, -D], [x0, y0, D], [x0, y1, D], [x0, y1, -D]], [-1, 0, 0], 0.65);
      if (!solid(x + 1, y)) face([[x1, y0, D], [x1, y0, -D], [x1, y1, -D], [x1, y1, D]], [1, 0, 0], 0.65);
      if (!solid(x, y - 1)) face([[x0, y1, D], [x1, y1, D], [x1, y1, -D], [x0, y1, -D]], [0, 1, 0], 0.9);
      if (!solid(x, y + 1)) face([[x0, y0, -D], [x1, y0, -D], [x1, y0, D], [x0, y0, D]], [0, -1, 0], 0.55);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  return g;
}

export default function GemStage() {
  const hostRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<() => void>(() => {});

  useEffect(() => {
    const root = document.documentElement;
    const overlay = overlayRef.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const intro = root.dataset.intro === "playing";
    const mobile = matchMedia("(pointer: coarse)").matches || innerWidth < 760;

    let phase = intro ? "load" : "done";
    const finish = () => {
      phase = "done";
      root.dataset.intro = "done";
      overlay.dataset.phase = "done";
    };

    // A fresh canvas per run: re-running the effect (StrictMode, HMR) must not share a WebGL context.
    const canvas = document.createElement("canvas");
    canvas.className = "stage";
    canvas.setAttribute("aria-hidden", "true");
    hostRef.current!.appendChild(canvas);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      canvas.remove();
      finish(); // no WebGL: the static hero still works
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 1.75));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 200);
    camera.position.z = CAM_Z;
    scene.add(new THREE.AmbientLight(0xffffff, 1.3));
    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.position.set(-20, 30, 50);
    scene.add(sun);

    const world = new THREE.Group();
    scene.add(world);
    // Sparse square "pixels" in the background, no glow.
    const STARS = mobile ? 120 : 260;
    const sp = new Float32Array(STARS * 3);
    for (let i = 0; i < STARS; i++)
      sp.set([(Math.random() - 0.5) * 170, (Math.random() - 0.5) * 110, -80 + Math.random() * 95], i * 3);
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.35, color: 0x8a87a3, transparent: true, opacity: 0.6, depthWrite: false });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    type GemObj = { pivot: THREE.Group; mesh: THREE.Mesh; from: Pose | null; hover: number };
    const gems: GemObj[] = [];
    const disposables: { dispose(): void }[] = [renderer, starGeo, starMat];

    // ----------------------------------------------------------------- layout
    let vw = innerWidth, vh = innerHeight;
    const wpp = () => (2 * CAM_Z * TAN) / vh; // world units per px at z = 0
    const logoPx = () => logoRef.current?.offsetWidth || Math.min(0.56 * Math.min(vw, vh), 520);

    const resize = () => {
      vw = innerWidth;
      vh = innerHeight;
      renderer.setSize(vw, vh, false);
      camera.aspect = vw / vh;
      camera.updateProjectionMatrix();
    };
    resize();

    const heroPose = (i: number, time: number): Pose => {
      const tall = vw / vh < 1.1;
      const [nx, ny, z, roll] = (tall ? LAYOUT_TALL : LAYOUT_WIDE)[i];
      const halfH = TAN * (CAM_Z - z);
      const m = reduced ? 0 : 1;
      return {
        x: nx * halfH * camera.aspect,
        y: ny * halfH + Math.sin(time * 0.9 + i * 1.7) * 0.6 * m,
        z,
        s: ((tall ? 0.11 : 0.15) * 2 * TAN * CAM_Z) / 16,
        rz: roll + Math.sin(time * 0.5 + i) * 0.1 * m,
        ry: reduced ? 0.4 : time * 0.6 + i,
      };
    };

    const introPose = (i: number, t: number): Pose => {
      const L = logoPx() * wpp();
      const rLogo = 0.315 * L, sLogo = (0.27 * L) / 21;
      const theta = Math.PI / 2 - (i * Math.PI) / 4;
      const popA = 0.9 * T_POP;
      const ryA = T_POP * 4 + i * 0.5;
      const ryEnd = Math.ceil(ryA / (2 * Math.PI) + 1) * 2 * Math.PI;
      let r, rot, s, ry;
      if (t < T_POP) {
        const k = clamp01((t - i * 0.08) / 0.75);
        const e = easeOutCubic(k);
        r = lerp(rLogo * 5, rLogo * 1.75, e);
        rot = 0.9 * t - (1 - e) * 2.4;
        s = k > 0 ? sLogo * 1.25 * easeOutBack(clamp01(k * 1.6)) : 0;
        ry = t * 4 + i * 0.5 + (1 - e) * 8;
        return { x: r * Math.cos(theta + rot), y: r * Math.sin(theta + rot), z: lerp(-90, 0, e), s, rz: theta + rot - Math.PI / 4, ry };
      } else {
        const u = clamp01((t - T_POP) / (T_GATHER - T_POP));
        const e = easeInOutCubic(u);
        r = lerp(rLogo * 1.75, rLogo, e); rot = lerp(popA, 4 * Math.PI, e); s = lerp(sLogo * 1.25, sLogo, e);
        ry = lerp(ryA, ryEnd, easeOutCubic(u));
      }
      // The texture's long axis is the 45° diagonal; turn it to point away from the centre like the logo petals.
      return { x: r * Math.cos(theta + rot), y: r * Math.sin(theta + rot), z: 0, s, rz: theta + rot - Math.PI / 4, ry };
    };

    const apply = (g: GemObj, p: Pose) => {
      g.pivot.position.set(p.x, p.y, p.z);
      g.pivot.scale.setScalar(p.s * (1 + g.hover * 0.25));
      g.mesh.rotation.set(0, p.ry, p.rz);
    };

    // ----------------------------------------------------------------- input
    const pointer = { x: 0, y: 0, nx: 0, ny: 0, inside: false };
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX; pointer.y = e.clientY; pointer.inside = true;
      pointer.nx = (e.clientX / vw) * 2 - 1; pointer.ny = (e.clientY / vh) * 2 - 1;
    };
    const onLeave = () => { pointer.inside = false; };
    let hovered = -1;
    const onClick = (e: MouseEvent) => {
      if (hovered < 0 || (e.target as Element).closest("a,button,input,summary,details,[data-no-gem]")) return;
      location.href = `${BASE}/gems/#${GEMS[hovered].id}`;
    };
    addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    addEventListener("click", onClick);
    addEventListener("resize", resize);

    // ----------------------------------------------------------------- intro control
    let start = -1; // performance.now() when the timeline started (textures loaded)
    const setPhase = (p: string) => { phase = p; overlay.dataset.phase = p; };
    const logoEl = logoRef.current!;

    const fly = () => {
      setPhase("fly");
      root.dataset.intro = "reveal"; // hero text fades in while the logo is still flying
      const target = document.getElementById("hero-logo");
      if (!target) return finish();
      const a = logoEl.getBoundingClientRect(), b = target.getBoundingClientRect();
      logoEl.style.transform = `translate(${b.left + b.width / 2 - (a.left + a.width / 2)}px, ${b.top + b.height / 2 - (a.top + a.height / 2)}px) scale(${b.width / a.width})`;
      setTimeout(finish, (T_FLY - T_HOLD) * 1000);
    };
    skipRef.current = () => {
      if (start < 0 || phase === "fly" || phase === "done") return;
      start = performance.now() - T_HOLD * 1000;
    };

    Promise.all(GEMS.map((g) => loadPixels(`${BASE}/gems/${g.id}.png`)))
      .then((images) => {
        images.forEach((img, i) => {
          const geo = voxelGeometry(img);
          const mat = new THREE.MeshLambertMaterial({ vertexColors: true });
          const pivot = new THREE.Group();
          const mesh = new THREE.Mesh(geo, mat);
          pivot.add(mesh);
          world.add(pivot);
          disposables.push(geo, mat);
          // Without the intro (e.g. navigating back to home) gems burst out of the centre instead.
          gems.push({ pivot, mesh, from: intro || reduced ? null : { x: 0, y: 0, z: 0, s: 0, rz: 0, ry: 0 }, hover: 0 });
        });
        start = performance.now() - (intro ? 0 : (reduced ? T_FLY : T_HOLD) * 1000);
        if (intro) setPhase("ring");
      })
      .catch(finish);

    // ----------------------------------------------------------------- impact shards
    const shardGeo = new THREE.BoxGeometry(1, 1, 1);
    const shardMat = new THREE.MeshLambertMaterial();
    const shards = new THREE.InstancedMesh(shardGeo, shardMat, GEMS.length * SHARDS);
    shards.frustumCulled = false;
    disposables.push(shardGeo, shardMat);
    const shardState = Array.from({ length: GEMS.length * SHARDS }, (_, n) => {
      shards.setColorAt(n, new THREE.Color(GEMS[Math.floor(n / SHARDS)].color));
      return { p: new THREE.Vector3(), v: new THREE.Vector3(), age: 1, life: 1, size: 0 };
    });
    const dummy = new THREE.Object3D();
    dummy.scale.setScalar(0);
    dummy.updateMatrix();
    for (let n = 0; n < shardState.length; n++) shards.setMatrixAt(n, dummy.matrix);
    world.add(shards);
    let shake = 0;

    const burst = () => {
      shake = 0.3;
      shardState.forEach((sh, n) => {
        const i = Math.floor(n / SHARDS);
        const p = introPose(i, T_GATHER);
        const dir = Math.atan2(p.y, p.x) + (Math.random() - 0.5) * 1.6;
        const speed = 10 + Math.random() * 22;
        sh.p.set(p.x + (Math.random() - 0.5) * 2, p.y + (Math.random() - 0.5) * 2, 0);
        sh.v.set(Math.cos(dir) * speed, Math.sin(dir) * speed + 6, (Math.random() - 0.3) * 20);
        sh.age = 0;
        sh.life = 0.6 + Math.random() * 0.6;
        sh.size = 0.5 + Math.random() * 0.8;
      });
    };
    const updateShards = (dt: number) => {
      let active = false;
      shardState.forEach((sh, n) => {
        if (sh.age >= sh.life) return;
        active = true;
        sh.age += dt;
        sh.v.y -= 40 * dt;
        sh.v.multiplyScalar(1 - dt * 1.5);
        sh.p.addScaledVector(sh.v, dt);
        dummy.position.copy(sh.p);
        dummy.rotation.set(sh.age * 6, sh.age * 4, 0);
        dummy.scale.setScalar(sh.age >= sh.life ? 0 : sh.size * (1 - sh.age / sh.life));
        dummy.updateMatrix();
        shards.setMatrixAt(n, dummy.matrix);
      });
      if (active) shards.instanceMatrix.needsUpdate = true;
    };

    // ----------------------------------------------------------------- loop
    let raf = 0;
    let last = performance.now();
    const t0 = last;
    const v = new THREE.Vector3();

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const time = (now - t0) / 1000;
      const scroll = Math.min(scrollY / vh, 1.5);

      if (start >= 0) {
        const t = (performance.now() - start) / 1000;
        if (phase === "ring" && t >= T_POP) setPhase("gather");
        if (phase === "gather" && t >= T_GATHER) {
          setPhase("logo");
          flashRef.current?.classList.remove("on");
          void flashRef.current?.offsetWidth;
          flashRef.current?.classList.add("on");
          burst();
        }
        if (phase === "logo" && t >= T_HOLD) fly();

        const u = easeOutQuart(clamp01((t - T_HOLD) / (T_FLY - T_HOLD)));
        gems.forEach((g, i) => {
          const hp = heroPose(i, time);
          let p = hp;
          if (t < T_HOLD) p = introPose(i, t);
          else if (u < 1) {
            const f = g.from ?? introPose(i, T_GATHER);
            p = { x: lerp(f.x, hp.x, u), y: lerp(f.y, hp.y, u), z: lerp(f.z, hp.z, u), s: lerp(f.s, hp.s, u), rz: lerp(f.rz, hp.rz, u), ry: lerp(f.ry, hp.ry, u) };
          }
          apply(g, p);
        });
      }

      // Hover: the gem nearest the cursor, only in the hero.
      hovered = -1;
      if (phase === "done" && pointer.inside && scroll < 0.6) {
        let best = Infinity;
        gems.forEach((g, i) => {
          g.pivot.getWorldPosition(v);
          const depth = CAM_Z - v.z;
          v.project(camera);
          const sx = ((v.x + 1) / 2) * vw, sy = ((1 - v.y) / 2) * vh;
          const radius = ((g.pivot.scale.x * 9) / (2 * depth * TAN)) * vh;
          const d = Math.hypot(sx - pointer.x, sy - pointer.y);
          if (d < radius && d < best) { best = d; hovered = i; }
        });
      }
      gems.forEach((g, i) => {
        g.hover += ((i === hovered ? 1 : 0) - g.hover) * Math.min(1, dt * 10);
      });
      document.body.classList.toggle("gem-hover", hovered >= 0);
      const tip = tipRef.current;
      if (tip) {
        if (hovered >= 0) {
          const g = gems[hovered];
          g.pivot.getWorldPosition(v).project(camera);
          tip.style.transform = `translate(${((v.x + 1) / 2) * vw}px, ${((1 - v.y) / 2) * vh}px)`;
          if (tip.dataset.gem !== GEMS[hovered].id) {
            tip.dataset.gem = GEMS[hovered].id;
            tip.style.setProperty("--c", GEMS[hovered].color);
            tip.firstElementChild!.textContent = GEMS[hovered].name;
            tip.lastElementChild!.textContent = GEMS[hovered].tagline;
          }
          tip.classList.add("on");
        } else tip.classList.remove("on");
      }

      // Parallax + scroll-away. Nothing is drawn once the hero is off screen.
      const m = reduced ? 0 : 1;
      world.rotation.y += (pointer.nx * 0.12 * m - world.rotation.y) * Math.min(1, dt * 3);
      world.rotation.x += (pointer.ny * 0.08 * m - world.rotation.x) * Math.min(1, dt * 3);
      stars.rotation.z = time * 0.01 * m;
      camera.position.y = -scroll * 12;
      updateShards(dt);
      shake = Math.max(0, shake - dt);
      camera.position.x = pointer.nx * 1.5 * m + (Math.random() - 0.5) * shake * 4;
      camera.position.y += (Math.random() - 0.5) * shake * 4;
      camera.lookAt(0, camera.position.y * 0.6, 0);
      renderer.domElement.style.opacity = String(clamp01(1 - scroll * 0.9));
      if (scroll < 1.1 || phase !== "done") renderer.render(scene, camera);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      removeEventListener("click", onClick);
      removeEventListener("resize", resize);
      document.body.classList.remove("gem-hover");
      disposables.forEach((d) => d.dispose());
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, []);

  return (
    <>
      <div ref={hostRef} />
      <div ref={overlayRef} className="intro" data-phase="load" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={logoRef} className="intro-logo" src={`${BASE}/logo.webp`} alt="" width={640} height={640} fetchPriority="high" />
        <div ref={flashRef} className="flash" />
        <button type="button" className="btn btn-stone skip" onClick={() => skipRef.current()}>Пропустити</button>
      </div>
      <div ref={tipRef} className="gem-tip" aria-hidden="true"><b /><span /></div>
    </>
  );
}
