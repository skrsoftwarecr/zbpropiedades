import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Repuestos para BMW E36',
  description: 'Catálogo especializado de repuestos y componentes para el BMW E36. Encuentra todo lo que necesitas para tu proyecto de restauración o mantenimiento.',
};

const e36Parts = [
  {
    group: "Sistema de frenos",
    products: [
      {
        name: "Bomba de freno",
        features: [
          "Compatible con BMW E36",
          "Fabricación de alta precisión",
          "Garantiza presión hidráulica estable",
          "Mejora la respuesta del pedal de freno",
          "Ideal para reemplazo de piezas desgastadas",
        ],
      },
      {
        name: "Booster (servofreno)",
        features: [
          "Asistencia de frenado eficiente",
          "Reduce el esfuerzo al frenar",
          "Instalación directa tipo OEM",
          "Compatible con sistema original BMW",
        ],
      },
      {
        name: "Discos de freno",
        features: [
          "Alta resistencia al calor",
          "Excelente rendimiento de frenado",
          "Material duradero y confiable",
          "Compatible con sistema original del E36",
        ],
      },
    ],
  },
  {
    group: "Motor y sistema de enfriamiento",
    products: [
      {
        name: "Bomba de agua",
        features: [
          "Mantiene la circulación adecuada del refrigerante",
          "Ayuda a prevenir sobrecalentamiento del motor",
          "Construcción resistente para larga duración",
          "Ajuste directo para BMW E36",
        ],
      },
      {
        name: "Bomba de gasolina",
        features: [
          "Flujo constante de combustible",
          "Mejora el rendimiento del motor",
          "Compatible con sistema original",
          "Alta durabilidad",
        ],
      },
    ],
  },
  {
    group: "Suspensión y transmisión",
    products: [
      {
        name: "Resortes",
        features: [
          "Mantienen la altura correcta del vehículo",
          "Mejoran estabilidad y manejo",
          "Construcción en acero de alta resistencia",
        ],
      },
      {
        name: "Roles de empuje",
        features: [
          "Reduce fricción en componentes móviles",
          "Mejora funcionamiento del sistema",
          "Material resistente al desgaste",
        ],
      },
      {
        name: "Compensadores",
        features: [
          "Ayudan a mantener balance en el sistema mecánico",
          "Funcionamiento suave y preciso",
          "Compatible con componentes originales",
        ],
      },
    ],
  },
  {
    group: "Interior",
    products: [
      {
        name: "Consola central",
        features: [
          "Plástico original o de alta calidad",
          "Ajuste perfecto al interior del E36",
          "Mejora la estética del vehículo",
          "Fácil instalación",
        ],
      },
      {
        name: "Cluster (panel de instrumentos)",
        features: [
          "Lectura clara de velocidad, RPM y combustible",
          "Compatible con sistema eléctrico original",
          "Ideal para reemplazo o restauración",
        ],
      },
      {
        name: "Dash (tablero)",
        features: [
          "Diseño original BMW",
          "Mejora apariencia interior",
          "Material resistente al calor y desgaste",
        ],
      },
      {
        name: "Asientos",
        features: [
          "Comodidad y soporte ergonómico",
          "Compatibles con rieles originales",
          "Perfectos para restauración o reemplazo",
        ],
      },
    ],
  },
  {
    group: "Exterior",
    products: [
      {
        name: "Espejos retrovisores",
        features: [
          "Diseño original para BMW E36",
          "Excelente visibilidad",
          "Ajuste preciso en carrocería",
          "Construcción resistente",
        ],
      },
    ],
  },
  {
    group: "Dirección",
    products: [
      {
        name: "Volantes",
        features: [
          "Diseño ergonómico",
          "Compatible con sistema de dirección BMW E36",
          "Mejora el control y la conducción",
          "Opciones originales o deportivas",
        ],
      },
    ],
  },
];

export default function E36PartsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          Repuestos para BMW E36
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Una selección curada de repuestos de alta calidad para el legendario
          BMW E36, el favorito de los entusiastas.
        </p>
      </div>

      <Accordion
        type="multiple"
        defaultValue={e36Parts.map((p) => p.group)}
        className="w-full"
      >
        {e36Parts.map((partGroup) => (
          <AccordionItem value={partGroup.group} key={partGroup.group} className="border-b">
            <AccordionTrigger className="text-2xl font-semibold hover:no-underline">
              {partGroup.group}
            </AccordionTrigger>
            <AccordionContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
              {partGroup.products.map((product) => (
                <Card key={product.name} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
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
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
