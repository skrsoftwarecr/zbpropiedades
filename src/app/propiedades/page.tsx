
'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Property, Province } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Search, MapPin, Bed, Bath, DollarSign } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';

const provinces: Province[] = ["San José", "Alajuela", "Cartago", "Heredia", "Guanacaste", "Puntarenas", "Limón"];

export default function PropertiesPage() {
  const firestore = useFirestore();
  const [search, setSearch] = useState('');
  const [province, setProvince] = useState('all');
  const [type, setType] = useState('all');
  const [minBedrooms, setMinBedrooms] = useState('all');
  const [maxPrice, setMaxPrice] = useState([500000]); // Max price filter in USD for example

  const q = useMemoFirebase(() => query(collection(firestore, 'properties'), orderBy('createdAt', 'desc')), [firestore]);
  const { data: properties, isLoading } = useCollection<Property>(q);

  const filtered = useMemo(() => {
    if (!properties) return [];
    return properties.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                           (p.city && p.city.toLowerCase().includes(search.toLowerCase()));
      const matchesProvince = province === 'all' || p.province === province;
      const matchesType = type === 'all' || p.type === type;
      const matchesBeds = minBedrooms === 'all' || p.bedrooms >= parseInt(minBedrooms);
      const matchesPrice = p.price <= maxPrice[0];
      return matchesSearch && matchesProvince && matchesType && matchesBeds && matchesPrice;
    });
  }, [properties, search, province, type, minBedrooms, maxPrice]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-headline text-primary">Catálogo de Propiedades</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Encuentre el espacio ideal para su familia o negocio entre nuestra selección exclusiva.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar de Filtros */}
        <aside className="lg:col-span-1 space-y-6 bg-card p-6 rounded-xl border shadow-sm h-fit sticky top-24">
          <h2 className="font-bold text-lg border-b pb-2">Filtros de Búsqueda</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Búsqueda</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Título o ciudad..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Provincia</label>
              <Select value={province} onValueChange={setProvince}>
                <SelectTrigger>
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Provincias</SelectItem>
                  {provinces.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Propiedad</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Tipos</SelectItem>
                  <SelectItem value="Casa">Casa</SelectItem>
                  <SelectItem value="Apartamento">Apartamento</SelectItem>
                  <SelectItem value="Local Comercial">Local Comercial</SelectItem>
                  <SelectItem value="Oficina">Oficina</SelectItem>
                  <SelectItem value="Quinta">Quinta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Habitaciones (Min)</label>
              <Select value={minBedrooms} onValueChange={setMinBedrooms}>
                <SelectTrigger>
                  <Bed className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Cualquiera" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Cualquiera</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Precio Máximo</label>
                <span className="text-sm font-bold text-secondary">${maxPrice[0].toLocaleString()}</span>
              </div>
              <Slider 
                value={maxPrice} 
                onValueChange={setMaxPrice} 
                max={2000000} 
                step={10000} 
                className="py-4"
              />
            </div>
          </div>
        </aside>

        {/* Listado de Propiedades */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-[450px] w-full rounded-xl" />)}
            </div>
          ) : (
            <>
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
                </div>
              ) : (
                <div className="text-center py-24 bg-muted/30 rounded-xl border border-dashed flex flex-col items-center">
                  <div className="bg-muted p-4 rounded-full mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-xl font-medium">No se encontraron propiedades</p>
                  <p className="text-muted-foreground">Intente ajustar sus filtros de búsqueda o el rango de precio.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
