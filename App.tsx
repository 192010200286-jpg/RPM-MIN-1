import React, { useState, useEffect } from 'react';
import { Sparkles, Moon, Sun, MessageSquareText, Image as ImageIcon, FileText, Bot, X } from 'lucide-react';
import RPMForm from './components/RPMForm';
import RPMResult from './components/RPMResult';
import AIChatbot from './components/AIChatbot';
import AIImageStudio from './components/AIImageStudio';
import { generateRPM } from './services/geminiService';
import { buildCompleteRPMFromTemplate } from './services/rpmTemplateBuilder';
import { RPMFormData, RPMGeneratedContent } from './types';

// Define metadata locally to avoid JSON module resolution issues in some environments
const metadata = {
  theme: "Primary"
};

type AppTab = 'generator' | 'chat' | 'image';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('generator');
  const [formData, setFormData] = useState<RPMFormData | null>(null);
  const [result, setResult] = useState<RPMGeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);

  // Initialize theme from local storage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  const handleSubmit = async (data: RPMFormData) => {
    setIsLoading(true);
    setError(null);
    setFormData(data); // Save form data to pass to result view
    
    try {
      const generatedContent = await generateRPM(data);
      setResult(generatedContent);
    } catch (err: any) {
      console.warn("Generating RPM using verified Kemenag curriculum engine fallback:", err);
      try {
        const fallbackContent = buildCompleteRPMFromTemplate(data);
        setResult(fallbackContent);
      } catch (fallbackErr: any) {
        console.error("Critical fallback error:", fallbackErr);
        setError('Terjadi kendala saat menyusun RPM. Silakan periksa isian data Anda.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFormData(null);
    setError(null);
    setActiveTab('generator');
  };

  // Determine theme class based on metadata
  const themeClass = `theme-${metadata.theme}`;

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300 pb-20 ${themeClass}`}>
      {/* Header */}
      <header className="no-print bg-white dark:bg-slate-800 shadow-xs border-b dark:border-slate-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleReset}>
            <img 
              src="https://i.imghippo.com/files/nrnU9752iR.png" 
              alt="Logo Formal" 
              className="h-10 sm:h-12 w-auto" 
            />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
                Generator RPM
              </h1>
              <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-300 font-medium leading-tight">
                Perencanaan Pembelajaran Mendalam AI
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs for Desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-750 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('generator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'generator'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FileText size={15} />
              <span>Penyusun RPM</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'chat'
                  ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <MessageSquareText size={15} />
              <span>Asisten Chatbot AI</span>
            </button>

            <button
              onClick={() => setActiveTab('image')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'image'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <ImageIcon size={15} />
              <span>Studio Media Ajar</span>
            </button>
          </nav>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-yellow-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {result && activeTab === 'generator' && (
              <button 
                onClick={handleReset}
                className="text-xs sm:text-sm text-gray-600 dark:text-gray-200 hover:text-primary dark:hover:text-primary-hover font-medium px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Buat Baru
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-700/80 px-2 py-1.5 bg-slate-50 dark:bg-slate-850">
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
              activeTab === 'generator'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <FileText size={14} />
            <span>Penyusun</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
              activeTab === 'chat'
                ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <MessageSquareText size={14} />
            <span>Chat AI</span>
          </button>

          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
              activeTab === 'image'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <ImageIcon size={14} />
            <span>Media Ajar</span>
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6 rounded-xl shadow-xs">
            <p className="text-sm text-red-700 dark:text-red-300 font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Tab 1: Penyusun RPM */}
        {activeTab === 'generator' && (
          <div>
            {!result ? (
              <div className="space-y-6">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-emerald-600 to-green-500 dark:from-emerald-800 dark:to-green-900 text-white p-5 sm:p-6 rounded-2xl shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="flex items-start gap-4 relative z-10">
                    <Sparkles className="w-8 h-8 flex-shrink-0 mt-1 text-yellow-200" />
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold mb-1.5">
                        Selamat Datang, Bapak/Ibu Guru Hebat!
                      </h2>
                      <p className="opacity-95 leading-relaxed text-emerald-50 text-xs sm:text-sm font-medium">
                        Lengkapi formulir di bawah ini untuk menyusun Rencana Pembelajaran Mendalam (RPM) otomatis berbasis AI yang selaras dengan Kurikulum Merdeka, Dimensi Profil Lulusan, dan 5 Panca Cinta Kemenag.
                      </p>
                    </div>
                  </div>
                </div>

                <RPMForm onSubmit={handleSubmit} isLoading={isLoading} />
              </div>
            ) : (
              formData && <RPMResult formData={formData} generatedContent={result} />
            )}
          </div>
        )}

        {/* Tab 2: Konsultan & Asisten AI (Chatbot Gemini) */}
        {activeTab === 'chat' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <MessageSquareText size={22} className="text-teal-600 dark:text-teal-400" />
                  Konsultan Kurikulum & Asisten RPM
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Konsultasikan diferensiasi pembelajaran, instrumen asesmen, dan rancangan pedagogis secara multi-turn.
                </p>
              </div>
            </div>
            <AIChatbot currentFormData={formData} />
          </div>
        )}

        {/* Tab 3: Studio Media Ajar AI (Image Generation & Editing) */}
        {activeTab === 'image' && (
          <div>
            <AIImageStudio defaultSubject={formData?.subject} />
          </div>
        )}
      </main>

      {/* Floating AI Chatbot Widget Trigger Button (Available anywhere) */}
      {!isFloatingChatOpen && activeTab !== 'chat' && (
        <button
          onClick={() => setIsFloatingChatOpen(true)}
          className="no-print fixed bottom-6 right-6 z-40 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
          title="Buka Asisten AI"
          aria-label="Buka Asisten AI"
        >
          <Bot size={20} />
          <span className="hidden sm:inline text-xs font-bold tracking-wide">Tanya Asisten AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
        </button>
      )}

      {/* Floating AI Chatbot Drawer/Modal */}
      {isFloatingChatOpen && (
        <div className="no-print fixed bottom-4 right-4 z-50 w-[92vw] sm:w-[420px] shadow-2xl animate-in slide-in-from-bottom-6 duration-200">
          <AIChatbot 
            currentFormData={formData} 
            onClose={() => setIsFloatingChatOpen(false)}
            isCompact={true}
          />
        </div>
      )}

      {/* Footer */}
      <footer className="no-print text-center text-gray-400 dark:text-slate-400 text-xs sm:text-sm py-8 border-t dark:border-slate-800 mt-12">
        <p>© 2026 Generator RPM Berbasis AI. Dibuat oleh Eko Cahyono untuk MIN 1 Banyuwangi</p>
      </footer>
    </div>
  );
};

export default App;
