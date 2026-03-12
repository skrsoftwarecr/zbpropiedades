import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

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
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            ¡Bienvenido al Panel de Administración!
          </h3>
          <p className="text-sm text-muted-foreground">
            Seleccione una opción del menú lateral para comenzar a administrar el catálogo de repuestos o vehículos.
          </p>
        </div>
      </div>
    </>
  );
}
