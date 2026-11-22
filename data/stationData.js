// SAMPLE DATA ONLY - a made-up station for the demo.
// It is NOT real railway information.

export const STATION_NAME = 'Demo Junction (Sample Station)';

// Every place. x and y are positions on the map (map size is 340 x 330).
// box = [width, height] of the room or stall drawn on the map.
// category 'junction' = named pass-through points (Concourse, Footbridge parts).
// category 'corridor' = unnamed spots in the corridors (hidden from the user).
export const places = [
  // --- Station building: corridor runs up the middle (x = 80) ---
  { id: 'entrance', name: 'Main Entrance', short: 'Entrance', category: 'entrance', x: 80, y: 262 },
  { id: 'jlow', name: 'Corridor', short: '', category: 'corridor', x: 80, y: 235 },
  { id: 'restroom1', name: 'Restrooms (Concourse)', short: 'Restroom', category: 'restroom', x: 40, y: 235, box: [48, 28] },
  { id: 'atm', name: 'ATM', short: 'ATM', category: 'atm', x: 120, y: 235, box: [48, 28] },
  { id: 'jmid', name: 'Corridor', short: '', category: 'corridor', x: 80, y: 195 },
  { id: 'waiting', name: 'Waiting Room', short: 'Waiting', category: 'waiting', x: 40, y: 195, box: [48, 28] },
  { id: 'medical', name: 'Medical Room (First Aid)', short: '+ Medical', category: 'medical', x: 120, y: 195, box: [48, 28] },
  { id: 'concourse', name: 'Concourse', short: 'Concourse', category: 'junction', x: 80, y: 150 },
  { id: 'police', name: 'Police Help Booth', short: 'Police', category: 'police', x: 40, y: 150, box: [48, 28] },
  { id: 'jtop', name: 'Corridor', short: '', category: 'corridor', x: 80, y: 90 },
  { id: 'ticket', name: 'Ticket Counter', short: 'Tickets', category: 'ticket', x: 40, y: 90, box: [48, 28] },
  { id: 'help', name: 'Help Desk', short: 'Help Desk', category: 'help', x: 120, y: 90, box: [48, 28] },

  // --- Footbridge (over the tracks, at the top of the map) ---
  { id: 'bridgeW', name: 'Footbridge (station end)', short: '', category: 'junction', x: 80, y: 40 },
  { id: 'bridge2', name: 'Footbridge (above Platform 2)', short: '', category: 'junction', x: 239, y: 40 },
  { id: 'bridge3', name: 'Footbridge (above Platform 3)', short: '', category: 'junction', x: 293, y: 40 },

  // --- Platform 1 (next to the station building) ---
  { id: 'p1', name: 'Platform 1', short: 'PF 1', category: 'platform', x: 185, y: 150 },
  { id: 'water1', name: 'Drinking Water (Platform 1)', short: 'Water', category: 'water', x: 185, y: 95, box: [28, 16] },
  { id: 'food1', name: 'Food Court (Platform 1)', short: 'Food', category: 'food', x: 185, y: 195, box: [28, 16] },
  { id: 'tea1', name: 'Tea Stall (Platform 1)', short: 'Tea', category: 'food', x: 185, y: 230, box: [28, 16] },

  // --- Platform 2 ---
  { id: 'p2', name: 'Platform 2', short: 'PF 2', category: 'platform', x: 239, y: 80 },
  { id: 'snack2', name: 'Snack Stall (Platform 2)', short: 'Snack', category: 'food', x: 239, y: 115, box: [28, 16] },
  { id: 'restroom2', name: 'Restrooms (Platform 2)', short: 'WC', category: 'restroom', x: 239, y: 155, box: [28, 16] },
  { id: 'water2', name: 'Drinking Water (Platform 2)', short: 'Water', category: 'water', x: 239, y: 195, box: [28, 16] },
  { id: 'tea2', name: 'Tea Stall (Platform 2)', short: 'Tea', category: 'food', x: 239, y: 230, box: [28, 16] },

  // --- Platform 3 ---
  { id: 'p3', name: 'Platform 3', short: 'PF 3', category: 'platform', x: 293, y: 80 },
  { id: 'food3', name: 'Food Stall (Platform 3)', short: 'Food', category: 'food', x: 293, y: 115, box: [28, 16] },
  { id: 'water3', name: 'Drinking Water (Platform 3)', short: 'Water', category: 'water', x: 293, y: 155, box: [28, 16] },
  { id: 'restroom3', name: 'Restrooms (Platform 3)', short: 'WC', category: 'restroom', x: 293, y: 195, box: [28, 16] },
];

// Quick lookup: placeById['p1'] gives the Platform 1 object.
export const placeById = Object.fromEntries(places.map((p) => [p.id, p]));

// Places the passenger can choose (hides junctions and corridors).
export const choosablePlaces = places.filter(
  (p) => p.category !== 'junction' && p.category !== 'corridor'
);

// The categories shown on the Facilities tab (emergency ones first).
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

// Connections between places. meters = distance, mode = how you travel it.
// Stairs and escalators are NOT step-free. Walk, ramp and lift are.
export const links = [
  // Station building corridor
  { a: 'entrance', b: 'jlow', meters: 15, mode: 'walk' },
  { a: 'jlow', b: 'restroom1', meters: 10, mode: 'walk' },
  { a: 'jlow', b: 'atm', meters: 10, mode: 'walk' },
  { a: 'jlow', b: 'jmid', meters: 20, mode: 'walk' },
  { a: 'jmid', b: 'waiting', meters: 10, mode: 'walk' },
  { a: 'jmid', b: 'medical', meters: 10, mode: 'walk' },
  { a: 'jmid', b: 'concourse', meters: 20, mode: 'walk' },
  { a: 'concourse', b: 'police', meters: 10, mode: 'walk' },
  { a: 'concourse', b: 'jtop', meters: 20, mode: 'walk' },
  { a: 'jtop', b: 'ticket', meters: 10, mode: 'walk' },
  { a: 'jtop', b: 'help', meters: 10, mode: 'walk' },

  // Platform 1 is on the same level as the concourse
  { a: 'concourse', b: 'p1', meters: 30, mode: 'walk' },
  { a: 'p1', b: 'water1', meters: 10, mode: 'walk' },
  { a: 'p1', b: 'food1', meters: 10, mode: 'walk' },
  { a: 'food1', b: 'tea1', meters: 10, mode: 'walk' },

  // Platforms 2 and 3 are reached over the footbridge (stairs or lift)
  { a: 'concourse', b: 'bridgeW', meters: 20, mode: 'stairs' },
  { a: 'concourse', b: 'bridgeW', meters: 25, mode: 'lift' },
  { a: 'bridgeW', b: 'bridge2', meters: 45, mode: 'walk' },
  { a: 'bridge2', b: 'bridge3', meters: 25, mode: 'walk' },
  { a: 'bridge2', b: 'p2', meters: 15, mode: 'stairs' },
  { a: 'bridge2', b: 'p2', meters: 20, mode: 'lift' },
  { a: 'bridge3', b: 'p3', meters: 15, mode: 'stairs' },
  { a: 'bridge3', b: 'p3', meters: 20, mode: 'lift' },

  // Walking along platform 2 (stalls are in a row)
  { a: 'p2', b: 'snack2', meters: 10, mode: 'walk' },
  { a: 'snack2', b: 'restroom2', meters: 10, mode: 'walk' },
  { a: 'restroom2', b: 'water2', meters: 10, mode: 'walk' },
  { a: 'water2', b: 'tea2', meters: 10, mode: 'walk' },

  // Walking along platform 3
  { a: 'p3', b: 'food3', meters: 10, mode: 'walk' },
  { a: 'food3', b: 'water3', meters: 10, mode: 'walk' },
  { a: 'water3', b: 'restroom3', meters: 10, mode: 'walk' },
];
