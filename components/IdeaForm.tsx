
import React from 'react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { Rocket, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';

interface IdeaFormProps {
  lang: Language;
  onOpenChat: () => void;
}

export const IdeaForm: React.FC<IdeaFormProps> = ({ lang, onOpenChat }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="max-w-4xl mx-auto text-center py-12 px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-blue-100">
        <Sparkles size={14} />
        AI-Powered Innovation Hub
      </div>
      
      <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[1.1]">
        {lang === 'ar' ? 'فكرتك، كودنا،' : 'Your Idea, Our Code,'} <br/>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          {lang === 'ar' ? 'مستقبل ذكي' : 'Smart Future'}
        </span>
      </h1>
      
      <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
        {lang === 'ar' 
          ? 'لا حاجة لملء النماذج المملة. تحدث مع مساعدنا الذكي لنحول رؤيتك إلى واقع برمجي ملموس في ثوانٍ.'
          : 'No tedious forms needed. Chat with our intelligent assistant to transform your vision into real code in seconds.'}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onOpenChat}
          className="group relative bg-slate-900 hover:bg-black text-white px-10 py-6 rounded-[2rem] font-black text-lg transition-all shadow-2xl shadow-blue-500/20 active:scale-95 flex items-center gap-3 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <MessageCircle size={24} className="relative z-10" />
          <span className="relative z-10">{t.discussBtn}</span>
          <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        {[
          { icon: <MessageCircle className="text-blue-500" />, title: lang === 'ar' ? 'دردشة تفاعلية' : 'Interactive Chat', desc: lang === 'ar' ? 'ناقش تفاصيل مشروعك بشكل طبيعي' : 'Discuss project details naturally' },
          { icon: <Sparkles className="text-indigo-500" />, title: lang === 'ar' ? 'تقييم فوري' : 'Instant Review', desc: lang === 'ar' ? 'احصل على تحليل تقني لفكرتك فوراً' : 'Get immediate technical analysis' },
          { icon: <Rocket className="text-purple-500" />, title: lang === 'ar' ? 'توليد الكود' : 'Code Generation', desc: lang === 'ar' ? 'نصمم لك نموذجاً أولياً باستخدام Tailwind' : 'We build your prototype with Tailwind' }
        ].map((feat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
              {feat.icon}
            </div>
            <h3 className="font-black text-slate-800 mb-2 uppercase tracking-wide text-sm">{feat.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
