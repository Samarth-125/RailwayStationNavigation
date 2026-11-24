import { STATION_LIST } from './stationList';

// Builds the schematic map of a station from a TEMPLATE.
// Every station gets places (rooms, stalls, platforms), links (walkways, stairs,
// lifts) and drawing instructions ("decor"). All of it is made up for the demo.

export const CATEGORIES = [
  { key: 'police', label: 'Police help' },
  { key: 'medical', label: 'Medical help' },
  { key: 'restroom', label: 'Restrooms' },
  { key: 'food', label: 'Food and tea stalls' },
  { key: 'water', label: 'Drinking water' },
  { key: 'atm', label: 'ATM' },
  { key: 'help', label: 'Help desk' },
  { key: 'waiting', label: 'Waiting room' },
  { key: 'ticket', label: 'Ticket counter' },
];

const STEP = 54; // distance between platform centres on the map
const walk = (a, b, meters) => ({ a, b, meters, mode: 'walk' });

// ---- small helpers for drawing instructions -------------------------------
const rect = (x, y, w, h, fill, stroke, sw = 1, rx = 0) => ({ k: 'rect', x, y, w, h, fill, stroke, sw, rx });
const line = (x1, y1, x2, y2, stroke, sw = 1, dash) => ({ k: 'line', x1, y1, x2, y2, stroke, sw, dash });
const text = (x, y, t, fs = 7, fill = '#475569', anchor = 'middle', bold = false) => ({ k: 'text', x, y, t, fs, fill, anchor, bold });

// ---- stalls ---------------------------------------------------------------
const STALL = {
  food: { label: 'Food Court', short: 'Food', category: 'food' },
  snack: { label: 'Snack Stall', short: 'Snack', category: 'food' },
  tea: { label: 'Tea Stall', short: 'Tea', category: 'food' },
  water: { label: 'Drinking Water', short: 'Water', category: 'water' },
  wc: { label: 'Restrooms', short: 'WC', category: 'restroom' },
};

// Adds a row of stalls along a platform. Each stall links to the one before it.
function addStalls(places, links, k, x, platformId, kinds, ys) {
  let previous = platformId;
  kinds.forEach((kind, i) => {
    const s = STALL[kind];
    const id = `s${k}_${kind}`;
    places.push({ id, name: `${s.label} (Platform ${k})`, short: s.short, category: s.category, x, y: ys[i], box: [28, 16] });
    links.push(walk(previous, id, 10));
    previous = id;
  });
}

// ---- Template 1: "through" - building on the left, footbridge on top ------
function buildThrough(n) {
  const x = (k) => 185 + (k - 1) * STEP;
  const room = (id, name, short, category, px, py) => ({ id, name, short, category, x: px, y: py, box: [48, 28] });

  const places = [
    { id: 'entrance', name: 'Main Entrance', short: 'Entrance', category: 'entrance', x: 80, y: 262 },
    { id: 'jlow', name: 'Corridor', short: '', category: 'corridor', x: 80, y: 235 },
    room('restroom1', 'Restrooms (Concourse)', 'Restroom', 'restroom', 40, 235),
    room('atm', 'ATM', 'ATM', 'atm', 120, 235),
    { id: 'jmid', name: 'Corridor', short: '', category: 'corridor', x: 80, y: 195 },
    room('waiting', 'Waiting Room', 'Waiting', 'waiting', 40, 195),
    room('medical', 'Medical Room (First Aid)', '+ Medical', 'medical', 120, 195),
    { id: 'concourse', name: 'Concourse', short: 'Concourse', category: 'junction', x: 80, y: 150 },
    room('police', 'Police Help Booth', 'Police', 'police', 40, 150),
    { id: 'jtop', name: 'Corridor', short: '', category: 'corridor', x: 80, y: 90 },
    room('ticket', 'Ticket Counter', 'Tickets', 'ticket', 40, 90),
    room('help', 'Help Desk', 'Help Desk', 'help', 120, 90),
    { id: 'bridgeW', name: 'Footbridge (station end)', short: '', category: 'junction', x: 80, y: 40 },
    { id: 'p1', name: 'Platform 1', short: 'PF 1', category: 'platform', x: x(1), y: 150 },
  ];
  const links = [
    walk('entrance', 'jlow', 15), walk('jlow', 'restroom1', 10), walk('jlow', 'atm', 10),
    walk('jlow', 'jmid', 20), walk('jmid', 'waiting', 10), walk('jmid', 'medical', 10),
    walk('jmid', 'concourse', 20), walk('concourse', 'police', 10), walk('concourse', 'jtop', 20),
    walk('jtop', 'ticket', 10), walk('jtop', 'help', 10),
    walk('concourse', 'p1', 30), // platform 1 is level with the concourse
    { a: 'concourse', b: 'bridgeW', meters: 20, mode: 'stairs' },
    { a: 'concourse', b: 'bridgeW', meters: 25, mode: 'lift' },
  ];

  // Platform 1 stalls (one above, two below)
  places.push({ id: 's1_water', name: 'Drinking Water (Platform 1)', short: 'Water', category: 'water', x: x(1), y: 95, box: [28, 16] });
  links.push(walk('p1', 's1_water', 10));
  addStalls(places, links, 1, x(1), 'p1', ['food', 'tea'], [195, 230]);

  // Platforms 2..n are reached over the footbridge (stairs or lift)
  let previousBridge = 'bridgeW';
  for (let k = 2; k <= n; k++) {
    places.push({ id: `bridge${k}`, name: `Footbridge (above Platform ${k})`, short: '', category: 'junction', x: x(k), y: 40 });
    places.push({ id: `p${k}`, name: `Platform ${k}`, short: `PF ${k}`, category: 'platform', x: x(k), y: 80 });
    links.push(walk(previousBridge, `bridge${k}`, k === 2 ? 45 : 25));
    links.push({ a: `bridge${k}`, b: `p${k}`, meters: 15, mode: 'stairs' });
    links.push({ a: `bridge${k}`, b: `p${k}`, meters: 20, mode: 'lift' });
    previousBridge = `bridge${k}`;

    const kinds = k % 3 === 2 ? ['snack', 'wc', 'water', 'tea'] : k % 3 === 0 ? ['food', 'water', 'wc'] : ['tea', 'water', 'snack', 'wc'];
    addStalls(places, links, k, x(k), `p${k}`, kinds, [115, 155, 195, 230]);
  }

  // Drawing
  const width = x(n) + 47;
  const base = [
    rect(0, 0, width, 330, '#eef2f7'),
    rect(0, 266, 150, 14, '#cbd5e1'),
    text(130, 276, 'ROAD', 6, '#475569', 'end'),
    rect(10, 22, 140, 244, '#f8fafc', '#94a3b8', 1.5, 4),
    text(80, 15, 'STATION BUILDING', 7, '#64748b'),
  ];
  const geo = [];
  for (let k = 1; k <= n; k++) {
    const px = x(k);
    const tx = px + 27;
    base.push(rect(px - 15, 25, 30, 245, '#e7e5e4'));
    base.push(line(px - 13, 25, px - 13, 270, '#facc15', 1.5));
    base.push(line(px + 13, 25, px + 13, 270, '#facc15', 1.5));
    base.push(line(tx, 25, tx, 270, '#a8a29e', 10, '1.5,3'));
    base.push(line(tx - 4, 25, tx - 4, 270, '#57534e', 1.2));
    base.push(line(tx + 4, 25, tx + 4, 270, '#57534e', 1.2));
    base.push(text(tx, 279, `Track ${k}`, 6, '#57534e'));
    geo.push({ id: `p${k}`, x: px, trackX: tx, coachY0: 54, coachN: 8, boardY: 291, boardY2: 302, top: 25, bottom: 270 });
  }
  base.push(rect(70, 33, x(n) + 33 - 70, 14, '#cbd5e1', '#64748b', 1));
  base.push(text(180, 43, 'FOOTBRIDGE', 7, '#475569'));
  const over = [
    text(80, 291, 'Entrance', 7, '#111827', 'middle', true),
    text(112, 144, 'Concourse', 7, '#475569'),
  ];
  return { places, links, decor: { width, height: 330, base, over, geo } };
}

// ---- Template 2: "terminus" - tracks end at a hall along the bottom -------
function buildTerminus(n) {
  const x = (k) => 60 + (k - 1) * STEP;
  const width = x(n) + 47;
  const places = [{ id: 'entrance', name: 'Main Entrance', short: 'Entrance', category: 'entrance', x: 16, y: 262 }];
  const links = [];

  // The spine: a corridor along the hall, with a spot at every platform and
  // extra spots between platforms 1-4 where rooms attach.
  const spine = [{ id: 'entrance', x: 16 }];
  for (let k = 1; k <= n; k++) {
    places.push({ id: `sp${k}`, name: 'Corridor', short: '', category: 'corridor', x: x(k), y: 262 });
    spine.push({ id: `sp${k}`, x: x(k) });
    if (k <= 4) {
      places.push({ id: `rj${k}`, name: 'Corridor', short: '', category: 'corridor', x: x(k) + 27, y: 262 });
      spine.push({ id: `rj${k}`, x: x(k) + 27 });
    }
  }
  for (let i = 0; i < spine.length - 1; i++) {
    links.push(walk(spine[i].id, spine[i + 1].id, Math.max(5, Math.round((spine[i + 1].x - spine[i].x) / 2))));
  }

  // Rooms: one above and one below the spine at each of the 4 room spots
  const rooms = [
    ['ticket', 'Ticket Counter', 'Tickets', 'ticket', 'rj1', 240], ['help', 'Help Desk', 'Help Desk', 'help', 'rj1', 284],
    ['police', 'Police Help Booth', 'Police', 'police', 'rj2', 240], ['medical', 'Medical Room (First Aid)', '+ Medical', 'medical', 'rj2', 284],
    ['atm', 'ATM', 'ATM', 'atm', 'rj3', 240], ['restroom1', 'Restrooms (Concourse)', 'Restroom', 'restroom', 'rj3', 284],
    ['waiting', 'Waiting Room', 'Waiting', 'waiting', 'rj4', 240], ['foodhall', 'Food Court (Concourse)', 'Food', 'food', 'rj4', 284],
  ];
  rooms.forEach(([id, name, short, category, spot, y]) => {
    const spotPlace = places.find((p) => p.id === spot);
    places.push({ id, name, short, category, x: spotPlace.x, y, box: [44, 28] });
    links.push(walk(spot, id, 10));
  });

  // Platforms: each platform node sits just above the hall, stalls run up the platform
  const base = [
    rect(0, 0, width, 325, '#eef2f7'),
    rect(10, 225, width - 20, 75, '#f8fafc', '#94a3b8', 1.5, 4),
    text(width / 2, 316, 'STATION CONCOURSE - all platforms are at ground level', 7, '#64748b'),
  ];
  const geo = [];
  for (let k = 1; k <= n; k++) {
    const px = x(k);
    const tx = px + 27;
    places.push({ id: `p${k}`, name: `Platform ${k}`, short: `PF ${k}`, category: 'platform', x: px, y: 208 });
    links.push(walk(`sp${k}`, `p${k}`, 15));
    const kinds = k % 3 === 1 ? ['water', 'food', 'tea'] : k % 3 === 2 ? ['wc', 'snack', 'water', 'tea'] : ['food', 'water', 'wc'];
    addStalls(places, links, k, px, `p${k}`, kinds, [180, 150, 120, 90]);

    base.push(rect(px - 15, 35, 30, 190, '#e7e5e4'));
    base.push(line(px - 13, 35, px - 13, 225, '#facc15', 1.5));
    base.push(line(px + 13, 35, px + 13, 225, '#facc15', 1.5));
    base.push(line(tx, 35, tx, 222, '#a8a29e', 10, '1.5,3'));
    base.push(line(tx - 4, 35, tx - 4, 222, '#57534e', 1.2));
    base.push(line(tx + 4, 35, tx + 4, 222, '#57534e', 1.2));
    base.push(rect(tx - 6, 219, 12, 5, '#57534e')); // buffer stop
    base.push(text(tx, 32, `Track ${k}`, 6, '#57534e'));
    geo.push({ id: `p${k}`, x: px, trackX: tx, coachY0: 40, coachN: 7, boardY: 12, boardY2: 23, top: 35, bottom: 225 });
  }
  const over = [text(10, 311, 'Entrance', 7, '#111827', 'start', true)];
  return { places, links, decor: { width, height: 325, base, over, geo } };
}

// ---- Public: get one station, built once and remembered -------------------
const cache = {};

export function getStation(id) {
  if (cache[id]) return cache[id];
  const raw = STATION_LIST.find((s) => s.id === id);
  const built = raw.layout === 'terminus' ? buildTerminus(raw.platforms) : buildThrough(raw.platforms);
  const placeById = Object.fromEntries(built.places.map((p) => [p.id, p]));
  const choosable = built.places.filter((p) => p.category !== 'junction' && p.category !== 'corridor');
  cache[id] = { ...raw, ...built, placeById, choosable };
  return cache[id];
}
