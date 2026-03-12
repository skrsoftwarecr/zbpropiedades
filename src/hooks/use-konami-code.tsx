'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export const useKonamiCode = (targetSequence: string[], timeout: number) => {
  const router = useRouter();
  const [sequence, setSequence] = useState<string[]>([]);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const resetSequence = useCallback(() => {
    setSequence([]);
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
  }, [timer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let newSequence = [...sequence, e.key];

      if (!timer) {
        const newTimer = setTimeout(() => {
          resetSequence();
        }, timeout);
        setTimer(newTimer);
      }

      if (newSequence.join('') === targetSequence.join('')) {
        resetSequence();
        router.push('/login');
        return;
      }
      
      if (!targetSequence.join('').startsWith(newSequence.join(''))) {
          resetSequence();
          // if the new key is the start of the sequence, start over
          if(targetSequence[0] === e.key){
              newSequence = [e.key];
          } else {
              newSequence = [];
          }
      }

      setSequence(newSequence);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timer) clearTimeout(timer);
    };
  }, [sequence, timer, targetSequence, timeout, router, resetSequence]);
};
