import { RPMFormData, RPMGeneratedContent } from '../types';

/**
 * Utility to sanitize file names for download
 */
export const sanitizeFileName = (name: string): string => {
  return name.replace(/[^a-zA-Z0-9_\-]/g, '_').substring(0, 50);
};

/**
 * Generate a complete, professionally formatted Word (.doc) document
 * using Microsoft Word HTML/Mime format with MSO Word XML namespaces.
 * Exactly matches the 23-page PDF reference template.
 */
export const exportRPMToWord = (formData: RPMFormData, content: RPMGeneratedContent) => {
  const safeSubject = sanitizeFileName(formData.subject || 'MataPelajaran');
  const safeGrade = sanitizeFileName(formData.gradeClass || 'Kelas');
  const fileName = `RPM_${safeSubject}_${safeGrade}.doc`;

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

  const meetings = content.langkah_pembelajaran.daftar_pertemuan || [];
  const lampiran = content.lampiran;

  const docHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' 
      xmlns:w='urn:schemas-microsoft-com:office:word' 
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>RPM - ${subject}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page {
      size: 21.0cm 29.7cm; /* A4 */
      margin: 2.0cm 2.0cm 2.0cm 2.0cm;
      mso-page-orientation: portrait;
    }
    body {
      font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
      font-size: 10.5pt;
      line-height: 1.4;
      color: #000000;
      background-color: #ffffff;
    }
    .text-center { text-align: center; }
    .text-justify { text-align: justify; }
    .font-bold { font-weight: bold; }
    
    table.rpm-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6pt;
      margin-bottom: 14pt;
    }
    table.rpm-table th, table.rpm-table td {
      border: 1px solid #0f766e !important;
      padding: 6pt 8pt;
      vertical-align: top;
      font-size: 10pt;
      line-height: 1.35;
    }
    table.rpm-table th.header-toska {
      background-color: #0f766e !important;
      color: #ffffff !important;
      font-weight: bold;
      font-size: 11pt;
      text-align: left;
    }
    table.rpm-table th.header-kbc {
      background-color: #be185d !important;
      color: #ffffff !important;
      font-weight: bold;
      font-size: 11pt;
      text-align: left;
    }
    table.rpm-table th.header-lampiran {
      background-color: #4f46e5 !important;
      color: #ffffff !important;
      font-weight: bold;
      font-size: 11pt;
      text-align: left;
    }
    table.rpm-table td.col-left {
      background-color: #e6f4f1 !important;
      color: #0f766e !important;
      font-weight: bold;
      width: 28%;
    }
    table.rpm-table td.col-left-kbc {
      background-color: #fce7f3 !important;
      color: #9d174d !important;
      font-weight: bold;
      width: 28%;
    }
    .kbc-callout {
      border-left: 4px solid #e11d48;
      background-color: #fff1f2;
      padding: 6pt 10pt;
      margin: 4pt 0;
      color: #881337;
      font-size: 9.5pt;
    }
    .page-break {
      page-break-before: always;
      mso-special-character: line-break;
    }
  </style>
</head>
<body>

  <!-- COVER HEADER -->
  <div class="text-center" style="margin-bottom: 16pt;">
    <h1 style="font-size: 16pt; color: #0f766e; margin: 0; font-weight: bold; text-transform: uppercase;">
      PERENCANAAN PEMBELAJARAN MENDALAM (RPM)
    </h1>
    <h2 style="font-size: 13pt; color: #1e293b; margin: 4pt 0 0 0; font-weight: bold; text-transform: uppercase;">
      ${schoolName}
    </h2>
    <p style="font-size: 10.5pt; color: #475569; margin: 2pt 0 0 0; font-weight: bold;">
      Tahun Ajaran ${academicYear}
    </p>
    <div style="border-bottom: 2px solid #0f766e; margin-top: 8pt; margin-bottom: 12pt;"></div>
  </div>

  <!-- IDENTITAS -->
  <table class="rpm-table">
    <thead>
      <tr>
        <th colspan="2" class="header-toska">IDENTITAS</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="col-left">Nama Sekolah</td>
        <td>${schoolName}</td>
      </tr>
      <tr>
        <td class="col-left">Kelas / Fase</td>
        <td>${gradeClass} / ${fase}</td>
      </tr>
      <tr>
        <td class="col-left">Semester</td>
        <td>${semester}</td>
      </tr>
      <tr>
        <td class="col-left">Tahun Ajaran</td>
        <td>${academicYear}</td>
      </tr>
      <tr>
        <td class="col-left">Mata Pelajaran</td>
        <td>${subject}</td>
      </tr>
      <tr>
        <td class="col-left">Bab / Materi</td>
        <td style="font-weight: bold; color: #0f766e;">${material}</td>
      </tr>
      <tr>
        <td class="col-left">Alokasi Waktu</td>
        <td>${duration}</td>
      </tr>
    </tbody>
  </table>

  <!-- A. IDENTIFIKASI -->
  <table class="rpm-table">
    <thead>
      <tr>
        <th colspan="2" class="header-toska">A. IDENTIFIKASI</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="col-left">Peserta Didik</td>
        <td class="text-justify">
          ${content.identifikasi.peserta_didik.map(p => `<p style="margin: 0 0 6pt 0;">${p}</p>`).join('')}
        </td>
      </tr>
      <tr>
        <td class="col-left">Materi Pelajaran</td>
        <td class="text-justify">
          ${content.identifikasi.materi_pelajaran}
        </td>
      </tr>
      <tr>
        <td class="col-left">Dimensi Profil Lulusan</td>
        <td>
          <p style="font-weight: bold; margin: 0 0 4pt 0;">Dimensi yang dicapai:</p>
          ${allDimensions.map(d => {
            const selected = isDimSelected(d.id, d.label);
            return `<div>▸ ${d.id}: ${d.label} ${selected ? '<strong style="color: #059669;">✓</strong>' : ''}</div>`;
          }).join('')}
        </td>
      </tr>
      <tr>
        <td class="col-left">Lintas Disiplin</td>
        <td>
          ${content.identifikasi.lintas_disiplin.map(ld => `<div>▸ ${ld}</div>`).join('')}
        </td>
      </tr>
      <tr>
        <td class="col-left">Panca Cinta</td>
        <td>
          ${content.panca_cinta_narasi.map(pc => `
            <div style="margin-bottom: 4pt;">
              <strong style="color: #0f766e;">▸ ${pc.nilai}:</strong> ${pc.deskripsi}
            </div>
          `).join('')}
        </td>
      </tr>
    </tbody>
  </table>

  <!-- B. DESAIN PEMBELAJARAN -->
  <table class="rpm-table">
    <thead>
      <tr>
        <th colspan="2" class="header-toska">B. DESAIN PEMBELAJARAN</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="col-left">Capaian Pembelajaran</td>
        <td class="text-justify">${content.desain_pembelajaran.capaian_pembelajaran_narasi}</td>
      </tr>
      <tr>
        <td class="col-left">Tujuan Pembelajaran</td>
        <td class="text-justify">${formData.tp || 'Menganalisis konsep dan menerapkan dalam penyelesaian masalah kontekstual.'}</td>
      </tr>
      <tr>
        <td class="col-left">Topik Pembelajaran</td>
        <td>
          <strong>${content.desain_pembelajaran.topik_pembelajaran}</strong><br/>
          <em style="font-size: 9pt; color: #475569;">Konteks: ${subject} – ${gradeClass}</em>
        </td>
      </tr>
      ${content.alokasi_durasi_aktivitas ? `
      <tr>
        <td class="col-left">Alokasi Durasi Waktu</td>
        <td>
          Pendahuluan: <strong>± ${content.alokasi_durasi_aktivitas.pendahuluan} menit</strong> | 
          Kegiatan Inti: <strong>± ${content.alokasi_durasi_aktivitas.inti} menit</strong> | 
          Penutup: <strong>± ${content.alokasi_durasi_aktivitas.penutup} menit</strong>
          ${content.alokasi_durasi_aktivitas.catatan_topik ? `<br/><em style="font-size: 9pt; color: #475569;">Catatan Alokasi Topik: ${content.alokasi_durasi_aktivitas.catatan_topik}</em>` : ''}
        </td>
      </tr>
      ` : ''}
      <tr>
        <td class="col-left">Praktik Pedagogis</td>
        <td>
          ${formData.pedagogies.map((ped, idx) => `<div>Pertemuan ${idx + 1}: <strong>${ped}</strong> (2 x 40 menit)</div>`).join('')}
        </td>
      </tr>
      ${content.diferensiasi_pembelajaran ? `
      <tr>
        <td class="col-left">Diferensiasi Pembelajaran</td>
        <td>
          <div><strong>• Diferensiasi Konten:</strong> ${content.diferensiasi_pembelajaran.konten}</div>
          <div style="margin-top: 3pt;"><strong>• Diferensiasi Proses:</strong> ${content.diferensiasi_pembelajaran.proses}</div>
          <div style="margin-top: 3pt;"><strong>• Diferensiasi Produk:</strong> ${content.diferensiasi_pembelajaran.produk}</div>
          <div style="margin-top: 4pt; font-size: 9.5pt; color: #0f766e; background-color: #f0fdfa; padding: 4pt 6pt; border-radius: 4px;">
            <strong>Akomodasi Keragaman Siswa:</strong>
            ${(content.diferensiasi_pembelajaran.kelompok_sasaran || []).map(k => `<div>▸ <strong>${k.kelompok}:</strong> ${k.pendampingan}</div>`).join('')}
          </div>
        </td>
      </tr>
      ` : ''}
      <tr>
        <td class="col-left">Kemitraan</td>
        <td>${content.desain_pembelajaran.kemitraan.replace(/\n/g, '<br/>')}</td>
      </tr>
      <tr>
        <td class="col-left">Lingkungan</td>
        <td>${content.desain_pembelajaran.lingkungan.replace(/\n/g, '<br/>')}</td>
      </tr>
      <tr>
        <td class="col-left">Pemanfaatan Digital</td>
        <td>${content.desain_pembelajaran.digital.replace(/\n/g, '<br/>')}</td>
      </tr>
    </tbody>
  </table>

  <!-- C. PENGALAMAN BELAJAR — LANGKAH-LANGKAH PEMBELAJARAN -->
  <table class="rpm-table">
    <thead>
      <tr>
        <th colspan="2" class="header-toska">C. PENGALAMAN BELAJAR — LANGKAH-LANGKAH PEMBELAJARAN</th>
      </tr>
    </thead>
    <tbody>
      ${meetings.map(m => `
        <tr>
          <td class="col-left" style="text-align: center;">
            <div style="font-size: 11pt; font-weight: bold; color: #0f766e;">${m.pertemuan_ke}</div>
            <div style="font-size: 9pt; color: #475569; margin-top: 2pt;">${m.alokasi_waktu}</div>
            <div style="margin-top: 6pt; font-weight: bold; color: #0f766e;">${m.model_pembelajaran}</div>
          </td>
          <td>
            <!-- PENDAHULUAN -->
            <div style="font-weight: bold; color: #0f766e; font-size: 10.5pt; border-bottom: 1px solid #99f6e4; padding-bottom: 2pt;">
              ${m.pendahuluan.judul}
            </div>
            ${m.panca_cinta_fase ? `
              <div style="font-size: 9pt; font-weight: bold; color: #be185d; background-color: #fdf2f8; padding: 3pt 6pt; margin: 4pt 0;">
                💗 Topik Panca Cinta diinsersi pada fase ini: ${m.panca_cinta_fase.join(' • ')}
              </div>
            ` : ''}
            ${m.pendahuluan.langkah.map(step => `
              <p style="margin: 3pt 0; text-align: justify;">▸ ${step.deskripsi}</p>
              ${step.insersi_kbc ? `
                <div class="kbc-callout">
                  <strong>❤ ${step.insersi_kbc.nilai}:</strong> ${step.insersi_kbc.uraian}
                </div>
              ` : ''}
            `).join('')}

            <!-- INTI -->
            <div style="font-weight: bold; color: #0f766e; font-size: 10.5pt; border-bottom: 1px solid #99f6e4; padding-bottom: 2pt; margin-top: 10pt;">
              ${m.inti.judul} (${m.inti.sintaks_model})
            </div>
            ${m.inti.langkah.map(step => `
              ${step.tahap ? `<div style="font-weight: bold; color: #0f766e; margin-top: 4pt;">${step.tahap}</div>` : ''}
              <p style="margin: 3pt 0; text-align: justify;">▸ ${step.deskripsi}</p>
              ${step.insersi_kbc ? `
                <div class="kbc-callout">
                  <strong>❤ ${step.insersi_kbc.nilai}:</strong> ${step.insersi_kbc.uraian}
                </div>
              ` : ''}
            `).join('')}

            <!-- PENUTUP -->
            <div style="font-weight: bold; color: #0f766e; font-size: 10.5pt; border-bottom: 1px solid #99f6e4; padding-bottom: 2pt; margin-top: 10pt;">
              ${m.penutup.judul}
            </div>
            ${m.penutup.langkah.map(step => `
              ${step.tahap ? `<div style="font-weight: bold; color: #0f766e; margin-top: 4pt;">${step.tahap}</div>` : ''}
              <p style="margin: 3pt 0; text-align: justify;">▸ ${step.deskripsi}</p>
              ${step.insersi_kbc ? `
                <div class="kbc-callout">
                  <strong>❤ ${step.insersi_kbc.nilai}:</strong> ${step.insersi_kbc.uraian}
                </div>
              ` : ''}
            `).join('')}
          </td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <!-- D. ASESMEN PEMBELAJARAN -->
  <table class="rpm-table">
    <thead>
      <tr>
        <th colspan="2" class="header-toska">D. ASESMEN PEMBELAJARAN</th>
      </tr>
    </thead>
    <tbody>
      ${content.metode_penilaian_terpilih && content.metode_penilaian_terpilih.length > 0 ? `
      <tr>
        <td class="col-left">Metode Penilaian Terpilih</td>
        <td>
          ${content.metode_penilaian_terpilih.map(m => `<div>▸ <strong>${m}</strong></div>`).join('')}
        </td>
      </tr>
      ` : ''}
      <tr>
        <td class="col-left">Asesmen Awal (Diagnostik)</td>
        <td>${content.asesmen.awal.replace(/\n/g, '<br/>')}</td>
      </tr>
      <tr>
        <td class="col-left">Asesmen Proses (Formatif)</td>
        <td>${content.asesmen.proses.replace(/\n/g, '<br/>')}</td>
      </tr>
      <tr>
        <td class="col-left">Asesmen Akhir (Sumatif)</td>
        <td>${content.asesmen.akhir.replace(/\n/g, '<br/>')}</td>
      </tr>
      <tr>
        <td class="col-left">Kriteria Ketercapaian (KKTP)</td>
        <td>${content.lampiran.kktp.replace(/\n/g, '<br/>')}</td>
      </tr>
    </tbody>
  </table>

  <!-- E. INSERSI KURIKULUM BERBASIS CINTA (KBC) -->
  ${content.insersi_kbc ? `
    <table class="rpm-table">
      <thead>
        <tr>
          <th colspan="2" class="header-kbc">E. INSERSI KURIKULUM BERBASIS CINTA (KBC)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="col-left-kbc">Dasar Hukum</td>
          <td><strong>${content.insersi_kbc.dasar_hukum}</strong></td>
        </tr>
        <tr>
          <td class="col-left-kbc">Posisi KBC dalam RPM Ini</td>
          <td class="text-justify">${content.insersi_kbc.posisi_kbc}</td>
        </tr>
        <tr>
          <td class="col-left-kbc">Topik Panca Cinta yang Diinsersi</td>
          <td>
            ${content.insersi_kbc.topik_diinsersi.map(t => `<div><strong>${t.nilai}:</strong> ${t.deskripsi}</div>`).join('')}
          </td>
        </tr>
        <tr>
          <td class="col-left-kbc">Pendekatan Internalisasi</td>
          <td>${content.insersi_kbc.pendekatan}</td>
        </tr>
        <tr>
          <td class="col-left-kbc">Letak Insersi pada Langkah Pembelajaran</td>
          <td>
            ${content.insersi_kbc.letak_insersi.map(li => `
              <div style="margin-bottom: 4pt;">
                <strong>${li.nilai}</strong><br/>
                <span style="font-size: 9pt;">Nilai inti: ${li.nilai_inti}</span><br/>
                <span style="font-size: 9pt; font-weight: bold;">Diinsersi pada: ${li.fase}</span>
              </div>
            `).join('')}
          </td>
        </tr>
        <tr>
          <td class="col-left-kbc">Iklim & Budaya Madrasah</td>
          <td>
            <div><strong>Pembiasaan:</strong> ${content.insersi_kbc.iklim_budaya.pembiasaan}</div>
            <div><strong>Keteladanan Guru:</strong> ${content.insersi_kbc.iklim_budaya.keteladanan}</div>
            <div><strong>Experiential:</strong> ${content.insersi_kbc.iklim_budaya.experiential}</div>
          </td>
        </tr>
        <tr>
          <td class="col-left-kbc">Evaluasi Holistik</td>
          <td>${content.insersi_kbc.evaluasi_holistik}</td>
        </tr>
      </tbody>
    </table>
  ` : ''}

  <!-- TANDA TANGAN -->
  <table style="width: 100%; border: none; margin-top: 20pt; margin-bottom: 20pt;">
    <tr>
      <td style="width: 50%; text-align: center; vertical-align: top; border: none;">
        <p>Mengetahui,</p>
        <p><strong>Kepala ${schoolName}</strong></p>
        <div style="height: 60pt;"></div>
        <p><strong><u>${principalName}</u></strong></p>
        <p style="font-size: 9pt;">NIP. ${principalNIP}</p>
      </td>
      <td style="width: 50%; text-align: center; vertical-align: top; border: none;">
        <p>Banyuwangi, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <p><strong>Guru Mata Pelajaran</strong></p>
        <div style="height: 60pt;"></div>
        <p><strong><u>${teacherName}</u></strong></p>
        <p style="font-size: 9pt;">NIP. ${teacherNIP}</p>
      </td>
    </tr>
  </table>
  <div style="text-align: center; font-size: 8.5pt; color: #64748b; font-style: italic; border-top: 1px solid #cbd5e1; padding-top: 4pt;">
    Generator RPM • Perencanaan Pembelajaran Mendalam • Created by Eko Cahyono
  </div>

  <!-- LAMPIRAN (PAGE BREAK) -->
  <div class="page-break"></div>

  <div class="text-center" style="margin-bottom: 14pt;">
    <h2 style="font-size: 16pt; color: #3730a3; margin: 0; font-weight: bold; text-transform: uppercase;">
      LAMPIRAN
    </h2>
    <h3 style="font-size: 11pt; color: #334155; margin: 2pt 0 0 0; font-weight: bold;">
      RPM ${subject} — ${material} — ${gradeClass}
    </h3>
    <p style="font-size: 9.5pt; color: #64748b; margin: 2pt 0 0 0;">
      9 Dokumen Pendukung Pembelajaran
    </p>
    <div style="border-bottom: 2px solid #4f46e5; margin-top: 6pt; margin-bottom: 12pt;"></div>
  </div>

  <!-- LAMPIRAN 1 -->
  ${lampiran.bahan_bacaan ? `
    <table class="rpm-table">
      <thead>
        <tr>
          <th colspan="4" class="header-lampiran">Lampiran 1 — Bahan Bacaan Peserta Didik</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="4">
            <strong>A. Pengantar — Mengapa Materi Ini Penting?</strong>
            <p class="text-justify" style="margin: 4pt 0;">${lampiran.bahan_bacaan.pengantar}</p>
          </td>
        </tr>
        <tr style="background-color: #f1f5f9; font-weight: bold;">
          <td style="width: 8%;">No</td>
          <td style="width: 27%;">Konsep</td>
          <td style="width: 35%;">Penjelasan</td>
          <td style="width: 30%;">Contoh</td>
        </tr>
        ${lampiran.bahan_bacaan.konsep_kunci.map(kk => `
          <tr>
            <td style="text-align: center;">${kk.no}</td>
            <td><strong>${kk.konsep}</strong></td>
            <td class="text-justify">${kk.penjelasan}</td>
            <td>${kk.contoh}</td>
          </tr>
        `).join('')}
        <tr>
          <td colspan="4">
            <strong>B. Pertanyaan Pemandu Belajar</strong>
            ${lampiran.bahan_bacaan.pertanyaan_pemandu.map(pp => `<div>${pp}</div>`).join('')}
          </td>
        </tr>
      </tbody>
    </table>
  ` : ''}

  <!-- LAMPIRAN 2 -->
  ${lampiran.lkpd_detail ? `
    <table class="rpm-table">
      <thead>
        <tr>
          <th colspan="3" class="header-lampiran">Lampiran 2 — Lembar Kerja Peserta Didik (LKPD)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="3" style="background-color: #f8fafc; font-weight: bold;">
            ${lampiran.lkpd_detail.pertemuan_1.judul}
          </td>
        </tr>
        ${lampiran.lkpd_detail.pertemuan_1.tahapan.map(t => `
          <tr>
            <td style="width: 8%; text-align: center;">${t.no}</td>
            <td style="width: 25%;"><strong>${t.judul}</strong></td>
            <td>${t.instruksi}</td>
          </tr>
        `).join('')}
        <tr>
          <td colspan="3" style="background-color: #f8fafc; font-weight: bold;">
            ${lampiran.lkpd_detail.pertemuan_2.judul}
          </td>
        </tr>
        ${lampiran.lkpd_detail.pertemuan_2.tahapan.map(t => `
          <tr>
            <td style="width: 8%; text-align: center;">${t.no}</td>
            <td style="width: 25%;"><strong>${t.judul}</strong></td>
            <td>${t.instruksi}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  ` : ''}

  <!-- LAMPIRAN 3 -->
  ${lampiran.asesmen_awal_detail ? `
    <table class="rpm-table">
      <thead>
        <tr>
          <th colspan="3" class="header-lampiran">Lampiran 3 — Instrumen Asesmen Awal (Diagnostik)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="3">
            <p><em>${lampiran.asesmen_awal_detail.petunjuk}</em></p>
            <strong>Pertanyaan Eksplorasi:</strong>
            ${lampiran.asesmen_awal_detail.pertanyaan.map(p => `<div>${p}</div>`).join('')}
          </td>
        </tr>
        <tr style="background-color: #f1f5f9; font-weight: bold;">
          <td>Rentang Skor</td>
          <td>Kategori</td>
          <td>Tindak Lanjut</td>
        </tr>
        ${lampiran.asesmen_awal_detail.panduan_interpretasi.map(pi => `
          <tr>
            <td><strong>${pi.skor}</strong></td>
            <td>${pi.kategori}</td>
            <td>${pi.tindak_lanjut}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  ` : ''}

  <!-- LAMPIRAN 4 -->
  ${lampiran.asesmen_proses_detail ? `
    <table class="rpm-table">
      <thead>
        <tr>
          <th colspan="3" class="header-lampiran">Lampiran 4 — Instrumen Asesmen Proses (Formatif)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="3">
            <strong>A. Lembar Observasi Sikap Dimensi:</strong> ${lampiran.asesmen_proses_detail.dimensi_observasi.join(', ')}
          </td>
        </tr>
        <tr style="background-color: #f1f5f9; font-weight: bold;">
          <td style="width: 8%;">No</td>
          <td style="width: 72%;">Indikator Kinerja</td>
          <td style="width: 20%;">Keterlaksanaan</td>
        </tr>
        ${lampiran.asesmen_proses_detail.checklist_p1.map((c, idx) => `
          <tr>
            <td style="text-align: center;">${idx + 1}</td>
            <td>${c}</td>
            <td style="text-align: center;">☐ Ya &nbsp; ☐ Tidak</td>
          </tr>
        `).join('')}
        <tr>
          <td colspan="3">
            <strong>B. Penilaian Sejawat:</strong> ${lampiran.asesmen_proses_detail.peer_assessment_aspek.join(', ')}
          </td>
        </tr>
      </tbody>
    </table>
  ` : ''}

  <!-- LAMPIRAN 5 -->
  ${lampiran.asesmen_akhir_detail ? `
    <table class="rpm-table">
      <thead>
        <tr>
          <th colspan="3" class="header-lampiran">Lampiran 5 — Instrumen Asesmen Akhir (Sumatif)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="3">
            <strong>Bagian A — Pilihan Ganda (5 Soal)</strong>
            ${lampiran.asesmen_akhir_detail.pilihan_ganda.map(pg => `
              <div style="margin: 6pt 0;">
                <div><strong>${pg.no}. ${pg.soal}</strong></div>
                <div style="margin-left: 12pt; font-size: 9.5pt;">
                  A. ${pg.pilihan.a}<br/>
                  B. ${pg.pilihan.b}<br/>
                  C. ${pg.pilihan.c}<br/>
                  D. ${pg.pilihan.d}
                </div>
              </div>
            `).join('')}
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <strong>Bagian B — Isian Singkat</strong>
            ${lampiran.asesmen_akhir_detail.isian_singkat.map(is => `
              <div style="margin: 4pt 0;"><strong>${is.no}.</strong> ${is.soal}</div>
            `).join('')}
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <strong>Bagian C — Uraian Esai</strong>
            ${lampiran.asesmen_akhir_detail.uraian_esai.map(ue => `
              <div style="margin: 4pt 0;"><strong>${ue.no}.</strong> ${ue.soal}</div>
            `).join('')}
          </td>
        </tr>
      </tbody>
    </table>
  ` : ''}

  <!-- LAMPIRAN 6 -->
  ${lampiran.rubrik_lengkap ? `
    <table class="rpm-table">
      <thead>
        <tr>
          <th colspan="5" class="header-lampiran">Lampiran 6 — Rubrik Penilaian Lengkap</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: #f1f5f9; font-weight: bold;">
          <td>Dimensi</td>
          <td>Skor 4</td>
          <td>Skor 3</td>
          <td>Skor 2</td>
          <td>Skor 1</td>
        </tr>
        ${lampiran.rubrik_lengkap.rubrik_dimensi.map(rd => `
          <tr>
            <td><strong>${rd.dimensi}</strong></td>
            <td>${rd.skor_4}</td>
            <td>${rd.skor_3}</td>
            <td>${rd.skor_2}</td>
            <td>${rd.skor_1}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  ` : ''}

  <!-- LAMPIRAN 7 -->
  ${lampiran.refleksi_mandiri ? `
    <table class="rpm-table">
      <thead>
        <tr>
          <th colspan="2" class="header-lampiran">Lampiran 7 — Lembar Refleksi Mandiri Peserta Didik</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="2">
            <strong>Bagian 1: Hasil Belajar</strong>
            ${lampiran.refleksi_mandiri.evaluasi_hasil.map(eh => `<div>${eh}</div>`).join('')}
            <br/>
            <strong>Bagian 2: Proses Belajar</strong>
            ${lampiran.refleksi_mandiri.evaluasi_proses.map(ep => `<div>${ep}</div>`).join('')}
          </td>
        </tr>
      </tbody>
    </table>
  ` : ''}

  <!-- LAMPIRAN 8 -->
  ${lampiran.observasi_guru ? `
    <table class="rpm-table">
      <thead>
        <tr>
          <th colspan="2" class="header-lampiran">Lampiran 8 — Lembar Observasi Guru</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: #f1f5f9; font-weight: bold;">
          <td>Aspek Pelaksanaan</td>
          <td style="width: 25%; text-align: center;">Keterlaksanaan</td>
        </tr>
        ${lampiran.observasi_guru.aspek_pelaksanaan.map(asp => `
          <tr>
            <td>${asp}</td>
            <td style="text-align: center;">☐ Terlaksana</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  ` : ''}

  <!-- LAMPIRAN 9 -->
  ${lampiran.observasi_kbc ? `
    <table class="rpm-table">
      <thead>
        <tr>
          <th colspan="3" class="header-kbc">Lampiran 9 — Lembar Observasi Internalisasi Panca Cinta (KBC)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="3">
            <p><em>${lampiran.observasi_kbc.petunjuk}</em></p>
          </td>
        </tr>
        ${lampiran.observasi_kbc.topik_insersi.map(ti => `
          <tr>
            <td style="width: 25%; font-weight: bold; color: #be185d;">${ti.nilai}</td>
            <td style="width: 35%;">Nilai Inti: ${ti.nilai_inti}</td>
            <td>${ti.insersi_materi}</td>
          </tr>
        `).join('')}
        <tr>
          <td colspan="3">
            <strong>Refleksi Guru:</strong>
            ${lampiran.observasi_kbc.refleksi_guru.map(rg => `<div>▸ ${rg}</div>`).join('')}
          </td>
        </tr>
        <tr>
          <td colspan="3" style="font-size: 8.5pt; font-style: italic; color: #64748b;">
            ${lampiran.observasi_kbc.iklim_budaya}
          </td>
        </tr>
      </tbody>
    </table>
  ` : ''}

</body>
</html>
  `.trim();

  // Create Word document Blob
  const blob = new Blob(['\ufeff', docHtml], {
    type: 'application/msword;charset=utf-8'
  });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

export { generateRPMPdf, downloadRPMPdf, type PDFExportOptions } from './pdfExportService';
import { generateRPMPdf, downloadRPMPdf } from './pdfExportService';

/**
 * Generate and download a PDF document using jsPDF & autoTable
 */
export const exportRPMToPDF = async (
  formData: RPMFormData,
  content: RPMGeneratedContent,
  onStart?: () => void,
  onComplete?: () => void,
  onError?: (err: any) => void
) => {
  try {
    onStart?.();
    downloadRPMPdf(formData, content, { includeLampiran: true });
    onComplete?.();
  } catch (err: any) {
    console.error('Error generating PDF with jsPDF:', err);
    onError?.(err);
  }
};

/**
 * Trigger native print dialog which enables "Simpan sebagai PDF" with sharp vector fonts
 */
export const printRPMDocument = () => {
  window.print();
};

