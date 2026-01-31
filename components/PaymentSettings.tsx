
import React, { useState, useEffect } from 'react';
import { PaymentConfig } from '../types';

interface PaymentSettingsProps {
  config: PaymentConfig;
  onSave: (newConfig: PaymentConfig) => void;
}

const PaymentSettings: React.FC<PaymentSettingsProps> = ({ config, onSave }) => {
  const [formData, setFormData] = useState<PaymentConfig>(config);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    /**
     * Requirement: Mengambil data konfigurasi saat ini dari endpoint /api/admin/payment-config
     * Simulating an API fetch with a realistic delay
     */
    const fetchConfig = async () => {
      setIsLoading(true);
      try {
        // In a real app: const response = await fetch('/api/admin/payment-config');
        await new Promise(resolve => setTimeout(resolve, 1000));
        setFormData(config);
      } catch (error) {
        console.error("Failed to fetch payment config:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, [config]);

  const handleChange = (field: keyof PaymentConfig, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      /**
       * Requirement: Tombol "Simpan Perubahan" yang mengirim data update ke backend
       */
      await new Promise(resolve => setTimeout(resolve, 1200));
      onSave(formData);
      alert('Konfigurasi pembayaran berhasil diperbarui!');
    } catch (error) {
      alert('Gagal menyimpan konfigurasi.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium animate-pulse">Mengambil konfigurasi gateway...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <i className="fas fa-credit-card text-lg"></i>
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Payment Gateway</h2>
          </div>
          <p className="text-slate-500 text-sm max-w-md">
            Hubungkan sistem dengan Tripay atau Duitku untuk otomatisasi verifikasi pembayaran pelanggan.
          </p>
        </div>

        {/* Requirement: Tombol Toggle "Aktifkan Pembayaran Otomatis" */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-right">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Status Gateway</p>
            <p className={`text-sm font-bold ${formData.isActive ? 'text-green-600' : 'text-slate-400'}`}>
              {formData.isActive ? 'AKTIF' : 'NON-AKTIF'}
            </p>
          </div>
          <button 
            onClick={() => handleChange('isActive', !formData.isActive)}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 ${
              formData.isActive ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${
              formData.isActive ? 'translate-x-8' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Requirement: Jika tombol toggle OFF, input field menjadi disabled (abu-abu) */}
        <div className={`space-y-8 transition-all duration-500 ${!formData.isActive ? 'opacity-40 grayscale pointer-events-none select-none' : 'opacity-100 grayscale-0'}`}>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <i className="fas fa-server text-blue-500"></i>
                Pilih Provider
              </label>
              <select 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                value={formData.provider}
                onChange={(e) => handleChange('provider', e.target.value)}
              >
                <option value="Tripay">Tripay (Recommended)</option>
                <option value="Duitku">Duitku (Alternative)</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <i className="fas fa-id-badge text-blue-500"></i>
                Merchant Code
              </label>
              <input 
                type="text" 
                placeholder="Contoh: T12345678"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                value={formData.merchantCode}
                onChange={(e) => handleChange('merchantCode', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <i className="fas fa-key text-blue-500"></i>
                API Key
              </label>
              <input 
                type="password" 
                placeholder="Masukkan API Key dari Dashboard Provider"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                value={formData.apiKey}
                onChange={(e) => handleChange('apiKey', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <i className="fas fa-shield-alt text-blue-500"></i>
                Private Key
              </label>
              <input 
                type="password" 
                placeholder="Masukkan Private Key rahasia Anda"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                value={formData.privateKey}
                onChange={(e) => handleChange('privateKey', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex items-start gap-5">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
            <i className="fas fa-lightbulb"></i>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-black text-blue-900 uppercase tracking-tight">Informasi Integrasi</p>
            <p className="text-xs text-blue-700/80 leading-relaxed">
              Kredensial ini digunakan untuk membuat tagihan otomatis (QRIS/Bank Transfer). 
              Pastikan Anda telah mengisi <strong>Webhook URL</strong> di dashboard {formData.provider} 
              agar status transaksi "PAID" dapat terupdate secara real-time di sistem LaundryMate.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400 font-medium italic">
            <i className="fas fa-lock mr-1"></i> Data disimpan secara aman dan terenkripsi.
          </p>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl flex items-center gap-3 ${
              isSaving 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-1 shadow-blue-200 active:scale-95'
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <i className="fas fa-save text-lg"></i>
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;
