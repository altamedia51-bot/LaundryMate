
import React, { useEffect, useState } from 'react';
import { SiteSettings } from '../types';
import { generateLaundryTip } from '../services/geminiService';

interface LandingPageProps {
  settings: SiteSettings;
  onNavigate: (page: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ settings, onNavigate }) => {
  const [tip, setTip] = useState<string>('Memuat tips untuk Anda...');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchTip = async () => {
      const generatedTip = await generateLaundryTip();
      setTip(generatedTip || 'Gunakan air dingin untuk menghemat energi!');
    };
    fetchTip();
  }, []);

  const navLinks = [
    { href: "#layanan", label: "Layanan" },
    { href: "#tentang", label: "Tentang" },
    { href: "#kontak", label: "Kontak" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                <i className="fas fa-soap text-xl"></i>
              </div>
              <span className="text-xl font-bold text-slate-800">Laundry<span className="text-blue-600">Mate</span></span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              {navLinks.map(link => (
                <a key={link.label} href={link.href} className="hover:text-blue-600 transition-colors">{link.label}</a>
              ))}
              <button 
                onClick={() => onNavigate('login')}
                className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-shadow shadow-md"
              >
                Mulai Sekarang
              </button>
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-600 p-2 focus:outline-none"
              >
                <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b px-4 py-6 space-y-4 animate-in slide-in-from-top duration-300">
            {navLinks.map(link => (
              <a 
                key={link.label}
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-lg font-bold text-slate-800 border-b border-slate-50 pb-2"
              >
                {link.label}
              </a>
            ))}
            <button 
              onClick={() => {
                onNavigate('login');
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-center shadow-lg"
            >
              Mulai Sekarang
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-28 md:pt-32 pb-16 md:pb-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-12 items-center text-center md:text-left">
          <div className="space-y-6">
            <span className="inline-block px-4 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
              Solusi Laundry Modern No. 1
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
              {settings.hero.title}
            </h1>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-lg mx-auto md:mx-0">
              {settings.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center md:justify-start">
              <button 
                onClick={() => onNavigate('login')}
                className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 hover:scale-105 transition-all shadow-xl shadow-blue-200"
              >
                Pesan Laundry Sekarang
              </button>
              <div className="flex items-center gap-4 text-slate-700 px-4">
                <div className="flex -space-x-3">
                  <img src="https://i.pravatar.cc/100?u=1" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="User" />
                  <img src="https://i.pravatar.cc/100?u=2" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="User" />
                  <img src="https://i.pravatar.cc/100?u=3" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="User" />
                </div>
                <div className="text-sm text-left">
                  <span className="block font-bold">1,200+</span>
                  <span className="text-xs text-slate-500">Pelanggan Puas</span>
                </div>
              </div>
            </div>

            {/* AI Generated Tip */}
            <div className="mt-8 p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-start gap-3 text-left">
              <i className="fas fa-lightbulb text-orange-500 mt-1"></i>
              <div>
                <p className="text-[10px] md:text-xs font-bold text-orange-800 uppercase tracking-wide">Tips Hari Ini (AI):</p>
                <p className="text-xs md:text-sm text-orange-700 italic">"{tip}"</p>
              </div>
            </div>
          </div>
          <div className="relative mt-8 md:mt-0">
            <div className="absolute -inset-4 bg-blue-600/10 rounded-3xl rotate-3 hidden md:block"></div>
            <img 
              src={settings.hero.bannerUrl} 
              className="relative rounded-2xl shadow-2xl object-cover w-full aspect-[4/3] md:aspect-[4/3]" 
              alt="Laundry Banner"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="layanan" className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Layanan & Harga Terbaik</h2>
            <p className="text-sm md:text-slate-600 max-w-2xl mx-auto">Kami menawarkan berbagai pilihan layanan laundry untuk memenuhi setiap kebutuhan Anda dengan harga yang kompetitif.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {settings.services.map((service) => (
              <div key={service.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <i className={`fas ${service.unit === 'kg' ? 'fa-weight-hanging' : 'fa-tshirt'} text-xl`}></i>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2">{service.name}</h3>
                <p className="text-xs md:text-sm text-slate-500 mb-4 h-12 overflow-hidden">{service.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl md:text-2xl font-black text-blue-600">Rp {service.price.toLocaleString('id-ID')}</span>
                  <span className="text-xs md:text-sm text-slate-400 font-medium">/ {service.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="kontak" className="bg-slate-900 text-slate-300 py-16 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
                <i className="fas fa-soap"></i>
              </div>
              <span className="text-xl font-bold text-white">LaundryMate</span>
            </div>
            <p className="text-sm leading-relaxed">
              Partner kebersihan pakaian terpercaya Anda. Bersih, wangi, dan rapi setiap hari.
            </p>
            <div className="flex gap-4">
              <a href={`https://facebook.com/${settings.contact.social.facebook}`} className="hover:text-blue-400"><i className="fab fa-facebook-f"></i></a>
              <a href={`https://instagram.com/${settings.contact.social.instagram}`} className="hover:text-pink-400"><i className="fab fa-instagram"></i></a>
              <a href={`https://wa.me/${settings.contact.social.whatsapp}`} className="hover:text-green-400"><i className="fab fa-whatsapp"></i></a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Navigasi</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white">Beranda</a></li>
              <li><a href="#layanan" className="hover:text-white">Layanan</a></li>
              <li><a href="#" className="hover:text-white">Daftar Harga</a></li>
              <li><a href="#" className="hover:text-white">Lacak Pesanan</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Hubungi Kami</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <i className="fas fa-map-marker-alt text-blue-500"></i>
                <span>{settings.contact.address}</span>
              </li>
              <li className="flex gap-3">
                <i className="fas fa-phone text-blue-500"></i>
                <span>{settings.contact.phone}</span>
              </li>
              <li className="flex gap-3">
                <i className="fas fa-envelope text-blue-500"></i>
                <span>{settings.contact.email}</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Jam Operasional</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between"><span>Senin - Sabtu:</span> <span>08.00 - 20.00</span></li>
              <li className="flex justify-between"><span>Minggu:</span> <span>09.00 - 17.00</span></li>
              <li className="text-blue-400 font-medium mt-4 italic">Antar jemput tersedia setiap hari!</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-16 pt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} LaundryMate Pro. All rights reserved. Built for Excellence.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
