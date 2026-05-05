import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Venda su propiedad o lote en Costa Rica',
  description: 'Publique y venda su propiedad, lote o quinta con ZB Propiedades. Reciba acompañamiento profesional para comercializar su inmueble en Costa Rica.',
  keywords: [
    'vender propiedad Costa Rica',
    'vender lote Costa Rica',
    'publicar propiedad Costa Rica',
    'inmobiliaria para vender propiedad Costa Rica',
  ],
  alternates: {
    canonical: '/vendemos-su-propiedad',
  },
  openGraph: {
    title: 'Venda su propiedad o lote en Costa Rica',
    description: 'Publique y venda su propiedad, lote o quinta con ZB Propiedades. Reciba acompañamiento profesional para comercializar su inmueble en Costa Rica.',
    url: '/vendemos-su-propiedad',
  },
};

export default function SellPropertyLayout({ children }: { children: React.ReactNode }) {
  return children;
}