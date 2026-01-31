
import React, { useState } from 'react';
import { SiteSettings, ServiceItem } from '../types';

interface AdminCMSPanelProps {
  settings: SiteSettings;
  onUpdate: (newSettings: SiteSettings) => void;
}

const AdminCMSPanel: React.FC<AdminCMSPanelProps> = ({ settings, onUpdate }) => {
  const [formData, setFormData] = useState<SiteSettings>(settings);

  const handleInputChange = (section: keyof SiteSettings, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
  };

  const handleServiceChange = (id: string, field: keyof ServiceItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const handleSave = () => {
    onUpdate(formData);
    alert('Pengaturan berhasil diperbarui!');
  };

  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Website Editor</h2>
          <p className="text-sm text-slate-500">Kelola tampilan depan tanpa perlu coding.</p>
        </div>
        <button 
          onClick={handleSave}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
        >
          <i className="fas fa-save"></i> Simpan
        </button>
      </div>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Hero Section</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600">Judul Utama</label>
            <input 
              type="text" 
              className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              value={formData.hero.title}
              onChange={(e) => handleInputChange('hero', 'title', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600">Banner URL Image</label>
            <input 
              type="text" 
              className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              value={formData.hero.bannerUrl}
              onChange={(e) => handleInputChange('hero', 'bannerUrl', e.target.value)}
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-600">Sub-judul Deskripsi</label>
            <textarea 
              className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all h-28"
              value={formData.hero.subtitle}
              onChange={(e) => handleInputChange('hero', 'subtitle', e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Layanan & Harga</h3>
        <div className="overflow-x-auto custom-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          <table className="min-w-[800px] w-full text-left border-separate border-spacing-y-2">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-3 text-[10px] font-black uppercase text-slate-400">Layanan</th>
                <th className="p-3 text-[10px] font-black uppercase text-slate-400">Harga</th>
                <th className="p-3 text-[10px] font-black uppercase text-slate-400">Unit</th>
                <th className="p-3 text-[10px] font-black uppercase text-slate-400">Deskripsi</th>
              </tr>
            </thead>
            <tbody>
              {formData.services.map(service => (
                <tr key={service.id} className="bg-slate-50/30">
                  <td className="p-2">
                    <input 
                      className="w-full p-2 border rounded-lg text-sm font-medium"
                      value={service.name}
                      onChange={(e) => handleServiceChange(service.id, 'name', e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <input 
                      type="number"
                      className="w-24 p-2 border rounded-lg text-sm font-bold text-blue-600"
                      value={service.price}
                      onChange={(e) => handleServiceChange(service.id, 'price', parseInt(e.target.value))}
                    />
                  </td>
                  <td className="p-2">
                    <select 
                      className="p-2 border rounded-lg text-sm font-bold"
                      value={service.unit}
                      onChange={(e) => handleServiceChange(service.id, 'unit', e.target.value)}
                    >
                      <option value="kg">kg</option>
                      <option value="pcs">pcs</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input 
                      className="w-full p-2 border rounded-lg text-sm"
                      value={service.description}
                      onChange={(e) => handleServiceChange(service.id, 'description', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Info Kontak & Footer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600">Email Bisnis</label>
            <input 
              type="email" 
              className="w-full p-3 border rounded-xl bg-slate-50 outline-none"
              value={formData.contact.email}
              onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600">No. Telepon</label>
            <input 
              type="text" 
              className="w-full p-3 border rounded-xl bg-slate-50 outline-none"
              value={formData.contact.phone}
              onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600">Alamat Toko</label>
            <input 
              type="text" 
              className="w-full p-3 border rounded-xl bg-slate-50 outline-none"
              value={formData.contact.address}
              onChange={(e) => handleInputChange('contact', 'address', e.target.value)}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminCMSPanel;
