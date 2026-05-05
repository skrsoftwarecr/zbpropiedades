import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lotes y terrenos en venta en Costa Rica',
  description: 'Encuentre lotes, terrenos y quintas en venta en Costa Rica para construir, invertir o desarrollar su próximo proyecto.',
  keywords: [
    'lotes en venta Costa Rica',
    'terrenos en venta Costa Rica',
    'quintas en venta Costa Rica',
    'comprar lote Costa Rica',
  ],
  alternates: {
    canonical: '/lotes',
  },
  openGraph: {
    title: 'Lotes y terrenos en venta en Costa Rica',
    description: 'Encuentre lotes, terrenos y quintas en venta en Costa Rica para construir, invertir o desarrollar su próximo proyecto.',
    url: '/lotes',
  },
};

export default function LotsLayout({ children }: { children: React.ReactNode }) {
  return children;
}