
export type Province = "San José" | "Alajuela" | "Cartago" | "Heredia" | "Guanacaste" | "Puntarenas" | "Limón";

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
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
  // Campos de venta
  montoVenta?: number;
  fechaVenta?: any;
  soldAt?: any;
  compradorNombre?: string;
  agenteResponsable?: string;
  notasVenta?: string;
  // Campos específicos de Alquiler
  incluyeServicios?: boolean;
  tieneWifi?: boolean;
  estaAmueblado?: boolean;
}

export interface Lot {
  id: string;
  title: string;
  description: string;
  price: number;
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
}

export interface BatchOperationResult {
  total: number;
  exitosos: number;
  fallidos: number;
  detalles: { id: string; success: boolean; error?: string }[];
}

export interface AuditLog {
  id: string;
  action: 'DELETE_BATCH' | 'SALE_BATCH' | 'DELETE' | 'SALE';
  targetIds: string[];
  userId: string;
  userName?: string;
  timestamp: any;
  reason?: string;
  metadata?: any;
}
