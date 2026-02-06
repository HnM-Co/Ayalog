import { PainLevelConfig } from './types';

export const PAIN_LEVELS: Record<number, PainLevelConfig> = {
  1: { score: 1, emoji: '😆', label: '평화로움', colorClass: 'bg-emerald-400', textColor: 'text-emerald-900' },
  2: { score: 2, emoji: '🙂', label: '거슬리지 않음', colorClass: 'bg-emerald-300', textColor: 'text-emerald-900' },
  3: { score: 3, emoji: '😐', label: '살짝 뻐근', colorClass: 'bg-lime-300', textColor: 'text-lime-900' },
  4: { score: 4, emoji: '😕', label: '신경 쓰임', colorClass: 'bg-yellow-300', textColor: 'text-yellow-900' },
  5: { score: 5, emoji: '😣', label: '꽤 아픔', colorClass: 'bg-amber-300', textColor: 'text-amber-900' },
  6: { score: 6, emoji: '😖', label: '진통제 필요', colorClass: 'bg-amber-400', textColor: 'text-amber-900' },
  7: { score: 7, emoji: '😫', label: '너무 아파요', colorClass: 'bg-orange-400', textColor: 'text-orange-900' },
  8: { score: 8, emoji: '😭', label: '못 참겠음', colorClass: 'bg-orange-500', textColor: 'text-orange-900' },
  9: { score: 9, emoji: '😱', label: '응급실각', colorClass: 'bg-red-500', textColor: 'text-white' },
  10: { score: 10, emoji: '🤯', label: '기절초풍', colorClass: 'bg-red-600', textColor: 'text-white' },
};

export const DEFAULT_SCORE = 3;