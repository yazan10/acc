
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Language, Platform, AnalysisResult, HistoryItem } from './types';
import { TRANSLATIONS } from './constants';
import { LanguageSelector } from './components/LanguageSelector';
import { SocialLock } from './components/SocialLock';
import { CookieConsent } from './components/CookieConsent';
import { analyzeProfileLocal } from './auditService';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [isLocked, setIsLocked] = useState(true);
  const [showCookies, setShowCookies] = useState(false);
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [instagramDropdownOpen, setInstagramDropdownOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const t = TRANSLATIONS[lang];
  const isRtl = lang === 'ar' || lang === 'he';
  const dropdownRef = useRef<HTMLDivElement>(null);

  const steps = {
    ar: ["الاتصال بقواعد بيانات المنصة...", "فحص معدلات التفاعل الحيوية...", "تحليل الـ SEO والكلمات المفتاحية...", "توليد الخطة الاستراتيجية..."],
    en: ["Connecting to platform API...", "Scanning engagement rates...", "Analyzing SEO & Keywords...", "Generating strategic roadmap..."],
    he: ["מתחבר לנתוני הפלטפורמה...", "סורק שיעורי מעורבות...", "מנתח SEO ומילות מפתח...", "מייצר תוכנית אסטרטגית..."]
  };

  useEffect(() => {
    const unlocked = localStorage.getItem('isUnlocked') === 'true';
    const cookieAccepted = localStorage.getItem('cookieAccepted') === 'true';
    const savedHistory = localStorage.getItem('analysisHistory');
    if (unlocked) setIsLocked(false);
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (!cookieAccepted) {
      setTimeout(() => setShowCookies(true), 1500);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setInstagramDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    // Realistic multi-step simulation
    const currentSteps = steps[lang] || steps['en'];
    for (let i = 0; i < currentSteps.length; i++) {
      setLoadingStep(currentSteps[i]);
      await new Promise(r => setTimeout(r, 800));
    }

    const data = analyzeProfileLocal(input, platform, lang);
    setResult(data);
    setIsLoading(false);
    
    const newItem: HistoryItem = { id: Date.now().toString(), input, platform, timestamp: Date.now(), result: data };
    const newHistory = [newItem, ...history].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('analysisHistory', JSON.stringify(newHistory));
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0b] text-white overflow-x-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className={`min-h-screen flex flex-col transition-all duration-1000 ${isLocked ? 'blur-2xl grayscale' : 'blur-0'}`}>
        <header className="p-6 border-b border-white/5 glass sticky top-0 z-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 neu-flat rounded-xl flex items-center justify-center text-purple-500">
              <i className="fas fa-bolt"></i>
            </div>
            <h1 className="text-xl font-black gradient-text uppercase tracking-widest">{t.title}</h1>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setShowHistory(!showHistory)} className="text-zinc-500 hover:text-white transition-colors">
               <i className="fas fa-history text-lg"></i>
             </button>
             <LanguageSelector currentLang={lang} onLanguageChange={setLang} />
          </div>
        </header>

        <main className="container mx-auto px-4 py-16 max-w-4xl flex-grow">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">{t.subtitle}</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">نظام ذكي متصل بقواعد بيانات استراتيجية لتحليل نمو حسابات السوشيال ميديا.</p>
          </div>

          <section className="neu-flat rounded-[2.5rem] p-8 md:p-12 mb-16">
            <form onSubmit={handleAnalyze} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button type="button" onClick={() => setPlatform('instagram')} className={`py-4 rounded-2xl flex items-center justify-center gap-3 transition-all ${platform === 'instagram' ? 'neu-button-active text-purple-400' : 'neu-button text-zinc-500'}`}>
                  <i className="fab fa-instagram"></i> Instagram
                </button>
                <button type="button" onClick={() => setPlatform('tiktok')} className={`py-4 rounded-2xl flex items-center justify-center gap-3 transition-all ${platform === 'tiktok' ? 'neu-button-active text-purple-400' : 'neu-button text-zinc-500'}`}>
                  <i className="fab fa-tiktok"></i> TikTok
                </button>
                <button type="button" onClick={() => setPlatform('facebook')} className={`py-4 rounded-2xl flex items-center justify-center gap-3 transition-all ${platform === 'facebook' ? 'neu-button-active text-purple-400' : 'neu-button text-zinc-500'}`}>
                  <i className="fab fa-facebook"></i> Facebook
                </button>
              </div>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.placeholder}
                className="w-full neu-inset rounded-2xl py-6 px-8 focus:outline-none text-lg text-center"
              />

              <button
                type="submit"
                disabled={isLoading || !input}
                className="w-full py-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-black text-xl shadow-xl shadow-purple-500/20 active:scale-95 transition-all flex items-center justify-center gap-4"
              >
                {isLoading ? <><i className="fas fa-circle-notch fa-spin"></i> {loadingStep}</> : <><i className="fas fa-search"></i> {t.analyzeBtn}</>}
              </button>
            </form>
          </section>

          {result && (
            <div className="animate-fade-in space-y-10">
              <div className="neu-flat rounded-[3rem] p-10 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                   <div className="text-center md:text-right flex-grow">
                      <h3 className="text-3xl font-black mb-4 text-purple-400">{t.resultsTitle}</h3>
                      <p className="text-zinc-400 text-lg leading-relaxed neu-inset p-6 rounded-3xl italic">"{result.verdict}"</p>
                   </div>
                   <div className="relative w-48 h-48 neu-flat rounded-full flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                         <circle cx="96" cy="96" r="80" fill="none" stroke="#111" strokeWidth="12" />
                         <circle 
                            cx="96" cy="96" r="80" fill="none" stroke="#a855f7" strokeWidth="12" 
                            strokeDasharray="502" strokeDashoffset={502 - (502 * result.growthScore / 100)}
                            strokeLinecap="round" className="transition-all duration-1000"
                         />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-5xl font-black">{result.growthScore}%</span>
                         <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Potential</span>
                      </div>
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10 mt-16">
                   <div className="space-y-6">
                      <h4 className="text-red-500 font-bold flex items-center gap-2"><i className="fas fa-times-circle"></i> {t.problemLabel}</h4>
                      {result.problems.map((p, i) => <div key={i} className="neu-inset p-5 rounded-2xl text-sm text-zinc-400">{p}</div>)}
                   </div>
                   <div className="space-y-6">
                      <h4 className="text-emerald-500 font-bold flex items-center gap-2"><i className="fas fa-check-circle"></i> {t.solutionLabel}</h4>
                      {result.solutions.map((s, i) => <div key={i} className="neu-inset p-5 rounded-2xl text-sm text-zinc-400">{s}</div>)}
                   </div>
                </div>

                {/* External Verification Links */}
                <div className="mt-16 pt-10 border-t border-white/5 text-center">
                   <p className="text-zinc-500 text-xs mb-6 font-bold uppercase tracking-widest">تأكيد إضافي عبر أدوات عالمية</p>
                   <div className="flex flex-wrap justify-center gap-4">
                      <a href={`https://socialblade.com/${platform.includes('insta') ? 'instagram' : platform}/user/${input}`} target="_blank" className="px-6 py-3 neu-button rounded-xl text-xs font-bold hover:text-purple-400">Social Blade</a>
                      <a href={`https://hypeauditor.com/en/free-tools/${platform.includes('insta') ? 'instagram' : platform}-audit/`} target="_blank" className="px-6 py-3 neu-button rounded-xl text-xs font-bold hover:text-purple-400">HypeAuditor</a>
                   </div>
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="p-12 text-center text-zinc-600 border-t border-white/5 mt-auto">
          <p className="font-bold">{t.copyright}</p>
          <div className="flex justify-center gap-6 mt-6">
            <a href="https://www.instagram.com/yaz.salaq" target="_blank" className="w-10 h-10 neu-button rounded-xl flex items-center justify-center text-white"><i className="fab fa-instagram"></i></a>
          </div>
        </footer>
      </div>

      {isLocked && <SocialLock t={t} onUnlock={() => { setIsLocked(false); localStorage.setItem('isUnlocked', 'true'); }} isRtl={isRtl} />}
      {showCookies && <CookieConsent t={t} isRtl={isRtl} onAccept={() => { setShowCookies(false); localStorage.setItem('cookieAccepted', 'true'); }} />}
    </div>
  );
};

export default App;
