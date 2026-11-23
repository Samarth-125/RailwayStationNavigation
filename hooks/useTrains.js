import { useCallback, useEffect, useState } from 'react';
import { getTrains, LAST_STEP } from '../services/trainService';
import { enrich } from '../utils/trainStatus';

// Loads the trains and keeps them up to date.
// App.js uses this ONE time and shares the result with every screen,
// so the Trains tab, the map and the directions always agree.
export default function useTrains() {
  const [step, setStep] = useState(0); // position in the demo story
  const [data, setData] = useState({ trains: [], nowMin: 0, note: '', noteHi: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (whichStep) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTrains(whichStep);
      setData({
        trains: result.trains.map((t) => enrich(t, result.nowMin)),
        nowMin: result.nowMin,
        note: result.note,
        noteHi: result.noteHi,
      });
    } catch (e) {
      setError(true) // the screen shows the message, in the chosen language;
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load(step); // runs at start, and again whenever the demo step changes
  }, [load, step]);

  return {
    trains: data.trains,
    nowMin: data.nowMin,
    note: data.note,
    noteHi: data.noteHi,
    loading,
    error,
    step,
    reload: () => load(step),
    // Demo controls (remove these when real data is connected)
    nextUpdate: () => setStep((s) => Math.min(s + 1, LAST_STEP)),
    resetDemo: () => setStep(0),
    isLastStep: step >= LAST_STEP,
  };
}
