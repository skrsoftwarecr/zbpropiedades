
'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Property, Province } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Search, MapPin } from 'lucide-react';

const provinces: Province[] = ["San José", "Alajuela", "Cartago", "Heredia", "Guanacaste", "Puntarenas", "Limón"];

export default function PropertiesPage() {
  const firestore = useFirestore();
  const [search, setSearch] = useState('');
  const [province, setProvince] = useState('all');
  const [type, setType] = useState('all');

  const q = useMemoFirebase(() => query(collection(firestore, 'properties'), orderBy('createdAt', 'desc')), [firestore]);
  const { data: properties, isLoading } = useCollection<Property>(q);

  const filtered = useMemo(() => {
    if (!properties) return [];
    return properties.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase());
      const matchesProvince = province === 'all' || p.province === province;
      const matchesType = type === 'all' || p.type === type;
      return matchesSearch && matchesProvince && matchesType;
    });
  }, [properties, search, province, type]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 font-headline">Catálogo de Propiedades</h1>
        <p className="text-muted-foreground">Explore las mejores opciones de vivienda y locales comerciales.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12 bg-card p-6 rounded-xl border shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por ciudad o título..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={province} onValueChange={setProvince}>
          <SelectTrigger>
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Provincia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las Provincias</SelectItem>
            {provinces.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo de Propiedad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los Tipos</SelectItem>
            <SelectItem value="Casa">Casa</SelectItem>
            <SelectItem value="Apartamento">Apartamento</SelectItem>
            <SelectItem value="Local Comercial">Local Comercial</SelectItem>
            <SelectItem value="Oficina">Oficina</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3].map(i => <Skeleton key={i} className="h-[400px] w-full rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
      )}
    </div>
  );
}
