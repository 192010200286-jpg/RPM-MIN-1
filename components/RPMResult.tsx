import React, { useRef, useState, useMemo } from 'react';
import { RPMFormData, RPMGeneratedContent } from '../types';
import { 
  FileText, CheckCheck, Download, Printer, 
  Loader2, Copy, Sparkles, Check, School,
  Heart, BookOpen, Award, CheckSquare, Layers,
  ChevronDown
} from 'lucide-react';
import { exportRPMToWord, exportRPMToPDF, downloadRPMPdf, printRPMDocument } from '../services/exportService';
import { analyzeRPMReadability } from '../services/readabilityService';
import { ReadabilityScoreCard } from './ReadabilityScoreCard';

interface Props {
  formData: RPMFormData;
  generatedContent: RPMGeneratedContent;
}

const RPMResult: React.FC<Props> = ({ formData, generatedContent }) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [showPdfMenu, setShowPdfMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type?: 'success' | 'info' | 'error' } | null>(null);

  // Compute text readability score and age appropriateness analysis
  const readabilityAnalysis = useMemo(() => {
    return analyzeRPMReadability(formData, generatedContent);
  }, [formData, generatedContent]);

  const showNotification = (title: string, desc: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  const handleDownloadWord = () => {
    try {
      exportRPMToWord(formData, generatedContent);
      showNotification(
        'Dokumen Word (.doc) Berhasil Diunduh!',
        'Format tabel, banner hijau toska, ungu lampiran, dan tata letak A4 tersusun persis seperti template PDF resmi.'
      );
    } catch (err) {
      console.error('Gagal mengunduh Word:', err);
      showNotification('Gagal Mengunduh Word', 'Terjadi kendala saat menyusun file Word.', 'error');
    }
  };

  const handleDownloadPDF = async (includeLampiran = true) => {
    setIsPdfLoading(true);
    setShowPdfMenu(false);

    try {
      // Small timeout to allow spinner state to paint in DOM
      await new Promise((resolve) => setTimeout(resolve, 80));
      downloadRPMPdf(formData, generatedContent, { includeLampiran });
      setIsPdfLoading(false);
      showNotification(
        'Dokumen PDF Berhasil Diunduh!',
        includeLampiran 
          ? 'File PDF resmi (RPM + 9 Lampiran Lengkap) berhasil dibuat dengan jsPDF. Teks tajam berbasis vektor, tabel rapi bergaris, dan penomoran halaman otomatis.'
          : 'File PDF RPM Inti (tanpa lampiran) berhasil dibuat dengan jsPDF dan siap cetak.'
      );
    } catch (err) {
      setIsPdfLoading(false);
      console.error('Gagal membuat PDF dengan jsPDF:', err);
      showNotification(
        'Alternatif Unduh PDF',
        'Terjadi kendala saat menyusun PDF. Silakan gunakan tombol "Cetak / Cetak PDF" untuk menyimpan langsung melalui peramban.',
        'info'
      );
    }
  };

  const handlePrint = () => {
    printRPMDocument();
  };

  const handleCopyToDocs = async () => {
    if (!tableRef.current) return;

    try {
      const range = document.createRange();
      range.selectNode(tableRef.current);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        selection.removeAllRanges();
        
        setCopied(true);
        showNotification('Berhasil Disalin!', 'Konten tabel telah disalin ke clipboard. Silakan Paste (Ctrl+V) di Google Docs.');
        setTimeout(() => setCopied(false), 2500);

        try {
          window.open('https://docs.new', '_blank');
        } catch (e) {
          // popup blocked, clipboard still copied
        }
      }
    } catch (err) {
      console.error('Gagal menyalin:', err);
      showNotification('Gagal Menyalin', 'Silakan gunakan tombol Unduh Word.', 'error');
    }
  };

  const schoolName = formData.schoolName || 'SMP NEGERI 2 BANYUWANGI';
  const academicYear = formData.academicYear || '2025/2026';
  const teacherName = formData.teacherName || 'Eko Cahyono';
  const teacherNIP = formData.teacherNIP || '-';
  const principalName = formData.principalName || 'Drs. Ahmad Syafii';
  const principalNIP = formData.principalNIP || '-';
  const subject = formData.subject || 'Ilmu Pengetahuan Alam (IPA)';
  const material = formData.material || 'Sifat Zat dan Perubahannya';
  const gradeClass = formData.gradeClass || 'Kelas 7';
  const fase = formData.fase || 'Fase D';
  const semester = formData.semester || '1 (Ganjil)';
  const duration = formData.duration || '2 Pertemuan (2 x 40 menit | 2 x 40 menit)';

  // All 8 Dimensions for exact checkbox matching with PDF template
  const allDimensions = [
    { id: 'DPL 1', label: 'Keimanan dan Ketakwaan terhadap Tuhan YME' },
    { id: 'DPL 2', label: 'Kewargaan' },
    { id: 'DPL 3', label: 'Penalaran Kritis' },
    { id: 'DPL 4', label: 'Kreativitas' },
    { id: 'DPL 5', label: 'Kolaborasi' },
    { id: 'DPL 6', label: 'Kemandirian' },
    { id: 'DPL 7', label: 'Kesehatan' },
    { id: 'DPL 8', label: 'Komunikasi' },
  ];

  // Helper to check if dimension is selected
  const isDimSelected = (dimId: string, dimLabel: string) => {
    if (!formData.dimensions || formData.dimensions.length === 0) return true;
    return formData.dimensions.some(d => 
      dimLabel.toLowerCase().includes(d.toLowerCase()) || 
      d.toLowerCase().includes(dimLabel.toLowerCase()) ||
      dimId.toLowerCase().includes(d.toLowerCase())
    );
  };

  const meetings = generatedContent.langkah_pembelajaran.daftar_pertemuan || [];
  const lampiran = generatedContent.lampiran;

  return (
    <div className="space-y-6">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-xl flex items-start gap-3 border max-w-md transition-all animate-bounce ${
          toastMessage.type === 'error' 
            ? 'bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950 dark:text-rose-100 dark:border-rose-800' 
            : toastMessage.type === 'info'
            ? 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950 dark:text-amber-100 dark:border-amber-800'
            : 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-100 dark:border-emerald-800'
        }`}>
          <div className="flex-shrink-0 mt-0.5">
            {toastMessage.type === 'error' ? (
              <span className="text-rose-600 font-bold">✕</span>
            ) : (
              <Check className="text-emerald-600" size={18} />
            )}
          </div>
          <div>
            <h4 className="font-bold text-sm">{toastMessage.title}</h4>
            <p className="text-xs mt-0.5 opacity-90">{toastMessage.desc}</p>
          </div>
        </div>
      )}

      {/* TOP CONTROL BAR - ACTION BUTTONS */}
      <div className="no-print bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200 border border-teal-300">
                <Sparkles size={13} /> Sesuai Format Template PDF Resmi Kemenag
              </span>
              <span className="text-xs text-slate-500">23 Halaman Komprehensif</span>
            </div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2 leading-tight mt-1.5">
              <CheckCheck className="text-teal-600" size={22} /> 
              Dokumen Perencanaan Pembelajaran Mendalam (RPM) Siap
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Format header toska, tabel pastel, dan 9 Lampiran lengkap (Bahan Bacaan, LKPD 1 & 2, Asesmen Awal/Proses/Akhir, Rubrik, Refleksi, Observasi Guru, dan KBC).
            </p>
          </div>

          {/* Action Buttons Group */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Download Word Button */}
            <button 
              onClick={handleDownloadWord}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-sm hover:shadow transition-all cursor-pointer"
              title="Unduh file Microsoft Word (.doc) yang dapat diedit langsung"
            >
              <FileText size={16} />
              <span>Unduh Word (.doc)</span>
            </button>

            {/* Download PDF Button with Options */}
            <div className="relative inline-flex">
              <button 
                onClick={() => handleDownloadPDF(true)}
                disabled={isPdfLoading}
                className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-l-xl font-bold text-xs sm:text-sm bg-rose-600 hover:bg-rose-700 active:scale-95 text-white shadow-sm hover:shadow transition-all disabled:opacity-60 cursor-pointer disabled:cursor-wait"
                title="Unduh dokumen PDF resmi lengkap (RPM + 9 Lampiran)"
              >
                {isPdfLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Menyusun PDF...</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>Unduh PDF (.pdf)</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowPdfMenu(!showPdfMenu)}
                disabled={isPdfLoading}
                className="px-2 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-r-xl border-l border-rose-500/50 transition-all cursor-pointer disabled:opacity-60"
                title="Pilihan Opsi Unduh PDF"
              >
                <ChevronDown size={15} />
              </button>

              {/* PDF Dropdown Menu */}
              {showPdfMenu && (
                <div 
                  className="absolute right-0 top-full mt-1.5 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-30"
                  onMouseLeave={() => setShowPdfMenu(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                    Pilihan Format PDF (jsPDF)
                  </div>
                  <button
                    onClick={() => handleDownloadPDF(true)}
                    className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-200 flex flex-col gap-0.5 cursor-pointer"
                  >
                    <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <Download size={13} /> Dokumen Lengkap (RPM + 9 Lampiran)
                    </span>
                    <span className="text-[11px] text-slate-400">Siap cetak & ditandatangani (format resmi)</span>
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(false)}
                    className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-200 flex flex-col gap-0.5 border-t border-slate-100 dark:border-slate-700/60 cursor-pointer"
                  >
                    <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <Download size={13} /> Hanya RPM Inti (Tanpa Lampiran)
                    </span>
                    <span className="text-[11px] text-slate-400">Ringkas untuk arsip modul ajar mingguan</span>
                  </button>
                </div>
              )}
            </div>

            {/* Print / Save as PDF (Native Print Dialog) */}
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white shadow-sm hover:shadow transition-all cursor-pointer"
              title="Cetak langsung atau simpan sebagai PDF dengan peramban"
            >
              <Printer size={16} />
              <span>Cetak / Cetak PDF</span>
            </button>

            {/* Copy & Open Google Docs */}
            <button 
              onClick={handleCopyToDocs}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all border ${
                copied 
                  ? 'bg-emerald-600 text-white border-emerald-600' 
                  : 'bg-slate-50 dark:bg-slate-750 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              title="Salin isi dokumen dan buka Google Docs"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Tersalin!' : 'Salin ke Docs'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* READABILITY SCORE & LINGUISTIC SUITABILITY CARD */}
      <ReadabilityScoreCard 
        analysis={readabilityAnalysis} 
        gradeClass={formData.gradeClass || ''} 
        subject={formData.subject || ''} 
      />

      {/* DOCUMENT CONTAINER - A4 Paper Look */}
      <div className="bg-slate-200/90 dark:bg-slate-950 p-2 sm:p-6 md:p-8 rounded-2xl overflow-x-auto shadow-inner border border-slate-300 dark:border-slate-800">
        <div 
          id="printable-rpm-doc"
          className="bg-white text-black p-6 sm:p-10 md:p-[48px] shadow-2xl mx-auto min-w-[760px] max-w-[860px] rounded-lg text-[10.5pt] leading-normal font-sans" 
          ref={tableRef}
        >
          {/* STYLES MATCHING THE PDF TEMPLATE */}
          <style>{`
            .pdf-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 0.35rem;
              margin-bottom: 1.25rem;
              font-family: inherit;
              font-size: 10pt;
            }
            .pdf-table th, .pdf-table td {
              border: 1px solid #0f766e !important;
              padding: 6px 10px;
              vertical-align: top;
              line-height: 1.45;
              color: #0f172a !important;
            }
            .pdf-table th.header-toska {
              background-color: #0f766e !important;
              color: #ffffff !important;
              font-weight: bold;
              text-align: left;
              font-size: 11pt;
              padding: 8px 12px;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .pdf-table th.header-kbc {
              background-color: #be185d !important;
              color: #ffffff !important;
              font-weight: bold;
              text-align: left;
              font-size: 11pt;
              padding: 8px 12px;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .pdf-table th.header-lampiran {
              background-color: #4f46e5 !important;
              color: #ffffff !important;
              font-weight: bold;
              text-align: left;
              font-size: 11pt;
              padding: 8px 12px;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .pdf-table td.col-left {
              background-color: #e6f4f1 !important;
              color: #0f766e !important;
              font-weight: 700;
              width: 28%;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .pdf-table td.col-left-kbc {
              background-color: #fce7f3 !important;
              color: #9d174d !important;
              font-weight: 700;
              width: 28%;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .kbc-callout {
              border-left: 4px solid #e11d48;
              background-color: #fff1f2;
              padding: 8px 12px;
              margin: 6px 0;
              border-radius: 0 6px 6px 0;
              color: #881337;
              font-size: 9.5pt;
              line-height: 1.45;
            }
            .avoid-break {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .break-before-page {
              page-break-before: always !important;
              break-before: page !important;
            }
            @media print {
              body {
                background: #ffffff !important;
                color: #000000 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .no-print {
                display: none !important;
              }
              #printable-rpm-doc {
                box-shadow: none !important;
                border: none !important;
                padding: 0 !important;
                margin: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
                min-width: 100% !important;
              }
              @page {
                size: A4 portrait;
                margin: 15mm 15mm 15mm 15mm;
              }
            }
          `}</style>

          {/* PAGE 1: COVER EMBLEM & TITLE (MATCHING USER PDF) */}
          <div className="text-center mb-6">
            {/* Green Circular Emblem */}
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 rounded-full bg-[#0f766e] flex items-center justify-center text-white shadow-md border-2 border-emerald-300">
                <School size={34} />
              </div>
            </div>
            <h1 className="font-extrabold text-xl text-[#0f766e] tracking-wide uppercase">
              PERENCANAAN PEMBELAJARAN MENDALAM (RPM)
            </h1>
            <h2 className="font-bold text-lg text-slate-800 tracking-wider uppercase mt-0.5">
              {schoolName}
            </h2>
            <p className="font-semibold text-sm text-slate-600 mt-0.5">
              Tahun Ajaran {academicYear}
            </p>
            <div className="w-full h-1 bg-[#0f766e] mt-3 rounded-full"></div>
          </div>

          {/* IDENTITAS TABLE */}
          <table className="pdf-table avoid-break">
            <thead>
              <tr>
                <th colSpan={2} className="header-toska">IDENTITAS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="col-left">Nama Sekolah</td>
                <td className="font-medium">{schoolName}</td>
              </tr>
              <tr>
                <td className="col-left">Kelas / Fase</td>
                <td className="font-medium">{gradeClass} / {fase}</td>
              </tr>
              <tr>
                <td className="col-left">Semester</td>
                <td className="font-medium">{semester}</td>
              </tr>
              <tr>
                <td className="col-left">Tahun Ajaran</td>
                <td className="font-medium">{academicYear}</td>
              </tr>
              <tr>
                <td className="col-left">Mata Pelajaran</td>
                <td className="font-medium">{subject}</td>
              </tr>
              <tr>
                <td className="col-left">Bab / Materi</td>
                <td className="font-bold text-[#0f766e]">{material}</td>
              </tr>
              <tr>
                <td className="col-left">Alokasi Waktu</td>
                <td className="font-medium">{duration}</td>
              </tr>
            </tbody>
          </table>

          {/* A. IDENTIFIKASI */}
          <table className="pdf-table avoid-break">
            <thead>
              <tr>
                <th colSpan={2} className="header-toska">A. IDENTIFIKASI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="col-left">Peserta Didik</td>
                <td className="text-justify">
                  {generatedContent.identifikasi.peserta_didik.map((p, idx) => (
                    <p key={idx} className={idx > 0 ? "mt-2" : ""}>
                      {p}
                    </p>
                  ))}
                </td>
              </tr>
              <tr>
                <td className="col-left">Materi Pelajaran</td>
                <td className="text-justify whitespace-pre-wrap">
                  {generatedContent.identifikasi.materi_pelajaran}
                </td>
              </tr>
              <tr>
                <td className="col-left">Dimensi Profil Lulusan</td>
                <td>
                  <p className="font-semibold text-slate-700 mb-1.5">Dimensi yang dicapai:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[9.5pt]">
                    {allDimensions.map((d) => {
                      const selected = isDimSelected(d.id, d.label);
                      return (
                        <div key={d.id} className="flex items-center gap-1.5">
                          <span className="text-[#0f766e]">▸</span>
                          <span className={selected ? "font-bold text-slate-900" : "text-slate-500"}>
                            {d.id}: {d.label}
                          </span>
                          {selected && (
                            <span className="text-emerald-600 font-bold text-sm">✓</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="col-left">Lintas Disiplin</td>
                <td>
                  {generatedContent.identifikasi.lintas_disiplin.map((ld, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 my-0.5">
                      <span className="text-[#0f766e]">▸</span>
                      <span>{ld}</span>
                    </div>
                  ))}
                </td>
              </tr>
              <tr>
                <td className="col-left">Panca Cinta</td>
                <td>
                  {generatedContent.panca_cinta_narasi.map((pc, idx) => (
                    <div key={idx} className="my-1">
                      <span className="font-bold text-[#0f766e]">▸ {pc.nilai}:</span>
                      <span className="ml-1 text-slate-800">{pc.deskripsi}</span>
                    </div>
                  ))}
                </td>
              </tr>
            </tbody>
          </table>

          {/* B. DESAIN PEMBELAJARAN */}
          <table className="pdf-table avoid-break">
            <thead>
              <tr>
                <th colSpan={2} className="header-toska">B. DESAIN PEMBELAJARAN</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="col-left">Capaian Pembelajaran</td>
                <td className="text-justify font-medium">{generatedContent.desain_pembelajaran.capaian_pembelajaran_narasi}</td>
              </tr>
              <tr>
                <td className="col-left">Tujuan Pembelajaran</td>
                <td className="text-justify font-medium">{formData.tp || 'Menganalisis konsep dan menerapkan dalam penyelesaian masalah kontekstual.'}</td>
              </tr>
              <tr>
                <td className="col-left">Topik Pembelajaran</td>
                <td>
                  <p className="font-bold text-[#0f766e]">{generatedContent.desain_pembelajaran.topik_pembelajaran}</p>
                  <p className="text-xs text-slate-500 italic mt-0.5">
                    Konteks: {subject} – {gradeClass}
                  </p>
                </td>
              </tr>
              {generatedContent.alokasi_durasi_aktivitas && (
                <tr>
                  <td className="col-left">Alokasi Durasi Waktu</td>
                  <td>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2.5 py-1 rounded bg-teal-50 border border-teal-200 text-[#0f766e] font-semibold">
                        Pendahuluan: ± {generatedContent.alokasi_durasi_aktivitas.pendahuluan} mnt
                      </span>
                      <span className="px-2.5 py-1 rounded bg-teal-50 border border-teal-200 text-[#0f766e] font-semibold">
                        Kegiatan Inti: ± {generatedContent.alokasi_durasi_aktivitas.inti} mnt
                      </span>
                      <span className="px-2.5 py-1 rounded bg-teal-50 border border-teal-200 text-[#0f766e] font-semibold">
                        Penutup: ± {generatedContent.alokasi_durasi_aktivitas.penutup} mnt
                      </span>
                    </div>
                    {generatedContent.alokasi_durasi_aktivitas.catatan_topik && (
                      <p className="text-xs text-slate-600 italic mt-1.5">
                        Catatan Durasi per Topik: {generatedContent.alokasi_durasi_aktivitas.catatan_topik}
                      </p>
                    )}
                  </td>
                </tr>
              )}
              <tr>
                <td className="col-left">Praktik Pedagogis</td>
                <td>
                  {formData.pedagogies.map((ped, idx) => (
                    <div key={idx} className="my-0.5 font-medium">
                      Pertemuan {idx + 1}: <span className="font-bold text-[#0f766e]">{ped}</span> (2 x 40 menit)
                    </div>
                  ))}
                </td>
              </tr>
              {generatedContent.diferensiasi_pembelajaran && (
                <tr>
                  <td className="col-left">Diferensiasi Pembelajaran</td>
                  <td className="space-y-2 text-[10pt]">
                    <div>
                      <span className="font-bold text-[#0f766e]">▸ Diferensiasi Konten: </span>
                      <span>{generatedContent.diferensiasi_pembelajaran.konten}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#0f766e]">▸ Diferensiasi Proses: </span>
                      <span>{generatedContent.diferensiasi_pembelajaran.proses}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#0f766e]">▸ Diferensiasi Produk: </span>
                      <span>{generatedContent.diferensiasi_pembelajaran.produk}</span>
                    </div>
                    <div className="mt-2 p-2.5 rounded-lg bg-teal-50/70 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 text-xs">
                      <span className="font-bold text-[#0f766e] block mb-1">Strategi Inklusi Keragaman Siswa:</span>
                      <div className="space-y-1">
                        {generatedContent.diferensiasi_pembelajaran.kelompok_sasaran.map((ks, kidx) => (
                          <div key={kidx} className="flex items-start gap-1.5">
                            <span className="text-[#0f766e] font-bold">•</span>
                            <div>
                              <strong className="text-slate-900">{ks.kelompok}: </strong>
                              <span className="text-slate-700">{ks.pendampingan}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              <tr>
                <td className="col-left">Kemitraan</td>
                <td className="whitespace-pre-wrap">{generatedContent.desain_pembelajaran.kemitraan}</td>
              </tr>
              <tr>
                <td className="col-left">Lingkungan</td>
                <td className="whitespace-pre-wrap">{generatedContent.desain_pembelajaran.lingkungan}</td>
              </tr>
              <tr>
                <td className="col-left">Pemanfaatan Digital</td>
                <td className="whitespace-pre-wrap">{generatedContent.desain_pembelajaran.digital}</td>
              </tr>
            </tbody>
          </table>

          {/* C. PENGALAMAN BELAJAR — LANGKAH-LANGKAH PEMBELAJARAN */}
          <table className="pdf-table">
            <thead>
              <tr>
                <th colSpan={2} className="header-toska">C. PENGALAMAN BELAJAR — LANGKAH-LANGKAH PEMBELAJARAN</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((meeting, mIdx) => (
                <tr key={mIdx} className="avoid-break">
                  <td className="col-left text-center">
                    <div className="font-bold text-base text-[#0f766e]">{meeting.pertemuan_ke}</div>
                    <div className="text-xs font-semibold text-slate-600 mt-1">{meeting.alokasi_waktu}</div>
                    <div className="mt-2 inline-block px-2 py-1 bg-teal-100 text-[#0f766e] font-bold text-xs rounded border border-teal-300">
                      {meeting.model_pembelajaran}
                    </div>
                  </td>
                  <td className="space-y-4">
                    {/* FASE 1: MEMAHAMI (PENDAHULUAN) */}
                    <div>
                      <div className="font-bold text-[#0f766e] text-[10.5pt] border-b border-teal-200 pb-1 flex items-center gap-1.5">
                        <BookOpen size={16} />
                        <span>{meeting.pendahuluan.judul}</span>
                      </div>
                      {meeting.panca_cinta_fase && (
                        <div className="text-[9pt] font-semibold text-pink-700 bg-pink-50 px-2 py-1 rounded my-1.5 border border-pink-200">
                          💗 Topik Panca Cinta diinsersi pada fase ini: {meeting.panca_cinta_fase.join(' • ')}
                        </div>
                      )}
                      <div className="mt-2 space-y-2 text-[9.5pt]">
                        {meeting.pendahuluan.langkah.map((step, sIdx) => (
                          <div key={sIdx}>
                            <p className="text-justify leading-relaxed">▸ {step.deskripsi}</p>
                            {step.insersi_kbc && (
                              <div className="kbc-callout">
                                <span className="font-bold text-[#be185d]">❤ {step.insersi_kbc.nilai}: </span>
                                <span>{step.insersi_kbc.uraian}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* FASE 2: MENGAPLIKASI (INTI) */}
                    <div className="pt-2 border-t border-slate-200">
                      <div className="font-bold text-[#0f766e] text-[10.5pt] border-b border-teal-200 pb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Layers size={16} />
                          <span>{meeting.inti.judul}</span>
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                          {meeting.inti.sintaks_model}
                        </span>
                      </div>
                      <div className="mt-2 space-y-2 text-[9.5pt]">
                        {meeting.inti.langkah.map((step, sIdx) => (
                          <div key={sIdx}>
                            {step.tahap && (
                              <div className="font-bold text-slate-800 mt-1 text-[9.5pt] text-teal-800">
                                {step.tahap}
                              </div>
                            )}
                            <p className="text-justify leading-relaxed">▸ {step.deskripsi}</p>
                            {step.insersi_kbc && (
                              <div className="kbc-callout">
                                <span className="font-bold text-[#be185d]">❤ {step.insersi_kbc.nilai}: </span>
                                <span>{step.insersi_kbc.uraian}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* FASE 3: MEREFLEKSI (PENUTUP) */}
                    <div className="pt-2 border-t border-slate-200">
                      <div className="font-bold text-[#0f766e] text-[10.5pt] border-b border-teal-200 pb-1 flex items-center gap-1.5">
                        <Award size={16} />
                        <span>{meeting.penutup.judul}</span>
                      </div>
                      <div className="mt-2 space-y-2 text-[9.5pt]">
                        {meeting.penutup.langkah.map((step, sIdx) => (
                          <div key={sIdx}>
                            {step.tahap && (
                              <div className="font-bold text-slate-800 mt-1 text-[9.5pt] text-teal-800">
                                {step.tahap}
                              </div>
                            )}
                            <p className="text-justify leading-relaxed">▸ {step.deskripsi}</p>
                            {step.insersi_kbc && (
                              <div className="kbc-callout">
                                <span className="font-bold text-[#be185d]">❤ {step.insersi_kbc.nilai}: </span>
                                <span>{step.insersi_kbc.uraian}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* D. ASESMEN PEMBELAJARAN */}
          <table className="pdf-table avoid-break">
            <thead>
              <tr>
                <th colSpan={2} className="header-toska">D. ASESMEN PEMBELAJARAN</th>
              </tr>
            </thead>
            <tbody>
              {generatedContent.metode_penilaian_terpilih && generatedContent.metode_penilaian_terpilih.length > 0 && (
                <tr>
                  <td className="col-left">Metode Penilaian Terpilih</td>
                  <td>
                    <div className="flex flex-wrap gap-1.5">
                      {generatedContent.metode_penilaian_terpilih.map((m, idx) => (
                        <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
                          ✓ {m}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
              <tr>
                <td className="col-left">Asesmen Awal (Diagnostik)</td>
                <td className="whitespace-pre-wrap">{generatedContent.asesmen.awal}</td>
              </tr>
              <tr>
                <td className="col-left">Asesmen Proses (Formatif)</td>
                <td className="whitespace-pre-wrap">{generatedContent.asesmen.proses}</td>
              </tr>
              <tr>
                <td className="col-left">Asesmen Akhir (Sumatif)</td>
                <td className="whitespace-pre-wrap">{generatedContent.asesmen.akhir}</td>
              </tr>
              <tr>
                <td className="col-left">Kriteria Ketercapaian (KKTP)</td>
                <td className="whitespace-pre-wrap">{generatedContent.lampiran.kktp}</td>
              </tr>
            </tbody>
          </table>

          {/* E. INSERSI KURIKULUM BERBASIS CINTA (KBC) */}
          {generatedContent.insersi_kbc && (
            <table className="pdf-table avoid-break">
              <thead>
                <tr>
                  <th colSpan={2} className="header-kbc">E. INSERSI KURIKULUM BERBASIS CINTA (KBC)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="col-left-kbc">Dasar Hukum</td>
                  <td className="font-semibold text-slate-800">{generatedContent.insersi_kbc.dasar_hukum}</td>
                </tr>
                <tr>
                  <td className="col-left-kbc">Posisi KBC dalam RPM Ini</td>
                  <td className="text-justify">{generatedContent.insersi_kbc.posisi_kbc}</td>
                </tr>
                <tr>
                  <td className="col-left-kbc">Topik Panca Cinta yang Diinsersi</td>
                  <td>
                    {generatedContent.insersi_kbc.topik_diinsersi.map((t, idx) => (
                      <div key={idx} className="my-1">
                        <span className="font-bold text-[#be185d]">{t.nilai}: </span>
                        <span>{t.deskripsi}</span>
                      </div>
                    ))}
                  </td>
                </tr>
                <tr>
                  <td className="col-left-kbc">Pendekatan Internalisasi</td>
                  <td className="font-medium">{generatedContent.insersi_kbc.pendekatan}</td>
                </tr>
                <tr>
                  <td className="col-left-kbc">Letak Insersi pada Langkah Pembelajaran</td>
                  <td>
                    {generatedContent.insersi_kbc.letak_insersi.map((li, idx) => (
                      <div key={idx} className="my-1.5 p-1.5 bg-rose-50/70 rounded border border-rose-200">
                        <div className="font-bold text-[#be185d]">{li.nilai}</div>
                        <div className="text-xs text-slate-700">Nilai inti: {li.nilai_inti}</div>
                        <div className="text-xs font-semibold text-slate-900 mt-0.5">Diinsersi pada: {li.fase}</div>
                      </div>
                    ))}
                  </td>
                </tr>
                <tr>
                  <td className="col-left-kbc">Iklim & Budaya Madrasah</td>
                  <td className="space-y-1 text-[9.5pt]">
                    <div><strong>Pembiasaan:</strong> {generatedContent.insersi_kbc.iklim_budaya.pembiasaan}</div>
                    <div><strong>Keteladanan Guru:</strong> {generatedContent.insersi_kbc.iklim_budaya.keteladanan}</div>
                    <div><strong>Experiential:</strong> {generatedContent.insersi_kbc.iklim_budaya.experiential}</div>
                  </td>
                </tr>
                <tr>
                  <td className="col-left-kbc">Evaluasi Holistik</td>
                  <td>{generatedContent.insersi_kbc.evaluasi_holistik}</td>
                </tr>
              </tbody>
            </table>
          )}

          {/* SIGNATURE SECTION (TANDA TANGAN RESMI) */}
          <div className="mt-8 mb-10 avoid-break">
            <table className="w-full text-center border-none">
              <tbody>
                <tr>
                  <td className="w-1/2 p-2 align-top">
                    <p className="font-medium">Mengetahui,</p>
                    <p className="font-bold">Kepala {schoolName}</p>
                    <div className="h-20"></div>
                    <p className="font-bold underline text-[11pt]">{principalName}</p>
                    <p className="text-xs text-slate-600">NIP. {principalNIP}</p>
                  </td>
                  <td className="w-1/2 p-2 align-top">
                    <p className="font-medium">Banyuwangi, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="font-bold">Guru Mata Pelajaran</p>
                    <div className="h-20"></div>
                    <p className="font-bold underline text-[11pt]">{teacherName}</p>
                    <p className="text-xs text-slate-600">NIP. {teacherNIP}</p>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="text-center text-[9pt] text-slate-500 mt-4 italic border-t border-slate-200 pt-2">
              Generator RPM • Perencanaan Pembelajaran Mendalam • Created by Eko Cahyono
            </div>
          </div>

          {/* 9 LAMPIRAN DOKUMEN PENDUKUNG PEMBELAJARAN */}
          <div className="break-before-page pt-4">
            <div className="text-center mb-6">
              <div className="inline-block px-4 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full text-xs font-bold text-indigo-800 mb-2">
                DOKUMEN PENDUKUNG PEMBELAJARAN RESMI
              </div>
              <h2 className="font-extrabold text-2xl text-indigo-900 tracking-wide uppercase">
                LAMPIRAN
              </h2>
              <h3 className="font-bold text-base text-slate-700 mt-1">
                RPM {subject} — {material} — {gradeClass}
              </h3>
              <p className="text-sm font-medium text-slate-500">
                9 Dokumen Pendukung Pembelajaran Komprehensif
              </p>
              <div className="w-24 h-1 bg-indigo-600 mx-auto mt-2 rounded-full"></div>
            </div>

            {/* LAMPIRAN 1 — BAHAN BACAAN */}
            {lampiran.bahan_bacaan && (
              <div className="mb-8 avoid-break">
                <table className="pdf-table">
                  <thead>
                    <tr>
                      <th colSpan={4} className="header-lampiran">Lampiran 1 — Bahan Bacaan Peserta Didik</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4} className="bg-indigo-50/50 p-3">
                        <div className="font-bold text-indigo-900 text-sm mb-1">A. Pengantar — Mengapa Materi Ini Penting?</div>
                        <p className="text-justify text-[9.5pt]">{lampiran.bahan_bacaan.pengantar}</p>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="font-bold bg-slate-100 text-slate-800 text-xs">
                        B. Konsep Kunci
                      </td>
                    </tr>
                    <tr className="bg-slate-50 font-bold text-[9pt]">
                      <td style={{ width: '6%' }}>No</td>
                      <td style={{ width: '24%' }}>Konsep</td>
                      <td style={{ width: '40%' }}>Pengertian / Penjelasan</td>
                      <td style={{ width: '30%' }}>Contoh di Kehidupan</td>
                    </tr>
                    {lampiran.bahan_bacaan.konsep_kunci.map((kk) => (
                      <tr key={kk.no}>
                        <td className="text-center font-bold">{kk.no}</td>
                        <td className="font-bold text-indigo-900">{kk.konsep}</td>
                        <td className="text-justify text-[9pt]">{kk.penjelasan}</td>
                        <td className="text-[9pt]">{kk.contoh}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={4} className="bg-indigo-50/50 p-3">
                        <div className="font-bold text-indigo-900 text-sm mb-1">C. Pertanyaan Pemandu Belajar</div>
                        <div className="space-y-1 text-[9pt]">
                          {lampiran.bahan_bacaan.pertanyaan_pemandu.map((pp, idx) => (
                            <div key={idx}>{pp}</div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* LAMPIRAN 2 — LKPD DETAIL */}
            {lampiran.lkpd_detail && (
              <div className="mb-8 avoid-break">
                <table className="pdf-table">
                  <thead>
                    <tr>
                      <th colSpan={3} className="header-lampiran">Lampiran 2 — Lembar Kerja Peserta Didik (LKPD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* LKPD Pertemuan 1 */}
                    <tr>
                      <td colSpan={3} className="bg-slate-100 font-bold text-indigo-900 text-sm">
                        {lampiran.lkpd_detail.pertemuan_1.judul}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="text-xs text-slate-600 bg-slate-50">
                        <strong>Tujuan:</strong> {lampiran.lkpd_detail.pertemuan_1.tujuan}
                      </td>
                    </tr>
                    {lampiran.lkpd_detail.pertemuan_1.tahapan.map((th) => (
                      <tr key={th.no}>
                        <td style={{ width: '8%' }} className="text-center font-bold">{th.no}</td>
                        <td style={{ width: '25%' }} className="font-bold text-slate-800">{th.judul}</td>
                        <td className="text-[9pt]">{th.instruksi}</td>
                      </tr>
                    ))}

                    {/* LKPD Pertemuan 2 */}
                    <tr>
                      <td colSpan={3} className="bg-slate-100 font-bold text-indigo-900 text-sm pt-4">
                        {lampiran.lkpd_detail.pertemuan_2.judul}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="text-xs text-slate-600 bg-slate-50">
                        <strong>Tujuan:</strong> {lampiran.lkpd_detail.pertemuan_2.tujuan}
                      </td>
                    </tr>
                    {lampiran.lkpd_detail.pertemuan_2.tahapan.map((th) => (
                      <tr key={th.no}>
                        <td style={{ width: '8%' }} className="text-center font-bold">{th.no}</td>
                        <td style={{ width: '25%' }} className="font-bold text-slate-800">{th.judul}</td>
                        <td className="text-[9pt]">{th.instruksi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* LAMPIRAN 3 — ASESMEN AWAL (DIAGNOSTIK) */}
            {lampiran.asesmen_awal_detail && (
              <div className="mb-8 avoid-break">
                <table className="pdf-table">
                  <thead>
                    <tr>
                      <th colSpan={3} className="header-lampiran">Lampiran 3 — Instrumen Asesmen Awal (Diagnostik)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={3} className="bg-amber-50 text-amber-900 font-semibold text-xs p-2.5">
                        {lampiran.asesmen_awal_detail.petunjuk}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="font-bold bg-slate-100 text-slate-800 text-xs">
                        Bagian A: Pertanyaan Eksplorasi
                      </td>
                    </tr>
                    {lampiran.asesmen_awal_detail.pertanyaan.map((pt, idx) => (
                      <tr key={idx}>
                        <td colSpan={3} className="text-[9.5pt] p-2">{pt}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3} className="font-bold bg-slate-100 text-slate-800 text-xs">
                        Panduan Interpretasi untuk Guru
                      </td>
                    </tr>
                    <tr className="bg-slate-50 font-bold text-[9pt]">
                      <td style={{ width: '15%' }}>Rentang Skor</td>
                      <td style={{ width: '35%' }}>Kategori Pengetahuan Awal</td>
                      <td style={{ width: '50%' }}>Tindak Lanjut yang Disarankan</td>
                    </tr>
                    {lampiran.asesmen_awal_detail.panduan_interpretasi.map((pi, idx) => (
                      <tr key={idx}>
                        <td className="font-bold text-center">{pi.skor}</td>
                        <td className="font-semibold text-slate-800">{pi.kategori}</td>
                        <td className="text-[9pt]">{pi.tindak_lanjut}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* LAMPIRAN 4 — ASESMEN PROSES (FORMATIF) */}
            {lampiran.asesmen_proses_detail && (
              <div className="mb-8 avoid-break">
                <table className="pdf-table">
                  <thead>
                    <tr>
                      <th colSpan={3} className="header-lampiran">Lampiran 4 — Instrumen Asesmen Proses (Formatif)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={3} className="font-bold bg-slate-100 text-slate-800 text-xs">
                        A. Lembar Observasi Sikap — Dimensi Profil Lulusan
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="text-[9pt] p-2">
                        Dimensi yang diamati: <strong>{lampiran.asesmen_proses_detail.dimensi_observasi.join(', ')}</strong>.
                        Guru menggunakan skala 1 (Perlu Bimbingan), 2 (Cukup), 3 (Baik), 4 (Sangat Baik) saat siswa beraktivitas kelompok.
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="font-bold bg-slate-100 text-slate-800 text-xs">
                        B. Checklist Kinerja — Pertemuan ke-1 & ke-2
                      </td>
                    </tr>
                    <tr className="bg-slate-50 font-bold text-[9pt]">
                      <td style={{ width: '8%' }}>No</td>
                      <td style={{ width: '62%' }}>Indikator Kinerja yang Diamati</td>
                      <td style={{ width: '30%' }}>Keterlaksanaan (Ya/Tidak)</td>
                    </tr>
                    {lampiran.asesmen_proses_detail.checklist_p1.map((item, idx) => (
                      <tr key={idx}>
                        <td className="text-center font-bold">{idx + 1}</td>
                        <td className="text-[9pt]">{item}</td>
                        <td className="text-center text-xs text-slate-500">☐ Ya &nbsp; ☐ Tidak</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3} className="font-bold bg-slate-100 text-slate-800 text-xs">
                        C. Penilaian Sejawat (Peer Assessment)
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="text-[9pt] p-2">
                        Aspek yang dinilai antar siswa dalam kelompok: {lampiran.asesmen_proses_detail.peer_assessment_aspek.join(', ')}.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* LAMPIRAN 5 — ASESMEN AKHIR (SUMATIF) */}
            {lampiran.asesmen_akhir_detail && (
              <div className="mb-8 avoid-break">
                <table className="pdf-table">
                  <thead>
                    <tr>
                      <th colSpan={3} className="header-lampiran">Lampiran 5 — Instrumen Asesmen Akhir (Sumatif)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={3} className="bg-emerald-50 text-emerald-900 font-semibold text-xs p-2">
                        {lampiran.asesmen_akhir_detail.petunjuk}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="font-bold bg-slate-100 text-slate-800 text-xs">
                        Bagian A — Pilihan Ganda (5 Soal × 2 = 10 Poin)
                      </td>
                    </tr>
                    {lampiran.asesmen_akhir_detail.pilihan_ganda.map((pg) => (
                      <tr key={pg.no}>
                        <td colSpan={3} className="p-2.5 text-[9.5pt]">
                          <div className="font-semibold text-slate-900">{pg.no}. {pg.soal}</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[9pt] mt-1 pl-3 text-slate-700">
                            <div>A. {pg.pilihan.a}</div>
                            <div>B. {pg.pilihan.b}</div>
                            <div>C. {pg.pilihan.c}</div>
                            <div>D. {pg.pilihan.d}</div>
                          </div>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3} className="font-bold bg-slate-100 text-slate-800 text-xs">
                        Bagian B — Isian Singkat (3 Soal × 5 = 15 Poin)
                      </td>
                    </tr>
                    {lampiran.asesmen_akhir_detail.isian_singkat.map((is) => (
                      <tr key={is.no}>
                        <td colSpan={3} className="p-2 text-[9.5pt]">
                          <strong>{is.no}.</strong> {is.soal}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3} className="font-bold bg-slate-100 text-slate-800 text-xs">
                        Bagian C — Uraian Esai (1 Soal × 25 = 25 Poin)
                      </td>
                    </tr>
                    {lampiran.asesmen_akhir_detail.uraian_esai.map((ue) => (
                      <tr key={ue.no}>
                        <td colSpan={3} className="p-2.5 text-[9.5pt] bg-amber-50/40">
                          <strong>{ue.no}.</strong> {ue.soal}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3} className="font-bold bg-slate-100 text-slate-800 text-xs">
                        Kisi-Kisi & Kunci Pedoman Penskoran (Total Skor Maks = 50, Nilai Akhir = Skor × 2)
                      </td>
                    </tr>
                    <tr className="bg-slate-50 font-bold text-[9pt]">
                      <td style={{ width: '15%' }}>No. Soal</td>
                      <td style={{ width: '65%' }}>Pedoman Penskoran</td>
                      <td style={{ width: '20%' }}>Skor Maks</td>
                    </tr>
                    {lampiran.asesmen_akhir_detail.kisi_kisi.map((kk, idx) => (
                      <tr key={idx}>
                        <td className="font-bold text-center">{kk.soal}</td>
                        <td className="text-[9pt]">{kk.pedoman}</td>
                        <td className="text-center font-bold">{kk.skor_maks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* LAMPIRAN 6 — RUBRIK PENILAIAN LENGKAP */}
            {lampiran.rubrik_lengkap && (
              <div className="mb-8 avoid-break">
                <table className="pdf-table">
                  <thead>
                    <tr>
                      <th colSpan={5} className="header-lampiran">Lampiran 6 — Rubrik Penilaian Lengkap</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={5} className="font-bold bg-slate-100 text-slate-800 text-xs">
                        A. Rubrik Penilaian Dimensi Profil Lulusan
                      </td>
                    </tr>
                    <tr className="bg-slate-50 font-bold text-[8.5pt]">
                      <td style={{ width: '22%' }}>Dimensi</td>
                      <td style={{ width: '19.5%' }}>Skor 4 (Sangat Baik)</td>
                      <td style={{ width: '19.5%' }}>Skor 3 (Baik)</td>
                      <td style={{ width: '19.5%' }}>Skor 2 (Cukup)</td>
                      <td style={{ width: '19.5%' }}>Skor 1 (Perlu Bimbingan)</td>
                    </tr>
                    {lampiran.rubrik_lengkap.rubrik_dimensi.map((rd, idx) => (
                      <tr key={idx} className="text-[8.5pt]">
                        <td className="font-bold text-indigo-900">{rd.dimensi}</td>
                        <td>{rd.skor_4}</td>
                        <td>{rd.skor_3}</td>
                        <td>{rd.skor_2}</td>
                        <td>{rd.skor_1}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={5} className="font-bold bg-slate-100 text-slate-800 text-xs">
                        B. Konversi Skor & Kriteria Ketuntasan (KKTP)
                      </td>
                    </tr>
                    <tr className="bg-slate-50 font-bold text-[8.5pt]">
                      <td>Rentang Skor</td>
                      <td>Nilai & Predikat</td>
                      <td>Ketercapaian</td>
                      <td colSpan={2}>Tindak Lanjut yang Direkomendasikan</td>
                    </tr>
                    {lampiran.rubrik_lengkap.konversi_skor.map((ks, idx) => (
                      <tr key={idx} className="text-[8.5pt]">
                        <td className="font-bold text-center">{ks.rentang}</td>
                        <td className="font-semibold">{ks.nilai} ({ks.predikat})</td>
                        <td>{ks.ketercapaian}</td>
                        <td colSpan={2}>{ks.tindak_lanjut}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* LAMPIRAN 7 — LEMBAR REFLEKSI MANDIRI SISWA */}
            {lampiran.refleksi_mandiri && (
              <div className="mb-8 avoid-break">
                <table className="pdf-table">
                  <thead>
                    <tr>
                      <th colSpan={2} className="header-lampiran">Lampiran 7 — Lembar Refleksi Mandiri Peserta Didik</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={2} className="bg-purple-50 text-purple-900 font-semibold text-xs p-2">
                        {lampiran.refleksi_mandiri.petunjuk}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="font-bold bg-slate-100 text-slate-800 text-xs">
                        Bagian 1: Mengevaluasi Hasil Belajar
                      </td>
                    </tr>
                    {lampiran.refleksi_mandiri.evaluasi_hasil.map((eh, idx) => (
                      <tr key={idx}>
                        <td colSpan={2} className="text-[9.5pt] p-2">{eh}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={2} className="font-bold bg-slate-100 text-slate-800 text-xs">
                        Bagian 2: Mengevaluasi Proses Belajar
                      </td>
                    </tr>
                    {lampiran.refleksi_mandiri.evaluasi_proses.map((ep, idx) => (
                      <tr key={idx}>
                        <td colSpan={2} className="text-[9.5pt] p-2">{ep}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={2} className="font-bold bg-slate-100 text-slate-800 text-xs">
                        Bagian 3: Penilaian Diri
                      </td>
                    </tr>
                    {lampiran.refleksi_mandiri.penilaian_diri.map((pd, idx) => (
                      <tr key={idx}>
                        <td style={{ width: '70%' }} className="text-[9pt]">{pd}</td>
                        <td style={{ width: '30%' }} className="text-center text-xs text-slate-500">
                          ☐ 1 &nbsp; ☐ 2 &nbsp; ☐ 3 &nbsp; ☐ 4
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* LAMPIRAN 8 — LEMBAR OBSERVASI & CATATAN GURU */}
            {lampiran.observasi_guru && (
              <div className="mb-8 avoid-break">
                <table className="pdf-table">
                  <thead>
                    <tr>
                      <th colSpan={3} className="header-lampiran">Lampiran 8 — Lembar Observasi & Catatan Guru</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={3} className="font-bold bg-slate-100 text-slate-800 text-xs">
                        A. Observasi Pelaksanaan Pembelajaran
                      </td>
                    </tr>
                    <tr className="bg-slate-50 font-bold text-[9pt]">
                      <td style={{ width: '8%' }}>No</td>
                      <td style={{ width: '67%' }}>Aspek yang Diamati</td>
                      <td style={{ width: '25%' }}>Keterlaksanaan</td>
                    </tr>
                    {lampiran.observasi_guru.aspek_pelaksanaan.map((asp, idx) => (
                      <tr key={idx}>
                        <td className="text-center font-bold">{idx + 1}</td>
                        <td className="text-[9pt]">{asp}</td>
                        <td className="text-center text-xs text-slate-500">☐ Terlaksana &nbsp; ☐ Belum</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3} className="font-bold bg-slate-100 text-slate-800 text-xs">
                        B. Evaluasi & Rencana Perbaikan
                      </td>
                    </tr>
                    {lampiran.observasi_guru.evaluasi_rencana_perbaikan.map((ev, idx) => (
                      <tr key={idx}>
                        <td colSpan={3} className="text-[9.5pt] p-2">▸ {ev}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* LAMPIRAN 9 — LEMBAR OBSERVASI INTERNALISASI NILAI PANCA CINTA (KBC) */}
            {lampiran.observasi_kbc && (
              <div className="mb-8 avoid-break">
                <table className="pdf-table">
                  <thead>
                    <tr>
                      <th colSpan={3} className="header-kbc">Lampiran 9 — Lembar Observasi Internalisasi Nilai Panca Cinta (KBC)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={3} className="bg-rose-50 text-rose-900 font-semibold text-xs p-2.5">
                        {lampiran.observasi_kbc.petunjuk}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="font-bold bg-slate-100 text-slate-800 text-xs">
                        A. Topik Panca Cinta yang Diinsersi pada Materi Ini
                      </td>
                    </tr>
                    {lampiran.observasi_kbc.topik_insersi.map((ti, idx) => (
                      <tr key={idx}>
                        <td style={{ width: '25%' }} className="font-bold text-[#be185d]">{ti.nilai}</td>
                        <td style={{ width: '35%' }} className="text-xs text-slate-700"><strong>Nilai Inti:</strong> {ti.nilai_inti}</td>
                        <td style={{ width: '40%' }} className="text-[9pt] text-justify">{ti.insersi_materi}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3} className="font-bold bg-slate-100 text-slate-800 text-xs">
                        B. Rubrik Internalisasi Nilai Panca Cinta
                      </td>
                    </tr>
                    <tr className="bg-slate-50 font-bold text-[9pt]">
                      <td style={{ width: '15%' }}>Skor & Predikat</td>
                      <td colSpan={2}>Deskripsi Perilaku yang Teramati</td>
                    </tr>
                    {lampiran.observasi_kbc.rubrik_internalisasi.map((ri) => (
                      <tr key={ri.skor}>
                        <td className="font-bold text-center">Skor {ri.skor} ({ri.predikat})</td>
                        <td colSpan={2} className="text-[9pt]">{ri.deskripsi}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3} className="font-bold bg-slate-100 text-slate-800 text-xs">
                        C. Refleksi Guru atas Insersi Panca Cinta
                      </td>
                    </tr>
                    {lampiran.observasi_kbc.refleksi_guru.map((rg, idx) => (
                      <tr key={idx}>
                        <td colSpan={3} className="text-[9.5pt] p-2">▸ {rg}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3} className="bg-slate-50 text-xs text-slate-600 p-2 italic">
                        {lampiran.observasi_kbc.iklim_budaya}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RPMResult;
