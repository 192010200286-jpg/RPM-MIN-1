import React, { useState, useRef } from 'react';
import { 
  Wand2, Image as ImageIcon, Upload, Download, Copy, Check, 
  Trash2, RefreshCw, Sparkles, Layers, AlertCircle, Loader2, 
  FileText, ExternalLink, ArrowRight, SlidersHorizontal
} from 'lucide-react';
import { GeneratedImageItem, ImageGenerationOptions } from '../types';
import { generateOrEditImage } from '../services/geminiService';

interface AIImageStudioProps {
  onInsertToLesson?: (imageUrl: string, prompt: string) => void;
  defaultSubject?: string;
}

const PRESET_PROMPTS = [
  {
    title: "Siklus Air & Hujan",
    prompt: "Diagram siklus air edukatif: evaporasi dari laut, kondensasi membentuk awan, presipitasi hujan, dan infiltrasi ke tanah. Gaya infografis kartun bersih untuk siswa madrasah."
  },
  {
    title: "Struktur Sel Tumbuhan",
    prompt: "Ilustrasi diagram anatomi sel tumbuhan 3D kartun berwarna cerah dengan dinding sel, kloroplas, vakuola, dan inti sel yang mudah dipahami anak sekolah."
  },
  {
    title: "Tata Surya Edukatif",
    prompt: "Ilustrasi tata surya kartun luar angkasa dengan matahari bersinar di tengah dan delapan planet mengorbit secara urut, latar belakang biru gelap penuh bintang."
  },
  {
    title: "Kerjasama Kelompok Siswa",
    prompt: "Ilustrasi ramah anak menampilkan 4 siswa madrasah (berpakaian seragam rapi dan sopan) sedang berdiskusi membuat proyek sains bersama di meja bundar."
  }
];

export const AIImageStudio: React.FC<AIImageStudioProps> = ({ 
  onInsertToLesson,
  defaultSubject 
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'edit'>('create');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:3' | '16:9' | '3:4'>('1:1');
  
  // Image editing states
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [referenceMimeType, setReferenceMimeType] = useState<string>('image/png');
  const [imageFileName, setImageFileName] = useState<string>('');

  // Results & History
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<GeneratedImageItem | null>(null);
  const [history, setHistory] = useState<GeneratedImageItem[]>([]);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Silakan unggah file gambar (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('Ukuran file gambar maksimal 8MB.');
      return;
    }

    setImageFileName(file.name);
    setReferenceMimeType(file.type);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = () => {
      setReferenceImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearReferenceImage = () => {
    setReferenceImage(null);
    setImageFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setErrorMessage('Silakan masukkan deskripsi atau instruksi gambar terlebih dahulu.');
      return;
    }

    if (activeTab === 'edit' && !referenceImage) {
      setErrorMessage('Silakan pilih atau unggah gambar yang ingin diedit.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const options: ImageGenerationOptions = {
        prompt: prompt.trim(),
        aspectRatio,
        referenceImageBase64: activeTab === 'edit' ? referenceImage! : undefined,
        referenceMimeType: activeTab === 'edit' ? referenceMimeType : undefined
      };

      const imageUrl = await generateOrEditImage(prompt.trim(), options);

      const newItem: GeneratedImageItem = {
        id: `img-${Date.now()}`,
        url: imageUrl,
        prompt: prompt.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        aspectRatio,
        isEdited: activeTab === 'edit'
      };

      setCurrentResult(newItem);
      setHistory(prev => [newItem, ...prev]);
    } catch (err: any) {
      console.error("Image generation error:", err);
      setErrorMessage(err.message || 'Gagal memproses gambar dengan AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (item: GeneratedImageItem) => {
    const link = document.createElement('a');
    link.href = item.url;
    link.download = `media-ajar-${item.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 dark:from-blue-900 dark:via-indigo-950 dark:to-violet-950 rounded-2xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-6 -translate-y-6 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-xs mb-2 text-blue-100 border border-white/20">
            <Sparkles size={13} className="text-amber-300" />
            <span>Didukung Gemini 3.1 Flash Image</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-1.5">
            Studio Media Ajar & Ilustrasi AI
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Buat media visual pembelajaran, diagram konsep, infografis LKPD, atau edit gambar bahan ajar secara instan dengan instruksi bahasa Indonesia.
          </p>
        </div>
      </div>

      {/* Main Grid: Control Panel (Left) & Result Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            
            {/* Tab switcher: Create vs Edit */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => { setActiveTab('create'); setErrorMessage(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'create'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Wand2 size={16} />
                <span>Buat Gambar Baru (Text-to-Image)</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('edit'); setErrorMessage(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'edit'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <SlidersHorizontal size={16} />
                <span>Edit Gambar yang Ada (Image-to-Image)</span>
              </button>
            </div>

            {/* Reference Image Upload Area (Only visible in Edit tab) */}
            {activeTab === 'edit' && (
              <div className="mb-4 space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Unggah Gambar yang Ingin Dimodifikasi:
                </label>

                {!referenceImage ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-850"
                  >
                    <Upload size={28} className="mx-auto text-indigo-500 mb-2" />
                    <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                      Klik atau tarik file gambar ke sini
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Format PNG, JPG, atau WEBP (Maks 8MB)
                    </p>
                  </div>
                ) : (
                  <div className="relative border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-slate-50 dark:bg-slate-800 flex items-center gap-3">
                    <img
                      src={referenceImage}
                      alt="Gambar Sumber"
                      className="w-16 h-16 object-cover rounded-lg border border-slate-200 dark:border-slate-600"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {imageFileName || 'Gambar Referensi'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Siap untuk dimodifikasi dengan instruksi di bawah
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearReferenceImage}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      title="Ganti Gambar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}

            {/* Prompt input */}
            <div className="space-y-1.5 mb-4">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {activeTab === 'create' 
                  ? 'Deskripsi Gambar / Media Pembelajaran yang Diinginkan:' 
                  : 'Instruksi Pengeditan Gambar:'}
              </label>
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  activeTab === 'create'
                    ? 'Contoh: Diagram metamorfosis katak lengkap dengan label telur, berudu, katak muda, dan katak dewasa. Warna cerah, gaya edukatif anak MI/SD.'
                    : 'Contoh: Tambahkan label panah merah pada bagian fotosintesis, dan ubah latar belakang menjadi putih bersih.'
                }
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Aspect Ratio Selector */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Rasio Aspek Gambar:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: '1:1', label: '1:1 Persegi', sub: 'Kartu / Bahan' },
                  { value: '4:3', label: '4:3 Presentasi', sub: 'Slide Ajar' },
                  { value: '16:9', label: '16:9 Lanskap', sub: 'Layar Lebar' },
                  { value: '3:4', label: '3:4 Vertikal', sub: 'Poster / LKPD' }
                ].map(ratio => (
                  <button
                    key={ratio.value}
                    type="button"
                    onClick={() => setAspectRatio(ratio.value as any)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      aspectRatio === ratio.value
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-xs">{ratio.label}</div>
                    <div className="text-[10px] text-slate-400">{ratio.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-xs flex items-start gap-2">
                <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Memproses Visual dengan AI Gemini...</span>
                </>
              ) : (
                <>
                  <Wand2 size={18} />
                  <span>{activeTab === 'create' ? 'Buat Gambar Media Ajar' : 'Terapkan Edit Gambar'}</span>
                </>
              )}
            </button>
          </div>

          {/* Preset Inspirasi Media Ajar */}
          <div className="bg-slate-50 dark:bg-slate-850 border border-slate-250 dark:border-slate-800 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" />
              Inspirasi Prompt Media Pembelajaran:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_PROMPTS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveTab('create');
                    setPrompt(preset.prompt);
                  }}
                  className="text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-all text-xs group"
                >
                  <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-between">
                    <span>{preset.title}</span>
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                    {preset.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Preview & History (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col h-full">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <ImageIcon size={16} className="text-blue-600 dark:text-blue-400" />
                Pratinjau Hasil Visual
              </h3>
              {currentResult && (
                <span className="text-[11px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium px-2 py-0.5 rounded-md">
                  Rasio {currentResult.aspectRatio}
                </span>
              )}
            </div>

            {/* Display Area */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3 overflow-hidden relative">
              {isGenerating ? (
                <div className="text-center p-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
                    <Loader2 size={24} className="animate-spin" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Sedang Merancang Visual...
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    Gemini 3.1 Flash Image sedang menyusun ilustrasi edukatif beresolusi tinggi sesuai perintah Anda.
                  </p>
                </div>
              ) : currentResult ? (
                <div className="w-full flex flex-col items-center">
                  <img
                    src={currentResult.url}
                    alt={currentResult.prompt}
                    className="max-h-[320px] w-auto max-w-full object-contain rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2.5 text-center italic line-clamp-2 px-2">
                    "{currentResult.prompt}"
                  </p>
                </div>
              ) : (
                <div className="text-center p-6 space-y-2 text-slate-400 dark:text-slate-600">
                  <ImageIcon size={40} className="mx-auto stroke-[1.5]" />
                  <p className="text-xs font-medium">Belum ada gambar yang dihasilkan.</p>
                  <p className="text-[11px]">
                    Ketik deskripsi gambar di panel kiri lalu klik tombol "Buat Gambar".
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons for Result */}
            {currentResult && !isGenerating && (
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload(currentResult)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs hover:opacity-90 transition-opacity"
                >
                  <Download size={14} />
                  <span>Unduh PNG</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyLink(currentResult.url)}
                  className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  title="Salin Data Gambar"
                >
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>

                {/* Optional button to edit this result directly */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('edit');
                    setReferenceImage(currentResult.url);
                    setImageFileName('Hasil Generasi Sebelumnya');
                    setPrompt('');
                  }}
                  className="py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold text-xs flex items-center gap-1.5 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                  title="Edit gambar ini lebih lanjut"
                >
                  <SlidersHorizontal size={14} />
                  <span>Edit Lagi</span>
                </button>
              </div>
            )}
          </div>

          {/* Session History */}
          {history.length > 1 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                <Layers size={14} className="text-blue-500" />
                Riwayat Sesi Ini ({history.length} gambar)
              </h4>
              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentResult(item)}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      currentResult?.id === item.id 
                        ? 'border-blue-600 scale-105 shadow-xs' 
                        : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                    }`}
                    title={item.prompt}
                  >
                    <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIImageStudio;
