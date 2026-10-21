import React, { useState, useEffect } from 'react';
import { EducationLevel, PedagogyType, GraduateDimension, PancaCinta, RPMFormData } from '../types';
import { 
  Loader2, User, BookOpen, Clock, CheckCircle, Sparkles, Check,
  HeartHandshake, Flag, BrainCircuit, Palette, Users, UserCheck, Activity, MessageCircle,
  MoonStar, Leaf, MapPinned, Heart, SlidersHorizontal, Target, Layers, CheckSquare, FileText,
  Sliders, Lightbulb, HelpCircle
} from 'lucide-react';

interface Props {
  onSubmit: (data: RPMFormData) => void;
  isLoading: boolean;
}

const DEFAULT_ASSESSMENT_METHODS = [
  'Kuis Interaktif / Formatif Cepat',
  'Proyek Portofolio Kelompok (PjBL)',
  'Presentasi & Unjuk Kerja',
  'Tes Tertulis (Pilihan Ganda & Esai)',
  'Observasi Sikap & Lembar Jurnal Refleksi',
  'Penilaian Antarteman (Peer Assessment)'
];

const DEFAULT_TARGET_GROUPS = [
  'Kelompok Mahir / Cepat',
  'Kelompok Reguler / Sedang',
  'Kelompok Perlu Bimbingan / Khusus'
];

const RPMForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<RPMFormData>({
    schoolName: '',
    teacherName: '',
    teacherNIP: '',
    principalName: '',
    principalNIP: '',
    level: EducationLevel.SD,
    gradeClass: '',
    fase: 'A',
    semester: 'I (Satu)',
    academicYear: '2025/2026',
    subject: '',
    cp: '',
    tp: '',
    material: '',
    meetingCount: 1,
    duration: '',
    pedagogies: [PedagogyType.InkuiriDiscovery],
    dimensions: [],
    pancaCinta: [],
    assessmentMethods: [
      'Kuis Interaktif / Formatif Cepat',
      'Proyek Portofolio Kelompok (PjBL)',
      'Presentasi & Unjuk Kerja'
    ],
    timeAllocations: {
      pendahuluan: 10,
      inti: 55,
      penutup: 15,
      perTopicDuration: ''
    },
    differentiation: {
      enabled: true,
      content: 'Penyediaan bahan ajar bertingkat (ringkasan visual, kartu konsep, dan materi pengayaan)',
      process: 'Pengelompokan fleksibel, tutor sebaya, dan scaffolding intensif dari guru',
      product: 'Pilihan karya akhir (poster/infografis, demonstrasi langsung, rekaman mini, atau laporan tertulis)',
      targetGroups: ['Kelompok Mahir / Cepat', 'Kelompok Reguler / Sedang', 'Kelompok Perlu Bimbingan / Khusus']
    }
  });

  // Update pedagogies array when meeting count changes
  useEffect(() => {
    setFormData(prev => {
      const currentLength = prev.pedagogies.length;
      if (prev.meetingCount > currentLength) {
        const diff = prev.meetingCount - currentLength;
        return {
          ...prev,
          pedagogies: [...prev.pedagogies, ...Array(diff).fill(PedagogyType.InkuiriDiscovery)]
        };
      } else if (prev.meetingCount < currentLength) {
        return {
          ...prev,
          pedagogies: prev.pedagogies.slice(0, prev.meetingCount)
        };
      }
      return prev;
    });
  }, [formData.meetingCount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDimensionChange = (dim: string) => {
    setFormData(prev => {
      const exists = prev.dimensions.includes(dim);
      if (exists) {
        return { ...prev, dimensions: prev.dimensions.filter(d => d !== dim) };
      }
      return { ...prev, dimensions: [...prev.dimensions, dim] };
    });
  };

  const handlePancaCintaChange = (val: string) => {
    setFormData(prev => {
      const exists = prev.pancaCinta.includes(val);
      if (exists) {
        return { ...prev, pancaCinta: prev.pancaCinta.filter(d => d !== val) };
      }
      return { ...prev, pancaCinta: [...prev.pancaCinta, val] };
    });
  };

  const handlePedagogyChange = (index: number, value: string) => {
    const newPedagogies = [...formData.pedagogies];
    newPedagogies[index] = value;
    setFormData(prev => ({ ...prev, pedagogies: newPedagogies }));
  };

  // Handlers for Advanced Customization
  const handleAssessmentMethodToggle = (method: string) => {
    setFormData(prev => {
      const current = prev.assessmentMethods || [];
      const exists = current.includes(method);
      const updated = exists ? current.filter(m => m !== method) : [...current, method];
      return { ...prev, assessmentMethods: updated };
    });
  };

  const handleTimeAllocationChange = (field: 'pendahuluan' | 'inti' | 'penutup', value: number) => {
    setFormData(prev => ({
      ...prev,
      timeAllocations: {
        pendahuluan: prev.timeAllocations?.pendahuluan ?? 10,
        inti: prev.timeAllocations?.inti ?? 55,
        penutup: prev.timeAllocations?.penutup ?? 15,
        perTopicDuration: prev.timeAllocations?.perTopicDuration || '',
        [field]: Math.max(1, value)
      }
    }));
  };

  const handleTopicDurationChange = (val: string) => {
    setFormData(prev => ({
      ...prev,
      timeAllocations: {
        pendahuluan: prev.timeAllocations?.pendahuluan ?? 10,
        inti: prev.timeAllocations?.inti ?? 55,
        penutup: prev.timeAllocations?.penutup ?? 15,
        perTopicDuration: val
      }
    }));
  };

  const handleDifferentiationToggle = () => {
    setFormData(prev => ({
      ...prev,
      differentiation: {
        enabled: !prev.differentiation?.enabled,
        content: prev.differentiation?.content || '',
        process: prev.differentiation?.process || '',
        product: prev.differentiation?.product || '',
        targetGroups: prev.differentiation?.targetGroups || DEFAULT_TARGET_GROUPS
      }
    }));
  };

  const handleDifferentiationTextChange = (field: 'content' | 'process' | 'product', val: string) => {
    setFormData(prev => ({
      ...prev,
      differentiation: {
        enabled: prev.differentiation?.enabled ?? true,
        content: prev.differentiation?.content || '',
        process: prev.differentiation?.process || '',
        product: prev.differentiation?.product || '',
        targetGroups: prev.differentiation?.targetGroups || DEFAULT_TARGET_GROUPS,
        [field]: val
      }
    }));
  };

  const handleTargetGroupToggle = (group: string) => {
    setFormData(prev => {
      const current = prev.differentiation?.targetGroups || [];
      const exists = current.includes(group);
      const updated = exists ? current.filter(g => g !== group) : [...current, group];
      return {
        ...prev,
        differentiation: {
          enabled: prev.differentiation?.enabled ?? true,
          content: prev.differentiation?.content || '',
          process: prev.differentiation?.process || '',
          product: prev.differentiation?.product || '',
          targetGroups: updated
        }
      };
    });
  };

  const getClassOptions = () => {
    if (formData.level === EducationLevel.SD) return ['1', '2', '3', '4', '5', '6'];
    if (formData.level === EducationLevel.SMP) return ['7', '8', '9'];
    return ['10', '11', '12'];
  };
  
  const getFaseOptions = () => ['A', 'B', 'C', 'D', 'E', 'F'];

  const handleLoadExample = () => {
    setFormData({
      schoolName: 'MIN 1 Banyuwangi',
      principalName: 'Drs. H. Mohammad Safroni, M.Pd.I',
      principalNIP: '197103151998031002',
      teacherName: 'Nurul Hidayati, S.Pd.',
      teacherNIP: '198504202011012015',
      level: EducationLevel.SD,
      gradeClass: '4',
      fase: 'B',
      semester: 'I (Satu)',
      academicYear: '2025/2026',
      subject: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
      cp: 'Peserta didik mampu mengidentifikasi wujud zat (padat, cair, gas), memahami karakteristik dan susunan partikelnya, serta menganalisis perubahan wujud zat dalam kehidupan sehari-hari melalui proses inkuiri berkesadaran.',
      tp: 'Melalui penyelidikan ilmiah dan kolaborasi kelompok, peserta didik dapat membuktikan sifat serta perubahan wujud zat, dan mengaitkannya dengan rasa syukur atas keteraturan ciptaan Allah Swt.',
      material: 'Wujud Zat dan Perubahannya',
      meetingCount: 2,
      duration: '2 Pertemuan (2 x 35 menit)',
      pedagogies: [PedagogyType.InkuiriDiscovery, PedagogyType.ProblemSolving],
      dimensions: [
        GraduateDimension.Keimanan,
        GraduateDimension.Kritis,
        GraduateDimension.Kolaborasi,
        GraduateDimension.Kreativitas
      ],
      pancaCinta: [
        PancaCinta.AllahRasul,
        PancaCinta.Ilmu,
        PancaCinta.Lingkungan
      ],
      assessmentMethods: [
        'Kuis Interaktif / Formatif Cepat',
        'Proyek Portofolio Kelompok (PjBL)',
        'Presentasi & Unjuk Kerja',
        'Observasi Sikap & Lembar Jurnal Refleksi'
      ],
      timeAllocations: {
        pendahuluan: 10,
        inti: 45,
        penutup: 15,
        perTopicDuration: 'Pertemuan 1: Sifat Padat & Cair (35 mnt); Pertemuan 2: Wujud Gas & Perubahan (35 mnt)'
      },
      differentiation: {
        enabled: true,
        content: 'Bahan ajar teks bergambar untuk pemahaman dasar, kartu eksperimen mandiri, dan artikel penyelidikan kontekstual.',
        process: 'Kelompok heterogen dengan tutor sebaya; guru mendampingi intensif kelompok yang butuh penguatan konsep wujud zat.',
        product: 'Siswa dapat memilih membuat poster siklus wujud zat, rekaman video demonstrasi mencair/membeku, atau lembar laporan LKPD.',
        targetGroups: ['Kelompok Mahir / Cepat', 'Kelompok Reguler / Sedang', 'Kelompok Perlu Bimbingan / Khusus']
      }
    });
  };

  const handleResetForm = () => {
    setFormData({
      schoolName: '',
      teacherName: '',
      teacherNIP: '',
      principalName: '',
      principalNIP: '',
      level: EducationLevel.SD,
      gradeClass: '',
      fase: 'A',
      semester: 'I (Satu)',
      academicYear: '2025/2026',
      subject: '',
      cp: '',
      tp: '',
      material: '',
      meetingCount: 1,
      duration: '',
      pedagogies: [PedagogyType.InkuiriDiscovery],
      dimensions: [],
      pancaCinta: [],
      assessmentMethods: [
        'Kuis Interaktif / Formatif Cepat',
        'Proyek Portofolio Kelompok (PjBL)',
        'Presentasi & Unjuk Kerja'
      ],
      timeAllocations: {
        pendahuluan: 10,
        inti: 55,
        penutup: 15,
        perTopicDuration: ''
      },
      differentiation: {
        enabled: true,
        content: '',
        process: '',
        product: '',
        targetGroups: DEFAULT_TARGET_GROUPS
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // --- STYLING HELPERS & CONFIG ---
  
  const getCardStyle = () => {
    return "shadow-xl rounded-2xl transition-all duration-300 relative overflow-hidden bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700";
  };

  const getInputClass = (variant: '1' | '2' | '3') => {
    const base = "w-full rounded-lg shadow-sm p-3 border transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium";
    const variants = {
        '1': 'bg-blue-50/50 dark:bg-slate-900 border-blue-200 dark:border-slate-600 focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
        '2': 'bg-emerald-50/50 dark:bg-slate-900 border-emerald-200 dark:border-slate-600 focus:bg-white dark:focus:bg-slate-950 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
        '3': 'bg-violet-50/50 dark:bg-slate-900 border-violet-200 dark:border-slate-600 focus:bg-white dark:focus:bg-slate-950 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20',
    };
    return `${base} ${variants[variant]}`;
  };

  const SectionHeader = ({ title, icon: Icon, variant, subtitle }: { title: string, icon: any, variant: '1' | '2' | '3', subtitle: string }) => {
    const gradients = {
        '1': 'from-blue-600 to-indigo-600',
        '2': 'from-emerald-600 to-teal-600',
        '3': 'from-violet-600 to-fuchsia-600'
    };

    return (
        <div className={`bg-gradient-to-r ${gradients[variant]} p-6 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
            <div className="flex items-center gap-4 relative z-10 text-white">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm shadow-inner">
                    <Icon size={28} strokeWidth={2.5} className="text-white" />
                </div>
                <div>
                     <h3 className="text-xl font-bold tracking-tight text-white shadow-sm">{title}</h3>
                     <p className="text-xs text-blue-50/90 font-medium uppercase tracking-wider mt-0.5">{subtitle}</p>
                </div>
            </div>
        </div>
    );
  };

  // Configuration for Graduate Dimensions
  const graduateDimensionConfig: Record<string, { icon: any, colorClass: string, bgClass: string, borderClass: string, iconBg: string }> = {
    [GraduateDimension.Keimanan]: { 
      icon: HeartHandshake, 
      colorClass: 'text-emerald-800 dark:text-emerald-200', 
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/40', 
      borderClass: 'border-emerald-500 dark:border-emerald-500/80 ring-1 ring-emerald-500/20',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
    },
    [GraduateDimension.Kewargaan]: { 
      icon: Flag, 
      colorClass: 'text-red-800 dark:text-red-200', 
      bgClass: 'bg-red-50 dark:bg-red-950/40', 
      borderClass: 'border-red-500 dark:border-red-500/80 ring-1 ring-red-500/20',
      iconBg: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300'
    },
    [GraduateDimension.Kritis]: { 
      icon: BrainCircuit, 
      colorClass: 'text-amber-800 dark:text-amber-200', 
      bgClass: 'bg-amber-50 dark:bg-amber-950/40', 
      borderClass: 'border-amber-500 dark:border-amber-500/80 ring-1 ring-amber-500/20',
      iconBg: 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
    },
    [GraduateDimension.Kreativitas]: { 
      icon: Palette, 
      colorClass: 'text-purple-800 dark:text-purple-200', 
      bgClass: 'bg-purple-50 dark:bg-purple-950/40', 
      borderClass: 'border-purple-500 dark:border-purple-500/80 ring-1 ring-purple-500/20',
      iconBg: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300'
    },
    [GraduateDimension.Kolaborasi]: { 
      icon: Users, 
      colorClass: 'text-blue-800 dark:text-blue-200', 
      bgClass: 'bg-blue-50 dark:bg-blue-950/40', 
      borderClass: 'border-blue-500 dark:border-blue-500/80 ring-1 ring-blue-500/20',
      iconBg: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300'
    },
    [GraduateDimension.Kemandirian]: { 
      icon: UserCheck, 
      colorClass: 'text-orange-800 dark:text-orange-200', 
      bgClass: 'bg-orange-50 dark:bg-orange-950/40', 
      borderClass: 'border-orange-500 dark:border-orange-500/80 ring-1 ring-orange-500/20',
      iconBg: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300'
    },
    [GraduateDimension.Kesehatan]: { 
      icon: Activity, 
      colorClass: 'text-rose-800 dark:text-rose-200', 
      bgClass: 'bg-rose-50 dark:bg-rose-950/40', 
      borderClass: 'border-rose-500 dark:border-rose-500/80 ring-1 ring-rose-500/20',
      iconBg: 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300'
    },
    [GraduateDimension.Komunikasi]: { 
      icon: MessageCircle, 
      colorClass: 'text-cyan-800 dark:text-cyan-200', 
      bgClass: 'bg-cyan-50 dark:bg-cyan-950/40', 
      borderClass: 'border-cyan-500 dark:border-cyan-500/80 ring-1 ring-cyan-500/20',
      iconBg: 'bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300'
    },
  };

  // Configuration for Panca Cinta
  const pancaCintaConfig: Record<string, { icon: any, colorClass: string, bgClass: string, borderClass: string, iconBg: string }> = {
    [PancaCinta.AllahRasul]: { 
      icon: MoonStar, 
      colorClass: 'text-teal-800 dark:text-teal-200', 
      bgClass: 'bg-teal-50 dark:bg-teal-950/40', 
      borderClass: 'border-teal-500 dark:border-teal-500/80 ring-1 ring-teal-500/20',
      iconBg: 'bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300'
    },
    [PancaCinta.Ilmu]: { 
      icon: BookOpen, 
      colorClass: 'text-indigo-800 dark:text-indigo-200', 
      bgClass: 'bg-indigo-50 dark:bg-indigo-950/40', 
      borderClass: 'border-indigo-500 dark:border-indigo-500/80 ring-1 ring-indigo-500/20',
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
    },
    [PancaCinta.DiriSesama]: { 
      icon: Heart, 
      colorClass: 'text-pink-800 dark:text-pink-200', 
      bgClass: 'bg-pink-50 dark:bg-pink-950/40', 
      borderClass: 'border-pink-500 dark:border-pink-500/80 ring-1 ring-pink-500/20',
      iconBg: 'bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300'
    },
    [PancaCinta.Lingkungan]: { 
      icon: Leaf, 
      colorClass: 'text-green-800 dark:text-green-200', 
      bgClass: 'bg-green-50 dark:bg-green-950/40', 
      borderClass: 'border-green-500 dark:border-green-500/80 ring-1 ring-green-500/20',
      iconBg: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300'
    },
    [PancaCinta.TanahAir]: { 
      icon: MapPinned, 
      colorClass: 'text-red-800 dark:text-red-200', 
      bgClass: 'bg-red-50 dark:bg-red-950/40', 
      borderClass: 'border-red-600 dark:border-red-500/80 ring-1 ring-red-500/20',
      iconBg: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300'
    },
  };

  const labelClass = "block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 tracking-wide flex items-center gap-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      
      {/* Quick Action & Guarantee Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <Sparkles size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
              <span>Sistem Anti-Gagal & Efisiensi Token</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-extrabold uppercase">
                100% Terverifikasi
              </span>
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Menghasilkan dokumen resmi 23 halaman siap unduh Word & PDF tanpa risiko pemborosan token.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleLoadExample}
            className="text-xs font-bold px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={14} />
            <span>Muat Contoh Lengkap (1-Klik)</span>
          </button>
          <button
            type="button"
            onClick={handleResetForm}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            Bersihkan
          </button>
        </div>
      </div>

      {/* Section 1: Data Identitas */}
      <div className={getCardStyle()}>
        <SectionHeader 
          title="Data Pendidik & Sekolah" 
          subtitle="Identitas Guru & Kepala Sekolah"
          icon={User} 
          variant="1"
        />
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className={labelClass}>Nama Satuan Pendidikan <span className="text-red-500">*</span></label>
            <input required name="schoolName" value={formData.schoolName} onChange={handleChange} className={getInputClass('1')} placeholder="Contoh: MIN 1 Banyuwangi" />
          </div>
          <div>
            <label className={labelClass}>Nama Kepala Sekolah <span className="text-red-500">*</span></label>
            <input required name="principalName" value={formData.principalName} onChange={handleChange} className={getInputClass('1')} />
          </div>
          <div>
            <label className={labelClass}>NIP Kepala Sekolah <span className="text-red-500">*</span></label>
            <input required name="principalNIP" value={formData.principalNIP} onChange={handleChange} className={getInputClass('1')} />
          </div>
          <div>
            <label className={labelClass}>Nama Guru <span className="text-red-500">*</span></label>
            <input required name="teacherName" value={formData.teacherName} onChange={handleChange} className={getInputClass('1')} />
          </div>
          <div>
            <label className={labelClass}>NIP Guru <span className="text-red-500">*</span></label>
            <input required name="teacherNIP" value={formData.teacherNIP} onChange={handleChange} className={getInputClass('1')} />
          </div>
        </div>
      </div>

      {/* Section 2: Detail Kelas & Mata Pelajaran */}
      <div className={getCardStyle()}>
        <SectionHeader 
          title="Detail Pembelajaran" 
          subtitle="Kurikulum & Materi Ajar"
          icon={BookOpen} 
          variant="2"
        />
        <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
              <div>
                <label className={labelClass}>Jenjang <span className="text-red-500">*</span></label>
                <select name="level" value={formData.level} onChange={handleChange} className={getInputClass('2')}>
                  {Object.values(EducationLevel).map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Kelas <span className="text-red-500">*</span></label>
                <select required name="gradeClass" value={formData.gradeClass} onChange={handleChange} className={getInputClass('2')}>
                    <option value="">Pilih Kelas</option>
                    {getClassOptions().map(c => <option key={c} value={c}>Kelas {c}</option>)}
                </select>
              </div>
               <div>
                <label className={labelClass}>Fase <span className="text-red-500">*</span></label>
                <select required name="fase" value={formData.fase} onChange={handleChange} className={getInputClass('2')}>
                    {getFaseOptions().map(f => <option key={f} value={f}>Fase {f}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Semester <span className="text-red-500">*</span></label>
                <select required name="semester" value={formData.semester} onChange={handleChange} className={getInputClass('2')}>
                    <option value="I (Satu)">I (Satu)</option>
                    <option value="II (Dua)">II (Dua)</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Tahun Ajaran <span className="text-red-500">*</span></label>
                <input required name="academicYear" value={formData.academicYear || '2025/2026'} onChange={handleChange} className={getInputClass('2')} placeholder="Contoh: 2025/2026" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className={labelClass}>Mata Pelajaran <span className="text-red-500">*</span></label>
                  <input required name="subject" value={formData.subject} onChange={handleChange} className={getInputClass('2')} placeholder="Contoh: Ilmu Pengetahuan Alam dan Sosial (IPAS)" />
                </div>
                <div>
                    <label className={labelClass}>Materi Pelajaran <span className="text-red-500">*</span></label>
                    <input required name="material" value={formData.material} onChange={handleChange} className={getInputClass('2')} placeholder="Contoh: Sistem Tata Surya" />
                </div>
                 <div>
                    <label className={labelClass}>Capaian Pembelajaran (CP) <span className="text-red-500">*</span></label>
                    <textarea required rows={3} name="cp" value={formData.cp} onChange={handleChange} className={getInputClass('2')} placeholder="Salin CP dari kurikulum..." />
                </div>
                 <div>
                    <label className={labelClass}>Tujuan Pembelajaran (TP) <span className="text-red-500">*</span></label>
                    <textarea required rows={3} name="tp" value={formData.tp} onChange={handleChange} className={getInputClass('2')} placeholder="Rumusan tujuan pembelajaran..." />
                </div>
            </div>
        </div>
      </div>

       {/* Section 3: Teknis Pelaksanaan */}
       <div className={getCardStyle()}>
        <SectionHeader 
          title="Strategi & Waktu" 
          subtitle="Metode, Waktu & Profil Pelajar"
          icon={Clock} 
          variant="3"
        />
        <div className="p-6 md:p-8 space-y-10">
            {/* Waktu & Pedagogi */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Jumlah Pertemuan <span className="text-red-500">*</span></label>
                            <input required type="number" min="1" max="20" name="meetingCount" value={formData.meetingCount} onChange={handleChange} className={getInputClass('3')} />
                        </div>
                        <div>
                            <label className={labelClass}>Alokasi Waktu <span className="text-red-500">*</span></label>
                            <input required name="duration" value={formData.duration} onChange={handleChange} className={getInputClass('3')} placeholder="Contoh: 2 x 35 Menit" />
                        </div>
                    </div>
                    
                    <div className="bg-violet-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-violet-100 dark:border-slate-700">
                        <label className="block text-sm font-extrabold text-violet-700 dark:text-violet-300 mb-4 uppercase tracking-wider flex items-center gap-2">
                            <Sparkles size={16} /> Praktik Pedagogis
                        </label>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {formData.pedagogies.map((pedagogy, idx) => (
                                <div key={idx} className="flex flex-col gap-2">
                                    <span className="text-xs font-bold text-violet-600 dark:text-violet-300 uppercase">Pertemuan {idx + 1}</span>
                                    <select 
                                        value={pedagogy} 
                                        onChange={(e) => handlePedagogyChange(idx, e.target.value)} 
                                        className={getInputClass('3')}
                                    >
                                        {Object.values(PedagogyType).map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Profil Lulusan & Panca Cinta Compact Layout */}
                <div className="space-y-6">
                    {/* Profil Lulusan */}
                    <div>
                        <div className="flex items-center justify-between mb-3 border-b pb-2 border-slate-200 dark:border-slate-700">
                          <label className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <CheckCircle size={17} className="text-violet-600 dark:text-violet-400"/> 
                            Dimensi Profil Lulusan
                          </label>
                          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-750 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                            {formData.dimensions.length > 0 ? `${formData.dimensions.length} dipilih` : 'Pilih yang relevan'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {Object.values(GraduateDimension).map(dim => {
                                const config = graduateDimensionConfig[dim] || { 
                                  icon: CheckCircle, 
                                  colorClass: 'text-slate-700 dark:text-slate-300', 
                                  bgClass: 'bg-slate-50 dark:bg-slate-800', 
                                  borderClass: 'border-violet-500', 
                                  iconBg: 'bg-slate-100 dark:bg-slate-700 text-slate-600' 
                                };
                                const isSelected = formData.dimensions.includes(dim);
                                const Icon = config.icon;

                                return (
                                    <label 
                                        key={dim} 
                                        className={`cursor-pointer group flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all duration-150 select-none text-left ${
                                            isSelected 
                                                ? `${config.bgClass} ${config.borderClass} shadow-xs font-semibold` 
                                                : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/80 dark:hover:bg-slate-750'
                                        }`}
                                    >
                                        <input 
                                            type="checkbox" 
                                            checked={isSelected} 
                                            onChange={() => handleDimensionChange(dim)} 
                                            className="sr-only"
                                        />
                                        <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                                            isSelected 
                                                ? config.iconBg 
                                                : 'bg-slate-100 dark:bg-slate-700/80 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                                        }`}>
                                            <Icon size={14} strokeWidth={2.2} />
                                        </div>
                                        <span className={`text-xs leading-tight flex-1 ${
                                            isSelected ? config.colorClass : 'text-slate-700 dark:text-slate-300'
                                        }`}>
                                            {dim}
                                        </span>
                                        <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all ${
                                            isSelected 
                                                ? 'bg-violet-600 text-white' 
                                                : 'border border-slate-300 dark:border-slate-600 group-hover:border-slate-400'
                                        }`}>
                                            {isSelected && <Check size={11} strokeWidth={3} />}
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Panca Cinta */}
                    <div>
                        <div className="flex items-center justify-between mb-3 border-b pb-2 border-slate-200 dark:border-slate-700">
                          <label className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <CheckCircle size={17} className="text-violet-600 dark:text-violet-400"/> 
                            5 Panca Cinta (Kemenag)
                          </label>
                          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-750 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                            {formData.pancaCinta.length > 0 ? `${formData.pancaCinta.length} dipilih` : 'Pilih yang relevan'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {Object.values(PancaCinta).map((val, idx) => {
                                const config = pancaCintaConfig[val] || { 
                                  icon: CheckCircle, 
                                  colorClass: 'text-slate-700 dark:text-slate-300', 
                                  bgClass: 'bg-slate-50 dark:bg-slate-800', 
                                  borderClass: 'border-violet-500', 
                                  iconBg: 'bg-slate-100 dark:bg-slate-700 text-slate-600' 
                                };
                                const isSelected = formData.pancaCinta.includes(val);
                                const Icon = config.icon;
                                const isLastOdd = idx === Object.values(PancaCinta).length - 1 && Object.values(PancaCinta).length % 2 !== 0;

                                return (
                                    <label 
                                        key={val} 
                                        className={`cursor-pointer group flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all duration-150 select-none text-left ${
                                            isLastOdd ? 'sm:col-span-2' : ''
                                        } ${
                                            isSelected 
                                                ? `${config.bgClass} ${config.borderClass} shadow-xs font-semibold` 
                                                : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/80 dark:hover:bg-slate-750'
                                        }`}
                                    >
                                        <input 
                                            type="checkbox" 
                                            checked={isSelected} 
                                            onChange={() => handlePancaCintaChange(val)} 
                                            className="sr-only"
                                        />
                                        <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                                            isSelected 
                                                ? config.iconBg 
                                                : 'bg-slate-100 dark:bg-slate-700/80 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                                        }`}>
                                            <Icon size={14} strokeWidth={2.2} />
                                        </div>
                                        <span className={`text-xs leading-tight flex-1 ${
                                            isSelected ? config.colorClass : 'text-slate-700 dark:text-slate-300'
                                        }`}>
                                            {val}
                                        </span>
                                        <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all ${
                                            isSelected 
                                                ? 'bg-violet-600 text-white' 
                                                : 'border border-slate-300 dark:border-slate-600 group-hover:border-slate-400'
                                        }`}>
                                            {isSelected && <Check size={11} strokeWidth={3} />}
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Section 4: Opsi Kustomisasi Lanjutan */}
      <div className={getCardStyle()}>
        <SectionHeader 
          title="Kustomisasi Lanjutan" 
          subtitle="Metode Penilaian Spesifik, Alokasi Durasi, & Diferensiasi Pembelajaran"
          icon={SlidersHorizontal} 
          variant="1"
        />
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Sub-section 1: Metode Penilaian Spesifik */}
          <div>
            <div className="flex items-center justify-between mb-2 border-b pb-2 border-slate-200 dark:border-slate-700">
              <label className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Target size={18} className="text-teal-600 dark:text-teal-400" />
                Metode Penilaian Spesifik
              </label>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {(formData.assessmentMethods || []).length} Metode Dipilih
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Pilih satu atau lebih teknik asesmen formatif/sumatif yang disesuaikan dengan kebutuhan belajar siswa:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {DEFAULT_ASSESSMENT_METHODS.map((method) => {
                const isSelected = (formData.assessmentMethods || []).includes(method);
                return (
                  <label
                    key={method}
                    className={`cursor-pointer group flex items-start gap-2.5 p-3 rounded-xl border transition-all duration-150 select-none text-left ${
                      isSelected
                        ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 dark:border-teal-500/80 shadow-xs font-semibold'
                        : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/80'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleAssessmentMethodToggle(method)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center flex-shrink-0 transition-all ${
                      isSelected
                        ? 'bg-teal-600 text-white'
                        : 'border border-slate-300 dark:border-slate-600 group-hover:border-slate-400'
                    }`}>
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </div>
                    <div className="flex-1">
                      <span className={`text-xs leading-tight block ${isSelected ? 'text-teal-900 dark:text-teal-200 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                        {method}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Sub-section 2: Alokasi Durasi Waktu Aktivitas & Topik */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-2 border-b pb-2 border-slate-200 dark:border-slate-700">
              <label className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Clock size={18} className="text-teal-600 dark:text-teal-400" />
                Alokasi Durasi Waktu Aktivitas & Topik
              </label>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300">
                Total: {(formData.timeAllocations?.pendahuluan ?? 10) + (formData.timeAllocations?.inti ?? 55) + (formData.timeAllocations?.penutup ?? 15)} Menit
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3.5">
              Tentukan pembagian durasi menit untuk setiap fase aktivitas agar proses belajar mengajar teralokasi dengan efisien:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  1. Pendahuluan (Memahami)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={5}
                    max={30}
                    step={5}
                    value={formData.timeAllocations?.pendahuluan ?? 10}
                    onChange={(e) => handleTimeAllocationChange('pendahuluan', parseInt(e.target.value) || 10)}
                    className="w-20 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 font-bold text-center text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                  />
                  <span className="text-xs font-medium text-slate-500">Menit</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">Apersepsi, pemantik & tujuan</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  2. Kegiatan Inti (Mengaplikasi)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={20}
                    max={120}
                    step={5}
                    value={formData.timeAllocations?.inti ?? 55}
                    onChange={(e) => handleTimeAllocationChange('inti', parseInt(e.target.value) || 55)}
                    className="w-20 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 font-bold text-center text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                  />
                  <span className="text-xs font-medium text-slate-500">Menit</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">Sintaks model & penyelidikan</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  3. Penutup (Merefleksi)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={5}
                    max={30}
                    step={5}
                    value={formData.timeAllocations?.penutup ?? 15}
                    onChange={(e) => handleTimeAllocationChange('penutup', parseInt(e.target.value) || 15)}
                    className="w-20 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 font-bold text-center text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                  />
                  <span className="text-xs font-medium text-slate-500">Menit</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">Sintesis, refleksi & doa</span>
              </div>
            </div>

            <div className="mt-3.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Catatan Alokasi Durasi per Topik / Sesi Khusus (Opsional):
              </label>
              <input
                type="text"
                value={formData.timeAllocations?.perTopicDuration || ''}
                onChange={(e) => handleTopicDurationChange(e.target.value)}
                placeholder="Contoh: Topik 1 Teori & Eksplorasi (35 mnt), Topik 2 Praktik & Diskusi (45 mnt)"
                className={getInputClass('1')}
              />
            </div>
          </div>

          {/* Sub-section 3: Strategi Diferensiasi Pembelajaran */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-2 border-b pb-2 border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-teal-600 dark:text-teal-400" />
                <label className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Strategi Diferensiasi Pembelajaran (Siswa Beragam)
                </label>
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-xs font-bold text-teal-800 dark:text-teal-200">
                  {formData.differentiation?.enabled ? 'Diferensiasi Aktif' : 'Non-aktif'}
                </span>
                <input
                  type="checkbox"
                  checked={formData.differentiation?.enabled ?? true}
                  onChange={handleDifferentiationToggle}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
                />
              </label>
            </div>

            {formData.differentiation?.enabled !== false && (
              <div className="space-y-4">
                {/* Target Groups */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Kelompok Sasaran Keragaman Kebutuhan Siswa:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DEFAULT_TARGET_GROUPS.map((group) => {
                      const isSelected = (formData.differentiation?.targetGroups || []).includes(group);
                      return (
                        <button
                          key={group}
                          type="button"
                          onClick={() => handleTargetGroupToggle(group)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-teal-100 dark:bg-teal-900/60 border-teal-400 text-teal-800 dark:text-teal-200 font-bold'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                          }`}
                        >
                          {isSelected && <Check size={12} strokeWidth={3} />}
                          <span>{group}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3 Pillars of Differentiation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-teal-800 dark:text-teal-300 mb-1">
                      1. Diferensiasi Konten
                    </label>
                    <textarea
                      rows={3}
                      value={formData.differentiation?.content || ''}
                      onChange={(e) => handleDifferentiationTextChange('content', e.target.value)}
                      placeholder="Bahan bacaan teks berjenjang, kartu konsep visual, infografis, atau materi pengayaan."
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-xs bg-white dark:bg-slate-750 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-teal-800 dark:text-teal-300 mb-1">
                      2. Diferensiasi Proses
                    </label>
                    <textarea
                      rows={3}
                      value={formData.differentiation?.process || ''}
                      onChange={(e) => handleDifferentiationTextChange('process', e.target.value)}
                      placeholder="Pengelompokan fleksibel, tutor sebaya, dan scaffolding intensif guru untuk kelompok bimbingan."
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-xs bg-white dark:bg-slate-750 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-teal-800 dark:text-teal-300 mb-1">
                      3. Diferensiasi Produk
                    </label>
                    <textarea
                      rows={3}
                      value={formData.differentiation?.product || ''}
                      onChange={(e) => handleDifferentiationTextChange('product', e.target.value)}
                      placeholder="Pilihan unjuk karya akhir: poster/infografis, demonstrasi langsung, rekaman mini, atau laporan tertulis."
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-xs bg-white dark:bg-slate-750 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      <div className="pt-4 sticky bottom-4 z-20">
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-emerald-600/25 transform transition hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg border-t border-white/20"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" /> Sedang Menyusun RPM...
            </>
          ) : (
            <>
              <Sparkles className="text-yellow-300 fill-yellow-300" /> Generate Rencana Pembelajaran
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default RPMForm;