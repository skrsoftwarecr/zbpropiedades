'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { CheckCircle2 } from 'lucide-react';

const e36Parts = [
  {
    group: 'Sistema de frenos',
    products: [
      {
        name: 'Bomba de freno',
        features: [
          'Compatible con BMW E36',
          'Fabricación de alta precisión',
          'Garantiza presión hidráulica estable',
          'Mejora la respuesta del pedal de freno',
          'Ideal para reemplazo de piezas desgastadas',
        ],
      },
      {
        name: 'Booster (servofreno)',
        features: [
          'Asistencia de frenado eficiente',
          'Reduce el esfuerzo al frenar',
          'Instalación directa tipo OEM',
          'Compatible con sistema original BMW',
        ],
      },
      {
        name: 'Discos de freno',
        features: [
          'Alta resistencia al calor',
          'Excelente rendimiento de frenado',
          'Material duradero y confiable',
          'Compatible con sistema original del E36',
        ],
      },
    ],
  },
  {
    group: 'Motor y sistema de enfriamiento',
    products: [
      {
        name: 'Bomba de agua',
        features: [
          'Mantiene la circulación adecuada del refrigerante',
          'Ayuda a prevenir sobrecalentamiento del motor',
          'Construcción resistente para larga duración',
          'Ajuste directo para BMW E36',
        ],
      },
      {
        name: 'Bomba de gasolina',
        features: [
          'Flujo constante de combustible',
          'Mejora el rendimiento del motor',
          'Compatible con sistema original',
          'Alta durabilidad',
        ],
      },
    ],
  },
  {
    group: 'Suspensión y transmisión',
    products: [
      {
        name: 'Resortes',
        features: [
          'Mantienen la altura correcta del vehículo',
          'Mejoran estabilidad y manejo',
          'Construcción en acero de alta resistencia',
        ],
      },
      {
        name: 'Roles de empuje',
        features: [
          'Reduce fricción en componentes móviles',
          'Mejora funcionamiento del sistema',
          'Material resistente al desgaste',
        ],
      },
      {
        name: 'Compensadores',
        features: [
          'Ayudan a mantener balance en el sistema mecánico',
          'Funcionamiento suave y preciso',
          'Compatible con componentes originales',
        ],
      },
    ],
  },
  {
    group: 'Interior',
    products: [
      {
        name: 'Consola central',
        features: [
          'Plástico original o de alta calidad',
          'Ajuste perfecto al interior del E36',
          'Mejora la estética del vehículo',
          'Fácil instalación',
        ],
      },
      {
        name: 'Cluster (panel de instrumentos)',
        features: [
          'Lectura clara de velocidad, RPM y combustible',
          'Compatible con sistema eléctrico original',
          'Ideal para reemplazo o restauración',
        ],
      },
      {
        name: 'Dash (tablero)',
        features: [
          'Diseño original BMW',
          'Mejora apariencia interior',
          'Material resistente al calor y desgaste',
        ],
      },
      {
        name: 'Asientos',
        features: [
          'Comodidad y soporte ergonómico',
          'Compatibles con rieles originales',
          'Perfectos para restauración o reemplazo',
        ],
      },
    ],
  },
  {
    group: 'Exterior',
    products: [
      {
        name: 'Espejos retrovisores',
        features: [
          'Diseño original para BMW E36',
          'Excelente visibilidad',
          'Ajuste preciso en carrocería',
          'Construcción resistente',
        ],
      },
    ],
  },
  {
    group: 'Dirección',
    products: [
      {
        name: 'Volantes',
        features: [
          'Diseño ergonómico',
          'Compatible con sistema de dirección BMW E36',
          'Mejora el control y la conducción',
          'Opciones originales o deportivas',
        ],
      },
    ],
  },
];

const partGroups = ['Ver todo', ...e36Parts.map((g) => g.group)];

export default function E36PartsPage() {
  const [selectedGroup, setSelectedGroup] = useState('Ver todo');

  const filteredProducts = useMemo(() => {
    if (selectedGroup === 'Ver todo') {
      return e36Parts.flatMap((g) =>
        g.products.map((p) => ({ ...p, group: g.group }))
      );
    }
    return (
      e36Parts
        .find((g) => g.group === selectedGroup)
        ?.products.map((p) => ({ ...p, group: selectedGroup })) || []
    );
  }, [selectedGroup]);

  const breadcrumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Repuestos', href: '/parts' },
    { label: 'Repuestos E36', href: '/parts/e36', isCurrent: true },
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Breadcrumbs crumbs={breadcrumbs} />
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          Repuestos para BMW E36
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Una selección curada de repuestos de alta calidad para el legendario
          BMW E36, el favorito de los entusiastas.
        </p>
      </div>

      <div className="mb-8 max-w-sm mx-auto">
        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar sección..." />
          </SelectTrigger>
          <SelectContent>
            {partGroups.map((group) => (
              <SelectItem key={group} value={group}>
                {group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        {filteredProducts.map((product) => (
          <Card key={product.name} className="flex flex-col">
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              {selectedGroup === 'Ver todo' && (
                <p className="text-sm text-muted-foreground font-medium">
                  {product.group}
                </p>
              )}
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2 text-sm text-muted-foreground">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
