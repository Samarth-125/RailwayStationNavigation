// Helpers that turn a plain train record into everything the screens need:
// expected time, minutes left, and a clear status sentence.

const HALT_MIN = 5; // a train waits about 5 minutes at the platform

export function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export function toClock(minutes) {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// train: { scheduled: '10:40', delayMin?: 12, platformId, previousPlatformId?, cancelled? }
// nowMin: the current time in minutes since midnight.
export function enrich(train, nowMin) {
  const delayMin = train.delayMin || 0;
  const expectedMin = toMinutes(train.scheduled) + delayMin;
  const etaMin = expectedMin - nowMin; // minutes until it arrives

  let state = 'arriving';
  if (train.cancelled) state = 'cancelled';
  else if (etaMin <= -HALT_MIN) state = 'departed';
  else if (etaMin <= 0) state = 'at_platform';

  return {
    ...train,
    delayMin,
    expected: toClock(expectedMin),
    etaMin,
    state,
    // true only while the passenger still needs to know about the change
    platformChanged: Boolean(train.previousPlatformId) && state !== 'departed' && state !== 'cancelled',
  };
}

// Trains still to come (or at the platform) for one platform, earliest first.
export function activeTrainsAt(trains, platformId) {
  return trains
    .filter((t) => t.platformId === platformId && t.state !== 'departed' && t.state !== 'cancelled')
    .sort((a, b) => a.etaMin - b.etaMin);
}
