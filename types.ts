export enum EducationLevel {
  SD = 'SD',
  SMP = 'SMP',
  SMA = 'SMA'
}

export enum PedagogyType {
  InkuiriDiscovery = 'Inkuiri-Discovery Learning',
  PjBL = 'Project Based Learning (PjBL)',
  ProblemSolving = 'Problem Based Learning / Problem Solving',
  GameBased = 'Game Based Learning',
  StationLearning = 'Station Learning'
}

export enum GraduateDimension {
  Keimanan = 'Keimanan & Ketakwaan',
  Kewargaan = 'Kewargaan',
  Kritis = 'Penalaran Kritis',
  Kreativitas = 'Kreativitas',
  Kolaborasi = 'Kolaborasi',
  Kemandirian = 'Kemandirian',
  Kesehatan = 'Kesehatan',
  Komunikasi = 'Komunikasi'
}

export enum PancaCinta {
  AllahRasul = 'Cinta Allah dan Rasul',
  Ilmu = 'Cinta Ilmu',
  DiriSesama = 'Cinta Diri dan Sesama',
  Lingkungan = 'Cinta Lingkungan',
  TanahAir = 'Cinta Tanah Air'
}

export interface TimeAllocations {
  pendahuluan: number; // Durasi pendahuluan dalam menit (default 10)
  inti: number; // Durasi inti dalam menit (default 55)
  penutup: number; // Durasi penutup dalam menit (default 15)
  perTopicDuration?: string; // Catatan alokasi waktu per topik spesifik
}

export interface DifferentiationStrategy {
  enabled: boolean;
  content: string; // Diferensiasi Konten
  process: string; // Diferensiasi Proses
  product: string; // Diferensiasi Produk
  targetGroups: string[]; // Kelompok sasaran (Mahir, Reguler, Butuh Bimbingan)
}

export interface DiferensiasiPembelajaranDoc {
  konten: string;
  proses: string;
  produk: string;
  strategi_inklusi: string;
  kelompok_sasaran: {
    kelompok: string;
    karakteristik: string;
    pendampingan: string;
  }[];
}

export interface RPMFormData {
  schoolName: string;
  teacherName: string;
  teacherNIP: string;
  principalName: string;
  principalNIP: string;
  level: EducationLevel;
  gradeClass: string;
  fase: string; // Fase (A/B/C/D/E/F)
  semester: string; // Semester (I/II)
  academicYear?: string; // Tahun Ajaran e.g. 2025/2026
  subject: string;
  cp: string; // Capaian Pembelajaran
  tp: string; // Tujuan Pembelajaran
  material: string;
  meetingCount: number;
  duration: string;
  pedagogies: string[]; // One per meeting
  dimensions: string[];
  pancaCinta: string[];
  // Opsi Kustomisasi Lanjutan:
  assessmentMethods?: string[]; // Metode penilaian spesifik (kuis, proyek, presentasi, dll.)
  timeAllocations?: TimeAllocations; // Alokasi waktu detail per aktivitas/topik
  differentiation?: DifferentiationStrategy; // Strategi diferensiasi pembelajaran
}

// Sub-interfaces for Meeting Steps matching the user's PDF
export interface LangkahKegiatanItem {
  tahap?: string; // e.g. "ORIENTASI (± 6 mnt)", "SINTESIS BERSAMA (± 4 mnt)"
  deskripsi: string;
  insersi_kbc?: {
    nilai: string; // e.g. "CINTA ALLAH & RASUL(KBC)" | "CINTA ILMU(KBC)" | "CINTA LINGKUNGAN(KBC)"
    uraian: string;
  };
}

export interface PertemuanLangkahPDF {
  pertemuan_ke: string; // e.g. "Pertemuan ke-1", "Pertemuan ke-2"
  alokasi_waktu: string; // e.g. "2 x 40 menit"
  model_pembelajaran: string; // e.g. "Inkuiri-Discovery", "Problem Based Learning"
  panca_cinta_fase?: string[]; // e.g. ["🕌 Cinta Allah Swt.", "📚 Cinta Ilmu", "🌱 Cinta Lingkungan"]
  pendahuluan: {
    judul: string; // "MEMAHAMI (Berkesadaran & Menggembirakan) — Kegiatan Pendahuluan"
    langkah: LangkahKegiatanItem[];
  };
  inti: {
    judul: string; // "MENGAPLIKASI (Berkesadaran & Bermakna) — Kegiatan Inti"
    sintaks_model: string; // "Sintaks Inkuiri-Discovery" or "Sintaks Problem Based Learning"
    langkah: LangkahKegiatanItem[];
  };
  penutup: {
    judul: string; // "MEREFLEKSI (Bermakna & Berkesadaran) — Kegiatan Penutup"
    langkah: LangkahKegiatanItem[];
  };
}

// 9 Supporting Documents (Lampiran 1 - 9)
export interface LampiranBahanBacaan {
  pengantar: string;
  konsep_kunci: {
    no: number;
    konsep: string;
    penjelasan: string;
    contoh: string;
  }[];
  pertanyaan_pemandu: string[];
}

export interface LampiranLKPD {
  pertemuan_1: {
    judul: string;
    model: string;
    tujuan: string;
    tahapan: {
      no: number;
      judul: string;
      instruksi: string;
    }[];
  };
  pertemuan_2: {
    judul: string;
    model: string;
    tujuan: string;
    tahapan: {
      no: number;
      judul: string;
      instruksi: string;
    }[];
  };
}

export interface LampiranAsesmenAwal {
  petunjuk: string;
  pertanyaan: string[];
  panduan_interpretasi: {
    skor: string;
    kategori: string;
    tindak_lanjut: string;
  }[];
}

export interface LampiranAsesmenProses {
  dimensi_observasi: string[];
  checklist_p1: string[];
  checklist_p2: string[];
  peer_assessment_aspek: string[];
}

export interface LampiranAsesmenAkhir {
  petunjuk: string;
  pilihan_ganda: {
    no: number;
    soal: string;
    pilihan: { a: string; b: string; c: string; d: string };
    kunci: string;
  }[];
  isian_singkat: {
    no: number;
    soal: string;
  }[];
  uraian_esai: {
    no: number;
    soal: string;
  }[];
  kisi_kisi: {
    soal: string;
    pedoman: string;
    skor_maks: number;
    indikator: string;
  }[];
}

export interface LampiranRubrikPenilaian {
  rubrik_dimensi: {
    dimensi: string;
    skor_4: string;
    skor_3: string;
    skor_2: string;
    skor_1: string;
  }[];
  rubrik_produk: {
    aspek: string;
    skor_4: string;
    skor_3: string;
    skor_2: string;
    skor_1: string;
  }[];
  konversi_skor: {
    rentang: string;
    nilai: string;
    predikat: string;
    ketercapaian: string;
    tindak_lanjut: string;
  }[];
}

export interface LampiranRefleksiMandiri {
  petunjuk: string;
  evaluasi_hasil: string[];
  evaluasi_proses: string[];
  penilaian_diri: string[];
}

export interface LampiranObservasiGuru {
  aspek_pelaksanaan: string[];
  evaluasi_rencana_perbaikan: string[];
}

export interface LampiranObservasiKBC {
  pendekatan: string;
  petunjuk: string;
  topik_insersi: {
    nilai: string;
    nilai_inti: string;
    insersi_materi: string;
  }[];
  rubrik_internalisasi: {
    skor: number;
    predikat: string;
    deskripsi: string;
  }[];
  refleksi_guru: string[];
  iklim_budaya: string;
}

// Complete complex structure matching the user's 23-page PDF
export interface RPMGeneratedContent {
  identifikasi: {
    peserta_didik: string[];
    materi_pelajaran: string;
    lintas_disiplin: string[];
  };
  profil_pancasila_narasi: {
    dimensi: string;
    deskripsi: string;
  }[];
  panca_cinta_narasi: {
    nilai: string;
    deskripsi: string;
  }[];
  desain_pembelajaran: {
    capaian_pembelajaran_narasi: string;
    topik_pembelajaran: string;
    konteks?: string;
    kemitraan: string;
    lingkungan: string;
    digital: string;
  };
  // Steps can be simple legacy object or detailed multi-meeting list
  langkah_pembelajaran: {
    pendahuluan: {
      salam_sapa: string;
      aktivitas_pemantik: string;
      informasi_tujuan: string;
    };
    inti: {
      memahami: string;
      mengaplikasi: string;
    };
    penutup: {
      refleksi_presentasi: string;
      kesimpulan: string;
    };
    daftar_pertemuan?: PertemuanLangkahPDF[];
  };
  asesmen: {
    awal: string;
    proses: string;
    akhir: string;
  };
  insersi_kbc?: {
    dasar_hukum: string;
    posisi_kbc: string;
    pendekatan: string;
    topik_diinsersi: {
      nilai: string;
      deskripsi: string;
    }[];
    letak_insersi: {
      nilai: string;
      nilai_inti: string;
      fase: string;
    }[];
    iklim_budaya: {
      pembiasaan: string;
      keteladanan: string;
      experiential: string;
    };
    evaluasi_holistik: string;
  };
  // Hasil Kustomisasi Lanjutan:
  diferensiasi_pembelajaran?: DiferensiasiPembelajaranDoc;
  metode_penilaian_terpilih?: string[];
  alokasi_durasi_aktivitas?: {
    pendahuluan: number;
    inti: number;
    penutup: number;
    catatan_topik?: string;
  };
  lampiran: {
    lks: {
      judul: string;
      tujuan: string;
      alat_bahan: string;
      langkah_kerja: string;
      pertanyaan_diskusi: string;
    };
    rubrik: {
      aspek1: string;
      deskripsi1: string;
      aspek2: string;
      deskripsi2: string;
    };
    soal_akhir: {
      soal1: string;
      soal2: string;
      soal3: string;
      soal4: string;
      soal5: string;
      kunci_jawaban: string;
    };
    kktp: string;
    // Enhanced 9 Attachments
    bahan_bacaan?: LampiranBahanBacaan;
    lkpd_detail?: LampiranLKPD;
    asesmen_awal_detail?: LampiranAsesmenAwal;
    asesmen_proses_detail?: LampiranAsesmenProses;
    asesmen_akhir_detail?: LampiranAsesmenAkhir;
    rubrik_lengkap?: LampiranRubrikPenilaian;
    refleksi_mandiri?: LampiranRefleksiMandiri;
    observasi_guru?: LampiranObservasiGuru;
    observasi_kbc?: LampiranObservasiKBC;
  };
}

export type ChatTaskType = 'fast' | 'general' | 'complex';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  taskType?: ChatTaskType;
}

export interface ImageGenerationOptions {
  prompt: string;
  aspectRatio?: '1:1' | '3:4' | '4:3' | '16:9' | '9:16';
  referenceImageBase64?: string;
  referenceMimeType?: string;
}

export interface GeneratedImageItem {
  id: string;
  url: string;
  prompt: string;
  timestamp: string;
  aspectRatio: string;
  isEdited?: boolean;
}
