import React, { useState } from 'react';
import { Save, AlertCircle, Edit3 } from 'lucide-react';
import { PainRecord } from '../types';
import { PAIN_LEVELS, DEFAULT_SCORE } from '../constants';

interface TrackerViewProps {
  onSave: (score: number, note: string) => void;
  lastRecord?: PainRecord;
}

const TrackerView: React.FC<TrackerViewProps> = ({ onSave, lastRecord }) => {
  const [score, setScore] = useState(DEFAULT_SCORE);
  const [note, setNote] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const currentLevel = PAIN_LEVELS[score];

  const handleSave = () => {
    if (!score) return;
    onSave(score, note);
    setNote(''); // Clear note but keep score for continuity
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Last Record Info */}
      {lastRecord && (
        <div className="text-center text-xs text-gray-500 animate-fade-in bg-white/60 py-2 rounded-full mx-auto px-4">
          마지막 기록: {new Date(lastRecord.timestamp).toLocaleTimeString('ko-KR', {hour: '2-digit', minute:'2-digit'})} (통증 {lastRecord.score}점)
        </div>
      )}

      {/* Main Visualization Card */}
      <div 
        className={`relative rounded-3xl p-8 flex flex-col items-center justify-center transition-all duration-500 shadow-xl ${currentLevel.colorClass}`}
        style={{ minHeight: '340px' }}
      >
        <div className="absolute top-5 right-5 bg-white/20 backdrop-blur-sm rounded-2xl px-3 py-1 text-white font-display font-bold text-xl">
          {score} 점
        </div>
        
        {/* Emoji Face */}
        <div className="text-[140px] leading-none mb-6 transition-transform duration-300 hover:scale-110 cursor-default select-none filter drop-shadow-lg">
          {currentLevel.emoji}
        </div>

        {/* Label */}
        <h2 className={`text-3xl font-display font-bold mb-8 ${currentLevel.textColor} transition-colors duration-300 drop-shadow-sm`}>
          "{currentLevel.label}"
        </h2>

        {/* Slider */}
        <div className="w-full px-2">
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full h-3 bg-white/40 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-white/30"
          />
          <div className={`flex justify-between text-xs font-bold mt-3 px-1 ${currentLevel.textColor} opacity-80`}>
            <span>하나도 안 아픔 (1)</span>
            <span>너무 아파요 (10)</span>
          </div>
        </div>
      </div>

      {/* Note Input */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-amber-100">
        <label htmlFor="note" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
          <Edit3 size={16} className="text-amber-500" />
          특이사항 메모 (선택)
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="예: 진통제 먹고 30분 뒤, 운동하고 나서 등..."
          className="w-full p-4 bg-amber-50/50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-sm resize-none h-24 transition-all placeholder-gray-400"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className={`w-full py-4 rounded-2xl font-display font-bold text-xl shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
          showSuccess 
            ? 'bg-green-500 text-white shadow-green-200' 
            : 'bg-gray-800 text-white shadow-gray-400 hover:bg-gray-900'
        }`}
      >
        {showSuccess ? (
          <span>저장했어요! ✨</span>
        ) : (
          <>
            <Save size={24} />
            기록 저장하기
          </>
        )}
      </button>
    </div>
  );
};

export default TrackerView;