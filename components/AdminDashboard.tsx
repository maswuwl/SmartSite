
import React, { useEffect, useState } from 'react';
import { TRANSLATIONS } from '../constants';
import { Idea, Language } from '../types';
import { getIdeas, updateIdeaStatus } from '../services/storageService';
import { 
  Lock, Eye, Check, X as CloseIcon, 
  ChevronRight, Calendar, User, Code, 
  Copy, Layout, Activity 
} from 'lucide-react';

interface AdminDashboardProps {
  lang: Language;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

  useEffect(() => {
    if (isAuthorized) {
      setIdeas(getIdeas());
    }
  }, [isAuthorized]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo password: "admin"
    if (password === 'admin') {
      setIsAuthorized(true);
    } else {
      alert("Incorrect password. Hint: admin");
    }
  };

  const handleStatusUpdate = (id: string, status: Idea['status']) => {
    updateIdeaStatus(id, status);
    setIdeas(getIdeas());
    if (selectedIdea?.id === id) {
      setSelectedIdea(prev => prev ? { ...prev, status } : null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-[2rem] shadow-2xl border border-slate-100 text-center animate-in zoom-in duration-500">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Lock size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Admin Access</h2>
        <p className="text-slate-500 text-sm mb-8">Please enter the dashboard password to continue.</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="password" 
            placeholder="Enter Password" 
            autoFocus
            className="w-full px-5 py-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-blue-500 outline-none transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-bold transition-all shadow-lg">
            Unlock Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">{t.adminLink}</h2>
          <p className="text-slate-500 font-medium">Monitoring {ideas.length} submissions from the global community.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-black uppercase tracking-widest">
            LIVE FEED
          </div>
          <Activity size={20} className="text-green-500 animate-pulse" />
        </div>
      </div>
      
      <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 font-bold text-slate-600 text-sm uppercase tracking-wider">{t.tableSite}</th>
                <th className="px-8 py-5 font-bold text-slate-600 text-sm uppercase tracking-wider">{t.tableEmail}</th>
                <th className="px-8 py-5 font-bold text-slate-600 text-sm uppercase tracking-wider">{t.tableStatus}</th>
                <th className="px-8 py-5 font-bold text-slate-600 text-sm uppercase tracking-wider">Date</th>
                <th className="px-8 py-5 font-bold text-slate-600 text-sm uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ideas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2 opacity-50">
                      <Layout size={48} />
                      <p className="font-medium italic">No ideas have been submitted yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                ideas.map((idea) => (
                  <tr key={idea.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{idea.siteName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {idea.id.split('-')[0]}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-slate-500 font-medium">{idea.email}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        idea.status === 'Approved' ? 'bg-green-100 text-green-700' :
                        idea.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {idea.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-slate-400 text-xs font-medium">
                      {new Date(idea.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setSelectedIdea(idea)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(idea.id, 'Approved')}
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail */}
      {selectedIdea && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
              <div className="flex items-center gap-4">
                <div className="bg-slate-900 text-white p-3 rounded-2xl">
                  <Layout size={24} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900">{selectedIdea.siteName}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-bold mt-1">
                    <div className="flex items-center gap-1.5"><User size={14} /> {selectedIdea.email}</div>
                    <div className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(selectedIdea.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedIdea(null)} className="p-3 hover:bg-white rounded-2xl text-slate-400 hover:text-slate-800 transition-all shadow-sm">
                <CloseIcon size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-12">
              <section className="animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{t.tableIdea}</h4>
                </div>
                <div className="bg-blue-50/30 p-8 rounded-3xl border border-blue-100/50">
                  <p className="text-slate-800 text-xl font-medium leading-relaxed italic">
                    "{selectedIdea.idea}"
                  </p>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <section className="animate-in slide-in-from-bottom-6 duration-600">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{t.evalHeading}</h4>
                    </div>
                  </div>
                  <div className="bg-slate-900 text-indigo-200 p-8 rounded-[2rem] font-medium leading-relaxed min-h-[160px] shadow-xl border border-indigo-500/10">
                    <div className="whitespace-pre-wrap">{selectedIdea.evaluation}</div>
                  </div>
                </section>
                
                <section className="animate-in slide-in-from-bottom-8 duration-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{t.codeHeading}</h4>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(selectedIdea.generatedCode)}
                      className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Copy size={14} /> Copy Code
                    </button>
                  </div>
                  <div className="bg-slate-900 text-green-400 p-8 rounded-[2rem] font-mono text-xs overflow-x-auto min-h-[160px] shadow-xl border border-green-500/10 custom-scrollbar">
                    <pre>{selectedIdea.generatedCode}</pre>
                  </div>
                </section>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
               <button 
                onClick={() => handleStatusUpdate(selectedIdea.id, 'Rejected')}
                className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all"
               >
                 Reject
               </button>
               <button 
                onClick={() => handleStatusUpdate(selectedIdea.id, 'Approved')}
                className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-green-600 transition-all shadow-lg"
               >
                 Mark as Approved
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
