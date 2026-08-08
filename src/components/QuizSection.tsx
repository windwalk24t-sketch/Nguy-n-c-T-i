import React, { useState } from 'react';
import { Question, GradeLevel, StudentProgress } from '../types';
import { INITIAL_QUESTIONS_BANK } from '../data/questionsBank';
import { runPythonCode } from '../lib/pythonRunner';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Lightbulb,
  Award,
  ArrowRight,
  Bot,
  Brain,
  Code2,
  ListCheck,
  Send,
  Loader2,
} from 'lucide-react';

interface QuizSectionProps {
  grade: GradeLevel;
  progress: StudentProgress;
  onAddXp: (amount: number, questionId: string, isCorrect: boolean, answer: string) => void;
  onOpenChatWithQuestion: (q: Question) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  grade,
  progress,
  onAddXp,
  onOpenChatWithQuestion,
}) => {
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS_BANK);
  const [currentIdx, setCurrentIdx] = useState<number>(0);

  const [selectedTopic, setSelectedTopic] = useState<string>('Tất cả');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const [codeAnswer, setCodeAnswer] = useState<string>('');
  const [codeOutput, setCodeOutput] = useState<string>('');
  const [isRunningCode, setIsRunningCode] = useState<boolean>(false);

  const [aiEvaluating, setAiEvaluating] = useState<boolean>(false);
  const [aiFeedback, setAiFeedback] = useState<{
    isCorrect?: boolean;
    scorePercent?: number;
    feedback?: string;
    improvementTips?: string;
  } | null>(null);

  const [showHint, setShowHint] = useState<boolean>(false);
  const [isGeneratingAiQuestion, setIsGeneratingAiQuestion] = useState<boolean>(false);

  // Filter questions based on selected Grade & Topic
  const filteredQuestions = questions.filter((q) => {
    const matchGrade = grade === 'all' || q.grade === grade;
    const matchTopic = selectedTopic === 'Tất cả' || q.topic.includes(selectedTopic);
    return matchGrade && matchTopic;
  });

  const currentQ = filteredQuestions[currentIdx] || questions[0];

  // Reset states when changing question
  const handleSelectQuestion = (index: number) => {
    setCurrentIdx(index);
    setSelectedOption(null);
    const q = filteredQuestions[index];
    setCodeAnswer(q?.starterCode || '');
    setCodeOutput('');
    setAiFeedback(null);
    setShowHint(false);
  };

  // Generate a brand new AI question dynamically via backend API
  const handleGenerateAiQuestion = async () => {
    setIsGeneratingAiQuestion(true);
    setAiFeedback(null);
    setSelectedOption(null);
    setShowHint(false);

    try {
      const res = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          topic: selectedTopic,
        }),
      });

      const data = await res.json();
      if (data.success && data.question) {
        const newQ: Question = data.question;
        setQuestions((prev) => [newQ, ...prev]);
        setCurrentIdx(0);
        setCodeAnswer(newQ.starterCode || '');
        setCodeOutput('');

        // Trigger celebratory confetti for requesting AI Question
        confetti({
          particleCount: 25,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    } catch (e) {
      console.error('Failed to generate question:', e);
    } finally {
      setIsGeneratingAiQuestion(false);
    }
  };

  // Handle MCQ Answer Submission
  const handleSelectOption = (optIdx: number) => {
    if (selectedOption !== null) return; // Answered already
    setSelectedOption(optIdx);

    const isCorrect = optIdx === currentQ.correctAnswer;

    if (isCorrect) {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      onAddXp(currentQ.points || 15, currentQ.id, true, String(optIdx));
    } else {
      onAddXp(0, currentQ.id, false, String(optIdx));
    }
  };

  // Run Code in Browser Python Sandbox
  const handleRunCode = async () => {
    setIsRunningCode(true);
    setCodeOutput('Đang thực thi Python code...');

    const res = await runPythonCode(codeAnswer);

    setIsRunningCode(false);
    if (res.success) {
      setCodeOutput(res.output || 'Chương trình đã chạy hoàn tất (Không có output in ra).');
    } else {
      setCodeOutput(res.error || 'Đã xảy ra lỗi khi thực thi.');
    }
  };

  // Submit Code Answer for AI Agent Review & Grading
  const handleSubmitCodeForAiReview = async () => {
    setAiEvaluating(true);
    setAiFeedback(null);

    try {
      const res = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQ,
          userAnswer: codeAnswer,
          output: codeOutput,
        }),
      });

      const data = await res.json();
      if (data.success && data.evaluation) {
        setAiFeedback(data.evaluation);

        if (data.evaluation.isCorrect) {
          confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
          onAddXp(currentQ.points || 20, currentQ.id, true, codeAnswer);
        } else {
          onAddXp(5, currentQ.id, false, codeAnswer); // Partial participation XP
        }
      }
    } catch (e) {
      console.error('Error sending code to AI:', e);
    } finally {
      setAiEvaluating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner: Agent Asking Questions Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-blue-700 to-sky-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-200/50">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-bold text-sky-200">
              <Bot className="w-4 h-4 text-amber-300" />
              <span>AI Agent Trực Tiếp Hỏi Đáp • Khối Lớp {grade}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Thử Thách & Đặt Câu Hỏi Python
            </h1>
            <p className="text-sm sm:text-base text-sky-100 font-medium">
              AI Agent PyBuddy sẽ liên tục tạo câu hỏi trắc nghiệm, bài tập sửa lỗi code và thử thách
              lập trình vui nhộn dành riêng cho bạn!
            </p>
          </div>

          <button
            onClick={handleGenerateAiQuestion}
            disabled={isGeneratingAiQuestion}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-900 font-extrabold text-sm rounded-2xl shadow-lg shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 cursor-pointer"
          >
            {isGeneratingAiQuestion ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>PyBuddy đang suy nghĩ câu hỏi...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-slate-900" />
                <span>Yêu cầu AI Agent đặt câu hỏi mới cho tôi!</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Topic Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
          Chủ đề:
        </span>
        {['Tất cả', 'Lệnh print()', 'Biến & input()', 'Toán tử', 'if/else', 'Vòng lặp', 'List', 'Hàm'].map(
          (topic) => (
            <button
              key={topic}
              onClick={() => {
                setSelectedTopic(topic);
                setCurrentIdx(0);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedTopic === topic
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {topic}
            </button>
          )
        )}
      </div>

      {/* Main Question Card Area */}
      {currentQ ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Main Question Box */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            {/* Header: Difficulty & Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Lớp {currentQ.grade}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">
                  {currentQ.topic}
                </span>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    currentQ.difficulty === 'Dễ'
                      ? 'bg-emerald-50 text-emerald-700'
                      : currentQ.difficulty === 'Trung Bình'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {currentQ.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <Award className="w-4 h-4" />
                <span>+{currentQ.points || 15} XP</span>
              </div>
            </div>

            {/* Question Title & Description */}
            <div className="space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 leading-snug">
                {currentQ.title}
              </h2>
              <p className="text-slate-700 font-medium whitespace-pre-line text-sm sm:text-base leading-relaxed">
                {currentQ.description}
              </p>
            </div>

            {/* Render Question Type 1: Multiple Choice */}
            {currentQ.type === 'multiple_choice' && currentQ.options && (
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Chọn 1 đáp án đúng nhất:
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrectChoice = idx === currentQ.correctAnswer;
                    let style =
                      'bg-slate-50 border-slate-200 text-slate-800 hover:border-indigo-300 hover:bg-indigo-50/50';

                    if (selectedOption !== null) {
                      if (isCorrectChoice) {
                        style = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                      } else if (isSelected && !isCorrectChoice) {
                        style = 'bg-rose-50 border-rose-400 text-rose-900';
                      } else {
                        style = 'opacity-50 bg-slate-50 border-slate-200 text-slate-400';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={selectedOption !== null}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-sm sm:text-base font-semibold cursor-pointer ${style}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-xl bg-white/80 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700 shadow-xs">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {selectedOption !== null && isCorrectChoice && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                        {selectedOption !== null && isSelected && !isCorrectChoice && (
                          <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                {selectedOption !== null && (
                  <div
                    className={`p-4 rounded-2xl border ${
                      selectedOption === currentQ.correctAnswer
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    } space-y-2 text-sm font-medium animate-fadeIn`}
                  >
                    <div className="flex items-center gap-2 font-bold">
                      <Bot className="w-5 h-5" />
                      <span>
                        {selectedOption === currentQ.correctAnswer
                          ? 'Chính xác! Hoan hô bạn!'
                          : 'Chưa chính xác rồi. Hãy đọc giải thích bên dưới nhé:'}
                      </span>
                    </div>
                    <p>{currentQ.explanation}</p>
                  </div>
                )}
              </div>
            )}

            {/* Render Question Type 2 & 3: Code Challenge & Debugging */}
            {(currentQ.type === 'code_challenge' || currentQ.type === 'debugging') && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-indigo-600" />
                    <span>Mã Python thực hành:</span>
                  </span>

                  <button
                    onClick={handleRunCode}
                    disabled={isRunningCode}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isRunningCode ? 'Đang chạy...' : 'Chạy thử Code'}</span>
                  </button>
                </div>

                {/* Code Editor TextArea */}
                <div className="relative rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden font-mono text-sm shadow-inner">
                  <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>script.py</span>
                    <button
                      onClick={() => setCodeAnswer(currentQ.starterCode || '')}
                      className="hover:text-slate-200 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Đặt lại</span>
                    </button>
                  </div>
                  <textarea
                    value={codeAnswer}
                    onChange={(e) => setCodeAnswer(e.target.value)}
                    rows={7}
                    spellCheck={false}
                    className="w-full p-4 bg-transparent text-emerald-400 focus:outline-none resize-y font-mono leading-relaxed"
                    placeholder="# Viết mã Python của bạn ở đây..."
                  />
                </div>

                {/* Console Output Window */}
                {codeOutput && (
                  <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs border border-slate-800 space-y-1">
                    <div className="text-slate-400 font-sans font-bold text-[11px] uppercase tracking-wider">
                      Màn hình Console Output:
                    </div>
                    <pre className="whitespace-pre-wrap text-emerald-300">{codeOutput}</pre>
                  </div>
                )}

                {/* Submit to AI Agent for Grading Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    onClick={handleSubmitCodeForAiReview}
                    disabled={aiEvaluating || !codeAnswer.trim()}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-200 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {aiEvaluating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>AI Agent đang chấm bài...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Gửi Cho AI Agent Chấm Bài</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onOpenChatWithQuestion(currentQ)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-2 rounded-xl"
                  >
                    <Bot className="w-4 h-4" />
                    <span>Hỏi AI PyBuddy hướng dẫn bài này</span>
                  </button>
                </div>

                {/* AI Evaluation Result Card */}
                {aiFeedback && (
                  <div
                    className={`p-5 rounded-2xl border ${
                      aiFeedback.isCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    } space-y-3 animate-fadeIn`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-base">
                        <Bot className="w-5 h-5 text-indigo-600" />
                        <span>Kết quả chấm từ AI Agent:</span>
                      </div>
                      <span className="px-3 py-1 bg-white rounded-full text-xs font-extrabold shadow-2xs">
                        {aiFeedback.scorePercent}% Hoàn thành
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed font-medium">{aiFeedback.feedback}</p>

                    {aiFeedback.improvementTips && (
                      <div className="text-xs bg-white/70 p-3 rounded-xl border border-amber-200/60 font-mono">
                        💡 <strong>Mẹo cải thiện:</strong> {aiFeedback.improvementTips}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Bottom Actions: Hint & Navigation */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setShowHint(!showHint)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 px-3 py-2 rounded-xl transition-all"
              >
                <Lightbulb className="w-4 h-4" />
                <span>{showHint ? 'Ẩn gợi ý' : 'Xem gợi ý từ PyBuddy'}</span>
              </button>

              <button
                onClick={() =>
                  handleSelectQuestion((currentIdx + 1) % filteredQuestions.length)
                }
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                <span>Câu tiếp theo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Hint Box */}
            {showHint && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-medium animate-fadeIn flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-xs uppercase tracking-wider text-amber-700 mb-1">
                    Gợi ý từ AI PyBuddy:
                  </p>
                  <p>{currentQ.hint}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: List of Available Questions & AI Agent Persona Info */}
          <div className="lg:col-span-4 space-y-6">
            {/* AI Agent Persona Widget */}
            <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 border border-indigo-100 rounded-3xl p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                  <Bot className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">PyBuddy AI Agent</h3>
                  <p className="text-xs font-semibold text-indigo-600">
                    Chuyên gia Python THCS
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                "Mình được huấn luyện để giải thích mã nguồn đơn giản nhất, đặt câu hỏi phù hợp với
                màn chơi Lớp {grade} của bạn!"
              </p>
            </div>

            {/* Questions Bank Navigation List */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <ListCheck className="w-4 h-4 text-indigo-600" />
                  <span>Danh sách câu hỏi ({filteredQuestions.length})</span>
                </h3>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {filteredQuestions.map((q, idx) => {
                  const isCurrent = idx === currentIdx;
                  return (
                    <button
                      key={q.id}
                      onClick={() => handleSelectQuestion(idx)}
                      className={`w-full text-left p-3 rounded-2xl border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                        isCurrent
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 border-slate-200/70 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="truncate max-w-[200px]">
                        <span className="font-extrabold mr-1.5">Câu {idx + 1}:</span>
                        <span>{q.title}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          isCurrent
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {q.type === 'multiple_choice' ? 'Trắc nghiệm' : 'Code'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
