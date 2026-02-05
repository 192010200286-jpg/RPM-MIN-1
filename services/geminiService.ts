import { GoogleGenAI, Type } from "@google/genai";
import { RPMFormData, RPMGeneratedContent } from "../types";

export const generateRPM = async (data: RPMFormData): Promise<RPMGeneratedContent> => {
  // Initialize AI client immediately before use as per the latest guidelines
  // The API key must be obtained exclusively from process.env.API_KEY and assumed to be valid.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Anda adalah ahli kurikulum Madrasah dan Sekolah Umum. 
    Buat konten Rencana Pembelajaran Mendalam (RPM) sesuai Permendikdasmen No. 1 Tahun 2026.
    
    Data Input:
    - Nama Sekolah: ${data.schoolName}
    - Mata Pelajaran: ${data.subject}
    - Jenjang/Kelas: ${data.level} / Kelas ${data.gradeClass}
    - Materi Utama: ${data.material}
    - Capaian Pembelajaran (CP): ${data.cp}
    - Tujuan Pembelajaran (TP): ${data.tp}
    - Model/Praktik Pedagogis: ${data.pedagogies.join(', ')}
    - Dimensi Profil Lulusan: ${data.dimensions.join(', ')}
    - Panca Cinta: ${data.pancaCinta.join(', ')}

    Instruksi Khusus:
    1. Identifikasi Peserta Didik: Berikan narasi tentang kesiapan belajar dan prasyarat materi.
    2. Desain Pembelajaran: Uraikan bagaimana CP dicapai melalui lingkungan belajar dan kemitraan.
    3. Langkah Pembelajaran (MEMAHAMI): Deskripsikan aktivitas eksplorasi konsep yang menggembirakan.
    4. Langkah Pembelajaran (MENGAPLIKASI): Deskripsikan aktivitas nyata/praktik/proyek yang bermakna.
    5. Langkah Pembelajaran (MEREFLEKSI): Berikan poin-poin kesimpulan dan refleksi murid.
    6. Asesmen: Buat deskripsi asesmen awal (diagnostik), proses (formatif), dan akhir (sumatif).
    7. Lampiran: Buat detail LKS, Rubrik Sikap, dan 5 Soal Evaluasi yang sesuai dengan materi.

    HASIL HARUS DALAM FORMAT JSON YANG VALID.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            identifikasi: {
              type: Type.OBJECT,
              properties: {
                peserta_didik: { type: Type.STRING },
                materi_pelajaran: { type: Type.STRING },
                lintas_disiplin: { type: Type.STRING }
              },
              required: ["peserta_didik", "materi_pelajaran", "lintas_disiplin"]
            },
            desain_pembelajaran: {
              type: Type.OBJECT,
              properties: {
                capaian_pembelajaran_narasi: { type: Type.STRING },
                topik_pembelajaran: { type: Type.STRING },
                kemitraan: { type: Type.STRING },
                lingkungan: { type: Type.STRING },
                digital: { type: Type.STRING }
              },
              required: ["capaian_pembelajaran_narasi", "topik_pembelajaran", "kemitraan", "lingkungan", "digital"]
            },
            langkah_pembelajaran: {
              type: Type.OBJECT,
              properties: {
                pendahuluan: {
                  type: Type.OBJECT,
                  properties: {
                    salam_sapa: { type: Type.STRING },
                    aktivitas_pemantik: { type: Type.STRING },
                    informasi_tujuan: { type: Type.STRING }
                  },
                  required: ["salam_sapa", "aktivitas_pemantik", "informasi_tujuan"]
                },
                inti: {
                  type: Type.OBJECT,
                  properties: {
                    memahami: { type: Type.STRING },
                    mengaplikasi: { type: Type.STRING }
                  },
                  required: ["memahami", "mengaplikasi"]
                },
                penutup: {
                  type: Type.OBJECT,
                  properties: {
                    refleksi_presentasi: { type: Type.STRING },
                    kesimpulan: { type: Type.STRING }
                  },
                  required: ["refleksi_presentasi", "kesimpulan"]
                }
              },
              required: ["pendahuluan", "inti", "penutup"]
            },
            asesmen: {
              type: Type.OBJECT,
              properties: {
                awal: { type: Type.STRING },
                proses: { type: Type.STRING },
                akhir: { type: Type.STRING }
              },
              required: ["awal", "proses", "akhir"]
            },
            lampiran: {
              type: Type.OBJECT,
              properties: {
                lks: {
                  type: Type.OBJECT,
                  properties: {
                    judul: { type: Type.STRING },
                    tujuan: { type: Type.STRING },
                    alat_bahan: { type: Type.STRING },
                    langkah_kerja: { type: Type.STRING },
                    pertanyaan_diskusi: { type: Type.STRING }
                  },
                  required: ["judul", "tujuan", "alat_bahan", "langkah_kerja", "pertanyaan_diskusi"]
                },
                rubrik: {
                  type: Type.OBJECT,
                  properties: {
                    aspek1: { type: Type.STRING },
                    deskripsi1: { type: Type.STRING },
                    aspek2: { type: Type.STRING },
                    deskripsi2: { type: Type.STRING }
                  },
                  required: ["aspek1", "deskripsi1", "aspek2", "deskripsi2"]
                },
                soal_akhir: {
                  type: Type.OBJECT,
                  properties: {
                    soal1: { type: Type.STRING },
                    soal2: { type: Type.STRING },
                    soal3: { type: Type.STRING },
                    soal4: { type: Type.STRING },
                    soal5: { type: Type.STRING },
                    kunci_jawaban: { type: Type.STRING }
                  },
                  required: ["soal1", "soal2", "soal3", "soal4", "soal5", "kunci_jawaban"]
                },
                kktp: { type: Type.STRING }
              },
              required: ["lks", "rubrik", "soal_akhir", "kktp"]
            }
          },
          required: ["identifikasi", "desain_pembelajaran", "langkah_pembelajaran", "asesmen", "lampiran"]
        }
      }
    });

    // Extracting text and trimming it to ensure valid JSON parsing as per correct extraction methods
    const text = response.text?.trim();
    if (!text) throw new Error("AI tidak memberikan respons.");
    
    return JSON.parse(text) as RPMGeneratedContent;
  } catch (error: any) {
    console.error("Error generating RPM:", error);
    // Meneruskan pesan error spesifik (misal tentang API Key) ke UI
    throw new Error(error.message || "Gagal membuat RPM. Silakan periksa koneksi atau API Key Anda.");
  }
};