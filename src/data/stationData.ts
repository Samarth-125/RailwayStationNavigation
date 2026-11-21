// Fictional locations and distances for the student demo. Not live station data.
export const STATION_NAME = 'Demo Junction';

export type Place = {
  id: string;
  name: string;
  type: 'Entrance' | 'Facility' | 'Platform' | 'Hidden';
};

export type Link = {
  a: string;
  b: string;
  meters: number;
  mode: 'walk' | 'stairs' | 'lift' | 'ramp';
};

export const places: Place[] = [
  { id: 'entrance', name: 'Main Entrance', type: 'Entrance' },
  { id: 'ticket', name: 'Ticket Counter', type: 'Facility' },
  { id: 'restroom', name: 'Restrooms', type: 'Facility' },
  { id: 'food', name: 'Food Court', type: 'Facility' },
  { id: 'waiting', name: 'Waiting Room', type: 'Facility' },
  { id: 'help', name: 'Help Desk', type: 'Facility' },
  { id: 'water', name: 'Drinking Water', type: 'Facility' },
  { id: 'p1', name: 'Platform 1', type: 'Platform' },
  { id: 'p2', name: 'Platform 2', type: 'Platform' },
  { id: 'p3', name: 'Platform 3', type: 'Platform' },
  { id: 'concourse', name: 'Concourse', type: 'Hidden' },
  { id: 'bridge', name: 'Footbridge', type: 'Hidden' },
];

// Every distance and connection below is invented for demonstration.
export const links: Link[] = [
  { a: 'entrance', b: 'concourse', meters: 40, mode: 'walk' },
  { a: 'concourse', b: 'ticket', meters: 15, mode: 'walk' },
  { a: 'concourse', b: 'restroom', meters: 20, mode: 'walk' },
  { a: 'concourse', b: 'food', meters: 25, mode: 'walk' },
  { a: 'concourse', b: 'waiting', meters: 30, mode: 'walk' },
  { a: 'concourse', b: 'help', meters: 12, mode: 'walk' },
  { a: 'concourse', b: 'water', meters: 10, mode: 'walk' },
  { a: 'concourse', b: 'p1', meters: 30, mode: 'walk' },
  { a: 'food', b: 'p1', meters: 20, mode: 'walk' },
  { a: 'concourse', b: 'bridge', meters: 20, mode: 'stairs' },
  { a: 'concourse', b: 'bridge', meters: 25, mode: 'lift' },
  { a: 'bridge', b: 'p2', meters: 15, mode: 'stairs' },
  { a: 'bridge', b: 'p2', meters: 20, mode: 'lift' },
  { a: 'bridge', b: 'p3', meters: 25, mode: 'stairs' },
  { a: 'bridge', b: 'p3', meters: 30, mode: 'lift' },
];
