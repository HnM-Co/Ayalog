import React from 'react';
import { Trash2, Calendar, Frown, Clock } from 'lucide-react';
import { PainRecord } from '../types';
import { PAIN_LEVELS } from '../constants';

interface HistoryViewProps {
  records: PainRecord[];
  onDelete: (id: string) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ records, onDelete }) => {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 py-24">
        <div className="bg-white p-6 rounded-full mb-4 shadow-sm">
           <Frown size={48} className="text-gray-300" />
        </div>
        <p className="font-bold text-lg text-gray-500">아직 기록이 없어요</p>
        <p className="text-sm">첫 번째 통증 기록을 남겨보세요!</p>
      </div>
    );
  }

  // Group by date string
  const groupedRecords = records.reduce((groups, record) => {
    const date = new Date(record.timestamp).toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        weekday: 'long' 
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
    return groups;
  }, {} as Record<string, PainRecord[]>);

  return (
    <div className="space-y-8 pb-4">
      
      {Object.keys(groupedRecords).map((date) => {
        const dayRecords = groupedRecords[date];
        return (
          <div key={date} className="animate-fade-in">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-3 px-2">
              <Calendar size={14} className="text-amber-500" />
              {date}
            </div>
            <div className="space-y-3">
              {dayRecords.map((record) => {
                const config = PAIN_LEVELS[record.score];
                return (
                  <div 
                    key={record.id} 
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4 transition-transform hover:scale-[1.01]"
                  >
                    <div 
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${config.colorClass} bg-opacity-20 flex-shrink-0`}
                    >
                      {config.emoji}
                    </div>
                    
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-lg text-gray-800 flex items-center gap-2">
                          {config.label}
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${config.colorClass} ${config.textColor} bg-opacity-30`}>
                            {record.score}점
                          </span>
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                         <Clock size={10} />
                         {new Date(record.timestamp).toLocaleTimeString('ko-KR', {hour: '2-digit', minute:'2-digit'})}
                      </div>
                      
                      {record.note ? (
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl break-words leading-relaxed">
                          {record.note}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-300 italic">메모 없음</p>
                      )}
                    </div>

                    <button 
                      onClick={() => onDelete(record.id)}
                      className="text-gray-300 hover:text-red-500 p-2 -mr-2 -mt-2 transition-colors"
                      aria-label="삭제"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HistoryView;