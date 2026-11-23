import { useCallback, useEffect, useState } from 'react';
import { getTrains, LAST_STEP } from '../services/trainService';
import { getLiveTrains } from '../services/liveTrainService';
import { LIVE } from '../config';
import { enrich, toClock } from '../utils/trainStatus';

// Loads the trains and keeps them up to date.
// App.js uses this ONE time and shares the result with every screen,
// so the Trains tab, the map and the directions always agree.
//
// useLive = false -> made-up SAMPLE trains (the demo story).
// useLive = true  -> tries the live service; if that fails it falls back to SAMPLE
//                    trains and sets liveError, so the screens can say so clearly.
export default function useTrains(station, useLive) {
  const [step, setStep] = useState(0); // position in the demo story
  const [data, setData] = useState({ source: 'SAMPLE', trains: [], nowMin: 0, note: '', noteHi: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveError, setLiveError] = useState(null); // nokey | auth | limit | network | server | format
  const [updatedAt, setUpdatedAt] = useState(''); // "HH:MM" of the last live update

  const load = useCallback(
    async (whichStep) => {
      setLoading(true);
      setError(null);
      setLiveError(null);
      try {
        let result = null;
        if (useLive) {
          try {
            result = await getLiveTrains(station);
            setUpdatedAt(toClock(result.nowMin));
          } catch (e) {
            setLiveError(e.code || 'network');
          }
        }
        if (!result) result = await getTrains(whichStep);
        setData({
          source: result.source,
          trains: result.trains.map((t) => enrich(t, result.nowMin)),
          nowMin: result.nowMin,
          note: result.note,
          noteHi: result.noteHi,
        });
      } catch (e) {
        setError(true); // the screen shows the message, in the chosen language
      }
      setLoading(false);
    },
    [station, useLive]
  );

  useEffect(() => {
    load(step); // runs at start, and again when the station, source or demo step changes
  }, [load, step]);

  // Live mode: refresh by itself every few minutes.
  useEffect(() => {
    if (!useLive) return undefined;
    const id = setInterval(() => load(step), LIVE.refreshMs);
    return () => clearInterval(id);
  }, [useLive, load, step]);

  return {
    source: data.source, // 'LIVE' or 'SAMPLE'
    trains: data.trains,
    nowMin: data.nowMin,
    note: data.note,
    noteHi: data.noteHi,
    loading,
    error,
    liveError,
    updatedAt,
    step,
    reload: () => load(step),
    // Demo controls (only used with SAMPLE data)
    nextUpdate: () => setStep((s) => Math.min(s + 1, LAST_STEP)),
    resetDemo: () => setStep(0),
    isLastStep: step >= LAST_STEP,
  };
}
