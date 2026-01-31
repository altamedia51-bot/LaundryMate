
import React, { useState } from 'react';
import { SiteSettings, ServiceItem, OrderItem } from '../types';

interface NewOrderModalProps {
  settings: SiteSettings;
  onClose: () => void;
  onSubmit: (items: OrderItem[], notes: string) => void;
}

const NewOrderModal: React.FC<NewOrderModalProps> = ({ settings, onClose, onSubmit }) => {
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');

  const handleQtyChange = (id: string, qty: number) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: Math.max(0, qty)
    }));
  };

  const calculateTotal = () => {
    // Fix: Explicitly cast Object.entries to [string, number][] to ensure 'qty' is recognized as a number for arithmetic.
    return (Object.entries(selectedItems) as [string, number][]).reduce((acc, [id, qty]) => {
      const service = settings.services.find(s => s.id === id);
      return acc + (service ? service.price * qty : 0);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fix: Explicitly cast Object.entries to [string, number][] to avoid 'unknown' type issues in filter and map.
    const items: OrderItem[] = (Object.entries(selectedItems) as [string, number][])
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => ({
        serviceId: id,
        quantity: qty,
        subtotal: (settings.services.find(s => s.id === id)?.price || 0) * qty
      }));

    if (items.length === 0) return alert('Silakan pilih minimal satu layanan.');
    onSubmit(items, notes);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Buat Pesanan Baru</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><i className="fas fa-times"></i></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
            {settings.services.map(service => (
              <div key={service.id} className="flex items-center justify-between p-3 border rounded-xl">
                <div>
                  <p className="font-bold text-sm">{service.name}</p>
                  <p className="text-xs text-slate-500">Rp {service.price.toLocaleString()} / {service.unit}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => handleQtyChange(service.id, (selectedItems[service.id] || 0) - 1)}
                    className="w-8 h-8 rounded-full border flex items-center justify-center text-slate-400 hover:bg-slate-50"
                  >-</button>
                  <span className="w-8 text-center font-bold">{selectedItems[service.id] || 0}</span>
                  <button 
                    type="button"
                    onClick={() => handleQtyChange(service.id, (selectedItems[service.id] || 0) + 1)}
                    className="w-8 h-8 rounded-full border flex items-center justify-center text-slate-400 hover:bg-slate-50"
                  >+</button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Catatan Tambahan (Opsional)</label>
            <textarea 
              className="w-full p-3 border rounded-xl h-20 text-sm"
              placeholder="Contoh: Jemput jam 5 sore, pisahkan baju bayi..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="pt-4 border-t flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Estimasi Total</p>
              <p className="text-2xl font-black text-blue-600">Rp {calculateTotal().toLocaleString('id-ID')}</p>
            </div>
            <button 
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-shadow shadow-lg shadow-blue-200"
            >
              Konfirmasi Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewOrderModal;
