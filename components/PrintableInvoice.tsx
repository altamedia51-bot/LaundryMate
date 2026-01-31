
import React from 'react';
import { Order, SiteSettings } from '../types';

interface PrintableInvoiceProps {
  order: Order;
  settings: SiteSettings;
}

const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({ order, settings }) => {
  const getServiceName = (id: string) => {
    return settings.services.find(s => s.id === id)?.name || 'Layanan';
  };

  return (
    <div className="p-8 max-w-[800px] mx-auto bg-white text-slate-900 border border-slate-200">
      <div className="flex justify-between items-start mb-8 border-b-2 border-slate-900 pb-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">LaundryMate Pro</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">{settings.contact.address}</p>
          <p className="text-sm font-medium text-slate-500">{settings.contact.phone}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold uppercase text-blue-600">Invoice Nota</h2>
          <p className="text-sm font-black mt-1">ID: {order.id}</p>
          <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString('id-ID')}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10">
        <div>
          <h3 className="text-xs font-black uppercase text-slate-400 mb-2">Pelanggan</h3>
          <p className="font-bold text-lg">{order.customerName}</p>
          <p className="text-sm text-slate-600">ID: {order.customerId}</p>
        </div>
        <div className="text-right">
          <h3 className="text-xs font-black uppercase text-slate-400 mb-2">Status Pembayaran</h3>
          <p className={`text-lg font-black ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-red-600'}`}>
            {order.paymentStatus === 'PAID' ? 'LUNAS' : 'BELUM BAYAR'}
          </p>
        </div>
      </div>

      <table className="w-full text-left mb-10">
        <thead className="border-y-2 border-slate-900">
          <tr>
            <th className="py-3 px-2 font-black uppercase text-sm">Layanan</th>
            <th className="py-3 px-2 font-black uppercase text-sm text-center">Qty</th>
            <th className="py-3 px-2 font-black uppercase text-sm text-right">Harga</th>
            <th className="py-3 px-2 font-black uppercase text-sm text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {order.items.map((item, idx) => {
            const service = settings.services.find(s => s.id === item.serviceId);
            return (
              <tr key={idx}>
                <td className="py-4 px-2">
                  <p className="font-bold">{getServiceName(item.serviceId)}</p>
                </td>
                <td className="py-4 px-2 text-center">{item.quantity} {service?.unit || ''}</td>
                <td className="py-4 px-2 text-right">Rp {(service?.price || 0).toLocaleString('id-ID')}</td>
                <td className="py-4 px-2 text-right font-bold">Rp {item.subtotal.toLocaleString('id-ID')}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="border-t-2 border-slate-900">
          <tr>
            <td colSpan={3} className="py-6 px-2 text-right font-bold text-lg">Total Akhir</td>
            <td className="py-6 px-2 text-right font-black text-2xl text-blue-600">Rp {order.totalPrice.toLocaleString('id-ID')}</td>
          </tr>
        </tfoot>
      </table>

      {order.notes && (
        <div className="mb-10 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-xs font-black uppercase text-slate-400 mb-1">Catatan:</p>
          <p className="text-sm italic text-slate-600">{order.notes}</p>
        </div>
      )}

      <div className="text-center pt-8 border-t border-dashed border-slate-200">
        <p className="text-sm font-bold text-slate-800 italic">Terima kasih telah mempercayakan pakaian Anda kepada kami!</p>
        <p className="text-xs text-slate-400 mt-2">Simpan nota ini sebagai bukti transaksi resmi LaundryMate Pro.</p>
      </div>
    </div>
  );
};

export default PrintableInvoice;