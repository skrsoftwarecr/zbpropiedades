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

const e46Parts = [
  {
    group: "Sistema de frenos",
    products: [
      { name: "Pastillas de Freno (Delanteras/Traseras)", features: ["Compuesto de cerámica para bajo polvo", "Rendimiento de frenado OEM", "Incluye sensores de desgaste"] },
      { name: "Sensores de Desgaste de Frenos", features: ["Reemplazo directo", "Notificación precisa de desgaste", "Esencial para el sistema de frenado"] },
      { name: "Líquido de Frenos (DOT 4)", features: ["Alto punto de ebullición", "Protege contra la corrosión", "Compatible con sistemas ABS y DSC"] },
    ],
  },
  {
    group: "Motor y sistema de enfriamiento",
    products: [
      { name: "Termostato y Carcasa", features: ["Regula la temperatura del motor", "Previene el sobrecalentamiento", "Incluye junta para una instalación sin fugas"] },
      { name: "Radiador", features: ["Construcción de aluminio y plástico", "Refrigeración eficiente del motor", "Ajuste OEM para E46"] },
      { name: "Bomba de agua con polea metálica", features: ["Impulsor metálico para mayor durabilidad", "Reemplazo superior a la bomba de plástico OEM", "Mantiene el flujo de refrigerante óptimo"] },
    ],
  },
  {
    group: "Suspensión y transmisión",
    products: [
      { name: "Brazos de Control Delanteros (Boomerangs)", features: ["Restaura la precisión de la dirección", "Bujes preinstalados para fácil montaje", "Componente crítico para la suspensión del E46"] },
      { name: "Kit de Amortiguadores (Delanteros/Traseros)", features: ["Mejora la comodidad y el manejo", "Disponible en configuración estándar o deportiva", "Marca de calidad reconocida"] },
      { name: "Kit de Embrague", features: ["Para modelos con transmisión manual", "Incluye disco, plato de presión y cojinete", "Restaura el acoplamiento suave del embrague"] },
    ],
  },
  {
    group: "Interior",
    products: [
      { name: "Pomo de Palanca de Cambios (Iluminado)", features: ["Diseño de 5 o 6 velocidades", "Mejora la estética interior", "Conexión plug-and-play"] },
      { name: "Alfombrillas de Velour", features: ["Ajuste a medida para E46", "Material de alta calidad", "Incluye clips de sujeción"] },
      { name: "Clips para Paneles de Puerta", features: ["Soluciona paneles de puerta sueltos", "Kit completo para varias puertas", "Pieza de reemplazo económica"] },
    ],
  },
  {
    group: "Exterior",
    products: [
      { name: "Faros Delanteros con Angel Eyes", features: ["Estilo moderno y mejor visibilidad", "Tecnología LED o CCFL", "Instalación sin modificaciones"] },
      { name: "Rejillas Delanteras (Riñones) en Negro Mate", features: ["Aspecto agresivo y deportivo", "Plástico ABS de alta calidad", "Fácil instalación con clips"] },
      { name: "Emblemas de Capó y Maletero", features: ["Restaura el aspecto original", "82mm para capó, 74mm para maletero", "Adhesivo de alta resistencia"] },
    ],
  },
  {
    group: "Dirección",
    products: [
      { name: "Bomba de Dirección Asistida", features: ["Restaura la asistencia de dirección", "Funcionamiento silencioso y fiable", "Re manufacturado con estándares OEM"] },
      { name: "Terminales de Dirección (Interior/Exterior)", features: ["Esencial para la alineación de las ruedas", "Elimina el juego en la dirección", "Se recomienda reemplazar en pares"] },
    ],
  },
];

const partGroups = ["Ver todo", ...e46Parts.map(g => g.group)];

export default function E46PartsPage() {
  const [selectedGroup, setSelectedGroup] = useState('Ver todo');

  const filteredProducts = useMemo(() => {
    if (selectedGroup === 'Ver todo') {
      return e46Parts.flatMap(g => g.products.map(p => ({ ...p, group: g.group })));
    }
    return e46Parts.find(g => g.group === selectedGroup)?.products.map(p => ({ ...p, group: selectedGroup })) || [];
  }, [selectedGroup]);

  const breadcrumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Repuestos', href: '/parts' },
    { label: 'Repuestos E46', href: '/parts/e46', isCurrent: true },
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Breadcrumbs crumbs={breadcrumbs} />
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          Repuestos para BMW E46
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Encuentra repuestos de calidad superior para el icónico BMW E46. Todo para su mantenimiento y mejora.
        </p>
      </div>

      <div className="mb-8 max-w-sm mx-auto">
        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar sección..." />
          </SelectTrigger>
          <SelectContent>
            {partGroups.map(group => (
              <SelectItem key={group} value={group}>{group}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        {filteredProducts.map((product) => (
          <Card key={product.name} className="flex flex-col">
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              {selectedGroup === 'Ver todo' && <p className="text-sm text-muted-foreground font-medium">{product.group}</p>}
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
