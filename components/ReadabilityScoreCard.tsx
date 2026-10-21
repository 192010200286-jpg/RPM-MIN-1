import React, { useState } from 'react';
import { 
  BookOpen, CheckCircle2, AlertCircle, Info, Sparkles, 
  ChevronDown, ChevronUp, Clock, FileText, Layers, Lightbulb,
  Check, ArrowRight
} from 'lucide-react';
import { ReadabilityAnalysisResult } from '../services/readabilityService';

interface Props {
  analysis: ReadabilityAnalysisResult;
  gradeClass: string;
  subject: string;
}

export const ReadabilityScoreCard: React.FC<Props> = ({ analysis, gradeClass, subject }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showSnippet, setShowSnippet] = useState(false);

  // Determine badge styling based on alignment status
  const getStatusColor = (status: ReadabilityAnalysisResult['alignmentStatus']) => {
    switch (status) {
      case 'SANGAT_SESUAI':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/40',
          border: 'border-emerald-300 dark:border-emerald-800',
          text: 'text-emerald-800 dark:text-emerald-300',
          badgeBg: 'bg-emerald-600',
          ring: 'ring-emerald-500',
          gaugeColor: '#059669' // emerald-600
        };
      case 'SESUAI':
        return {
          bg: 'bg-teal-50 dark:bg-teal-950/40',
          border: 'border-teal-300 dark:border-teal-800',
          text: 'text-teal-800 dark:text-teal-300',
          badgeBg: 'bg-teal-600',
          ring: 'ring-teal-500',
          gaugeColor: '#0d9488' // teal-600
        };
      case 'PERLU_PENYESUAIAN':
      default:
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40',
          border: 'border-amber-300 dark:border-amber-800',
          text: 'text-amber-800 dark:text-amber-300',
          badgeBg: 'bg-amber-600',
          ring: 'ring-amber-500',
          gaugeColor: '#d97706' // amber-600
        };
    }
  };

  const colors = getStatusColor(analysis.alignmentStatus);

  return (
    <div className="no-print bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300">
      {/* Top Banner & Summary Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700/60 bg-gradient-to-r from-teal-50/70 via-white to-blue-50/50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-850">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-teal-600 text-white shadow-sm flex-shrink-0 mt-0.5">
              <BookOpen size={20} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200 border border-teal-300/80">
                  <Sparkles size={12} /> Analisis Keterbacaan Teks Siswa
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Formula Keterbacaan Bahasa Indonesia
                </span>
              </div>
              <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-slate-100 mt-1 flex items-center gap-2">
                Evaluasi Kesesuaian Teks Bahan Ajar ({gradeClass || 'Siswa'})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Memverifikasi struktur kalimat, tingkat suku kata, dan beban kognitif agar materi ajar tidak membebani siswa.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Quick Status Pill */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${colors.bg} ${colors.border} ${colors.text}`}>
              {analysis.alignmentStatus === 'PERLU_PENYESUAIAN' ? (
                <AlertCircle size={15} />
              ) : (
                <CheckCircle2 size={15} />
              )}
              <span>{analysis.readingEaseLabel}</span>
            </div>

            {/* Expand / Collapse Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title={isExpanded ? 'Sembunyikan detail' : 'Tampilkan detail analisis'}
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-6">
          {/* Top Score & Target Alignment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
            {/* Score Radial Card (col 1-4) */}
            <div className="md:col-span-4 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-teal-50/50 dark:from-slate-850 dark:to-slate-800 border border-teal-100 dark:border-slate-700 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Skor Keterbacaan (0 - 100)
              </span>

              {/* Circular Gauge Representation */}
              <div className="relative w-28 h-28 flex items-center justify-center my-1">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path
                    className="text-slate-200 dark:text-slate-700"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Progress Circle */}
                  <path
                    stroke={colors.gaugeColor}
                    strokeDasharray={`${analysis.score}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 leading-none">
                    {analysis.score}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 mt-0.5">/ 100</span>
                </div>
              </div>

              <div className="mt-2">
                <div className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  {analysis.readingEaseLabel}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Flesch Reading Ease Adaptasi Indonesia
                </div>
              </div>
            </div>

            {/* Target Age & Appropriate Match (col 5-8) */}
            <div className="md:col-span-8 p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Kesesuaian Usia Siswa & Jenjang
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white ${colors.badgeBg}`}>
                    <Check size={13} /> {analysis.alignmentBadgeText}
                  </span>
                </div>

                <div className="mt-3.5 space-y-2.5">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60">
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Rentang Usia Ideal Siswa:</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {analysis.targetAgeRange}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60">
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Target Jenjang Sekolah:</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {analysis.targetGradeLevel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60">
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1.5">
                      <Clock size={13} className="text-teal-600" /> Estimasi Waktu Baca Siswa:
                    </span>
                    <span className="text-xs font-bold text-teal-700 dark:text-teal-300">
                      ± {analysis.estimatedReadingTimeMinutes} Menit Membaca Mandiri
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Level Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
                  <span>SD (Mudah: 70-100)</span>
                  <span className="font-semibold text-slate-600 dark:text-slate-300">SMP (Standar: 60-78)</span>
                  <span>SMA (Akademik: 48-68)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden flex">
                  <div className="bg-amber-400 h-full w-[25%]" title="Teks Akademik / Menantang" />
                  <div className="bg-teal-500 h-full w-[35%]" title="Teks Menengah / Standar" />
                  <div className="bg-emerald-500 h-full w-[40%]" title="Teks Ramah Siswa / Mudah" />
                </div>
              </div>
            </div>
          </div>

          {/* 4 Quantitative Linguistic Metrics */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Indikator Linguistik Teks Pembelajaran
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Rata-rata Kata / Kalimat</div>
                <div className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                  {analysis.avgWordsPerSentence} <span className="text-xs font-normal text-slate-400">kata</span>
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {analysis.avgWordsPerSentence <= 16 ? '✓ Kalimat Ringkas' : '• Kalimat Menengah'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Rata-rata Suku Kata</div>
                <div className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                  {analysis.avgSyllablesPerWord} <span className="text-xs font-normal text-slate-400">suku kata</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Standar BI: 2.2 - 2.8
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Total Kata Materi</div>
                <div className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                  {analysis.totalWords} <span className="text-xs font-normal text-slate-400">kata</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {analysis.totalSentences} Kalimat Total
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Kosakata Polysyllabic</div>
                <div className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                  {analysis.complexWordsPercentage}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Kata &gt; 3 suku kata
                </div>
              </div>
            </div>
          </div>

          {/* Key Pedagogical Insights & Recommendations */}
          <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="text-teal-700 dark:text-teal-400" size={18} />
              <h4 className="font-bold text-sm text-teal-900 dark:text-teal-200">
                Rekomendasi Pedagogis untuk Guru
              </h4>
            </div>

            <div className="space-y-2.5">
              {analysis.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-teal-950 dark:text-teal-100">
                  <span className="flex-shrink-0 w-4 h-4 rounded-full bg-teal-200 dark:bg-teal-800 text-teal-800 dark:text-teal-200 flex items-center justify-center font-bold text-[10px] mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>

            <div className="mt-3.5 pt-3 border-t border-teal-200/60 dark:border-teal-800/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="text-xs">
                <span className="font-bold text-teal-900 dark:text-teal-200 block mb-0.5">
                  Struktur Sintaksis Kalimat:
                </span>
                <span className="text-teal-800/90 dark:text-teal-300/90">
                  {analysis.keyInsights.sentenceStructure}
                </span>
              </div>
              <div className="text-xs">
                <span className="font-bold text-teal-900 dark:text-teal-200 block mb-0.5">
                  Tips Diferensiasi di Kelas:
                </span>
                <span className="text-teal-800/90 dark:text-teal-300/90">
                  {analysis.keyInsights.pedagogicalTip}
                </span>
              </div>
            </div>
          </div>

          {/* Analyzed Text Snippet Inspection Toggle */}
          <div className="pt-1">
            <button
              onClick={() => setShowSnippet(!showSnippet)}
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 flex items-center gap-1 cursor-pointer"
            >
              <span>{showSnippet ? 'Sembunyikan Cuplikan Teks yang Dianalisis' : 'Lihat Cuplikan Teks yang Dianalisis'}</span>
              <ArrowRight size={13} className={`transform transition-transform ${showSnippet ? 'rotate-90' : ''}`} />
            </button>

            {showSnippet && (
              <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 font-mono leading-relaxed">
                <p className="italic">{analysis.analyzedSnippet}</p>
                <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                  <Info size={11} />
                  <span>Dianalisis dari Bahan Bacaan Peserta Didik (Lampiran 1) dan LKPD (Lampiran 2).</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
