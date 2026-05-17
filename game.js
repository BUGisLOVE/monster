const canvas = document.querySelector("#worldCanvas");
const ctx = canvas.getContext("2d");

const ui = {
  stageText: document.querySelector("#stageText"),
  modeText: document.querySelector("#modeText"),
  growthMeter: document.querySelector("#growthMeter"),
  growthText: document.querySelector("#growthText"),
  healthMeter: document.querySelector("#healthMeter"),
  healthText: document.querySelector("#healthText"),
  staminaMeter: document.querySelector("#staminaMeter"),
  staminaText: document.querySelector("#staminaText"),
  essenceText: document.querySelector("#essenceText"),
  monsterText: document.querySelector("#monsterText"),
  logList: document.querySelector("#logList"),
  careButton: document.querySelector("#careButton"),
  mountButton: document.querySelector("#mountButton"),
  flyButton: document.querySelector("#flyButton"),
  emberButton: document.querySelector("#emberButton"),
  gustButton: document.querySelector("#gustButton"),
  fireballButton: document.querySelector("#fireballButton"),
  roarButton: document.querySelector("#roarButton"),
};

const WORLD = { w: 4400, h: 3200 };
const CENTER = { x: WORLD.w * 0.5, y: WORLD.h * 0.5 };
const DPR_LIMIT = 2;

const terrainRegions = [
  {
    id: "sunfield",
    name: "황금 꽃 들판",
    x: 980,
    y: 2440,
    rx: 760,
    ry: 500,
    rot: -0.18,
    fill: "rgba(238, 195, 88, 0.2)",
    rim: "rgba(255, 234, 146, 0.3)",
    accent: "#f2c15b",
  },
  {
    id: "crystal",
    name: "푸른 수정숲",
    x: 3500,
    y: 1120,
    rx: 710,
    ry: 470,
    rot: 0.24,
    fill: "rgba(86, 210, 197, 0.18)",
    rim: "rgba(176, 245, 255, 0.25)",
    accent: "#55d2c5",
  },
  {
    id: "marsh",
    name: "안개 습지",
    x: 660,
    y: 720,
    rx: 620,
    ry: 430,
    rot: 0.12,
    fill: "rgba(65, 107, 101, 0.24)",
    rim: "rgba(153, 222, 201, 0.18)",
    accent: "#7ed4b2",
  },
  {
    id: "frost",
    name: "서리 능선",
    x: 3380,
    y: 2540,
    rx: 700,
    ry: 420,
    rot: -0.33,
    fill: "rgba(190, 226, 255, 0.22)",
    rim: "rgba(243, 253, 255, 0.33)",
    accent: "#b8e8ff",
  },
  {
    id: "ruins",
    name: "고대 폐허",
    x: 2220,
    y: 610,
    rx: 660,
    ry: 390,
    rot: -0.06,
    fill: "rgba(145, 126, 105, 0.2)",
    rim: "rgba(255, 230, 190, 0.18)",
    accent: "#c6a47a",
  },
];

const dragonColorThemes = [
  {
    name: "오팔",
    outline: "#6079b7",
    bodyLight: "#fbffff",
    bodyMid: "#c9f6ec",
    bodyDeep: "#9fa9ff",
    bodyShadow: "#7d77d9",
    belly: "#fff1bd",
    wingA: "rgba(128, 231, 244, 0.88)",
    wingB: "rgba(184, 151, 255, 0.82)",
    tailTip: "rgba(185, 151, 255, 0.82)",
    horn: "#fff2a9",
    crystal: "#9ff5ff",
    eye: "#ffe48d",
    auraMid: "126, 231, 244",
    auraEdge: "184, 151, 255",
    spots: ["#fff7bd", "#bffcff", "#d8c8ff", "#fff7bd", "#bffcff"],
  },
  {
    name: "루비",
    outline: "#8b3d65",
    bodyLight: "#fff0f3",
    bodyMid: "#ff9cb3",
    bodyDeep: "#b7386d",
    bodyShadow: "#74337f",
    belly: "#ffd7a8",
    wingA: "rgba(255, 126, 148, 0.88)",
    wingB: "rgba(255, 198, 110, 0.82)",
    tailTip: "rgba(255, 110, 126, 0.84)",
    horn: "#ffe1a3",
    crystal: "#ff86c0",
    eye: "#ffe86f",
    auraMid: "255, 126, 148",
    auraEdge: "255, 198, 110",
    spots: ["#ffe1a3", "#ffbfd1", "#ffc46f", "#fff1bd", "#ff9dc6"],
  },
  {
    name: "사파이어",
    outline: "#365c9f",
    bodyLight: "#eff9ff",
    bodyMid: "#77c8ff",
    bodyDeep: "#486ee2",
    bodyShadow: "#3942a6",
    belly: "#d7f6ff",
    wingA: "rgba(96, 200, 255, 0.88)",
    wingB: "rgba(100, 124, 255, 0.82)",
    tailTip: "rgba(98, 175, 255, 0.84)",
    horn: "#ecfbff",
    crystal: "#7ee8ff",
    eye: "#fff4a4",
    auraMid: "96, 200, 255",
    auraEdge: "100, 124, 255",
    spots: ["#d7f6ff", "#8df1ff", "#aebfff", "#fff4a4", "#77c8ff"],
  },
  {
    name: "에메랄드",
    outline: "#2f806f",
    bodyLight: "#f0fff8",
    bodyMid: "#76e0ad",
    bodyDeep: "#2ca36e",
    bodyShadow: "#236b79",
    belly: "#f6ffc8",
    wingA: "rgba(104, 231, 185, 0.88)",
    wingB: "rgba(134, 214, 116, 0.82)",
    tailTip: "rgba(80, 220, 160, 0.84)",
    horn: "#fff2a9",
    crystal: "#8bffd8",
    eye: "#ffef7a",
    auraMid: "104, 231, 185",
    auraEdge: "134, 214, 116",
    spots: ["#fff2a9", "#b4ffd8", "#8ff0ab", "#e8ffbd", "#86f4cb"],
  },
  {
    name: "자수정",
    outline: "#6a55a5",
    bodyLight: "#fff4ff",
    bodyMid: "#d39cff",
    bodyDeep: "#8756dd",
    bodyShadow: "#553c9f",
    belly: "#ffe8c7",
    wingA: "rgba(211, 156, 255, 0.88)",
    wingB: "rgba(112, 221, 255, 0.82)",
    tailTip: "rgba(194, 130, 255, 0.84)",
    horn: "#fff0b8",
    crystal: "#d7a4ff",
    eye: "#fff06e",
    auraMid: "211, 156, 255",
    auraEdge: "112, 221, 255",
    spots: ["#fff0b8", "#e2c0ff", "#a8f2ff", "#ffd1ef", "#d39cff"],
  },
];

const dragonPalette = dragonColorThemes[Math.floor(Math.random() * dragonColorThemes.length)];

const dragonForms = {
  hatchling: {
    tailLength: 92,
    tailHeight: 13,
    bodyX: 47,
    bodyY: 36,
    bellyX: 29,
    bellyY: 18,
    neckX: 56,
    neckY: 22,
    neckCx: 52,
    headX: 25,
    headY: 23,
    headCx: 76,
    wingScale: 0.48,
    wingAlpha: 0.72,
    hornScale: 0.25,
    crystalScale: 0.36,
    crystalCount: 3,
    legScale: 0.58,
    spotScale: 0.82,
    cheekFin: 0,
    tailFin: 0.35,
    whisker: false,
    crown: false,
    aura: 0.75,
  },
  young: {
    tailLength: 128,
    tailHeight: 17,
    bodyX: 57,
    bodyY: 39,
    bellyX: 35,
    bellyY: 19,
    neckX: 67,
    neckY: 26,
    neckCx: 64,
    headX: 28,
    headY: 22,
    headCx: 90,
    wingScale: 0.84,
    wingAlpha: 0.82,
    hornScale: 0.58,
    crystalScale: 0.7,
    crystalCount: 5,
    legScale: 0.82,
    spotScale: 1,
    cheekFin: 0.55,
    tailFin: 0.66,
    whisker: false,
    crown: false,
    aura: 0.95,
  },
  adult: {
    tailLength: 166,
    tailHeight: 22,
    bodyX: 66,
    bodyY: 42,
    bellyX: 40,
    bellyY: 19,
    neckX: 74,
    neckY: 29,
    neckCx: 72,
    headX: 29,
    headY: 23,
    headCx: 96,
    wingScale: 1.18,
    wingAlpha: 0.9,
    hornScale: 1,
    crystalScale: 1,
    crystalCount: 6,
    legScale: 1,
    spotScale: 1.1,
    cheekFin: 0.9,
    tailFin: 0.95,
    whisker: true,
    crown: false,
    aura: 1.18,
  },
  ancient: {
    tailLength: 205,
    tailHeight: 26,
    bodyX: 75,
    bodyY: 46,
    bellyX: 45,
    bellyY: 21,
    neckX: 82,
    neckY: 32,
    neckCx: 80,
    headX: 32,
    headY: 25,
    headCx: 104,
    wingScale: 1.42,
    wingAlpha: 0.96,
    hornScale: 1.34,
    crystalScale: 1.32,
    crystalCount: 8,
    legScale: 1.16,
    spotScale: 1.22,
    cheekFin: 1.12,
    tailFin: 1.25,
    whisker: true,
    crown: true,
    aura: 1.5,
  },
};

const stages = [
  {
    id: "egg",
    name: "희귀 알",
    at: 0,
    next: 16,
    scale: 0.9,
    maxHp: 90,
    stamina: 80,
    ride: false,
    fly: false,
    skills: [],
  },
  {
    id: "hatchling",
    name: "희귀 새끼 드래곤",
    at: 16,
    next: 44,
    scale: 0.72,
    maxHp: 120,
    stamina: 95,
    ride: false,
    fly: false,
    skills: ["ember"],
  },
  {
    id: "young",
    name: "희귀 어린 드래곤",
    at: 44,
    next: 86,
    scale: 1.05,
    maxHp: 170,
    stamina: 115,
    ride: true,
    fly: false,
    skills: ["ember", "gust"],
  },
  {
    id: "adult",
    name: "희귀 청년 드래곤",
    at: 86,
    next: 145,
    scale: 1.38,
    maxHp: 230,
    stamina: 145,
    ride: true,
    fly: true,
    skills: ["ember", "gust", "fireball"],
  },
  {
    id: "ancient",
    name: "고대 희귀 드래곤",
    at: 145,
    next: Infinity,
    scale: 1.75,
    maxHp: 310,
    stamina: 180,
    ride: true,
    fly: true,
    skills: ["ember", "gust", "fireball", "roar"],
  },
];

const skillDefs = {
  ember: {
    button: ui.emberButton,
    label: "불씨",
    cooldown: 420,
    stamina: 4,
    damage: 24,
    speed: 780,
    radius: 14,
    color: "#ffb85c",
  },
  gust: {
    button: ui.gustButton,
    label: "날개바람",
    cooldown: 1800,
    stamina: 18,
    damage: 18,
    range: 220,
    color: "#b6fbff",
  },
  fireball: {
    button: ui.fireballButton,
    label: "화염구",
    cooldown: 1400,
    stamina: 14,
    damage: 48,
    speed: 640,
    radius: 54,
    color: "#ff6938",
  },
  roar: {
    button: ui.roarButton,
    label: "포효",
    cooldown: 4200,
    stamina: 28,
    damage: 28,
    range: 330,
    color: "#f2c15b",
  },
};

const monsterTypes = [
  {
    id: "shadow",
    name: "그림자 몬스터",
    hp: 46,
    speed: 56,
    damage: 8,
    size: 23,
    essence: 2,
    age: 1.7,
    color: "#3a4356",
    accent: "#9a72ff",
  },
  {
    id: "thorn",
    name: "가시 몬스터",
    hp: 68,
    speed: 44,
    damage: 12,
    size: 27,
    essence: 3,
    age: 2.4,
    color: "#71523f",
    accent: "#f2a65b",
  },
  {
    id: "stone",
    name: "바위 몬스터",
    hp: 118,
    speed: 30,
    damage: 18,
    size: 35,
    essence: 5,
    age: 3.7,
    color: "#59666c",
    accent: "#91d1c8",
  },
  {
    id: "wisp",
    name: "수정 몬스터",
    hp: 54,
    speed: 68,
    damage: 10,
    size: 24,
    essence: 4,
    age: 2.8,
    color: "#3f7d9e",
    accent: "#b6fbff",
  },
  {
    id: "frost",
    name: "서리 몬스터",
    hp: 82,
    speed: 38,
    damage: 15,
    size: 30,
    essence: 4,
    age: 3.1,
    color: "#d9f2ff",
    accent: "#8ba8ff",
  },
];

const state = {
  last: performance.now(),
  elapsed: 0,
  essence: 0,
  mounted: false,
  flying: false,
  altitude: 0,
  shake: 0,
  log: [],
  selectedTarget: null,
  dragTarget: null,
};

const camera = {
  x: 0,
  y: 0,
  w: window.innerWidth,
  h: window.innerHeight,
};

const pointer = {
  screenX: window.innerWidth * 0.5,
  screenY: window.innerHeight * 0.5,
  worldX: CENTER.x,
  worldY: CENTER.y,
  down: false,
  activeId: null,
  dragging: false,
  dragStartX: 0,
  dragStartY: 0,
  dragWorldX: CENTER.x,
  dragWorldY: CENTER.y,
};

const player = {
  x: CENTER.x - 130,
  y: CENTER.y + 80,
  radius: 18,
  hp: 100,
  maxHp: 100,
  speed: 178,
  facing: 0,
  invuln: 0,
  target: null,
};

const dragon = {
  x: CENTER.x,
  y: CENTER.y,
  radius: 46,
  age: 0,
  hp: stages[0].maxHp,
  maxHp: stages[0].maxHp,
  stamina: stages[0].stamina,
  maxStamina: stages[0].stamina,
  stageIndex: 0,
  facing: -Math.PI * 0.5,
  cooldowns: {},
  followLag: 0,
};

const keys = new Set();
const decorations = [];
const lakes = [];
const pools = [];
const monsters = [];
const projectiles = [];
const particles = [];
const floatingTexts = [];
const clouds = [];

function mulberry32(seed) {
  return function nextRandom() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(1327);

function random(min, max) {
  return rand() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function regionContains(region, x, y) {
  const cos = Math.cos(-region.rot);
  const sin = Math.sin(-region.rot);
  const dx = x - region.x;
  const dy = y - region.y;
  const localX = dx * cos - dy * sin;
  const localY = dx * sin + dy * cos;
  return (localX * localX) / (region.rx * region.rx) + (localY * localY) / (region.ry * region.ry) <= 1;
}

function randomPointInRegion(region) {
  const angle = random(0, Math.PI * 2);
  const radius = Math.sqrt(rand());
  const localX = Math.cos(angle) * region.rx * radius;
  const localY = Math.sin(angle) * region.ry * radius;
  const cos = Math.cos(region.rot);
  const sin = Math.sin(region.rot);
  return {
    x: clamp(region.x + localX * cos - localY * sin, 70, WORLD.w - 70),
    y: clamp(region.y + localX * sin + localY * cos, 70, WORLD.h - 70),
  };
}

function getRegionAt(x, y) {
  return terrainRegions.find((region) => regionContains(region, x, y)) || null;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function angleTo(a, b) {
  return Math.atan2(b.y - a.y, b.x - a.x);
}

function getStage() {
  return stages[dragon.stageIndex];
}

function getStageForAge(age) {
  for (let i = stages.length - 1; i >= 0; i -= 1) {
    if (age >= stages[i].at) return i;
  }
  return 0;
}

function hasSkill(id) {
  return getStage().skills.includes(id);
}

function getDragonForm(stage = getStage()) {
  return dragonForms[stage.id] || dragonForms.adult;
}

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, DPR_LIMIT);
  camera.w = window.innerWidth;
  camera.h = window.innerHeight;
  canvas.width = Math.floor(camera.w * dpr);
  canvas.height = Math.floor(camera.h * dpr);
  canvas.style.width = `${camera.w}px`;
  canvas.style.height = `${camera.h}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function createWorld() {
  for (let i = 0; i < 1250; i += 1) {
    const x = random(0, WORLD.w);
    const y = random(0, WORLD.h);
    const region = getRegionAt(x, y);
    decorations.push({
      type: "grass",
      x,
      y,
      r: random(3, 9),
      rot: random(-0.8, 0.8),
      color: region
        ? rand() > 0.5
          ? region.accent
          : "#8bd882"
        : rand() > 0.5
          ? "#4d965c"
          : "#6db873",
    });
  }

  for (let i = 0; i < 260; i += 1) {
    decorations.push({
      type: "flower",
      x: random(70, WORLD.w - 70),
      y: random(70, WORLD.h - 70),
      r: random(3, 7),
      color: rand() > 0.48 ? "#f2c15b" : "#f57967",
    });
  }

  for (let i = 0; i < 145; i += 1) {
    decorations.push({
      type: "rock",
      x: random(80, WORLD.w - 80),
      y: random(80, WORLD.h - 80),
      r: random(12, 28),
      color: rand() > 0.5 ? "#8b9b91" : "#6f827a",
    });
  }

  for (let i = 0; i < 110; i += 1) {
    const edgeBias = rand();
    decorations.push({
      type: "tree",
      x: edgeBias < 0.5 ? random(60, WORLD.w - 60) : random(80, WORLD.w - 80),
      y: edgeBias < 0.5 ? random(60, 520) : random(WORLD.h - 560, WORLD.h - 70),
      r: random(26, 48),
      color: rand() > 0.5 ? "#2f6d47" : "#36784c",
    });
  }

  for (let i = 0; i < 18; i += 1) {
    decorations.push({
      type: "crystal",
      x: random(170, WORLD.w - 170),
      y: random(160, WORLD.h - 160),
      r: random(16, 34),
      color: rand() > 0.5 ? "#55d2c5" : "#85c8f6",
    });
  }

  terrainRegions.forEach((region) => {
    if (region.id === "sunfield") {
      for (let i = 0; i < 190; i += 1) {
        const p = randomPointInRegion(region);
        decorations.push({
          type: "flower",
          x: p.x,
          y: p.y,
          r: random(4, 9),
          color: rand() > 0.48 ? "#ffd86f" : "#ff8f6f",
        });
      }
      for (let i = 0; i < 44; i += 1) {
        const p = randomPointInRegion(region);
        decorations.push({ type: "spark", x: p.x, y: p.y, r: random(4, 9), color: "#ffe59b" });
      }
    }

    if (region.id === "crystal") {
      for (let i = 0; i < 62; i += 1) {
        const p = randomPointInRegion(region);
        decorations.push({
          type: "crystal",
          x: p.x,
          y: p.y,
          r: random(18, 46),
          color: rand() > 0.42 ? "#55d2c5" : "#8ba8ff",
        });
      }
      for (let i = 0; i < 30; i += 1) {
        const p = randomPointInRegion(region);
        decorations.push({ type: "spark", x: p.x, y: p.y, r: random(4, 8), color: "#c7fbff" });
      }
    }

    if (region.id === "marsh") {
      for (let i = 0; i < 11; i += 1) {
        const p = randomPointInRegion(region);
        pools.push({
          x: p.x,
          y: p.y,
          rx: random(48, 112),
          ry: random(24, 56),
          rot: random(-0.5, 0.5),
        });
      }
      for (let i = 0; i < 115; i += 1) {
        const p = randomPointInRegion(region);
        const kind = rand() > 0.26 ? "reed" : "mushroom";
        decorations.push({
          type: kind,
          x: p.x,
          y: p.y,
          r: random(8, 22),
          color: kind === "reed" ? (rand() > 0.5 ? "#88c99f" : "#b7dfb0") : rand() > 0.5 ? "#b75b7d" : "#6ea8ce",
        });
      }
    }

    if (region.id === "frost") {
      for (let i = 0; i < 70; i += 1) {
        const p = randomPointInRegion(region);
        decorations.push({
          type: "ice",
          x: p.x,
          y: p.y,
          r: random(14, 36),
          color: rand() > 0.46 ? "#c9f5ff" : "#93caff",
        });
      }
      for (let i = 0; i < 85; i += 1) {
        const p = randomPointInRegion(region);
        decorations.push({
          type: "grass",
          x: p.x,
          y: p.y,
          r: random(4, 11),
          rot: random(-0.6, 0.6),
          color: rand() > 0.5 ? "#d4f7ff" : "#a9d8f8",
        });
      }
    }

    if (region.id === "ruins") {
      for (let i = 0; i < 28; i += 1) {
        const p = randomPointInRegion(region);
        decorations.push({
          type: "ruin",
          x: p.x,
          y: p.y,
          r: random(26, 58),
          rot: random(-0.55, 0.55),
          color: rand() > 0.5 ? "#b89a73" : "#8f8172",
        });
      }
      for (let i = 0; i < 70; i += 1) {
        const p = randomPointInRegion(region);
        decorations.push({
          type: "rock",
          x: p.x,
          y: p.y,
          r: random(12, 32),
          color: rand() > 0.5 ? "#9f9182" : "#766c64",
        });
      }
    }
  });

  lakes.push(
    { x: 720, y: 680, rx: 210, ry: 120 },
    { x: WORLD.w - 650, y: WORLD.h - 620, rx: 250, ry: 145 },
    { x: 1820, y: 2360, rx: 150, ry: 82 },
  );

  for (let i = 0; i < 24; i += 1) spawnMonster();
  for (let i = 0; i < 9; i += 1) {
    clouds.push({
      x: random(0, WORLD.w),
      y: random(0, WORLD.h),
      r: random(55, 105),
      speed: random(7, 18),
      drift: random(-0.25, 0.25),
    });
  }
}

function spawnMonster() {
  const stage = getStage();
  const bias = dragon.age > 95 ? 0.72 : dragon.age > 48 ? 0.45 : 0.18;
  const roll = rand();
  let type = roll < bias * 0.35 ? monsterTypes[2] : roll < bias ? monsterTypes[1] : monsterTypes[0];
  let x = 0;
  let y = 0;
  let tries = 0;

  do {
    x = random(120, WORLD.w - 120);
    y = random(120, WORLD.h - 120);
    tries += 1;
  } while (tries < 30 && Math.hypot(x - CENTER.x, y - CENTER.y) < 520);

  const region = getRegionAt(x, y);
  if (region?.id === "crystal" && rand() > 0.34) type = monsterTypes.find((monster) => monster.id === "wisp") || type;
  if (region?.id === "frost" && rand() > 0.32) type = monsterTypes.find((monster) => monster.id === "frost") || type;
  if (region?.id === "ruins" && rand() > 0.55) type = monsterTypes.find((monster) => monster.id === "stone") || type;

  const levelBoost = Math.max(0, stage.scale - 1) * 0.32;
  monsters.push({
    type,
    x,
    y,
    vx: 0,
    vy: 0,
    hp: Math.round(type.hp * (1 + levelBoost)),
    maxHp: Math.round(type.hp * (1 + levelBoost)),
    size: type.size,
    stun: 0,
    attack: 0,
    hitFlash: 0,
    phase: random(0, Math.PI * 2),
  });
}

function addLog(title, body) {
  state.log.unshift({ title, body });
  state.log = state.log.slice(0, 8);
  renderLog();
}

function renderLog() {
  ui.logList.innerHTML = state.log
    .map((entry) => `<div class="log-entry"><strong>${entry.title}</strong>${entry.body}</div>`)
    .join("");
}

function addFloatingText(x, y, text, color = "#fff") {
  floatingTexts.push({ x, y, text, color, life: 1, vy: -34 });
}

function addParticles(x, y, count, color, spread = 120, size = 4) {
  for (let i = 0; i < count; i += 1) {
    const a = random(0, Math.PI * 2);
    const speed = random(spread * 0.25, spread);
    particles.push({
      x,
      y,
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed,
      r: random(size * 0.45, size),
      color,
      life: random(0.35, 0.85),
      maxLife: 0.85,
    });
  }
}

function unlockStageIfNeeded() {
  const nextIndex = getStageForAge(dragon.age);
  if (nextIndex === dragon.stageIndex) return;

  const previous = getStage();
  dragon.stageIndex = nextIndex;
  const stage = getStage();
  const oldMaxHp = dragon.maxHp;
  dragon.maxHp = stage.maxHp;
  dragon.maxStamina = stage.stamina;
  dragon.hp = Math.min(dragon.maxHp, dragon.hp + stage.maxHp - oldMaxHp + 30);
  dragon.stamina = Math.min(dragon.maxStamina, dragon.stamina + 28);
  state.shake = Math.max(state.shake, 8);
  addParticles(dragon.x, dragon.y, 48, stage.id === "hatchling" ? "#ffd979" : "#ff7b4f", 210, 7);

  if (previous.id === "egg" && stage.id === "hatchling") {
    addLog("희귀 탄생", `${dragonPalette.name}빛 비늘을 가진 새끼 드래곤이 태어났어요.`);
    addFloatingText(dragon.x, dragon.y - 45, "태어남", "#ffd979");
    return;
  }

  const skill = stage.skills[stage.skills.length - 1];
  const skillText = skill ? ` ${skillDefs[skill].label}${skill === "gust" ? "을" : "를"} 사용할 수 있어요.` : "";
  addLog("성장", `${stage.name}(으)로 자랐어요.${skillText}`);
  addFloatingText(dragon.x, dragon.y - 55, stage.name, "#ffd979");
}

function careDragon() {
  const target = state.mounted ? dragon : player;
  const near = distance(target, dragon) < 170 || state.mounted;

  if (!near) {
    addLog("거리 부족", "드래곤에게 조금 더 가까이 가야 해요.");
    return;
  }

  const stage = getStage();
  if (stage.id === "egg") {
    dragon.age += 4.6;
    dragon.hp = Math.min(dragon.maxHp, dragon.hp + 8);
    addParticles(dragon.x, dragon.y, 22, "#ffd979", 125, 5);
    addLog("알 보살핌", "따뜻한 빛이 알 안쪽에서 천천히 움직여요.");
  } else {
    dragon.age += 1.4;
    dragon.hp = Math.min(dragon.maxHp, dragon.hp + 18);
    dragon.stamina = Math.min(dragon.maxStamina, dragon.stamina + 24);
    addParticles(dragon.x, dragon.y, 18, "#86f0c7", 110, 5);
    addLog("유대감", `${stage.name}의 체력과 기력이 회복됐어요.`);
  }

  unlockStageIfNeeded();
}

function toggleMount() {
  const stage = getStage();
  if (!stage.ride) {
    addLog("탑승 불가", "드래곤이 더 자라야 등에 탈 수 있어요.");
    return;
  }

  if (!state.mounted && distance(player, dragon) > 190) {
    addLog("거리 부족", "드래곤 옆으로 다가가야 탈 수 있어요.");
    return;
  }

  state.mounted = !state.mounted;
  state.dragTarget = null;
  if (state.mounted) {
    player.target = null;
    player.x = dragon.x;
    player.y = dragon.y;
    addLog("탑승", "드래곤 등에 올라탔어요.");
  } else {
    state.flying = false;
    player.x = clamp(dragon.x - Math.cos(dragon.facing) * 58, 30, WORLD.w - 30);
    player.y = clamp(dragon.y - Math.sin(dragon.facing) * 58, 30, WORLD.h - 30);
    addLog("하차", "드래곤이 곁에서 따라다녀요.");
  }
}

function toggleFlight() {
  const stage = getStage();
  if (!stage.fly) {
    addLog("비행 불가", "날개가 더 강해지면 들판 위를 날 수 있어요.");
    return;
  }

  if (!state.mounted) {
    addLog("탑승 필요", "드래곤 등에 탄 상태에서만 날 수 있어요.");
    return;
  }

  if (!state.flying && dragon.stamina < 16) {
    addLog("기력 부족", "기력이 조금 회복된 뒤 다시 날 수 있어요.");
    return;
  }

  state.flying = !state.flying;
  addLog(state.flying ? "비행" : "착지", state.flying ? "드래곤이 들판 위로 떠올랐어요." : "드래곤이 초원에 내려앉았어요.");
}

function getSkillOrigin() {
  if (getStage().id === "egg") return null;
  return dragon;
}

function getAimAngle(origin) {
  const nearest = findNearestMonster(origin, 520);
  if (nearest) return angleTo(origin, nearest);
  return angleTo(origin, { x: pointer.worldX, y: pointer.worldY });
}

function useSkill(id) {
  const def = skillDefs[id];
  const origin = getSkillOrigin();
  if (!origin) {
    addLog("아직 알", "먼저 드래곤을 태어나게 해야 해요.");
    return;
  }

  if (!hasSkill(id)) {
    addLog("미해금", `${def.label}은 드래곤이 더 자라면 배워요.`);
    return;
  }

  const now = performance.now();
  if ((dragon.cooldowns[id] || 0) > now) return;

  if (dragon.stamina < def.stamina) {
    addLog("기력 부족", `${def.label}을 쓰기엔 기력이 부족해요.`);
    return;
  }

  dragon.stamina -= def.stamina;
  dragon.cooldowns[id] = now + def.cooldown;

  if (id === "ember" || id === "fireball") {
    const angle = getAimAngle(origin);
    dragon.facing = angle;
    projectiles.push({
      id,
      x: origin.x + Math.cos(angle) * 46,
      y: origin.y + Math.sin(angle) * 46,
      vx: Math.cos(angle) * def.speed,
      vy: Math.sin(angle) * def.speed,
      r: id === "fireball" ? 17 : 8,
      life: id === "fireball" ? 1.25 : 0.95,
      damage: def.damage,
      radius: def.radius,
      color: def.color,
    });
    addParticles(origin.x, origin.y, id === "fireball" ? 20 : 10, def.color, 80, 4);
    return;
  }

  if (id === "gust") {
    addParticles(origin.x, origin.y, 44, def.color, 260, 5);
    monsters.forEach((monster) => {
      const d = Math.hypot(monster.x - origin.x, monster.y - origin.y);
      if (d > def.range) return;
      const force = (1 - d / def.range) * 260;
      const a = Math.atan2(monster.y - origin.y, monster.x - origin.x);
      monster.x += Math.cos(a) * force * 0.12;
      monster.y += Math.sin(a) * force * 0.12;
      monster.stun = Math.max(monster.stun, 0.55);
      damageMonster(monster, Math.round(def.damage * (1 - d / def.range + 0.4)), "wind");
    });
    state.shake = Math.max(state.shake, 4);
    return;
  }

  if (id === "roar") {
    addParticles(origin.x, origin.y, 70, def.color, 360, 6);
    monsters.forEach((monster) => {
      const d = Math.hypot(monster.x - origin.x, monster.y - origin.y);
      if (d > def.range) return;
      monster.stun = Math.max(monster.stun, 1.8);
      damageMonster(monster, def.damage, "roar");
    });
    state.shake = Math.max(state.shake, 11);
  }
}

function findNearestMonster(origin, range = Infinity) {
  let nearest = null;
  let best = range;
  monsters.forEach((monster) => {
    const d = Math.hypot(monster.x - origin.x, monster.y - origin.y);
    if (d < best) {
      best = d;
      nearest = monster;
    }
  });
  return nearest;
}

function damageMonster(monster, amount, kind = "fire") {
  monster.hp -= amount;
  monster.hitFlash = 0.18;
  addFloatingText(monster.x, monster.y - monster.size, String(amount), kind === "wind" ? "#b6fbff" : "#ffd979");

  if (monster.hp > 0) return;

  const type = monster.type;
  state.essence += type.essence;
  dragon.age += type.age;
  dragon.stamina = Math.min(dragon.maxStamina, dragon.stamina + 6);
  addFloatingText(monster.x, monster.y - 20, `+${type.essence}`, "#55d2c5");
  addParticles(monster.x, monster.y, 32, type.accent, 160, 6);

  const index = monsters.indexOf(monster);
  if (index !== -1) monsters.splice(index, 1);
  window.setTimeout(() => spawnMonster(), 900 + Math.random() * 1500);
  unlockStageIfNeeded();
}

function harmHero(amount, source) {
  if (state.flying && state.altitude > 0.5) return;

  const target = state.mounted || getStage().id !== "egg" ? dragon : player;
  if (target === player) {
    if (player.invuln > 0) return;
    player.hp -= amount;
    player.invuln = 0.8;
    addFloatingText(player.x, player.y - 30, `-${amount}`, "#ed6464");
  } else {
    dragon.hp -= amount;
    addFloatingText(dragon.x, dragon.y - 48, `-${amount}`, "#ed6464");
  }

  state.shake = Math.max(state.shake, 5);
  addParticles(source.x, source.y, 10, source.type.accent, 90, 4);

  if (player.hp <= 0) {
    player.hp = player.maxHp;
    player.x = CENTER.x - 130;
    player.y = CENTER.y + 80;
    state.mounted = false;
    state.flying = false;
    addLog("회복", "잠시 물러나 숨을 고른 뒤 초원 중앙으로 돌아왔어요.");
  }

  if (dragon.hp <= 0) {
    dragon.hp = Math.round(dragon.maxHp * 0.58);
    dragon.stamina = Math.round(dragon.maxStamina * 0.45);
    state.mounted = false;
    state.flying = false;
    player.x = dragon.x - 80;
    player.y = dragon.y + 40;
    addLog("드래곤 보호", "드래곤이 쓰러지지 않도록 잠시 후퇴했어요.");
  }
}

function update(dt) {
  state.elapsed += dt;
  dragon.age += dt * (getStage().id === "egg" ? 0.52 : 0.34);
  unlockStageIfNeeded();

  updateCooldowns();
  updateMovement(dt);
  updateMonsters(dt);
  updateProjectiles(dt);
  updateParticles(dt);
  updateFloatingTexts(dt);
  updateClouds(dt);
  updateUi();

  if (state.shake > 0) state.shake = Math.max(0, state.shake - dt * 22);
}

function updateCooldowns() {
  Object.keys(skillDefs).forEach((id) => {
    if (!dragon.cooldowns[id]) return;
    if (dragon.cooldowns[id] < performance.now()) dragon.cooldowns[id] = 0;
  });
}

function updateMovement(dt) {
  const move = getMoveVector();

  if (state.mounted) {
    const speed = state.flying ? 330 : 228;
    const targetMove = getTargetMove(dragon, state.dragTarget);
    const finalMove = move.active ? move : targetMove;
    moveEntity(dragon, finalMove, speed, dt, dragon.radius);
    player.x = dragon.x;
    player.y = dragon.y;
    player.target = null;

    if (state.dragTarget && !pointer.down && Math.hypot(state.dragTarget.x - dragon.x, state.dragTarget.y - dragon.y) < 18) {
      state.dragTarget = null;
    }

    if (state.flying) {
      dragon.stamina = Math.max(0, dragon.stamina - dt * (finalMove.active ? 9.5 : 5.2));
      if (dragon.stamina <= 0) {
        state.flying = false;
        addLog("착지", "기력이 떨어져 초원에 내려앉았어요.");
      }
    } else {
      dragon.stamina = Math.min(dragon.maxStamina, dragon.stamina + dt * 9);
    }
  } else {
    const targetMove = getTargetMove(player, player.target);
    const finalMove = move.active ? move : targetMove;
    moveEntity(player, finalMove, player.speed, dt, player.radius);

    if (player.target && Math.hypot(player.target.x - player.x, player.target.y - player.y) < 10) {
      player.target = null;
    }

    state.dragTarget = null;
    updateDragonFollow(dt);
    dragon.stamina = Math.min(dragon.maxStamina, dragon.stamina + dt * 7);
  }

  const targetAltitude = state.flying ? 1 : 0;
  state.altitude += (targetAltitude - state.altitude) * Math.min(1, dt * 4.5);
  player.invuln = Math.max(0, player.invuln - dt);
}

function getMoveVector() {
  let x = 0;
  let y = 0;
  if (keys.has("KeyW") || keys.has("ArrowUp")) y -= 1;
  if (keys.has("KeyS") || keys.has("ArrowDown")) y += 1;
  if (keys.has("KeyA") || keys.has("ArrowLeft")) x -= 1;
  if (keys.has("KeyD") || keys.has("ArrowRight")) x += 1;
  const len = Math.hypot(x, y) || 1;
  return { x: x / len, y: y / len, active: x !== 0 || y !== 0 };
}

function getTargetMove(entity, target) {
  if (!target) return { x: 0, y: 0, active: false };
  const dx = target.x - entity.x;
  const dy = target.y - entity.y;
  const len = Math.hypot(dx, dy);
  if (len < 4) return { x: 0, y: 0, active: false };
  return { x: dx / len, y: dy / len, active: true };
}

function moveEntity(entity, move, speed, dt, radius) {
  if (!move.active) return;
  entity.x = clamp(entity.x + move.x * speed * dt, radius, WORLD.w - radius);
  entity.y = clamp(entity.y + move.y * speed * dt, radius, WORLD.h - radius);
  entity.facing = Math.atan2(move.y, move.x);
}

function updateDragonFollow(dt) {
  const stage = getStage();
  if (stage.id === "egg") return;

  const preferred = 92 + stage.scale * 15;
  const d = distance(dragon, player);
  if (d < preferred) return;

  const speed = 130 + stage.scale * 46;
  const angle = angleTo(dragon, player);
  dragon.x = clamp(dragon.x + Math.cos(angle) * speed * dt, dragon.radius, WORLD.w - dragon.radius);
  dragon.y = clamp(dragon.y + Math.sin(angle) * speed * dt, dragon.radius, WORLD.h - dragon.radius);
  dragon.facing = angle;
}

function updateMonsters(dt) {
  const target = state.mounted || getStage().id !== "egg" ? dragon : player;
  const eggSanctuary = getStage().id === "egg";
  const sanctuaryRadius = 540;

  monsters.forEach((monster) => {
    monster.phase += dt * 4;
    monster.hitFlash = Math.max(0, monster.hitFlash - dt);
    monster.attack = Math.max(0, monster.attack - dt);
    monster.stun = Math.max(0, monster.stun - dt);

    if (monster.stun > 0) return;

    const d = Math.hypot(target.x - monster.x, target.y - monster.y);
    const centerDistance = Math.hypot(monster.x - CENTER.x, monster.y - CENTER.y);
    const noticeRange = 620 + getStage().scale * 80;
    let angle = monster.phase * 0.2;
    let speed = monster.type.speed * 0.35;

    if (eggSanctuary && centerDistance < sanctuaryRadius) {
      angle = Math.atan2(monster.y - CENTER.y, monster.x - CENTER.x);
      speed = monster.type.speed * 1.35;
    } else if (d < noticeRange) {
      angle = Math.atan2(target.y - monster.y, target.x - monster.x);
      speed = monster.type.speed;
    }

    monster.vx = Math.cos(angle) * speed;
    monster.vy = Math.sin(angle) * speed;
    monster.x = clamp(monster.x + monster.vx * dt, monster.size, WORLD.w - monster.size);
    monster.y = clamp(monster.y + monster.vy * dt, monster.size, WORLD.h - monster.size);

    const hitDistance = monster.size + (target === dragon ? dragon.radius * getStage().scale * 0.5 : player.radius) + 12;
    if (eggSanctuary && centerDistance < sanctuaryRadius + 24) return;
    if (d < hitDistance && monster.attack <= 0) {
      monster.attack = 1.05;
      harmHero(monster.type.damage, monster);
    }
  });

  if (monsters.length < 24) spawnMonster();
}

function updateProjectiles(dt) {
  for (let i = projectiles.length - 1; i >= 0; i -= 1) {
    const p = projectiles[i];
    p.life -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    addParticles(p.x, p.y, p.id === "fireball" ? 2 : 1, p.color, 18, p.id === "fireball" ? 4 : 2.5);

    let hit = false;
    for (const monster of monsters) {
      const d = Math.hypot(monster.x - p.x, monster.y - p.y);
      if (d > monster.size + p.r) continue;
      hit = true;
      if (p.radius > 18) {
        explodeProjectile(p);
      } else {
        damageMonster(monster, p.damage);
      }
      break;
    }

    if (hit || p.life <= 0 || p.x < 0 || p.y < 0 || p.x > WORLD.w || p.y > WORLD.h) {
      if (!hit && p.id === "fireball") explodeProjectile(p);
      projectiles.splice(i, 1);
    }
  }
}

function explodeProjectile(projectile) {
  addParticles(projectile.x, projectile.y, 46, projectile.color, 230, 7);
  state.shake = Math.max(state.shake, 6);
  monsters.forEach((monster) => {
    const d = Math.hypot(monster.x - projectile.x, monster.y - projectile.y);
    if (d > projectile.radius) return;
    const falloff = 1 - d / projectile.radius;
    damageMonster(monster, Math.round(projectile.damage * (0.45 + falloff)));
  });
}

function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const p = particles[i];
    p.life -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vx *= 0.94;
    p.vy *= 0.94;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function updateFloatingTexts(dt) {
  for (let i = floatingTexts.length - 1; i >= 0; i -= 1) {
    const text = floatingTexts[i];
    text.life -= dt;
    text.y += text.vy * dt;
    if (text.life <= 0) floatingTexts.splice(i, 1);
  }
}

function updateClouds(dt) {
  clouds.forEach((cloud) => {
    cloud.x += cloud.speed * dt;
    cloud.y += cloud.drift * cloud.speed * dt;
    if (cloud.x - cloud.r > WORLD.w) cloud.x = -cloud.r;
  });
}

function updateCamera() {
  const focus = state.mounted ? dragon : player;
  camera.x += (focus.x - camera.w * 0.5 - camera.x) * 0.1;
  camera.y += (focus.y - camera.h * 0.5 - camera.y) * 0.1;
  camera.x = clamp(camera.x, 0, WORLD.w - camera.w);
  camera.y = clamp(camera.y, 0, WORLD.h - camera.h);

  if (state.shake > 0) {
    camera.x += random(-state.shake, state.shake);
    camera.y += random(-state.shake, state.shake);
  }

  pointer.worldX = pointer.screenX + camera.x;
  pointer.worldY = pointer.screenY + camera.y;
}

function centerCameraOn(entity) {
  camera.x = clamp(entity.x - camera.w * 0.5, 0, WORLD.w - camera.w);
  camera.y = clamp(entity.y - camera.h * 0.5, 0, WORLD.h - camera.h);
  pointer.worldX = pointer.screenX + camera.x;
  pointer.worldY = pointer.screenY + camera.y;
}

function draw() {
  updateCamera();
  ctx.clearRect(0, 0, camera.w, camera.h);
  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  drawGround();
  drawLakes();
  drawDecorations("back");
  drawTargetMarker();
  drawShadows();

  const renderables = [
    ...monsters.map((monster) => ({ y: monster.y, draw: () => drawMonster(monster) })),
    { y: dragon.y, draw: () => drawDragon() },
    !state.mounted ? { y: player.y, draw: () => drawPlayer() } : null,
    ...decorations
      .filter((item) => item.type === "tree")
      .map((item) => ({ y: item.y + item.r, draw: () => drawTree(item) })),
  ].filter(Boolean);

  renderables.sort((a, b) => a.y - b.y).forEach((item) => item.draw());
  drawProjectiles();
  drawParticles();
  drawFloatingTexts();
  drawCloudLayer();
  ctx.restore();
  drawVignette();
  drawMinimap();
}

function drawGround() {
  const gradient = ctx.createLinearGradient(0, 0, WORLD.w, WORLD.h);
  gradient.addColorStop(0, "#4f9b62");
  gradient.addColorStop(0.42, "#70b86f");
  gradient.addColorStop(1, "#3f8f5c");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WORLD.w, WORLD.h);

  drawTerrainRegions();

  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.strokeStyle = "#e9ffd9";
  ctx.lineWidth = 2;
  for (let x = -180; x < WORLD.w + 180; x += 180) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(x + 80, 520, x - 90, 1180, x + 30, WORLD.h);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "#f2e6a2";
  ctx.beginPath();
  ctx.ellipse(CENTER.x, CENTER.y + 70, 420, 280, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawTerrainRegions() {
  terrainRegions.forEach((region) => {
    if (!isVisible(region.x, region.y, Math.max(region.rx, region.ry) + 120)) return;
    ctx.save();
    ctx.translate(region.x, region.y);
    ctx.rotate(region.rot);
    const glow = ctx.createRadialGradient(-region.rx * 0.18, -region.ry * 0.22, 20, 0, 0, region.rx);
    glow.addColorStop(0, region.rim);
    glow.addColorStop(0.55, region.fill);
    glow.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.ellipse(0, 0, region.rx, region.ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = region.rim;
    ctx.lineWidth = 5;
    ctx.globalAlpha = 0.58;
    ctx.beginPath();
    ctx.ellipse(0, 0, region.rx * 0.98, region.ry * 0.98, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  });
}

function drawLakes() {
  lakes.forEach((lake) => {
    if (!isVisible(lake.x, lake.y, lake.rx + 80)) return;
    const grad = ctx.createRadialGradient(lake.x - 60, lake.y - 40, 20, lake.x, lake.y, lake.rx);
    grad.addColorStop(0, "#9ae6f6");
    grad.addColorStop(0.62, "#4ca6c2");
    grad.addColorStop(1, "#357c97");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(lake.x, lake.y, lake.rx, lake.ry, -0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(240, 255, 236, 0.52)";
    ctx.lineWidth = 10;
    ctx.stroke();
  });

  pools.forEach((pool) => {
    if (!isVisible(pool.x, pool.y, pool.rx + 40)) return;
    ctx.save();
    ctx.translate(pool.x, pool.y);
    ctx.rotate(pool.rot);
    const grad = ctx.createRadialGradient(-pool.rx * 0.2, -pool.ry * 0.2, 8, 0, 0, pool.rx);
    grad.addColorStop(0, "#b9f3d4");
    grad.addColorStop(0.62, "#5cae9e");
    grad.addColorStop(1, "#315f5e");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, 0, pool.rx, pool.ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(207, 255, 222, 0.38)";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.restore();
  });
}

function drawDecorations(layer) {
  decorations.forEach((item) => {
    if (item.type === "tree" || !isVisible(item.x, item.y, item.r + 20)) return;
    if (layer === "back") {
      if (item.type === "grass") drawGrass(item);
      if (item.type === "flower") drawFlower(item);
      if (item.type === "rock") drawRock(item);
      if (item.type === "crystal") drawCrystal(item);
      if (item.type === "ice") drawIce(item);
      if (item.type === "reed") drawReed(item);
      if (item.type === "mushroom") drawMushroom(item);
      if (item.type === "ruin") drawRuin(item);
      if (item.type === "spark") drawSpark(item);
    }
  });
}

function drawGrass(item) {
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate(item.rot);
  ctx.strokeStyle = item.color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, item.r);
  ctx.quadraticCurveTo(-item.r * 0.3, 0, 0, -item.r);
  ctx.moveTo(1, item.r * 0.8);
  ctx.quadraticCurveTo(item.r * 0.42, 0, item.r * 0.22, -item.r * 0.8);
  ctx.stroke();
  ctx.restore();
}

function drawFlower(item) {
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.fillStyle = item.color;
  for (let i = 0; i < 5; i += 1) {
    const a = (i / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(Math.cos(a) * item.r, Math.sin(a) * item.r, item.r * 0.55, item.r * 0.32, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#fff2ad";
  ctx.beginPath();
  ctx.arc(0, 0, item.r * 0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawRock(item) {
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
  ctx.beginPath();
  ctx.ellipse(3, item.r * 0.45, item.r * 0.92, item.r * 0.36, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = item.color;
  ctx.beginPath();
  ctx.moveTo(-item.r, item.r * 0.28);
  ctx.lineTo(-item.r * 0.45, -item.r * 0.62);
  ctx.lineTo(item.r * 0.28, -item.r * 0.78);
  ctx.lineTo(item.r, item.r * 0.12);
  ctx.lineTo(item.r * 0.58, item.r * 0.58);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.beginPath();
  ctx.ellipse(-item.r * 0.25, -item.r * 0.24, item.r * 0.26, item.r * 0.1, -0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCrystal(item) {
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
  ctx.beginPath();
  ctx.ellipse(0, item.r * 0.62, item.r * 0.85, item.r * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = item.color;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.moveTo(0, -item.r);
  ctx.lineTo(item.r * 0.52, -item.r * 0.1);
  ctx.lineTo(item.r * 0.18, item.r);
  ctx.lineTo(-item.r * 0.42, item.r * 0.42);
  ctx.lineTo(-item.r * 0.5, -item.r * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "rgba(255,255,255,0.46)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -item.r);
  ctx.lineTo(0, item.r * 0.72);
  ctx.stroke();
  ctx.restore();
}

function drawIce(item) {
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.beginPath();
  ctx.ellipse(0, item.r * 0.62, item.r * 0.72, item.r * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();
  const grad = ctx.createLinearGradient(-item.r * 0.4, -item.r, item.r * 0.5, item.r);
  grad.addColorStop(0, "#ffffff");
  grad.addColorStop(0.48, item.color);
  grad.addColorStop(1, "#6da3ff");
  ctx.fillStyle = grad;
  ctx.globalAlpha = 0.86;
  ctx.beginPath();
  ctx.moveTo(0, -item.r);
  ctx.lineTo(item.r * 0.46, item.r * 0.58);
  ctx.lineTo(0, item.r);
  ctx.lineTo(-item.r * 0.38, item.r * 0.36);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.62)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function drawReed(item) {
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.strokeStyle = item.color;
  ctx.lineWidth = 3;
  for (let i = -1; i <= 1; i += 1) {
    ctx.beginPath();
    ctx.moveTo(i * 5, item.r * 0.5);
    ctx.quadraticCurveTo(i * 8 + Math.sin(state.elapsed + item.x) * 3, -item.r * 0.3, i * 4, -item.r);
    ctx.stroke();
  }
  ctx.fillStyle = "#6f563f";
  ctx.beginPath();
  ctx.ellipse(-6, -item.r * 0.82, 4, 10, -0.15, 0, Math.PI * 2);
  ctx.ellipse(7, -item.r * 0.68, 4, 10, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawMushroom(item) {
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
  ctx.beginPath();
  ctx.ellipse(0, item.r * 0.52, item.r * 0.75, item.r * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f8dfbe";
  ctx.fillRect(-item.r * 0.16, -item.r * 0.08, item.r * 0.32, item.r * 0.72);
  ctx.fillStyle = item.color;
  ctx.beginPath();
  ctx.ellipse(0, -item.r * 0.18, item.r * 0.72, item.r * 0.42, 0, Math.PI, Math.PI * 2);
  ctx.lineTo(item.r * 0.72, -item.r * 0.08);
  ctx.lineTo(-item.r * 0.72, -item.r * 0.08);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.beginPath();
  ctx.arc(-item.r * 0.24, -item.r * 0.32, item.r * 0.08, 0, Math.PI * 2);
  ctx.arc(item.r * 0.18, -item.r * 0.22, item.r * 0.07, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawRuin(item) {
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate(item.rot || 0);
  ctx.fillStyle = "rgba(0, 0, 0, 0.14)";
  ctx.beginPath();
  ctx.ellipse(0, item.r * 0.55, item.r, item.r * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = item.color;
  ctx.fillRect(-item.r * 0.62, -item.r * 0.46, item.r * 0.26, item.r * 0.95);
  ctx.fillRect(item.r * 0.2, -item.r * 0.28, item.r * 0.28, item.r * 0.76);
  ctx.fillRect(-item.r * 0.72, -item.r * 0.58, item.r * 1.3, item.r * 0.18);
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  ctx.fillRect(-item.r * 0.57, -item.r * 0.35, item.r * 0.15, item.r * 0.18);
  ctx.fillRect(item.r * 0.27, -item.r * 0.16, item.r * 0.14, item.r * 0.18);
  ctx.strokeStyle = "rgba(54, 45, 38, 0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-item.r * 0.65, -item.r * 0.06);
  ctx.lineTo(-item.r * 0.38, -item.r * 0.04);
  ctx.moveTo(item.r * 0.22, item.r * 0.1);
  ctx.lineTo(item.r * 0.47, item.r * 0.08);
  ctx.stroke();
  ctx.restore();
}

function drawSpark(item) {
  const pulse = 0.65 + Math.sin(state.elapsed * 3.4 + item.x * 0.01) * 0.25;
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.globalAlpha = pulse;
  ctx.strokeStyle = item.color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -item.r);
  ctx.lineTo(0, item.r);
  ctx.moveTo(-item.r, 0);
  ctx.lineTo(item.r, 0);
  ctx.moveTo(-item.r * 0.58, -item.r * 0.58);
  ctx.lineTo(item.r * 0.58, item.r * 0.58);
  ctx.moveTo(item.r * 0.58, -item.r * 0.58);
  ctx.lineTo(-item.r * 0.58, item.r * 0.58);
  ctx.stroke();
  ctx.restore();
}

function drawTree(item) {
  if (!isVisible(item.x, item.y, item.r + 60)) return;
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
  ctx.beginPath();
  ctx.ellipse(5, item.r * 0.78, item.r * 0.72, item.r * 0.24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#806047";
  ctx.fillRect(-item.r * 0.16, -item.r * 0.15, item.r * 0.32, item.r * 0.95);
  ctx.fillStyle = item.color;
  ctx.beginPath();
  ctx.arc(0, -item.r * 0.25, item.r * 0.72, 0, Math.PI * 2);
  ctx.arc(-item.r * 0.45, item.r * 0.05, item.r * 0.48, 0, Math.PI * 2);
  ctx.arc(item.r * 0.46, item.r * 0.03, item.r * 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  ctx.beginPath();
  ctx.arc(-item.r * 0.2, -item.r * 0.48, item.r * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawTargetMarker() {
  const target = state.mounted ? state.dragTarget : player.target;
  if (!target) return;
  const actor = state.mounted ? dragon : player;
  ctx.save();
  if (pointer.down || pointer.dragging) {
    ctx.strokeStyle = state.mounted ? "rgba(183, 244, 255, 0.58)" : "rgba(255,255,255,0.48)";
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 12]);
    ctx.beginPath();
    ctx.moveTo(actor.x, actor.y);
    ctx.lineTo(target.x, target.y);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.translate(target.x, target.y);
  ctx.strokeStyle = "rgba(255,255,255,0.72)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 16 + Math.sin(state.elapsed * 7) * 2, 0, Math.PI * 2);
  ctx.moveTo(-23, 0);
  ctx.lineTo(-10, 0);
  ctx.moveTo(10, 0);
  ctx.lineTo(23, 0);
  ctx.stroke();
  ctx.restore();
}

function drawShadows() {
  drawEntityShadow(player.x, player.y, player.radius * 1.1, !state.mounted ? 0.2 : 0);
  drawEntityShadow(dragon.x, dragon.y, dragon.radius * getStage().scale * 1.55, state.flying ? 0.08 : 0.22);
  monsters.forEach((monster) => drawEntityShadow(monster.x, monster.y, monster.size, 0.18));
}

function drawEntityShadow(x, y, r, alpha) {
  if (alpha <= 0 || !isVisible(x, y, r + 30)) return;
  ctx.save();
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.beginPath();
  ctx.ellipse(x, y + r * 0.52, r * 1.18, r * 0.36, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPlayer() {
  if (!isVisible(player.x, player.y, 60)) return;
  const bob = Math.sin(state.elapsed * 8) * 2;
  ctx.save();
  ctx.translate(player.x, player.y + bob);
  ctx.rotate(player.facing || 0);
  ctx.globalAlpha = player.invuln > 0 ? 0.68 + Math.sin(state.elapsed * 40) * 0.22 : 1;
  ctx.fillStyle = "#303047";
  ctx.beginPath();
  ctx.ellipse(0, 0, 16, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f2c15b";
  ctx.beginPath();
  ctx.arc(11, 0, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e55247";
  ctx.beginPath();
  ctx.moveTo(-5, -14);
  ctx.lineTo(-26, -2);
  ctx.lineTo(-5, 14);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#fff4d2";
  ctx.beginPath();
  ctx.arc(14, -4, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawDragon() {
  const stage = getStage();
  const form = getDragonForm(stage);
  if (!isVisible(dragon.x, dragon.y, 210 * stage.scale * form.aura)) return;

  if (stage.id === "egg") {
    drawEgg();
    return;
  }

  const scale = stage.scale;
  const lift = state.altitude * 58 + Math.sin(state.elapsed * 5) * state.altitude * 5;
  const flap = Math.sin(state.elapsed * (state.flying ? 14 : 4)) * (state.flying ? 0.28 : 0.08);

  ctx.save();
  ctx.translate(dragon.x, dragon.y - lift);
  const aura = ctx.createRadialGradient(0, 0, 8, 0, 0, 120 * scale * form.aura);
  aura.addColorStop(0, `rgba(255, 255, 255, ${0.12 + form.aura * 0.04})`);
  aura.addColorStop(0.55, `rgba(${dragonPalette.auraMid}, ${0.07 + form.aura * 0.04})`);
  aura.addColorStop(1, `rgba(${dragonPalette.auraEdge}, 0)`);
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(0, 0, 120 * scale * form.aura, 0, Math.PI * 2);
  ctx.fill();
  ctx.rotate(dragon.facing);
  ctx.scale(scale, scale);

  drawWing(-1, flap, form);
  drawWing(1, -flap, form);

  ctx.strokeStyle = dragonPalette.outline;
  ctx.lineWidth = 3;

  drawTail(form);

  const bodyGrad = ctx.createLinearGradient(-form.bodyX * 0.55, -form.bodyY * 0.82, form.bodyX * 0.66, form.bodyY * 0.86);
  bodyGrad.addColorStop(0, dragonPalette.bodyLight);
  bodyGrad.addColorStop(0.36, dragonPalette.bodyMid);
  bodyGrad.addColorStop(0.72, dragonPalette.bodyDeep);
  bodyGrad.addColorStop(1, dragonPalette.bodyShadow);
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, form.bodyX, form.bodyY, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  drawOpalSpots(form);

  ctx.fillStyle = dragonPalette.belly;
  ctx.beginPath();
  ctx.ellipse(7, 9, form.bellyX, form.bellyY, 0, 0, Math.PI * 2);
  ctx.fill();

  const neckGrad = ctx.createLinearGradient(form.neckCx - 24, -24, form.headCx + 14, 24);
  neckGrad.addColorStop(0, dragonPalette.bodyDeep);
  neckGrad.addColorStop(1, dragonPalette.bodyMid);
  ctx.fillStyle = neckGrad;
  ctx.beginPath();
  ctx.ellipse(form.neckCx, 0, form.neckX * 0.5, form.neckY, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = dragonPalette.bodyLight;
  ctx.beginPath();
  ctx.ellipse(form.headCx, 0, form.headX, form.headY, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  drawCheekFins(form);

  ctx.fillStyle = dragonPalette.eye;
  ctx.beginPath();
  ctx.arc(form.headCx + form.headX * 0.3, -form.headY * 0.36, 4.2 + form.headX * 0.04, 0, Math.PI * 2);
  ctx.arc(form.headCx + form.headX * 0.3, form.headY * 0.36, 4.2 + form.headX * 0.04, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#31224b";
  ctx.beginPath();
  ctx.arc(form.headCx + form.headX * 0.36, -form.headY * 0.36, 2, 0, Math.PI * 2);
  ctx.arc(form.headCx + form.headX * 0.36, form.headY * 0.36, 2, 0, Math.PI * 2);
  ctx.fill();

  drawWhiskers(form);
  drawSpineCrystals(form);
  drawHorns(form);
  drawLegs(form);
  drawCrown(form);

  if (state.mounted) drawRider(scale);

  ctx.restore();

  if (state.flying && state.altitude > 0.25) {
    ctx.save();
    ctx.globalAlpha = 0.25 * state.altitude;
    ctx.strokeStyle = "#d7fbff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(dragon.x, dragon.y - lift + 20, 92 * scale, 0.15, Math.PI - 0.15);
    ctx.stroke();
    ctx.restore();
  }
}

function drawTail(form) {
  const tailEnd = -form.tailLength;
  const baseX = -form.bodyX * 0.76;
  const tailGrad = ctx.createLinearGradient(tailEnd, -form.tailHeight, baseX, form.tailHeight);
  tailGrad.addColorStop(0, dragonPalette.tailTip);
  tailGrad.addColorStop(0.5, dragonPalette.bodyMid);
  tailGrad.addColorStop(1, dragonPalette.bodyDeep);
  ctx.fillStyle = tailGrad;
  ctx.beginPath();
  ctx.moveTo(baseX, -form.tailHeight * 0.34);
  ctx.bezierCurveTo(-form.tailLength * 0.56, -form.tailHeight * 1.25, -form.tailLength * 0.76, -form.tailHeight * 1.05, tailEnd, -form.tailHeight * 0.12);
  ctx.bezierCurveTo(-form.tailLength * 0.78, form.tailHeight * 0.68, -form.tailLength * 0.56, form.tailHeight * 1.28, baseX, form.tailHeight * 0.78);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  if (form.tailFin > 0) {
    ctx.fillStyle = dragonPalette.wingA.replace(/0\.\d+\)/, `${0.44 + form.tailFin * 0.2})`);
    ctx.beginPath();
    ctx.moveTo(tailEnd + 8, -form.tailHeight * 0.18);
    ctx.lineTo(tailEnd - 20 * form.tailFin, -34 * form.tailFin);
    ctx.lineTo(tailEnd + 20 * form.tailFin, -8 * form.tailFin);
    ctx.closePath();
    ctx.moveTo(tailEnd + 8, form.tailHeight * 0.14);
    ctx.lineTo(tailEnd - 18 * form.tailFin, 34 * form.tailFin);
    ctx.lineTo(tailEnd + 22 * form.tailFin, 9 * form.tailFin);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}

function drawWing(side, flap, form) {
  ctx.save();
  ctx.scale(1, side);
  ctx.rotate(flap * side);
  ctx.scale(form.wingScale, form.wingScale);
  ctx.globalAlpha = form.wingAlpha;
  const wingGrad = ctx.createLinearGradient(-66, -88, 54, -30);
  wingGrad.addColorStop(0, dragonPalette.wingB);
  wingGrad.addColorStop(0.52, dragonPalette.wingA);
  wingGrad.addColorStop(1, "rgba(255, 255, 255, 0.88)");
  ctx.fillStyle = wingGrad;
  ctx.strokeStyle = dragonPalette.outline;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-12, -14);
  ctx.lineTo(-66, -88);
  ctx.quadraticCurveTo(4, -82, 54, -30);
  ctx.quadraticCurveTo(24, -22, -12, -14);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.52)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-17, -17);
  ctx.lineTo(-54, -72);
  ctx.moveTo(-10, -16);
  ctx.lineTo(16, -64);
  ctx.moveTo(4, -18);
  ctx.lineTo(46, -38);
  ctx.stroke();
  ctx.restore();
}

function drawOpalSpots(form) {
  const spots = [
    [-32, -13, 9, dragonPalette.spots[0]],
    [-4, -22, 7, dragonPalette.spots[1]],
    [28, -12, 8, dragonPalette.spots[2]],
    [34, 17, 6, dragonPalette.spots[3]],
    [-25, 19, 5, dragonPalette.spots[4]],
  ];
  ctx.save();
  spots.forEach(([x, y, r, color]) => {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.38 + Math.sin(state.elapsed * 2.8 + x) * 0.08;
    ctx.beginPath();
    ctx.ellipse(x, y, r * form.spotScale, r * 0.62 * form.spotScale, 0.2, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawCheekFins(form) {
  if (form.cheekFin <= 0) return;
  ctx.save();
  ctx.fillStyle = `rgba(128, 231, 244, ${0.58 + form.cheekFin * 0.18})`;
  ctx.strokeStyle = dragonPalette.outline;
  ctx.lineWidth = 2;
  const x = form.headCx - form.headX * 0.2;
  const fin = 18 * form.cheekFin;
  ctx.beginPath();
  ctx.moveTo(x, -form.headY * 0.75);
  ctx.lineTo(x - fin * 0.32, -form.headY - fin);
  ctx.lineTo(x + fin * 0.85, -form.headY * 0.48);
  ctx.closePath();
  ctx.moveTo(x, form.headY * 0.75);
  ctx.lineTo(x - fin * 0.32, form.headY + fin);
  ctx.lineTo(x + fin * 0.85, form.headY * 0.48);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawWhiskers(form) {
  if (!form.whisker) return;
  ctx.save();
  ctx.strokeStyle = "rgba(255, 247, 189, 0.82)";
  ctx.lineWidth = form.crown ? 2.4 : 1.8;
  const x = form.headCx + form.headX * 0.76;
  ctx.beginPath();
  ctx.moveTo(x, -7);
  ctx.bezierCurveTo(x + 22, -22, x + 42, -19, x + 60, -32);
  ctx.moveTo(x, 7);
  ctx.bezierCurveTo(x + 22, 22, x + 42, 19, x + 60, 32);
  ctx.stroke();
  ctx.restore();
}

function drawSpineCrystals(form) {
  ctx.fillStyle = dragonPalette.crystal;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.68)";
  ctx.lineWidth = 1.5;
  [
    [-58, -1, 10],
    [-42, -11, 12],
    [-23, -18, 15],
    [-2, -25, 17],
    [22, -25, 16],
    [50, -20, 14],
    [76, -16, 12],
    [100, -13, 10],
  ].slice(0, form.crystalCount).forEach(([x, y, h]) => {
    const height = h * form.crystalScale;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + height * 0.45, y - height);
    ctx.lineTo(x + height * 0.92, y + 1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });
}

function drawHorns(form) {
  if (form.hornScale <= 0) return;
  const x = form.headCx - form.headX * 0.25;
  const h = 24 * form.hornScale;
  ctx.fillStyle = dragonPalette.horn;
  ctx.beginPath();
  ctx.moveTo(x, -form.headY * 0.72);
  ctx.lineTo(x - h * 0.5, -form.headY * 0.72 - h);
  ctx.lineTo(x + h * 0.9, -form.headY * 0.9);
  ctx.closePath();
  ctx.moveTo(x, form.headY * 0.72);
  ctx.lineTo(x - h * 0.5, form.headY * 0.72 + h);
  ctx.lineTo(x + h * 0.9, form.headY * 0.9);
  ctx.closePath();
  ctx.fill();
}

function drawLegs(form) {
  ctx.fillStyle = "#8ea7ff";
  [
    [-18, -30, -34, -42],
    [28, -28, 38, -42],
    [-18, 30, -34, 42],
    [28, 28, 38, 42],
  ].forEach(([x1, y1, x2, y2]) => {
    const s = form.legScale;
    ctx.beginPath();
    ctx.moveTo(x1 * s, y1 * s);
    ctx.lineTo(x2 * s, y2 * s);
    ctx.lineTo((x2 + 18) * s, (y2 + Math.sign(y2) * 2) * s);
    ctx.lineTo((x1 + 12) * s, y1 * s);
    ctx.closePath();
    ctx.fill();
  });
}

function drawCrown(form) {
  if (!form.crown) return;
  ctx.save();
  ctx.fillStyle = "rgba(255, 242, 169, 0.92)";
  ctx.strokeStyle = "rgba(96, 121, 183, 0.75)";
  ctx.lineWidth = 2;
  const x = form.headCx - 8;
  ctx.beginPath();
  ctx.moveTo(x - 14, -form.headY - 3);
  ctx.lineTo(x - 5, -form.headY - 26);
  ctx.lineTo(x + 4, -form.headY - 7);
  ctx.lineTo(x + 15, -form.headY - 32);
  ctx.lineTo(x + 23, -form.headY - 6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawRider() {
  ctx.save();
  ctx.rotate(-dragon.facing);
  ctx.translate(-5, -4);
  ctx.fillStyle = "#2d3142";
  ctx.beginPath();
  ctx.ellipse(0, 0, 10, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffd08b";
  ctx.beginPath();
  ctx.arc(0, -14, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#f2c15b";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-14, 2);
  ctx.lineTo(14, 2);
  ctx.stroke();
  ctx.restore();
}

function drawEgg() {
  const progress = clamp(dragon.age / stages[0].next, 0, 1);
  const pulse = 1 + Math.sin(state.elapsed * 5) * 0.018;
  ctx.save();
  ctx.translate(dragon.x, dragon.y);
  ctx.scale(pulse, pulse);
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 31, 48, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  const grad = ctx.createLinearGradient(-30, -60, 32, 54);
  grad.addColorStop(0, "#ffffff");
  grad.addColorStop(0.35, dragonPalette.bodyLight);
  grad.addColorStop(0.68, dragonPalette.bodyMid);
  grad.addColorStop(1, dragonPalette.bodyDeep);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(0, 0, 42, 58, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = dragonPalette.outline;
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.beginPath();
  ctx.ellipse(-13, -19, 10, 21, -0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = dragonPalette.spots[0];
  ctx.globalAlpha = 0.45;
  ctx.beginPath();
  ctx.ellipse(16, 14, 11, 7, 0.45, 0, Math.PI * 2);
  ctx.ellipse(-18, 22, 7, 5, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  if (progress > 0.36) {
    ctx.strokeStyle = dragonPalette.outline;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-7, -42);
    ctx.lineTo(6, -26);
    ctx.lineTo(-4, -9);
    ctx.lineTo(11, 10);
    ctx.stroke();
  }

  if (progress > 0.72) {
    ctx.strokeStyle = dragonPalette.crystal;
    ctx.lineWidth = 5;
    ctx.globalAlpha = 0.65 + Math.sin(state.elapsed * 10) * 0.2;
    ctx.beginPath();
    ctx.moveTo(11, -30);
    ctx.lineTo(24, -12);
    ctx.lineTo(10, 4);
    ctx.lineTo(26, 25);
    ctx.stroke();
  }
  ctx.restore();
}

function drawMonster(monster) {
  if (!isVisible(monster.x, monster.y, monster.size + 40)) return;
  const wobble = Math.sin(monster.phase) * 2;
  ctx.save();
  ctx.translate(monster.x, monster.y + wobble);

  if (monster.type.id === "wisp") {
    const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, monster.size * 2.2);
    glow.addColorStop(0, "rgba(255,255,255,0.7)");
    glow.addColorStop(0.46, "rgba(182,251,255,0.34)");
    glow.addColorStop(1, "rgba(182,251,255,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, monster.size * 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = monster.hitFlash > 0 ? "#fff3df" : monster.type.color;
  ctx.strokeStyle = monster.type.accent;
  ctx.lineWidth = 3;

  if (monster.type.id === "stone") {
    ctx.beginPath();
    ctx.moveTo(-monster.size, monster.size * 0.45);
    ctx.lineTo(-monster.size * 0.78, -monster.size * 0.38);
    ctx.lineTo(-monster.size * 0.08, -monster.size);
    ctx.lineTo(monster.size * 0.82, -monster.size * 0.55);
    ctx.lineTo(monster.size, monster.size * 0.34);
    ctx.lineTo(monster.size * 0.4, monster.size);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.ellipse(0, 3, monster.size, monster.size * 0.82, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  if (monster.type.id === "thorn" || monster.type.id === "frost") {
    ctx.fillStyle = monster.type.accent;
    for (let i = 0; i < 5; i += 1) {
      const x = -monster.size * 0.8 + i * monster.size * 0.4;
      ctx.beginPath();
      ctx.moveTo(x, -monster.size * 0.52);
      ctx.lineTo(x + monster.size * 0.16, -monster.size * 1.02);
      ctx.lineTo(x + monster.size * 0.32, -monster.size * 0.5);
      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.fillStyle = "#f8fbff";
  ctx.beginPath();
  ctx.arc(-monster.size * 0.32, -monster.size * 0.1, 4, 0, Math.PI * 2);
  ctx.arc(monster.size * 0.32, -monster.size * 0.1, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#151c22";
  ctx.beginPath();
  ctx.arc(-monster.size * 0.31, -monster.size * 0.1, 2, 0, Math.PI * 2);
  ctx.arc(monster.size * 0.31, -monster.size * 0.1, 2, 0, Math.PI * 2);
  ctx.fill();

  if (monster.hp < monster.maxHp) {
    ctx.fillStyle = "rgba(0,0,0,0.34)";
    ctx.fillRect(-monster.size, -monster.size - 16, monster.size * 2, 6);
    ctx.fillStyle = "#ed6464";
    ctx.fillRect(-monster.size, -monster.size - 16, monster.size * 2 * (monster.hp / monster.maxHp), 6);
  }

  if (monster.stun > 0) {
    ctx.strokeStyle = "#ffe28b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -monster.size - 8, 8, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawProjectiles() {
  projectiles.forEach((p) => {
    if (!isVisible(p.x, p.y, p.r + 40)) return;
    const grad = ctx.createRadialGradient(p.x, p.y, 1, p.x, p.y, p.r * 2.4);
    grad.addColorStop(0, "#fff8bd");
    grad.addColorStop(0.45, p.color);
    grad.addColorStop(1, "rgba(255, 96, 42, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawParticles() {
  particles.forEach((p) => {
    if (!isVisible(p.x, p.y, p.r + 12)) return;
    ctx.globalAlpha = clamp(p.life / p.maxLife, 0, 1);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });
}

function drawFloatingTexts() {
  floatingTexts.forEach((text) => {
    if (!isVisible(text.x, text.y, 80)) return;
    ctx.save();
    ctx.globalAlpha = clamp(text.life, 0, 1);
    ctx.fillStyle = text.color;
    ctx.font = "800 17px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(0,0,0,0.45)";
    ctx.strokeText(text.text, text.x, text.y);
    ctx.fillText(text.text, text.x, text.y);
    ctx.restore();
  });
}

function drawCloudLayer() {
  if (state.altitude < 0.16) return;
  ctx.save();
  ctx.globalAlpha = state.altitude * 0.28;
  ctx.fillStyle = "#ffffff";
  clouds.forEach((cloud) => {
    if (!isVisible(cloud.x, cloud.y, cloud.r * 2)) return;
    ctx.beginPath();
    ctx.arc(cloud.x, cloud.y, cloud.r * 0.6, 0, Math.PI * 2);
    ctx.arc(cloud.x + cloud.r * 0.46, cloud.y + cloud.r * 0.04, cloud.r * 0.48, 0, Math.PI * 2);
    ctx.arc(cloud.x - cloud.r * 0.44, cloud.y + cloud.r * 0.08, cloud.r * 0.42, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawVignette() {
  const grad = ctx.createRadialGradient(camera.w * 0.5, camera.h * 0.52, camera.h * 0.25, camera.w * 0.5, camera.h * 0.5, camera.h * 0.86);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(1, "rgba(5,11,13,0.28)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, camera.w, camera.h);
}

function drawMinimap() {
  const size = 118;
  const pad = 14;
  const x = camera.w - size - pad;
  const y = pad;
  if (camera.w < 920) return;

  ctx.save();
  ctx.fillStyle = "rgba(10, 18, 20, 0.62)";
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x, y, size, size, 8);
  ctx.fill();
  ctx.stroke();

  const sx = size / WORLD.w;
  const sy = size / WORLD.h;
  ctx.fillStyle = "#55d2c5";
  ctx.beginPath();
  ctx.arc(x + dragon.x * sx, y + dragon.y * sy, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(x + player.x * sx, y + player.y * sy, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ed6464";
  monsters.slice(0, 40).forEach((monster) => {
    ctx.fillRect(x + monster.x * sx - 1, y + monster.y * sy - 1, 2, 2);
  });
  ctx.strokeStyle = "rgba(255,255,255,0.42)";
  ctx.strokeRect(x + camera.x * sx, y + camera.y * sy, camera.w * sx, camera.h * sy);
  ctx.restore();
}

function isVisible(x, y, margin = 40) {
  return x > camera.x - margin && x < camera.x + camera.w + margin && y > camera.y - margin && y < camera.y + camera.h + margin;
}

function updateUi() {
  const stage = getStage();
  const next = stage.next;
  const progress =
    next === Infinity ? 1 : clamp((dragon.age - stage.at) / Math.max(1, next - stage.at), 0, 1);
  const healthValue = Math.round(dragon.hp);
  const staminaValue = Math.round(dragon.stamina);

  ui.stageText.textContent = stage.name;
  ui.modeText.textContent = state.flying ? "비행 중" : state.mounted ? "탑승 중" : stage.id === "egg" ? "부화 대기" : "동행 중";
  ui.growthMeter.style.width = `${Math.round(progress * 100)}%`;
  ui.growthText.textContent = next === Infinity ? "100%" : `${Math.round(progress * 100)}%`;
  ui.healthMeter.style.width = `${clamp((dragon.hp / dragon.maxHp) * 100, 0, 100)}%`;
  ui.healthText.textContent = String(healthValue);
  ui.staminaMeter.style.width = `${clamp((dragon.stamina / dragon.maxStamina) * 100, 0, 100)}%`;
  ui.staminaText.textContent = String(staminaValue);
  ui.essenceText.textContent = String(state.essence);
  ui.monsterText.textContent = String(monsters.length);

  ui.mountButton.disabled = !stage.ride;
  ui.flyButton.disabled = !stage.fly || !state.mounted;
  ui.mountButton.classList.toggle("active", state.mounted);
  ui.flyButton.classList.toggle("active", state.flying);

  Object.entries(skillDefs).forEach(([id, def]) => {
    const unlocked = hasSkill(id);
    const ready = unlocked && (dragon.cooldowns[id] || 0) <= performance.now() && dragon.stamina >= def.stamina;
    def.button.disabled = !unlocked;
    def.button.classList.toggle("ready", ready);
  });
}

function worldFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left + camera.x,
    y: event.clientY - rect.top + camera.y,
    screenX: event.clientX - rect.left,
    screenY: event.clientY - rect.top,
  };
}

function onPointerMove(event) {
  if (pointer.activeId !== null && event.pointerId !== pointer.activeId) return;
  const point = worldFromEvent(event);
  pointer.screenX = point.screenX;
  pointer.screenY = point.screenY;
  pointer.worldX = point.x;
  pointer.worldY = point.y;

  if (!pointer.down) return;

  const dragDistance = Math.hypot(point.screenX - pointer.dragStartX, point.screenY - pointer.dragStartY);
  pointer.dragging = pointer.dragging || dragDistance > 6;
  canvas.classList.toggle("dragging", pointer.dragging);
  setMoveTarget(point);
}

function onPointerDown(event) {
  if (event.button !== undefined && event.button !== 0) return;
  const point = worldFromEvent(event);
  pointer.down = true;
  pointer.activeId = event.pointerId;
  pointer.dragging = false;
  pointer.dragStartX = point.screenX;
  pointer.dragStartY = point.screenY;
  pointer.dragWorldX = point.x;
  pointer.dragWorldY = point.y;
  pointer.screenX = point.screenX;
  pointer.screenY = point.screenY;
  pointer.worldX = point.x;
  pointer.worldY = point.y;
  canvas.classList.add("dragging");
  try {
    canvas.setPointerCapture(event.pointerId);
  } catch {}

  setMoveTarget(point);
}

function onPointerUp(event) {
  if (pointer.activeId !== null && event.pointerId !== pointer.activeId) return;
  pointer.down = false;
  pointer.activeId = null;
  pointer.dragging = false;
  canvas.classList.remove("dragging");
}

function setMoveTarget(point) {
  const target = {
    x: clamp(point.x, 30, WORLD.w - 30),
    y: clamp(point.y, 30, WORLD.h - 30),
  };

  if (state.mounted) {
    state.dragTarget = target;
    return;
  }

  player.target = target;
}

function bindEvents() {
  window.addEventListener("resize", resizeCanvas);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);

  window.addEventListener("keydown", (event) => {
    keys.add(event.code);
    if (event.code === "KeyE") careDragon();
    if (event.code === "KeyR") toggleMount();
    if (event.code === "Space") {
      event.preventDefault();
      toggleFlight();
    }
    if (event.code === "Digit1") useSkill("ember");
    if (event.code === "Digit2") useSkill("gust");
    if (event.code === "Digit3") useSkill("fireball");
    if (event.code === "Digit4") useSkill("roar");
  });

  window.addEventListener("keyup", (event) => {
    keys.delete(event.code);
  });

  window.addEventListener("blur", () => {
    keys.clear();
    pointer.down = false;
    pointer.activeId = null;
    pointer.dragging = false;
    canvas.classList.remove("dragging");
  });

  ui.careButton.addEventListener("click", careDragon);
  ui.mountButton.addEventListener("click", toggleMount);
  ui.flyButton.addEventListener("click", toggleFlight);
  ui.emberButton.addEventListener("click", () => useSkill("ember"));
  ui.gustButton.addEventListener("click", () => useSkill("gust"));
  ui.fireballButton.addEventListener("click", () => useSkill("fireball"));
  ui.roarButton.addEventListener("click", () => useSkill("roar"));
}

function loop(now) {
  const dt = Math.min(0.033, (now - state.last) / 1000 || 0);
  state.last = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

resizeCanvas();
createWorld();
centerCameraOn(player);
bindEvents();
addLog("시작", `${dragonPalette.name}빛 알에서 작은 열기가 느껴져요.`);
updateUi();
requestAnimationFrame(loop);
