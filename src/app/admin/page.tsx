'use client';

import React from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Home, Landmark, Key, ListChecks, Trees } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import type { Property, Lot } from '@/lib/types';

export default function AdminDashboardPage() {
  const firestore = useFirestore();

  const propertiesQuery = useMemoFirebase(() => query(collection(firestore, 'properties')), [firestore]);
  const lotsQuery = useMemoFirebase(() => query(collection(firestore, 'lots')), [firestore]);

  const { data: properties, isLoading: loadingProps } = useCollection<Property>(propertiesQuery);
  const { data: allLots, isLoading: loadingLots } = useCollection<Lot>(lotsQuery);

  // Cálculos de inventario
  const salesInventory = properties?.filter(p => (!p.operationType || p.operationType === 'Venta')).length || 0;
  const rentalsInventory = properties?.filter(p => p.operationType === 'Alquiler').length || 0;
  
  const lotsInventory = allLots?.filter(l => !l.lotType || l.lotType === 'Lote').length || 0;
  const quintasInventory = allLots?.filter(l => l.lotType === 'Quinta').length || 0;
  
  const totalInventory = salesInventory + rentalsInventory + lotsInventory + quintasInventory;

  const inventoryStats = [
    { title: "Propiedades", value: salesInventory, icon: Home, color: "text-blue-600", border: "#2563eb" },
    { title: "Alquileres", value: rentalsInventory, icon: Key, color: "text-amber-600", border: "#d97706" },
    { title: "Lotes", value: lotsInventory, icon: Landmark, color: "text-emerald-600", border: "#059669" },
    { title: "Quintas", value: quintasInventory, icon: Trees, color: "text-indigo-600", border: "#4f46e5" }
  ];

  const chartData = [
    { name: 'Propiedades', value: salesInventory, color: '#2563eb' },
    { name: 'Alquileres', value: rentalsInventory, color: '#d97706' },
    { name: 'Lotes', value: lotsInventory, color: '#059669' },
    { name: 'Quintas', value: quintasInventory, color: '#4f46e5' },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Panel Administrativo</h1>
        <p className="text-muted-foreground">Gestión de inventario y monitoreo en tiempo real.</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xl font-bold text-primary">
          <ListChecks className="h-6 w-6" />
          <h2>Estado del Inventario</h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {inventoryStats.map((stat, index) => (
            <Card key={index} className="shadow-sm border-l-4" style={{ borderLeftColor: stat.border }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                {loadingProps || loadingLots ? <Skeleton className="h-8 w-16" /> : <div className="text-3xl font-bold">{stat.value}</div>}
                <p className="text-xs text-muted-foreground mt-1">Registros activos</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Distribución de Categorías</CardTitle>
            <CardDescription>Proporción visual de la oferta actual.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {loadingProps || loadingLots ? (
                <div className="flex items-center justify-center h-full">
                   <Skeleton className="h-48 w-48 rounded-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      formatter={(value: number) => [`${value} unidades`, 'Cantidad']}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      align="center"
                      iconType="circle"
                      wrapperStyle={{ paddingTop: '20px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm bg-muted/30">
          <CardHeader>
            <CardTitle>Resumen Operativo</CardTitle>
            <CardDescription>Métricas de visibilidad porcentual.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Total Publicados</p>
                  <div className="text-4xl font-bold">{totalInventory}</div>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <ListChecks className="h-8 w-8 text-primary" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Propiedades</span>
                    <span className="font-medium">{totalInventory > 0 ? Math.round((salesInventory / totalInventory) * 100) : 0}%</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${totalInventory > 0 ? (salesInventory / totalInventory) * 100 : 0}%` }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Alquileres</span>
                    <span className="font-medium">{totalInventory > 0 ? Math.round((rentalsInventory / totalInventory) * 100) : 0}%</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full transition-all duration-1000" style={{ width: `${totalInventory > 0 ? (rentalsInventory / totalInventory) * 100 : 0}%` }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Lotes</span>
                    <span className="font-medium">{totalInventory > 0 ? Math.round((lotsInventory / totalInventory) * 100) : 0}%</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${totalInventory > 0 ? (lotsInventory / totalInventory) * 100 : 0}%` }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Quintas</span>
                    <span className="font-medium">{totalInventory > 0 ? Math.round((quintasInventory / totalInventory) * 100) : 0}%</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full transition-all duration-1000" style={{ width: `${totalInventory > 0 ? (quintasInventory / totalInventory) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
