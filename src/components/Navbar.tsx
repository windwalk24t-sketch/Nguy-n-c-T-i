import React from 'react';
import { GradeLevel } from '../types';
import { Sparkles, Bot, BookOpen, Code, Trophy, Flame, Target } from 'lucide-react';

interface NavbarProps {
  currentTab: 'quiz' | 'chat' | 'lessons' | 'sandbox' | 'profile';
  setTab: (tab: 'quiz' | 'chat' | 'lessons' | 'sandbox' | 'profile') => void;
  grade: GradeLevel;
  setGrade: (grade: GradeLevel) => void;
  xp: number;
  streakDays: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setTab,
  grade,
  setGrade,
  xp,
  streakDays,
}) => {
  const level = Math.floor(xp / 100) + 1;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setTab('quiz')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">PyBuddy</span>
                <span className="px-2 py-0.5 text-xs font-bold bg-indigo-100 text-indigo-700 rounded-full">
                  AI THCS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Trợ lý AI dạy Python Lớp 6 - Lớp 9</p>
            </div>
          </div>

          {/* Grade Selector Pill */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            <span className="text-xs font-semibold text-slate-500 px-2">Khối:</span>
            {(['6', '7', '8', '9'] as GradeLevel[]).map((g) => (
              <button
                key={g}
                onClick={() => setGrade(g)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  grade === g
                    ? 'bg-white text-indigo-600 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Lớp {g}
              </button>
            ))}
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setTab('quiz')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                currentTab === 'quiz'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Đặt Câu Hỏi & Thử Thách</span>
            </button>

            <button
              onClick={() => setTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                currentTab === 'chat'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Hỏi AI PyBuddy</span>
            </button>

            <button
              onClick={() => setTab('lessons')}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                currentTab === 'lessons'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Lộ Trình Học</span>
            </button>

            <button
              onClick={() => setTab('sandbox')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                currentTab === 'sandbox'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Sandbox Python</span>
            </button>

            <button
              onClick={() => setTab('profile')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all ${
                currentTab === 'profile'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <div className="text-left hidden xs:block">
                <div className="text-[10px] uppercase font-extrabold text-indigo-600 leading-none">
                  Cấp {level}
                </div>
                <div className="text-xs font-bold leading-tight">{xp} XP</div>
              </div>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
