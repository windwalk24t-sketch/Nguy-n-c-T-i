import React, { useState } from 'react';
import { GradeLevel } from '../types';
import { Bot, Sparkles, Check, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  onComplete: (grade: GradeLevel) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('7');
  const [experience, setExperience] = useState<string>('moi_bat_dau');

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-scaleUp">
        {/* Header Avatar */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-200">
            <Bot className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Chào mừng bạn đến với PyBuddy!
          </h2>
          <p className="text-sm font-medium text-slate-600">
            AI Agent trợ lý đồng hành dạy lập trình Python dành riêng cho học sinh Trung học Cơ sở (Lớp 6-9).
          </p>
        </div>

        {/* Question 1: Grade Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            1. Bạn đang học Lớp mấy THCS?
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['6', '7', '8', '9'] as GradeLevel[]).map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`py-3 rounded-2xl border font-extrabold text-sm transition-all cursor-pointer ${
                  selectedGrade === g
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Lớp {g}
              </button>
            ))}
          </div>
        </div>

        {/* Question 2: Experience */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            2. Mức độ quen thuộc với Python của bạn?
          </label>
          <div className="space-y-2">
            {[
              { id: 'moi_bat_dau', label: 'Mới bắt đầu - Chưa biết gì về Python' },
              { id: 'da_hoc_chut', label: 'Đã biết lệnh print() và biến cơ bản' },
              { id: 'muon_sieu_cap', label: 'Đã từng viết code và muốn thử thách khó hơn' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setExperience(opt.id)}
                className={`w-full text-left p-3.5 rounded-2xl border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                  experience === opt.id
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{opt.label}</span>
                {experience === opt.id && <Check className="w-4 h-4 text-indigo-600" />}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onComplete(selectedGrade)}
          className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Bắt đầu hỏi & học cùng AI PyBuddy ngay!</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
