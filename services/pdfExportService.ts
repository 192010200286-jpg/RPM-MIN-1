import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RPMFormData, RPMGeneratedContent } from '../types';

/**
 * Utility to sanitize file names for download
 */
export const sanitizeFileName = (name: string): string => {
  return name.replace(/[^a-zA-Z0-9_\-]/g, '_').substring(0, 50);
};

/**
 * Helper to clean text from emojis or unsupported unicode symbols for PDF Helvetica font
 */
const cleanText = (text: string | undefined | null): string => {
  if (!text) return '';
  return text
    .replace(/[❤💗💖💙💚💛💜]/g, '[Cinta]')
    .replace(/[▸►▶]/g, '•')
    .replace(/[✓✔]/g, '[V]')
    .replace(/[✗✘×]/g, '[X]')
    .replace(/[☐]/g, '[ ]')
    .replace(/[☑]/g, '[X]')
    .replace(/[•]/g, '• ')
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, '  ')
    .trim();
};

export interface PDFExportOptions {
  includeLampiran?: boolean;
  schoolCity?: string;
}

/**
 * Helper to determine next Y coordinate or add a new page if space is insufficient
 */
const getNextY = (doc: jsPDF, offset = 6, minSpace = 25): number => {
  const lastY = (doc as any).lastAutoTable?.finalY;
  if (!lastY) return 20;
  if (lastY + minSpace > 275) {
    doc.addPage();
    return 20;
  }
  return lastY + offset;
};

/**
 * Generate a beautifully styled, print-ready PDF using jsPDF & autoTable
 */
export const generateRPMPdf = (
  formData: RPMFormData,
  content: RPMGeneratedContent,
  options: PDFExportOptions = { includeLampiran: true }
): jsPDF => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2; // 182mm

  // Standard Colors
  const COLOR_TEAL_DARK = [15, 118, 110]; // #0f766e
  const COLOR_TEAL_LIGHT = [240, 253, 250]; // #f0fdfa
  const COLOR_TEAL_BORDER = [153, 246, 228]; // #99f6e4

  const COLOR_MAGENTA_DARK = [190, 24, 93]; // #be185d
  const COLOR_MAGENTA_LIGHT = [253, 242, 248]; // #fdf2f8
  const COLOR_MAGENTA_BORDER = [251, 207, 232]; // #fbcfe8

  const COLOR_INDIGO_DARK = [67, 56, 202]; // #4338ca
  const COLOR_INDIGO_LIGHT = [238, 242, 255]; // #eef2ff
  const COLOR_INDIGO_BORDER = [199, 210, 254]; // #c7d2fe

  const COLOR_TEXT_DARK = [30, 41, 59]; // #1e293b
  const COLOR_TEXT_MUTED = [100, 116, 139]; // #64748b
  const COLOR_BORDER = [203, 213, 225]; // #cbd5e1

  // Extract Form Info with robust fallbacks
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
  const schoolCity = options.schoolCity || 'Banyuwangi';

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

  const isDimSelected = (dimId: string, dimLabel: string) => {
    if (!formData.dimensions || formData.dimensions.length === 0) return true;
    return formData.dimensions.some(d =>
      dimLabel.toLowerCase().includes(d.toLowerCase()) ||
      d.toLowerCase().includes(dimLabel.toLowerCase()) ||
      dimId.toLowerCase().includes(d.toLowerCase())
    );
  };

  // --------------------------------------------------------------------------
  // 1. KOP HEADER RESMI
  // --------------------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(COLOR_TEAL_DARK[0], COLOR_TEAL_DARK[1], COLOR_TEAL_DARK[2]);
  doc.text('PERENCANAAN PEMBELAJARAN MENDALAM (RPM)', pageWidth / 2, 18, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(COLOR_TEXT_DARK[0], COLOR_TEXT_DARK[1], COLOR_TEXT_DARK[2]);
  doc.text(schoolName.toUpperCase(), pageWidth / 2, 24, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(COLOR_TEXT_MUTED[0], COLOR_TEXT_MUTED[1], COLOR_TEXT_MUTED[2]);
  doc.text(`Tahun Ajaran ${academicYear} • Mata Pelajaran: ${subject}`, pageWidth / 2, 29, { align: 'center' });

  // Elegant double header rule
  doc.setDrawColor(COLOR_TEAL_DARK[0], COLOR_TEAL_DARK[1], COLOR_TEAL_DARK[2]);
  doc.setLineWidth(0.6);
  doc.line(marginX, 32, pageWidth - marginX, 32);
  doc.setDrawColor(COLOR_TEAL_BORDER[0], COLOR_TEAL_BORDER[1], COLOR_TEAL_BORDER[2]);
  doc.setLineWidth(0.2);
  doc.line(marginX, 33.2, pageWidth - marginX, 33.2);

  let currentY = 36;

  // --------------------------------------------------------------------------
  // 2. TABEL IDENTITAS
  // --------------------------------------------------------------------------
  autoTable(doc, {
    startY: currentY,
    margin: { left: marginX, right: marginX },
    head: [[{ content: 'IDENTITAS', colSpan: 2, styles: { halign: 'left', fillColor: COLOR_TEAL_DARK as any } }]],
    body: [
      ['Nama Sekolah', schoolName],
      ['Kelas / Fase', `${gradeClass} / ${fase}`],
      ['Semester', semester],
      ['Tahun Ajaran', academicYear],
      ['Mata Pelajaran', subject],
      ['Bab / Topik / Materi', material],
      ['Alokasi Waktu', duration]
    ],
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      cellPadding: 2.5,
      textColor: COLOR_TEXT_DARK as any,
      lineColor: COLOR_BORDER as any,
      lineWidth: 0.15
    },
    headStyles: {
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9.5
    },
    columnStyles: {
      0: {
        cellWidth: 46,
        fontStyle: 'bold',
        fillColor: COLOR_TEAL_LIGHT as any,
        textColor: COLOR_TEAL_DARK as any
      },
      1: { cellWidth: 136 }
    }
  });

  // --------------------------------------------------------------------------
  // 3. TABEL A. IDENTIFIKASI
  // --------------------------------------------------------------------------
  const pesertaDidikText = (content.identifikasi?.peserta_didik || [])
    .map(p => `• ${cleanText(p)}`)
    .join('\n');

  const dimensiText = allDimensions
    .map(d => {
      const selected = isDimSelected(d.id, d.label);
      return `${selected ? '[V]' : '[ ]'} ${d.id}: ${d.label}`;
    })
    .join('\n');

  const lintasDisiplinText = (content.identifikasi?.lintas_disiplin || [])
    .map(ld => `• ${cleanText(ld)}`)
    .join('\n');

  const pancaCintaText = (content.panca_cinta_narasi || [])
    .map(pc => `• ${cleanText(pc.nilai)}: ${cleanText(pc.deskripsi)}`)
    .join('\n\n');

  autoTable(doc, {
    startY: getNextY(doc, 5),
    margin: { left: marginX, right: marginX },
    head: [[{ content: 'A. IDENTIFIKASI', colSpan: 2, styles: { halign: 'left', fillColor: COLOR_TEAL_DARK as any } }]],
    body: [
      ['Peserta Didik', cleanText(pesertaDidikText)],
      ['Materi Pelajaran', cleanText(content.identifikasi?.materi_pelajaran)],
      ['Dimensi Profil Lulusan', dimensiText],
      ['Lintas Disiplin', cleanText(lintasDisiplinText)],
      ['Panca Cinta (Kemenag)', cleanText(pancaCintaText)]
    ],
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      cellPadding: 2.5,
      textColor: COLOR_TEXT_DARK as any,
      lineColor: COLOR_BORDER as any,
      lineWidth: 0.15
    },
    headStyles: {
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9.5
    },
    columnStyles: {
      0: {
        cellWidth: 46,
        fontStyle: 'bold',
        fillColor: COLOR_TEAL_LIGHT as any,
        textColor: COLOR_TEAL_DARK as any
      },
      1: { cellWidth: 136 }
    }
  });

  // --------------------------------------------------------------------------
  // 4. TABEL B. DESAIN PEMBELAJARAN
  // --------------------------------------------------------------------------
  const pedagogiesText = (formData.pedagogies || [])
    .map((ped, idx) => `Pertemuan ${idx + 1}: ${ped} (2 x 40 menit)`)
    .join('\n');

  const diffBodyRows: any[] = [];
  if (content.diferensiasi_pembelajaran) {
    const diffText = `• Konten: ${cleanText(content.diferensiasi_pembelajaran.konten)}\n• Proses: ${cleanText(content.diferensiasi_pembelajaran.proses)}\n• Produk: ${cleanText(content.diferensiasi_pembelajaran.produk)}\n• Strategi Inklusi Kelompok Beragam:\n${(content.diferensiasi_pembelajaran.kelompok_sasaran || []).map(k => `  - ${cleanText(k.kelompok)}: ${cleanText(k.pendampingan)}`).join('\n')}`;
    diffBodyRows.push(['Diferensiasi Pembelajaran', diffText]);
  }

  const durationAllocText = content.alokasi_durasi_aktivitas 
    ? `Pendahuluan: ± ${content.alokasi_durasi_aktivitas.pendahuluan} mnt | Kegiatan Inti: ± ${content.alokasi_durasi_aktivitas.inti} mnt | Penutup: ± ${content.alokasi_durasi_aktivitas.penutup} mnt${content.alokasi_durasi_aktivitas.catatan_topik ? `\nCatatan Alokasi Topik: ${cleanText(content.alokasi_durasi_aktivitas.catatan_topik)}` : ''}`
    : duration;

  autoTable(doc, {
    startY: getNextY(doc, 5),
    margin: { left: marginX, right: marginX },
    head: [[{ content: 'B. DESAIN PEMBELAJARAN', colSpan: 2, styles: { halign: 'left', fillColor: COLOR_TEAL_DARK as any } }]],
    body: [
      ['Capaian Pembelajaran (CP)', cleanText(content.desain_pembelajaran?.capaian_pembelajaran_narasi)],
      ['Tujuan Pembelajaran (TP)', cleanText(formData.tp || 'Menganalisis konsep dan menerapkannya dalam penyelesaian masalah sehari-hari.')],
      ['Topik Pembelajaran', cleanText(content.desain_pembelajaran?.topik_pembelajaran || material)],
      ['Alokasi Durasi Waktu', cleanText(durationAllocText)],
      ['Praktik Pedagogis', cleanText(pedagogiesText)],
      ...diffBodyRows,
      ['Kemitraan Pembelajaran', cleanText(content.desain_pembelajaran?.kemitraan)],
      ['Lingkungan Pembelajaran', cleanText(content.desain_pembelajaran?.lingkungan)],
      ['Pemanfaatan Digital', cleanText(content.desain_pembelajaran?.digital)]
    ],
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      cellPadding: 2.5,
      textColor: COLOR_TEXT_DARK as any,
      lineColor: COLOR_BORDER as any,
      lineWidth: 0.15
    },
    headStyles: {
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9.5
    },
    columnStyles: {
      0: {
        cellWidth: 46,
        fontStyle: 'bold',
        fillColor: COLOR_TEAL_LIGHT as any,
        textColor: COLOR_TEAL_DARK as any
      },
      1: { cellWidth: 136 }
    }
  });

  // --------------------------------------------------------------------------
  // 5. TABEL C. PENGALAMAN BELAJAR — LANGKAH-LANGKAH PEMBELAJARAN
  // --------------------------------------------------------------------------
  const meetings = content.langkah_pembelajaran?.daftar_pertemuan || [];
  const meetingRows: any[] = [];

  meetings.forEach((m) => {
    let detailText = '';

    // Pendahuluan
    detailText += `1. PENDAHULUAN: ${cleanText(m.pendahuluan?.judul)}\n`;
    if (m.panca_cinta_fase && m.panca_cinta_fase.length > 0) {
      detailText += `   [Insersi Panca Cinta: ${m.panca_cinta_fase.join(' • ')}]\n`;
    }
    (m.pendahuluan?.langkah || []).forEach(l => {
      detailText += `   • ${cleanText(l.deskripsi)}\n`;
      if (l.insersi_kbc) {
        detailText += `     [KBC - ${cleanText(l.insersi_kbc.nilai)}]: ${cleanText(l.insersi_kbc.uraian)}\n`;
      }
    });

    // Inti
    detailText += `\n2. KEGIATAN INTI: ${cleanText(m.inti?.judul)} (${cleanText(m.inti?.sintaks_model)})\n`;
    (m.inti?.langkah || []).forEach(l => {
      if (l.tahap) detailText += `   [${cleanText(l.tahap)}]\n`;
      detailText += `   • ${cleanText(l.deskripsi)}\n`;
      if (l.insersi_kbc) {
        detailText += `     [KBC - ${cleanText(l.insersi_kbc.nilai)}]: ${cleanText(l.insersi_kbc.uraian)}\n`;
      }
    });

    // Penutup
    detailText += `\n3. KEGIATAN PENUTUP: ${cleanText(m.penutup?.judul)}\n`;
    (m.penutup?.langkah || []).forEach(l => {
      if (l.tahap) detailText += `   [${cleanText(l.tahap)}]\n`;
      detailText += `   • ${cleanText(l.deskripsi)}\n`;
      if (l.insersi_kbc) {
        detailText += `     [KBC - ${cleanText(l.insersi_kbc.nilai)}]: ${cleanText(l.insersi_kbc.uraian)}\n`;
      }
    });

    const infoLeft = `${cleanText(m.pertemuan_ke)}\n\nAlokasi Waktu:\n${cleanText(m.alokasi_waktu)}\n\nModel Pembelajaran:\n${cleanText(m.model_pembelajaran)}`;

    meetingRows.push([infoLeft, detailText.trim()]);
  });

  autoTable(doc, {
    startY: getNextY(doc, 5),
    margin: { left: marginX, right: marginX },
    head: [[{ content: 'C. PENGALAMAN BELAJAR — LANGKAH-LANGKAH PEMBELAJARAN', colSpan: 2, styles: { halign: 'left', fillColor: COLOR_TEAL_DARK as any } }]],
    body: meetingRows,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      cellPadding: 2.5,
      textColor: COLOR_TEXT_DARK as any,
      lineColor: COLOR_BORDER as any,
      lineWidth: 0.15
    },
    headStyles: {
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9.5
    },
    columnStyles: {
      0: {
        cellWidth: 46,
        fontStyle: 'bold',
        fillColor: COLOR_TEAL_LIGHT as any,
        textColor: COLOR_TEAL_DARK as any
      },
      1: { cellWidth: 136 }
    }
  });

  // --------------------------------------------------------------------------
  // 6. TABEL D. ASESMEN PEMBELAJARAN
  // --------------------------------------------------------------------------
  const assessmentRows: any[] = [];
  if (content.metode_penilaian_terpilih && content.metode_penilaian_terpilih.length > 0) {
    assessmentRows.push(['Metode Penilaian Spesifik', content.metode_penilaian_terpilih.map(m => `• ${cleanText(m)}`).join('\n')]);
  }

  autoTable(doc, {
    startY: getNextY(doc, 5),
    margin: { left: marginX, right: marginX },
    head: [[{ content: 'D. ASESMEN PEMBELAJARAN', colSpan: 2, styles: { halign: 'left', fillColor: COLOR_TEAL_DARK as any } }]],
    body: [
      ...assessmentRows,
      ['Asesmen Awal (Diagnostik)', cleanText(content.asesmen?.awal)],
      ['Asesmen Proses (Formatif)', cleanText(content.asesmen?.proses)],
      ['Asesmen Akhir (Sumatif)', cleanText(content.asesmen?.akhir)],
      ['Kriteria Ketercapaian (KKTP)', cleanText(content.lampiran?.kktp)]
    ],
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      cellPadding: 2.5,
      textColor: COLOR_TEXT_DARK as any,
      lineColor: COLOR_BORDER as any,
      lineWidth: 0.15
    },
    headStyles: {
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9.5
    },
    columnStyles: {
      0: {
        cellWidth: 46,
        fontStyle: 'bold',
        fillColor: COLOR_TEAL_LIGHT as any,
        textColor: COLOR_TEAL_DARK as any
      },
      1: { cellWidth: 136 }
    }
  });

  // --------------------------------------------------------------------------
  // 7. TABEL E. INSERSI KURIKULUM BERBASIS CINTA (KBC)
  // --------------------------------------------------------------------------
  if (content.insersi_kbc) {
    const iklimBudayaText = `• Pembiasaan: ${cleanText(content.insersi_kbc.iklim_budaya?.pembiasaan)}\n• Keteladanan: ${cleanText(content.insersi_kbc.iklim_budaya?.keteladanan)}\n• Experiential: ${cleanText(content.insersi_kbc.iklim_budaya?.experiential)}`;
    const topikKbcText = (content.insersi_kbc.topik_diinsersi || [])
      .map(t => `• ${cleanText(t.nilai)}: ${cleanText(t.deskripsi)}`)
      .join('\n');
    const letakInsersiText = (content.insersi_kbc.letak_insersi || [])
      .map(li => `• ${cleanText(li.nilai)} (Nilai Inti: ${cleanText(li.nilai_inti)}) -> Diinsersi pada: ${cleanText(li.fase)}`)
      .join('\n');

    autoTable(doc, {
      startY: getNextY(doc, 5),
      margin: { left: marginX, right: marginX },
      head: [[{ content: 'E. INSERSI KURIKULUM BERBASIS CINTA (KBC)', colSpan: 2, styles: { halign: 'left', fillColor: COLOR_MAGENTA_DARK as any } }]],
      body: [
        ['Dasar Hukum', cleanText(content.insersi_kbc.dasar_hukum)],
        ['Posisi KBC dalam RPM', cleanText(content.insersi_kbc.posisi_kbc)],
        ['Topik Panca Cinta Terinsersi', topikKbcText],
        ['Pendekatan Internalisasi', cleanText(content.insersi_kbc.pendekatan)],
        ['Letak Insersi pada Langkah', letakInsersiText],
        ['Iklim & Budaya Madrasah', iklimBudayaText],
        ['Evaluasi Holistik', cleanText(content.insersi_kbc.evaluasi_holistik)]
      ],
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 8.5,
        cellPadding: 2.5,
        textColor: COLOR_TEXT_DARK as any,
        lineColor: COLOR_MAGENTA_BORDER as any,
        lineWidth: 0.15
      },
      headStyles: {
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9.5
      },
      columnStyles: {
        0: {
          cellWidth: 46,
          fontStyle: 'bold',
          fillColor: COLOR_MAGENTA_LIGHT as any,
          textColor: COLOR_MAGENTA_DARK as any
        },
        1: { cellWidth: 136 }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 8. TANDA TANGAN PENGESAHAN (SIGNATURE BLOCK)
  // --------------------------------------------------------------------------
  const dateFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const signY = getNextY(doc, 8, 45);

  autoTable(doc, {
    startY: signY,
    margin: { left: marginX, right: marginX },
    body: [
      [
        `Mengetahui,\nKepala ${schoolName}\n\n\n\n\n${principalName}\nNIP. ${principalNIP}`,
        `${schoolCity}, ${dateFormatted}\nGuru Mata Pelajaran\n\n\n\n\n${teacherName}\nNIP. ${teacherNIP}`
      ]
    ],
    theme: 'plain',
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: 2,
      textColor: COLOR_TEXT_DARK as any,
      halign: 'center',
      valign: 'top'
    },
    columnStyles: {
      0: { cellWidth: 91 },
      1: { cellWidth: 91 }
    }
  });

  // --------------------------------------------------------------------------
  // 9. LAMPIRAN-LAMPIRAN (JIKA DIPILIH)
  // --------------------------------------------------------------------------
  if (options.includeLampiran !== false && content.lampiran) {
    const lampiran = content.lampiran;

    // Start Lampiran on a clean new page
    doc.addPage();

    // LAMPIRAN HEADER BANNER
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(COLOR_INDIGO_DARK[0], COLOR_INDIGO_DARK[1], COLOR_INDIGO_DARK[2]);
    doc.text('LAMPIRAN DOKUMEN PENDUKUNG PEMBELAJARAN', pageWidth / 2, 20, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(COLOR_TEXT_MUTED[0], COLOR_TEXT_MUTED[1], COLOR_TEXT_MUTED[2]);
    doc.text(`RPM ${subject} • ${material} • ${gradeClass}`, pageWidth / 2, 26, { align: 'center' });

    doc.setDrawColor(COLOR_INDIGO_DARK[0], COLOR_INDIGO_DARK[1], COLOR_INDIGO_DARK[2]);
    doc.setLineWidth(0.6);
    doc.line(marginX, 29, pageWidth - marginX, 29);

    // Lampiran 1: Bahan Bacaan
    if (lampiran.bahan_bacaan) {
      const konsepRows = (lampiran.bahan_bacaan.konsep_kunci || []).map(kk => [
        kk.no?.toString() || '•',
        cleanText(kk.konsep),
        cleanText(kk.penjelasan),
        cleanText(kk.contoh)
      ]);

      const pertanyaanText = (lampiran.bahan_bacaan.pertanyaan_pemandu || [])
        .map(pp => `• ${cleanText(pp)}`)
        .join('\n');

      autoTable(doc, {
        startY: 33,
        margin: { left: marginX, right: marginX },
        head: [[{ content: 'Lampiran 1: Bahan Bacaan Peserta Didik', colSpan: 4, styles: { halign: 'left', fillColor: COLOR_INDIGO_DARK as any } }]],
        body: [
          [{ content: `A. Pengantar Mengapa Materi Ini Penting:\n${cleanText(lampiran.bahan_bacaan.pengantar)}`, colSpan: 4 }],
          ...konsepRows,
          [{ content: `B. Pertanyaan Pemandu Belajar:\n${pertanyaanText}`, colSpan: 4 }]
        ],
        theme: 'grid',
        styles: {
          font: 'helvetica',
          fontSize: 8,
          cellPadding: 2,
          textColor: COLOR_TEXT_DARK as any,
          lineColor: COLOR_INDIGO_BORDER as any,
          lineWidth: 0.15
        },
        headStyles: {
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        columnStyles: {
          0: { cellWidth: 12, halign: 'center' },
          1: { cellWidth: 40, fontStyle: 'bold' },
          2: { cellWidth: 70 },
          3: { cellWidth: 60 }
        }
      });
    }

    // Lampiran 2: LKPD
    if (lampiran.lkpd_detail) {
      const p1Rows = (lampiran.lkpd_detail.pertemuan_1?.tahapan || []).map(t => [
        t.no?.toString() || '•',
        cleanText(t.judul),
        cleanText(t.instruksi)
      ]);
      const p2Rows = (lampiran.lkpd_detail.pertemuan_2?.tahapan || []).map(t => [
        t.no?.toString() || '•',
        cleanText(t.judul),
        cleanText(t.instruksi)
      ]);

      autoTable(doc, {
        startY: getNextY(doc, 6),
        margin: { left: marginX, right: marginX },
        head: [[{ content: 'Lampiran 2: Lembar Kerja Peserta Didik (LKPD)', colSpan: 3, styles: { halign: 'left', fillColor: COLOR_INDIGO_DARK as any } }]],
        body: [
          [{ content: `Pertemuan 1: ${cleanText(lampiran.lkpd_detail.pertemuan_1?.judul)}`, colSpan: 3, styles: { fontStyle: 'bold', fillColor: COLOR_INDIGO_LIGHT as any } }],
          ...p1Rows,
          [{ content: `Pertemuan 2: ${cleanText(lampiran.lkpd_detail.pertemuan_2?.judul)}`, colSpan: 3, styles: { fontStyle: 'bold', fillColor: COLOR_INDIGO_LIGHT as any } }],
          ...p2Rows
        ],
        theme: 'grid',
        styles: {
          font: 'helvetica',
          fontSize: 8,
          cellPadding: 2,
          textColor: COLOR_TEXT_DARK as any,
          lineColor: COLOR_INDIGO_BORDER as any,
          lineWidth: 0.15
        },
        headStyles: {
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        columnStyles: {
          0: { cellWidth: 14, halign: 'center' },
          1: { cellWidth: 46, fontStyle: 'bold' },
          2: { cellWidth: 122 }
        }
      });
    }

    // Lampiran 3: Asesmen Awal
    if (lampiran.asesmen_awal_detail) {
      const pertanyaanAwal = (lampiran.asesmen_awal_detail.pertanyaan || []).map((p, i) => `${i + 1}. ${cleanText(p)}`).join('\n');
      const interpretasiRows = (lampiran.asesmen_awal_detail.panduan_interpretasi || []).map(pi => [
        cleanText(pi.skor),
        cleanText(pi.kategori),
        cleanText(pi.tindak_lanjut)
      ]);

      autoTable(doc, {
        startY: getNextY(doc, 6),
        margin: { left: marginX, right: marginX },
        head: [[{ content: 'Lampiran 3: Instrumen Asesmen Awal (Diagnostik)', colSpan: 3, styles: { halign: 'left', fillColor: COLOR_INDIGO_DARK as any } }]],
        body: [
          [{ content: `Petunjuk Guru:\n${cleanText(lampiran.asesmen_awal_detail.petunjuk)}\n\nPertanyaan Diagnostik:\n${pertanyaanAwal}`, colSpan: 3 }],
          [{ content: 'Rentang Skor', styles: { fontStyle: 'bold' } }, { content: 'Kategori', styles: { fontStyle: 'bold' } }, { content: 'Tindak Lanjut Pedagogis', styles: { fontStyle: 'bold' } }],
          ...interpretasiRows
        ],
        theme: 'grid',
        styles: {
          font: 'helvetica',
          fontSize: 8,
          cellPadding: 2,
          textColor: COLOR_TEXT_DARK as any,
          lineColor: COLOR_INDIGO_BORDER as any,
          lineWidth: 0.15
        },
        headStyles: {
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        columnStyles: {
          0: { cellWidth: 32, fontStyle: 'bold' },
          1: { cellWidth: 40 },
          2: { cellWidth: 110 }
        }
      });
    }

    // Lampiran 4: Asesmen Proses
    if (lampiran.asesmen_proses_detail) {
      const checklistRows = (lampiran.asesmen_proses_detail.checklist_p1 || []).map((c, i) => [
        (i + 1).toString(),
        cleanText(c),
        '[ ] Ya   [ ] Belum'
      ]);

      autoTable(doc, {
        startY: getNextY(doc, 6),
        margin: { left: marginX, right: marginX },
        head: [[{ content: 'Lampiran 4: Instrumen Asesmen Proses (Formatif)', colSpan: 3, styles: { halign: 'left', fillColor: COLOR_INDIGO_DARK as any } }]],
        body: [
          [{ content: `Dimensi yang Diamati: ${(lampiran.asesmen_proses_detail.dimensi_observasi || []).join(', ')}`, colSpan: 3, styles: { fontStyle: 'bold' } }],
          [{ content: 'No', styles: { fontStyle: 'bold' } }, { content: 'Indikator Kinerja Peserta Didik', styles: { fontStyle: 'bold' } }, { content: 'Keterlaksanaan', styles: { fontStyle: 'bold', halign: 'center' } }],
          ...checklistRows,
          [{ content: `Aspek Penilaian Antarteman: ${(lampiran.asesmen_proses_detail.peer_assessment_aspek || []).join(', ')}`, colSpan: 3 }]
        ],
        theme: 'grid',
        styles: {
          font: 'helvetica',
          fontSize: 8,
          cellPadding: 2,
          textColor: COLOR_TEXT_DARK as any,
          lineColor: COLOR_INDIGO_BORDER as any,
          lineWidth: 0.15
        },
        headStyles: {
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        columnStyles: {
          0: { cellWidth: 12, halign: 'center' },
          1: { cellWidth: 135 },
          2: { cellWidth: 35, halign: 'center' }
        }
      });
    }

    // Lampiran 5: Asesmen Akhir
    if (lampiran.asesmen_akhir_detail) {
      const pgRows = (lampiran.asesmen_akhir_detail.pilihan_ganda || []).map(pg => [
        pg.no?.toString() || '•',
        `${cleanText(pg.soal)}\nA. ${cleanText(pg.pilihan?.a)}\nB. ${cleanText(pg.pilihan?.b)}\nC. ${cleanText(pg.pilihan?.c)}\nD. ${cleanText(pg.pilihan?.d)}`
      ]);

      const isianText = (lampiran.asesmen_akhir_detail.isian_singkat || []).map(is => `${is.no}. ${cleanText(is.soal)}`).join('\n');
      const esaiText = (lampiran.asesmen_akhir_detail.uraian_esai || []).map(ue => `${ue.no}. ${cleanText(ue.soal)}`).join('\n');

      autoTable(doc, {
        startY: getNextY(doc, 6),
        margin: { left: marginX, right: marginX },
        head: [[{ content: 'Lampiran 5: Instrumen Asesmen Akhir (Sumatif)', colSpan: 2, styles: { halign: 'left', fillColor: COLOR_INDIGO_DARK as any } }]],
        body: [
          [{ content: 'Bagian A: Soal Pilihan Ganda (5 Butir Soal)', colSpan: 2, styles: { fontStyle: 'bold', fillColor: COLOR_INDIGO_LIGHT as any } }],
          ...pgRows,
          [{ content: `Bagian B: Soal Isian Singkat\n${isianText}`, colSpan: 2 }],
          [{ content: `Bagian C: Soal Uraian / Pemecahan Masalah\n${esaiText}`, colSpan: 2 }]
        ],
        theme: 'grid',
        styles: {
          font: 'helvetica',
          fontSize: 8,
          cellPadding: 2,
          textColor: COLOR_TEXT_DARK as any,
          lineColor: COLOR_INDIGO_BORDER as any,
          lineWidth: 0.15
        },
        headStyles: {
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        columnStyles: {
          0: { cellWidth: 12, halign: 'center' },
          1: { cellWidth: 170 }
        }
      });
    }

    // Lampiran 6: Rubrik Penilaian
    if (lampiran.rubrik_lengkap) {
      const rubrikRows = (lampiran.rubrik_lengkap.rubrik_dimensi || []).map(rd => [
        cleanText(rd.dimensi),
        cleanText(rd.skor_4),
        cleanText(rd.skor_3),
        cleanText(rd.skor_2),
        cleanText(rd.skor_1)
      ]);

      autoTable(doc, {
        startY: getNextY(doc, 6),
        margin: { left: marginX, right: marginX },
        head: [[{ content: 'Lampiran 6: Rubrik Penilaian Lengkap', colSpan: 5, styles: { halign: 'left', fillColor: COLOR_INDIGO_DARK as any } }]],
        body: [
          [
            { content: 'Dimensi', styles: { fontStyle: 'bold' } },
            { content: 'Skor 4 (Sangat Mahir)', styles: { fontStyle: 'bold' } },
            { content: 'Skor 3 (Mahir)', styles: { fontStyle: 'bold' } },
            { content: 'Skor 2 (Berkembang)', styles: { fontStyle: 'bold' } },
            { content: 'Skor 1 (Perlu Bimbingan)', styles: { fontStyle: 'bold' } }
          ],
          ...rubrikRows
        ],
        theme: 'grid',
        styles: {
          font: 'helvetica',
          fontSize: 7.5,
          cellPadding: 2,
          textColor: COLOR_TEXT_DARK as any,
          lineColor: COLOR_INDIGO_BORDER as any,
          lineWidth: 0.15
        },
        headStyles: {
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8.5
        },
        columnStyles: {
          0: { cellWidth: 32, fontStyle: 'bold' },
          1: { cellWidth: 38 },
          2: { cellWidth: 38 },
          3: { cellWidth: 37 },
          4: { cellWidth: 37 }
        }
      });
    }

    // Lampiran 7: Refleksi Mandiri
    if (lampiran.refleksi_mandiri) {
      const hasilText = (lampiran.refleksi_mandiri.evaluasi_hasil || []).map((h, i) => `${i + 1}. ${cleanText(h)}`).join('\n');
      const prosesText = (lampiran.refleksi_mandiri.evaluasi_proses || []).map((p, i) => `${i + 1}. ${cleanText(p)}`).join('\n');

      autoTable(doc, {
        startY: getNextY(doc, 6),
        margin: { left: marginX, right: marginX },
        head: [[{ content: 'Lampiran 7: Lembar Refleksi Mandiri Peserta Didik', colSpan: 2, styles: { halign: 'left', fillColor: COLOR_INDIGO_DARK as any } }]],
        body: [
          ['Bagian 1: Pemahaman Materi (Hasil Belajar)', hasilText],
          ['Bagian 2: Pengalaman Pembelajaran (Proses Belajar)', prosesText]
        ],
        theme: 'grid',
        styles: {
          font: 'helvetica',
          fontSize: 8,
          cellPadding: 2,
          textColor: COLOR_TEXT_DARK as any,
          lineColor: COLOR_INDIGO_BORDER as any,
          lineWidth: 0.15
        },
        headStyles: {
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        columnStyles: {
          0: { cellWidth: 46, fontStyle: 'bold', fillColor: COLOR_INDIGO_LIGHT as any },
          1: { cellWidth: 136 }
        }
      });
    }

    // Lampiran 8: Observasi Guru
    if (lampiran.observasi_guru) {
      const aspekRows = (lampiran.observasi_guru.aspek_pelaksanaan || []).map((asp, i) => [
        (i + 1).toString(),
        cleanText(asp),
        '[ ] Terlaksana'
      ]);

      autoTable(doc, {
        startY: getNextY(doc, 6),
        margin: { left: marginX, right: marginX },
        head: [[{ content: 'Lampiran 8: Lembar Observasi Keterlaksanaan Guru', colSpan: 3, styles: { halign: 'left', fillColor: COLOR_INDIGO_DARK as any } }]],
        body: [
          [{ content: 'No', styles: { fontStyle: 'bold' } }, { content: 'Aspek Pelaksanaan Pembelajaran', styles: { fontStyle: 'bold' } }, { content: 'Keterlaksanaan', styles: { fontStyle: 'bold', halign: 'center' } }],
          ...aspekRows
        ],
        theme: 'grid',
        styles: {
          font: 'helvetica',
          fontSize: 8,
          cellPadding: 2,
          textColor: COLOR_TEXT_DARK as any,
          lineColor: COLOR_INDIGO_BORDER as any,
          lineWidth: 0.15
        },
        headStyles: {
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        columnStyles: {
          0: { cellWidth: 12, halign: 'center' },
          1: { cellWidth: 135 },
          2: { cellWidth: 35, halign: 'center' }
        }
      });
    }

    // Lampiran 9: Observasi KBC
    if (lampiran.observasi_kbc) {
      const topikKbcRows = (lampiran.observasi_kbc.topik_insersi || []).map(ti => [
        cleanText(ti.nilai),
        `Nilai Inti: ${cleanText(ti.nilai_inti)}`,
        cleanText(ti.insersi_materi)
      ]);
      const rubrikKbcRows = (lampiran.observasi_kbc.rubrik_internalisasi || []).map(ri => [
        `Skor ${ri.skor} (${cleanText(ri.predikat)})`,
        cleanText(ri.deskripsi)
      ]);
      const refleksiKbc = (lampiran.observasi_kbc.refleksi_guru || []).map(rg => `• ${cleanText(rg)}`).join('\n');

      const bodyL9: any[] = [
        [{ content: `Petunjuk Observasi:\n${cleanText(lampiran.observasi_kbc.petunjuk)}`, colSpan: 3 }],
        [{ content: 'A. Topik Panca Cinta yang Diinsersi', colSpan: 3, styles: { fontStyle: 'bold', fillColor: COLOR_MAGENTA_LIGHT as any } }],
        ...topikKbcRows
      ];

      if (rubrikKbcRows.length > 0) {
        bodyL9.push([{ content: 'B. Rubrik Internalisasi Nilai Panca Cinta', colSpan: 3, styles: { fontStyle: 'bold', fillColor: COLOR_MAGENTA_LIGHT as any } }]);
        rubrikKbcRows.forEach(r => {
          bodyL9.push([
            { content: r[0], styles: { fontStyle: 'bold' } },
            { content: r[1], colSpan: 2 }
          ]);
        });
      }

      bodyL9.push([
        { content: `C. Refleksi Guru Terhadap Budaya Kasih Sayang:\n${refleksiKbc}`, colSpan: 3 }
      ]);
      bodyL9.push([
        { content: `D. Penguatan Iklim & Budaya Madrasah/Sekolah:\n${cleanText(lampiran.observasi_kbc.iklim_budaya)}`, colSpan: 3 }
      ]);

      autoTable(doc, {
        startY: getNextY(doc, 6),
        margin: { left: marginX, right: marginX },
        head: [[{ content: 'Lampiran 9: Lembar Observasi Internalisasi Panca Cinta (KBC)', colSpan: 3, styles: { halign: 'left', fillColor: COLOR_MAGENTA_DARK as any } }]],
        body: bodyL9,
        theme: 'grid',
        styles: {
          font: 'helvetica',
          fontSize: 8,
          cellPadding: 2,
          textColor: COLOR_TEXT_DARK as any,
          lineColor: COLOR_MAGENTA_BORDER as any,
          lineWidth: 0.15
        },
        headStyles: {
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        columnStyles: {
          0: { cellWidth: 36, fontStyle: 'bold', textColor: COLOR_MAGENTA_DARK as any },
          1: { cellWidth: 46 },
          2: { cellWidth: 100 }
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // TWO-PASS HEADER & FOOTER (RUNNING HEADERS + EXACT TOTAL PAGE NUMBERS)
  // --------------------------------------------------------------------------
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Running Header (from page 2 onwards)
    if (i > 1) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(COLOR_TEXT_MUTED[0], COLOR_TEXT_MUTED[1], COLOR_TEXT_MUTED[2]);
      doc.text(`RPM ${cleanText(subject)} • ${cleanText(gradeClass)} — ${cleanText(schoolName)}`, marginX, 10);

      doc.setDrawColor(COLOR_BORDER[0], COLOR_BORDER[1], COLOR_BORDER[2]);
      doc.setLineWidth(0.15);
      doc.line(marginX, 12, pageWidth - marginX, 12);
    }

    // Running Footer (on all pages)
    doc.setDrawColor(COLOR_BORDER[0], COLOR_BORDER[1], COLOR_BORDER[2]);
    doc.setLineWidth(0.15);
    doc.line(marginX, 287, pageWidth - marginX, 287);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(COLOR_TEXT_MUTED[0], COLOR_TEXT_MUTED[1], COLOR_TEXT_MUTED[2]);
    doc.text('Generator RPM AI • Kurikulum Merdeka & Kurikulum Berbasis Cinta (KBC)', marginX, 292);
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - marginX, 292, { align: 'right' });
  }

  return doc;
};

/**
 * Direct download helper for PDF
 */
export const downloadRPMPdf = (
  formData: RPMFormData,
  content: RPMGeneratedContent,
  options?: PDFExportOptions
): void => {
  const safeSubject = sanitizeFileName(formData.subject || 'MataPelajaran');
  const safeGrade = sanitizeFileName(formData.gradeClass || 'Kelas');
  const fileName = `RPM_${safeSubject}_${safeGrade}.pdf`;

  const doc = generateRPMPdf(formData, content, options);
  doc.save(fileName);
};
