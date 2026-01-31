
import React from 'react';
import { Order, OrderStatus, SiteSettings } from '../types';

interface OrderDetailProps {
  order: Order;
  settings: SiteSettings;
  onClose: () => void;
  onViewInvoice: (order: Order) => void;
  onPay: (order: Order) => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order, settings, onClose, onViewInvoice, onPay }) => {
  const getServiceName = (id: string) => {
    return settings.services.find(s => s.id === id)?.name || 'Layanan';
  };

  const statusSteps = [
    { key: OrderStatus.PENDING, label: 'Menunggu', icon: 'fa-clock' },
    { key: OrderStatus.PICKED_UP, label: 'Dijemput', icon: 'fa-truck' },
    { key: OrderStatus.WASHING, label: 'Dicuci', icon: 'fa-soap' },
    { key: OrderStatus.IRONING, label: 'Disetrika', icon: 'fa-fire' },
    { key: OrderStatus.READY, label: 'Siap', icon: 'fa-check-double' },
    { key: OrderStatus.COMPLETED, label: 'Selesai', icon: 'fa-house-user' }
  ];

  const currentStepIndex = statusSteps.findIndex(step => step.key === order.status);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="relative p-8 pb-4">
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
          
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-800">Detail Pesanan</h2>
            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">{order.id}</p>
          </div>
        </div>

        <div className="px-8 pb-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Progress Tracker */}
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
            <div className="flex justify-between mb-8 overflow-x-auto pb-4 gap-4 px-2">
              {statusSteps.map((step, index) => (
                <div key={step.key} className="flex flex-col items-center gap-3 shrink-0 min-w-[70px]">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    index <= currentStepIndex 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                    : 'bg-white text-slate-300 border border-slate-100'
                  }`}>
                    <i className={`fas ${step.icon} text-lg`}></i>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-tight text-center ${
                    index <= currentStepIndex ? 'text-blue-600' : 'text-slate-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative h-1 bg-slate-200 rounded-full mx-6 overflow-hidden">
               <div 
                 className="absolute inset-y-0 left-0 bg-blue-600 transition-all duration-1000 ease-out"
                 style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
               ></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Rincian Layanan</h3>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white border p-4 rounded-2xl">
                    <div>
                      <p className="font-bold text-slate-800">{getServiceName(item.serviceId)}</p>
                      <p className="text-xs text-slate-500">{item.quantity} Unit</p>
                    </div>
                    <p className="font-black text-blue-600">Rp {item.subtotal.toLocaleString('id-ID')}</p>
                  </div>
                ))}
                <div className="pt-2 flex justify-between items-center px-4">
                  <span className="font-bold text-slate-800">Total Biaya</span>
                  <span className="text-xl font-black text-slate-900">Rp {order.totalPrice.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Status Pembayaran</h3>
                <div className={`p-6 rounded-[2rem] flex items-center gap-4 border ${
                  order.paymentStatus === 'PAID' 
                    ? 'bg-green-50 border-green-100' 
                    : 'bg-red-50 border-red-100'
                }`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                    order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
                  }`}>
                    <i className={`fas ${order.paymentStatus === 'PAID' ? 'fa-check-circle' : 'fa-clock'}`}></i>
                  </div>
                  <div>
                    <p className={`font-black uppercase tracking-tight ${order.paymentStatus === 'PAID' ? 'text-green-700' : 'text-red-700'}`}>
                      {order.paymentStatus === 'PAID' ? 'Lunas' : 'Belum Bayar'}
                    </p>
                    <p className="text-xs text-slate-500">{order.paymentMethod || 'QRIS Tripay'}</p>
                  </div>
                </div>
              </div>

              {order.notes && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Catatan</h3>
                  <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 italic text-sm text-orange-800">
                    "{order.notes}"
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => onViewInvoice(order)}
            className="flex-1 bg-white text-slate-800 border-2 border-slate-200 px-8 py-4 rounded-2xl font-black shadow-sm hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
          >
            <i className="fas fa-file-invoice"></i> Lihat Struk / Invoice
          </button>
          {order.paymentStatus === 'UNPAID' && (
            <button 
              onClick={() => onPay(order)}
              className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
            >
              Bayar Sekarang
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
