'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCard } from './ProductCard';
import type { Product } from '@/lib/types';
import { Search } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [condition, setCondition] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (category !== 'all') {
      filtered = filtered.filter(product => product.category === category);
    }
    
    if (condition !== 'all') {
      filtered = filtered.filter(product => product.condition === condition);
    }

    const [sortKey, sortDirection] = sortBy.split('-');
    
    filtered.sort((a, b) => {
      let valA, valB;
      if (sortKey === 'price') {
        valA = a.price;
        valB = b.price;
      } else { // name
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [products, searchTerm, category, condition, sortBy]);

  return (
    <div>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                placeholder="Buscar repuestos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
            />
        </div>
        
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las Categorías</SelectItem>
            <SelectItem value="Original">Original</SelectItem>
            <SelectItem value="Aftermarket">Aftermarket</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Nombre (A-Z)</SelectItem>
            <SelectItem value="name-desc">Nombre (Z-A)</SelectItem>
            <SelectItem value="price-asc">Precio (Menor a Mayor)</SelectItem>
            <SelectItem value="price-desc">Precio (Mayor a Menor)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {filteredAndSortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <p className="text-xl font-medium">No se encontraron productos</p>
            <p className="text-muted-foreground mt-2">Intente ajustar su búsqueda o filtros.</p>
        </div>
      )}
    </div>
  );
}
