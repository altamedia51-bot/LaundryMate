
import React, { useEffect, useState } from 'react';
import { Order } from '../types';
import { simulatePaymentWebhook } from '../services/paymentService';

interface PaymentModalProps {
  order: Order;
  onSuccess: () => void;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ order, onSuccess, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    // Jalankan simulasi webhook otomatis saat modal terbuka
    simulatePaymentWebhook(() => {
      setIsPaid(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    });
  }, []);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 text-center space-y-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{order.id}</span>
            <button onClick={onClose} className="text-slate-300 hover:text-slate-500"><i className="fas fa-times"></i></button>
          </div>
          
          <h2 className="text-xl font-bold text-slate-800">Pembayaran QRIS</h2>
          <p className="text-sm text-slate-500">Silakan scan kode QR di bawah menggunakan aplikasi e-wallet Anda.</p>
          
          <div className="relative aspect-square w-full max-w-[240px] mx-auto bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
            {isPaid ? (
              <div className="text-center animate-bounce">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4 shadow-lg shadow-green-100">
                  <i className="fas fa-check"></i>
                </div>
                <p className="font-black text-green-600 uppercase tracking-tighter">Pembayaran Berhasil!</p>
              </div>
            ) : (
              <img 
                src={order.paymentUrl} 
                alt="QRIS Code" 
                className="w-full h-full p-2"
              />
            )}
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Total Bayar</p>
            <p className="text-2xl font-black text-blue-600">Rp {order.totalPrice.toLocaleString('id-ID')}</p>
          </div>

          {!isPaid && (
            <div className="flex items-center justify-center gap-3 text-slate-400 text-xs py-2">
              <i className="fas fa-circle-notch fa-spin"></i>
              <span>Menunggu pembayaran...</span>
            </div>
          )}
          
          <p className="text-[10px] text-slate-400 leading-tight">
            Pembayaran akan diverifikasi otomatis oleh sistem LaundryMate dalam hitungan detik setelah transaksi berhasil.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
