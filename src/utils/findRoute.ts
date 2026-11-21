import { links, places, type Link } from '@/data/stationData';

const STEP_FREE_MODES = new Set(['walk', 'ramp', 'lift']);

export type RouteStep = {
  text: string;
  meters: number;
  mode: Link['mode'];
};

export type Route = {
  totalMeters: number;
  steps: RouteStep[];
};

function describe(mode: Link['mode'], placeName: string, meters: number) {
  const action =
    mode === 'stairs' ? 'Take the stairs to' :
    mode === 'lift' ? 'Take the lift to' :
    mode === 'ramp' ? 'Take the ramp to' : 'Walk to';
  return `${action} ${placeName}`;
}

// Dijkstra's algorithm finds the shortest path by the sample distances.
export function findRoute(
  fromId: string | null,
  toId: string | null,
  stepFreeOnly: boolean,
): Route | null {
  if (!fromId || !toId) return null;
  if (fromId === toId) return { totalMeters: 0, steps: [] };

  const distance = new Map(places.map((place) => [place.id, Infinity]));
  const previous = new Map<string, { from: string; link: Link }>();
  const unvisited = new Set(places.map((place) => place.id));
  distance.set(fromId, 0);

  while (unvisited.size > 0) {
    let current: string | null = null;
    for (const id of unvisited) {
      if (current === null || distance.get(id)! < distance.get(current)!) current = id;
    }
    if (current === null || distance.get(current) === Infinity) break;
    unvisited.delete(current);
    if (current === toId) break;

    for (const link of links) {
      if (stepFreeOnly && !STEP_FREE_MODES.has(link.mode)) continue;
      const next = link.a === current ? link.b : link.b === current ? link.a : null;
      if (!next || !unvisited.has(next)) continue;
      const candidate = distance.get(current)! + link.meters;
      if (candidate < distance.get(next)!) {
        distance.set(next, candidate);
        previous.set(next, { from: current, link });
      }
    }
  }

  const totalMeters = distance.get(toId);
  if (totalMeters === undefined || totalMeters === Infinity) return null;

  const reversedSteps: RouteStep[] = [];
  let currentId = toId;
  while (currentId !== fromId) {
    const hop = previous.get(currentId);
    if (!hop) return null;
    const placeName = places.find((place) => place.id === currentId)?.name;
    if (!placeName) return null;
    reversedSteps.push({
      text: describe(hop.link.mode, placeName, hop.link.meters),
      meters: hop.link.meters,
      mode: hop.link.mode,
    });
    currentId = hop.from;
  }

  return { totalMeters, steps: reversedSteps.reverse() };
}
