
export type Language = 'ar' | 'en' | 'he';

export type Platform = 'instagram' | 'tiktok' | 'instagram_reels' | 'facebook';

export interface Translation {
  title: string;
  subtitle: string;
  placeholder: string;
  analyzeBtn: string;
  platformLabel: string;
  followToUnlock: string;
  followBtn: string;
  unlocked: string;
  cookieTitle: string;
  cookieMsg: string;
  cookieAutoAccept: string;
  resultsTitle: string;
  problemLabel: string;
  solutionLabel: string;
  copyright: string;
  errorMsg: string;
  loading: string;
  historyTitle: string;
  noHistory: string;
  clearHistory: string;
  viewHistory: string;
  reelsLabel: string;
  facebookLabel: string;
  instagramAccount: string;
  instagramReels: string;
}

export interface AnalysisResult {
  growthScore: number;
  problems: string[];
  solutions: string[];
  verdict: string;
}

export interface HistoryItem {
  id: string;
  input: string;
  platform: Platform;
  timestamp: number;
  result: AnalysisResult;
}
