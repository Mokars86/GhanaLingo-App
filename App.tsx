
import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Home, 
  User, 
  Globe2, 
  Trophy, 
  ChevronRight, 
  Volume2, 
  Mic, 
  Play,
  Lock,
  CheckCircle,
  XCircle,
  MessageCircle,
  LogOut,
  Mail,
  Key,
  RotateCcw,
  Sparkles,
  StopCircle,
  MapPin,
  Utensils,
  History as HistoryIcon,
  ExternalLink,
  Crown,
  CreditCard,
  ShieldCheck,
  Zap,
  Moon,
  Sun,
  Settings,
  Shield,
  Bell,
  Scale,
  Library as LibraryIcon,
  Search,
  BookMarked,
  ArrowLeft,
  Info,
  Users
} from 'lucide-react';
import { ScreenName, UserProgress, Lesson, Language, CulturalFact, PlanType, Nationality, GhanaLeader } from './types';
import { LANGUAGES, MOCK_LESSONS, ONBOARDING_SLIDES, KENTE_PATTERN_CSS } from './constants';
import { Button, Card, KenteStrip, NavIcon, Input } from './components/UIComponents';
import { generateQuizQuestion, generateCulturalFact, analyzePronunciation, PronunciationFeedback, generateLandmark, explainConstitutionArticle, generateCuisineInfo } from './services/geminiService';

// --- Educational Data ---

const GHANA_HISTORY = [
  { 
    year: "1100s", 
    title: "Ancient Empires", 
    text: "The migration of the Akan people into what is now modern Ghana.",
    detailedContent: "The history of Ghana begins long before European contact. Between the 11th and 15th centuries, various ethnic groups including the Akan, Ga-Adangbe, and Ewe migrated into the region. The Bonoman Empire (11th Century) is often cited as the earliest established Akan state. These societies developed complex political structures based on chieftaincy and thrived on trade in gold, salt, and kola nuts."
  },
  { 
    year: "1482", 
    title: "European Contact", 
    text: "The Portuguese arrive at Elmina and build the first European castle.",
    detailedContent: "In 1482, Portuguese explorers led by Diogo de Azambuja arrived at a coastal village they called 'El Mina' (The Mine). They constructed Elmina Castle, the first substantial European building in Sub-Saharan Africa. Initially intended for gold trade, the castle later became a major dungeon for the Trans-Atlantic Slave Trade. Other European powers like the Dutch, British, and Danes soon followed, building over 30 forts along the coast."
  },
  { 
    year: "1701", 
    title: "Rise of Ashanti", 
    text: "The Ashanti Empire is formed under Osei Tutu I, becoming a dominant power.",
    detailedContent: "The Ashanti Empire was unified by King Osei Tutu I and his chief priest, Okomfo Anokye, who famously called down the 'Golden Stool' from the heavens. The empire became a military and economic powerhouse, controlling much of modern-day Ghana and parts of Ivory Coast. They successfully resisted British colonial expansion for nearly a century in the Anglo-Ashanti Wars."
  },
  { 
    year: "1901", 
    title: "British Colony", 
    text: "The Gold Coast is officially declared a British colony.",
    detailedContent: "After the defeat of the Ashanti in the War of the Golden Stool (led by the brave Yaa Asantewaa), the British officially annexed the interior. The territory was named the 'Gold Coast' and the Northern Territories were added as a protectorate. This era saw the introduction of cocoa as a cash crop and the establishment of Western education, which eventually birthed the nationalist movement."
  },
  { 
    year: "1957", 
    title: "Independence", 
    text: "Ghana becomes the first sub-Saharan African nation to gain independence.",
    detailedContent: "On March 6, 1957, led by Dr. Kwame Nkrumah and the Convention People's Party (CPP), Ghana became independent from British rule. Nkrumah famously declared, 'Our independence is meaningless unless it is linked up with the total liberation of the African continent.' This event inspired independence movements across the entire continent."
  },
  { 
    year: "1960", 
    title: "First Republic", 
    text: "Ghana officially becomes a republic with Nkrumah as president.",
    detailedContent: "In 1960, Ghana transitioned from a constitutional monarchy (with the Queen as head of state) to a full Republic. Dr. Kwame Nkrumah became the first President. His government focused on rapid industrialization (Akosombo Dam) and Pan-Africanism. However, political tensions led to a one-party state and his eventual overthrow in 1966."
  },
  { 
    year: "1992", 
    title: "Fourth Republic", 
    text: "The current democratic era begins with a new constitution.",
    detailedContent: "After decades of alternating military and civilian rule, a new constitution was approved in 1992. Flight Lieutenant Jerry John Rawlings, who had come to power through a coup in 1981, transitioned to civilian rule and won the first elections of the Fourth Republic. Since then, Ghana has seen multiple peaceful transfers of power between its major political parties (NDC and NPP), solidifying its reputation as a beacon of democracy in Africa."
  },
];

const GHANA_LEADERS: GhanaLeader[] = [
  { name: "Nana Osei Tutu I", title: "Asantehene (King)", period: "1701–1717", achievement: "Unified the Ashanti states and founded the Ashanti Empire.", era: "Pre-Colonial" },
  { name: "Sir Gordon Guggisberg", title: "Governor", period: "1919–1927", achievement: "Built Korle-Bu Hospital and Achimota School.", era: "Colonial" },
  { name: "Dr. Kwame Nkrumah", title: "President", period: "1957–1966", achievement: "Led Ghana to independence; founding father of Pan-Africanism.", era: "First Republic" },
  { name: "Edward Akufo-Addo", title: "President", period: "1970–1972", achievement: "Ceremonial President during the Second Republic.", era: "First Republic" },
  { name: "Gen. I.K. Acheampong", title: "Head of State", period: "1972–1978", achievement: "Introduced 'Operation Feed Yourself' and switched to the Metric system.", era: "Military" },
  { name: "Jerry John Rawlings", title: "President", period: "1993–2001", achievement: "Established the Fourth Republic and restored democracy.", era: "Fourth Republic" },
  { name: "John Agyekum Kufuor", title: "President", period: "2001–2009", achievement: "Introduced the National Health Insurance Scheme (NHIS).", era: "Fourth Republic" },
  { name: "John Evans Atta Mills", title: "President", period: "2009–2012", achievement: "Managed high economic growth and maintained peace.", era: "Fourth Republic" },
  { name: "John Dramani Mahama", title: "President", period: "2012–2017", achievement: "Expanded infrastructure across the country.", era: "Fourth Republic" },
  { name: "Nana Akufo-Addo", title: "President", period: "2017–Present", achievement: "Introduced Free Senior High School (SHS) education.", era: "Fourth Republic" },
];

const CONSTITUTION_CHAPTERS = [
  { id: "1", title: "The Constitution", summary: "The supreme law of Ghana and its enforcement." },
  { id: "5", title: "Fundamental Human Rights", summary: "Protection of right to life, liberty, and dignity." },
  { id: "6", title: "Directive Principles of State Policy", summary: "Guiding principles for the government's objectives." },
  { id: "8", title: "The Executive", summary: "Roles of the President, Cabinet, and Council of State." },
  { id: "10", title: "The Legislature", summary: "Functioning of Parliament and lawmaking." },
  { id: "11", title: "The Judiciary", summary: "Administration of justice and the courts." },
];

// --- Screens Components ---

const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-ghana-green text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/cubes.png')` }}></div>
      <div className="z-10 flex flex-col items-center animate-bounce">
        <div className="w-24 h-24 bg-ghana-gold rounded-full flex items-center justify-center mb-6 shadow-xl border-4 border-white">
          <Globe2 size={48} className="text-ghana-black" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">GhanaLingo</h1>
        <p className="text-lg text-green-100 font-medium">Learn with Pride.</p>
      </div>
      <div className="absolute bottom-0 w-full">
         <KenteStrip className="h-4" />
      </div>
    </div>
  );
};

const OnboardingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  return (
    <div className="h-full flex flex-col bg-ghana-clay dark:bg-[#121212] transition-theme">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <img 
          src={ONBOARDING_SLIDES[step].image} 
          alt="Illustration" 
          className="w-64 h-64 object-cover rounded-3xl shadow-xl mb-8 border-4 border-white dark:border-gray-800 rotate-1"
        />
        <h2 className="text-2xl font-bold text-ghana-black dark:text-white mb-3">{ONBOARDING_SLIDES[step].title}</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">{ONBOARDING_SLIDES[step].text}</p>
        
        <div className="flex gap-2 mt-8">
          {ONBOARDING_SLIDES.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all ${i === step ? 'w-8 bg-ghana-green' : 'w-2 bg-gray-300 dark:bg-gray-700'}`} />
          ))}
        </div>
      </div>
      
      <div className="p-6 pb-10">
        <Button 
          className="w-full" 
          onClick={() => {
            if (step < ONBOARDING_SLIDES.length - 1) setStep(step + 1);
            else onComplete();
          }}
        >
          {step === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

const AuthScreen: React.FC<{ onComplete: () => void; onBack: () => void }> = ({ onComplete, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="h-full bg-ghana-clay dark:bg-[#121212] p-6 flex flex-col transition-theme">
        <div className="pt-4 mb-4">
           <Button variant="ghost" onClick={onBack} className="p-2 -ml-2 text-gray-500 dark:text-gray-400">
              <ArrowLeft size={24} />
           </Button>
        </div>
        <div className="flex-1 flex flex-col justify-center overflow-y-auto">
            <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 bg-ghana-gold rounded-full flex items-center justify-center mb-4 shadow-lg border-4 border-white dark:border-gray-800 animate-pulse">
                     <Globe2 size={40} className="text-ghana-black" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{isLogin ? 'Welcome Back!' : 'Join GhanaLingo'}</h2>
                <p className="text-gray-500 dark:text-gray-400">{isLogin ? 'Login to continue learning.' : 'Start your journey today.'}</p>
            </div>

            <div className="space-y-4 mb-6">
                {!isLogin && (
                    <div className="relative">
                       <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
                       <Input placeholder="Full Name" className="pl-12" />
                    </div>
                )}
                <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                    <Input placeholder="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} className="pl-12" />
                </div>
                <div className="relative">
                    <Key className="absolute left-4 top-3.5 text-gray-400" size={20} />
                    <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="pl-12" />
                </div>
            </div>

            <div className="space-y-3">
                <Button onClick={onComplete} className="w-full">
                    {isLogin ? 'Log In' : 'Sign Up'}
                </Button>
                
                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-sm font-medium">OR</span>
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                </div>

                <Button variant="outline" onClick={onComplete} className="w-full relative border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800">
                   <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 absolute left-6" alt="G" />
                   Continue with Google
                </Button>
            </div>

            <div className="mt-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-ghana-green dark:text-green-400 hover:underline ml-1">
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
    </div>
  );
};

const LanguageSelectionScreen: React.FC<{ onSelect: (id: string) => void; onBack?: () => void }> = ({ onSelect, onBack }) => {
  return (
    <div className="h-full bg-ghana-clay dark:bg-[#121212] flex flex-col transition-theme">
      <div className="p-8 bg-ghana-soil text-white rounded-b-3xl shadow-lg relative">
        {onBack && (
           <Button variant="ghost" onClick={onBack} className="absolute left-4 top-4 text-white p-2">
              <ArrowLeft size={24} />
           </Button>
        )}
        <div className={onBack ? "mt-8" : ""}>
          <h2 className="text-3xl font-black mb-1">Pick a Tongue</h2>
          <p className="opacity-80">Which Ghanaian language would you like to master today?</p>
        </div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {LANGUAGES.map(lang => (
          <Card key={lang.id} onClick={() => onSelect(lang.id)} className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-xl" style={{ backgroundColor: lang.colors[0] }}>
                {lang.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">{lang.name}</h3>
                <p className="text-sm text-gray-500">{lang.region} Region • "{lang.greeting}"</p>
              </div>
            </div>
            <ChevronRight className="text-gray-300" />
          </Card>
        ))}
      </div>
    </div>
  );
};

const HistoryScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedEvent, setSelectedEvent] = useState<typeof GHANA_HISTORY[0] | null>(null);

  if (selectedEvent) {
    return (
      <div className="h-full bg-ghana-clay dark:bg-[#121212] flex flex-col transition-theme">
        <div className="p-6 bg-ghana-soil text-white flex items-center gap-4">
          <Button variant="ghost" onClick={() => setSelectedEvent(null)} className="text-white p-2 h-auto w-auto -ml-2"><ArrowLeft size={24} /></Button>
          <h2 className="text-2xl font-black">{selectedEvent.year}</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6 animate-fade-in-up">
           <h3 className="text-3xl font-black mb-6 text-ghana-soil dark:text-ghana-gold leading-tight">{selectedEvent.title}</h3>
           <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">{selectedEvent.detailedContent}</p>
           </div>
           <div className="mt-12 p-6 bg-ghana-soil/5 rounded-3xl border border-ghana-soil/20">
              <h4 className="font-black text-xs uppercase tracking-widest text-ghana-soil mb-2">Study Note</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Understanding this era is key to knowing the resilient spirit of the Ghanaian people.</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-ghana-clay dark:bg-[#121212] flex flex-col transition-theme">
      <div className="p-6 bg-ghana-soil text-white flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="text-white p-2 h-auto w-auto -ml-2"><ArrowLeft size={24} /></Button>
        <h2 className="text-2xl font-black">History Timeline</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-8 relative">
        <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-ghana-gold/30 -z-10" />
        {GHANA_HISTORY.map((item, idx) => (
          <div 
            key={idx} 
            onClick={() => setSelectedEvent(item)}
            className="flex gap-4 animate-fade-in-up group cursor-pointer" 
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="w-6 h-6 rounded-full bg-ghana-gold border-4 border-white dark:border-[#1E1E1E] shadow-sm z-10 mt-1 transition-transform group-hover:scale-125" />
            <div className="flex-1 bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl shadow-sm border-b-2 border-transparent group-hover:border-ghana-gold transition-all">
                <span className="text-[10px] font-black uppercase text-ghana-soil dark:text-ghana-gold tracking-widest">{item.year}</span>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">{item.title}</h3>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-ghana-gold transition-colors" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LeadersScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeEra, setActiveEra] = useState<GhanaLeader['era'] | 'All'>('All');
  
  const filteredLeaders = activeEra === 'All' 
    ? GHANA_LEADERS 
    : GHANA_LEADERS.filter(l => l.era === activeEra);

  const eras: (GhanaLeader['era'] | 'All')[] = ['All', 'Pre-Colonial', 'Colonial', 'First Republic', 'Military', 'Fourth Republic'];

  return (
    <div className="h-full bg-ghana-clay dark:bg-[#121212] flex flex-col transition-theme">
      <div className="p-6 bg-ghana-soil text-white flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="text-white p-2 h-auto w-auto -ml-2"><ArrowLeft size={24} /></Button>
        <h2 className="text-2xl font-black">Ghanaian Leaders</h2>
      </div>
      
      <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar">
        {eras.map(era => (
          <button 
            key={era} 
            onClick={() => setActiveEra(era)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-xs font-bold border-2 transition-all ${activeEra === era ? 'bg-ghana-soil border-ghana-soil text-white' : 'bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-gray-800 text-gray-500'}`}
          >
            {era}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {filteredLeaders.map((leader, idx) => (
          <Card key={idx} className="flex flex-col gap-1 p-5 animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-ghana-soil dark:text-ghana-gold tracking-widest">{leader.period}</span>
              <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-500">{leader.era}</span>
            </div>
            <h3 className="text-lg font-black text-gray-800 dark:text-white">{leader.name}</h3>
            <p className="text-xs font-bold text-ghana-green mb-2">{leader.title}</p>
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
               <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{leader.achievement}"</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const LandmarkScreen: React.FC<{ language: string; onBack: () => void }> = ({ language, onBack }) => {
  const [landmark, setLandmark] = useState<CulturalFact | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLandmark = async () => {
    setLoading(true);
    const data = await generateLandmark(language);
    setLandmark(data);
    setLoading(false);
  };

  useEffect(() => { fetchLandmark(); }, [language]);

  return (
    <div className="h-full bg-ghana-clay dark:bg-[#121212] flex flex-col transition-theme">
      <div className="p-6 bg-ghana-green text-white flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="text-white p-2 h-auto w-auto -ml-2"><ArrowLeft size={24} /></Button>
        <h2 className="text-2xl font-black">Landmarks</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-10 h-10 border-4 border-ghana-green border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-bold animate-pulse">Touring the region...</p>
          </div>
        ) : landmark && (
          <div className="animate-fade-in-up space-y-6">
            <Card className="p-0 overflow-hidden">
               <div className="h-48 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  <MapPin size={64} className="text-gray-400 opacity-20" />
               </div>
               <div className="p-6">
                  <h3 className="text-2xl font-black mb-2">{landmark.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{landmark.content}</p>
                  {landmark.mapUrl && (
                    <Button onClick={() => window.open(landmark.mapUrl, '_blank')} variant="secondary" className="w-full">
                       <ExternalLink size={20} /> View on Maps
                    </Button>
                  )}
               </div>
            </Card>
            <Button onClick={fetchLandmark} variant="outline" className="w-full">Explore Another</Button>
          </div>
        )}
      </div>
    </div>
  );
};

const CuisineScreen: React.FC<{ language: string; onBack: () => void }> = ({ language, onBack }) => {
  const [dish, setDish] = useState<CulturalFact | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDish = async () => {
    setLoading(true);
    const data = await generateCuisineInfo(language);
    setDish(data);
    setLoading(false);
  };

  useEffect(() => { fetchDish(); }, [language]);

  return (
    <div className="h-full bg-ghana-clay dark:bg-[#121212] flex flex-col transition-theme">
      <div className="p-6 bg-ghana-soil text-white flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="text-white p-2 h-auto w-auto -ml-2"><ArrowLeft size={24} /></Button>
        <h2 className="text-2xl font-black">Ghanaian Cuisine</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-10 h-10 border-4 border-ghana-soil border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-bold animate-pulse">Cooking something delicious...</p>
          </div>
        ) : dish && (
          <div className="animate-fade-in-up space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-14 h-14 bg-ghana-soil/10 rounded-2xl flex items-center justify-center text-ghana-soil"><Utensils size={28} /></div>
                 <h3 className="text-2xl font-black">{dish.title}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{dish.content}</p>
              {dish.recipe && (
                <div>
                   <h4 className="font-black uppercase text-xs tracking-widest text-gray-400 mb-3">Main Ingredients</h4>
                   <div className="flex flex-wrap gap-2">
                      {dish.recipe.map((ing, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold">{ing}</span>
                      ))}
                   </div>
                </div>
              )}
            </Card>
            <Button onClick={fetchDish} variant="outline" className="w-full">Discover More Food</Button>
          </div>
        )}
      </div>
    </div>
  );
};

const ConstitutionScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedChapter, setSelectedChapter] = useState<typeof CONSTITUTION_CHAPTERS[0] | null>(null);
  const [articleNum, setArticleNum] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    if (!articleNum) return;
    setLoading(true);
    const exp = await explainConstitutionArticle(selectedChapter?.id || 'General', articleNum);
    setExplanation(exp);
    setLoading(false);
  };

  if (selectedChapter) {
    return (
      <div className="h-full bg-ghana-clay dark:bg-[#121212] flex flex-col transition-theme">
        <div className="p-6 bg-ghana-green text-white flex items-center justify-between">
           <div className="flex items-center gap-4">
             <Button variant="ghost" onClick={() => {setSelectedChapter(null); setExplanation('');}} className="text-white p-2 h-auto w-auto -ml-2"><ArrowLeft size={24} /></Button>
             <div>
                <h3 className="font-bold">Chapter {selectedChapter.id}</h3>
                <p className="text-xs opacity-80">{selectedChapter.title}</p>
             </div>
           </div>
           <Scale size={24} className="opacity-30" />
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
           <Card className="mb-6 p-6">
              <p className="text-gray-600 dark:text-gray-400 italic mb-4">"{selectedChapter.summary}"</p>
              <div className="flex gap-2">
                 <Input 
                  placeholder="Article No." 
                  type="number" 
                  value={articleNum} 
                  onChange={(e) => setArticleNum(e.target.value)} 
                  className="w-32"
                />
                 <Button onClick={handleExplain} className="flex-1">Analyze</Button>
              </div>
           </Card>

           {loading && <div className="py-12 flex flex-col items-center gap-4"><div className="w-8 h-8 border-4 border-ghana-green border-t-transparent rounded-full animate-spin"></div><p className="text-sm font-bold animate-pulse text-ghana-green">Parsing Law...</p></div>}
           
           {explanation && !loading && (
             <div className="animate-fade-in-up">
                <h4 className="text-xs font-black uppercase text-gray-500 tracking-widest mb-3 px-2">AI Interpretation</h4>
                <Card className="bg-white/50 border-ghana-green border-l-4">
                   <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{explanation}</p>
                </Card>
             </div>
           )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-ghana-clay dark:bg-[#121212] flex flex-col transition-theme">
      <div className="p-6 bg-ghana-green text-white flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="text-white p-2 h-auto w-auto -ml-2"><ArrowLeft size={24} /></Button>
        <h2 className="text-2xl font-black">Ghana Constitution</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
         {CONSTITUTION_CHAPTERS.map(ch => (
           <Card key={ch.id} onClick={() => setSelectedChapter(ch)} className="flex items-center justify-between p-6">
              <div>
                <h4 className="font-black text-ghana-green dark:text-green-400">Chapter {ch.id}</h4>
                <p className="font-bold text-gray-800 dark:text-white">{ch.title}</p>
              </div>
              <ChevronRight className="text-gray-300" />
           </Card>
         ))}
      </div>
    </div>
  );
};

const LessonsScreen: React.FC<{ 
  user: UserProgress; 
  onSelectLesson: (l: Lesson) => void; 
  onUpgradePrompt: () => void 
}> = ({ user, onSelectLesson, onUpgradePrompt }) => {
  return (
    <div className="h-full bg-ghana-clay dark:bg-[#121212] flex flex-col transition-theme">
      <div className="p-6 bg-ghana-green text-white">
        <h2 className="text-2xl font-black">Learning Path</h2>
        <p className="text-xs opacity-80 mt-1">Master your chosen language step by step.</p>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24">
        {MOCK_LESSONS.map((lesson, idx) => {
          const isLevelLocked = idx > user.lessonsCompleted;
          const isPlanLocked = (lesson.requiredPlan === PlanType.INTERMEDIATE && user.plan === PlanType.BASIC) ||
                             (lesson.requiredPlan === PlanType.EXPERT && user.plan !== PlanType.EXPERT);
          const isLocked = isLevelLocked || isPlanLocked;

          return (
            <Card 
              key={lesson.id} 
              onClick={() => isLocked ? (isPlanLocked ? onUpgradePrompt() : null) : onSelectLesson(lesson)}
              className={`flex items-center gap-4 p-5 ${isLocked ? 'opacity-60 grayscale-[0.5]' : ''}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${isLocked ? 'bg-gray-200 text-gray-500' : 'bg-ghana-green/10 text-ghana-green'}`}>
                {isLocked ? <Lock size={20} /> : idx + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                   <h4 className="font-bold text-gray-800 dark:text-white">{lesson.title}</h4>
                   {lesson.requiredPlan !== PlanType.BASIC && (
                     <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md bg-ghana-gold text-ghana-black">
                       {lesson.requiredPlan}
                     </span>
                   )}
                </div>
                <p className="text-xs text-gray-500">{lesson.description}</p>
              </div>
              {!isLocked && <ChevronRight className="text-gray-300" />}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const SubscriptionScreen: React.FC<{ 
  user: UserProgress; 
  onUpgrade: (plan: PlanType, nationality: Nationality) => void; 
  onBack: () => void 
}> = ({ user, onUpgrade, onBack }) => {
  const [nationality, setNationality] = useState<Nationality>(user.nationality);
  
  const plans = [
    { type: PlanType.BASIC, priceLocal: "Free", priceForeign: "Free", features: ["100+ Basic phrases", "History modules", "Landmark maps"] },
    { type: PlanType.INTERMEDIATE, priceLocal: "GH₵ 20/mo", priceForeign: "$5/mo", features: ["Conversational lessons", "Quiz modes", "AI Pronunciation"] },
    { type: PlanType.EXPERT, priceLocal: "GH₵ 50/mo", priceForeign: "$12/mo", features: ["Full fluency path", "Direct support", "Certificate of completion"] },
  ];

  return (
    <div className="h-full bg-ghana-clay dark:bg-[#121212] flex flex-col transition-theme">
      <div className="p-6 bg-ghana-soil text-white flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="text-white p-2 h-auto w-auto -ml-2"><ArrowLeft size={24} /></Button>
        <h2 className="text-2xl font-black">Choose Your Plan</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
           <button onClick={() => setNationality('Ghanaian')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${nationality === 'Ghanaian' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>Ghanaian</button>
           <button onClick={() => setNationality('Foreigner')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${nationality === 'Foreigner' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>Foreigner</button>
        </div>

        {plans.map((p) => (
          <Card key={p.type} className={`relative border-2 ${user.plan === p.type ? 'border-ghana-green' : 'border-transparent'}`}>
            {user.plan === p.type && (
              <div className="absolute top-4 right-4 text-ghana-green"><CheckCircle size={20} /></div>
            )}
            <h3 className="text-xl font-black mb-1">{p.type}</h3>
            <p className="text-2xl font-bold text-ghana-green mb-4">
               {nationality === 'Ghanaian' ? p.priceLocal : p.priceForeign}
            </p>
            <ul className="space-y-2 mb-6">
               {p.features.map((f, i) => (
                 <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <ShieldCheck size={16} className="text-ghana-gold" /> {f}
                 </li>
               ))}
            </ul>
            <Button 
              className="w-full" 
              variant={user.plan === p.type ? 'outline' : 'primary'}
              disabled={user.plan === p.type}
              onClick={() => onUpgrade(p.type, nationality)}
            >
              {user.plan === p.type ? 'Current Plan' : 'Select Plan'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

const LessonDetailScreen: React.FC<{ 
  lesson: Lesson | null; 
  onBack: () => void; 
  onFinish: () => void 
}> = ({ lesson, onBack, onFinish }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<PronunciationFeedback | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  if (!lesson) return null;

  const handlePractice = async () => {
    setIsRecording(true);
    setTimeout(async () => {
      setIsRecording(false);
      setAnalyzing(true);
      const result = await analyzePronunciation("Akwaaba", "dummy-base64", "audio/webm");
      setFeedback(result);
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="h-full bg-ghana-clay dark:bg-[#121212] flex flex-col transition-theme">
      <div className="p-6 bg-ghana-green text-white flex items-center justify-between">
         <Button variant="ghost" onClick={onBack} className="text-white p-2 h-auto w-auto -ml-2"><ArrowLeft size={24} /></Button>
         <h3 className="font-bold">{lesson.title}</h3>
         <div className="w-8" />
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
         <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest">Master the Sound</h4>
            <Card className="bg-ghana-soil text-white p-8 text-center flex flex-col items-center gap-4">
               <span className="text-4xl font-black">Akwaaba</span>
               <p className="text-sm opacity-80 italic">Pronunciation: /a-kwa-ba/</p>
               <Button variant="secondary" className="rounded-full w-12 h-12 p-0"><Volume2 size={24} /></Button>
            </Card>
         </div>
         <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest">Your Turn</h4>
            <Card className="flex flex-col items-center justify-center p-8 gap-6">
               <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 animate-pulse text-white' : 'bg-ghana-green/10 text-ghana-green'}`}>
                  {isRecording ? <StopCircle size={40} /> : <Mic size={40} />}
               </div>
               {analyzing ? (
                 <p className="text-sm font-bold animate-pulse">AI is listening...</p>
               ) : (
                 <Button onClick={handlePractice} disabled={isRecording} variant={isRecording ? 'outline' : 'primary'}>
                   {isRecording ? 'Listening...' : 'Record Pronunciation'}
                 </Button>
               )}
               {feedback && !analyzing && (
                 <div className="w-full pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                       <span className="text-2xl font-black text-ghana-green">{feedback.score}%</span>
                       {feedback.isExcellent && <Trophy size={18} className="text-ghana-gold" />}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{feedback.feedback}</p>
                 </div>
               )}
            </Card>
         </div>
         <Button className="w-full" onClick={onFinish}>Complete Lesson</Button>
      </div>
    </div>
  );
};

const QuizScreen: React.FC<{ 
  language: string; 
  onBack: () => void 
}> = ({ language, onBack }) => {
  const [question, setQuestion] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchQuestion = async () => {
    setLoading(true);
    setQuestion(await generateQuizQuestion("General", language));
    setSelectedOption(null);
    setShowExplanation(false);
    setLoading(false);
  };

  useEffect(() => { fetchQuestion(); }, [language]);

  const handleOptionSelect = (opt: string) => {
    if (showExplanation) return;
    setSelectedOption(opt);
    setShowExplanation(true);
  };

  return (
    <div className="h-full bg-ghana-clay dark:bg-[#121212] flex flex-col transition-theme">
      <div className="p-6 bg-ghana-gold text-ghana-black flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="text-ghana-black p-2 h-auto w-auto -ml-2"><ArrowLeft size={24} /></Button>
        <h2 className="text-2xl font-black">Challenge Mode</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
             <div className="w-10 h-10 border-4 border-ghana-gold border-t-transparent rounded-full animate-spin"></div>
             <p className="text-sm font-bold animate-pulse">Brainstorming...</p>
          </div>
        ) : question && (
          <div className="animate-fade-in-up space-y-6">
            <h3 className="text-xl font-bold leading-tight">{question.question}</h3>
            <div className="space-y-3">
              {question.options.map((opt: string) => {
                const isCorrect = opt === question.correctAnswer;
                const isSelected = opt === selectedOption;
                let borderClass = "border-gray-200 dark:border-gray-800";
                let bgClass = "bg-white dark:bg-[#1E1E1E]";
                if (showExplanation) {
                  if (isCorrect) {
                    borderClass = "border-ghana-green";
                    bgClass = "bg-green-50 dark:bg-green-900/10";
                  } else if (isSelected) {
                    borderClass = "border-red-500";
                    bgClass = "bg-red-50 dark:bg-red-900/10";
                  }
                }
                return (
                  <Card 
                    key={opt} 
                    onClick={() => handleOptionSelect(opt)}
                    className={`p-5 flex items-center justify-between transition-all ${borderClass} ${bgClass}`}
                  >
                    <span className={`font-bold ${showExplanation && isCorrect ? 'text-ghana-green' : 'text-gray-700 dark:text-gray-300'}`}>{opt}</span>
                    {showExplanation && (
                      isCorrect ? <CheckCircle className="text-ghana-green" size={20} /> : 
                      isSelected ? <XCircle className="text-red-500" size={20} /> : null
                    )}
                  </Card>
                );
              })}
            </div>
            {showExplanation && (
              <div className="animate-fade-in-up p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                 <h4 className="font-black text-xs uppercase text-gray-500 mb-1">Explanation</h4>
                 <p className="text-sm text-gray-700 dark:text-gray-300">{question.explanation}</p>
                 <Button onClick={fetchQuestion} className="w-full mt-6">Next Question</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const HomeScreen: React.FC<{ user: UserProgress; language: Language | undefined; onNavigate: (screen: ScreenName) => void }> = ({ user, language, onNavigate }) => {
  return (
    <div className="h-full bg-ghana-clay dark:bg-[#121212] overflow-y-auto pb-24 transition-theme">
      <div className="p-8 bg-ghana-green text-white rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Globe2 size={120} />
        </div>
        <div className="relative z-10">
          <p className="text-green-100 font-bold uppercase tracking-widest text-xs mb-2">{language?.greeting || 'Hello'}!</p>
          <h2 className="text-3xl font-black mb-6">Let's learn {language?.name || 'some Twi'}.</h2>
          <div className="flex gap-4">
            <div className="flex-1 bg-white/20 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center"><Trophy size={20} /></div>
              <div>
                <p className="text-[10px] uppercase font-black opacity-70">Points</p>
                <p className="font-bold">{user.xp} XP</p>
              </div>
            </div>
            <div className="flex-1 bg-white/20 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center"><Zap size={20} className="text-ghana-gold fill-ghana-gold" /></div>
              <div>
                <p className="text-[10px] uppercase font-black opacity-70">Streak</p>
                <p className="font-bold">{user.streak} Days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-xs font-black uppercase text-gray-500 dark:text-gray-400 tracking-widest mb-4">Daily Challenge</h3>
          <Card bg="bg-ghana-soil text-white" onClick={() => onNavigate(ScreenName.QUIZ)} className="border-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><Sparkles size={24} /></div>
                <div>
                  <h4 className="font-bold text-lg">Quick Quiz</h4>
                  <p className="text-xs opacity-80">Earn +20 XP with a quick test</p>
                </div>
              </div>
              <ChevronRight />
            </div>
          </Card>
        </div>
        <div>
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black uppercase text-gray-500 dark:text-gray-400 tracking-widest">Learning Path</h3>
              <button onClick={() => onNavigate(ScreenName.LESSONS)} className="text-ghana-green text-xs font-bold hover:underline">View All</button>
           </div>
           <Card onClick={() => onNavigate(ScreenName.LESSONS)} className="p-0 overflow-hidden">
             <div className="p-4 flex items-center gap-4">
                <div className="w-14 h-14 bg-ghana-green/10 text-ghana-green rounded-2xl flex items-center justify-center font-black text-xl">{user.lessonsCompleted + 1}</div>
                <div className="flex-1">
                   <h4 className="font-bold text-gray-800 dark:text-white">Current Lesson</h4>
                   <p className="text-sm text-gray-500">{MOCK_LESSONS[user.lessonsCompleted]?.title || "Keep it up!"}</p>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-ghana-green/20 flex items-center justify-center">
                   <Play size={20} className="text-ghana-green fill-ghana-green ml-1" />
                </div>
             </div>
             <div className="bg-gray-100 dark:bg-gray-800 h-1.5 w-full">
                <div className="bg-ghana-green h-full w-[30%]" />
             </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

const CultureScreen: React.FC<{ language: string; onNavigate: (screen: ScreenName) => void }> = ({ language, onNavigate }) => {
    const [fact, setFact] = useState<CulturalFact | null>(null);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState<'Discover' | 'Library'>('Discover');

    const fetchContent = async () => {
        setLoading(true);
        setFact(await generateCulturalFact(language, 'All'));
        setLoading(false);
    };

    useEffect(() => { if (category === 'Discover') fetchContent(); }, [language, category]);

    return (
        <div className="h-full bg-ghana-clay dark:bg-[#121212] flex flex-col transition-theme">
            <div className="p-6 bg-ghana-green text-white rounded-b-3xl shadow-lg">
                <h2 className="text-2xl font-bold">Heritage & Law</h2>
                <div className="flex mt-4 bg-white/10 p-1 rounded-xl">
                    <button onClick={() => setCategory('Discover')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${category === 'Discover' ? 'bg-white text-ghana-green' : ''}`}>Discover</button>
                    <button onClick={() => setCategory('Library')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${category === 'Library' ? 'bg-white text-ghana-green' : ''}`}>Education</button>
                </div>
            </div>

            <div className="flex-1 px-6 overflow-y-auto pb-24 pt-6">
                {category === 'Discover' ? (
                  <>
                    {loading ? <div className="py-20 flex justify-center"><div className="w-8 h-8 border-4 border-ghana-green border-t-transparent rounded-full animate-spin"></div></div> : fact && (
                        <Card className="animate-fade-in-up">
                            <span className="text-[10px] font-black uppercase tracking-widest text-ghana-soil dark:text-ghana-gold mb-2 block">{fact.category}</span>
                            <h3 className="text-xl font-bold mb-3">{fact.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{fact.content}</p>
                            <Button variant="outline" className="w-full text-xs" onClick={fetchContent}><RotateCcw size={14} /> Refresh Wisdom</Button>
                        </Card>
                    )}
                  </>
                ) : (
                  <div className="space-y-6 animate-fade-in-up">
                    <h3 className="text-xs font-black uppercase text-gray-500 tracking-widest px-2">Education Hub</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Card onClick={() => onNavigate(ScreenName.HISTORY)} className="flex flex-col items-center justify-center p-6 gap-3 bg-ghana-soil/5">
                        <HistoryIcon size={32} className="text-ghana-soil" />
                        <span className="font-bold text-sm">History</span>
                      </Card>
                      <Card onClick={() => onNavigate(ScreenName.LEADERS)} className="flex flex-col items-center justify-center p-6 gap-3 bg-ghana-gold/5">
                        <Users size={32} className="text-ghana-soil" />
                        <span className="font-bold text-sm">Leaders</span>
                      </Card>
                      <Card onClick={() => onNavigate(ScreenName.CONSTITUTION)} className="flex flex-col items-center justify-center p-6 gap-3 bg-ghana-green/5">
                        <Scale size={32} className="text-ghana-green" />
                        <span className="font-bold text-sm">Constitution</span>
                      </Card>
                      <Card onClick={() => onNavigate(ScreenName.LANDMARKS)} className="flex flex-col items-center justify-center p-6 gap-3 bg-blue-500/5">
                        <MapPin size={32} className="text-blue-500" />
                        <span className="font-bold text-sm">Landmarks</span>
                      </Card>
                    </div>
                    <Card onClick={() => onNavigate(ScreenName.CUISINE)} className="flex items-center gap-4 p-5 bg-orange-500/5">
                        <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500"><Utensils size={24} /></div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm">Ghanaian Cuisine</h4>
                          <p className="text-[10px] text-gray-500 mt-1">Explore recipes and traditional food history.</p>
                        </div>
                        <ChevronRight size={18} className="text-gray-300" />
                    </Card>
                  </div>
                )}
            </div>
        </div>
    );
};

const ProfileScreen: React.FC<{ user: UserProgress; onLogout: () => void; isDarkMode: boolean; toggleDarkMode: () => void; onNavigate: (screen: ScreenName) => void }> = ({ user, onLogout, isDarkMode, toggleDarkMode, onNavigate }) => {
  const language = LANGUAGES.find(l => l.id === user.selectedLanguage);
  return (
    <div className="h-full bg-ghana-clay dark:bg-[#121212] overflow-y-auto pb-24 transition-theme">
      <div className="p-8 pb-12 bg-white dark:bg-[#1E1E1E] rounded-b-[3rem] shadow-lg border-b-4 border-gray-200 dark:border-gray-800 flex flex-col items-center">
          <div className="relative mb-4"><div className="w-28 h-28 bg-ghana-green dark:bg-green-700 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-2xl border-4 border-white dark:border-gray-800">{language?.name.charAt(0) || 'L'}</div><div className="absolute bottom-1 right-1 w-8 h-8 bg-ghana-gold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-lg"><Crown size={16} className="text-ghana-black" /></div></div>
          <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-1">Proud Learner</h2>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full"><Globe2 size={14} /> {language?.name || 'Student'}</div>
      </div>
      <div className="px-6 -mt-8">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="flex flex-col items-center justify-center p-6 gap-2"><span className="text-3xl font-black text-ghana-green dark:text-green-400">{user.streak}</span><span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Streak 🔥</span></Card>
          <Card className="flex flex-col items-center justify-center p-6 gap-2"><span className="text-3xl font-black text-ghana-gold">{user.xp}</span><span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Total XP 🏆</span></Card>
        </div>
        <div className="space-y-3">
          <Card className="p-0 overflow-hidden">
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer" onClick={toggleDarkMode}>
              <div className="flex items-center gap-3"><div className={`p-2 rounded-lg ${isDarkMode ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'}`}>{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</div><div><p className="font-bold text-gray-800 dark:text-white">Dark Mode</p></div></div>
              <div className={`w-12 h-6 rounded-full relative transition-colors ${isDarkMode ? 'bg-ghana-green' : 'bg-gray-300'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'right-1' : 'left-1'}`} /></div>
            </div>
            <hr className="border-gray-100 dark:border-gray-800 mx-4" />
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer" onClick={() => onNavigate(ScreenName.LANGUAGE_SELECT)}>
              <div className="flex items-center gap-3"><div className="p-2 bg-purple-500/20 text-purple-500 rounded-lg"><Settings size={20} /></div><div><p className="font-bold text-gray-800 dark:text-white">Change Language</p></div></div><ChevronRight size={18} className="text-gray-400" />
            </div>
            <hr className="border-gray-100 dark:border-gray-800 mx-4" />
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer" onClick={() => onNavigate(ScreenName.SUBSCRIPTION)}>
              <div className="flex items-center gap-3"><div className="p-2 bg-yellow-500/20 text-yellow-700 rounded-lg"><Crown size={20} /></div><div><p className="font-bold text-gray-800 dark:text-white">Upgrade Plan</p></div></div><ChevronRight size={18} className="text-gray-400" />
            </div>
          </Card>
          <Button variant="ghost" className="w-full text-red-500" onClick={onLogout}><LogOut size={20} /> Log Out</Button>
        </div>
      </div>
    </div>
  );
};

// --- Main App Logic ---

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>(ScreenName.SPLASH);
  const [selectedLanguageId, setSelectedLanguageId] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [user, setUser] = useState<UserProgress>({
      streak: 5,
      xp: 350,
      lessonsCompleted: 0,
      selectedLanguage: null,
      plan: PlanType.BASIC,
      nationality: 'Ghanaian'
  });

  const selectedLanguage = LANGUAGES.find(l => l.id === selectedLanguageId);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const handleLanguageSelect = (id: string) => { 
    setSelectedLanguageId(id); 
    setUser(prev => ({ ...prev, selectedLanguage: id })); 
    setCurrentScreen(ScreenName.HOME); 
  };
  
  const handleUpgrade = (plan: PlanType, nationality: Nationality) => { 
    setUser(prev => ({ ...prev, plan, nationality })); 
    setCurrentScreen(ScreenName.LESSONS); 
  };
  
  const handleLogout = () => { 
    setSelectedLanguageId(null); 
    setCurrentScreen(ScreenName.AUTH); 
  };

  const handleFinishLesson = () => {
    if (!selectedLesson) return;
    const lessonIndex = MOCK_LESSONS.findIndex(l => l.id === selectedLesson.id);
    setUser(prev => ({ ...prev, lessonsCompleted: Math.max(prev.lessonsCompleted, lessonIndex + 1), xp: prev.xp + 50 }));
    setSelectedLesson(null);
    setCurrentScreen(ScreenName.LESSONS);
  };

  const renderContent = () => {
      switch (currentScreen) {
          case ScreenName.SPLASH: return <SplashScreen onFinish={() => setCurrentScreen(ScreenName.ONBOARDING)} />;
          case ScreenName.ONBOARDING: return <OnboardingScreen onComplete={() => setCurrentScreen(ScreenName.AUTH)} />;
          case ScreenName.AUTH: return <AuthScreen onComplete={() => setCurrentScreen(ScreenName.LANGUAGE_SELECT)} onBack={() => setCurrentScreen(ScreenName.ONBOARDING)} />;
          case ScreenName.LANGUAGE_SELECT: return <LanguageSelectionScreen onSelect={handleLanguageSelect} onBack={user.selectedLanguage ? () => setCurrentScreen(ScreenName.PROFILE) : undefined} />;
          case ScreenName.HOME: return <HomeScreen user={user} language={selectedLanguage} onNavigate={setCurrentScreen} />;
          case ScreenName.LESSONS: return <LessonsScreen user={user} onSelectLesson={(l) => { setSelectedLesson(l); setCurrentScreen(ScreenName.LESSON_DETAIL); }} onUpgradePrompt={() => setCurrentScreen(ScreenName.SUBSCRIPTION)} />;
          case ScreenName.SUBSCRIPTION: return <SubscriptionScreen user={user} onUpgrade={handleUpgrade} onBack={() => setCurrentScreen(ScreenName.LESSONS)} />;
          case ScreenName.LESSON_DETAIL: return <LessonDetailScreen lesson={selectedLesson} onBack={() => setCurrentScreen(ScreenName.LESSONS)} onFinish={handleFinishLesson} />;
          case ScreenName.QUIZ: return <QuizScreen language={selectedLanguage?.name || 'Twi'} onBack={() => setCurrentScreen(ScreenName.HOME)} />;
          case ScreenName.CULTURE: return <CultureScreen language={selectedLanguage?.name || 'Twi'} onNavigate={setCurrentScreen} />;
          case ScreenName.HISTORY: return <HistoryScreen onBack={() => setCurrentScreen(ScreenName.CULTURE)} />;
          case ScreenName.LEADERS: return <LeadersScreen onBack={() => setCurrentScreen(ScreenName.CULTURE)} />;
          case ScreenName.LANDMARKS: return <LandmarkScreen language={selectedLanguage?.name || 'Twi'} onBack={() => setCurrentScreen(ScreenName.CULTURE)} />;
          case ScreenName.CUISINE: return <CuisineScreen language={selectedLanguage?.name || 'Twi'} onBack={() => setCurrentScreen(ScreenName.CULTURE)} />;
          case ScreenName.CONSTITUTION: return <ConstitutionScreen onBack={() => setCurrentScreen(ScreenName.CULTURE)} />;
          case ScreenName.PROFILE: return <ProfileScreen user={user} onLogout={handleLogout} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} onNavigate={setCurrentScreen} />;
          default: return <div className="p-10">Implementation needed</div>;
      }
  };

  const showNav = [ScreenName.HOME, ScreenName.LESSONS, ScreenName.CULTURE, ScreenName.PROFILE].includes(currentScreen);

  return (
    <div className={`h-full w-full max-w-md mx-auto bg-ghana-clay dark:bg-[#121212] shadow-2xl overflow-hidden flex flex-col relative transition-theme`}>
      <KenteStrip />
      <div className="flex-1 overflow-hidden relative">
          {renderContent()}
      </div>
      {showNav && (
        <div className="bg-white dark:bg-[#1E1E1E] border-t border-gray-200 dark:border-gray-800 h-20 flex justify-around items-center px-2 absolute bottom-0 w-full z-50 rounded-t-2xl shadow-lg transition-theme">
            <NavIcon icon={Home} label="Home" isActive={currentScreen === ScreenName.HOME} onClick={() => setCurrentScreen(ScreenName.HOME)} />
            <NavIcon icon={BookOpen} label="Lessons" isActive={currentScreen === ScreenName.LESSONS} onClick={() => setCurrentScreen(ScreenName.LESSONS)} />
            <NavIcon icon={Globe2} label="Culture" isActive={[ScreenName.CULTURE, ScreenName.HISTORY, ScreenName.CONSTITUTION, ScreenName.LANDMARKS, ScreenName.CUISINE, ScreenName.LEADERS].includes(currentScreen)} onClick={() => setCurrentScreen(ScreenName.CULTURE)} />
            <NavIcon icon={User} label="Profile" isActive={currentScreen === ScreenName.PROFILE} onClick={() => setCurrentScreen(ScreenName.PROFILE)} />
        </div>
      )}
    </div>
  );
};

export default App;
