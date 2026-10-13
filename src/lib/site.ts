// Everything the site says about the server lives here.

export const SITE = {
  name: "Reafisel",
  url: process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000",
  ip: "play.reafisel.net",
  version: "Java 1.21+",
};

export type Gem = {
  id: string;
  name: string;
  color: string;
  tagline: string;
  passives: string[];
  abilities: string[];
};

// Order = clockwise from the top petal of the logo (the intro lands each gem on its petal).
export const GEMS: Gem[] = [
  {
    id: "strength",
    name: "Strength",
    color: "#ff3b3b",
    tagline: "Чим менше в тебе здоров'я, тим сильніше б'єш.",
    passives: ["Постійна Сила", "Bloodthorns: до +3 сердець шкоди при низькому HP"],
    abilities: ["Nullify", "Frailer", "Shadow Stalker", "Chad Strength"],
  },
  {
    id: "life",
    name: "Life",
    color: "#ff2db4",
    tagline: "Поступово лікує тебе і робить золоті яблука сильнішими.",
    passives: ["Відновлює серця з часом", "x2-3 шкоди нежиті", "Сильніші золоті яблука"],
    abilities: ["Circle of Life", "Heart Lock", "Vitality Vortex", "Drainer"],
  },
  {
    id: "astra",
    name: "Astra",
    color: "#a64dff",
    tagline: "Частина ударів проходить крізь тебе, а за кілли даються додаткові серця.",
    passives: ["Шанс пропустити удар крізь себе", "Soul Absorption: бонусні серця за кілл", "Soul Guard рятує на 2 серцях"],
    abilities: ["Astral Daggers", "Astral Projection", "Dimensional Void", "Unbounded"],
  },
  {
    id: "flux",
    name: "Flux",
    color: "#2fd8f0",
    tagline: "Стріли, що оглушують, і промінь, який може ваншотнути оглушеного гравця.",
    passives: ["Шокові стріли оглушують ціль", "Flow State: прискорення", "Імунітет до заряджених кріперів"],
    abilities: ["Flux Beam", "Kinetic Burst", "Flashbang", "Conduction"],
  },
  {
    id: "wealth",
    name: "Wealth",
    color: "#2ee66b",
    tagline: "Твоя броня лагодиться в бою, а ворожа зношується швидше.",
    passives: ["Удача і знижки у жителів", "Броня лагодиться з кожним ударом", "Знімає міцність ворожої броні"],
    abilities: ["Pockets", "Item Lock", "Unfortunate", "Rich Rush"],
  },
  {
    id: "puff",
    name: "Puff",
    color: "#e8ecf2",
    tagline: "Подвійний стрибок, без шкоди від падіння, а кожен, кого вдариш, відлітає.",
    passives: ["Подвійний стрибок", "Без шкоди від падіння", "Підкидає гравців, яких б'єш"],
    abilities: ["Dash", "Breezy Bash", "Group Bash"],
  },
  {
    id: "speed",
    name: "Speed",
    color: "#ffd60a",
    tagline: "Постійна Швидкість, і пісок душ тебе не сповільнює.",
    passives: ["Швидкість I-II", "Пісок душ не сповільнює"],
    abilities: ["Blur", "Speed Storm", "Sedative", "Terminal Velocity"],
  },
  {
    id: "fire",
    name: "Fire",
    color: "#ff8a1f",
    tagline: "Вогонь тобі не страшний, а ще є фаєрбол і метеоритний дощ.",
    passives: ["Вогнестійкість", "Автоплавка руд"],
    abilities: ["Fireball", "Cozy Campfire", "Crisp", "Meteor Shower"],
  },
];

export const FEATURES = [
  { icon: "speed", title: "Миттєвий FFA", text: "Жодних черг. Заходиш, отримуєш кіт і йдеш на арену." },
  { icon: "strength", title: "Дуелі 1 на 1", text: "Пиши /duel і нік, якщо хочеш розібратися один на один." },
  { icon: "fire", title: "Аірдропи", text: "Час від часу на карту падає дроп із лутом. Його видно по променю, тож гостей буде багато." },
  { icon: "wealth", title: "Кейси", text: "За кожен кілл даються ключі від кейсів. Всередині спорядження і косметика." },
  { icon: "astra", title: "Рівні та престиж", text: "Кілли і перемоги в дуелях дають досвід. На 50 рівні можна зробити /prestige і отримати зірку біля ніку." },
  { icon: "life", title: "Щоденні квести", text: "Нові завдання щодня, нагорода в шардах." },
  { icon: "flux", title: "Ротація карт", text: "Арена змінюється кожні 30 хвилин, наступну обирають гравці голосуванням." },
  { icon: "puff", title: "Модерація", text: "Побачив чітера? Напиши /report, і стафф розбереться." },
];

export const ARENAS = [
  { id: "colosseum", name: "Колізей", color: "#f6c177", text: "Руїни з пісковику навколо відкритого центру, річка ділить карту навпіл. Більшість бійок закінчується на мостах." },
  { id: "jungle", name: "Руїни джунглів", color: "#4ade80", text: "Зарослі храми, ставки й купа дерев, за якими можна сховатися. Це працює і на тебе, і проти тебе." },
  { id: "nether", name: "Пекельна фортеця", color: "#ff4d6d", text: "Пекельний камінь, лавові озера і кілька веж. У лаву падають частіше, ніж здається." },
  { id: "frost", name: "Мороз", color: "#a5f3fc", text: "Сніг і лід із замерзлим каньйоном посередині. Сховатися майже ніде." },
];

export const RANKS = [
  {
    name: "Spark",
    gem: "speed",
    color: "#ffb000",
    perks: ["Значок Spark у чаті й табі", "6 захищених слотів ендер-скрині", "+10% шардів", "Ексклюзивний слід Spark", "Косметика 1 рівня"],
    note: "Можна отримати в грі за 50 000 шардів",
  },
  {
    name: "Prism",
    gem: "flux",
    color: "#5ce1e6",
    perks: ["Значок Prism у чаті й табі", "9 захищених слотів", "+25% шардів", "Ексклюзивний райдужний слід", "Косметика 1-2 рівня"],
  },
  {
    name: "Nova",
    gem: "life",
    color: "#ff6ad5",
    perks: ["Значок Nova у чаті й табі", "18 захищених слотів", "+50% шардів", "Ексклюзивний ефект кілла Supernova", "Оголошення про вхід, вхід на повні сервери", "Косметика 1-3 рівня"],
  },
  {
    name: "Eclipse",
    gem: "fire",
    color: "#ffc94d",
    perks: ["Значок Eclipse у чаті й табі", "Усі 27 слотів захищені", "x2 шардів", "Аура Eclipse і Корона дракона", "Оголошення про вхід, вхід на повні сервери", "Уся косметика відкрита"],
  },
];

export const RULES = {
  game: [
    "Ніяких читів, макросів і нечесних модів (x-ray, killaura, автоклікер…).",
    "Не юзай баги. Знайшов баг — повідом через /report.",
    "Ніяких тім у FFA-аренах.",
    "Не продавай акаунти чи предмети за реальні гроші.",
    "Рішення стаффу остаточні. Не згоден — подай апеляцію.",
  ],
  chat: [
    "Поважай інших. Ніяких образ, хейту і дискримінації.",
    "Без спаму, флуду і капсу.",
    "Не рекламуй інші сервери.",
    "Ніякого NSFW, включно з ніками і скінами.",
    "Не видавай себе за стафф.",
  ],
};

export const FAQ = [
  { q: "Яка версія потрібна?", a: "Minecraft Java Edition 1.21 або новіша. Рекомендуємо 1.21.11." },
  { q: "Грати безкоштовно?", a: "Так. Ранги необов'язкові." },
  { q: "Як отримати гем?", a: "Його дають при першому вході. Кілли заряджають гем енергією, смерті забирають її, а гем на нулі ламається." },
  { q: "Як поскаржитися на чітера?", a: "Напиши в грі /report і нік гравця. Стафф перевірить." },
  { q: "Можна потрапити в стафф?", a: "Так, набір у Модератори, Хелпери, Білдери і Медіа час від часу відкривається. Слідкуй за оголошеннями на сервері." },
];
