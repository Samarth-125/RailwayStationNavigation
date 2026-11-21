// SAMPLE DATA ONLY - a made-up station for the demo.
// It is NOT real railway information.

export const STATION_NAME = 'Demo Junction (Sample Station)';

// Every place. x and y are positions on the schematic map (0-300, 0-200).
// category "junction" = helper places passengers pass through.
export const places = [
  { id: 'entrance', name: 'Main Entrance', short: 'Entrance', category: 'entrance', x: 30, y: 100 },
  { id: 'atm', name: 'ATM', short: 'ATM', category: 'atm', x: 30, y: 50 },
  { id: 'ticket', name: 'Ticket Counter', short: 'Tickets', category: 'ticket', x: 100, y: 50 },
  { id: 'help', name: 'Help Desk', short: 'Help', category: 'help', x: 160, y: 50 },
  { id: 'restroom1', name: 'Restrooms (Concourse)', short: 'Restroom', category: 'restroom', x: 40, y: 155 },
  { id: 'waiting', name: 'Waiting Room', short: 'Waiting', category: 'waiting', x: 100, y: 155 },
  { id: 'food', name: 'Food Court', short: 'Food', category: 'food', x: 160, y: 155 },
  { id: 'water1', name: 'Drinking Water (Platform 1)', short: 'Water', category: 'water', x: 230, y: 155 },
  { id: 'p1', name: 'Platform 1', short: 'Plat 1', category: 'platform', x: 230, y: 100 },
  { id: 'p2', name: 'Platform 2', short: 'Plat 2', category: 'platform', x: 225, y: 15 },
  { id: 'restroom2', name: 'Restrooms (Platform 2)', short: 'Restroom', category: 'restroom', x: 225, y: 55 },
  { id: 'p3', name: 'Platform 3', short: 'Plat 3', category: 'platform', x: 275, y: 55 },
  { id: 'concourse', name: 'Concourse', short: 'Concourse', category: 'junction', x: 100, y: 100 },
  { id: 'bridge', name: 'Footbridge', short: 'Footbridge', category: 'junction', x: 160, y: 15 },
];

// Quick lookup: placeById['p1'] gives the Platform 1 object.
export const placeById = Object.fromEntries(places.map((p) => [p.id, p]));

// The categories shown on the Facilities tab.
export const CATEGORIES = [
  { key: 'restroom', label: 'Restrooms' },
  { key: 'food', label: 'Food' },
  { key: 'water', label: 'Drinking water' },
  { key: 'atm', label: 'ATM' },
  { key: 'help', label: 'Help desk' },
  { key: 'waiting', label: 'Waiting room' },
  { key: 'ticket', label: 'Ticket counter' },
];

// Connections between places. meters = distance, mode = how you travel it.
// Stairs and escalators are NOT step-free. Walk, ramp and lift are.
export const links = [
  { a: 'entrance', b: 'concourse', meters: 40, mode: 'walk' },
  { a: 'entrance', b: 'atm', meters: 15, mode: 'walk' },
  { a: 'concourse', b: 'ticket', meters: 15, mode: 'walk' },
  { a: 'concourse', b: 'help', meters: 20, mode: 'walk' },
  { a: 'concourse', b: 'restroom1', meters: 20, mode: 'walk' },
  { a: 'concourse', b: 'waiting', meters: 30, mode: 'walk' },
  { a: 'concourse', b: 'food', meters: 25, mode: 'walk' },
  { a: 'concourse', b: 'p1', meters: 30, mode: 'walk' },
  { a: 'food', b: 'p1', meters: 20, mode: 'walk' },
  { a: 'p1', b: 'water1', meters: 10, mode: 'walk' },

  // Platforms 2 and 3 are reached over the footbridge
  { a: 'concourse', b: 'bridge', meters: 20, mode: 'stairs' },
  { a: 'concourse', b: 'bridge', meters: 25, mode: 'lift' },
  { a: 'bridge', b: 'p2', meters: 15, mode: 'stairs' },
  { a: 'bridge', b: 'p2', meters: 20, mode: 'lift' },
  { a: 'bridge', b: 'p3', meters: 25, mode: 'stairs' },
  { a: 'bridge', b: 'p3', meters: 30, mode: 'lift' },
  { a: 'p2', b: 'restroom2', meters: 10, mode: 'walk' },
];
