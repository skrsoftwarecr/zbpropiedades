'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { VehicleCard } from './VehicleCard';
import type { Vehicle } from '@/lib/types';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';

interface VehicleGridProps {
  vehicles: Vehicle[];
}

const uniqueModels = (vehicles: Vehicle[]) => [...new Set(vehicles.map(v => v.model))];
const priceRange = (vehicles: Vehicle[]) => {
    if (vehicles.length === 0) return [0, 50000000];
    const prices = vehicles.map(v => v.price);
    return [Math.min(...prices), Math.max(...prices)];
}

export function VehicleGrid({ vehicles }: VehicleGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [model, setModel] = useState('all');
  const [sortBy, setSortBy] = useState('price-desc');
  
  const [minPrice, maxPrice] = priceRange(vehicles);
  const [price, setPrice] = useState([minPrice, maxPrice]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(price);
  }

  const filteredAndSortedVehicles = useMemo(() => {
    let filtered = vehicles.filter(vehicle =>
      `${vehicle.year} ${vehicle.make} ${vehicle.model}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (model !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.model === model);
    }

    filtered = filtered.filter(vehicle => vehicle.price >= price[0] && vehicle.price <= price[1]);


    const [sortKey, sortDirection] = sortBy.split('-');
    
    filtered.sort((a, b) => {
      let valA, valB;
      if (sortKey === 'price') valA = a.price;
      else if (sortKey === 'year') valA = a.year;
      else valA = a.mileage;

      if (sortKey === 'price') valB = b.price;
      else if (sortKey === 'year') valB = b.year;
      else valB = b.mileage;

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [vehicles, searchTerm, model, sortBy, price]);
  
  const models = useMemo(() => uniqueModels(vehicles), [vehicles]);

  return (
    <div>
      <div className="mb-8 p-4 border rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                placeholder="Buscar modelo, año..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
            />
        </div>
        
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger>
            <SelectValue placeholder="Modelo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los Modelos</SelectItem>
            {models.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-desc">Precio (Mayor a Menor)</SelectItem>
            <SelectItem value="price-asc">Precio (Menor a Mayor)</SelectItem>
            <SelectItem value="year-desc">Año (Más Nuevos Primero)</SelectItem>
            <SelectItem value="mileage-asc">Kilometraje (Menor a Mayor)</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="md:col-span-4 lg:col-span-4 mt-2">
            <label className="block text-sm font-medium mb-2">Rango de Precio: {formatPrice(price[0])} - {formatPrice(price[1])}</label>
            <Slider
                min={minPrice}
                max={maxPrice}
                step={(maxPrice-minPrice)/100}
                value={price}
                onValueChange={setPrice}
            />
        </div>
      </div>

      {filteredAndSortedVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredAndSortedVehicles.map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
         <div className="text-center py-16">
            <p className="text-xl font-medium">No se encontraron vehículos</p>
            <p className="text-muted-foreground mt-2">Intente ajustar su búsqueda o filtros.</p>
        </div>
      )}
    </div>
  );
}
