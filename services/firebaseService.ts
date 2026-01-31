
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  updateDoc, 
  doc, 
  addDoc,
  serverTimestamp,
  where,
  Firestore
} from 'firebase/firestore';
import { SiteSettings, Order, User, UserRole, UserStatus } from '../types';

// Konfigurasi Firebase Default (Placeholder)
const firebaseConfig = {
  apiKey: "AIzaSy_PLACEHOLDER", // Ganti dengan key asli untuk koneksi Cloud
  authDomain: "laundrymate-pro.firebaseapp.com",
  projectId: "laundrymate-pro",
  storageBucket: "laundrymate-pro.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef"
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let isMockMode = true;

try {
  // Hanya inisialisasi jika API Key bukan placeholder
  if (firebaseConfig.apiKey !== "AIzaSy_PLACEHOLDER") {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    isMockMode = false;
    console.log("Firebase initialized in Cloud Mode");
  } else {
    console.warn("Firebase key is placeholder. Running in Demo Mode (LocalStorage).");
  }
} catch (error) {
  console.error("Firebase Initialization Error, falling back to Mock Mode:", error);
}

class FirebaseService {
  private ORDERS_COL = 'orders';
  private SETTINGS_COL = 'site_settings';
  private USERS_COL = 'users';

  private getMockOrders(): Order[] {
    const data = localStorage.getItem('mock_orders');
    return data ? JSON.parse(data) : [];
  }

  private saveMockOrders(orders: Order[]) {
    localStorage.setItem('mock_orders', JSON.stringify(orders));
    window.dispatchEvent(new Event('storage')); // Notify other listeners
  }

  getRealtimeOrders(callback: (orders: Order[]) => void) {
    if (isMockMode || !db) {
      const fetchLocal = () => callback(this.getMockOrders());
      fetchLocal();
      window.addEventListener('storage', fetchLocal);
      return () => window.removeEventListener('storage', fetchLocal);
    }

    try {
      const q = query(collection(db, this.ORDERS_COL), orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        })) as Order[];
        callback(orders);
      });
    } catch (err) {
      callback(this.getMockOrders());
      return () => {};
    }
  }

  getRealtimeUserOrders(userId: string, callback: (orders: Order[]) => void) {
    if (isMockMode || !db) {
      const fetchLocal = () => {
        const all = this.getMockOrders();
        callback(all.filter(o => o.customerId === userId));
      };
      fetchLocal();
      window.addEventListener('storage', fetchLocal);
      return () => window.removeEventListener('storage', fetchLocal);
    }

    try {
      const q = query(
        collection(db, this.ORDERS_COL), 
        where('customerId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      return onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        })) as Order[];
        callback(orders);
      });
    } catch (err) {
      return () => {};
    }
  }

  async updateOrderStatus(orderId: string, newStatus: string) {
    if (isMockMode || !db) {
      const orders = this.getMockOrders();
      const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o);
      this.saveMockOrders(updated);
      return true;
    }
    const orderRef = doc(db, this.ORDERS_COL, orderId);
    await updateDoc(orderRef, { status: newStatus });
    return true;
  }

  async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>) {
    if (isMockMode || !db) {
      const id = 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      const newOrder: Order = {
        ...orderData,
        id,
        createdAt: new Date().toISOString()
      };
      const orders = this.getMockOrders();
      this.saveMockOrders([newOrder, ...orders]);
      return id;
    }

    const docRef = await addDoc(collection(db, this.ORDERS_COL), {
      ...orderData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  }

  async updateSiteSettings(settings: SiteSettings) {
    localStorage.setItem('site_settings', JSON.stringify(settings));
    if (!isMockMode && db) {
      try {
        const settingsRef = doc(db, this.SETTINGS_COL, 'global_config');
        await updateDoc(settingsRef, settings as any);
      } catch (e) {
        console.warn("Failed to sync settings to Cloud, saved locally.");
      }
    }
    return true;
  }

  subscribeToSettings(callback: (settings: SiteSettings) => void) {
    const saved = localStorage.getItem('site_settings');
    if (saved) callback(JSON.parse(saved));

    if (isMockMode || !db) return () => {};

    const settingsRef = doc(db, this.SETTINGS_COL, 'global_config');
    return onSnapshot(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as SiteSettings;
        localStorage.setItem('site_settings', JSON.stringify(data));
        callback(data);
      }
    });
  }

  async loginWithGoogle(role: UserRole): Promise<User | null> {
    return role === UserRole.ADMIN ? {
      id: 'admin_1',
      name: 'Super Admin',
      email: 'admin@laundrymate.id',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      address: 'Kanto Pusat LaundryMate',
      phone: '0811111111',
      avatar: 'https://i.pravatar.cc/150?u=admin'
    } : {
      id: `cust_${Math.random().toString(36).substr(2, 5)}`,
      name: 'Customer Demo',
      email: 'customer@demo.com',
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
      address: '', 
      phone: '',
      avatar: 'https://i.pravatar.cc/150?u=cust'
    };
  }

  async saveUserProfile(user: User) {
    console.log("Saving profile (Mock/Cloud):", user);
    return true;
  }
}

export const firebaseService = new FirebaseService();
