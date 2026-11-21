import { places, links, placeById } from '../data/stationData';

const STEP_FREE_MODES = ['walk', 'ramp', 'lift'];

// Built ONCE when the app starts: for each place, the list of places next to it.
const graph = {};
places.forEach((p) => (graph[p.id] = []));
links.forEach((l) => {
  graph[l.a].push({ to: l.b, meters: l.meters, mode: l.mode });
  graph[l.b].push({ to: l.a, meters: l.meters, mode: l.mode }); // both directions
});

// Turns one hop into a sentence a passenger can follow.
function describe(mode, toId, meters) {
  const to = placeById[toId].name;
  if (mode === 'stairs') return `Take the stairs to ${to} (${meters} m)`;
  if (mode === 'lift') return `Take the lift to ${to} (${meters} m)`;
  if (mode === 'ramp') return `Take the ramp to ${to} (${meters} m)`;
  return `Walk to ${to} (${meters} m)`;
}

// Dijkstra's algorithm: the shortest distance from one place to EVERY other place.
// stepFreeOnly = true means: skip stairs and escalators.
function shortestPaths(fromId, stepFreeOnly) {
  const dist = {};
  const cameFrom = {}; // remembers the hop used to reach each place
  const unvisited = new Set();
  places.forEach((p) => {
    dist[p.id] = Infinity;
    unvisited.add(p.id);
  });
  dist[fromId] = 0;

  while (unvisited.size > 0) {
    // pick the closest unvisited place
    let current = null;
    unvisited.forEach((id) => {
      if (current === null || dist[id] < dist[current]) current = id;
    });
    if (dist[current] === Infinity) break; // the rest cannot be reached
    unvisited.delete(current);

    graph[current].forEach((edge) => {
      if (stepFreeOnly && !STEP_FREE_MODES.includes(edge.mode)) return;
      const newDist = dist[current] + edge.meters;
      if (newDist < dist[edge.to]) {
        dist[edge.to] = newDist;
        cameFrom[edge.to] = { from: current, mode: edge.mode, meters: edge.meters };
      }
    });
  }
  return { dist, cameFrom };
}

// Route from one place to another.
// Returns { totalMeters, steps: [text...], path: [placeId...] } or null if no route.
export function findRoute(fromId, toId, stepFreeOnly) {
  if (!fromId || !toId) return null;
  const { dist, cameFrom } = shortestPaths(fromId, stepFreeOnly);
  if (dist[toId] === Infinity) return null;

  const path = [toId];
  const steps = [];
  let id = toId;
  while (id !== fromId) {
    const hop = cameFrom[id];
    steps.unshift(describe(hop.mode, id, hop.meters));
    id = hop.from;
    path.unshift(id);
  }
  return { totalMeters: dist[toId], steps, path };
}

// Closest place of one category (e.g. 'restroom') from where you are.
// Returns { id, meters } or null if none can be reached.
export function findNearest(fromId, category, stepFreeOnly) {
  const { dist } = shortestPaths(fromId, stepFreeOnly);
  let best = null;
  places.forEach((p) => {
    if (p.category !== category || dist[p.id] === Infinity) return;
    if (best === null || dist[p.id] < best.meters) best = { id: p.id, meters: dist[p.id] };
  });
  return best;
}
