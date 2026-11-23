const STEP_FREE_MODES = ['walk', 'ramp', 'lift'];

// For each station, the "neighbours" list is built ONCE and remembered.
const graphCache = {};
function graphOf(station) {
  if (graphCache[station.id]) return graphCache[station.id];
  const graph = {};
  station.places.forEach((p) => (graph[p.id] = []));
  station.links.forEach((l) => {
    graph[l.a].push({ to: l.b, meters: l.meters, mode: l.mode });
    graph[l.b].push({ to: l.a, meters: l.meters, mode: l.mode }); // both directions
  });
  graphCache[station.id] = graph;
  return graph;
}

// Platforms can be marked closed. A place is "on a closed platform" if it is that
// platform itself or one of its stalls (ids look like p3 and s3_tea).
export function platformOf(placeId) {
  const m = /^p(\d+)$/.exec(placeId) || /^s(\d+)_/.exec(placeId);
  return m ? `p${m[1]}` : null;
}
export function isClosedPlace(placeId, closedIds) {
  const p = platformOf(placeId);
  return Boolean(p) && (closedIds || []).includes(p);
}

// Dijkstra's algorithm: the shortest distance from one place to EVERY other place.
// stepFreeOnly = true means: skip stairs and escalators.
// closedIds = platforms that are closed: the route may not enter them.
function shortestPaths(station, fromId, stepFreeOnly, closedIds) {
  const graph = graphOf(station);
  const dist = {};
  const cameFrom = {}; // remembers the hop used to reach each place
  const unvisited = new Set();
  station.places.forEach((p) => {
    dist[p.id] = Infinity;
    unvisited.add(p.id);
  });
  dist[fromId] = 0;

  while (unvisited.size > 0) {
    let current = null; // the closest unvisited place
    unvisited.forEach((id) => {
      if (current === null || dist[id] < dist[current]) current = id;
    });
    if (dist[current] === Infinity) break; // the rest cannot be reached
    unvisited.delete(current);

    graph[current].forEach((edge) => {
      if (stepFreeOnly && !STEP_FREE_MODES.includes(edge.mode)) return;
      // (If you are standing on a closed platform, you may still walk off it.)
      if (isClosedPlace(edge.to, closedIds) && platformOf(edge.to) !== platformOf(fromId)) return;
      const newDist = dist[current] + edge.meters;
      if (newDist < dist[edge.to]) {
        dist[edge.to] = newDist;
        cameFrom[edge.to] = { from: current, mode: edge.mode, meters: edge.meters };
      }
    });
  }
  return { dist, cameFrom };
}

// Joins hops that pass through unnamed corridor spots into ONE step,
// so passengers get "Walk to Concourse (55 m)" and not four tiny steps.
function makeSteps(station, hops) {
  const steps = [];
  let i = 0;
  while (i < hops.length) {
    let { to, mode, meters } = hops[i];
    while (
      station.placeById[to].category === 'corridor' &&
      i + 1 < hops.length &&
      hops[i + 1].mode === mode
    ) {
      i += 1;
      to = hops[i].to;
      meters += hops[i].meters;
    }
    steps.push({ mode, toId: to, meters }); // turned into a sentence in utils/i18n.js
    i += 1;
  }
  return steps;
}

// Route from one place to another.
// Returns { totalMeters, steps: [{mode, toId, meters}...], path: [placeId...] } or null if no route.
export function findRoute(station, fromId, toId, stepFreeOnly, closedIds = []) {
  if (!fromId || !toId) return null;
  const { dist, cameFrom } = shortestPaths(station, fromId, stepFreeOnly, closedIds);
  if (dist[toId] === Infinity) return null;

  const path = [toId];
  const hops = [];
  let id = toId;
  while (id !== fromId) {
    const hop = cameFrom[id];
    hops.unshift({ to: id, mode: hop.mode, meters: hop.meters });
    id = hop.from;
    path.unshift(id);
  }
  return { totalMeters: dist[toId], steps: makeSteps(station, hops), path };
}

// Closest place of one category (e.g. 'restroom') from where you are.
// Returns { id, meters } or null if none can be reached.
export function findNearest(station, fromId, category, stepFreeOnly, closedIds = []) {
  const { dist } = shortestPaths(station, fromId, stepFreeOnly, closedIds);
  let best = null;
  station.places.forEach((p) => {
    if (p.category !== category || dist[p.id] === Infinity) return;
    if (best === null || dist[p.id] < best.meters) best = { id: p.id, meters: dist[p.id] };
  });
  return best;
}
