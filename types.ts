export enum ScreenName {
  SPLASH = 'SPLASH',
  ONBOARDING = 'ONBOARDING',
  AUTH = 'AUTH',
  LANGUAGE_SELECT = 'LANGUAGE_SELECT',
  HOME = 'HOME',
  LESSONS = 'LESSONS',
  LESSON_DETAIL = 'LESSON_DETAIL',
  QUIZ = 'QUIZ',
  CULTURE = 'CULTURE',
  PROFILE = 'PROFILE',
  CONVERSATION = 'CONVERSATION'
}

export interface Language {
  id: string;
  name: string;
  region: string;
  greeting: string; // e.g., "Akwaaba"
  colors: string[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: number;
  locked: boolean;
  category: 'vocabulary' | 'grammar' | 'conversation';
}

export interface UserProgress {
  streak: number;
  xp: number;
  lessonsCompleted: number;
  selectedLanguage: string | null;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface CulturalFact {
  title: string;
  content: string;
  category: 'Proverb' | 'History' | 'Food';
}