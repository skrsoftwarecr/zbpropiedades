
import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Home, Landmark, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Admin Dashboard | ZB Propiedades',
  description: 'Panel de administración',
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Administrativo</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:border-primary transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventario Global</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Gestione su catálogo</div>
            <p className="text-xs text-muted-foreground">Actualice precios, imágenes y estados.</p>
            <div className="mt-4 flex gap-2">
                <Button size="sm" asChild variant="outline">
                    <Link href="/admin/properties">Ver Propiedades</Link>
                </Button>
                <Button size="sm" asChild variant="outline">
                    <Link href="/admin/lots">Ver Lotes</Link>
                </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acceso Rápido</CardTitle>
            <Plus className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Publicar Nuevo</div>
            <p className="text-xs opacity-80">Capture nuevas oportunidades de negocio.</p>
            <div className="mt-4 flex gap-2">
                <Button size="sm" variant="secondary" asChild>
                    <Link href="/admin/properties">Nueva Propiedad</Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border bg-card p-8 text-center">
        <h3 className="text-xl font-bold mb-2">¡Bienvenido al Panel de ZB Propiedades!</h3>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Desde aquí puede controlar todo el contenido visible en la web. Recuerde que los cambios se reflejan en tiempo real para sus clientes.
        </p>
      </div>
    </div>
  );
}
