
import React, { useState, useEffect } from 'react';
import { Translation } from './types';

interface Props {
  t: Translation;
  isRtl: boolean;
  onAccept: () => void;
}

export const CookieConsent: React.FC<Props> = ({ t, isRtl, onAccept }) => {
  const [timeLeft, setTimeLeft] = useState(8);
  const totalTime = 8;

  useEffect(() => {
    if (timeLeft <= 0) {
      onAccept();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onAccept]);

  const progress = (timeLeft / totalTime) * 100;

  return (
    <div className={`fixed bottom-6 ${isRtl ? 'left-6' : 'right-6'} z-[110] max-w-[240px] w-full animate-slide-up`}>
      <div className="glass rounded-2xl p-3 shadow-2xl border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/10 p-2 rounded-full shrink-0">
            <i className="fas fa-cookie-bite text-amber-500 text-[10px]"></i>
          </div>
          <div className={`flex-grow ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">{t.cookieTitle}</h4>
              <div className="text-[8px] text-zinc-500 font-mono">
                {timeLeft}s
              </div>
            </div>
            <div className="flex items-center gap-2">
               <p className="text-zinc-400 text-[9px] leading-tight flex-grow">
                 {t.cookieMsg}
               </p>
               <button 
                onClick={onAccept}
                className="px-2 py-1 bg-white/10 hover:bg-white text-white hover:text-black text-[9px] font-bold rounded-md transition-all shrink-0"
               >
                 OK
               </button>
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-[1px] bg-zinc-800/30 w-full">
          <div 
            className="h-full bg-amber-500/40 transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
