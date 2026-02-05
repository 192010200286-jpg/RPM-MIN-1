import React, { useState, useEffect } from 'react';
import { Sparkles, Moon, Sun } from 'lucide-react';
import RPMForm from './components/RPMForm';
import RPMResult from './components/RPMResult';
import { generateRPM } from './services/geminiService';
import { RPMFormData, RPMGeneratedContent } from './types';

const App: React.FC = () => {
  const [formData, setFormData] = useState<RPMFormData | null>(null);
  const [result, setResult] = useState<RPMGeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

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
      console.error(err);
      setError(err.message || 'Terjadi kesalahan saat membuat RPM. Pastikan API KEY valid.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFormData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleReset}>
            <img 
              src="https://i.imghippo.com/files/nrnU9752iR.png" 
              alt="Logo Formal" 
              className="h-12 w-auto" 
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Generator RPM</h1>
              <p className="text-xs text-gray-500 dark:text-gray-300 font-medium">Perencanaan Pembelajaran Mendalam AI</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-yellow-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {result && (
              <button 
                onClick={handleReset}
                className="text-sm text-gray-600 dark:text-gray-200 hover:text-primary dark:hover:text-teal-400 font-medium"
              >
                Buat Baru
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6 rounded shadow-sm">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Conditional Rendering */}
        {!result ? (
          <div className="space-y-6">
             <div className="bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-800 dark:to-emerald-900 text-white p-6 rounded-xl shadow-lg mb-8 relative overflow-hidden">
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div className="flex items-start gap-4 relative z-10">
                    <Sparkles className="w-8 h-8 flex-shrink-0 mt-1 text-yellow-300" />
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Selamat Datang, Bapak/Ibu Guru Hebat!</h2>
                        <p className="opacity-90 leading-relaxed text-teal-50">
                            Lengkapi formulir di bawah ini untuk membuat Rencana Pembelajaran Mendalam (RPM) yang terstruktur, kreatif, dan sesuai dengan kebutuhan siswa Anda secara otomatis menggunakan kecerdasan buatan.
                        </p>
                    </div>
                </div>
             </div>
            <RPMForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        ) : (
          formData && <RPMResult formData={formData} generatedContent={result} />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-400 dark:text-slate-400 text-sm py-8 border-t dark:border-slate-800 mt-12">
        <p>© 2026 Generator RPM Berbasis AI. Dibuat oleh Eko Cahyono untuk MIN 1 Banyuwangi</p>
      </footer>
    </div>
  );
};

export default App;