import React, { useState, useEffect } from 'react';
import { EducationLevel, PedagogyType, GraduateDimension, PancaCinta, RPMFormData } from '../types';
import { Loader2, User, BookOpen, Clock, CheckCircle, Sparkles } from 'lucide-react';

interface Props {
  onSubmit: (data: RPMFormData) => void;
  isLoading: boolean;
}

const RPMForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<RPMFormData>({
    schoolName: '',
    teacherName: '',
    teacherNIP: '',
    principalName: '',
    principalNIP: '',
    level: EducationLevel.SD,
    gradeClass: '',
    subject: '',
    cp: '',
    tp: '',
    material: '',
    meetingCount: 1,
    duration: '',
    pedagogies: [PedagogyType.InkuiriDiscovery],
    dimensions: [],
    pancaCinta: [],
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

  const getClassOptions = () => {
    if (formData.level === EducationLevel.SD) return ['1', '2', '3', '4', '5', '6'];
    if (formData.level === EducationLevel.SMP) return ['7', '8', '9'];
    return ['10', '11', '12'];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // --- STYLING HELPERS ---
  
  // Section Headers with colorful accents
  const SectionHeader = ({ number, title, icon: Icon, colorClass, bgClass }: any) => (
    <h3 className={`text-xl font-bold ${colorClass} border-b border-black/10 dark:border-white/10 pb-3 flex items-center mb-6`}>
      <span className={`${bgClass} text-white w-10 h-10 rounded-xl flex items-center justify-center mr-3 text-sm shadow-md transform rotate-3 ring-2 ring-white dark:ring-slate-700`}>
        <Icon size={20} />
      </span>
      {title}
    </h3>
  );

  // Helper untuk membuat background card berbeda-beda
  const getCardStyle = (theme: 'blue' | 'emerald' | 'violet') => {
    const base = "shadow-xl rounded-2xl p-6 md:p-8 space-y-6 border transition-all duration-300 relative overflow-hidden backdrop-blur-sm";
    
    if (theme === 'blue') {
      // Light: Sky/Blue Gradient, Dark: Deep Slate with Blue Tint
      return `${base} bg-gradient-to-br from-sky-50 via-blue-50 to-white dark:from-slate-800 dark:to-blue-950/30 border-blue-100 dark:border-blue-900/50`;
    }
    if (theme === 'emerald') {
      // Light: Mint/Emerald Gradient, Dark: Deep Slate with Emerald Tint
      return `${base} bg-gradient-to-br from-emerald-50 via-teal-50 to-white dark:from-slate-800 dark:to-emerald-950/30 border-emerald-100 dark:border-emerald-900/50`;
    }
    // Light: Purple/Pink Gradient, Dark: Deep Slate with Violet Tint
    return `${base} bg-gradient-to-br from-purple-50 via-fuchsia-50 to-white dark:from-slate-800 dark:to-purple-950/30 border-purple-100 dark:border-purple-900/50`;
  };

  // Input styles generator based on color theme
  const getInputClass = (themeColor: 'blue' | 'emerald' | 'violet') => {
    // Ubah background input menjadi Putih (Light Mode) agar kontras dengan kartu berwarna
    // Dan Gelap Transparan (Dark Mode) agar menyatu
    const base = "w-full rounded-lg shadow-sm p-2.5 border transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 bg-white dark:bg-slate-900/60";
    
    if (themeColor === 'blue') {
      return `${base} border-blue-200 dark:border-slate-600 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-900/50`;
    }
    if (themeColor === 'emerald') {
      return `${base} border-emerald-200 dark:border-slate-600 focus:border-emerald-500 focus:ring focus:ring-emerald-200 dark:focus:ring-emerald-900/50`;
    }
    return `${base} border-violet-200 dark:border-slate-600 focus:border-violet-500 focus:ring focus:ring-violet-200 dark:focus:ring-violet-900/50`;
  };

  const labelClass = "block text-sm font-bold text-gray-700 dark:text-gray-100 mb-1.5 tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      
      {/* Section 1: Data Identitas (Theme: Blue/Sky) */}
      <div className={getCardStyle('blue')}>
        {/* Dekorasi Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

        <SectionHeader 
          title="Data Pendidik & Sekolah" 
          icon={User} 
          colorClass="text-blue-800 dark:text-blue-300" 
          bgClass="bg-gradient-to-br from-blue-500 to-cyan-500"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="md:col-span-2">
            <label className={labelClass}>Nama Satuan Pendidikan *</label>
            <input required name="schoolName" value={formData.schoolName} onChange={handleChange} className={getInputClass('blue')} placeholder="Contoh: SD Negeri 1 Merdeka" />
          </div>
          <div>
            <label className={labelClass}>Nama Kepala Sekolah *</label>
            <input required name="principalName" value={formData.principalName} onChange={handleChange} className={getInputClass('blue')} />
          </div>
          <div>
            <label className={labelClass}>NIP Kepala Sekolah *</label>
            <input required name="principalNIP" value={formData.principalNIP} onChange={handleChange} className={getInputClass('blue')} />
          </div>
          <div>
            <label className={labelClass}>Nama Guru *</label>
            <input required name="teacherName" value={formData.teacherName} onChange={handleChange} className={getInputClass('blue')} />
          </div>
          <div>
            <label className={labelClass}>NIP Guru *</label>
            <input required name="teacherNIP" value={formData.teacherNIP} onChange={handleChange} className={getInputClass('blue')} />
          </div>
        </div>
      </div>

      {/* Section 2: Detail Kelas & Mata Pelajaran (Theme: Emerald/Mint) */}
      <div className={getCardStyle('emerald')}>
        {/* Dekorasi Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

        <SectionHeader 
          title="Detail Pembelajaran" 
          icon={BookOpen} 
          colorClass="text-emerald-800 dark:text-emerald-300" 
          bgClass="bg-gradient-to-br from-emerald-500 to-teal-500"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div>
            <label className={labelClass}>Jenjang *</label>
            <select name="level" value={formData.level} onChange={handleChange} className={getInputClass('emerald')}>
              {Object.values(EducationLevel).map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Kelas *</label>
            <select required name="gradeClass" value={formData.gradeClass} onChange={handleChange} className={getInputClass('emerald')}>
                <option value="">Pilih Kelas</option>
                {getClassOptions().map(c => <option key={c} value={c}>Kelas {c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Mata Pelajaran *</label>
            <input required name="subject" value={formData.subject} onChange={handleChange} className={getInputClass('emerald')} placeholder="Contoh: IPAS" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 relative z-10">
            <div>
                <label className={labelClass}>Materi Pelajaran *</label>
                <input required name="material" value={formData.material} onChange={handleChange} className={getInputClass('emerald')} placeholder="Contoh: Rantai Makanan" />
            </div>
             <div>
                <label className={labelClass}>Capaian Pembelajaran (CP) *</label>
                <textarea required rows={3} name="cp" value={formData.cp} onChange={handleChange} className={getInputClass('emerald')} placeholder="Salin CP dari kurikulum..." />
            </div>
             <div>
                <label className={labelClass}>Tujuan Pembelajaran (TP) *</label>
                <textarea required rows={3} name="tp" value={formData.tp} onChange={handleChange} className={getInputClass('emerald')} placeholder="Rumusan tujuan pembelajaran..." />
            </div>
        </div>
      </div>

       {/* Section 3: Teknis Pelaksanaan (Theme: Violet/Fuchsia) */}
       <div className={getCardStyle('violet')}>
        {/* Dekorasi Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

        <SectionHeader 
          title="Strategi & Waktu" 
          icon={Clock} 
          colorClass="text-violet-800 dark:text-violet-300" 
          bgClass="bg-gradient-to-br from-violet-500 to-fuchsia-600"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div>
                <label className={labelClass}>Jumlah Pertemuan *</label>
                <input required type="number" min="1" max="20" name="meetingCount" value={formData.meetingCount} onChange={handleChange} className={getInputClass('violet')} />
            </div>
            <div>
                <label className={labelClass}>Durasi per Pertemuan *</label>
                <input required name="duration" value={formData.duration} onChange={handleChange} className={getInputClass('violet')} placeholder="Contoh: 2 x 35 menit" />
            </div>
        </div>

        <div className="bg-white/50 dark:bg-slate-900/40 p-5 rounded-xl border border-violet-200 dark:border-violet-900/30 relative z-10">
            <label className="block text-sm font-bold text-violet-800 dark:text-violet-200 mb-4 uppercase tracking-wider">Praktik Pedagogis per Pertemuan</label>
            {formData.pedagogies.map((pedagogy, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3 last:mb-0">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-300 w-24 uppercase bg-white dark:bg-slate-800 px-2 py-2 rounded border border-gray-200 dark:border-slate-600 text-center shadow-sm">
                      Pertemuan {idx + 1}
                    </span>
                    <select 
                        value={pedagogy} 
                        onChange={(e) => handlePedagogyChange(idx, e.target.value)} 
                        className={getInputClass('violet')}
                    >
                        {Object.values(PedagogyType).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
            ))}
        </div>
        
        <div className="relative z-10">
            <label className="block text-sm font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <CheckCircle size={18} className="text-violet-600 dark:text-violet-400"/> Dimensi Lulusan (Pilih yang relevan)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.values(GraduateDimension).map(dim => (
                    <label key={dim} className={`cursor-pointer border p-3 rounded-xl text-sm flex items-center gap-2 transition-all duration-200 shadow-sm ${
                      formData.dimensions.includes(dim) 
                        ? 'bg-violet-600 border-violet-600 text-white shadow-violet-200 dark:shadow-none font-semibold' 
                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-slate-600 hover:bg-violet-50 dark:hover:bg-slate-700'
                    }`}>
                        <input type="checkbox" checked={formData.dimensions.includes(dim)} onChange={() => handleDimensionChange(dim)} className="rounded text-violet-200 focus:ring-violet-500 bg-transparent" />
                        {dim}
                    </label>
                ))}
            </div>
        </div>

        <div className="relative z-10">
            <label className="block text-sm font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <CheckCircle size={18} className="text-violet-600 dark:text-violet-400"/> 5 Panca Cinta (Kemenag RI)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.values(PancaCinta).map(val => (
                    <label key={val} className={`cursor-pointer border p-3 rounded-xl text-sm flex items-center gap-2 transition-all duration-200 shadow-sm ${
                      formData.pancaCinta.includes(val) 
                        ? 'bg-violet-600 border-violet-600 text-white shadow-violet-200 dark:shadow-none font-semibold' 
                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-slate-600 hover:bg-violet-50 dark:hover:bg-slate-700'
                    }`}>
                        <input type="checkbox" checked={formData.pancaCinta.includes(val)} onChange={() => handlePancaCintaChange(val)} className="rounded text-violet-200 focus:ring-violet-500 bg-transparent" />
                        {val}
                    </label>
                ))}
            </div>
        </div>
      </div>

      <div className="pt-4 sticky bottom-4 z-20">
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-xl shadow-teal-900/20 transform transition hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg backdrop-blur-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" /> Sedang Menyusun RPM...
            </>
          ) : (
            <>
              <Sparkles className="text-yellow-300" /> Generate Rencana Pembelajaran
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default RPMForm;