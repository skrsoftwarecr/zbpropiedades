
'use client';

import React, { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Home, Landmark, Key, TrendingUp, ListChecks, DollarSign, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { format, isSameMonth, startOfMonth, startOfYear } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Property, Lot } from '@/lib/types';

export default function AdminDashboardPage() {
  const firestore = useFirestore();
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  // Consultas reales a las colecciones de Firestore
  const propertiesQuery = useMemoFirebase(() => query(collection(firestore, 'properties')), [firestore]);
  const lotsQuery = useMemoFirebase(() => query(collection(firestore, 'lots')), [firestore]);

  const { data: properties, isLoading: loadingProps } = useCollection<Property>(propertiesQuery);
  const { data: lots, isLoading: loadingLots } = useCollection<Lot>(lotsQuery);

  // --- LÓGICA DE INVENTARIO (Disponibles) ---
  const salesInventory = properties?.filter(p => p.status === 'Disponible' && (!p.operationType || p.operationType === 'Venta')).length || 0;
  const rentalsInventory = properties?.filter(p => p.status === 'Disponible' && p.operationType === 'Alquiler').length || 0;
  const lotsInventory = lots?.filter(l => l.status === 'Disponible').length || 0;
  const totalInventory = salesInventory + rentalsInventory + lotsInventory;

  // --- LÓGICA DE VENTAS (Vendidos/Alquilados en el mes) ---
  const filteredSales = React.useMemo(() => {
    if (!properties || !lots) return { props: 0, rents: 0, lots: 0 };
    
    const targetMonth = parseInt(selectedMonth);
    const targetYear = parseInt(selectedYear);

    const soldProps = properties.filter(p => {
      if (!p.soldAt) return false;
      const date = p.soldAt.toDate();
      return date.getMonth() === targetMonth && date.getFullYear() === targetYear;
    });

    const soldLots = lots.filter(l => {
      if (!l.soldAt) return false;
      const date = l.soldAt.toDate();
      return date.getMonth() === targetMonth && date.getFullYear() === targetYear;
    });

    return {
      props: soldProps.filter(p => p.operationType === 'Venta').length,
      rents: soldProps.filter(p => p.operationType === 'Alquiler').length,
      lots: soldLots.length
    };
  }, [properties, lots, selectedMonth, selectedYear]);

  const totalMonthlySales = filteredSales.props + filteredSales.rents + filteredSales.lots;

  const inventoryStats = [
    { title: "Propiedades", value: salesInventory, icon: Home, description: "Venta", color: "text-blue-600" },
    { title: "Alquileres", value: rentalsInventory, icon: Key, description: "Alquiler", color: "text-amber-600" },
    { title: "Lotes", value: lotsInventory, icon: Landmark, description: "Lotes", color: "text-emerald-600" }
  ];

  const salesStats = [
    { title: "Propiedades Vendidas", value: filteredSales.props, icon: DollarSign, color: "text-blue-600" },
    { title: "Propiedades Alquiladas", value: filteredSales.rents, icon: Key, color: "text-amber-600" },
    { title: "Lotes Vendidos", value: filteredSales.lots, icon: Landmark, color: "text-emerald-600" }
  ];

  const chartData = [
    { name: 'Propiedades', count: salesInventory, color: 'hsl(var(--primary))' },
    { name: 'Alquileres', count: rentalsInventory, color: '#d97706' },
    { name: 'Lotes', count: lotsInventory, color: '#059669' },
  ];

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i.toString(),
    label: format(new Date(2024, i, 1), 'MMMM', { locale: es })
  }));

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Panel Administrativo</h1>
        <p className="text-muted-foreground">Gestión de inventario y monitoreo de cierres en tiempo real.</p>
      </div>

      {/* SECCIÓN 1: ESTADO DEL INVENTARIO */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xl font-bold text-primary">
          <ListChecks className="h-6 w-6" />
          <h2>Disponibilidad de Inventario</h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          {inventoryStats.map((stat, index) => (
            <Card key={index} className="shadow-sm border-l-4" style={{ borderLeftColor: stat.color.includes('blue') ? '#2563eb' : stat.color.includes('amber') ? '#d97706' : '#059669' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                {loadingProps || loadingLots ? <Skeleton className="h-8 w-16" /> : <div className="text-3xl font-bold">{stat.value}</div>}
                <p className="text-xs text-muted-foreground mt-1">Disponibles actualmente</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* SECCIÓN 2: ESTADO DE VENTAS (EL NUEVO REQUERIMIENTO) */}
      <div className="space-y-6 pt-4 border-t">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xl font-bold text-primary">
            <TrendingUp className="h-6 w-6" />
            <h2>Rendimiento Mensual (Ventas y Cierres)</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent>
                {months.map(m => <SelectItem key={m.value} value={m.value} className="capitalize">{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[100px] h-9">
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent>
                {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {salesStats.map((stat, index) => (
            <Card key={index} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                {loadingProps || loadingLots ? <Skeleton className="h-8 w-16" /> : <div className="text-3xl font-bold">{stat.value}</div>}
                <p className="text-xs text-muted-foreground mt-1 capitalize">{months.find(m => m.value === selectedMonth)?.label} {selectedYear}</p>
              </CardContent>
            </Card>
          ))}
          
          {/* Tarjeta Extra: Total entre todos */}
          <Card className="shadow-md bg-primary text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider">Total Cierres</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              {loadingProps || loadingLots ? <Skeleton className="h-8 w-16 bg-white/20" /> : <div className="text-4xl font-black">{totalMonthlySales}</div>}
              <p className="text-xs opacity-80 mt-1">Impacto total del mes</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Gráfico de Distribución Actual */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Distribución de Inventario Activo</CardTitle>
            <CardDescription>Comparativa visual del volumen de oferta disponible.</CardDescription>
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

        <Card className="col-span-3 shadow-sm bg-muted/30">
          <CardHeader>
            <CardTitle>Resumen Operativo</CardTitle>
            <CardDescription>Métricas de visibilidad y rotación.</CardDescription>
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
                    <span className="font-medium">{Math.round((salesInventory / (totalInventory || 1)) * 100)}%</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${(salesInventory / (totalInventory || 1)) * 100}%` }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Alquileres</span>
                    <span className="font-medium">{Math.round((rentalsInventory / (totalInventory || 1)) * 100)}%</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full transition-all duration-1000" style={{ width: `${(rentalsInventory / (totalInventory || 1)) * 100}%` }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Lotes</span>
                    <span className="font-medium">{Math.round((lotsInventory / (totalInventory || 1)) * 100)}%</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${(lotsInventory / (totalInventory || 1)) * 100}%` }} />
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
