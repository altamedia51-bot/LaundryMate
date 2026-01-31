
import React from 'react';
import { Order, SiteSettings } from '../types';

interface InvoiceComponentProps {
  order: Order;
  settings: SiteSettings;
  onClose?: () => void;
}

const InvoiceComponent: React.FC<InvoiceComponentProps> = ({ order, settings, onClose }) => {
  const getServiceName = (id: string) => {
    return settings.services.find(s => s.id === id)?.name || 'Layanan';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-100 min-h-screen p-4 md:p-8 flex flex-col items-center print:bg-white print:p-0">
      {/* Navigation for web view */}
      <div className="w-full max-w-[400px] flex justify-between items-center mb-6 print:hidden">
        <button 
          onClick={onClose}
          className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-2"
        >
          <i className="fas fa-arrow-left"></i> Kembali
        </button>
        <button 
          onClick={handlePrint}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
        >
          <i className="fas fa-print mr-2"></i> Print / PDF
        </button>
      </div>

      {/* Receipt Paper Container */}
      <div className="bg-white w-full max-w-[400px] shadow-2xl p-8 print:shadow-none print:max-w-full font-mono text-slate-900 border-t-8 border-slate-800">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-2xl font-black uppercase tracking-tighter">LaundryMate Pro</h1>
          <p className="text-xs">{settings.contact.address}</p>
          <p className="text-xs">Telp: {settings.contact.phone}</p>
          <div className="border-b border-dashed border-slate-300 pt-4"></div>
        </div>

        <div className="space-y-1 text-xs mb-6">
          <div className="flex justify-between">
            <span>No. Order:</span>
            <span className="font-bold">{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span>Tanggal:</span>
            <span>{new Date(order.createdAt).toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between">
            <span>Pelanggan:</span>
            <span className="font-bold">{order.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span>Metode:</span>
            <span>{order.paymentMethod || 'Tunai'}</span>
          </div>
        </div>

        <div className="border-b border-dashed border-slate-300 mb-4"></div>

        <table className="w-full text-xs mb-6">
          <thead>
            <tr className="text-left">
              <th className="pb-2">Layanan</th>
              <th className="pb-2 text-center">Qty</th>
              <th className="pb-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {order.items.map((item, idx) => (
              <tr key={idx}>
                <td className="py-2 pr-2">{getServiceName(item.serviceId)}</td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-right">Rp {item.subtotal.toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-b border-dashed border-slate-300 mb-4"></div>

        <div className="space-y-2">
          <div className="flex justify-between text-base font-black">
            <span>TOTAL:</span>
            <span>Rp {order.totalPrice.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-center pt-4">
             <span className={`px-6 py-1 border-2 font-black uppercase tracking-widest ${
               order.paymentStatus === 'PAID' 
                ? 'border-green-600 text-green-600' 
                : 'border-red-500 text-red-500'
             }`}>
               {order.paymentStatus === 'PAID' ? 'LUNAS' : 'BELUM BAYAR'}
             </span>
          </div>
        </div>

        {order.notes && (
          <div className="mt-8 text-[10px] italic text-slate-500 border-t border-slate-100 pt-4">
            Catatan: {order.notes}
          </div>
        )}

        <div className="mt-10 text-center space-y-1">
          <div className="border-b border-dashed border-slate-300 mb-4"></div>
          <p className="text-[10px] font-bold uppercase">Terima Kasih</p>
          <p className="text-[10px]">Pakaian bersih adalah prioritas kami.</p>
          <p className="text-[10px] text-slate-400 mt-2 tracking-widest">www.laundrymate.id</p>
        </div>
      </div>
      
      {/* Print-only CSS optimization */}
      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: white !important; }
          .min-h-screen { min-height: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default InvoiceComponent;
