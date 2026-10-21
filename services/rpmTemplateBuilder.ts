import { RPMFormData, RPMGeneratedContent, PertemuanLangkahPDF, DiferensiasiPembelajaranDoc } from '../types';

/**
 * Builds the complete 23-page template structure matching the user's reference PDF,
 * dynamically customized with the user's specific form inputs (school name, subject,
 * class, teacher, material, CP, TP, pedagogies, DPL, and Panca Cinta).
 */
export const buildCompleteRPMFromTemplate = (
  data: RPMFormData,
  partialContent?: Partial<RPMGeneratedContent>
): RPMGeneratedContent => {
  const school = data.schoolName || 'SMP Negeri 2 Banyuwangi';
  const subject = data.subject || 'Ilmu Pengetahuan Alam (IPA)';
  const material = data.material || 'Sifat Zat dan Perubahannya';
  const grade = data.gradeClass || 'Kelas 7';
  const fase = data.fase || 'Fase D';
  const semester = data.semester || '1 (Ganjil)';
  const duration = data.duration || '2 Pertemuan (2 x 40 menit | 2 x 40 menit)';
  const academicYear = data.academicYear || '2025/2026';
  const teacher = data.teacherName || 'Eko Cahyono';
  const principal = data.principalName || 'Drs. Ahmad Syafii';

  const selectedDimensions = data.dimensions && data.dimensions.length > 0 
    ? data.dimensions 
    : ['Keimanan & Ketakwaan', 'Penalaran Kritis', 'Kolaborasi', 'Kemandirian'];

  const selectedPancaCinta = data.pancaCinta && data.pancaCinta.length > 0
    ? data.pancaCinta
    : ['Cinta Allah dan Rasul', 'Cinta Ilmu', 'Cinta Lingkungan'];

  const pedagogy1 = data.pedagogies?.[0] || 'Inkuiri-Discovery';
  const pedagogy2 = data.pedagogies?.[1] || 'Problem Based Learning';

  // Alokasi Durasi Waktu Kustom
  const allocPendahuluan = data.timeAllocations?.pendahuluan ?? 10;
  const allocInti = data.timeAllocations?.inti ?? 55;
  const allocPenutup = data.timeAllocations?.penutup ?? 15;
  const perTopicDurationNote = data.timeAllocations?.perTopicDuration || '';

  // Metode Penilaian Terpilih
  const selectedAssessmentMethods = data.assessmentMethods && data.assessmentMethods.length > 0
    ? data.assessmentMethods
    : ['Kuis Interaktif / Formatif Cepat', 'Proyek Portofolio Kelompok (PjBL)', 'Presentasi & Unjuk Kerja', 'Observasi Sikap & Lembar Jurnal Refleksi'];

  // Strategi Diferensiasi Pembelajaran
  const diffEnabled = data.differentiation?.enabled !== false;
  const diffContent = data.differentiation?.content || `Penyediaan materi bertingkat: teks bacaan ringkas bergambar untuk kelompok penguatan, artikel investigasi untuk kelompok reguler, dan studi kasus komparatif untuk kelompok mahir.`;
  const diffProcess = data.differentiation?.process || `Pengelompokan fleksibel (homogen untuk bimbingan terfokus, heterogen untuk kolaborasi proyek); guru memberikan scaffolding intensif bagi peserta didik yang memerlukan pendampingan khusus.`;
  const diffProduct = data.differentiation?.product || `Peserta didik bebas memilih format laporan akhir: infografis/poster digital, lembar kerja terisi, demonstrasi presentasi lisan, atau video dokumentasi mini.`;
  const diffTargetGroups = data.differentiation?.targetGroups && data.differentiation.targetGroups.length > 0
    ? data.differentiation.targetGroups
    : ['Kelompok Mahir / Cepat', 'Kelompok Reguler / Sedang', 'Kelompok Perlu Bimbingan / Khusus'];

  const defaultDiferensiasi: DiferensiasiPembelajaranDoc = {
    konten: diffContent,
    proses: diffProcess,
    produk: diffProduct,
    strategi_inklusi: `Mengakomodasi keberagaman modalitas belajar (visual, auditori, kinestetik) dan kecepatan belajar siswa tanpa segregasi diskriminatif.`,
    kelompok_sasaran: [
      {
        kelompok: 'Kelompok Mahir / Cepat',
        karakteristik: 'Telah menguasai konsep dasar materi, cepat menyelesaikan instruksi, memiliki rasa ingin tahu tinggi.',
        pendampingan: 'Diberikan tantangan perluasan (higher-order thinking), peran sebagai tutor sebaya, dan proyek eksplorasi mendalam.'
      },
      {
        kelompok: 'Kelompok Reguler / Sedang',
        karakteristik: 'Memahami konsep dengan kecepatan normal sesuai tahapan LKPD terstruktur.',
        pendampingan: 'Bimbingan berkala, diskusi kelompok kolaboratif, dan konfirmasi pemahaman melalui kuis formatif.'
      },
      {
        kelompok: 'Kelompok Perlu Bimbingan / Khusus',
        karakteristik: 'Memerlukan waktu adaptasi lebih lama, miskonsepsi pada konsep prasyarat, membutuhkan bantuan konkret.',
        pendampingan: 'Scaffolding bertahap, pendampingan langsung oleh guru di meja kelompok, penggunaan kartu konsep visual dan analogi konkret.'
      }
    ]
  };

  // 1. Identifikasi
  const defaultIdentifikasi = {
    peserta_didik: [
      `Peserta didik ${school} ${grade} memiliki karakteristik belajar yang beragam. Dalam konteks materi "${material}", peserta didik memiliki pengetahuan awal dasar yang relevan namun masih memerlukan bimbingan untuk menghubungkan konsep secara sistematis dan kritis.`,
      `Gaya belajar peserta didik terdistribusi seimbang antara visual, auditori, dan kinestetik sehingga memerlukan diferensiasi proses dan media belajar interaktif.`,
      `Tingkat kesiapan belajar menunjukkan sebagian peserta didik telah mengenal fenomena keseharian terkait materi, sedangkan sebagian lainnya memerlukan scaffolding bertahap.`
    ],
    materi_pelajaran: `Materi "${material}" bersifat konseptual, prosedural, dan kontekstual. Pembelajaran dirancang dalam tiga tahap: (1) Memahami; (2) Mengaplikasi melalui ${pedagogy1} dan ${pedagogy2}; (3) Merefleksi. Konsep yang dipelajari memberikan bekal kemampuan analitis dan keterampilan pemecahan masalah autentik bagi peserta didik.`,
    lintas_disiplin: [
      'Bahasa Indonesia (laporan pengamatan, komunikasi ilmiah, penyusunan argumen)',
      'Matematika (pengukuran, perhitungan, analisis data statistik sederhana)',
      'Pendidikan Lingkungan Hidup (relevansi dengan pelestarian alam dan ekosistem)',
      'Seni Budaya (ekspresi kreatif dalam penyajian media dan presentasi proyek)'
    ]
  };

  // 2. Profil Lulusan Narasi
  const defaultProfilPancasila = selectedDimensions.map(dim => {
    let deskripsi = `Menunjukkan kemampuan ${dim} dalam rangkaian penyelidikan dan kolaborasi pemecahan masalah materi "${material}".`;
    if (dim.includes('Keimanan')) {
      deskripsi = `Menghayati keteraturan ciptaan Tuhan YME melalui materi "${material}" serta menerapkan adab belajar dengan niat tulus dan kejujuran ilmiah.`;
    } else if (dim.includes('Kritis') || dim.includes('Penalaran')) {
      deskripsi = `Menganalisis data, memvalidasi bukti, mengevaluasi hipotesis, dan menarik kesimpulan logis terkait fenomena "${material}".`;
    } else if (dim.includes('Kolaborasi')) {
      deskripsi = `Bekerja sama secara inklusif dalam kelompok kerja, berbagi peran secara adil, dan menghargai pandangan rekan dalam diskusi.`;
    } else if (dim.includes('Kemandirian')) {
      deskripsi = `Mengelola waktu secara bertanggung jawab, berinisiatif mencari referensi mandiri, dan berani mengambil keputusan ilmiah.`;
    } else if (dim.includes('Kreativitas')) {
      deskripsi = `Merancang solusi alternatif inovatif dan memvisualisasikan temuan secara menarik menggunakan berbagai media ekspresi.`;
    } else if (dim.includes('Komunikasi')) {
      deskripsi = `Menyampaikan gagasan, hasil observasi, dan argumen ilmiah secara runut, jelas, serta santun kepada audiens.`;
    }
    return { dimensi: dim, deskripsi };
  });

  // 3. Panca Cinta Narasi
  const defaultPancaCinta = selectedPancaCinta.map(val => {
    let deskripsi = `Menanamkan nilai ${val} secara organik dalam aktivitas pembelajaran materi "${material}".`;
    if (val.includes('Allah') || val.includes('Rasul')) {
      deskripsi = `Mengagumi keagungan dan keteraturan ciptaan Allah Swt. melalui tadabbur konsep "${material}", melafalkan asmaul husna relevan, serta meneladani akhlak Rasulullah saw.`;
    } else if (val.includes('Ilmu')) {
      deskripsi = `Menumbuhkan ghirah mencari ilmu pengetahuan, menjunjung tinggi kejujuran data, adab menuntut ilmu, dan menjadikan belajar sebagai sarana ibadah.`;
    } else if (val.includes('Lingkungan')) {
      deskripsi = `Mewujudkan kesadaran ekologis dan kepedulian nyata merawat lingkungan hidup sebagai amanah khalifah fil ardh yang terhubung dengan materi "${material}".`;
    } else if (val.includes('Diri')) {
      deskripsi = `Menjaga kesehatan fisik dan mental, menghargai potensi diri, serta saling tolong-menolong tanpa diskriminasi.`;
    } else if (val.includes('Tanah Air')) {
      deskripsi = `Memanfaatkan sumber daya nusantara secara bijak dan berorientasi pada kemaslahatan bangsa Indonesia.`;
    }
    return { nilai: val, deskripsi };
  });

  // 4. Desain Pembelajaran
  const defaultDesain = {
    capaian_pembelajaran_narasi: data.cp || `Peserta didik mampu memahami konsep, prinsip, dan prosedur sains, melakukan penyelidikan ilmiah, serta mengaitkan sains dengan kehidupan sehari-hari dengan sikap ilmiah dan tanggung jawab.`,
    topik_pembelajaran: material,
    konteks: `${subject} – ${grade} (${fase})`,
    kemitraan: `▸ Peserta didik ↔ peserta didik: peer learning, diskusi kelompok, peer assessment\n▸ Peserta didik ↔ guru: bimbingan fasilitatif dan coaching berkesadaran`,
    lingkungan: `▸ Kelas fleksibel mendukung kerja kelompok dan diskusi aktif\n▸ Suasana aman, saling menghargai, mendorong keberanian berpikir terbuka\n▸ Budaya "tidak ada pertanyaan yang bodoh" ditegakkan secara konsisten`,
    digital: `Perencanaan: Google Docs / platform sekolah\nProses: Mentimeter, YouTube Edu, Google Forms, QR Code; Jamboard/Miro, Quizizz, Google Classroom\nPenilaian: Quizizz / Google Forms + Portofolio Digital`
  };

  // 5. Langkah-Langkah Pembelajaran Multi Pertemuan (Pertemuan 1 & 2)
  const defaultDaftarPertemuan: PertemuanLangkahPDF[] = [
    {
      pertemuan_ke: 'Pertemuan ke-1',
      alokasi_waktu: '2 x 40 menit',
      model_pembelajaran: pedagogy1,
      panca_cinta_fase: ['🕌 Cinta Allah Swt.', '📚 Cinta Ilmu', '🌱 Cinta Lingkungan'],
      pendahuluan: {
        judul: '● MEMAHAMI (Berkesadaran & Menggembirakan) — Kegiatan Pendahuluan',
        langkah: [
          {
            deskripsi: 'Guru menyambut peserta didik dengan hangat, mengucapkan salam, memimpin doa bersama, dan mengecek kehadiran. Guru menggunakan Mentimeter atau kartu mood check-in untuk mengetahui kondisi dan kesiapan belajar peserta didik, memastikan suasana kelas berkesadaran sejak awal.'
          },
          {
            deskripsi: 'Insersi CINTA ALLAH & RASUL(KBC)',
            insersi_kbc: {
              nilai: 'Insersi CINTA ALLAH & RASUL(KBC)',
              uraian: `Guru membuka pembelajaran dengan doa bersama, melafalkan asmaul husna yang relevan dengan topik "${material}" (mis. Al-‘Alīm untuk topik pengetahuan, Al-Khāliq untuk topik penciptaan, Al-Ḥakīm untuk topik keteraturan/hikmah). Guru mengaitkan tujuan pembelajaran dengan ayat qauliyah atau hadis yang relevan, serta meneladani sifat Rasulullah saw. (sabar mencari ilmu, jujur, dan kasih sayang) sebagai inspirasi belajar hari ini.`
            }
          },
          {
            deskripsi: `Guru membangun apersepsi bermakna dengan pertanyaan pemantik yang mengaitkan "${material}" dengan pengalaman nyata: "Pernahkah kalian mengamati fenomena berkaitan dengan topik ini di kehidupan sehari-hari?" Respons peserta didik dicatat sebagai data asesmen diagnostik awal (Lampiran 3).`
          },
          {
            deskripsi: 'Insersi CINTA ILMU(KBC)',
            insersi_kbc: {
              nilai: 'Insersi CINTA ILMU(KBC)',
              uraian: `Guru menumbuhkan rasa kagum dan ingin tahu peserta didik terhadap "${material}" sebagai tanda kebesaran Pencipta. Guru menyampaikan adab menuntut ilmu: niat yang lurus, kesungguhan, kejujuran ilmiah, dan menghargai sumber/penulis. Guru menegaskan: "Belajar bukan sekadar untuk nilai, melainkan untuk mengenal Allah lebih dekat dan bermanfaat bagi sesama."`
            }
          },
          {
            deskripsi: `Guru menyajikan stimulus berupa fenomena, gambar, atau video pendek (15–20 detik) yang langsung berkaitan dengan "${material}". Peserta didik diberikan waktu 2 menit untuk mengamati dan menuliskan minimal 2 pertanyaan inkuiri yang muncul di benak mereka (Think Time — membangun fokus dan konsentrasi).`
          },
          {
            deskripsi: 'Insersi CINTA LINGKUNGAN(KBC)',
            insersi_kbc: {
              nilai: 'Insersi CINTA LINGKUNGAN(KBC)',
              uraian: `Guru mengajak peserta didik mengamati lingkungan kelas/sekolah sebagai tanda (tajalli) cinta Allah. Sebelum belajar, kelas dipastikan bersih, rapi, dan hemat energi (lampu/AC seperlunya). Guru menyampaikan bahwa setiap aktivitas belajar tentang "${material}" akan dihubungkan dengan tanggung jawab merawat alam ciptaan Allah.`
            }
          },
          {
            deskripsi: 'Guru menyampaikan tujuan pembelajaran pertemuan ke-1 secara jelas dan inspiratif, mengaitkan manfaatnya dengan kehidupan nyata peserta didik. Guru menjelaskan alur kegiatan dan teknik penilaian: observasi proses, pertanyaan inkuiri, dan kesimpulan tertulis.'
          }
        ]
      },
      inti: {
        judul: '● MENGAPLIKASI (Berkesadaran & Bermakna) — Kegiatan Inti',
        sintaks_model: `Sintaks ${pedagogy1}`,
        langkah: [
          {
            tahap: 'ORIENTASI (± 6 mnt)',
            deskripsi: `Guru memfasilitasi peserta didik mengidentifikasi fenomena/data awal terkait "${material}". Peserta didik mengamati dengan seksama dan menuliskan pertanyaan inkuiri di kartu/sticky note: "Apa yang terjadi? Mengapa demikian? Bagaimana bisa?" Pertanyaan ditempel di papan inkuiri dan dipilih bersama menjadi fokus eksplorasi hari ini.`
          },
          {
            deskripsi: 'Insersi CINTA ALLAH & RASUL(KBC)',
            insersi_kbc: {
              nilai: 'Insersi CINTA ALLAH & RASUL(KBC)',
              uraian: `Selama kegiatan inti, guru sesekali mengaitkan temuan/konsep dengan ayat kauniyah — bahwa "${material}" yang sedang dipelajari adalah tanda kebesaran Allah. Guru meneladani sifat Rasulullah saw. yang sabar membimbing, tidak menggurui, dan menghargai setiap upaya peserta didik dalam memahami konsep.`
            }
          },
          {
            tahap: 'MERUMUSKAN HIPOTESIS (± 7 mnt)',
            deskripsi: 'Peserta didik berkelompok (3–4 orang) mendiskusikan dan merumuskan hipotesis terhadap pertanyaan inkuiri yang dipilih menggunakan format: "Jika... maka... karena..." Guru berperan sebagai fasilitator inkuiri — mengajukan pertanyaan penggugah tanpa memberikan jawaban langsung.'
          },
          {
            tahap: 'EKSPLORASI & PENGUMPULAN DATA (± 16 mnt)',
            deskripsi: 'Setiap kelompok melaksanakan eksplorasi sesuai LKPD Inkuiri (Lampiran 2.1) — mengumpulkan data melalui pengamatan sistematis, percobaan mini, atau penelusuran sumber. Guru berkeliling dan mengajukan pertanyaan Socratic: "Apa yang kalian amati?", "Apakah data ini sesuai hipotesismu?", "Apa yang perlu dicek ulang?"'
          },
          {
            deskripsi: 'Insersi CINTA ILMU(KBC)',
            insersi_kbc: {
              nilai: 'Insersi CINTA ILMU(KBC)',
              uraian: 'Guru menanamkan adab ilmiah dalam praktik nyata: peserta didik mencantumkan sumber rujukan, jujur menuliskan data sesuai fakta, tidak menjiplak karya orang lain, dan menghargai pendapat berbeda sebagai bagian dari proses berpikir ilmiah. Setiap kesalahan dihormati sebagai bagian dari proses belajar.'
            }
          },
          {
            tahap: 'ANALISIS DATA (± 10 mnt)',
            deskripsi: 'Peserta didik mengorganisasikan data ke dalam tabel/grafik/diagram sesuai petunjuk LKPD. Mereka menganalisis pola, hubungan sebab-akibat, dan perbedaan dari data yang diperoleh, lalu menghubungkannya dengan hipotesis awal. Guru mendampingi kelompok dengan pertanyaan scaffolding.'
          },
          {
            tahap: 'KESIMPULAN SEMENTARA (± 5 mnt)',
            deskripsi: 'Setiap kelompok menyusun kesimpulan sementara: apakah hipotesis terbukti, terbantahkan, atau perlu revisi? Kesimpulan ditulis dengan bahasa ilmiah sederhana menggunakan bukti dari data yang dikumpulkan.'
          },
          {
            deskripsi: 'Insersi CINTA LINGKUNGAN(KBC)',
            insersi_kbc: {
              nilai: 'Insersi CINTA LINGKUNGAN(KBC)',
              uraian: `Peserta didik mengaitkan konsep "${material}" dengan fenomena lingkungan di sekitar mereka (sekolah, rumah, kampung). Guru mendorong satu aksi nyata berbasis materi: hemat kertas dalam penulisan tugas, gunakan barang bekas/daur ulang sebagai media belajar, atau merancang satu solusi sederhana untuk masalah lingkungan terkait topik (ekoteologi: alam bukan objek eksploitasi melainkan amanah).`
            }
          },
          {
            tahap: 'PRESENTASI & KONFIRMASI (± 8 mnt)',
            deskripsi: `2–3 kelompok mempresentasikan hasil inkuiri secara singkat. Kelompok lain memberikan tanggapan konstruktif. Guru mengkonfirmasi konsep ilmiah yang benar, meluruskan miskonsepsi, dan mengaitkan temuan peserta didik dengan konsep formal "${material}".`
          }
        ]
      },
      penutup: {
        judul: '● MEREFLEKSI (Bermakna & Berkesadaran) — Kegiatan Penutup',
        langkah: [
          {
            tahap: 'SINTESIS BERSAMA (± 4 mnt)',
            deskripsi: `Guru memimpin penyimpulan bersama kelas. Peserta didik berbagi: (1) satu hal terpenting yang dipelajari tentang "${material}" hari ini, (2) satu pertanyaan yang masih mengganjal. Guru mencatat poin kunci di papan tulis dan bersama peserta didik menyusun kesimpulan utama pertemuan ke-1 dengan bahasa yang mudah dipahami dan diingat.`
          },
          {
            deskripsi: 'Insersi CINTA ALLAH & RASUL(KBC)',
            insersi_kbc: {
              nilai: 'Insersi CINTA ALLAH & RASUL(KBC)',
              uraian: 'Guru mengajak peserta didik bersyukur (alhamdulillah) atas ilmu dan pengalaman belajar hari ini sebagai karunia Allah. Refleksi ditutup dengan doa kafaratul majlis dan komitmen menjadikan ilmu sebagai jalan ibadah. Bagi peserta didik non-Muslim, guru memberi ruang refleksi syukur sesuai keyakinan masing-masing — semangat moderasi beragama.'
            }
          },
          {
            tahap: 'ASESMEN FORMATIF AKHIR (± 4 mnt)',
            deskripsi: `Peserta didik mengerjakan kuis formatif singkat (3–5 soal) melalui Quizizz/Google Forms atau kertas selembar untuk mengukur pemahaman individual terhadap konsep inti "${material}". Guru menggunakan hasil ini untuk mengidentifikasi peserta didik yang memerlukan perhatian khusus dan merencanakan tindak lanjut.`
          },
          {
            deskripsi: 'Insersi CINTA ILMU(KBC)',
            insersi_kbc: {
              nilai: 'Insersi CINTA ILMU(KBC)',
              uraian: `Peserta didik diajak menuliskan satu pertanyaan baru yang muncul setelah belajar "${material}" hari ini — sebagai bukti bahwa rasa ingin tahu terus tumbuh. Guru menegaskan: "Ilmu yang baik adalah yang menumbuhkan pertanyaan baru, bukan menutup rasa ingin tahu." Peserta didik didorong belajar mandiri di rumah untuk mendalami pertanyaan tersebut.`
            }
          },
          {
            tahap: 'REFLEKSI MANDIRI (± 4 mnt)',
            deskripsi: `Peserta didik mengisi Lembar Refleksi Mandiri (Lampiran 7) secara jujur: (1) "Apa yang sudah saya pahami tentang ${material}?", (2) "Apa yang masih membingungkan saya?", (3) "Bagaimana perasaan saya selama belajar hari ini?", (4) "Strategi belajar apa yang akan saya tingkatkan?" Refleksi dikumpulkan sebagai portofolio dan bahan perencanaan guru.`
          },
          {
            deskripsi: 'Insersi CINTA LINGKUNGAN(KBC)',
            insersi_kbc: {
              nilai: 'Insersi CINTA LINGKUNGAN(KBC)',
              uraian: `Peserta didik berkomitmen pada satu aksi cinta lingkungan yang dapat dilakukan sebelum pertemuan berikutnya, terkait konsep "${material}" — misal: memilah sampah, hemat air, menanam tanaman, mengurangi penggunaan plastik. Komitmen ditulis di kartu kecil & dibawa pulang sebagai pengingat.`
            }
          },
          {
            tahap: 'MOTIVASI & INFORMASI PERTEMUAN BERIKUTNYA (± 4 mnt)',
            deskripsi: 'Guru memberikan "bocoran" menarik tentang eksplorasi pada pertemuan ke-2 untuk membangun antisipasi positif dan rasa ingin tahu. Guru memberikan tugas mandiri opsional (bukan PR wajib) bagi peserta didik yang ingin mengeksplorasi lebih jauh. Guru menutup dengan apresiasi, doa bersama, dan salam hangat.'
          }
        ]
      }
    },
    {
      pertemuan_ke: 'Pertemuan ke-2',
      alokasi_waktu: '2 x 40 menit',
      model_pembelajaran: pedagogy2,
      panca_cinta_fase: ['🕌 Cinta Allah Swt.', '📚 Cinta Ilmu', '🌱 Cinta Lingkungan'],
      pendahuluan: {
        judul: '● MEMAHAMI (Berkesadaran & Menggembirakan) — Kegiatan Pendahuluan',
        langkah: [
          {
            deskripsi: 'Guru menyambut peserta didik dengan salam, memimpin doa, dan mengecek kehadiran. Guru menggunakan teknik "2 Kata Hari Ini" untuk mengetahui kesiapan emosional dan kognitif peserta didik sebelum dihadapkan pada masalah kontekstual yang kompleks.'
          },
          {
            deskripsi: 'Insersi CINTA ALLAH & RASUL(KBC)',
            insersi_kbc: {
              nilai: 'Insersi CINTA ALLAH & RASUL(KBC)',
              uraian: `Guru membuka pembelajaran dengan doa bersama, melafalkan asmaul husna yang relevan dengan topik "${material}". Guru mengaitkan tujuan pembelajaran dengan nilai amanah dan tanggung jawab manusia di bumi.`
            }
          },
          {
            deskripsi: `Guru membangun apersepsi melalui cerita pendek atau berita aktual yang relevan dengan "${material}" dan terhubung langsung dengan kehidupan nyata. Pertanyaan pemantik: "Jika kalian berada dalam situasi ini, apa yang akan kalian lakukan?" Peserta didik mendiskusikan secara berpasangan 2 menit (Think-Pair).`
          },
          {
            deskripsi: `Guru menyajikan skenario masalah utama (Problem Statement) yang akan dipecahkan. Masalah dikaitkan secara eksplisit dengan "${material}" dan pengalaman peserta didik sebelumnya, sehingga tercipta koneksi bermakna antara yang sudah diketahui dan yang akan dipelajari.`
          },
          {
            deskripsi: 'Insersi CINTA ILMU(KBC)',
            insersi_kbc: {
              nilai: 'Insersi CINTA ILMU(KBC)',
              uraian: `Guru menumbuhkan rasa kagum dan ingin tahu peserta didik terhadap keteraturan hukum alam. Belajar bukan sekadar untuk nilai, melainkan untuk melatih penalaran kritis dan kemaslahatan umat.`
            }
          },
          {
            deskripsi: 'Guru menyampaikan tujuan pembelajaran pertemuan ke-2 dan menegaskan bahwa proses berpikir kritis dalam memecahkan masalah adalah bagian utama dari penilaian — bukan hanya hasil akhir. Guru menciptakan iklim psikologis yang aman untuk mencoba dan belajar dari kesalahan.'
          }
        ]
      },
      inti: {
        judul: '● MENGAPLIKASI (Berkesadaran & Bermakna) — Kegiatan Inti',
        sintaks_model: `Sintaks ${pedagogy2}`,
        langkah: [
          {
            tahap: 'KLARIFIKASI MASALAH (± 6 mnt)',
            deskripsi: `Guru menampilkan skenario masalah kontekstual terkait "${material}". Peserta didik mengisi KWL Chart di LKPD (Lampiran 2.2): (1) Apa yang SUDAH diketahui?, (2) Apa yang BELUM diketahui?, (3) Apa yang PERLU dicari tahu? Membangun kesadaran metakognitif dan fokus investigasi.`
          },
          {
            deskripsi: 'Insersi CINTA ALLAH & RASUL(KBC)',
            insersi_kbc: {
              nilai: 'Insersi CINTA ALLAH & RASUL(KBC)',
              uraian: 'Guru meneladani sifat Rasulullah saw. yang adil dalam memfasilitasi setiap anggota kelompok tanpa membeda-bedakan kemampuan awal.'
            }
          },
          {
            tahap: 'RUMUSAN MASALAH (± 5 mnt)',
            deskripsi: `Kelompok mendiskusikan dan merumuskan masalah menjadi pertanyaan yang dapat diselidiki — spesifik, terukur, dan relevan dengan "${material}". Rumusan masalah dituliskan di LKPD sebagai panduan investigasi yang akan dilaksanakan.`
          },
          {
            tahap: 'INVESTIGASI MENDALAM (± 16 mnt)',
            deskripsi: 'Setiap kelompok melakukan investigasi mandiri — mengumpulkan informasi dan bukti dari berbagai sumber. Guru memfasilitasi dengan pertanyaan Socratic tanpa memberikan jawaban langsung.'
          },
          {
            deskripsi: 'Insersi CINTA ILMU(KBC)',
            insersi_kbc: {
              nilai: 'Insersi CINTA ILMU(KBC)',
              uraian: 'Guru menanamkan adab ilmiah: menyertakan rujukan, memvalidasi sumber literasi digital, dan menghindari plagiarisme.'
            }
          },
          {
            tahap: 'PENGEMBANGAN SOLUSI (± 13 mnt)',
            deskripsi: 'Berdasarkan investigasi, kelompok mengembangkan alternatif solusi, mengevaluasinya dengan tabel keunggulan-kelemahan di LKPD, lalu memilih solusi terbaik beserta argumentasi berbasis bukti.'
          },
          {
            tahap: 'PRESENTASI SOLUSI (± 7 mnt)',
            deskripsi: 'Perwakilan kelompok mempresentasikan solusi. Kelompok lain memberikan tanggapan kritis konstruktif. Guru memfasilitasi diskusi, mendalami penalaran peserta didik, dan memastikan semua perspektif terwakili dengan adil.'
          },
          {
            deskripsi: 'Insersi CINTA LINGKUNGAN(KBC)',
            insersi_kbc: {
              nilai: 'Insersi CINTA LINGKUNGAN(KBC)',
              uraian: 'Solusi yang diajukan dikaitkan dengan kelestarian alam dan keberlanjutan sumber daya lingkungan hidup setempat.'
            }
          },
          {
            tahap: 'KONFIRMASI KONSEP (± 5 mnt)',
            deskripsi: `Guru mengkonfirmasi konsep kunci "${material}", meluruskan miskonsepsi yang teridentifikasi, dan mengaitkan solusi peserta didik dengan teori/prinsip yang berlaku. Guru mengapresiasi kualitas proses berpikir kritis yang telah ditunjukkan.`
          }
        ]
      },
      penutup: {
        judul: '● MEREFLEKSI (Bermakna & Berkesadaran) — Kegiatan Penutup',
        langkah: [
          {
            tahap: 'SINTESIS BERSAMA (± 4 mnt)',
            deskripsi: `Guru memimpin penyimpulan bersama kelas. Peserta didik menyusun kesimpulan utama pertemuan ke-2 mengenai integrasi konsep "${material}" dengan solusi masalah nyata.`
          },
          {
            deskripsi: 'Insersi CINTA ALLAH & RASUL(KBC)',
            insersi_kbc: {
              nilai: 'Insersi CINTA ALLAH & RASUL(KBC)',
              uraian: 'Mengajak peserta didik bersyukur atas terselesaikannya proyek/pemecahan masalah, ditutup dengan doa kafaratul majlis.'
            }
          },
          {
            tahap: 'ASESMEN FORMATIF AKHIR (± 4 mnt)',
            deskripsi: 'Peserta didik menyelesaikan evaluasi formatif akhir dan refleksi ketercapaian tujuan pembelajaran.'
          },
          {
            tahap: 'APRESIASI & PENUTUP AKHIR (± 4 mnt)',
            deskripsi: `Guru memberikan apresiasi tulus atas dedikasi dan perkembangan seluruh peserta didik sepanjang pembelajaran "${material}". Guru merangkum perjalanan belajar dari pertemuan 1 hingga terakhir, menegaskan relevansi dan manfaat nyata materi bagi kehidupan peserta didik. Guru menutup pembelajaran dengan doa bersama dan salam penuh kehangatan.`
          }
        ]
      }
    }
  ];

  // 6. Asesmen Pembelajaran (Disesuaikan dengan Metode Penilaian Terpilih)
  const assessmentMethodsListStr = selectedAssessmentMethods.map(m => `• ${m}`).join('\n');
  const defaultAsesmen = {
    awal: `▸ Teknik: Pertanyaan Pemantik Lisan & Instrumen Diagnostik Tertulis (Lampiran 3)\n▸ Guru mengajukan 3–5 pertanyaan pemantik tentang "${material}" untuk memetakan pengetahuan awal, minat, dan kesiapan belajar peserta didik.\n▸ Dilaksanakan pada kegiatan pendahuluan (MEMAHAMI, durasi ± ${allocPendahuluan} menit).\n▸ Hasil pemetaan digunakan untuk penentuan kelompok belajar berdiferensiasi dan kebutuhan perancangan scaffolding.`,
    proses: `▸ Teknik Assessment for Learning Sesuai Metode Terpilih:\n${assessmentMethodsListStr}\n▸ Pelaksanaan Terintegrasi:\n1. Observasi Sikap: Lembar Observasi Dimensi Profil Lulusan & Panca Cinta (Lampiran 4A).\n2. Unjuk Kerja & Kinerja: Penilaian proses inkuiri/diskusi kelompok dengan Checklist Kinerja (Lampiran 4B).\n3. Penilaian Sejawat: Lembar Peer Assessment untuk menumbuhkan saling menghargai dan refleksi antarsiswa (Lampiran 4C).\n4. Catatan Anekdotal: Guru mencatat respons khusus dan perkembangan siswa yang memerlukan pendampingan.`,
    akhir: `▸ Teknik Assessment of Learning Sesuai Metode Terpilih:\n▸ 1. Kuis / Tes Tertulis: 9 butir soal (Pilihan Ganda HOTS + Isian Singkat + Pemecahan Masalah) tentang "${material}" — skor maks 50, dikonversi ke skala 100.\n▸ 2. Penilaian Produk / Proyek / Presentasi: Dinilai menggunakan Rubrik Penilaian Produk Komprehensif (Lampiran 6).\n▸ 3. Portofolio Refleksi: Kumpulan Lembar Refleksi Mandiri (Lampiran 7) sebagai rekam jejak pertumbuhan belajar.\n▸ Kriteria Ketercapaian (KKTP): 0–40% (Intervensi Khusus) | 41–65% (Bimbingan Sebagian) | 66–85% (Tercapai / Mahir) | 86–100% (Pengayaan / Sangat Mahir).`
  };

  // 7. Insersi KBC
  const defaultInsersiKBC = {
    dasar_hukum: 'Keputusan Direktur Jenderal Pendidikan Islam Kemenag RI Nomor 6077 Tahun 2025 tentang Panduan Kurikulum Berbasis Cinta pada Madrasah.',
    posisi_kbc: 'KBC bukan kurikulum pengganti, melainkan insersi nilai-nilai cinta sebagai jiwa pembelajaran. Materi insersi Panca Cinta telah ditanamkan secara ORGANIK dalam langkah-langkah pembelajaran pada Bagian C — bukan sebagai tempelan, tetapi terjalin dengan aktivitas Memahami, Mengaplikasi, dan Merefleksi. Bagian ini berfungsi sebagai ringkasan agar guru memiliki gambaran utuh.',
    pendekatan: 'Experiential Learning + Pembiasaan Berkesadaran',
    topik_diinsersi: [
      {
        nilai: '🕌 Cinta Allah Swt. dan Rasul-Nya',
        deskripsi: 'Sumber cinta; sifat jamāliyah Allah & keteladanan Rasulullah saw.'
      },
      {
        nilai: '📚 Cinta Ilmu',
        deskripsi: 'Belajar dengan hati terbuka, ilmu sebagai cahaya & jalan mengenal Allah.'
      },
      {
        nilai: '🌱 Cinta Lingkungan',
        deskripsi: 'Alam sebagai tanda (tajalli) cinta Allah; ekoteologi & tanggung jawab khalifah.'
      }
    ],
    letak_insersi: [
      {
        nilai: '🕌 Cinta Allah Swt. dan Rasul-Nya',
        nilai_inti: 'Tauhid & keimanan, Ihsan & muraqabah, Akhlak Rasulullah saw., Rahmatan lil ‘ālamīn',
        fase: '🔵Memahami (Pendahuluan) • 🟠Mengaplikasi (Inti) • 🟣Merefleksi (Penutup)'
      },
      {
        nilai: '📚 Cinta Ilmu',
        nilai_inti: 'Adab menuntut ilmu, Rasa ingin tahu (curiosity), Berpikir kritis & jujur ilmiah, Belajar sepanjang hayat',
        fase: '🔵Memahami (Pendahuluan) • 🟠Mengaplikasi (Inti) • 🟣Merefleksi (Penutup)'
      },
      {
        nilai: '🌱 Cinta Lingkungan',
        nilai_inti: 'Hemat air & energi, Pengelolaan sampah, Sayang hewan & tumbuhan, Konservasi & keanekaragaman hayati',
        fase: '🔵Memahami (Pendahuluan) • 🟠Mengaplikasi (Inti) • 🟣Merefleksi (Penutup)'
      }
    ],
    iklim_budaya: {
      pembiasaan: 'Pembiasaan salam-sapa-senyum, doa & asmaul husna sebelum belajar, jumat bersih lingkungan.',
      keteladanan: 'Guru menampilkan adab, kasih sayang, kesabaran, dan keteladanan ilmiah sebagai uswah hasanah.',
      experiential: 'Pembelajaran dirancang sebagai pengalaman hudhuri — peserta didik merasakan dan mempraktikkan cinta.'
    },
    evaluasi_holistik: 'Penilaian mencakup internalisasi nilai Panca Cinta (lihat Lampiran 9).'
  };

  // 8. Lampiran 1 - 9 Dokumen Pendukung Lengkap
  const defaultLampiran = {
    lks: {
      judul: `Aktivitas Penyelidikan Ilmiah "${material}"`,
      tujuan: `Melalui kegiatan inkuiri dan pemecahan masalah, peserta didik mampu memahami konsep dan menganalisis fenomena "${material}" secara kritis dan kolaboratif.`,
      alat_bahan: 'Alat tulis, lembar pengamatan, bahan demonstrasi kontekstual, gawai/laptop untuk penelusuran referensi.',
      langkah_kerja: '1. Mengamati fenomena yang disajikan guru.\n2. Merumuskan pertanyaan inkuiri dan hipotesis.\n3. Mengumpulkan data melalui pengamatan atau eksperimen mini.\n4. Menganalisis data dalam kelompok.\n5. Menyimpulkan hasil dan mempresentasikannya.',
      pertanyaan_diskusi: `1. Apa faktor utama yang mempengaruhi fenomena "${material}" yang kalian amati?\n2. Bagaimana hubungan hasil pengamatan kelompokmu dengan konsep ilmiah yang dipelajari?\n3. Apa manfaat pemahaman topik ini dalam kehidupan sehari-hari?`
    },
    rubrik: {
      aspek1: 'Penguasaan Konsep',
      deskripsi1: `Peserta didik mampu menjelaskan konsep dasar "${material}" dengan tepat, sistematis, dan memberikan contoh nyata yang relevan.`,
      aspek2: 'Keterampilan Penyelidikan & Kolaborasi',
      deskripsi2: 'Peserta didik aktif berpartisipasi dalam investigasi, merumuskan hipotesis logis, mencatat data akurat, dan bekerja sama dengan santun.'
    },
    soal_akhir: {
      soal1: `Manakah pernyataan yang paling tepat mengenai konsep dasar "${material}"?`,
      soal2: `Bagaimana penerapan konsep "${material}" dalam memecahkan permasalahan nyata di lingkungan sekitar?`,
      soal3: `Jika terjadi perubahan faktor pendukung, bagaimana dampaknya terhadap mekanisme "${material}"?`,
      soal4: `Identifikasi 2 karakteristik utama yang membedakan fenomena "${material}" dari fenomena lainnya!`,
      soal5: `Jelaskan hikmah keteraturan ciptaan Tuhan yang dapat kalian petik dari mempelajari materi "${material}"!`,
      kunci_jawaban: '1. Konsep dasar sesuai kaidah keilmuan; 2. Solusi aplikatif dan kontekstual; 3. Analisis sebab-akibat logis; 4. Karakteristik spesifik teruji; 5. Refleksi spiritual dan nilai Panca Cinta.'
    },
    kktp: `Interval Kriteria Ketercapaian Tujuan Pembelajaran (KKTP):\n• 0% – 40% : Belum mencapai ketuntasan, remedial di seluruh bagian materi.\n• 41% – 60% : Belum mencapai ketuntasan, remedial pada bagian yang belum dipahami.\n• 61% – 80% : Sudah mencapai ketuntasan, tidak perlu remedial.\n• 81% – 100% : Sudah mencapai ketuntasan, perlu pengayaan atau tantangan tambahan (peer tutor).`,

    bahan_bacaan: {
      pengantar: `Materi ${material} merupakan topik esensial dalam pembelajaran ${subject} di jenjang ${school}. Memahami materi ini akan membantu peserta didik mengenali fenomena dalam kehidupan sehari-hari, mengembangkan kemampuan berpikir kritis, dan menerapkan pengetahuan secara nyata.`,
      konsep_kunci: [
        {
          no: 1,
          konsep: `Konsep Dasar ${material}`,
          penjelasan: 'Pengertian mendasar yang menjadi fondasi pemahaman — perlu dikuasai sebelum aspek lebih kompleks.',
          contoh: 'Contoh konkret yang dapat diamati di lingkungan sekitar sekolah/rumah.'
        },
        {
          no: 2,
          konsep: 'Karakteristik & Sifat',
          penjelasan: 'Ciri-ciri khusus yang membedakan konsep ini dari konsep lain beserta faktor yang mempengaruhinya.',
          contoh: 'Situasi nyata yang menunjukkan karakteristik tersebut dalam kehidupan.'
        },
        {
          no: 3,
          konsep: 'Proses & Mekanisme',
          penjelasan: `Bagaimana ${material} terjadi — urutan tahapan, mekanisme yang terlibat, dan kondisi yang diperlukan.`,
          contoh: 'Proses yang dapat diamati melalui eksperimen sederhana.'
        },
        {
          no: 4,
          konsep: 'Penerapan & Manfaat',
          penjelasan: `Bagaimana pengetahuan tentang ${material} diterapkan untuk memecahkan masalah nyata.`,
          contoh: 'Penerapan dalam teknologi, industri, atau solusi masalah lingkungan.'
        }
      ],
      pertanyaan_pemandu: [
        `1. Apa yang sudah saya ketahui tentang ${material} sebelum mempelajari materi ini?`,
        `2. Apa hubungan ${material} dengan hal yang sering saya jumpai sehari-hari?`,
        '3. Konsep mana yang paling menarik perhatian saya, dan mengapa?',
        `4. Bagaimana saya menjelaskan ${material} kepada seseorang yang belum mengenalnya?`,
        '5. Apa yang masih ingin saya pelajari lebih dalam setelah membaca bahan ini?'
      ]
    },

    lkpd_detail: {
      pertemuan_1: {
        judul: `LKPD Pertemuan ke-1 | ${pedagogy1}`,
        model: pedagogy1,
        tujuan: `Melalui LKPD ini peserta didik dapat memahami dan mengaplikasikan konsep ${material} melalui ${pedagogy1}.`,
        tahapan: [
          { no: 1, judul: 'MENGAMATI', instruksi: 'Tuliskan 3 hasil pengamatan dan 3 pertanyaan inkuiri yang muncul!' },
          { no: 2, judul: 'HIPOTESIS', instruksi: 'Rumuskan hipotesis dengan format "Jika... maka... karena..."' },
          { no: 3, judul: 'PENGUMPULAN DATA', instruksi: 'Catat data pengamatan/percobaan secara sistematis dalam tabel.' },
          { no: 4, judul: 'ANALISIS', instruksi: 'Apa pola yang ditemukan? Apakah hipotesis terbukti? (jelaskan dengan bukti!)' },
          { no: 5, judul: 'KESIMPULAN', instruksi: 'Tuliskan kesimpulan berdasarkan data dan analisis yang dilakukan.' }
        ]
      },
      pertemuan_2: {
        judul: `LKPD Pertemuan ke-2 | ${pedagogy2}`,
        model: pedagogy2,
        tujuan: `Melalui LKPD ini peserta didik dapat memahami dan mengaplikasikan konsep ${material} melalui ${pedagogy2}.`,
        tahapan: [
          { no: 1, judul: 'KWL CHART', instruksi: 'Isi kolom K (sudah tahu), W (ingin tahu), L (yang dipelajari) tentang masalah.' },
          { no: 2, judul: 'RUMUSAN MASALAH', instruksi: 'Tuliskan rumusan masalah yang akan diinvestigasi kelompokmu.' },
          { no: 3, judul: 'INVESTIGASI', instruksi: 'Kumpulkan informasi dan bukti dari berbagai sumber yang tersedia.' },
          { no: 4, judul: 'ALTERNATIF SOLUSI', instruksi: 'Buat tabel keunggulan-kelemahan untuk setiap alternatif solusi.' },
          { no: 5, judul: 'SOLUSI TERBAIK', instruksi: 'Pilih solusi terbaik dan berikan argumentasi berbasis bukti yang kuat.' }
        ]
      }
    },

    asesmen_awal_detail: {
      petunjuk: '⚠️ Petunjuk: Jawablah sesuai yang sudah kamu ketahui. Tidak ada jawaban benar/salah — hasilnya untuk merencanakan pembelajaran yang tepat untukmu.',
      pertanyaan: [
        `1. Apa yang kamu ketahui tentang ${material}? Jelaskan dengan kata-katamu sendiri!`,
        `2. Sebutkan 2 contoh berkaitan dengan ${material} yang pernah kamu lihat atau alami!`,
        `3. Mengapa mempelajari ${material} itu penting? Apa manfaatnya bagi kehidupan?`,
        `4. Tuliskan 2 hal tentang ${material} yang paling ingin kamu pelajari!`
      ],
      panduan_interpretasi: [
        { skor: '0–5', kategori: 'Pengetahuan Awal Minimal', tindak_lanjut: 'Mulai dari konsep paling dasar; scaffolding ekstra; gunakan analogi konkret' },
        { skor: '6–10', kategori: 'Pengetahuan Awal Dasar', tindak_lanjut: 'Bangun dari yang sudah diketahui; fokus pada koneksi dan pendalaman konsep' },
        { skor: '11–15', kategori: 'Pengetahuan Awal Cukup', tindak_lanjut: 'Percepat konsep dasar; fokus penerapan kontekstual dan HOTS' },
        { skor: '16–20', kategori: 'Pengetahuan Awal Baik', tindak_lanjut: 'Langsung ke eksplorasi mendalam; peran peer tutor; pengayaan kreatif' }
      ]
    },

    asesmen_proses_detail: {
      dimensi_observasi: ['Keimanan', 'Penalaran', 'Kolaborasi', 'Kemandirian'],
      checklist_p1: [
        'Aktif mengamati dan mencatat pertanyaan inkuiri',
        'Merumuskan hipotesis yang logis dan terukur',
        'Mengumpulkan data secara sistematis',
        'Menganalisis data dan menemukan pola',
        'Menyusun kesimpulan berbasis bukti',
        'Mempresentasikan hasil dengan percaya diri',
        'Memberikan tanggapan konstruktif kepada kelompok lain'
      ],
      checklist_p2: [
        'Menganalisis masalah secara kritis',
        'Merumuskan pertanyaan investigasi',
        'Melakukan investigasi sistematis',
        'Mengembangkan solusi alternatif kreatif',
        'Mengevaluasi kelebihan-kelemahan solusi',
        'Memilih solusi dengan argumentasi kuat',
        'Mempresentasikan solusi secara runtut'
      ],
      peer_assessment_aspek: ['Kontribusi (1–4)', 'Kerja Sama (1–4)', 'Kreativitas (1–4)', 'Komentar']
    },

    asesmen_akhir_detail: {
      petunjuk: '✅ Petunjuk: Kerjakan soal berikut secara mandiri dan jujur.',
      pilihan_ganda: [
        {
          no: 1,
          soal: `Manakah pernyataan yang PALING TEPAT menggambarkan konsep dasar ${material}?`,
          pilihan: {
            a: 'Pernyataan tepat sesuai kaidah ilmiah yang berlaku',
            b: 'Pernyataan mengandung miskonsepsi umum dalam pembelajaran',
            c: 'Pernyataan sebagian benar namun perlu tambahan informasi',
            d: 'Pernyataan tidak berkaitan dengan topik yang dipelajari'
          },
          kunci: 'a'
        },
        {
          no: 2,
          soal: `Penerapan konsep ${material} dalam konteks kehidupan nyata yang PALING TEPAT adalah...`,
          pilihan: {
            a: 'Contoh relevan menunjukkan pemahaman mendalam tentang manfaat',
            b: 'Contoh kurang relevan namun sering dikira berkaitan dengan topik',
            c: 'Contoh benar namun terlalu sederhana dan tidak optimal',
            d: 'Contoh tidak berkaitan dan merupakan jebakan untuk menguji'
          },
          kunci: 'a'
        },
        {
          no: 3,
          soal: `Jika terjadi perubahan pada faktor utama ${material}, akibat yang PALING MUNGKIN...`,
          pilihan: {
            a: 'Akibat logis dan dapat diprediksi berdasarkan pemahaman konsep benar',
            b: 'Akibat hanya mungkin dalam kondisi sangat khusus dan tidak umum',
            c: 'Akibat yang tidak ada hubungannya dengan perubahan yang disebutkan',
            d: 'Akibat berlawanan dengan yang seharusnya terjadi secara ilmiah'
          },
          kunci: 'a'
        },
        {
          no: 4,
          soal: `Manakah yang BUKAN merupakan karakteristik dari ${material}?`,
          pilihan: {
            a: 'Karakteristik bukan bagian dari topik namun sering dikira berkaitan',
            b: 'Karakteristik yang merupakan bagian inti dan sangat mendasar',
            c: 'Karakteristik lain yang merupakan bagian penting dari topik',
            d: 'Karakteristik yang berkaitan erat dengan penerapan nyata'
          },
          kunci: 'a'
        },
        {
          no: 5,
          soal: `Manakah yang PALING menggambarkan hubungan ${material} dengan kehidupan sehari-hari?`,
          pilihan: {
            a: 'Hubungan mendalam dan aplikatif yang menunjukkan relevansi nyata',
            b: 'Hubungan superfisial tanpa pemahaman yang cukup mendalam',
            c: 'Hubungan yang tidak tepat atau berlawanan dengan yang sebenarnya',
            d: 'Tidak ada hubungan sama sekali antara materi dan kehidupan'
          },
          kunci: 'a'
        }
      ],
      isian_singkat: [
        { no: 6, soal: `Jelaskan dengan kata-katamu sendiri apa yang dimaksud ${material} dan sebutkan 2 contoh nyata!` },
        { no: 7, soal: `Bagaimana proses/mekanisme terjadinya ${material}? Jelaskan minimal 3 langkah secara berurutan!` },
        { no: 8, soal: `Apa perbedaan dua konsep/aspek utama dalam topik ${material}? Berikan contoh spesifik!` }
      ],
      uraian_esai: [
        {
          no: 9,
          soal: `(Uraian) Bayangkan kamu diminta menjelaskan ${material} kepada masyarakat umum. Buatlah penjelasan yang: (1) mudah dipahami, (2) memuat konsep inti yang benar, (3) menyertakan 2 contoh nyata, (4) menjelaskan mengapa penting, dan (5) memberikan saran praktis penggunaannya.`
        }
      ],
      kisi_kisi: [
        { soal: '1–5', pedoman: `Kunci disesuaikan guru dengan konten spesifik ${material}`, skor_maks: 10, indikator: 'Pengetahuan' },
        { soal: '6', pedoman: 'Definisi tepat + 2 contoh relevan dari kehidupan nyata', skor_maks: 5, indikator: 'Pemahaman' },
        { soal: '7', pedoman: 'Urutan proses logis, minimal 3 langkah, sesuai teori', skor_maks: 5, indikator: 'Prosedural' },
        { soal: '8', pedoman: 'Perbedaan jelas antara dua aspek, disertai contoh berbeda', skor_maks: 5, indikator: 'Analisis' },
        { soal: '9', pedoman: '5 aspek=25 | 4=20 | 3=15 | 2=10 | 1=5', skor_maks: 25, indikator: 'Sintesis' }
      ]
    },

    rubrik_lengkap: {
      rubrik_dimensi: [
        {
          dimensi: 'Keimanan & Ketakwaan',
          skor_4: 'Selalu konsisten, sangat baik, menjadi teladan',
          skor_3: 'Sering menunjukkan; konsisten dalam sebagian besar situasi',
          skor_2: 'Kadang menunjukkan; masih memerlukan bimbingan',
          skor_1: 'Jarang menunjukkan; memerlukan bimbingan intensif'
        },
        {
          dimensi: 'Penalaran Kritis',
          skor_4: 'Selalu menganalisis mendalam, bertanya kritis, mengevaluasi bukti dengan sangat cermat',
          skor_3: 'Sering menganalisis dan bertanya kritis; evaluasi bukti cukup baik',
          skor_2: 'Kadang menganalisis; pertanyaan masih permukaan dan belum konsisten',
          skor_1: 'Jarang menganalisis; cenderung menerima informasi tanpa berpikir kritis'
        },
        {
          dimensi: 'Kolaborasi',
          skor_4: 'Selalu berkontribusi aktif, menghargai semua pendapat, mendorong keterlibatan semua',
          skor_3: 'Berkontribusi aktif, menghargai pendapat orang lain, bekerja sama dengan baik',
          skor_2: 'Cukup berkontribusi namun kadang pasif atau kurang menghargai',
          skor_1: 'Jarang berkontribusi; cenderung pasif atau mendominasi'
        },
        {
          dimensi: 'Kemandirian',
          skor_4: 'Selalu mandiri, proaktif mencari solusi, tidak bergantung pada bantuan',
          skor_3: 'Sering mandiri; mampu mencari solusi sendiri',
          skor_2: 'Kadang mandiri; masih bergantung pada bimbingan',
          skor_1: 'Jarang mandiri; sangat bergantung pada bimbingan'
        }
      ],
      rubrik_produk: [
        {
          aspek: 'Kelengkapan Isi',
          skor_4: 'Semua komponen lengkap, detail, melampaui ekspektasi',
          skor_3: 'Semua komponen terpenuhi dengan baik',
          skor_2: 'Sebagian komponen terpenuhi; ada yang kurang',
          skor_1: 'Banyak komponen tidak terpenuhi; sangat minimal'
        },
        {
          aspek: 'Ketepatan Konsep',
          skor_4: `Seluruh konsep ${material} benar dan menunjukkan pemahaman mendalam`,
          skor_3: 'Sebagian besar benar; ada 1–2 kesalahan minor',
          skor_2: 'Beberapa benar; ada miskonsepsi yang perlu diluruskan',
          skor_1: 'Banyak miskonsepsi; perlu diperkuat menyeluruh'
        },
        {
          aspek: 'Kreativitas',
          skor_4: 'Sangat kreatif, orisinal, menginspirasi',
          skor_3: 'Kreatif; ada usaha membuat produk menarik',
          skor_2: 'Cukup kreatif namun mengikuti pola umum',
          skor_1: 'Kurang kreatif; hanya menyalin tanpa ide baru'
        },
        {
          aspek: 'Penyajian',
          skor_4: 'Sangat rapi, sistematis, mudah dipahami',
          skor_3: 'Rapi dan sistematis; komunikasi jelas',
          skor_2: 'Cukup rapi namun ada bagian membingungkan',
          skor_1: 'Kurang rapi; komunikasi sulit dipahami'
        }
      ],
      konversi_skor: [
        { rentang: '81–100', nilai: 'A', predikat: 'Sangat Baik', ketercapaian: 'Melampaui tujuan', tindak_lanjut: 'Pengayaan, tantangan tambahan, peran peer tutor' },
        { rentang: '61–80', nilai: 'B', predikat: 'Baik', ketercapaian: 'Mencapai tujuan', tindak_lanjut: 'Pertahankan; berikan tantangan baru untuk berkembang' },
        { rentang: '41–60', nilai: 'C', predikat: 'Cukup', ketercapaian: 'Hampir mencapai', tindak_lanjut: 'Remedial sebagian; tambah scaffolding dan pendampingan' },
        { rentang: '0–40', nilai: 'D', predikat: 'Perlu Bimbingan', ketercapaian: 'Belum mencapai', tindak_lanjut: 'Remedial menyeluruh; pendekatan berbeda; konsultasi BK' }
      ]
    },

    refleksi_mandiri: {
      petunjuk: '💜 Petunjuk: Refleksi ini milikmu. Tidak ada jawaban benar/salah. Semakin jujur, semakin besar manfaatnya!',
      evaluasi_hasil: [
        `1. Apa konsep TERPENTING yang kamu pelajari tentang ${material} hari ini?`,
        `2. Bagaimana kamu akan menggunakan pengetahuan ${material} dalam kehidupan sehari-hari? (beri contoh!)`,
        '3. Apa yang MASIH membingungkan atau ingin kamu pelajari lebih lanjut?'
      ],
      evaluasi_proses: [
        '4. Bagaimana perasaanmu selama proses pembelajaran hari ini? Mengapa?',
        '5. Hal apa yang kamu lakukan dengan BAIK hari ini?',
        '6. Apa yang ingin kamu TINGKATKAN pada pertemuan berikutnya?'
      ],
      penilaian_diri: [
        `Saya memahami konsep utama ${material}`,
        'Saya aktif berpartisipasi selama kegiatan',
        `Saya dapat menghubungkan ${material} dengan kehidupan nyata`,
        'Saya berani bertanya ketika belum memahami',
        'Saya menghargai pendapat dan kontribusi teman',
        'Saya merasa pembelajaran hari ini menyenangkan dan bermakna'
      ]
    },

    observasi_guru: {
      aspek_pelaksanaan: [
        'Apersepsi berhasil membangun motivasi dan kesiapan belajar',
        'Tujuan pembelajaran disampaikan jelas dan dipahami',
        'Kegiatan MEMAHAMI berlangsung sesuai rencana dan prinsip',
        'Kegiatan MENGAPLIKASI efektif sesuai sintaks pedagogis',
        'Kegiatan MEREFLEKSI memfasilitasi evaluasi mandiri peserta didik',
        'Semua peserta didik aktif terlibat dalam kegiatan',
        'Guru berperan sebagai fasilitator (bukan pemberi informasi tunggal)',
        'Suasana kelas aman, nyaman, dan saling memuliakan',
        'Asesmen formatif berhasil dilaksanakan dan informatif',
        'Alokasi waktu sesuai rencana yang ditetapkan'
      ],
      evaluasi_rencana_perbaikan: [
        'Apa yang BERJALAN BAIK pada pembelajaran ini?',
        'Apa yang PERLU DIPERBAIKI pada RPM/pembelajaran berikutnya?',
        'Perubahan yang akan saya lakukan berdasarkan hasil observasi hari ini?'
      ]
    },

    observasi_kbc: {
      pendekatan: 'Experiential Learning + Pembiasaan Berkesadaran',
      petunjuk: '❤️ Petunjuk: Instrumen ini mengamati internalisasi nilai-nilai Panca Cinta — bukan menilai kognitif. Skor 1–4 untuk setiap indikator. Hasil sebagai bahan refleksi guru, bukan untuk meranking peserta didik.',
      topik_insersi: [
        {
          nilai: '🕌 Cinta Allah Swt. dan Rasul-Nya',
          nilai_inti: 'Tauhid & keimanan, Ihsan & muraqabah, Akhlak Rasulullah saw., Rahmatan lil ‘ālamīn, Doa & dzikir',
          insersi_materi: `Sebelum memulai eksplorasi materi, peserta didik melafalkan asmaul husna yang relevan dan mengaitkan fenomena ${material} yang dipelajari dengan kebesaran Allah.`
        },
        {
          nilai: '📚 Cinta Ilmu',
          nilai_inti: 'Adab menuntut ilmu, Rasa ingin tahu (curiosity), Berpikir kritis & jujur ilmiah, Belajar sepanjang hayat, Menghargai guru & sumber ilmu',
          insersi_materi: `Peserta didik diajak mengagumi keteraturan alam/keterkaitan konsep, lalu menuliskan refleksi: "Apa yang ingin saya pelajari lebih dalam, dan untuk apa ilmu ini saya gunakan?"`
        },
        {
          nilai: '🌱 Cinta Lingkungan',
          nilai_inti: 'Hemat air & energi, Pengelolaan sampah, Sayang hewan & tumbuhan, Konservasi & keanekaragaman hayati, Adaptasi krisis iklim',
          insersi_materi: `Peserta didik melakukan observasi lingkungan sekitar terkait topik ${material}, kemudian merancang satu aksi konkret pelestarian sebagai produk belajar.`
        }
      ],
      rubrik_internalisasi: [
        { skor: 4, predikat: 'Sangat Baik', deskripsi: 'Konsisten menunjukkan nilai cinta dalam ucapan & perbuatan; menjadi teladan dan menginspirasi teman' },
        { skor: 3, predikat: 'Baik', deskripsi: 'Sering menunjukkan nilai cinta dengan kesadaran yang baik dan konsisten dalam sebagian besar situasi' },
        { skor: 2, predikat: 'Cukup', deskripsi: 'Kadang menunjukkan; masih memerlukan pengingat dari guru atau teman' },
        { skor: 1, predikat: 'Perlu Bimbingan', deskripsi: 'Jarang menunjukkan nilai cinta; memerlukan pendampingan khusus dan strategi pembiasaan tambahan' }
      ],
      refleksi_guru: [
        'Apakah nilai-nilai Panca Cinta benar-benar terinternalisasi secara organik dalam alur pembelajaran (bukan tempelan)?',
        `Peristiwa pembelajaran apa hari ini yang paling kuat menumbuhkan rasa cinta peserta didik terkait "${material}"?`,
        'Apa kendala internalisasi yang muncul, dan strategi apa yang akan diperbaiki pada pertemuan berikutnya?'
      ],
      iklim_budaya: 'Pembiasaan salam-sapa-senyum, doa & asmaul husna sebelum belajar, jumat bersih lingkungan. Referensi: Keputusan Direktur Jenderal Pendidikan Islam Kemenag RI Nomor 6077 Tahun 2025 tentang Panduan Kurikulum Berbasis Cinta pada Madrasah.'
    }
  };

  // Merge with any AI generated content if available
  return {
    identifikasi: {
      peserta_didik: partialContent?.identifikasi?.peserta_didik?.length 
        ? partialContent.identifikasi.peserta_didik 
        : defaultIdentifikasi.peserta_didik,
      materi_pelajaran: partialContent?.identifikasi?.materi_pelajaran || defaultIdentifikasi.materi_pelajaran,
      lintas_disiplin: partialContent?.identifikasi?.lintas_disiplin?.length 
        ? partialContent.identifikasi.lintas_disiplin 
        : defaultIdentifikasi.lintas_disiplin,
    },
    profil_pancasila_narasi: partialContent?.profil_pancasila_narasi?.length 
      ? partialContent.profil_pancasila_narasi 
      : defaultProfilPancasila,
    panca_cinta_narasi: partialContent?.panca_cinta_narasi?.length 
      ? partialContent.panca_cinta_narasi 
      : defaultPancaCinta,
    desain_pembelajaran: {
      capaian_pembelajaran_narasi: partialContent?.desain_pembelajaran?.capaian_pembelajaran_narasi || defaultDesain.capaian_pembelajaran_narasi,
      topik_pembelajaran: partialContent?.desain_pembelajaran?.topik_pembelajaran || defaultDesain.topik_pembelajaran,
      konteks: partialContent?.desain_pembelajaran?.konteks || defaultDesain.konteks,
      kemitraan: partialContent?.desain_pembelajaran?.kemitraan || defaultDesain.kemitraan,
      lingkungan: partialContent?.desain_pembelajaran?.lingkungan || defaultDesain.lingkungan,
      digital: partialContent?.desain_pembelajaran?.digital || defaultDesain.digital,
    },
    langkah_pembelajaran: {
      pendahuluan: partialContent?.langkah_pembelajaran?.pendahuluan || {
        salam_sapa: 'Guru menyambut hangat, memimpin doa, cek kehadiran, dan kesiapan belajar.',
        aktivitas_pemantik: `Pertanyaan pemantik menghubungkan pengalaman nyata dengan materi "${material}".`,
        informasi_tujuan: 'Menyampaikan tujuan pembelajaran dan manfaat nyata bagi kehidupan.'
      },
      inti: partialContent?.langkah_pembelajaran?.inti || {
        memahami: `Eksplorasi konsep esensial materi "${material}" melalui pengamatan fenomena dan perumusan hipotesis.`,
        mengaplikasi: `Penyelidikan mendalam, analisis data terstruktur, dan perumusan solusi konkret secara kolaboratif.`
      },
      penutup: partialContent?.langkah_pembelajaran?.penutup || {
        refleksi_presentasi: 'Presentasi hasil temuan kelompok dan saling memberikan tanggapan konstruktif.',
        kesimpulan: 'Sintesis bersama poin kunci pembelajaran dan doa kafaratul majlis.'
      },
      daftar_pertemuan: partialContent?.langkah_pembelajaran?.daftar_pertemuan?.length
        ? partialContent.langkah_pembelajaran.daftar_pertemuan
        : defaultDaftarPertemuan
    },
    asesmen: {
      awal: partialContent?.asesmen?.awal || defaultAsesmen.awal,
      proses: partialContent?.asesmen?.proses || defaultAsesmen.proses,
      akhir: partialContent?.asesmen?.akhir || defaultAsesmen.akhir,
    },
    insersi_kbc: partialContent?.insersi_kbc || defaultInsersiKBC,
    // Opsi Kustomisasi Lanjutan:
    diferensiasi_pembelajaran: partialContent?.diferensiasi_pembelajaran || (diffEnabled ? defaultDiferensiasi : undefined),
    metode_penilaian_terpilih: selectedAssessmentMethods,
    alokasi_durasi_aktivitas: {
      pendahuluan: allocPendahuluan,
      inti: allocInti,
      penutup: allocPenutup,
      catatan_topik: perTopicDurationNote || undefined
    },
    lampiran: {
      lks: partialContent?.lampiran?.lks || defaultLampiran.lks,
      rubrik: partialContent?.lampiran?.rubrik || defaultLampiran.rubrik,
      soal_akhir: partialContent?.lampiran?.soal_akhir || defaultLampiran.soal_akhir,
      kktp: partialContent?.lampiran?.kktp || defaultLampiran.kktp,
      bahan_bacaan: partialContent?.lampiran?.bahan_bacaan || defaultLampiran.bahan_bacaan,
      lkpd_detail: partialContent?.lampiran?.lkpd_detail || defaultLampiran.lkpd_detail,
      asesmen_awal_detail: partialContent?.lampiran?.asesmen_awal_detail || defaultLampiran.asesmen_awal_detail,
      asesmen_proses_detail: partialContent?.lampiran?.asesmen_proses_detail || defaultLampiran.asesmen_proses_detail,
      asesmen_akhir_detail: partialContent?.lampiran?.asesmen_akhir_detail || defaultLampiran.asesmen_akhir_detail,
      rubrik_lengkap: partialContent?.lampiran?.rubrik_lengkap || defaultLampiran.rubrik_lengkap,
      refleksi_mandiri: partialContent?.lampiran?.refleksi_mandiri || defaultLampiran.refleksi_mandiri,
      observasi_guru: partialContent?.lampiran?.observasi_guru || defaultLampiran.observasi_guru,
      observasi_kbc: partialContent?.lampiran?.observasi_kbc || defaultLampiran.observasi_kbc,
    }
  };
};
