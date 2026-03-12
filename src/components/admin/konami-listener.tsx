'use client';
import { useKonamiCode } from '@/hooks/use-konami-code';

export function KonamiListener() {
  const targetSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'a', 'b', '2'];
  useKonamiCode(targetSequence, 5000);
  return null;
}
