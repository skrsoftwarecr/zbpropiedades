import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Bimmer CR Administration',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Panel de Administración</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Bienvenido al panel de control de Bimmer CR.
        </p>
      </div>
      <p className='text-center'>Seleccione una opción del menú para comenzar a administrar el catálogo.</p>
    </div>
  );
}
