
import React from 'react';
import { Translation } from './types';

interface Props {
  t: Translation;
  onUnlock: () => void;
  isRtl: boolean;
}

export const SocialLock: React.FC<Props> = ({ t, onUnlock, isRtl }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl"></div>
      <div className={`relative glass max-w-md w-full p-8 rounded-3xl border border-white/20 shadow-2xl transform transition-all duration-500 hover:scale-[1.02] ${isRtl ? 'text-right' : 'text-left'}`}>
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <i className="fab fa-instagram text-4xl text-white"></i>
          </div>
        </div>
        <h2 className={`text-2xl font-bold mb-4 text-center ${isRtl ? 'font-arabic' : 'font-english'}`}>
          {t.followToUnlock}
        </h2>
        <p className="text-zinc-400 mb-8 text-center text-sm">
          @yaz.salaq
        </p>
        <div className="space-y-4">
          <a
            href="https://www.instagram.com/yaz.salaq"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onUnlock}
            className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-95 group"
          >
            <i className="fab fa-instagram mr-2 group-hover:rotate-12 transition-transform"></i>
            <span>{t.followBtn}</span>
          </a>
          <button
            onClick={onUnlock}
            className="w-full py-2 text-xs text-zinc-500 hover:text-white transition-colors underline decoration-dotted"
          >
            {t.unlocked} (I already follow)
          </button>
        </div>
      </div>
    </div>
  );
};
