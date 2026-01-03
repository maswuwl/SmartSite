
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { Language } from './types';
import { TRANSLATIONS } from './constants';
import { IdeaForm } from './components/IdeaForm';
import { AIChat } from './components/AIChat';
import { AdminDashboard } from './components/AdminDashboard';
import { Layout, Globe, Settings, Home, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const t = TRANSLATIONS[lang];

  const Nav = () => (
    <nav className="glass sticky top-0 z-[80] border-b border-slate-200/50 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-20">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-all group">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-2.5 rounded-2xl shadow-lg shadow-blue-500/30 group-hover:rotate-6 transition-transform">
            <Sparkles size={24} />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter">
            Smart<span className="text-blue-600 underline decoration-blue-200 underline-offset-4">Site</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-8">
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm tracking-wide transition-colors">
              <Home size={16} />
              {t.homeLink}
            </Link>
            <Link to="/admin" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm tracking-wide transition-colors">
              <Settings size={16} />
              {t.adminLink}
            </Link>
          </div>
          
          <div className="h-6 w-[1px] bg-slate-200 mx-2 hidden sm:block"></div>
          
          <div className="flex items-center gap-2 bg-slate-100/50 p-1 rounded-xl border border-slate-200">
            <Globe size={14} className="text-slate-400 ml-2" />
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value as Language)}
              className="bg-transparent border-none py-1.5 pl-1 pr-8 text-xs font-black text-slate-700 uppercase tracking-widest cursor-pointer outline-none appearance-none"
            >
              <option value="ar">AR</option>
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="es">ES</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    <HashRouter>
      <div className={`min-h-screen flex flex-col bg-[#f8fafc] ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
        <Nav />
        
        <main className="flex-1 relative">
          {/* Subtle Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-400/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
          
          <div className="container mx-auto px-4 py-16 sm:py-24">
            <Routes>
              <Route path="/" element={<IdeaForm lang={lang} onOpenChat={() => setIsChatOpen(true)} />} />
              <Route path="/admin" element={<AdminDashboard lang={lang} />} />
            </Routes>
          </div>
        </main>
        
        {isChatOpen && <AIChat lang={lang} onClose={() => setIsChatOpen(false)} />}
        
        <footer className="py-12 bg-white border-t border-slate-100">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">SS</div>
                <span className="font-black text-slate-900 tracking-tighter">SmartSite Hub</span>
              </div>
              
              <div className="flex gap-8 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                <a href="#" className="hover:text-blue-600">Privacy</a>
                <a href="#" className="hover:text-blue-600">Terms</a>
                <a href="#" className="hover:text-blue-600">API Docs</a>
              </div>
              
              <p className="text-slate-300 font-medium text-xs">
                Built with <span className="text-red-400">❤</span> using Gemini AI
              </p>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
