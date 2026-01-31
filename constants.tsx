
import { SiteSettings, UserRole, UserStatus, User, OrderStatus, Order } from './types';

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  hero: {
    title: "Cucian Bersih, Hidup Makin Praktis",
    subtitle: "Solusi laundry profesional dengan layanan antar-jemput gratis. Kami merawat pakaian Anda seperti milik sendiri.",
    bannerUrl: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&q=80&w=1200",
  },
  services: [
    { id: '1', name: 'Cuci Kering Lipat', price: 7000, unit: 'kg', description: 'Layanan standar cuci bersih dan lipat rapi.' },
    { id: '2', name: 'Cuci Setrika', price: 10000, unit: 'kg', description: 'Cucian bersih, wangi, dan disetrika licin.' },
    { id: '3', name: 'Express 6 Jam', price: 15000, unit: 'kg', description: 'Layanan super cepat untuk kebutuhan mendesak.' },
    { id: '4', name: 'Bed Cover / Selimut', price: 25000, unit: 'pcs', description: 'Pembersihan mendalam untuk perlengkapan tidur.' }
  ],
  payment: {
    isActive: false,
    provider: 'Tripay',
    merchantCode: '',
    apiKey: '',
    privateKey: ''
  },
  contact: {
    email: "halo@laundrymate.id",
    phone: "+62 812 3456 7890",
    address: "Jl. Bersih Sejahtera No. 123, Jakarta Selatan",
    social: {
      instagram: "laundrymate_id",
      facebook: "LaundryMatePro",
      whatsapp: "6281234567890"
    }
  }
};

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Budi Santoso',
    email: 'admin@laundrymate.id',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    address: 'Kanto Pusat LaundryMate',
    phone: '0811111111',
    avatar: 'https://picsum.photos/seed/admin/200'
  },
  {
    id: 'u2',
    name: 'Siti Aminah',
    email: 'siti@example.com',
    role: UserRole.CUSTOMER,
    status: UserStatus.ACTIVE,
    address: 'Jl. Melati No. 45, Tebet',
    phone: '0822222222',
    avatar: 'https://picsum.photos/seed/siti/200'
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    customerId: 'u2',
    customerName: 'Siti Aminah',
    status: OrderStatus.WASHING,
    paymentStatus: 'UNPAID',
    paymentMethod: 'QRIS Tripay',
    totalPrice: 35000,
    items: [{ serviceId: '1', quantity: 5, subtotal: 35000 }],
    createdAt: new Date().toISOString()
  }
];
