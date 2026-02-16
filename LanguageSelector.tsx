
import React from 'react';
import { Language } from './types';

interface Props {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LanguageSelector: React.FC<Props> = ({ currentLang, onLanguageChange }) => {
  return (
    <div className="relative inline-block text-left">
      <select
        value={currentLang}
        onChange={(e) => onLanguageChange(e.target.value as Language)}
        className="bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer appearance-none pr-10"
      >
        <option value="ar">العربية (Arabic)</option>
        <option value="en">English</option>
        <option value="he">עברית (Hebrew)</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
        <i className="fas fa-chevron-down text-xs"></i>
      </div>
    </div>
  );
};
