
import React, { useState, useEffect, useRef } from 'react';
import { SiteSettings, User, UserRole, UserStatus, Order, OrderStatus, OrderItem } from './types';
import { INITIAL_SITE_SETTINGS, MOCK_USERS } from './constants';
import LandingPage from './pages/LandingPage';
import AdminCMSPanel from './components/AdminCMSPanel';
import UserManagementTable from './components/UserManagementTable';
import OrderManagementTable from './components/OrderManagementTable';
import NewOrderModal from './components/NewOrderModal';
import PaymentModal from './components/PaymentModal';
import PaymentSettings from './components/PaymentSettings';
import OrderDetail from './components/OrderDetail';
import InvoiceComponent from './components/InvoiceComponent';
import ProfileCompletionModal from './components/ProfileCompletionModal';
import InstallPrompt from './components/InstallPrompt';
import NotificationToast, { ToastMessage } from './components/NotificationToast';
import { createPaymentTransaction } from './services/paymentService';
import { firebaseService } from './services/firebaseService';

type AdminTab = 'dashboard' | 'transactions' | 'users' | 'cms' | 'payment';

const CustomerDashboard: React.FC<{
  user: User;
  orders: Order[];
  onLogout: () => void;
  onNewOrder: () => void;
  onViewDetail: (order: Order) => void;
}> = ({ user, orders, onLogout, onNewOrder, onViewDetail }) => {
  return (
    <div className="min-h-screen bg-slate-50 animate-in fade-in duration-500 pb-20 md:pb-0">
      <InstallPrompt />
      <header className="bg-white border-b sticky top-0 z-40 px-4 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <i className="fas fa-soap"></i>
          </div>
          <span className="font-bold text-slate-800">LaundryMate <span className="text-blue-600">Portal</span></span>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden md:block text-right border-r pr-4 border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">System Status</p>
              <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
              </p>
           </div>
           <button onClick={onLogout} className="text-slate-400 hover:text-red-500 transition-colors p-2">
            <i className="fas fa-sign-out-alt text-xl"></i>
           </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 py-8 space-y-6">
        <div className="bg-blue-600 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] text-white shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-black mb-2 tracking-tight">Halo, {user?.name || 'Pelanggan'}!</h2>
            <p className="opacity-90 font-medium max-w-sm text-sm md:text-base">Siap untuk hari yang lebih segar? Kami akan jemput cucian Anda segera.</p>
          </div>
          <button 
            onClick={onNewOrder}
            className="w-full md:w-auto bg-white text-blue-600 px-10 py-4 md:py-5 rounded-2xl font-black shadow-xl hover:scale-105 transition-transform active:scale-95 relative z-10 uppercase tracking-widest text-sm"
          >
            + Pesan Laundry
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
                  <i className="fas fa-history text-blue-500"></i> Riwayat & Status
                </h3>
                <span className="text-xs font-bold text-slate-400">{orders.length} Pesanan</span>
              </div>
              
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="border border-slate-100 rounded-[1.5rem] p-5 md:p-6 hover:border-blue-500 hover:shadow-lg transition-all group bg-white">
                      <div className="flex justify-between items-center mb-5">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{order.id}</p>
                          <p className="text-sm font-black text-slate-800">
                            {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          order.status === OrderStatus.COMPLETED ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <button 
                          onClick={() => onViewDetail(order)}
                          className="bg-slate-50 text-slate-800 px-4 md:px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                          Detail
                        </button>
                        <p className="text-lg md:text-xl font-black text-blue-600">Rp {(order.totalPrice || 0).toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[2rem] text-slate-400 space-y-4">
                  <i className="fas fa-shopping-basket text-4xl opacity-20"></i>
                  <p className="font-bold">Belum ada pesanan aktif.</p>
                  <button onClick={onNewOrder} className="text-blue-600 text-sm font-black uppercase underline">Mulai Pesan Sekarang</button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm md:sticky md:top-24">
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <img src={user?.avatar || 'https://i.pravatar.cc/150'} className="w-24 h-24 rounded-3xl mx-auto border-4 border-blue-50 shadow-xl" alt="" />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
                </div>
                <div>
                  <p className="text-xl font-black text-slate-800 tracking-tight">{user?.name || 'User'}</p>
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">{user?.phone || 'No WhatsApp'}</p>
                </div>
                <div className="pt-6 border-t border-slate-50 text-left space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alamat Penjemputan:</p>
                  <p className="text-xs font-bold text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl">
                    {user?.address || 'Alamat belum dilengkapi.'}
                  </p>
                </div>
                <button className="w-full py-3 bg-slate-50 text-slate-400 text-[10px] font-black uppercase rounded-xl border border-dashed border-slate-200 hover:border-blue-300 hover:text-blue-500 transition-all cursor-not-allowed">
                  Edit Profil
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'admin' | 'customer' | 'invoice'>('landing');
  const [adminActiveTab, setAdminActiveTab] = useState<AdminTab>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<ToastMessage[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [activePaymentOrder, setActivePaymentOrder] = useState<Order | null>(null);
  const [customerViewingOrder, setCustomerViewingOrder] = useState<Order | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);

  const prevOrdersCount = useRef(0);

  useEffect(() => {
    const unsubSettings = firebaseService.subscribeToSettings(setSettings);
    
    let unsubOrders = () => {};
    if (currentUser) {
      setIsLoadingOrders(true);
      if (currentUser.role === UserRole.ADMIN) {
        unsubOrders = firebaseService.getRealtimeOrders((all) => {
          if (all.length > prevOrdersCount.current && prevOrdersCount.current > 0) {
            triggerNewOrderNotification(all[0]);
          }
          setOrders(all);
          prevOrdersCount.current = all.length;
          setIsLoadingOrders(false);
        });
      } else {
        unsubOrders = firebaseService.getRealtimeUserOrders(currentUser.id, (userOrders) => {
          setOrders(userOrders);
          setIsLoadingOrders(false);
        });
      }
    }

    return () => {
      unsubSettings();
      unsubOrders();
    };
  }, [currentUser]);

  const triggerNewOrderNotification = (order: Order) => {
    if (Notification.permission === 'granted') {
      new Notification('Pesanan Baru!', {
        body: `${order.customerName} - Rp ${order.totalPrice.toLocaleString()}`,
        icon: 'https://cdn-icons-png.flaticon.com/512/3003/3003984.png'
      });
    }

    const newToast: ToastMessage = {
      id: Math.random().toString(36).substr(2, 9),
      title: '📦 Pesanan Masuk!',
      message: `${order.customerName} membuat pesanan ${order.id}.`,
      type: 'order',
      action: () => setAdminActiveTab('transactions')
    };

    setNotifications(prev => [newToast, ...prev]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== newToast.id)), 6000);
  };

  const updateSettings = async (newSettings: SiteSettings) => {
    setSettings(newSettings);
    await firebaseService.updateSiteSettings(newSettings);
  };

  const handleUpdateOrderStatus = async (id: string, newStatus: OrderStatus) => {
    try {
      await firebaseService.updateOrderStatus(id, newStatus);
    } catch (e) {
      alert("Gagal memperbarui status.");
    }
  };

  const handlePrintInvoice = (order: Order) => {
    setInvoiceOrder(order);
    setCurrentPage('invoice');
  };

  const handleCreateOrder = async (items: OrderItem[], notes: string) => {
    if (!currentUser) return;
    
    const totalPrice = items.reduce((acc, item) => acc + item.subtotal, 0);
    const orderPayload = {
      customerId: currentUser.id,
      customerName: currentUser.name,
      status: OrderStatus.PENDING,
      paymentStatus: 'UNPAID' as const,
      paymentMethod: settings.payment.isActive ? settings.payment.provider : 'Tunai',
      items,
      notes,
      totalPrice,
    };

    try {
      const orderId = await firebaseService.createOrder(orderPayload);
      const qrisUrl = await createPaymentTransaction({ 
        ...orderPayload, 
        id: orderId, 
        createdAt: new Date().toISOString() 
      });
      
      setShowOrderModal(false);
      setActivePaymentOrder({ 
        ...orderPayload, 
        id: orderId, 
        createdAt: new Date().toISOString(), 
        paymentUrl: qrisUrl 
      });
      
    } catch (error: any) {
      console.error("Order creation failed:", error);
      alert('Gagal membuat pesanan. Silakan coba lagi.');
    }
  };

  const handleLogin = async (role: UserRole) => {
    try {
      const user = await firebaseService.loginWithGoogle(role);
      if (user) {
        setCurrentUser(user);
        if (role === UserRole.ADMIN && 'Notification' in window) {
          Notification.requestPermission();
        }
        if (role === UserRole.CUSTOMER && (!user.address || !user.phone)) {
          setShowProfileCompletion(true);
        } else {
          setCurrentPage(role === UserRole.ADMIN ? 'admin' : 'customer');
        }
      }
    } catch (e) {
      alert('Login gagal.');
    }
  };

  const handleProfileComplete = async (updatedUser: User) => {
    await firebaseService.saveUserProfile(updatedUser);
    setCurrentUser(updatedUser);
    setShowProfileCompletion(false);
    setCurrentPage('customer');
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentPage('landing');
    setShowProfileCompletion(false);
  };

  const adminMenuItems = [
    { id: 'dashboard', icon: 'fa-th-large', label: 'Home' },
    { id: 'transactions', icon: 'fa-shopping-basket', label: 'Order' },
    { id: 'users', icon: 'fa-users', label: 'User' },
    { id: 'cms', icon: 'fa-magic', label: 'CMS' },
    { id: 'payment', icon: 'fa-credit-card', label: 'Pay' },
  ];

  return (
    <div className="min-h-screen text-slate-900 selection:bg-blue-100 selection:text-blue-600">
      <NotificationToast 
        notifications={notifications} 
        onDismiss={(id) => setNotifications(prev => prev.filter(n => n.id !== id))} 
      />

      {currentPage === 'landing' && <LandingPage settings={settings} onNavigate={setCurrentPage} />}

      {currentPage === 'login' && (
        <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
          <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center text-white text-4xl shadow-2xl shadow-blue-200">
                <i className="fas fa-lock"></i>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Cloud Portal</h2>
              <p className="text-slate-500 text-sm font-medium">Masuk ke sistem LaundryMate Live.</p>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={() => handleLogin(UserRole.ADMIN)}
                className="w-full flex items-center justify-center gap-4 p-4 md:p-5 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all font-bold shadow-xl active:scale-95 text-sm md:text-base"
              >
                <i className="fab fa-google text-lg md:text-xl"></i>
                Masuk sebagai Admin
              </button>

              <button 
                onClick={() => handleLogin(UserRole.CUSTOMER)}
                className="w-full flex items-center justify-center gap-4 p-4 md:p-5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-xl shadow-blue-100 active:scale-95 text-sm md:text-base"
              >
                <i className="fas fa-user-circle text-lg md:text-xl"></i>
                Masuk sebagai Pelanggan
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 text-center">
               <button onClick={() => setCurrentPage('landing')} className="text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors">
                <i className="fas fa-arrow-left mr-2"></i> Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      )}

      {currentPage === 'admin' && currentUser?.role === UserRole.ADMIN && (
        <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 pb-20 lg:pb-0">
          {/* Desktop Sidebar */}
          <aside className="w-64 bg-white border-r hidden lg:flex flex-col">
            <div className="p-8 border-b flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-100">
                <i className="fas fa-soap"></i>
              </div>
              <span className="text-xl font-black text-slate-800 tracking-tight">Admin<span className="text-blue-600">Cloud</span></span>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {adminMenuItems.map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setAdminActiveTab(tab.id as AdminTab)}
                  className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold transition-all ${
                    adminActiveTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' 
                    : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <i className={`fas ${tab.icon} w-5`}></i> {tab.label}
                </button>
              ))}
            </nav>
            <div className="p-6 border-t">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <img src={currentUser.avatar} className="w-10 h-10 rounded-xl" alt="" />
                <div className="flex-1 overflow-hidden">
                  <p className="font-black text-xs text-slate-800 truncate">{currentUser.name}</p>
                  <p className="text-[10px] font-bold text-green-600 uppercase">Live</p>
                </div>
                <button onClick={logout} className="text-red-500 p-2 hover:bg-red-50 rounded-xl transition-colors"><i className="fas fa-power-off"></i></button>
              </div>
            </div>
          </aside>

          {/* Mobile Header */}
          <header className="lg:hidden bg-white border-b px-4 h-16 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                <i className="fas fa-soap"></i>
              </div>
              <span className="font-bold text-slate-800">Admin<span className="text-blue-600">Cloud</span></span>
            </div>
            <button onClick={logout} className="text-slate-400 p-2"><i className="fas fa-sign-out-alt"></i></button>
          </header>

          {/* Admin Content Area */}
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
              {adminActiveTab === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 shadow-sm space-y-2">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-lg md:text-xl mb-2 md:mb-4"><i className="fas fa-boxes"></i></div>
                    <p className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-widest">Total Pesanan</p>
                    <p className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter">{orders.length}</p>
                  </div>
                  <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 shadow-sm space-y-2">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-lg md:text-xl mb-2 md:mb-4"><i className="fas fa-wallet"></i></div>
                    <p className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-widest">Omzet Lunas</p>
                    <p className="text-3xl md:text-4xl font-black text-green-600 tracking-tighter">Rp {orders.filter(o => o.paymentStatus === 'PAID').reduce((acc, o) => acc + o.totalPrice, 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 shadow-sm space-y-2">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-lg md:text-xl mb-2 md:mb-4"><i className="fas fa-clock"></i></div>
                    <p className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-widest">Menunggu Bayar</p>
                    <p className="text-3xl md:text-4xl font-black text-orange-600 tracking-tighter">Rp {orders.filter(o => o.paymentStatus === 'UNPAID').reduce((acc, o) => acc + o.totalPrice, 0).toLocaleString()}</p>
                  </div>
                </div>
              )}

              {adminActiveTab === 'transactions' && (
                <OrderManagementTable 
                  orders={orders} 
                  settings={settings}
                  onUpdateStatus={handleUpdateOrderStatus} 
                  onPrintInvoice={handlePrintInvoice}
                  isLoading={isLoadingOrders}
                />
              )}

              {adminActiveTab === 'users' && (
                <UserManagementTable users={MOCK_USERS} onToggleStatus={() => {}} onDeleteUser={() => {}} />
              )}

              {adminActiveTab === 'cms' && (
                <AdminCMSPanel settings={settings} onUpdate={updateSettings} />
              )}

              {adminActiveTab === 'payment' && (
                <PaymentSettings 
                  config={settings.payment} 
                  onSave={(newConfig) => updateSettings({ ...settings, payment: newConfig })} 
                />
              )}
            </div>
          </main>

          {/* Admin Mobile Navigation */}
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 px-2 z-50">
            {adminMenuItems.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setAdminActiveTab(tab.id as AdminTab)}
                className={`flex flex-col items-center gap-1 transition-all ${
                  adminActiveTab === tab.id ? 'text-blue-600' : 'text-slate-400'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  adminActiveTab === tab.id ? 'bg-blue-50' : 'bg-transparent'
                }`}>
                  <i className={`fas ${tab.icon} text-lg`}></i>
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}

      {currentPage === 'customer' && currentUser && (
        <CustomerDashboard 
          user={currentUser} 
          orders={orders} 
          onLogout={logout} 
          onNewOrder={() => setShowOrderModal(true)} 
          onViewDetail={setCustomerViewingOrder} 
        />
      )}

      {showProfileCompletion && currentUser && (
        <ProfileCompletionModal user={currentUser} onComplete={handleProfileComplete} />
      )}

      {showOrderModal && (
        <NewOrderModal settings={settings} onClose={() => setShowOrderModal(false)} onSubmit={handleCreateOrder} />
      )}

      {activePaymentOrder && (
        <PaymentModal 
          order={activePaymentOrder} 
          onSuccess={async () => {
            await firebaseService.updateOrderStatus(activePaymentOrder.id, OrderStatus.PENDING);
            setActivePaymentOrder(null);
          }} 
          onClose={() => setActivePaymentOrder(null)} 
        />
      )}

      {customerViewingOrder && (
        <OrderDetail 
          order={customerViewingOrder}
          settings={settings}
          onClose={() => setCustomerViewingOrder(null)}
          onViewInvoice={(order) => {
            setInvoiceOrder(order);
            setCurrentPage('invoice');
            setCustomerViewingOrder(null);
          }}
          onPay={(order) => {
            setActivePaymentOrder(order);
            setCustomerViewingOrder(null);
          }}
        />
      )}

      {currentPage === 'invoice' && invoiceOrder && (
        <InvoiceComponent 
          order={invoiceOrder} 
          settings={settings} 
          onClose={() => setCurrentPage(currentUser?.role === UserRole.ADMIN ? 'admin' : 'customer')} 
        />
      )}
    </div>
  );
};

export default App;
