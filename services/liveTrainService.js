import { LIVE } from '../config';

// LIVE train data from RailRadar (a third-party service that republishes railway data).
// It asks for the "live station board": the trains due at ONE station in the next few hours.
// Docs used: https://railradar.in/docs/station-live-board
//   GET {baseUrl}/v1/stations/{code}/live?hours=4      Authorization: Bearer <key>
//
// NOT VERIFIED against the real server (no key was available while writing this).
// It was tested only with a pretend response copied from the documented format.
// If something looks wrong on your phone, the error message on the Trains tab says why.

export class LiveError extends Error {
  constructor(code) {
    super(code);
    this.code = code; // nokey | auth | limit | network | server | format
  }
}

export function isLiveConfigured() {
  return Boolean(LIVE.apiKey);
}

// Current time in India (IST = UTC + 5:30), as minutes since midnight.
export function istNowMinutes(date = new Date()) {
  const d = new Date(date.getTime() + 330 * 60000);
  return d.getUTCHours() * 60 + d.getUTCMinutes();
}

// The board gives the platform as text ("3"). Our maps have platforms p1..pN.
// Anything else (for example "1A", or a number beyond our map) becomes null =
// "platform not known".
export function platformToId(value, platformCount) {
  if (!/^\d+$/.test(String(value == null ? '' : value).trim())) return null;
  const n = Number(value);
  return n >= 1 && n <= platformCount ? `p${n}` : null;
}

// The board shows ONE platform per train. To spot a platform CHANGE we remember
// what we saw last time. So a change is only noticed while the app is open.
const seenPlatform = new Map(); // "NDLS|12951-2026-11-24" -> { current, previous }

const pad = (hhmm) => hhmm.split(':').map((x) => x.padStart(2, '0')).join(':');
const minutes = (hhmm) => Number(hhmm.split(':')[0]) * 60 + Number(hhmm.split(':')[1]);

// Turns the server's answer into the same train shape the sample data uses.
export function parseBoard(json, station) {
  const list = json && json.data && json.data.trains;
  if (!Array.isArray(list)) throw new LiveError('format');

  const trains = [];
  list.forEach((e) => {
    if (!e || !e.train || !e.stop) return;
    if (e.stop.isHalt === false) return; // passes through, does not stop here
    const when = e.stop.arrival || e.stop.departure;
    if (!/^\d{1,2}:\d{2}$/.test(when || '')) return;

    const id = `${e.train.number}-${(e.live && e.live.startDate) || ''}`;
    const platformId = platformToId(e.stop.platform, station.platforms);

    const key = `${station.id}|${id}`;
    const seen = seenPlatform.get(key) || { current: null, previous: null };
    if (platformId && seen.current && seen.current !== platformId) {
      seen.previous = seen.current; // the platform changed since we last looked
    }
    if (platformId) seen.current = platformId;
    seenPlatform.set(key, seen);

    const delay = e.live && Number.isFinite(e.live.delayMinutes) ? e.live.delayMinutes : null;
    trains.push({
      id,
      number: String(e.train.number),
      name: e.train.name || String(e.train.number),
      route: `${e.train.source || '?'} to ${e.train.destination || '?'}`,
      scheduled: pad(when),
      delayMin: delay === null ? 0 : delay,
      delayKnown: delay !== null, // false = the server did not give a delay
      platformId, // null = platform not announced / not on our map
      previousPlatformId: seen.previous && seen.previous !== platformId ? seen.previous : null,
    });
  });

  trains.sort((a, b) => minutes(a.scheduled) - minutes(b.scheduled));
  return trains.slice(0, 15); // keep the list short on a phone
}

// options.apiKey / options.fetch exist so tests can pretend; the app uses the defaults.
export async function getLiveTrains(station, options = {}) {
  const apiKey = options.apiKey !== undefined ? options.apiKey : LIVE.apiKey;
  const fetchFn = options.fetch || fetch;
  if (!apiKey) throw new LiveError('nokey');

  const url = `${LIVE.baseUrl}/v1/stations/${encodeURIComponent(station.id)}/live?hours=${LIVE.hours}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000); // give up after 15 seconds
  let res;
  try {
    res = await fetchFn(url, {
      headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
      signal: controller.signal,
    });
  } catch (e) {
    throw new LiveError('network');
  } finally {
    clearTimeout(timer);
  }
  if (res.status === 401 || res.status === 403) throw new LiveError('auth');
  if (res.status === 429) throw new LiveError('limit');
  if (!res.ok) throw new LiveError('server');

  let json;
  try {
    json = await res.json();
  } catch (e) {
    throw new LiveError('format');
  }
  return {
    source: 'LIVE',
    nowMin: istNowMinutes(),
    note: '',
    noteHi: '',
    trains: parseBoard(json, station),
  };
}
