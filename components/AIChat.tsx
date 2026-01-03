
import React, { useState, useRef, useEffect } from 'react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { chatRefineIdea, evaluateIdea, generateStarterCode } from '../services/geminiService';
import { saveIdea } from '../services/storageService';
import { X, Send, Bot, User, Sparkles, CheckCircle, Rocket, Terminal } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AIChatProps {
  lang: Language;
  onClose: () => void;
}

export const AIChat: React.FC<AIChatProps> = ({ lang, onClose }) => {
  const t = TRANSLATIONS[lang];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState<{siteName: string, eval: string, code: string} | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', text: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const history = newMessages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const response = await chatRefineIdea(history);
      
      // Handle Function Calls (Submission)
      if (response.functionCalls && response.functionCalls.length > 0) {
        const call = response.functionCalls[0];
        if (call.name === 'submitIdea') {
          const { siteName, email, idea } = call.args as any;
          
          // Show progress in chat
          setMessages(prev => [...prev, { role: 'model', text: lang === 'ar' ? 'أقوم الآن بتحليل فكرتك وتوليد الكود... ثوانٍ قليلة!' : 'I am analyzing your idea and generating code... Just a few seconds!' }]);
          
          const [evalResult, codeResult] = await Promise.all([
            evaluateIdea(idea),
            generateStarterCode(idea)
          ]);

          saveIdea({
            siteName,
            email,
            idea,
            evaluation: evalResult,
            generatedCode: codeResult
          });

          setSubmissionComplete({ siteName, eval: evalResult, code: codeResult });
        }
      } else {
        const reply = response.text || "I'm listening...";
        setMessages(prev => [...prev, { role: 'model', text: reply }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "Error connecting to AI. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  if (submissionComplete) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-4xl h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-white/20">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center gap-4">
              <div className="bg-green-600 p-3 rounded-2xl text-white">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">{lang === 'ar' ? 'تم الانطلاق!' : 'Mission Launched!'}</h3>
                <p className="text-xs font-bold text-green-600 uppercase tracking-widest">{submissionComplete.siteName}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl text-slate-400">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-10 space-y-10 bg-slate-50/50">
            <section className="animate-in slide-in-from-bottom-4">
              <div className="flex items-center gap-3 mb-4">
                <Rocket className="text-blue-600" size={20} />
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{t.evalHeading}</h4>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">
                {submissionComplete.eval}
              </div>
            </section>

            <section className="animate-in slide-in-from-bottom-6 duration-700">
              <div className="flex items-center gap-3 mb-4">
                <Terminal className="text-indigo-600" size={20} />
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{t.codeHeading}</h4>
              </div>
              <div className="bg-slate-900 p-8 rounded-3xl border border-indigo-500/10 shadow-xl overflow-x-auto text-green-400 font-mono text-xs">
                <pre>{submissionComplete.code}</pre>
              </div>
            </section>
          </div>

          <div className="p-8 bg-white border-t border-slate-100 flex justify-center">
            <button 
              onClick={onClose}
              className="px-12 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all active:scale-95 shadow-xl"
            >
              {lang === 'ar' ? 'إغلاق والعودة للرئيسية' : 'Close and Return Home'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-3xl h-[85vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-white/20">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2.5 rounded-2xl text-white">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-800">{t.discussBtn}</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Project Expert Online</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2.5 hover:bg-white rounded-xl text-slate-400 hover:text-slate-800 transition-all shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fcfdfe]">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 max-w-sm mx-auto animate-in fade-in duration-1000">
              <div className="bg-blue-100 p-6 rounded-full text-blue-600 mb-2">
                <Sparkles size={48} />
              </div>
              <h4 className="text-xl font-black text-slate-900">{lang === 'ar' ? 'أهلاً بك في رحلة الابتكار' : 'Welcome to the Journey'}</h4>
              <p className="font-medium text-slate-500 text-sm">
                {lang === 'ar' 
                  ? 'أنا هنا لمساعدتك في بناء فكرتك. أخبرني باسم المشروع، بريدك الإلكتروني، وما الذي تريد بناءه لنبدأ فوراً!' 
                  : 'I\'m here to help you build your idea. Tell me the project name, your email, and what you want to build to get started!'}
              </p>
            </div>
          )}
          
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-slate-800 text-white'
                }`}>
                  {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 animate-bounce">
                  <Bot size={16} />
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white">
          <div className="relative flex items-center gap-3">
            <input
              type="text"
              autoFocus
              className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all pr-14"
              placeholder={t.chatPlaceholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="absolute right-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white p-2.5 rounded-xl transition-all active:scale-90"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
