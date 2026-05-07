'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Lot, Province } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LotCard } from '@/components/lots/LotCard';
import { Search, MapPin, Square } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { formatCurrency } from '@/lib/currency';

const provinces: Province[] = ['San José', 'Alajuela', 'Cartago', 'Heredia', 'Guanacaste', 'Puntarenas', 'Limón'];
const MAX_PRICE_LIMIT = 800000000;

interface LotsClientProps {
  initialLots: Lot[];
}

export default function LotsClient({ initialLots }: LotsClientProps) {
  const firestore = useFirestore();
  const [search, setSearch] = useState('');
  const [province, setProvince] = useState('all');
  const [minArea, setMinArea] = useState('all');
  const [maxPrice, setMaxPrice] = useState([MAX_PRICE_LIMIT]);
  const [maxPriceInput, setMaxPriceInput] = useState(String(MAX_PRICE_LIMIT));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const q = useMemoFirebase(() => query(collection(firestore, 'lots'), orderBy('createdAt', 'desc')), [firestore]);
  const { data: lots, isLoading } = useCollection<Lot>(q);
  const source = lots && lots.length > 0 ? lots : initialLots;

  const formatPrice = (price: number) => {
    return formatCurrency(price, 'CRC');
  };

  useEffect(() => {
    setMaxPriceInput(String(maxPrice[0] ?? MAX_PRICE_LIMIT));
  }, [maxPrice]);

  const handleSliderChange = (values: number[]) => {
    const value = Math.min(Math.max(values[0] ?? 0, 0), MAX_PRICE_LIMIT);
    setMaxPrice([value]);
    setMaxPriceInput(String(value));
  };

  const handleMaxPriceInputChange = (value: string) => {
    setMaxPriceInput(value);
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return;
    const clamped = Math.min(Math.max(parsed, 0), MAX_PRICE_LIMIT);
    setMaxPrice([clamped]);
  };

  const filtered = useMemo(() => {
    if (!source) return [];
    return source.filter((l) => {
      const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase()) ||
        (l.city && l.city.toLowerCase().includes(search.toLowerCase()));
      const matchesProvince = province === 'all' || l.province === province;
      const matchesArea = minArea === 'all' || l.area_m2 >= parseInt(minArea);
      const matchesPrice = l.price <= maxPrice[0];
      return matchesSearch && matchesProvince && matchesArea && matchesPrice;
    });
  }, [source, search, province, minArea, maxPrice]);

  const showSkeleton = isLoading && initialLots.length === 0;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-headline text-primary">Lotes y Terrenos</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Encuentre el terreno perfecto para construir su futuro proyecto residencial o comercial.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-6 bg-card p-6 rounded-xl border shadow-sm h-fit lg:sticky lg:top-24 z-10">
          <h2 className="font-bold text-lg border-b pb-2">Filtrar Lotes</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre o Ciudad</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
                  {provinces.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Área Mínima (m²)</label>
              <Select value={minArea} onValueChange={setMinArea}>
                <SelectTrigger>
                  <Square className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Cualquiera" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Cualquiera</SelectItem>
                  <SelectItem value="200">200m²+</SelectItem>
                  <SelectItem value="500">500m²+</SelectItem>
                  <SelectItem value="1000">1000m²+</SelectItem>
                  <SelectItem value="5000">5000m²+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Precio Máximo</label>
                <span className="text-sm font-bold text-secondary">
                  {mounted ? formatPrice(maxPrice[0]) : '...'}
                </span>
              </div>
              <Slider
                value={maxPrice}
                onValueChange={handleSliderChange}
                max={MAX_PRICE_LIMIT}
                step={1000000}
                className="py-4"
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Precio máximo manual (₡)</label>
                <Input
                  type="number"
                  min={0}
                  max={MAX_PRICE_LIMIT}
                  step={1000000}
                  value={maxPriceInput}
                  onChange={(e) => handleMaxPriceInputChange(e.target.value)}
                  placeholder="Ingrese monto máximo"
                />
              </div>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3">
          {showSkeleton ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-[400px] w-full rounded-xl" />)}
            </div>
          ) : (
            <>
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filtered.map((l) => <LotCard key={l.id} lot={l} />)}
                </div>
              ) : (
                <div className="text-center py-24 bg-muted/30 rounded-xl border border-dashed flex flex-col items-center">
                  <div className="bg-muted p-4 rounded-full mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-xl font-medium">No se encontraron lotes</p>
                  <p className="text-muted-foreground">Intente ajustar sus criterios de búsqueda.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
