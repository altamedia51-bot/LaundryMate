
import React, { useState, useMemo } from 'react';
import { Order, OrderStatus, PaymentStatus, SiteSettings } from '../types';
import OrderDetailsModal from './OrderDetailsModal';

interface OrderManagementTableProps {
  orders: Order[];
  settings: SiteSettings;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  onPrintInvoice: (order: Order) => void;
  isLoading?: boolean;
}

const OrderManagementTable: React.FC<OrderManagementTableProps> = ({ 
  orders, 
  settings, 
  onUpdateStatus, 
  onPrintInvoice,
  isLoading = false 
}) => {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'ALL'>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const statusColors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'bg-slate-100 text-slate-600',
    [OrderStatus.PICKED_UP]: 'bg-blue-100 text-blue-600',
    [OrderStatus.WASHING]: 'bg-yellow-100 text-yellow-600',
    [OrderStatus.IRONING]: 'bg-purple-100 text-purple-600',
    [OrderStatus.READY]: 'bg-orange-100 text-orange-600',
    [OrderStatus.COMPLETED]: 'bg-green-100 text-green-700',
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchStatus = statusFilter === 'ALL' || order.status === statusFilter;
      const matchPayment = paymentFilter === 'ALL' || order.paymentStatus === paymentFilter;
      return matchStatus && matchPayment;
    });
  }, [orders, statusFilter, paymentFilter]);

  const handleStatusUpdate = async (id: string, newStatus: OrderStatus) => {
    setUpdatingId(id);
    try {
      await onUpdateStatus(id, newStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative transition-all">
      {isLoading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Sinkronisasi Cloud...</p>
          </div>
        </div>
      )}

      <div className="p-8 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-50/30">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <i className="fas fa-box-open text-blue-600"></i> Transaksi Firestore
          </h2>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-slate-500 font-medium">Total: {orders.length} pesanan terdaftar</p>
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Real-time Connected</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Status:</span>
            <select 
              className="text-xs font-bold bg-transparent outline-none cursor-pointer pr-4"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="ALL">Semua</option>
              {Object.values(OrderStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Bayar:</span>
            <select 
              className="text-xs font-bold bg-transparent outline-none cursor-pointer pr-4"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value as any)}
            >
              <option value="ALL">Semua</option>
              <option value="PAID">Lunas</option>
              <option value="UNPAID">Belum</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Detail Order</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pelanggan</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Pembayaran</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Progres Kerja</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.map(order => (
              <tr key={order.id} className="hover:bg-blue-50/30 transition-all group">
                <td className="px-8 py-6">
                  <p className="font-black text-slate-800 tracking-tight">{order.id}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </td>
                <td className="px-8 py-6">
                  <p className="font-bold text-slate-700">{order.customerName}</p>
                  <p className="text-[10px] font-medium text-slate-400">ID: {order.customerId}</p>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col items-center gap-1.5">
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      order.paymentStatus === 'PAID' 
                        ? 'bg-green-50 text-green-600 border-green-100' 
                        : 'bg-red-50 text-red-500 border-red-100'
                    }`}>
                      {order.paymentStatus === 'PAID' ? 'Lunas' : 'Belum Bayar'}
                    </span>
                    <p className="text-[11px] font-black text-blue-600 tracking-tighter">
                      Rp {order.totalPrice.toLocaleString('id-ID')}
                    </p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="relative min-w-[140px]">
                    {updatingId === order.id ? (
                      <div className="flex items-center gap-2 text-blue-500 animate-pulse">
                        <i className="fas fa-circle-notch fa-spin"></i>
                        <span className="text-[10px] font-black">UPDATING...</span>
                      </div>
                    ) : (
                      <select 
                        className={`w-full appearance-none text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500/50 outline-none cursor-pointer transition-all ${statusColors[order.status]}`}
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                      >
                        {Object.values(OrderStatus).map(status => (
                          <option key={status} value={status} className="bg-white text-slate-800 normal-case font-bold">
                            {status}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button 
                      onClick={() => onPrintInvoice(order)}
                      className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                    >
                      <i className="fas fa-print"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder}
          settings={settings}
          onClose={() => setSelectedOrder(null)}
          onPrintInvoice={onPrintInvoice}
        />
      )}
    </div>
  );
};

export default OrderManagementTable;
