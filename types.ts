export interface PainRecord {
  id: string;
  timestamp: number;
  score: number;
  note: string;
}

export interface PainLevelConfig {
  score: number;
  emoji: string;
  label: string;
  colorClass: string;
  textColor: string;
}

export type TabView = 'tracker' | 'history' | 'report';