
export type Province = "San José" | "Alajuela" | "Cartago" | "Heredia" | "Guanacaste" | "Puntarenas" | "Limón";

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: "Casa" | "Apartamento" | "Local Comercial" | "Oficina";
  province: Province;
  city: string;
  bedrooms: number;
  bathrooms: number;
  area_m2: number;
  imageUrls: string[];
  features: string[];
  createdAt?: any;
}

export interface Lot {
  id: string;
  title: string;
  description: string;
  price: number;
  province: Province;
  city: string;
  area_m2: number;
  topography: string;
  imageUrls: string[];
  features: string[];
  createdAt?: any;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  message: string;
  status: "New" | "Contacted" | "Closed";
}
