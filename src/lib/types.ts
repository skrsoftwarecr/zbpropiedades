export interface Product {
  id: string;
  name: string;
  category: 'Original' | 'Aftermarket';
  price: number;
  description: string;
  stock: number;
  condition: 'Nuevo' | 'Usado';
  compatibility: string[];
  imageUrls: string[];
  createdAt?: any;
  updatedAt?: any;
}

export interface Vehicle {
  id: string;
  make: 'BMW';
  model: string;
  year: number;
  price: number;
  mileage: number;
  vin: string;
  engine: string;
  transmission: 'Automático' | 'Manual';
  exteriorColor: string;
  interiorColor: string;
  features: string[];
  description: string;
  imageUrls: string[];
  availabilityStatus: 'Available' | 'Pending Inspection' | 'Sold';
  createdAt?: any;
  updatedAt?: any;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
    id: string;
    personalInfo: {
        name: string;
        email: string;
        phone: string;
    };
    deliveryInfo: {
        address: string;
        city: string;
        zip: string;
    };
    items: CartItem[];
    total: number;
    createdAt: Date;
}

export interface Appointment {
    id: string;
    vehicleId: string;
    name: string;
    email: string;
    phone: string;
    preferredDate: Date;
    message?: string;
    createdAt: Date;
}
