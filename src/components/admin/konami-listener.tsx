'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useKonamiCode } from '@/hooks/use-konami-code';

const MOBILE_TAP_TARGET = '[data-admin-touch-trigger]';
const MOBILE_TAP_COUNT = 4;
const MOBILE_TAP_TIMEOUT = 4000;
const MOBILE_HOLD_TIMEOUT = 3000;

export function KonamiListener() {
  const router = useRouter();
  const targetSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'a', 'b', '2'];
  useKonamiCode(targetSequence, 5000);

  useEffect(() => {
    let tapCount = 0;
    let resetTimer: ReturnType<typeof setTimeout> | null = null;
    let holdTimer: ReturnType<typeof setTimeout> | null = null;

    const resetTapSequence = () => {
      tapCount = 0;
      if (resetTimer) {
        clearTimeout(resetTimer);
        resetTimer = null;
      }
      if (holdTimer) {
        clearTimeout(holdTimer);
        holdTimer = null;
      }
    };

    const isValidTouchTarget = (eventTarget: EventTarget | null) => {
      return eventTarget instanceof Element && !!eventTarget.closest(MOBILE_TAP_TARGET);
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (!isValidTouchTarget(event.target)) {
        return;
      }

      if (tapCount >= MOBILE_TAP_COUNT) {
        if (holdTimer) {
          clearTimeout(holdTimer);
          holdTimer = null;
        }
        return;
      }

      tapCount += 1;

      if (resetTimer) {
        clearTimeout(resetTimer);
      }

      resetTimer = setTimeout(resetTapSequence, MOBILE_TAP_TIMEOUT);
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest(MOBILE_TAP_TARGET)) {
        return;
      }

      if (tapCount !== MOBILE_TAP_COUNT) {
        return;
      }

      if (holdTimer) {
        clearTimeout(holdTimer);
      }

      holdTimer = setTimeout(() => {
        resetTapSequence();
        router.push('/login');
      }, MOBILE_HOLD_TIMEOUT);
    };

    const handlePointerCancel = () => {
      if (holdTimer) {
        clearTimeout(holdTimer);
        holdTimer = null;
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerCancel);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerCancel);
      resetTapSequence();
    };
  }, [router]);

  return null;
}
