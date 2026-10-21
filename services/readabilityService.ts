import { EducationLevel, RPMFormData, RPMGeneratedContent } from '../types';

export interface ReadabilityAnalysisResult {
  score: number; // 0 - 100
  readingEaseLabel: string;
  targetAgeRange: string;
  targetGradeLevel: string;
  isAppropriate: boolean;
  alignmentStatus: 'SANGAT_SESUAI' | 'SESUAI' | 'PERLU_PENYESUAIAN';
  alignmentBadgeText: string;
  avgWordsPerSentence: number;
  avgSyllablesPerWord: number;
  totalWords: number;
  totalSentences: number;
  complexWordsPercentage: number;
  estimatedReadingTimeMinutes: number;
  analyzedSnippet: string;
  recommendations: string[];
  keyInsights: {
    sentenceStructure: string;
    vocabularyLevel: string;
    pedagogicalTip: string;
  };
}

/**
 * Count Indonesian syllables in a word
 * Indonesian words are predominantly vowel-based (a, i, u, e, o)
 */
export const countIndonesianSyllables = (word: string): number => {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean || clean.length <= 1) return 1;

  // Diphthongs in Indonesian that form single vowel phonemes
  const diphthongs = /(ai|au|oi|ei)/g;
  let text = clean.replace(diphthongs, 'V');

  // Match vowel groups
  const vowels = text.match(/[aiueoV]/g);
  let count = vowels ? vowels.length : 1;

  // Words like "saat", "taat", "keadaan" - hiatus is counted correctly
  return Math.max(1, count);
};

/**
 * Extract student-facing text from RPM content
 * Primary texts are Bahan Bacaan Peserta Didik and LKPD instructions
 */
export const extractStudentFacingText = (content: RPMGeneratedContent): string => {
  const parts: string[] = [];

  // Bahan Bacaan Pengantar & Konsep Kunci
  if (content.lampiran?.bahan_bacaan) {
    if (content.lampiran.bahan_bacaan.pengantar) {
      parts.push(content.lampiran.bahan_bacaan.pengantar);
    }
    (content.lampiran.bahan_bacaan.konsep_kunci || []).forEach(kk => {
      if (kk.penjelasan) parts.push(kk.penjelasan);
      if (kk.contoh) parts.push(kk.contoh);
    });
    (content.lampiran.bahan_bacaan.pertanyaan_pemandu || []).forEach(p => {
      parts.push(p);
    });
  }

  // LKPD Instructions
  if (content.lampiran?.lkpd_detail) {
    (content.lampiran.lkpd_detail.pertemuan_1?.tahapan || []).forEach(t => {
      if (t.instruksi) parts.push(t.instruksi);
    });
    (content.lampiran.lkpd_detail.pertemuan_2?.tahapan || []).forEach(t => {
      if (t.instruksi) parts.push(t.instruksi);
    });
  }

  // Fallback to CP or TP if attachments are sparse
  if (parts.length === 0) {
    if (content.desain_pembelajaran?.capaian_pembelajaran_narasi) {
      parts.push(content.desain_pembelajaran.capaian_pembelajaran_narasi);
    }
  }

  return parts.join('\n\n');
};

/**
 * Calculate readability score adapted for Indonesian language texts
 * Formula based on Indonesian linguistic adaptation of Flesch Reading Ease (Tampubolon & Harjasujana)
 */
export const analyzeRPMReadability = (
  formData: RPMFormData,
  content: RPMGeneratedContent
): ReadabilityAnalysisResult => {
  const text = extractStudentFacingText(content);

  // Split into sentences (handling abbreviations)
  const cleanedForSentences = text
    .replace(/(?:No|Drs|Dr|H|Hj|dkk|dll|dsb|dst|NIP|SMP|SMA|SD|Kemenag)\./gi, '$1')
    .replace(/\n+/g, '. ');

  const sentenceRegex = /[^.!?]+[.!?]+(\s|$)/g;
  const sentenceMatches = cleanedForSentences.match(sentenceRegex) || [];
  const totalSentences = Math.max(1, sentenceMatches.length);

  // Split into words
  const words = text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0 && !/^\d+$/.test(w));

  const totalWords = Math.max(1, words.length);

  // Calculate syllables
  let totalSyllables = 0;
  let complexWordCount = 0; // Words with >= 4 syllables (e.g., "mempertimbangkan", "berkesadaran")

  words.forEach(w => {
    const syl = countIndonesianSyllables(w);
    totalSyllables += syl;
    if (syl >= 4) complexWordCount++;
  });

  const avgWordsPerSentence = parseFloat((totalWords / totalSentences).toFixed(1));
  const avgSyllablesPerWord = parseFloat((totalSyllables / totalWords).toFixed(2));
  const complexWordsPercentage = parseFloat(((complexWordCount / totalWords) * 100).toFixed(1));

  // Indonesian Flesch Reading Ease Adaptation:
  // In Indonesian, average syllables per word is higher (~2.3 to 2.8) than English (~1.4).
  // Adjusted constant balances standard Indonesian readability scale (0 - 100):
  // Formula: 206.835 - (55.0 * avgSyllablesPerWord) - (1.1 * avgWordsPerSentence)
  let rawScore = 206.835 - (52.5 * avgSyllablesPerWord) - (1.15 * avgWordsPerSentence);
  
  // Normalize score into 0 - 100
  let score = Math.round(Math.min(100, Math.max(15, rawScore)));

  // Target expectations based on user's selected education level
  const level = formData.level || EducationLevel.SMP;
  let expectedMinScore = 60;
  let expectedMaxScore = 78;
  let targetAgeRange = '12 - 15 Tahun';
  let targetGradeLevel = 'SMP (Kelas 7 - 9)';

  if (level === EducationLevel.SD) {
    targetAgeRange = '7 - 12 Tahun';
    targetGradeLevel = 'SD/MI (Kelas 1 - 6)';
    expectedMinScore = 70;
    expectedMaxScore = 95;
  } else if (level === EducationLevel.SMA) {
    targetAgeRange = '15 - 18 Tahun';
    targetGradeLevel = 'SMA/MA/SMK (Kelas 10 - 12)';
    expectedMinScore = 48;
    expectedMaxScore = 68;
  }

  // Label based on score
  let readingEaseLabel = 'Standar / Sedang';
  if (score >= 82) {
    readingEaseLabel = 'Sangat Mudah Dipahami';
  } else if (score >= 70) {
    readingEaseLabel = 'Mudah & Menyenangkan';
  } else if (score >= 58) {
    readingEaseLabel = 'Standar & Kontekstual';
  } else if (score >= 45) {
    readingEaseLabel = 'Cukup Menantang (Akademik)';
  } else {
    readingEaseLabel = 'Kompleks / Memerlukan Bimbingan Intensif';
  }

  // Check appropriateness
  let alignmentStatus: 'SANGAT_SESUAI' | 'SESUAI' | 'PERLU_PENYESUAIAN' = 'SESUAI';
  let alignmentBadgeText = `Sesuai untuk Siswa ${formData.gradeClass || targetGradeLevel}`;
  let isAppropriate = true;

  if (score >= expectedMinScore && score <= expectedMaxScore) {
    alignmentStatus = 'SANGAT_SESUAI';
    alignmentBadgeText = `Sangat Sesuai untuk Siswa ${formData.gradeClass || targetGradeLevel} (${targetAgeRange})`;
  } else if (Math.abs(score - expectedMinScore) <= 8 || Math.abs(score - expectedMaxScore) <= 8) {
    alignmentStatus = 'SESUAI';
    alignmentBadgeText = `Sesuai dengan Sedikit Pendampingan (${formData.gradeClass || targetGradeLevel})`;
  } else {
    alignmentStatus = 'PERLU_PENYESUAIAN';
    isAppropriate = false;
    if (score < expectedMinScore) {
      alignmentBadgeText = `Cenderung Terlalu Padat untuk ${formData.gradeClass || targetGradeLevel} (Perlu Scaffolding)`;
    } else {
      alignmentBadgeText = `Sangat Sederhana untuk ${formData.gradeClass || targetGradeLevel} (Dapat Diberi Pengayaan)`;
    }
  }

  // Reading time (average 130 - 160 words per minute for school students)
  const wpm = level === EducationLevel.SD ? 110 : level === EducationLevel.SMP ? 140 : 170;
  const estimatedReadingTimeMinutes = Math.max(1, Math.ceil(totalWords / wpm));

  // Dynamic recommendations for teachers
  const recommendations: string[] = [];

  if (avgWordsPerSentence <= 14) {
    recommendations.push(
      'Panjang kalimat rata-rata sangat baik dan ringkas (≤ 14 kata), membuat alur pemikiran siswa fokus dan tidak mudah terdistraksi.'
    );
  } else if (avgWordsPerSentence <= 20) {
    recommendations.push(
      'Panjang kalimat proporsional (15 - 20 kata). Cocok untuk melatih daya nalar kritis siswa tingkat menengah.'
    );
  } else {
    recommendations.push(
      'Beberapa kalimat cukup panjang (> 20 kata). Disarankan guru memecah kalimat panjang menjadi 2 kalimat sederhana saat menjelaskan di kelas.'
    );
  }

  if (complexWordsPercentage < 18) {
    recommendations.push(
      'Kosakata materi didominasi istilah yang ramah siswa, memudahkan pemahaman mandiri saat membaca bahan ajar dan LKPD.'
    );
  } else {
    recommendations.push(
      `Terdapat ${complexWordsPercentage}% istilah bernilai tinggi/ilmiah. Sangat baik jika guru membuat glosarium kecil atau analogi kontekstual di papan tulis.`
    );
  }

  if (level === EducationLevel.SD) {
    recommendations.push(
      'Bahan ajar dilengkapi pertanyaan pemandu yang mengajak siswa berdiskusi aktif sesuai prinsip Pembelajaran Menyenangkan (Joyful Learning).'
    );
  } else {
    recommendations.push(
      'Sintaks LKPD mengarahkan investigasi kolaboratif sesuai dimensi Penalaran Kritis dan Dimensi Profil Pelajar.'
    );
  }

  const keyInsights = {
    sentenceStructure:
      avgWordsPerSentence <= 15
        ? 'Struktur kalimat tergolong padat, langsung ke inti pesan (direct & engaging).'
        : 'Struktur kalimat bersifat analitis dan penjelasan bertingkat.',
    vocabularyLevel:
      avgSyllablesPerWord <= 2.45
        ? 'Kosakata umum, mudah diartikulasikan dan dipahami tanpa kamus teknis.'
        : 'Kosakata memuat istilah konseptual dan kata bentukan formal bahasa Indonesia.',
    pedagogicalTip:
      level === EducationLevel.SD
        ? 'Gunakan metode read-aloud atau membaca terbimbing untuk memaksimalkan retensi konsep.'
        : 'Berikan ruang refleksi mandiri 5 menit setelah siswa membaca LKPD sebelum memulai kerja kelompok.'
  };

  // Sample snippet (first 180 chars)
  const snippet = text.slice(0, 220) + (text.length > 220 ? '...' : '');

  return {
    score,
    readingEaseLabel,
    targetAgeRange,
    targetGradeLevel,
    isAppropriate,
    alignmentStatus,
    alignmentBadgeText,
    avgWordsPerSentence,
    avgSyllablesPerWord,
    totalWords,
    totalSentences,
    complexWordsPercentage,
    estimatedReadingTimeMinutes,
    analyzedSnippet: snippet,
    recommendations,
    keyInsights
  };
};
