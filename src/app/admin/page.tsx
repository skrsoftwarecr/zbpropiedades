
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Home, Landmark, Key, TrendingUp, ListChecks } from 'lucide-react';
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
import type { Property, Lot } from '@/lib/types';

export default function AdminDashboardPage() {
  const firestore = useFirestore();

  // Consultas reales a las colecciones de Firestore
  const propertiesQuery = useMemoFirebase(() => query(collection(firestore, 'properties')), [firestore]);
  const lotsQuery = useMemoFirebase(() => query(collection(firestore, 'lots')), [firestore]);

  const { data: properties, isLoading: loadingProps } = useCollection<Property>(propertiesQuery);
  const { data: lots, isLoading: loadingLots } = useCollection<Lot>(lotsQuery);

  // Lógica de conteo separada y sincronizada con los filtros del cliente
  // Las propiedades sin operationType definido se consideran 'Venta' por defecto (retrocompatibilidad)
  const salesCount = properties?.filter(p => !p.operationType || p.operationType === 'Venta').length || 0;
  const rentalsCount = properties?.filter(p => p.operationType === 'Alquiler').length || 0;
  const lotsCount = lots?.length || 0;

  const totalListings = salesCount + rentalsCount + lotsCount;

  const stats = [
    {
      title: "Propiedades (Venta)",
      value: salesCount,
      icon: Home,
      description: "Disponibles en catálogo de ventas",
      color: "text-blue-600",
      loading: loadingProps
    },
    {
      title: "Alquileres",
      value: rentalsCount,
      icon: Key,
      description: "Disponibles en catálogo de alquiler",
      color: "text-amber-600",
      loading: loadingProps
    },
    {
      title: "Lotes y Terrenos",
      value: lotsCount,
      icon: Landmark,
      description: "Disponibles en catálogo de lotes",
      color: "text-emerald-600",
      loading: loadingLots
    }
  ];

  const chartData = [
    { name: 'Ventas', count: salesCount, color: 'hsl(var(--primary))' },
    { name: 'Alquileres', count: rentalsCount, color: 'hsl(222.2 47.4% 30%)' },
    { name: 'Lotes', count: lotsCount, color: 'hsl(var(--secondary))' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Estado del Inventario</h1>
        <p className="text-muted-foreground">Métricas reales sincronizadas con lo que ven los clientes en el sitio web.</p>
      </div>

      {/* Tarjetas de Estadísticas Principales */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-sm hover:shadow-md transition-all border-l-4" style={{ borderLeftColor: stat.color.includes('blue') ? '#2563eb' : stat.color.includes('amber') ? '#d97706' : '#059669' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {stat.loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold">{stat.value}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Gráfico de Distribución */}
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Distribución de Inventario</CardTitle>
            <CardDescription>Comparativa visual del volumen por tipo de negocio.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
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

        {/* Resumen de Visibilidad */}
        <Card className="col-span-3 shadow-sm bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Impacto en el Sitio
            </CardTitle>
            <CardDescription className="text-primary-foreground/70">Resumen de oferta pública.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-primary-foreground/10 pb-4">
                <div>
                  <p className="text-sm opacity-80 uppercase tracking-wider font-semibold">Total Listados Activos</p>
                  <div className="text-4xl font-bold">{totalListings}</div>
                </div>
                <div className="bg-white/10 p-3 rounded-full">
                  <ListChecks className="h-8 w-8" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Propiedades (Venta)</span>
                    <span className="font-medium">{Math.round((salesCount / (totalListings || 1)) * 100)}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-white h-full transition-all duration-1000" style={{ width: `${(salesCount / (totalListings || 1)) * 100}%` }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Alquileres</span>
                    <span className="font-medium">{Math.round((rentalsCount / (totalListings || 1)) * 100)}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full transition-all duration-1000" style={{ width: `${(rentalsCount / (totalListings || 1)) * 100}%` }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Lotes</span>
                    <span className="font-medium">{Math.round((lotsCount / (totalListings || 1)) * 100)}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full transition-all duration-1000" style={{ width: `${(lotsCount / (totalListings || 1)) * 100}%` }} />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-xs opacity-60 leading-relaxed italic">
                  * Estos números se actualizan instantáneamente cuando agregas, editas o eliminas un registro en las secciones laterales.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
