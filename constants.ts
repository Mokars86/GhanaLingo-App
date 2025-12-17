import { Language, Lesson } from './types';

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
];

export const MOCK_LESSONS: Lesson[] = [
  { id: '1', title: 'Alphabet & Sounds', description: 'Master the unique sounds.', level: 1, locked: false, category: 'vocabulary' },
  { id: '2', title: 'Basic Greetings', description: 'Say hello like a local.', level: 1, locked: false, category: 'conversation' },
  { id: '3', title: 'Market Day', description: 'Buying food and bargaining.', level: 2, locked: true, category: 'conversation' },
  { id: '4', title: 'Family & Respect', description: 'Addressing elders correctly.', level: 2, locked: true, category: 'grammar' },
  { id: '5', title: 'Numbers & Money', description: 'Counting cedis and pesewas.', level: 3, locked: true, category: 'vocabulary' },
];

export const ONBOARDING_SLIDES = [
  { title: 'Welcome to GhanaLingo', text: 'Master Twi, Ga, Ewe & Dagbani with ease.', image: 'https://picsum.photos/400/300?random=1' },
  { title: 'Learn from Culture', text: 'Immerse yourself in proverbs, food, and history.', image: 'https://picsum.photos/400/300?random=2' },
  { title: 'Speak with Confidence', text: 'Real-time pronunciation practice with AI.', image: 'https://picsum.photos/400/300?random=3' },
];