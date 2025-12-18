
import { Language, Lesson, PlanType } from './types';

export const KENTE_PATTERN_CSS = `repeating-linear-gradient(
  90deg,
  #006B3F 0px,
  #006B3F 10px,
  #FCD116 10px,
  #FCD116 20px,
  #CE1126 20px,
  #CE1126 30px,
  #000000 30px,
  #000000 35px
)`;

export const LANGUAGES: Language[] = [
  { id: 'twi', name: 'Twi', region: 'Ashanti', greeting: 'Akwaaba', colors: ['#006B3F', '#FCD116'] },
  { id: 'ga', name: 'Ga', region: 'Greater Accra', greeting: 'Miiŋa bo', colors: ['#CE1126', '#000000'] },
  { id: 'ewe', name: 'Ewe', region: 'Volta', greeting: 'Woezɔ', colors: ['#006B3F', '#CE1126'] },
  { id: 'dagbani', name: 'Dagbani', region: 'Northern', greeting: 'Antere', colors: ['#006B3F', '#FCD116'] },
  { id: 'fante', name: 'Fante', region: 'Central', greeting: 'Akwaaba', colors: ['#FCD116', '#000000'] },
  { id: 'dangme', name: 'Dangme', region: 'Greater Accra', greeting: 'Ha', colors: ['#CE1126', '#006B3F'] },
  { id: 'dagaare', name: 'Dagaare', region: 'Upper West', greeting: 'Fo be yɛ', colors: ['#000000', '#FCD116'] },
  { id: 'nzema', name: 'Nzema', region: 'Western', greeting: 'Aekye', colors: ['#006B3F', '#CE1126'] },
  { id: 'gonja', name: 'Gonja', region: 'Savannah', greeting: 'Anshuma', colors: ['#CE1126', '#FCD116'] },
  { id: 'kasem', name: 'Kasem', region: 'Upper East', greeting: 'De-n pare', colors: ['#000000', '#CE1126'] },
];

export const MOCK_LESSONS: Lesson[] = [
  { id: '1', title: 'Alphabet & Sounds', description: 'Master the unique sounds.', level: 1, locked: false, category: 'vocabulary', requiredPlan: PlanType.BASIC },
  { id: '2', title: 'Basic Greetings', description: 'Say hello like a local.', level: 1, locked: false, category: 'conversation', requiredPlan: PlanType.BASIC },
  { id: '3', title: 'Market Day', description: 'Buying food and bargaining.', level: 2, locked: true, category: 'conversation', requiredPlan: PlanType.INTERMEDIATE },
  { id: '4', title: 'Family & Respect', description: 'Addressing elders correctly.', level: 2, locked: true, category: 'grammar', requiredPlan: PlanType.INTERMEDIATE },
  { id: '5', title: 'Numbers & Money', description: 'Counting cedis and pesewas.', level: 3, locked: true, category: 'vocabulary', requiredPlan: PlanType.EXPERT },
];

export const ONBOARDING_SLIDES = [
  { title: 'Welcome to GhanaLingo', text: 'Master 10+ Ghanaian languages with ease.', image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&q=80&w=400' },
  { title: 'Learn from Culture', text: 'Immerse yourself in proverbs, food, and history.', image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=400' },
  { title: 'Speak with Confidence', text: 'Real-time pronunciation practice with AI.', image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=400' },
];
