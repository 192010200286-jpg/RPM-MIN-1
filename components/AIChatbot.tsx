import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, User, Sparkles, Zap, Brain, MessageSquareText, 
  Copy, Check, Trash2, BookOpen, AlertCircle, Loader2, ArrowDown 
} from 'lucide-react';
import { ChatMessage, ChatTaskType, RPMFormData } from '../types';
import { chatWithGemini } from '../services/geminiService';

interface AIChatbotProps {
  currentFormData?: RPMFormData | null;
  onClose?: () => void;
  isCompact?: boolean;
}

const INITIAL_SUGGESTIONS = [
  {
    icon: Sparkles,
    label: "Aktivitas Pemantik",
    text: "Berikan 3 contoh aktivitas pemantik bermakna dan menggembirakan untuk memulai pembelajaran materi ini."
  },
  {
    icon: Brain,
    label: "Diferensiasi Pembelajaran",
    text: "Bagaimana cara melakukan diferensiasi proses dan konten untuk siswa dengan kesiapan belajar yang berbeda?"
  },
  {
    icon: Zap,
    label: "Integrasi Panca Cinta",
    text: "Bagaimana menanamkan nilai 5 Panca Cinta Kemenag ke dalam kegiatan inti pembelajaran ini secara konkret?"
  },
  {
    icon: BookOpen,
    label: "Rubrik Asesmen Autentik",
    text: "Buatkan draft rubrik asesmen unjuk kerja dengan kriteria capaian yang jelas untuk asesmen formatif."
  }
];

export const AIChatbot: React.FC<AIChatbotProps> = ({ 
  currentFormData, 
  onClose,
  isCompact = false 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'welcome-1',
        role: 'model',
        text: 'Halo Bapak/Ibu Guru Hebat! 👋 Saya **Asisten AI Kurikulum & RPM**. Ada yang bisa saya bantu diskusikan seputar modul ajar, strategi pembelajaran mendalam, asesmen autentik, atau integrasi profil lulusan?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        taskType: 'general'
      }
    ];
  });

  const [inputPrompt, setInputPrompt] = useState('');
  const [taskType, setTaskType] = useState<ChatTaskType>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [useFormContext, setUseFormContext] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Gagal menyalin teks", err);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus seluruh riwayat percakapan?")) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: 'model',
          text: 'Riwayat percakapan telah dibersihkan. Silakan ajukan pertanyaan atau konsultasi baru seputar RPM dan pembelajaran!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          taskType: 'general'
        }
      ]);
      setErrorMessage(null);
    }
  };

  const buildContextSummary = () => {
    if (!useFormContext || !currentFormData) return undefined;
    return `
- Sekolah: ${currentFormData.schoolName || 'Tidak disebutkan'}
- Mata Pelajaran: ${currentFormData.subject || 'Belum diisi'}
- Kelas / Fase: ${currentFormData.gradeClass || '-'} / ${currentFormData.fase || '-'}
- Materi Pokok: ${currentFormData.material || 'Belum diisi'}
- Capaian Pembelajaran: ${currentFormData.cp || '-'}
- Tujuan Pembelajaran: ${currentFormData.tp || '-'}
- Dimensi Profil Lulusan: ${currentFormData.dimensions.join(', ') || 'Belum dipilih'}
- Panca Cinta Kemenag: ${currentFormData.pancaCinta.join(', ') || 'Belum dipilih'}
    `.trim();
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend !== undefined ? textToSend : inputPrompt).trim();
    if (!messageText || isLoading) return;

    setErrorMessage(null);
    const userMessageId = `user-${Date.now()}`;
    const newTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      text: messageText,
      timestamp: newTimestamp,
      taskType
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInputPrompt('');

    setIsLoading(true);

    try {
      // Build conversation turns for the API
      const conversationHistory = updatedMessages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const contextSummary = buildContextSummary();
      const aiReplyText = await chatWithGemini(conversationHistory, taskType, contextSummary);

      const modelMessageId = `model-${Date.now()}`;
      const newModelMessage: ChatMessage = {
        id: modelMessageId,
        role: 'model',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        taskType
      };

      setMessages(prev => [...prev, newModelMessage]);
    } catch (err: any) {
      console.error("Error in chat:", err);
      setErrorMessage(err.message || 'Gagal memperoleh jawaban dari asisten AI.');
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Simple Markdown renderer for clean formatting
  const renderFormattedText = (content: string) => {
    // Process markdown headers, bold, bullet points
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Heading 3 / 2
      if (line.startsWith('### ') || line.startsWith('## ')) {
        const headingText = line.replace(/^#{2,3}\s/, '');
        return (
          <h4 key={idx} className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-2.5 mb-1">
            {headingText}
          </h4>
        );
      }

      // Bullet points
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemText = line.trim().replace(/^[-*]\s/, '');
        return (
          <li key={idx} className="ml-4 list-disc text-slate-700 dark:text-slate-200 text-xs sm:text-sm leading-relaxed my-0.5">
            {parseInlineStyles(itemText)}
          </li>
        );
      }

      // Numbered list items
      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <li key={idx} className="ml-4 list-decimal text-slate-700 dark:text-slate-200 text-xs sm:text-sm leading-relaxed my-0.5">
            {parseInlineStyles(line.trim().replace(/^\d+\.\s/, ''))}
          </li>
        );
      }

      // Empty line spacer
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }

      return (
        <p key={idx} className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm leading-relaxed my-0.5">
          {parseInlineStyles(line)}
        </p>
      );
    });
  };

  const parseInlineStyles = (text: string) => {
    // Basic bold parsing: **text**
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={`flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden ${isCompact ? 'h-[520px]' : 'h-[640px]'}`}>
      
      {/* Header bar */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 dark:from-emerald-800 dark:via-teal-900 dark:to-cyan-950 px-4 py-3 text-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5 leading-tight">
              Konsultan AI Kurikulum & RPM
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
            </h3>
            <p className="text-[11px] text-emerald-100 opacity-90 leading-tight">
              Multi-turn Assistant berbasis Gemini AI
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleClearHistory}
            title="Bersihkan Percakapan"
            className="p-1.5 text-emerald-100 hover:text-white hover:bg-white/15 rounded-lg transition-colors text-xs flex items-center gap-1"
          >
            <Trash2 size={15} />
            <span className="hidden sm:inline text-[11px]">Hapus</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-emerald-100 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Tutup Chat"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Model / Task Mode Selector & Context Bar */}
      <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        {/* Model mode tabs */}
        <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-slate-750 p-1 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setTaskType('fast')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
              taskType === 'fast'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="Model: gemini-3.1-flash-lite - Cepat untuk ide & tanya jawab ringkas"
          >
            <Zap size={13} className="text-amber-500" />
            <span>Cepat (Lite)</span>
          </button>

          <button
            type="button"
            onClick={() => setTaskType('general')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
              taskType === 'general'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="Model: gemini-3.5-flash - Ideal untuk konsultasi umum & langkah pembelajaran"
          >
            <Sparkles size={13} className="text-teal-500" />
            <span>Umum (Flash)</span>
          </button>

          <button
            type="button"
            onClick={() => setTaskType('complex')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
              taskType === 'complex'
                ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="Model: gemini-3.1-pro-preview - Analisis mendalam, diferensiasi & asesmen kompleks"
          >
            <Brain size={13} className="text-purple-500" />
            <span>Kompleks (Pro)</span>
          </button>
        </div>

        {/* Current form context indicator */}
        {currentFormData?.subject && (
          <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={useFormContext} 
              onChange={e => setUseFormContext(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5" 
            />
            <span className="truncate max-w-[170px]" title={`Materi: ${currentFormData.material || currentFormData.subject}`}>
              Konteks: {currentFormData.subject} ({currentFormData.gradeClass || 'Kelas'})
            </span>
          </label>
        )}
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-900/50 scroll-smooth">
        {messages.map((message) => {
          const isUser = message.role === 'user';

          return (
            <div
              key={message.id}
              className={`flex gap-2.5 items-start ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-xs ${
                  isUser 
                    ? 'bg-emerald-600 dark:bg-emerald-700' 
                    : 'bg-teal-600 dark:bg-teal-700'
                }`}
              >
                {isUser ? <User size={14} /> : <Bot size={14} />}
              </div>

              {/* Message Bubble */}
              <div
                className={`group relative max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-xs transition-all ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-xs'
                }`}
              >
                {/* Task mode badge for model responses */}
                {!isUser && message.taskType && (
                  <div className="flex items-center justify-between mb-1 pb-1 border-b border-slate-100 dark:border-slate-700/60 text-[10px] text-slate-400 dark:text-slate-400">
                    <span className="font-semibold flex items-center gap-1">
                      {message.taskType === 'complex' && <Brain size={11} className="text-purple-500" />}
                      {message.taskType === 'general' && <Sparkles size={11} className="text-teal-500" />}
                      {message.taskType === 'fast' && <Zap size={11} className="text-amber-500" />}
                      {message.taskType === 'complex' ? 'Gemini 3.1 Pro' : message.taskType === 'fast' ? 'Gemini 3.1 Flash-Lite' : 'Gemini 3.5 Flash'}
                    </span>
                    <span className="text-[10px] opacity-75">{message.timestamp}</span>
                  </div>
                )}

                {/* Message Body */}
                <div className="space-y-1">
                  {isUser ? (
                    <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  ) : (
                    renderFormattedText(message.text)
                  )}
                </div>

                {/* Bubble Footer / Copy action */}
                <div className="flex items-center justify-end gap-1 mt-1 pt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  {isUser && <span className="text-[10px] text-emerald-100">{message.timestamp}</span>}
                  
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(message.text, message.id)}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      title="Salin jawaban ini"
                    >
                      {copiedId === message.id ? (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                          <Check size={11} /> Tersalin
                        </span>
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex gap-2.5 items-start">
            <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center flex-shrink-0">
              <Bot size={14} />
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-teal-600 dark:text-teal-400" />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {taskType === 'complex' ? 'Menganalisis telaah kurikulum mendalam...' : 'Mengetik jawaban rekomendasi...'}
              </span>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl text-red-700 dark:text-red-300 text-xs flex items-start gap-2">
            <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold mb-0.5">Kendala Respons AI</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Quick Suggestion Chips (when conversation is short) */}
        {messages.length <= 2 && (
          <div className="pt-2">
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} /> Ide Pertanyaan Cepat untuk Guru:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {INITIAL_SUGGESTIONS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(item.text)}
                    disabled={isLoading}
                    className="text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 hover:border-teal-400 dark:hover:border-teal-600 hover:bg-teal-50/50 dark:hover:bg-slate-750 transition-all text-xs group disabled:opacity-50"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 mb-0.5">
                      <Icon size={13} className="text-teal-500" />
                      <span>{item.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                      "{item.text}"
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input box bar */}
      <div className="p-3 bg-white dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800">
        <div className="relative flex items-center">
          <textarea
            ref={inputRef}
            rows={1}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanyakan apa saja seputar kurikulum, materi ajar, atau diferensiasi... (Enter untuk kirim)"
            disabled={isLoading}
            className="w-full text-xs sm:text-sm pl-3.5 pr-11 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none max-h-28 disabled:opacity-60"
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputPrompt.trim() || isLoading}
            className="absolute right-1.5 p-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-40 disabled:hover:bg-teal-600 transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed"
            title="Kirim pesan"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
          </button>
        </div>

        <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
          <span>Shift + Enter untuk baris baru</span>
          <span>Didukung Gemini 3.1 Pro & Gemini 3.5</span>
        </div>
      </div>

    </div>
  );
};

export default AIChatbot;
