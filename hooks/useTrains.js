import { useCallback, useEffect, useMemo, useState } from 'react';
import { getTrainsAt, DEMO_START, DEMO_END } from '../services/trainService';
import { getLiveTrains } from '../services/liveTrainService';
import { LIVE } from '../config';
import { enrich, toClock } from '../utils/trainStatus';

// How many real milliseconds one demo minute takes.
export const SPEEDS = { slow: 3000, normal: 1500, fast: 400 };
const SPEED_ORDER = ['slow', 'normal', 'fast'];

// Gives every screen the trains, kept up to date.
// App.js uses this ONE time and shares the result, so the Trains tab, the map and the
// directions always agree.
//
// SAMPLE trains: a demo clock runs by itself (10:00 -> 11:50). Trains arrive, stand at
//   their platform, get delayed, change platform and leave, all by the clock.
// LIVE trains (useLive = true and a key in config.js): loaded from the internet.
//   If that fails it falls back to SAMPLE trains and sets liveError.
export default function useTrains(station, useLive) {
  const [clock, setClock] = useState(DEMO_START); // demo time, minutes since midnight
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState('normal');
  const [live, setLive] = useState(null);
  const [loading, setLoading] = useState(false);
  const [liveError, setLiveError] = useState(null); // nokey | auth | limit | network | server | format
  const [updatedAt, setUpdatedAt] = useState(''); // "HH:MM" of the last live update

  const loadLive = useCallback(async () => {
    if (!useLive) {
      setLive(null);
      setLiveError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLiveError(null);
    try {
      const result = await getLiveTrains(station);
      setLive(result);
      setUpdatedAt(toClock(result.nowMin));
    } catch (e) {
      setLive(null);
      setLiveError(e.code || 'network');
    }
    setLoading(false);
  }, [station, useLive]);

  useEffect(() => {
    loadLive(); // at start, and when the station or the source changes
  }, [loadLive]);

  // Live mode: refresh by itself every few minutes.
  useEffect(() => {
    if (!useLive) return undefined;
    const id = setInterval(loadLive, LIVE.refreshMs);
    return () => clearInterval(id);
  }, [useLive, loadLive]);

  // The demo clock: one tick = one demo minute.
  const atEnd = clock >= DEMO_END;
  useEffect(() => {
    if (!running || atEnd || live) return undefined;
    const id = setInterval(() => setClock((c) => Math.min(c + 1, DEMO_END)), SPEEDS[speed]);
    return () => clearInterval(id);
  }, [running, atEnd, speed, live]);

  const result = useMemo(() => live || getTrainsAt(station, clock), [live, station, clock]);
  const trains = useMemo(() => result.trains.map((t) => enrich(t, result.nowMin)), [result]);

  return {
    source: result.source, // 'LIVE' or 'SAMPLE'
    trains,
    nowMin: result.nowMin,
    note: result.note,
    noteHi: result.noteHi,
    loading,
    error: null,
    liveError,
    updatedAt,
    reload: loadLive,
    // Demo clock controls (only used with SAMPLE trains)
    running,
    atEnd,
    speed,
    toggleRunning: () => setRunning((r) => !r),
    cycleSpeed: () => setSpeed((s) => SPEED_ORDER[(SPEED_ORDER.indexOf(s) + 1) % SPEED_ORDER.length]),
    skip: () => setClock((c) => Math.min(c + 10, DEMO_END)),
    resetDemo: () => {
      setClock(DEMO_START);
      setRunning(true);
    },
  };
}
