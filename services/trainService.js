import { buildSampleStory } from '../data/sampleTrains';

// SAMPLE (made-up) trains for the demo.
// The demo clock starts at 10:00 and runs by itself (hooks/useTrains.js).
// Given a station and a clock time, this works out the trains as they would look at
// that moment: every step whose time has come has already happened.
// Live data (if you add a key) is in services/liveTrainService.js.
//
// Returns: { source: 'SAMPLE', nowMin, note, noteHi, trains: [ { id, number, name, route,
//            destId, scheduled, delayMin?, platformId, previousPlatformId? } ] }
export function getTrainsAt(station, nowMin) {
  const story = buildSampleStory(station);
  const trains = {};
  story.trains.forEach((t) => (trains[t.id] = { ...t }));

  let current = null; // the latest step that has happened
  story.steps.forEach((step) => {
    const [h, m] = step.now.split(':').map(Number);
    if (h * 60 + m > nowMin) return;
    current = step;
    Object.entries(step.changes).forEach(([id, change]) => {
      const train = trains[id];
      if (change.platformId && change.platformId !== train.platformId) {
        train.previousPlatformId = train.platformId; // remember the old platform
      }
      Object.assign(train, change);
    });
  });

  return {
    source: 'SAMPLE',
    nowMin,
    note: current ? current.note : '',
    noteHi: current ? current.noteHi : '',
    trains: Object.values(trains),
  };
}

export const DEMO_START = 10 * 60; // 10:00
export const DEMO_END = 12 * 60 + 5; // 12:05 - by then every train has left
