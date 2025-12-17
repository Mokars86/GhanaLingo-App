import React, { useState, useEffect } from 'react';
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
  Key
} from 'lucide-react';
import { ScreenName, UserProgress, Lesson, Language } from './types';
import { LANGUAGES, MOCK_LESSONS, ONBOARDING_SLIDES, KENTE_PATTERN_CSS } from './constants';
import { Button, Card, KenteStrip, NavIcon, Input } from './components/UIComponents';
import { generateQuizQuestion, generateCulturalFact } from './services/geminiService';

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
         {/* Simple Logo Placeholder */}
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
    <div className="h-full flex flex-col bg-ghana-clay">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <img 
          src={ONBOARDING_SLIDES[step].image} 
          alt="Illustration" 
          className="w-64 h-64 object-cover rounded-3xl shadow-xl mb-8 border-4 border-white rotate-1"
        />
        <h2 className="text-2xl font-bold text-ghana-black mb-3">{ONBOARDING_SLIDES[step].title}</h2>
        <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">{ONBOARDING_SLIDES[step].text}</p>
        
        <div className="flex gap-2 mt-8">
          {ONBOARDING_SLIDES.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all ${i === step ? 'w-8 bg-ghana-green' : 'w-2 bg-gray-300'}`} />
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

const AuthScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="h-full bg-ghana-clay p-6 flex flex-col justify-center overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-ghana-gold rounded-full flex items-center justify-center mb-4 shadow-lg border-4 border-white animate-pulse">
                 <Globe2 size={40} className="text-ghana-black" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{isLogin ? 'Welcome Back!' : 'Join GhanaLingo'}</h2>
            <p className="text-gray-500">{isLogin ? 'Login to continue learning.' : 'Start your journey today.'}</p>
        </div>

        {/* Form */}
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
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-sm font-medium">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <Button variant="outline" onClick={onComplete} className="w-full relative border-gray-300 text-gray-700 bg-white hover:bg-gray-50">
               <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 absolute left-6" alt="G" />
               Continue with Google
            </Button>
            
            <Button variant="ghost" onClick={onComplete} className="w-full text-gray-500 hover:text-ghana-green">
                Continue as Guest
            </Button>
        </div>

        <div className="mt-8 text-center">
            <p className="text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                    onClick={() => setIsLogin(!isLogin)} 
                    className="font-bold text-ghana-green hover:underline ml-1"
                >
                    {isLogin ? 'Sign Up' : 'Log In'}
                </button>
            </p>
        </div>
    </div>
  );
};

const LanguageSelectionScreen: React.FC<{ onSelect: (langId: string) => void }> = ({ onSelect }) => {
  return (
    <div className="h-full bg-ghana-clay p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold text-center mb-2 mt-8">Choose a Language</h2>
      <p className="text-center text-gray-500 mb-8">Which language do you want to learn?</p>
      
      <div className="grid grid-cols-1 gap-4">
        {LANGUAGES.map((lang) => (
          <Card key={lang.id} onClick={() => onSelect(lang.id)} className="hover:bg-white active:scale-95 transition-transform">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-sm" style={{ backgroundColor: lang.colors[0] }}>
                  {lang.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">{lang.name}</h3>
                  <p className="text-sm text-gray-500">{lang.region} Region</p>
                </div>
                <ChevronRight className="text-gray-300" />
             </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const HomeScreen: React.FC<{ 
  user: UserProgress; 
  onNavigate: (screen: ScreenName) => void;
  language: Language | undefined; 
}> = ({ user, onNavigate, language }) => {
  return (
    <div className="h-full bg-ghana-clay overflow-y-auto pb-24">
      <div className="bg-ghana-green text-white p-6 pb-12 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
           <Globe2 size={100} />
        </div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">🇬🇭</div>
            <span className="font-bold tracking-wide">{language?.name.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
            <span className="text-ghana-gold">🔥</span>
            <span className="font-bold">{user.streak}</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-1">{language?.greeting || 'Hello'}, Learner! 👋</h1>
        <p className="text-green-100 opacity-90">Ready to learn some {language?.name}?</p>
      </div>

      <div className="px-6 -mt-8">
        <Card className="mb-6 border-t-4 border-t-ghana-gold">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-700">Daily Goal</h3>
            <span className="text-ghana-green font-bold text-sm">20 / 50 XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-ghana-green h-3 rounded-full transition-all duration-1000" style={{ width: '40%' }}></div>
          </div>
        </Card>

        <div className="flex gap-4 mb-6">
           <Button variant="secondary" className="flex-1 py-4 text-sm" onClick={() => onNavigate(ScreenName.LESSONS)}>
              <BookOpen size={20} /> Lessons
           </Button>
           <Button variant="outline" className="flex-1 py-4 text-sm border-ghana-gold text-yellow-700 bg-yellow-50" onClick={() => onNavigate(ScreenName.QUIZ)}>
              <Trophy size={20} /> Practice
           </Button>
        </div>

        <h3 className="font-bold text-xl mb-4 text-gray-800">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
            <Card onClick={() => onNavigate(ScreenName.QUIZ)} className="flex flex-col items-center justify-center p-6 gap-2 bg-green-50 border-green-200">
               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-ghana-green">
                 <Mic size={24} />
               </div>
               <span className="font-bold text-gray-700">Speak</span>
            </Card>
            <Card onClick={() => onNavigate(ScreenName.CULTURE)} className="flex flex-col items-center justify-center p-6 gap-2 bg-yellow-50 border-yellow-200">
               <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700">
                 <Globe2 size={24} />
               </div>
               <span className="font-bold text-gray-700">Culture</span>
            </Card>
        </div>
      </div>
    </div>
  );
};

const LessonsScreen: React.FC<{ onSelectLesson: (lesson: Lesson) => void }> = ({ onSelectLesson }) => {
  return (
    <div className="h-full bg-ghana-clay p-6 pb-24 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Learning Path</h2>
      <div className="space-y-4 relative">
        {/* Simple path line visual */}
        <div className="absolute left-8 top-4 bottom-4 w-1 bg-gray-300 -z-10 border-l-2 border-dashed border-gray-400"></div>

        {MOCK_LESSONS.map((lesson, idx) => (
          <div key={lesson.id} className="flex items-center gap-4">
             <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 z-10 ${lesson.locked ? 'bg-gray-200 border-gray-300 text-gray-400' : 'bg-ghana-green border-green-600 text-white shadow-lg'}`}>
                {lesson.locked ? <Lock size={24} /> : (idx === 0 ? <Play fill="white" size={24} className="ml-1" /> : <CheckCircle size={24} />)}
             </div>
             <Card 
               onClick={() => !lesson.locked && onSelectLesson(lesson)} 
               className={`flex-1 transition-all ${lesson.locked ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
             >
                <h4 className="font-bold text-lg">{lesson.title}</h4>
                <p className="text-xs text-gray-500">{lesson.description}</p>
             </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

const LessonDetailScreen: React.FC<{ lesson: Lesson | null; onBack: () => void }> = ({ lesson, onBack }) => {
    // Mocking lesson content for demo
    const [progress, setProgress] = useState(0);
    const word = { native: "Akwaaba", english: "Welcome" };

    if (!lesson) return null;

    return (
        <div className="h-full bg-ghana-clay flex flex-col">
            <div className="p-4 flex items-center gap-4 border-b border-gray-200 bg-white">
                <Button variant="ghost" onClick={onBack} className="p-2 px-2"><ChevronRight className="rotate-180" /></Button>
                <div className="flex-1 bg-gray-200 h-3 rounded-full">
                    <div className="bg-ghana-green h-full rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                 <h2 className="text-gray-500 font-bold mb-8 uppercase tracking-widest text-sm">New Word</h2>
                 
                 <div className="mb-12 relative group cursor-pointer" onClick={() => {
                     // Simulate audio play
                     const audio = new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&q=${word.native}&tl=en&client=tw-ob`); // Fallback trick, ideally use proper TTS
                     // audio.play().catch(()=>console.log("Audio simulation"));
                     setProgress(prev => Math.min(prev + 25, 100));
                 }}>
                    <div className="w-48 h-48 bg-white rounded-3xl shadow-xl flex items-center justify-center border-b-8 border-ghana-green active:border-b-0 active:translate-y-2 transition-all">
                        <Volume2 size={64} className="text-ghana-green" />
                    </div>
                    <div className="mt-8">
                        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">{word.native}</h1>
                        <p className="text-xl text-gray-500">{word.english}</p>
                    </div>
                 </div>

                 <p className="text-gray-600 italic bg-white p-4 rounded-xl shadow-sm">
                    "Mama said <span className="font-bold text-ghana-green">{word.native}</span> to the visitors."
                 </p>
            </div>

            <div className="p-6 border-t border-gray-200 bg-white">
                <Button className="w-full text-lg" onClick={() => setProgress(prev => Math.min(prev + 25, 100))}>Continue</Button>
            </div>
        </div>
    );
};

const QuizScreen: React.FC<{ language: string; onBack: () => void }> = ({ language, onBack }) => {
    const [loading, setLoading] = useState(true);
    const [question, setQuestion] = useState<any>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchQ = async () => {
            setLoading(true);
            const q = await generateQuizQuestion('Greetings', language);
            setQuestion(q);
            setLoading(false);
        };
        fetchQ();
    }, [language]);

    const handleAnswer = (option: string) => {
        if (selectedOption) return;
        setSelectedOption(option);
        setIsCorrect(option === question.correctAnswer);
    };

    if (loading) return (
        <div className="h-full flex flex-col items-center justify-center bg-ghana-clay gap-4">
             <div className="w-12 h-12 border-4 border-ghana-green border-t-transparent rounded-full animate-spin"></div>
             <p className="font-bold text-ghana-green animate-pulse">Consulting the Elders...</p>
        </div>
    );

    return (
        <div className="h-full bg-ghana-clay flex flex-col pb-24">
             <div className="p-4 bg-white shadow-sm flex items-center">
                 <Button variant="ghost" onClick={onBack} className="p-2 px-2 mr-2"><ChevronRight className="rotate-180" /></Button>
                 <span className="font-bold text-lg">Daily Quiz</span>
             </div>

             <div className="flex-1 p-6 overflow-y-auto">
                 <h2 className="text-2xl font-bold text-center mt-4 mb-8 text-gray-800">{question.question}</h2>
                 
                 <div className="space-y-4">
                     {question.options.map((option: string, idx: number) => {
                         let cardStyle = "border-gray-200 bg-white";
                         if (selectedOption === option) {
                             cardStyle = isCorrect && option === question.correctAnswer 
                                ? "bg-green-100 border-green-500 ring-2 ring-green-500" 
                                : "bg-red-100 border-red-500 ring-2 ring-red-500";
                         } else if (selectedOption && option === question.correctAnswer) {
                             cardStyle = "bg-green-100 border-green-500";
                         }

                         return (
                            <Card 
                                key={idx} 
                                onClick={() => handleAnswer(option)}
                                className={`transition-all p-5 ${cardStyle}`}
                            >
                                <span className="font-bold text-lg text-gray-700">{option}</span>
                            </Card>
                         )
                     })}
                 </div>

                 {selectedOption && (
                     <div className={`mt-8 p-4 rounded-xl ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} animate-fade-in-up`}>
                         <div className="flex items-center gap-2 mb-2">
                             {isCorrect ? <CheckCircle size={24} /> : <XCircle size={24} />}
                             <span className="font-bold text-lg">{isCorrect ? 'Correct!' : 'Incorrect'}</span>
                         </div>
                         <p>{question.explanation}</p>
                     </div>
                 )}
             </div>
             
             {selectedOption && (
                 <div className="p-6 bg-white border-t border-gray-200">
                     <Button className="w-full" onClick={() => {
                         setLoading(true);
                         generateQuizQuestion('Numbers', language).then(q => {
                             setQuestion(q);
                             setSelectedOption(null);
                             setIsCorrect(null);
                             setLoading(false);
                         });
                     }}>
                         Next Question
                     </Button>
                 </div>
             )}
        </div>
    );
};

const CultureScreen: React.FC<{ language: string }> = ({ language }) => {
    const [fact, setFact] = useState<any>(null);

    useEffect(() => {
        generateCulturalFact(language).then(setFact);
    }, [language]);

    return (
        <div className="h-full bg-stone-100 p-6 pb-24 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-stone-800">Cultural Wisdom</h2>
            
            <Card className="bg-[#FAF3E0] border-stone-300 mb-6">
                 <div className="flex items-center gap-2 mb-4 text-stone-500 uppercase text-xs font-bold tracking-widest">
                    <BookOpen size={16} />
                    <span>Proverb of the Day</span>
                 </div>
                 <h3 className="text-xl font-bold italic font-serif text-stone-800 mb-2">
                    "Ti koro nko agyina."
                 </h3>
                 <p className="text-stone-600">"One head does not hold a council." (Wisdom is found in numbers).</p>
            </Card>

            {fact && (
                 <Card className="bg-white border-stone-200">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-ghana-gold text-xs font-bold rounded-full text-black">{fact.category}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{fact.title}</h3>
                    <p className="leading-relaxed text-gray-700">{fact.content}</p>
                 </Card>
            )}

            <div className="mt-8">
                <Button variant="outline" className="w-full border-stone-400 text-stone-600" onClick={() => generateCulturalFact(language).then(setFact)}>
                    Discover Another Fact
                </Button>
            </div>
        </div>
    );
};

const ProfileScreen: React.FC<{ user: UserProgress; onLogout: () => void }> = ({ user, onLogout }) => {
    return (
        <div className="h-full bg-ghana-clay p-6 pb-24 overflow-y-auto">
            <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 bg-ghana-green rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg border-4 border-white">
                    J
                </div>
                <h2 className="text-2xl font-bold">John Doe</h2>
                <p className="text-gray-500">Level 3 Learner</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <Card className="flex flex-col items-center p-4">
                    <span className="text-3xl font-bold text-ghana-green mb-1">{user.streak}</span>
                    <span className="text-xs text-gray-500 uppercase font-bold">Day Streak</span>
                </Card>
                <Card className="flex flex-col items-center p-4">
                    <span className="text-3xl font-bold text-ghana-gold mb-1">{user.xp}</span>
                    <span className="text-xs text-gray-500 uppercase font-bold">Total XP</span>
                </Card>
            </div>

            <h3 className="font-bold text-gray-700 mb-4">Settings</h3>
            <div className="space-y-3">
                 <Card className="flex items-center justify-between p-4 py-3">
                     <div className="flex items-center gap-3">
                        <Globe2 size={20} className="text-gray-500" />
                        <span>Change Language</span>
                     </div>
                     <ChevronRight size={16} className="text-gray-400" />
                 </Card>
                 <Card className="flex items-center justify-between p-4 py-3" onClick={onLogout}>
                     <div className="flex items-center gap-3 text-red-600">
                        <LogOut size={20} />
                        <span>Log Out</span>
                     </div>
                 </Card>
            </div>
        </div>
    );
};


// --- Main Layout & Logic ---

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>(ScreenName.SPLASH);
  const [selectedLanguageId, setSelectedLanguageId] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [user, setUser] = useState<UserProgress>({
      streak: 5,
      xp: 350,
      lessonsCompleted: 12,
      selectedLanguage: null
  });

  const selectedLanguage = LANGUAGES.find(l => l.id === selectedLanguageId);

  const handleLanguageSelect = (id: string) => {
      setSelectedLanguageId(id);
      setUser({ ...user, selectedLanguage: id });
      setCurrentScreen(ScreenName.HOME);
  };

  const handleLogout = () => {
      setSelectedLanguageId(null);
      setCurrentScreen(ScreenName.AUTH); // Simplified flow, go back to auth/onboarding
  };

  // Render content based on screen state
  const renderContent = () => {
      switch (currentScreen) {
          case ScreenName.SPLASH:
              return <SplashScreen onFinish={() => setCurrentScreen(ScreenName.ONBOARDING)} />;
          case ScreenName.ONBOARDING:
              return <OnboardingScreen onComplete={() => setCurrentScreen(ScreenName.AUTH)} />;
          case ScreenName.AUTH:
              return <AuthScreen onComplete={() => setCurrentScreen(ScreenName.LANGUAGE_SELECT)} />;
          case ScreenName.LANGUAGE_SELECT:
              return <LanguageSelectionScreen onSelect={handleLanguageSelect} />;
          case ScreenName.HOME:
              return <HomeScreen user={user} language={selectedLanguage} onNavigate={setCurrentScreen} />;
          case ScreenName.LESSONS:
              return <LessonsScreen onSelectLesson={(l) => { setSelectedLesson(l); setCurrentScreen(ScreenName.LESSON_DETAIL); }} />;
          case ScreenName.LESSON_DETAIL:
              return <LessonDetailScreen lesson={selectedLesson} onBack={() => setCurrentScreen(ScreenName.LESSONS)} />;
          case ScreenName.QUIZ:
              return <QuizScreen language={selectedLanguage?.name || 'Twi'} onBack={() => setCurrentScreen(ScreenName.HOME)} />;
          case ScreenName.CULTURE:
              return <CultureScreen language={selectedLanguage?.name || 'Twi'} />;
          case ScreenName.PROFILE:
              return <ProfileScreen user={user} onLogout={handleLogout} />;
          default:
              return <div className="p-10">Screen not implemented</div>;
      }
  };

  // Show bottom nav only on main tab screens
  const showNav = [ScreenName.HOME, ScreenName.LESSONS, ScreenName.CULTURE, ScreenName.PROFILE].includes(currentScreen);

  return (
    <div className="h-full w-full max-w-md mx-auto bg-ghana-clay shadow-2xl overflow-hidden flex flex-col relative font-sans">
      {/* Kente Top Border for styling */}
      <KenteStrip />
      
      <div className="flex-1 overflow-hidden relative">
          {renderContent()}
      </div>

      {showNav && (
        <div className="bg-white border-t border-gray-200 h-20 flex justify-around items-center px-2 absolute bottom-0 w-full z-50 rounded-t-2xl shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
            <NavIcon 
                icon={Home} 
                label="Home" 
                isActive={currentScreen === ScreenName.HOME} 
                onClick={() => setCurrentScreen(ScreenName.HOME)} 
            />
            <NavIcon 
                icon={BookOpen} 
                label="Lessons" 
                isActive={currentScreen === ScreenName.LESSONS} 
                onClick={() => setCurrentScreen(ScreenName.LESSONS)} 
            />
            <NavIcon 
                icon={Globe2} 
                label="Culture" 
                isActive={currentScreen === ScreenName.CULTURE} 
                onClick={() => setCurrentScreen(ScreenName.CULTURE)} 
            />
             <NavIcon 
                icon={User} 
                label="Profile" 
                isActive={currentScreen === ScreenName.PROFILE} 
                onClick={() => setCurrentScreen(ScreenName.PROFILE)} 
            />
        </div>
      )}
    </div>
  );
};

export default App;