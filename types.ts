
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
  CONVERSATION = 'CONVERSATION',
  SUBSCRIPTION = 'SUBSCRIPTION',
  HISTORY = 'HISTORY',
  CONSTITUTION = 'CONSTITUTION',
  LANDMARKS = 'LANDMARKS',
  CUISINE = 'CUISINE',
  LEADERS = 'LEADERS'
}

export enum PlanType {
  BASIC = 'BASIC',
  INTERMEDIATE = 'INTERMEDIATE',
  EXPERT = 'EXPERT'
}

export type Nationality = 'Ghanaian' | 'Foreigner';

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
  requiredPlan: PlanType;
}

export interface UserProgress {
  streak: number;
  xp: number;
  lessonsCompleted: number;
  selectedLanguage: string | null;
  plan: PlanType;
  nationality: Nationality;
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
  category: 'Proverb' | 'History' | 'Food' | 'Landmark';
  mapUrl?: string;
  recipe?: string[];
  detailedContent?: string;
}

export interface GhanaLeader {
  name: string;
  title: string;
  period: string;
  achievement: string;
  era: 'Pre-Colonial' | 'Colonial' | 'First Republic' | 'Military' | 'Fourth Republic';
}
