
import React from 'react';
import { Order, SiteSettings, OrderStatus } from '../types';

interface OrderDetailsModalProps {
  order: Order;
  settings: SiteSettings;
  onClose: () => void;
  onPrintInvoice: (order: Order) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, settings, onClose, onPrintInvoice }) => {
  const statusColors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'bg-slate-100 text-slate-600',
    [OrderStatus.PICKED_UP]: 'bg-blue-100 text-blue-600',
    [OrderStatus.WASHING]: 'bg-yellow-100 text-yellow-600',
    [OrderStatus.IRONING]: 'bg-purple-100 text-purple-600',
    [OrderStatus.READY]: 'bg-orange-100 text-orange-600',
    [OrderStatus.COMPLETED]: 'bg-green-100 text-green-700',
  };

  const getServiceName = (id: string) => {
    return settings.services.find(s => s.id === id)?.name || 'Layanan Tidak Diketahui';
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Detail Pesanan</h2>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">{order.id}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Customer & Order Status Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Informasi Pelanggan</h3>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="font-bold text-slate-800">{order.customerName}</p>
                <p className="text-sm text-slate-500 mt-1">ID Pelanggan: {order.customerId}</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Status Transaksi</h3>
              <div className="flex flex-wrap gap-2">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColors[order.status]}`}>
                  {order.status}
                </span>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-500'
                }`}>
                  {order.paymentStatus === 'PAID' ? 'Lunas' : 'Belum Bayar'}
                </span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Rincian Layanan</h3>
            <div className="border border-slate-100 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3 font-bold text-slate-600">Layanan</th>
                    <th className="px-4 py-3 font-bold text-slate-600 text-center">Jumlah</th>
                    <th className="px-4 py-3 font-bold text-slate-600 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 text-slate-700">{getServiceName(item.serviceId)}</td>
                      <td className="px-4 py-3 text-slate-700 text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-slate-900 font-bold text-right">Rp {item.subtotal.toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-blue-50/50">
                  <tr>
                    <td colSpan={2} className="px-4 py-4 font-bold text-slate-800">Total Akhir</td>
                    <td className="px-4 py-4 font-black text-blue-600 text-right text-lg">Rp {order.totalPrice.toLocaleString('id-ID')}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Catatan Tambahan</h3>
            <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
              <p className="text-sm text-slate-700 italic">
                {order.notes || 'Tidak ada catatan tambahan untuk pesanan ini.'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Tutup
          </button>
          <button 
            onClick={() => onPrintInvoice(order)}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-shadow shadow-lg shadow-blue-200 flex items-center gap-2"
          >
            <i className="fas fa-print"></i> Cetak Nota
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;