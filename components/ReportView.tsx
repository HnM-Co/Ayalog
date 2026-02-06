import React, { useMemo, useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Copy, Check, Share2, Activity, Stethoscope } from 'lucide-react';
import { PainRecord } from '../types';

interface ReportViewProps {
  records: PainRecord[];
}

const ReportView: React.FC<ReportViewProps> = ({ records }) => {
  const [copied, setCopied] = useState(false);

  // Prepare chart data (reverse to show chronological order left-to-right)
  const chartData = useMemo(() => {
    return [...records]
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(r => ({
        time: new Date(r.timestamp).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }),
        fullDate: new Date(r.timestamp).toLocaleString('ko-KR'),
        score: r.score,
        note: r.note
      }));
  }, [records]);

  // Statistics
  const stats = useMemo(() => {
    if (records.length === 0) return null;
    const scores = records.map(r => r.score);
    return {
      avg: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1),
      max: Math.max(...scores),
      min: Math.min(...scores),
      count: records.length,
      start: new Date(Math.min(...records.map(r => r.timestamp))).toLocaleDateString('ko-KR'),
      end: new Date(Math.max(...records.map(r => r.timestamp))).toLocaleDateString('ko-KR'),
    };
  }, [records]);

  const generateReport = () => {
    if (!stats || records.length === 0) return "기록이 없습니다.";

    // Sort specifically for the text report (Newest first)
    const sortedRecords = [...records].sort((a, b) => b.timestamp - a.timestamp);
    
    // Detailed list with date and time
    const detailedList = sortedRecords.map(r => {
        const dateObj = new Date(r.timestamp);
        const date = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
        const time = dateObj.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
        const notePart = r.note ? ` \n   └ 📝 ${r.note}` : '';
        return `- ${date} ${time} | 통증 ${r.score}${notePart}`;
    }).join('\n');

    return `[아야로그 - 통증 리포트]
기간: ${stats.start} ~ ${stats.end}
총 기록: ${stats.count}회

[통계 요약]
- 평균: ${stats.avg} / 최대: ${stats.max} / 최소: ${stats.min}

[상세 기록]
${detailedList}

@acedoctor2026`;
  };

  const handleCopy = () => {
    const text = generateReport();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = async () => {
    const reportText = generateReport();
    const shareData = {
      title: '아야로그 통증 리포트',
      text: reportText,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback: Copy to clipboard if sharing is not supported
      handleCopy();
      alert('공유하기를 지원하지 않는 브라우저입니다. 클립보드에 복사되었습니다.');
    }
  };

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <Activity size={48} className="mb-4 opacity-50" />
        <p className="font-bold">데이터가 부족해요</p>
        <p className="text-xs mt-1">기록을 먼저 남겨주세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Chart Section */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-amber-100">
        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Activity size={20} className="text-blue-500" />
          통증 변화 그래프
        </h3>
        <div className="h-64 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{fill: '#9ca3af', fontSize: 11}} axisLine={false} tickLine={false} dy={10} />
              <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={{fill: '#9ca3af', fontSize: 11}} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                labelStyle={{ color: '#6b7280', marginBottom: '0.25rem' }}
              />
              <ReferenceLine y={5} stroke="#e5e7eb" strokeDasharray="3 3" />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 p-4 rounded-2xl text-center shadow-sm border border-blue-100">
          <div className="text-xs text-blue-600 font-bold mb-1">평균 통증</div>
          <div className="text-2xl font-display font-bold text-blue-900">{stats?.avg}</div>
        </div>
        <div className="bg-red-50 p-4 rounded-2xl text-center shadow-sm border border-red-100">
          <div className="text-xs text-red-600 font-bold mb-1">최대 통증</div>
          <div className="text-2xl font-display font-bold text-red-900">{stats?.max}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-2xl text-center shadow-sm border border-green-100">
          <div className="text-xs text-green-600 font-bold mb-1">최소 통증</div>
          <div className="text-2xl font-display font-bold text-green-900">{stats?.min}</div>
        </div>
      </div>

      {/* Doctor's Report Section */}
      <div className="bg-gray-800 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Stethoscope size={120} />
        </div>
        
        <h3 className="font-bold text-xl mb-1 z-10 relative flex items-center gap-2">
          <Stethoscope size={20} className="text-green-400"/>
          진료실용 요약
        </h3>
        <p className="text-gray-400 text-xs mb-5 z-10 relative">
          의사 선생님께 이 화면을 보여주거나 공유하세요.
        </p>

        <div className="bg-gray-700/50 rounded-xl p-4 font-mono text-xs text-gray-300 mb-5 whitespace-pre-wrap leading-relaxed border border-gray-600 max-h-80 overflow-y-auto">
          {generateReport()}
        </div>

        <div className="flex gap-3 z-10 relative">
          <button 
            onClick={handleCopy}
            className={`flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              copied ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            {copied ? (
              <>
                <Check size={18} />
                복사됨
              </>
            ) : (
              <>
                <Copy size={18} />
                복사
              </>
            )}
          </button>
          
          <button 
            onClick={handleShare}
            className="flex-[1.5] py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all bg-white text-gray-900 hover:bg-gray-100"
          >
            <Share2 size={18} />
            공유하기
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 font-mono">
        @acedoctor2026
      </div>
    </div>
  );
};

export default ReportView;