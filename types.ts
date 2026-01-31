
export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PICKED_UP = 'DIJEMPUT',
  WASHING = 'DICUCI',
  IRONING = 'DISETRIKA',
  READY = 'SIAP ANTAR',
  COMPLETED = 'SELESAI'
}

export type PaymentStatus = 'PAID' | 'UNPAID';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  address: string;
  phone: string;
  avatar: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  unit: 'kg' | 'pcs';
  description: string;
}

export interface OrderItem {
  serviceId: string;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentUrl?: string;
  paymentMethod?: string;
  items: OrderItem[];
  totalPrice: number;
  createdAt: string;
  notes?: string;
}

export interface PaymentConfig {
  isActive: boolean;
  provider: 'Tripay' | 'Duitku';
  merchantCode: string;
  apiKey: string;
  privateKey: string;
}

export interface SiteSettings {
  hero: {
    title: string;
    subtitle: string;
    bannerUrl: string;
  };
  services: ServiceItem[];
  payment: PaymentConfig;
  contact: {
    email: string;
    phone: string;
    address: string;
    social: {
      instagram: string;
      facebook: string;
      whatsapp: string;
    };
  };
}
