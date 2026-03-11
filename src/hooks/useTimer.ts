import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer(isRunning: boolean, initialTime = 0) {
  const [time, setTime] = useState(initialTime);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) {
      startRef.current = null;
      return;
    }

    startRef.current = Date.now() - time * 1000;
    const interval = setInterval(() => {
      if (startRef.current !== null) {
        setTime(Math.floor((Date.now() - startRef.current) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = useCallback(() => {
    setTime(0);
    startRef.current = null;
  }, []);

  return { time, reset };
}
