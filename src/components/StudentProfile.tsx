import React from 'react';
import { StudentProgress, GradeLevel } from '../types';
import { Trophy, Award, Flame, CheckCircle2, Star, Target, Shield, Zap } from 'lucide-react';

interface StudentProfileProps {
  progress: StudentProgress;
  grade: GradeLevel;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ progress, grade }) => {
  const level = Math.floor(progress.xp / 100) + 1;
  const xpInCurrentLevel = progress.xp % 100;

  const badges = [
    {
      id: 'b1',
      title: 'Tân Binh Python',
      desc: 'Hoàn thành câu hỏi print() đầu tiên',
      unlocked: progress.xp >= 10,
      icon: Star,
    },
    {
      id: 'b2',
      title: 'Hộp Quà Biến',
      desc: 'Lưu trữ dữ liệu vào biến và input()',
      unlocked: progress.xp >= 30,
      icon: Shield,
    },
    {
      id: 'b3',
      title: 'Bậc Thầy Điều Kiện',
      desc: 'Đưa ra quyết định với câu lệnh if/else',
      unlocked: progress.xp >= 60,
      icon: Zap,
    },
    {
      id: 'b4',
      title: 'Siêu Cấp Vòng Lặp',
      desc: 'Lặp lại công việc tự động với for/while',
      unlocked: progress.xp >= 100,
      icon: Target,
    },
    {
      id: 'b5',
      title: 'Học Sinh Xuất Sắc THCS',
      desc: 'Đạt từ 200 XP trở lên',
      unlocked: progress.xp >= 200,
      icon: Trophy,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-amber-300 text-2xl shadow-md">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold">Học Sinh Python THCS</h1>
                <span className="px-2.5 py-0.5 bg-white/20 text-white rounded-full text-xs font-bold">
                  Lớp {grade}
                </span>
              </div>
              <p className="text-sky-100 text-sm font-medium mt-0.5">
                Cấp độ {level}: {level === 1 ? 'Tân Binh' : level === 2 ? 'Tập Sự' : 'Thần Đồng Python'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-400 fill-current" />
              <div>
                <div className="text-xs text-sky-200 uppercase font-bold">Chuỗi học</div>
                <div className="text-lg font-extrabold">{progress.streakDays} Ngày</div>
              </div>
            </div>

            <div className="h-8 w-px bg-white/20" />

            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-300" />
              <div>
                <div className="text-xs text-sky-200 uppercase font-bold">Tổng XP</div>
                <div className="text-lg font-extrabold">{progress.xp} XP</div>
              </div>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-sky-100">
            <span>Tiến trình Level {level}</span>
            <span>{xpInCurrentLevel} / 100 XP để lên Level {level + 1}</span>
          </div>
          <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-500"
              style={{ width: `${xpInCurrentLevel}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badges Collection */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>Huy Chương Thành Tích ({badges.filter((b) => b.unlocked).length} / {badges.length})</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                  b.unlocked
                    ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 text-slate-900 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 opacity-50 text-slate-500'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    b.unlocked ? 'bg-amber-400 text-slate-900 shadow-xs' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-extrabold">{b.title}</div>
                  <div className="text-[11px] leading-tight font-medium">{b.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
