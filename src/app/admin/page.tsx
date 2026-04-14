'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Home, Landmark, Users, TrendingUp, ArrowUpRight, ListChecks } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function AdminDashboardPage() {
  const firestore = useFirestore();

  // Consultas reales a la base de datos
  const propertiesQuery = useMemoFirebase(() => query(collection(firestore, 'properties')), [firestore]);
  const lotsQuery = useMemoFirebase(() => query(collection(firestore, 'lots')), [firestore]);

  const { data: properties, isLoading: loadingProps } = useCollection(propertiesQuery);
  const { data: lots, isLoading: loadingLots } = useCollection(lotsQuery);

  const stats = [
    {
      title: "Propiedades Totales",
      value: properties?.length || 0,
      icon: Home,
      description: "Casas y apartamentos",
      color: "text-blue-600",
      loading: loadingProps
    },
    {
      title: "Lotes Totales",
      value: lots?.length || 0,
      icon: Landmark,
      description: "Terrenos y quintas",
      color: "text-emerald-600",
      loading: loadingLots
    },
    {
      title: "Listados Activos",
      value: (properties?.length || 0) + (lots?.length || 0),
      icon: ListChecks,
      description: "Total en producción",
      color: "text-amber-600",
      loading: loadingProps || loadingLots
    }
  ];

  const chartData = [
    { name: 'Propiedades', count: properties?.length || 0, color: 'hsl(var(--primary))' },
    { name: 'Lotes', count: lots?.length || 0, color: 'hsl(var(--secondary))' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Panel de Control</h1>
        <p className="text-muted-foreground">Monitoreo en tiempo real de su inventario inmobiliario.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {stat.loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Distribución de Inventario</CardTitle>
            <CardDescription>Comparativa visual entre tipos de listados disponibles.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={60}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Métricas de Rendimiento
            </CardTitle>
            <CardDescription className="text-primary-foreground/70">Resumen de visibilidad.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-primary-foreground/10 pb-4">
                <div>
                  <p className="text-sm opacity-80 uppercase tracking-wider font-semibold">Vistas Totales</p>
                  <div className="text-3xl font-bold">--</div>
                </div>
                <div className="bg-white/10 p-2 rounded-full">
                  <ArrowUpRight className="h-6 w-6" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Página más visitada</span>
                  <span className="font-medium">Catálogo</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full w-[70%]" />
                </div>
              </div>
              <div className="pt-4">
                <p className="text-xs opacity-60 leading-relaxed italic">
                  * Las métricas detalladas de tráfico web están en proceso de sincronización con la base de datos de producción.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
