
import React, { useState } from 'react';
import { User } from '../types';

interface ProfileCompletionModalProps {
  user: User;
  onComplete: (updatedUser: User) => void;
}

const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({ user, onComplete }) => {
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !address) return alert('Mohon lengkapi semua data.');
    
    onComplete({
      ...user,
      phone,
      address
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <img src={user.avatar} className="w-20 h-20 rounded-3xl border-4 border-blue-50 mx-auto" alt="" />
            <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-white">
              <i className="fas fa-pen text-[10px]"></i>
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-800">Satu Langkah Lagi!</h2>
          <p className="text-slate-500 text-sm">Halo {user.name}, mohon lengkapi data berikut untuk keperluan antar-jemput laundry.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nomor WhatsApp</label>
            <div className="relative">
              <i className="fab fa-whatsapp absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                type="tel" 
                placeholder="Contoh: 08123456789"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Alamat Lengkap</label>
            <div className="relative">
              <i className="fas fa-map-marker-alt absolute left-4 top-5 text-slate-400"></i>
              <textarea 
                placeholder="Masukkan alamat lengkap untuk penjemputan..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium h-32 resize-none"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95"
          >
            Simpan & Mulai Laundry
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;
