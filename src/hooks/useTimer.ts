import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer(isRunning: boolean, initialTime = 0) {
  const [time, setTime] = useState(initialTime);
  const startRef = useRef<number | null>(null);
  const hiddenAtRef = useRef<number | null>(null);

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

  // Pause timer when page is hidden (e.g. switching apps on mobile Safari)
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        hiddenAtRef.current = Date.now();
      } else if (document.visibilityState === 'visible' && hiddenAtRef.current !== null) {
        if (startRef.current !== null) {
          // Shift the start reference forward by the hidden duration
          // so the hidden time is not counted
          const hiddenDuration = Date.now() - hiddenAtRef.current;
          startRef.current += hiddenDuration;
        }
        hiddenAtRef.current = null;
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const reset = useCallback(() => {
    setTime(0);
    startRef.current = null;
  }, []);

  return { time, reset };
}
