export type GradeLevel = '6' | '7' | '8' | '9' | 'all';

export type QuestionType = 'multiple_choice' | 'fill_in_blank' | 'code_challenge' | 'debugging';

export interface Question {
  id: string;
  title: string;
  description: string;
  type: QuestionType;
  grade: GradeLevel;
  topic: string;
  difficulty: 'Dễ' | 'Trung Bình' | 'Thử Thách';
  points: number;
  options?: string[]; // for multiple choice
  correctAnswer?: string | number; // index or text answer
  starterCode?: string;
  testCases?: {
    input?: string;
    expectedOutput: string;
    description: string;
  }[];
  explanation: string;
  hint: string;
}

export interface LessonStep {
  id: string;
  title: string;
  content: string; // Markdown / formatted text
  codeExample?: string;
  exercise?: {
    task: string;
    starterCode: string;
    solution: string;
    expectedOutput?: string;
  };
}

export interface Lesson {
  id: string;
  grade: GradeLevel;
  chapter: string;
  title: string;
  description: string;
  iconName: string;
  durationMinutes: number;
  steps: LessonStep[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  codeSnippet?: string;
  timestamp: Date;
  questionPayload?: Question; // If agent generated a quiz question in chat
  suggestedActions?: string[];
}

export interface StudentProgress {
  xp: number;
  level: number;
  streakDays: number;
  completedLessons: string[];
  answeredQuestions: {
    questionId: string;
    score: number;
    isCorrect: boolean;
    userAnswer: string;
  }[];
  grade: GradeLevel;
}

export interface PythonExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTimeMs?: number;
}
