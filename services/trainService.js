import { baseTrains, demoSteps } from '../data/sampleTrains';
import { toMinutes } from '../utils/trainStatus';

// THE ONLY PLACE THAT KNOWS WHERE TRAIN DATA COMES FROM.
// Right now it builds made-up trains and replays a pretend story (demoSteps).
// If you ever get permitted access to a real train-data source, replace the body
// of this function and keep the same return shape - no screen needs to change.
// (No free official public API for live train status was found; see the notes.)
//
// step = which part of the demo story to show (0 = first).
// Returns: { source: 'SAMPLE', nowMin, note, noteHi, trains: [ { id, number, name, route,
//            scheduled, delayMin?, platformId, previousPlatformId? } ] }
export async function getTrains(step = 0) {
  await new Promise((resolve) => setTimeout(resolve, 300)); // pretend network delay

  // Start from the planned trains, then apply every change up to this step.
  const trains = {};
  baseTrains.forEach((t) => (trains[t.id] = { ...t }));
  for (let i = 0; i <= step && i < demoSteps.length; i++) {
    Object.entries(demoSteps[i].changes).forEach(([id, change]) => {
      const train = trains[id];
      if (change.platformId && change.platformId !== train.platformId) {
        train.previousPlatformId = train.platformId; // remember the old platform
      }
      Object.assign(train, change);
    });
  }

  const current = demoSteps[Math.min(step, demoSteps.length - 1)];
  return {
    source: 'SAMPLE',
    nowMin: toMinutes(current.now),
    note: current.note,
    noteHi: current.noteHi,
    trains: Object.values(trains),
  };
}

export const LAST_STEP = demoSteps.length - 1;
