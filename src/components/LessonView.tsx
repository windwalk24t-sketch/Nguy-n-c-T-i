import React, { useState } from 'react';
import { GradeLevel, Lesson } from '../types';
import { THCS_CURRICULUM } from '../data/curriculum';
import { runPythonCode } from '../lib/pythonRunner';
import {
  BookOpen,
  CheckCircle2,
  Play,
  ArrowRight,
  ArrowLeft,
  Code,
  Sparkles,
  Bot,
  GraduationCap,
} from 'lucide-react';

interface LessonViewProps {
  grade: GradeLevel;
  onOpenSandboxWithCode: (code: string) => void;
  onOpenChatAboutLesson: (lessonTitle: string) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  grade,
  onOpenSandboxWithCode,
  onOpenChatAboutLesson,
}) => {
  const filteredLessons = THCS_CURRICULUM.filter(
    (l) => grade === 'all' || l.grade === grade
  );

  const [activeLesson, setActiveLesson] = useState<Lesson>(
    filteredLessons[0] || THCS_CURRICULUM[0]
  );
  const [stepIdx, setStepIdx] = useState<number>(0);

  const [exerciseCode, setExerciseCode] = useState<string>('');
  const [exerciseOutput, setExerciseOutput] = useState<string>('');
  const [isRunningExercise, setIsRunningExercise] = useState<boolean>(false);

  const currentStep = activeLesson.steps[stepIdx] || activeLesson.steps[0];

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setStepIdx(0);
    setExerciseCode(lesson.steps[0]?.exercise?.starterCode || '');
    setExerciseOutput('');
  };

  const handleRunExercise = async () => {
    setIsRunningExercise(true);
    setExerciseOutput('Đang thực thi...');

    const res = await runPythonCode(
      exerciseCode || currentStep?.exercise?.starterCode || ''
    );

    setIsRunningExercise(false);
    if (res.success) {
      setExerciseOutput(res.output || 'Chạy thành công!');
    } else {
      setExerciseOutput(res.error || 'Có lỗi xảy ra.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">
            <GraduationCap className="w-4 h-4" />
            <span>Khung Chương Trình Tin Học THCS (Lớp 6 - Lớp 9)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Lộ Trình Bài Học Lập Trình Python
          </h1>
        </div>

        <button
          onClick={() => onOpenChatAboutLesson(activeLesson.title)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Bot className="w-4 h-4" />
          <span>Hỏi AI PyBuddy về bài học này</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Lesson List Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-2">
            Danh sách bài học (Lớp {grade}):
          </h3>

          <div className="space-y-2">
            {filteredLessons.map((lesson) => {
              const isSelected = lesson.id === activeLesson.id;
              return (
                <button
                  key={lesson.id}
                  onClick={() => handleSelectLesson(lesson)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200/70 text-slate-800'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-extrabold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    L{lesson.grade}
                  </div>
                  <div>
                    <div className="text-xs font-bold opacity-80">{lesson.chapter}</div>
                    <div className="text-sm font-extrabold leading-snug">{lesson.title}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Lesson Reader Content */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Step Progress Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Phần {stepIdx + 1} / {activeLesson.steps.length}: {currentStep?.title}
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={stepIdx === 0}
                onClick={() => setStepIdx(stepIdx - 1)}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                disabled={stepIdx === activeLesson.steps.length - 1}
                onClick={() => setStepIdx(stepIdx + 1)}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Step Text Body */}
          <div className="space-y-4 text-slate-800 text-sm sm:text-base leading-relaxed">
            <h2 className="text-xl font-extrabold text-slate-900">{currentStep?.title}</h2>
            <div className="prose prose-slate max-w-none font-medium whitespace-pre-line">
              {currentStep?.content}
            </div>
          </div>

          {/* Example Code Card */}
          {currentStep?.codeExample && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Ví dụ minh họa:</span>
                <button
                  onClick={() => onOpenSandboxWithCode(currentStep.codeExample || '')}
                  className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-bold"
                >
                  <Code className="w-4 h-4" />
                  <span>Chạy trong Sandbox</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs border border-slate-800 overflow-x-auto">
                <pre>{currentStep.codeExample}</pre>
              </div>
            </div>
          )}

          {/* Step Exercise */}
          {currentStep?.exercise && (
            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-3">
              <div className="flex items-center gap-2 font-bold text-indigo-900 text-sm">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Thực hành tại chỗ:</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-700">
                {currentStep.exercise.task}
              </p>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 font-mono text-xs">
                <textarea
                  value={
                    exerciseCode || currentStep.exercise.starterCode
                  }
                  onChange={(e) => setExerciseCode(e.target.value)}
                  rows={4}
                  className="w-full bg-transparent text-emerald-400 focus:outline-none resize-y"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={handleRunExercise}
                  disabled={isRunningExercise}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunningExercise ? 'Đang chạy...' : 'Chạy thử'}</span>
                </button>
              </div>

              {exerciseOutput && (
                <div className="p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl">
                  {exerciseOutput}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
