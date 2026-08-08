import React, { useState, useEffect } from 'react';
import { GradeLevel, StudentProgress, Question } from './types';
import { Navbar } from './components/Navbar';
import { QuizSection } from './components/QuizSection';
import { AIAgentChat } from './components/AIAgentChat';
import { LessonView } from './components/LessonView';
import { CodeSandbox } from './components/CodeSandbox';
import { StudentProfile } from './components/StudentProfile';
import { OnboardingModal } from './components/OnboardingModal';

export default function App() {
  const [currentTab, setTab] = useState<'quiz' | 'chat' | 'lessons' | 'sandbox' | 'profile'>('quiz');
  const [grade, setGrade] = useState<GradeLevel>('7');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);

  // Student progress state
  const [progress, setProgress] = useState<StudentProgress>(() => {
    try {
      const saved = localStorage.getItem('pybuddy_student_progress');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      xp: 25,
      level: 1,
      streakDays: 1,
      completedLessons: [],
      answeredQuestions: [],
      grade: '7',
    };
  });

  // Sandbox state
  const [sandboxInitialCode, setSandboxInitialCode] = useState<string>('');
  // Chat question prompt context
  const [chatQuestionPrompt, setChatQuestionPrompt] = useState<Question | null>(null);

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem('pybuddy_student_progress', JSON.stringify(progress));
    } catch (e) {
      // ignore
    }
  }, [progress]);

  const handleAddXp = (amount: number, questionId: string, isCorrect: boolean, answer: string) => {
    setProgress((prev) => ({
      ...prev,
      xp: prev.xp + amount,
      answeredQuestions: [
        ...prev.answeredQuestions.filter((q) => q.questionId !== questionId),
        { questionId, score: isCorrect ? 100 : 0, isCorrect, userAnswer: answer },
      ],
    }));
  };

  const handleOpenSandboxWithCode = (code: string) => {
    setSandboxInitialCode(code);
    setTab('sandbox');
  };

  const handleOpenChatWithQuestion = (q: Question) => {
    setChatQuestionPrompt(q);
    setTab('chat');
  };

  const handleOpenChatWithCode = (code: string) => {
    setSandboxInitialCode(code);
    setTab('chat');
  };

  const handleOpenChatAboutLesson = (title: string) => {
    setTab('chat');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Onboarding Modal for First Time Setup */}
      {showOnboarding && (
        <OnboardingModal
          onComplete={(selectedGrade) => {
            setGrade(selectedGrade);
            setShowOnboarding(false);
          }}
        />
      )}

      {/* Primary Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setTab={setTab}
        grade={grade}
        setGrade={setGrade}
        xp={progress.xp}
        streakDays={progress.streakDays}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-12">
        {currentTab === 'quiz' && (
          <QuizSection
            grade={grade}
            progress={progress}
            onAddXp={handleAddXp}
            onOpenChatWithQuestion={handleOpenChatWithQuestion}
          />
        )}

        {currentTab === 'chat' && (
          <AIAgentChat
            grade={grade}
            currentCode={sandboxInitialCode}
            onRunCodeInSandbox={handleOpenSandboxWithCode}
            initialQuestionPrompt={chatQuestionPrompt}
          />
        )}

        {currentTab === 'lessons' && (
          <LessonView
            grade={grade}
            onOpenSandboxWithCode={handleOpenSandboxWithCode}
            onOpenChatAboutLesson={handleOpenChatAboutLesson}
          />
        )}

        {currentTab === 'sandbox' && (
          <CodeSandbox
            initialCode={sandboxInitialCode}
            onAskAiAboutCode={handleOpenChatWithCode}
          />
        )}

        {currentTab === 'profile' && (
          <StudentProfile progress={progress} grade={grade} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 font-medium">
        <p>PyBuddy THCS — AI Agent Dạy Lập Trình Python Cho Học Sinh Trung Học Cơ Sở (Lớp 6 - 9)</p>
      </footer>
    </div>
  );
}
