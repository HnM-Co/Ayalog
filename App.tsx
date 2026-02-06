import React, { useState, useEffect } from 'react';
import { LayoutDashboard, History, FileText, HeartPulse } from 'lucide-react';
import { PainRecord, TabView } from './types';
import TrackerView from './components/TrackerView';
import HistoryView from './components/HistoryView';
import ReportView from './components/ReportView';

const LOCAL_STORAGE_KEY = 'vas_pain_tracker_data';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabView>('tracker');
  const [records, setRecords] = useState<PainRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        setRecords(JSON.parse(savedData));
      }
    } catch (e) {
      console.error("Failed to load records", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save data on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
    }
  }, [records, isLoaded]);

  const addRecord = (score: number, note: string) => {
    const newRecord: PainRecord = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      score,
      note,
    };
    setRecords(prev => [newRecord, ...prev]);
  };

  const deleteRecord = (id: string) => {
    if (window.confirm("정말 이 기록을 지울까요?")) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'tracker':
        return <TrackerView onSave={addRecord} lastRecord={records[0]} />;
      case 'history':
        return <HistoryView records={records} onDelete={deleteRecord} />;
      case 'report':
        return <ReportView records={records} />;
      default:
        return <TrackerView onSave={addRecord} lastRecord={records[0]} />;
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col max-w-lg mx-auto shadow-2xl overflow-hidden font-sans">
      {/* Header */}
      <header className="bg-white px-6 py-4 border-b border-amber-100 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-display font-bold text-gray-800 tracking-tight flex items-center gap-1">
          <HeartPulse className="text-red-500 fill-red-500" size={24} />
          <span>아야<span className="text-amber-500">로그</span></span>
        </h1>
        <div className="text-xs text-gray-400 font-bold px-3 py-1 bg-gray-100 rounded-full">
          통증 기록기
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 pb-4 pt-1 scroll-smooth">
        {/* Google AdSense Slot */}
        <div className="w-full my-1 h-14 bg-gray-100/50 border border-gray-200/50 rounded-lg flex items-center justify-center text-[10px] text-gray-300">
           구글 애드센스 광고 영역
        </div>

        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-amber-100 flex justify-around items-center pb-safe">
        <button 
          onClick={() => setActiveTab('tracker')}
          className={`flex-1 flex flex-col items-center justify-center py-3 text-xs font-bold transition-colors ${activeTab === 'tracker' ? 'text-amber-600 bg-amber-50/50' : 'text-gray-400 hover:bg-gray-50'}`}
        >
          <LayoutDashboard size={22} className="mb-1" />
          기록하기
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 flex flex-col items-center justify-center py-3 text-xs font-bold transition-colors ${activeTab === 'history' ? 'text-amber-600 bg-amber-50/50' : 'text-gray-400 hover:bg-gray-50'}`}
        >
          <History size={22} className="mb-1" />
          모아보기
        </button>
        <button 
          onClick={() => setActiveTab('report')}
          className={`flex-1 flex flex-col items-center justify-center py-3 text-xs font-bold transition-colors ${activeTab === 'report' ? 'text-amber-600 bg-amber-50/50' : 'text-gray-400 hover:bg-gray-50'}`}
        >
          <FileText size={22} className="mb-1" />
          보고서
        </button>
      </nav>
    </div>
  );
}