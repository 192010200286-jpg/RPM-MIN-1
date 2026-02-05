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
  AllahRasul = 'Cinta Allah dan Rasul-Nya',
  Ilmu = 'Cinta Ilmu',
  DiriSesama = 'Cinta Diri dan Sesama',
  Lingkungan = 'Cinta Lingkungan',
  TanahAir = 'Cinta Tanah Air'
}

export interface RPMFormData {
  schoolName: string;
  teacherName: string;
  teacherNIP: string;
  principalName: string;
  principalNIP: string;
  level: EducationLevel;
  gradeClass: string;
  subject: string;
  cp: string; // Capaian Pembelajaran
  tp: string; // Tujuan Pembelajaran
  material: string;
  meetingCount: number;
  duration: string;
  pedagogies: string[]; // One per meeting
  dimensions: string[];
  pancaCinta: string[];
}

// Complex structure to match the detailed PDF requirements
export interface RPMGeneratedContent {
  identifikasi: {
    peserta_didik: string;
    materi_pelajaran: string;
    lintas_disiplin: string;
  };
  desain_pembelajaran: {
    capaian_pembelajaran_narasi: string;
    topik_pembelajaran: string;
    kemitraan: string;
    lingkungan: string;
    digital: string;
  };
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
  };
  asesmen: {
    awal: string;
    proses: string;
    akhir: string;
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
      aspek1: string; // e.g. Kolaborasi
      deskripsi1: string;
      aspek2: string; // e.g. Penalaran Kritis
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
    kktp: string; // Narasi KKTP
  };
}