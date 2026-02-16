
import React, { useState, useEffect } from 'react';
import { Translation } from '../types';

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
    <div className={`fixed bottom-4 ${isRtl ? 'left-4' : 'right-4'} z-[110] max-w-[200px] w-full animate-fade-in`}>
      <div className="neu-flat rounded-full px-3 py-1.5 flex items-center gap-2 border border-white/5 relative overflow-hidden group">
        <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
          <i className="fas fa-cookie-bite text-amber-500 text-[10px]"></i>
        </div>
        <p className="text-zinc-500 text-[9px] leading-tight truncate flex-grow">
          {t.cookieMsg}
        </p>
        <button 
          onClick={onAccept}
          className="text-[9px] font-black text-white hover:text-amber-500 transition-colors uppercase"
        >
          OK
        </button>
        <div className="absolute bottom-0 left-0 h-[1.5px] bg-amber-500/30 transition-all duration-1000 ease-linear" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};
