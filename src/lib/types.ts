export type Province = "San José" | "Alajuela" | "Cartago" | "Heredia" | "Guanacaste" | "Puntarenas" | "Limón";
export type CurrencyCode = 'CRC' | 'USD';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency?: CurrencyCode;
  type: "Casa" | "Apartamento" | "Local Comercial" | "Oficina" | "Quinta";
  operationType: "Venta" | "Alquiler";
  status?: "Disponible" | "Vendido" | "Alquilado";
  province: Province;
  city: string;
  bedrooms: number;
  bathrooms: number;
  parking?: number;
  area_m2: number;
  imageUrls: string[];
  features: string[];
  mapUrl?: string;
  createdAt?: any;
  montoVenta?: number;
  fechaVenta?: any;
  soldAt?: any;
  incluyeServicios?: boolean;
  tieneWifi?: boolean;
  estaAmueblado?: boolean;
}

export interface Lot {
  id: string;
  title: string;
  description: string;
  price: number;
  currency?: CurrencyCode;
  lotType: "Lote" | "Quinta";
  province: Province;
  city: string;
  area_m2: number;
  topography: string;
  status?: "Disponible" | "Vendido";
  imageUrls: string[];
  features: string[];
  mapUrl?: string;
  createdAt?: any;
  montoVenta?: number;
  fechaVenta?: any;
  soldAt?: any;
}
