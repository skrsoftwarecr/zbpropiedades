'use client';

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCard } from './ProductCard';
import type { Product } from '@/lib/types';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
  
const ContactPrompt = ({ whatsappNumber }: { whatsappNumber: string }) => (
    <div className="text-center py-10 px-4 mt-12 bg-card border-2 border-dashed rounded-lg">
        <h3 className="text-2xl font-bold font-headline">¿No encuentras lo que buscas?</h3>
        <p className="text-muted-foreground mt-2 mb-6 max-w-lg mx-auto">
            No te preocupes. Contáctanos por WhatsApp y nuestro equipo de expertos te ayudará a conseguir esa pieza que necesitas en tiempo récord.
        </p>
        {whatsappNumber ? (
            <Button asChild size="lg" className="font-semibold">
                <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hola, no encuentro un repuesto en la página y quisiera saber si me pueden ayudar a conseguirlo.")}`} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="mr-2 h-5 w-5" />
                    Contactar por WhatsApp
                </a>
            </Button>
        ) : (
            <Skeleton className="h-11 w-56 mx-auto" />
        )}
    </div>
);

const GridSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-2/5" />
                </div>
                    <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-10 w-10 rounded-md" />
                </div>
            </div>
        ))}
    </div>
);


interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [condition, setCondition] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    // This runs only on the client, preventing mismatches
    const phoneNumbers = ['50687216913', '50670210104', '50671733091'];
    const randomIndex = Math.floor(Math.random() * phoneNumbers.length);
    setWhatsappNumber(phoneNumbers[randomIndex]);
  }, []);

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
        
      {isLoading ? (
        <GridSkeleton />
      ) : filteredAndSortedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredAndSortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <ContactPrompt whatsappNumber={whatsappNumber} />
        </>
      ) : (
        <ContactPrompt whatsappNumber={whatsappNumber} />
      )}
    </div>
  );
}
