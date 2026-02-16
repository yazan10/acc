
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Language, Platform, Translation, AnalysisResult, HistoryItem } from './types';
import { TRANSLATIONS } from './constants';
import { LanguageSelector } from './components/LanguageSelector';
import { SocialLock } from './components/SocialLock';
import { CookieConsent } from './components/CookieConsent';
import { analyzeProfile } from './services/geminiService';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [isLocked, setIsLocked] = useState(true);
  const [showCookies, setShowCookies] = useState(false);
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [instagramDropdownOpen, setInstagramDropdownOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const t = TRANSLATIONS[lang];
  const isRtl = lang === 'ar' || lang === 'he';
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unlocked = localStorage.getItem('isUnlocked') === 'true';
    const cookieAccepted = localStorage.getItem('cookieAccepted') === 'true';
    const savedHistory = localStorage.getItem('analysisHistory');
    
    if (unlocked) setIsLocked(false);
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    if (!cookieAccepted) {
      const timeout = setTimeout(() => setShowCookies(true), 2000);
      return () => clearTimeout(timeout);
    }
  }, []);

  // Handle click outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setInstagramDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUnlock = () => {
    setIsLocked(false);
    localStorage.setItem('isUnlocked', 'true');
  };

  const handleAcceptCookies = useCallback(() => {
    setShowCookies(false);
    localStorage.setItem('cookieAccepted', 'true');
  }, []);

  const saveToHistory = (inputStr: string, plat: Platform, res: AnalysisResult) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      input: inputStr,
      platform: plat,
      timestamp: Date.now(),
      result: res
    };
    const updatedHistory = [newItem, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem('analysisHistory', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('analysisHistory');
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setShowHistory(false);

    try {
      const data = await analyzeProfile(input, platform, lang);
      setResult(data);
      saveToHistory(input, platform, data);
    } catch (err) {
      setError(t.errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    setInput(item.input);
    setPlatform(item.platform);
    setResult(item.result);
    setShowHistory(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isInstagram = platform === 'instagram' || platform === 'instagram_reels';

  return (
    <div className="relative min-h-screen bg-[#0a0a0b] text-white overflow-x-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className={`min-h-screen flex flex-col transition-all duration-700 ease-in-out ${isLocked ? 'blur-xl grayscale-[0.5] scale-[1.02] pointer-events-none' : 'blur-0 grayscale-0 scale-100'}`}>
        {/* Background Decor */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/20 blur-[120px] rounded-full"></div>
        </div>

        {/* Header */}
        <header className="p-6 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 glass sticky top-0 z-50">
          <div className="flex items-center space-x-3 gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <i className="fas fa-chart-line text-white text-xl"></i>
            </div>
            <h1 className={`text-2xl font-black gradient-text tracking-tight ${isRtl ? 'font-arabic' : 'font-english'}`}>
              {t.title}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2 px-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors flex items-center gap-2 text-sm ${showHistory ? 'bg-white/10 border-white/30' : ''}`}
            >
              <i className="fas fa-history"></i>
              <span>{t.viewHistory}</span>
            </button>
            <LanguageSelector currentLang={lang} onLanguageChange={setLang} />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 py-12 md:py-20 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-extrabold mb-6 leading-tight ${isRtl ? 'font-arabic' : 'font-english'}`}>
              {t.subtitle}
            </h2>
          </div>

          {/* History Section */}
          {showHistory && (
            <section className="mb-12 glass rounded-3xl p-6 border border-white/10 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <i className="fas fa-history text-purple-500"></i>
                  {t.historyTitle}
                </h3>
                {history.length > 0 && (
                  <button onClick={clearHistory} className="text-xs text-zinc-500 hover:text-red-400 transition-colors">
                    {t.clearHistory}
                  </button>
                )}
              </div>
              {history.length === 0 ? (
                <p className="text-center text-zinc-600 py-8 italic">{t.noHistory}</p>
              ) : (
                <div className="grid gap-3">
                  {history.map(item => (
                    <button
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                          <i className={`fab fa-${item.platform === 'instagram_reels' ? 'instagram' : item.platform}`}></i>
                        </div>
                        <div className="text-left">
                          <p className="font-bold truncate max-w-[150px] md:max-w-xs">{item.input}</p>
                          <p className="text-[10px] text-zinc-500 uppercase">{new Date(item.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-purple-400 font-bold text-lg">{item.result.growthScore}%</span>
                        <i className={`fas ${isRtl ? 'fa-arrow-left' : 'fa-arrow-right'} text-zinc-600 group-hover:translate-x-1 transition-transform`}></i>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Input Card */}
          <section className="glass rounded-[2rem] p-8 md:p-12 border border-white/10 shadow-2xl transition-all hover:border-white/20">
            <form onSubmit={handleAnalyze} className="space-y-8">
              <div className="flex flex-col space-y-4">
                <label className="text-zinc-400 font-medium">{t.platformLabel}</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Instagram Button with Toggleable Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => {
                        if (!isInstagram) setPlatform('instagram');
                        setInstagramDropdownOpen(!instagramDropdownOpen);
                      }}
                      className={`w-full py-4 px-4 rounded-2xl flex items-center justify-center space-x-2 gap-2 border transition-all ${
                        isInstagram
                          ? 'bg-zinc-800 border-white/30 ring-2 ring-purple-500 shadow-lg shadow-purple-500/10' 
                          : 'bg-zinc-900/50 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <i className={`fab fa-instagram text-xl ${isInstagram ? 'text-white' : 'text-zinc-500'}`}></i>
                      <span className={`font-bold text-sm ${isInstagram ? 'text-white' : 'text-zinc-500'}`}>
                        {platform === 'instagram_reels' ? t.reelsLabel : 'Instagram'}
                      </span>
                      <i className={`fas fa-chevron-down text-[10px] ml-1 transition-transform duration-300 ${instagramDropdownOpen ? 'rotate-180' : ''} ${isInstagram ? 'opacity-100' : 'opacity-30'}`}></i>
                    </button>
                    
                    {instagramDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 z-50 glass rounded-xl border border-white/15 p-1.5 shadow-2xl animate-fade-in ring-1 ring-white/5">
                        <button
                          type="button"
                          onClick={() => {
                            setPlatform('instagram');
                            setInstagramDropdownOpen(false);
                          }}
                          className={`w-full p-3 text-xs font-bold rounded-lg transition-all flex items-center justify-between ${platform === 'instagram' ? 'bg-white/10 text-white shadow-inner' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
                        >
                          <span>{t.instagramAccount}</span>
                          {platform === 'instagram' && <i className="fas fa-check text-[10px]"></i>}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPlatform('instagram_reels');
                            setInstagramDropdownOpen(false);
                          }}
                          className={`w-full p-3 text-xs font-bold rounded-lg transition-all flex items-center justify-between ${platform === 'instagram_reels' ? 'bg-white/10 text-white shadow-inner' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
                        >
                          <span>{t.instagramReels}</span>
                          {platform === 'instagram_reels' && <i className="fas fa-check text-[10px]"></i>}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* TikTok Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setPlatform('tiktok');
                      setInstagramDropdownOpen(false);
                    }}
                    className={`py-4 px-4 rounded-2xl flex items-center justify-center space-x-2 gap-2 border transition-all ${
                      platform === 'tiktok' 
                        ? 'bg-zinc-800 border-white/30 ring-2 ring-purple-500 shadow-lg shadow-purple-500/10' 
                        : 'bg-zinc-900/50 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <i className={`fab fa-tiktok text-xl ${platform === 'tiktok' ? 'text-white' : 'text-zinc-500'}`}></i>
                    <span className={`font-bold text-sm ${platform === 'tiktok' ? 'text-white' : 'text-zinc-500'}`}>
                      TikTok
                    </span>
                  </button>

                  {/* Facebook Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setPlatform('facebook');
                      setInstagramDropdownOpen(false);
                    }}
                    className={`py-4 px-4 rounded-2xl flex items-center justify-center space-x-2 gap-2 border transition-all ${
                      platform === 'facebook' 
                        ? 'bg-zinc-800 border-white/30 ring-2 ring-purple-500 shadow-lg shadow-purple-500/10' 
                        : 'bg-zinc-900/50 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <i className={`fab fa-facebook text-xl ${platform === 'facebook' ? 'text-white' : 'text-zinc-500'}`}></i>
                    <span className={`font-bold text-sm ${platform === 'facebook' ? 'text-white' : 'text-zinc-500'}`}>
                      {t.facebookLabel}
                    </span>
                  </button>
                </div>
              </div>

              <div className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.placeholder}
                  className={`w-full bg-zinc-900/50 border-2 border-white/5 rounded-2xl py-5 px-6 focus:outline-none focus:border-purple-500 transition-all text-lg group-hover:border-white/10 ${isRtl ? 'text-right' : 'text-left'}`}
                />
                <div className={`absolute inset-y-0 ${isRtl ? 'left-4' : 'right-4'} flex items-center text-zinc-600`}>
                  <i className="fas fa-search"></i>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !input}
                className="w-full py-5 bg-white text-black hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-black text-xl flex items-center justify-center space-x-3 gap-3 transition-all transform active:scale-[0.98] shadow-xl shadow-white/5"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin"></i>
                    <span>{t.loading}</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-bolt"></i>
                    <span>{t.analyzeBtn}</span>
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 flex items-center gap-4">
                <i className="fas fa-exclamation-triangle"></i>
                <p>{error}</p>
              </div>
            )}
          </section>

          {/* Results Section */}
          {result && (
            <section className="mt-12 space-y-8 animate-fade-in">
              <div className="glass rounded-[2rem] p-8 md:p-12 border border-white/10 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                  <div>
                    <h3 className="text-3xl font-bold mb-2">{t.resultsTitle}</h3>
                    <p className="text-zinc-500">{result.verdict}</p>
                  </div>
                  <div className="flex flex-col items-center">
                     <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                          <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="8" className="text-zinc-800" />
                          <circle 
                            cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="8" 
                            strokeDasharray="351.85" 
                            strokeDashoffset={351.85 - (351.85 * result.growthScore / 100)}
                            strokeLinecap="round"
                            className="text-purple-500 transition-all duration-1000" 
                          />
                        </svg>
                        <span className="absolute text-3xl font-black">{result.growthScore}%</span>
                     </div>
                     <span className="text-[10px] uppercase tracking-widest text-zinc-500 mt-2 font-bold">Growth Potential</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-red-400 font-bold text-lg">
                      <i className="fas fa-times-circle"></i>
                      <h4>{t.problemLabel}</h4>
                    </div>
                    <ul className="space-y-4">
                      {result.problems.map((prob, i) => (
                        <li key={i} className="flex items-start gap-3 text-zinc-300 bg-zinc-800/30 p-4 rounded-xl border border-white/5">
                          <span className="w-6 h-6 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          {prob}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-emerald-400 font-bold text-lg">
                      <i className="fas fa-check-circle"></i>
                      <h4>{t.solutionLabel}</h4>
                    </div>
                    <ul className="space-y-4">
                      {result.solutions.map((sol, i) => (
                        <li key={i} className="flex items-start gap-3 text-zinc-300 bg-zinc-800/30 p-4 rounded-xl border border-white/5">
                          <span className="w-6 h-6 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          {sol}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="p-8 text-center text-zinc-500 text-sm border-t border-white/5 glass mt-auto">
          <p className="mb-2">{t.copyright} &copy; {new Date().getFullYear()}</p>
          <div className="flex justify-center space-x-4 gap-4 mt-4">
            <a href="https://www.instagram.com/yaz.salaq" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all transform hover:scale-110 active:scale-95">
              <i className="fab fa-instagram text-2xl"></i>
            </a>
          </div>
        </footer>
      </div>

      {/* Modals */}
      {isLocked && (
        <div className="fixed inset-0 z-[100] pointer-events-auto">
          <SocialLock t={t} onUnlock={handleUnlock} isRtl={isRtl} />
        </div>
      )}
      
      {showCookies && <CookieConsent t={t} isRtl={isRtl} onAccept={handleAcceptCookies} />}
    </div>
  );
};

export default App;
