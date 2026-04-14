'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Home, Landmark, Plus, Database, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase';
import { seedDatabase } from '@/lib/firestore-service';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function AdminDashboardPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = () => {
    setIsSeeding(true);
    try {
      seedDatabase(firestore);
      toast({
        title: "¡Datos Generados!",
        description: "Se han creado propiedades y lotes de prueba. Refresca el catálogo para verlos.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron generar los datos iniciales.",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Administrativo</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSeed} 
          disabled={isSeeding}
          className="bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20"
        >
          {isSeeding ? "Generando..." : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Cargar Datos Iniciales
            </>
          )}
        </Button>
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

        <Card className="border-dashed border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asistente AI</CardTitle>
            <Sparkles className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Optimizar Textos</div>
            <p className="text-xs text-muted-foreground">Mejore sus descripciones automáticamente.</p>
            <div className="mt-4">
                <Button size="sm" variant="ghost" disabled className="text-muted-foreground">
                    Próximamente
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border bg-card p-12 text-center shadow-sm">
        <div className="max-w-xl mx-auto space-y-4">
          <h3 className="text-2xl font-bold">¡Bienvenido al Panel de ZB Propiedades!</h3>
          <p className="text-muted-foreground">
            Desde aquí puede controlar todo el contenido visible en la web. Los cambios que realice se reflejan en tiempo real para sus clientes.
          </p>
          <div className="pt-4">
            <p className="text-sm font-medium text-secondary bg-secondary/5 py-2 px-4 rounded-full inline-block">
              Si la base de datos está vacía, usa el botón "Cargar Datos Iniciales" de arriba.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
