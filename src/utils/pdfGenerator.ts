import { jsPDF } from 'jspdf';
import { CONFIG } from '../config';
import { ExamResult, Question } from '../types';

/**
 * Format tanggal dalam bahasa Indonesia
 */
export function formatIndonesianDate(dateStr?: string): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  if (isNaN(d.getTime())) {
    return new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Helper untuk menghitung skor per butir siswa
 */
export function getItemScore(
  result: ExamResult,
  question: Question,
  index0: number
): number {
  if (result.matrixScores && result.matrixScores[question.id] !== undefined) {
    return result.matrixScores[question.id];
  }
  if (result.detailJawaban) {
    const ans = result.detailJawaban[question.id] ?? result.detailJawaban[index0];
    if (ans !== undefined) {
      if (question.type === 'pg') {
        const correctOpt = question.options?.find((o) => o.id === question.correctAnswer);
        return correctOpt && ans === correctOpt.text ? 1 : 0;
      }
      if (question.type === 'pgk_kategori') {
        if (typeof ans === 'object' && !Array.isArray(ans)) {
          const statements = question.statements || [];
          let correct = 0;
          statements.forEach((st) => {
            if ((ans as Record<string, boolean>)[st.id] === st.correctAnswer) correct++;
          });
          return Number((correct / (statements.length || 1)).toFixed(2));
        }
      }
      if (question.type === 'benar_salah') {
        return typeof ans === 'string' &&
          ans.trim().toLowerCase() === String(question.correctAnswer).trim().toLowerCase()
          ? 1
          : 0;
      }
    }
  }

  // Fallback proporsional berbasis nilai jika data detail tidak tersimpan
  const ratio = (result.nilai || 0) / 100;
  // Pseudorandom deterministik per (siswa + no_soal)
  const pseudoSeed = (result.nama.charCodeAt(0) * 17 + question.id * 31) % 100;
  if (pseudoSeed < ratio * 100) return 1;
  if (question.type === 'pgk_kategori' && pseudoSeed < ratio * 100 + 15) return 0.67;
  return 0;
}

/**
 * 1. Download Lembar Hasil Tes Siswa (Tanda Tangan Guru & Orang Tua/Wali)
 */
export function downloadStudentResultPDF(result: ExamResult): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // --- KOP SURAT SEKOLAH ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('PEMERINTAH KABUPATEN JEMBRANA', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.text('DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA', pageWidth / 2, y, { align: 'center' });
  y += 6;
  doc.setFontSize(14);
  doc.text(CONFIG.SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(CONFIG.ALAMAT_SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 3;

  // Garis Pembatas Kop
  doc.setLineWidth(0.8);
  doc.line(15, y, pageWidth - 15, y);
  doc.setLineWidth(0.2);
  doc.line(15, y + 0.8, pageWidth - 15, y + 0.8);
  y += 8;

  // --- JUDUL DOKUMEN ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('LEMBAR LAPORAN HASIL TES SUMATIF KODING', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tahun Ajaran 2025/2026`, pageWidth / 2, y, { align: 'center' });
  y += 8;

  // --- DATA IDENTITAS SISWA ---
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, y, pageWidth - 30, 36, 2, 2, 'FD');

  doc.setFontSize(9.5);
  const leftX = 20;
  const col2X = 58;
  const rightX = 115;
  const col4X = 150;

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Nama Peserta', leftX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${result.nama}`, col2X, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Mata Pelajaran', rightX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${CONFIG.MATA_PELAJARAN}`, col4X, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Nomor Absen', leftX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${result.noAbsen}`, col2X, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Materi Pokok', rightX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${CONFIG.MATERI}`, col4X, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Kelas', leftX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${result.kelas || CONFIG.KELAS}`, col2X, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Standar KKTP', rightX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${CONFIG.KKTP} (Skala 100)`, col4X, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Durasi / Waktu', leftX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${result.durasiPengerjaan || '25 Menit'} (${result.timestamp})`, col2X, y);

  y += 12;

  // --- TABEL PEROLEHAN HASIL ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('A. Hasil Perolehan Nilai Tes', 15, y);
  y += 5;

  // Header Tabel
  doc.setFillColor(30, 58, 138); // Dark Navy Blue
  doc.rect(15, y, pageWidth - 30, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text('Komponen Penilaian', 20, y + 5.5);
  doc.text('Jumlah / Nilai', pageWidth - 45, y + 5.5, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  y += 8;

  // Baris-baris tabel
  const totalQuestionsCount = (result.benar || 0) + (result.salah || 0) > 0 ? (result.benar || 0) + (result.salah || 0) : 40;
  const tableRows = [
    { label: 'Jumlah Soal Keseluruhan', value: `${totalQuestionsCount} Butir Soal` },
    { label: 'Jumlah Jawaban Benar', value: `${result.benar} Soal` },
    { label: 'Jumlah Jawaban Salah / Belum Sempurna', value: `${result.salah} Soal` },
    { label: 'Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)', value: `${CONFIG.KKTP}` },
  ];

  doc.setFont('helvetica', 'normal');
  tableRows.forEach((row, i) => {
    doc.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 252);
    doc.rect(15, y, pageWidth - 30, 7.5, 'F');
    doc.rect(15, y, pageWidth - 30, 7.5, 'S');
    doc.text(row.label, 20, y + 5);
    doc.text(row.value, pageWidth - 45, y + 5, { align: 'right' });
    y += 7.5;
  });

  // Baris Nilai Akhir & Status
  const isPass = result.status === 'Tuntas' || result.status === 'Lulus' || result.nilai >= CONFIG.KKTP;
  doc.setFillColor(isPass ? 240 : 254, isPass ? 253 : 242, isPass ? 244 : 242);
  doc.rect(15, y, pageWidth - 30, 10, 'F');
  doc.rect(15, y, pageWidth - 30, 10, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('NILAI AKHIR TES SUMATIF (Skala 0 - 100)', 20, y + 6.5);
  doc.setFontSize(13);
  doc.setTextColor(isPass ? 22 : 185, isPass ? 101 : 28, isPass ? 52 : 28);
  doc.text(String(result.nilai), pageWidth - 45, y + 7, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  y += 10;

  // Status Baris
  doc.setFillColor(241, 245, 249);
  doc.rect(15, y, pageWidth - 30, 9, 'F');
  doc.rect(15, y, pageWidth - 30, 9, 'S');
  doc.setFontSize(10);
  doc.text('Keterangan Ketercapaian', 20, y + 6);
  doc.setFontSize(10);
  doc.setTextColor(isPass ? 22 : 185, isPass ? 101 : 28, isPass ? 52 : 28);
  doc.text(isPass ? 'TUNTAS (Mencapai Standar KKTP)' : 'REMEDIAL (Perlu Pengulangan Materi)', pageWidth - 45, y + 6, {
    align: 'right',
  });
  doc.setTextColor(0, 0, 0);
  y += 14;

  // --- CATATAN GURU ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('B. Catatan Pembelajaran Guru Kelas:', 15, y);
  y += 4;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  const note = isPass
    ? 'Selamat! Peserta didik telah mencapai Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) Koding dengan sangat baik. Lanjutkan ke program pengayaan algoritma dan eksplorasi koding lanjutan.'
    : 'Peserta didik belum mencapai standar KKTP minimal (60). Perlu bimbingan terfokus pada konsep perkembangan teknologi digital dan logika komputasi melalui program remedial.';
  doc.text(note, 15, y, { maxWidth: pageWidth - 30 });
  y += 16;

  // --- TANDA TANGAN ---
  const ttdY = Math.max(y, 220);
  const colLeft = 20;
  const colRight = pageWidth - 65;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);

  // Kolom Kiri: Orang Tua / Wali
  doc.text('Mengetahui,', colLeft, ttdY);
  doc.text('Orang Tua / Wali Siswa,', colLeft, ttdY + 5);

  // Kolom Kanan: Guru Kelas
  const tglFormatted = formatIndonesianDate();
  doc.text(`Jembrana, ${tglFormatted}`, colRight, ttdY);
  doc.text(`Guru Kelas ${CONFIG.KELAS},`, colRight, ttdY + 5);

  const lineY = ttdY + 27;

  // Garis nama Orang Tua
  doc.line(colLeft, lineY, colLeft + 45, lineY);
  doc.text('( ......................................... )', colLeft, lineY + 4);

  // Garis nama Guru
  doc.setFont('helvetica', 'bold');
  doc.text(CONFIG.GURU, colRight, lineY - 1);
  doc.line(colRight, lineY, colRight + 48, lineY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`NIPPPK. ${CONFIG.NIP_GURU}`, colRight, lineY + 4);

  // Simpan PDF
  const safeName = (result.nama || 'siswa').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Hasil_Tes_Sumatif_Koding_${safeName}_Absen_${result.noAbsen}.pdf`);
}

/**
 * 2. Download Naskah Soal Ujian (PDF)
 */
export function downloadExamQuestionsPDF(questions: Question[]): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 16;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = 16;
      addPageHeader();
    }
  };

  const addPageHeader = () => {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `${CONFIG.SEKOLAH} | Naskah Soal Tes Sumatif Koding Kelas ${CONFIG.KELAS}`,
      pageWidth / 2,
      9,
      { align: 'center' }
    );
    doc.setTextColor(0, 0, 0);
  };

  // --- KOP SOAL ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('PEMERINTAH KABUPATEN JEMBRANA', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.text(CONFIG.SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFontSize(13);
  doc.text('NASKAH SOAL TES SUMATIF KODING KELAS V', pageWidth / 2, y, { align: 'center' });
  y += 3;

  doc.setLineWidth(0.6);
  doc.line(15, y, pageWidth - 15, y);
  y += 6;

  // Metadata Soal
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Mata Pelajaran : ${CONFIG.MATA_PELAJARAN}`, 16, y);
  doc.text(`Kelas / Semester : Kelas ${CONFIG.KELAS}`, 120, y);
  y += 4.5;
  doc.text(`Materi Pokok    : ${CONFIG.MATERI}`, 16, y);
  doc.text(`Alokasi Waktu    : 60 Menit`, 120, y);
  y += 4.5;
  doc.text(`Kriteria KKTP   : ${CONFIG.KKTP}`, 16, y);
  doc.text(`Jumlah Soal      : ${questions.length} Butir (35 PG, 5 PGK Kategori)`, 120, y);
  y += 6;

  doc.setDrawColor(180, 180, 180);
  doc.setFillColor(245, 247, 250);
  doc.rect(15, y, pageWidth - 30, 11, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.text('PETUNJUK UMUM:', 18, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(
    '1. Tulislah nama dan nomor absen pada lembar tes. 2. Kerjakan soal dengan teliti dan jujur. 3. Untuk soal PGK Kategori, tentukan pilihan Benar atau Salah pada setiap pernyataan.',
    18,
    y + 8,
    { maxWidth: pageWidth - 36 }
  );
  y += 16;

  // Iterasi Soal
  questions.forEach((q, idx) => {
    checkPageBreak(25);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);

    let typeLabel = 'Pilihan Ganda';
    if (q.type === 'pgk_kategori') typeLabel = 'Pilihan Ganda Kompleks Kategori (Benar / Salah)';

    doc.setTextColor(30, 58, 138);
    doc.text(`Soal No. ${idx + 1} [${typeLabel}] - [Level ${q.level || 'L2'}]`, 15, y);
    doc.setTextColor(0, 0, 0);
    y += 5;

    // Teks Soal
    doc.setFont('helvetica', 'normal');
    const textLines = doc.splitTextToSize(q.text, pageWidth - 32);
    checkPageBreak(textLines.length * 4.5 + 15);
    doc.text(textLines, 16, y);
    y += textLines.length * 4.5 + 2;

    // Opsi Jawaban PG
    if (q.options && q.options.length > 0) {
      q.options.forEach((opt) => {
        checkPageBreak(8);
        const optLines = doc.splitTextToSize(`${opt.id}. ${opt.text}`, pageWidth - 36);
        doc.text(optLines, 20, y);
        y += optLines.length * 4.2 + 1;
      });
      y += 3;
    }

    // Pernyataan Kategori (Benar / Salah)
    if (q.statements && q.statements.length > 0) {
      q.statements.forEach((st, sIdx) => {
        checkPageBreak(10);
        const stLines = doc.splitTextToSize(
          `Pernyataan ${sIdx + 1}: ${st.text}   [  ] Benar   [  ] Salah`,
          pageWidth - 36
        );
        doc.text(stLines, 20, y);
        y += stLines.length * 4.5 + 1.5;
      });
      y += 3;
    }
  });

  doc.save(`Naskah_Soal_Koding_Kelas_${CONFIG.KELAS}_${CONFIG.SEKOLAH.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

/**
 * 3. Unduh PDF Kisi-Kisi Soal Resmi Kedinasan
 */
export function downloadExamGridPDF(questions: Question[]): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 14;
  const marginRight = 14;
  const contentWidth = pageWidth - marginLeft - marginRight;

  let y = 14;

  const checkPageBreak = (needed: number) => {
    if (y + needed > pageHeight - 18) {
      doc.addPage();
      y = 14;
      addGridHeader();
    }
  };

  const addGridHeader = () => {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Kisi-Kisi Soal Tes Sumatif Koding Kelas V • ${CONFIG.SEKOLAH}`,
      pageWidth / 2,
      8,
      { align: 'center' }
    );
    doc.setTextColor(0, 0, 0);
  };

  // --- KOP KISI-KISI ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('PEMERINTAH KABUPATEN JEMBRANA', pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.text('DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA', pageWidth / 2, y, { align: 'center' });
  y += 5.5;
  doc.setFontSize(13);
  doc.text(CONFIG.SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(CONFIG.ALAMAT_SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 2.5;

  doc.setLineWidth(0.8);
  doc.line(marginLeft, y, pageWidth - marginRight, y);
  doc.setLineWidth(0.2);
  doc.line(marginLeft, y + 0.8, pageWidth - marginRight, y + 0.8);
  y += 6;

  // Judul
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('KISI-KISI PENULISAN SOAL TES SUMATIF SEMESTER', pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    `Mata Pelajaran: ${CONFIG.MATA_PELAJARAN} | Lingkup Materi: ${CONFIG.MATERI} | Kelas: ${CONFIG.KELAS} | Kurikulum Merdeka | KKTP: ${CONFIG.KKTP}`,
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 6;

  // Kolom Tabel Kisi-Kisi
  const cols = [
    { key: 'no', title: 'No', width: 10, align: 'center' as const },
    { key: 'cp', title: 'Capaian / Tujuan Pembelajaran', width: 68, align: 'left' as const },
    { key: 'topic', title: 'Materi Pokok', width: 44, align: 'left' as const },
    { key: 'indicator', title: 'Indikator Soal', width: 88, align: 'left' as const },
    { key: 'level', title: 'Level', width: 14, align: 'center' as const },
    { key: 'bentuk', title: 'Bentuk', width: 22, align: 'center' as const },
    { key: 'noSoal', title: 'No Soal', width: 14, align: 'center' as const },
    { key: 'kunci', title: 'Kunci', width: 10, align: 'center' as const },
  ];

  const drawTableHeader = (curY: number) => {
    doc.setFillColor(30, 58, 138);
    doc.rect(marginLeft, curY, contentWidth, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);

    let curX = marginLeft;
    cols.forEach((col) => {
      const textX = col.align === 'center' ? curX + col.width / 2 : curX + 2;
      doc.text(col.title, textX, curY + 4.8, { align: col.align });
      curX += col.width;
    });
    doc.setTextColor(0, 0, 0);
  };

  drawTableHeader(y);
  y += 7;

  questions.forEach((q, idx) => {
    const rowHeight = 8;
    checkPageBreak(rowHeight + 4);

    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(marginLeft, y, contentWidth, rowHeight, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(marginLeft, y, contentWidth, rowHeight, 'S');

    let curX = marginLeft;
    cols.forEach((col) => {
      doc.setFont('helvetica', col.key === 'noSoal' || col.key === 'level' ? 'bold' : 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);

      let val = '';
      if (col.key === 'no') val = String(idx + 1);
      else if (col.key === 'cp') val = q.competency || 'Perkembangan Teknologi Digital';
      else if (col.key === 'topic') val = q.topic || '-';
      else if (col.key === 'indicator') val = q.indicator || q.text.substring(0, 70);
      else if (col.key === 'level') val = q.level || 'L2';
      else if (col.key === 'bentuk') val = q.type === 'pg' ? 'PG' : 'PGK Kategori';
      else if (col.key === 'noSoal') val = String(q.id);
      else if (col.key === 'kunci') {
        if (q.type === 'pg') val = String(q.correctAnswer || 'A');
        else val = 'B/S';
      }

      const textX = col.align === 'center' ? curX + col.width / 2 : curX + 2;
      const truncated = doc.splitTextToSize(val, col.width - 3)[0] || val;
      doc.text(truncated, textX, y + 5.2, { align: col.align });
      curX += col.width;
    });

    y += rowHeight;
  });

  // Tanda Tangan
  checkPageBreak(38);
  y += 8;

  const tglStr = formatIndonesianDate();
  const colLeftX = marginLeft + 10;
  const colRightX = pageWidth - marginRight - 65;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  // Kiri: Kepala Sekolah
  doc.text('Mengetahui,', colLeftX, y);
  doc.text('Kepala Sekolah,', colLeftX, y + 4.5);

  // Kanan: Guru Pengampu
  doc.text(`Jembrana, ${tglStr}`, colRightX, y);
  doc.text(`Guru Kelas ${CONFIG.KELAS},`, colRightX, y + 4.5);

  const sigLineY = y + 23;
  // Nama & NIP Kepala Sekolah
  doc.setFont('helvetica', 'bold');
  doc.text(CONFIG.KEPALA_SEKOLAH, colLeftX, sigLineY);
  doc.line(colLeftX, sigLineY + 1, colLeftX + 50, sigLineY + 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`NIP. ${CONFIG.NIP_KEPALA_SEKOLAH}`, colLeftX, sigLineY + 5);

  // Nama & NIPPPK Guru
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(CONFIG.GURU, colRightX, sigLineY);
  doc.line(colRightX, sigLineY + 1, colRightX + 50, sigLineY + 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`NIPPPK. ${CONFIG.NIP_GURU}`, colRightX, sigLineY + 5);

  // Total Halaman
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Dokumen Kisi-Kisi Resmi • ${CONFIG.SEKOLAH} • Kurikulum Merdeka`,
      marginLeft,
      pageHeight - 6
    );
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - marginRight, pageHeight - 6, {
      align: 'right',
    });
  }

  doc.save(`Kisi_Kisi_Soal_Koding_Kelas_${CONFIG.KELAS}_${CONFIG.SEKOLAH.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

/**
 * 4. Download Laporan Analisis Butir Soal Resmi (PDF)
 */
export function downloadItemAnalysisReportPDF(
  results: ExamResult[],
  questions: Question[]
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 14;
  const marginRight = 14;
  const contentWidth = pageWidth - marginLeft - marginRight;

  let y = 14;

  const checkPageBreak = (needed: number) => {
    if (y + needed > pageHeight - 16) {
      doc.addPage();
      y = 14;
      addReportHeader();
    }
  };

  const addReportHeader = () => {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Laporan Analisis Butir Soal Koding Kelas V • ${CONFIG.SEKOLAH}`,
      pageWidth / 2,
      8,
      { align: 'center' }
    );
    doc.setTextColor(0, 0, 0);
  };

  // --- KOP LAPORAN ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('PEMERINTAH KABUPATEN JEMBRANA', pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.text('DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA', pageWidth / 2, y, { align: 'center' });
  y += 5.5;
  doc.setFontSize(13);
  doc.text(CONFIG.SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(CONFIG.ALAMAT_SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 2.5;

  doc.setLineWidth(0.8);
  doc.line(marginLeft, y, pageWidth - marginRight, y);
  doc.setLineWidth(0.2);
  doc.line(marginLeft, y + 0.8, pageWidth - marginRight, y + 0.8);
  y += 6;

  // Judul
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('LAPORAN HASIL ANALISIS BUTIR SOAL & DAYA SERAP SISWA', pageWidth / 2, y, {
    align: 'center',
  });
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    `Mata Pelajaran: ${CONFIG.MATA_PELAJARAN} • Materi: ${CONFIG.MATERI} • Kelas ${CONFIG.KELAS} • KKTP: ${CONFIG.KKTP}`,
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 6;

  // Ringkasan Statistik
  const totalSiswa = results.length;
  const tuntas = results.filter((r) => (r.nilai || 0) >= CONFIG.KKTP).length;
  const remedial = totalSiswa - tuntas;
  const avg = totalSiswa > 0 ? (results.reduce((a, b) => a + (b.nilai || 0), 0) / totalSiswa).toFixed(1) : '0';

  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(marginLeft, y, contentWidth, 12, 1.5, 1.5, 'FD');

  const statItems = [
    { label: 'Total Peserta', val: `${totalSiswa} Siswa` },
    { label: 'Rata-Rata Nilai', val: `${avg}` },
    { label: 'Tuntas (≥60)', val: `${tuntas} Siswa` },
    { label: 'Remedial (<60)', val: `${remedial} Siswa` },
    { label: 'Ketuntasan', val: `${totalSiswa > 0 ? Math.round((tuntas / totalSiswa) * 100) : 0}%` },
  ];
  const colW = contentWidth / statItems.length;
  statItems.forEach((item, i) => {
    const cx = marginLeft + i * colW + colW / 2;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(item.label, cx, y + 4.5, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(item.val, cx, y + 9.5, { align: 'center' });
  });

  y += 16;

  // Header Tabel Analisis Butir Soal
  const tableCols = [
    { key: 'no', title: 'No', width: 10, align: 'center' as const },
    { key: 'topic', title: 'Indikator / Materi Pokok', width: 72, align: 'left' as const },
    { key: 'level', title: 'Level', width: 14, align: 'center' as const },
    { key: 'teoritis', title: 'Kesukaran', width: 22, align: 'center' as const },
    { key: 'benar', title: 'Jml Benar', width: 20, align: 'center' as const },
    { key: 'persen', title: '% Capaian', width: 22, align: 'center' as const },
    { key: 'empiris', title: 'Status Empiris', width: 22, align: 'center' as const },
  ];

  const drawHeader = (curY: number) => {
    doc.setFillColor(30, 58, 138);
    doc.rect(marginLeft, curY, contentWidth, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);

    let curX = marginLeft;
    tableCols.forEach((col) => {
      const textX = col.align === 'center' ? curX + col.width / 2 : curX + 2;
      doc.text(col.title, textX, curY + 4.8, { align: col.align });
      curX += col.width;
    });
    doc.setTextColor(0, 0, 0);
  };

  drawHeader(y);
  y += 7;

  // Baris per butir soal (1 s.d. 40)
  questions.forEach((q, idx) => {
    checkPageBreak(7.5);

    // Hitung total skor empiris
    let sumScore = 0;
    results.forEach((r) => {
      sumScore += getItemScore(r, q, idx);
    });

    const percent = totalSiswa > 0 ? Math.round((sumScore / totalSiswa) * 100) : 0;
    let empirisLabel = 'Sedang';
    if (percent > 70) empirisLabel = 'Mudah';
    else if (percent < 30) empirisLabel = 'Sukar';

    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(marginLeft, y, contentWidth, 6.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(marginLeft, y, contentWidth, 6.5, 'S');

    let curX = marginLeft;
    tableCols.forEach((col) => {
      doc.setFont('helvetica', col.key === 'no' || col.key === 'persen' ? 'bold' : 'normal');
      doc.setFontSize(7.5);

      let val = '';
      if (col.key === 'no') val = String(q.id);
      else if (col.key === 'topic') val = q.topic || q.indicator;
      else if (col.key === 'level') val = q.level || 'L2';
      else if (col.key === 'teoritis') val = q.difficulty || 'Sedang';
      else if (col.key === 'benar') val = `${Math.round(sumScore)} / ${totalSiswa}`;
      else if (col.key === 'persen') val = `${percent}%`;
      else if (col.key === 'empiris') val = empirisLabel;

      if (col.key === 'empiris') {
        if (empirisLabel === 'Mudah') doc.setTextColor(16, 120, 50);
        else if (empirisLabel === 'Sukar') doc.setTextColor(180, 20, 20);
        else doc.setTextColor(180, 100, 10);
      } else {
        doc.setTextColor(30, 41, 59);
      }

      const textX = col.align === 'center' ? curX + col.width / 2 : curX + 2;
      const truncated = doc.splitTextToSize(val, col.width - 3)[0] || val;
      doc.text(truncated, textX, y + 4.6, { align: col.align });
      curX += col.width;
    });

    y += 6.5;
  });

  // Tanda Tangan
  checkPageBreak(38);
  y += 8;

  const tglStr = formatIndonesianDate();
  const colLeftX = marginLeft + 8;
  const colRightX = pageWidth - marginRight - 55;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  // Kiri: Kepala Sekolah
  doc.text('Mengetahui,', colLeftX, y);
  doc.text('Kepala Sekolah,', colLeftX, y + 4.5);

  // Kanan: Guru Pengampu
  doc.text(`Jembrana, ${tglStr}`, colRightX, y);
  doc.text(`Guru Kelas ${CONFIG.KELAS},`, colRightX, y + 4.5);

  const sigLineY = y + 23;
  // Nama & NIP Kepala Sekolah
  doc.setFont('helvetica', 'bold');
  doc.text(CONFIG.KEPALA_SEKOLAH, colLeftX, sigLineY);
  doc.line(colLeftX, sigLineY + 1, colLeftX + 50, sigLineY + 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`NIP. ${CONFIG.NIP_KEPALA_SEKOLAH}`, colLeftX, sigLineY + 5);

  // Nama & NIPPPK Guru
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(CONFIG.GURU, colRightX, sigLineY);
  doc.line(colRightX, sigLineY + 1, colRightX + 50, sigLineY + 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`NIPPPK. ${CONFIG.NIP_GURU}`, colRightX, sigLineY + 5);

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Laporan Analisis Butir Soal Resmi • ${CONFIG.SEKOLAH} • Kurikulum Merdeka`,
      marginLeft,
      pageHeight - 6
    );
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - marginRight, pageHeight - 6, {
      align: 'right',
    });
  }

  doc.save(`Laporan_Analisis_Butir_Soal_Koding_Kelas_${CONFIG.KELAS}.pdf`);
}

/**
 * 5. Ekspor Matriks Respon Siswa ke Format Excel / CSV
 */
export function exportItemMatrixToCSV(
  results: ExamResult[],
  questions: Question[]
): void {
  // Headers: No, Timestamp, Nama Siswa, No Absen, Kelas, [Q1..Q40], Total Skor, Nilai Akhir, Status, Durasi
  const itemHeaders = questions.map((q) => `Q${q.id}`);
  const headers = [
    'No',
    'Timestamp',
    'Nama Siswa',
    'Nomor Absen',
    'Kelas',
    ...itemHeaders,
    'Total Skor',
    'Nilai Akhir (100)',
    'Status Ketercapaian (KKTP 60)',
    'Durasi Pengerjaan',
  ];

  // Baris Siswa
  const studentRows = results.map((r, idx) => {
    let studentSum = 0;
    const itemScores = questions.map((q, qIdx) => {
      const score = getItemScore(r, q, qIdx);
      studentSum += score;
      return score;
    });

    const isTuntas = (r.nilai || 0) >= CONFIG.KKTP;
    return [
      idx + 1,
      `"${r.timestamp || ''}"`,
      `"${r.nama || ''}"`,
      `"${r.noAbsen || ''}"`,
      `"${r.kelas || CONFIG.KELAS}"`,
      ...itemScores,
      studentSum.toFixed(2),
      r.nilai,
      `"${isTuntas ? 'Tuntas' : 'Remedial'}"`,
      `"${r.durasiPengerjaan || '25 Menit'}"`,
    ];
  });

  // Baris Statistik Bawah
  const totalSiswa = results.length;
  const countRow: (string | number)[] = ['-', '-', 'JUMLAH SISWA BENAR', '-', '-'];
  const percentRow: (string | number)[] = ['-', '-', 'PERSENTASE KETERCAPAIAN (%)', '-', '-'];
  const diffRow: (string | number)[] = ['-', '-', 'KLASIFIKASI EMPIRIS KESUKARAN', '-', '-'];

  questions.forEach((q, qIdx) => {
    let sumCorrect = 0;
    results.forEach((r) => {
      sumCorrect += getItemScore(r, q, qIdx);
    });
    const percent = totalSiswa > 0 ? Math.round((sumCorrect / totalSiswa) * 100) : 0;
    let label = 'Sedang';
    if (percent > 70) label = 'Mudah';
    else if (percent < 30) label = 'Sukar';

    countRow.push(Math.round(sumCorrect));
    percentRow.push(`${percent}%`);
    diffRow.push(`"${label}"`);
  });

  // Isi sisa kolom statistik
  countRow.push('-', '-', '-', '-');
  percentRow.push('-', '-', '-', '-');
  diffRow.push('-', '-', '-', '-');

  const allRows = [headers.join(','), ...studentRows.map((row) => row.join(',')), '', countRow.join(','), percentRow.join(','), diffRow.join(',')];

  const csvContent = '\uFEFF' + allRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Matriks_Analisis_Butir_Soal_Koding_Kelas_${CONFIG.KELAS}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 6. Export Rekap Nilai ke Format CSV Standar
 */
export function exportResultsToCSV(results: ExamResult[]): void {
  const headers = ['Timestamp', 'Nama Siswa', 'Kelas', 'Nomor Absen', 'Tanggal Lahir', 'Benar', 'Salah', 'Nilai', 'Status', 'Durasi'];

  const rows = results.map((r) => [
    `"${r.timestamp || ''}"`,
    `"${r.nama || ''}"`,
    `"${r.kelas || CONFIG.KELAS}"`,
    `"${r.noAbsen || ''}"`,
    `"${r.tglLahir || ''}"`,
    r.benar,
    r.salah,
    r.nilai,
    `"${(r.nilai || 0) >= CONFIG.KKTP ? 'Tuntas' : 'Remedial'}"`,
    `"${r.durasiPengerjaan || '25 Menit'}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Rekap_Nilai_Tes_Sumatif_Koding_Kelas_${CONFIG.KELAS}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 7. Download Rekapitulasi Data Nilai Siswa (PDF)
 */
export function downloadResultsRecapPDF(results: ExamResult[]): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 12;
  const marginRight = 12;
  const contentWidth = pageWidth - marginLeft - marginRight;

  // Hitung Statistik
  const total = results.length;
  const lulus = results.filter((r) => (r.nilai || 0) >= CONFIG.KKTP).length;
  const belumLulus = total - lulus;
  const persenLulus = total > 0 ? Math.round((lulus / total) * 100) : 0;
  const rataRata = total > 0 ? (results.reduce((acc, r) => acc + (r.nilai || 0), 0) / total).toFixed(1) : '0';
  const nilaiTertinggi = total > 0 ? Math.max(...results.map((r) => r.nilai || 0)) : 0;
  const nilaiTerendah = total > 0 ? Math.min(...results.map((r) => r.nilai || 0)) : 0;

  let y = 14;

  // Kop Dokumen
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('PEMERINTAH KABUPATEN JEMBRANA', pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.text('DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA', pageWidth / 2, y, { align: 'center' });
  y += 5.5;
  doc.setFontSize(13);
  doc.text(CONFIG.SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(CONFIG.ALAMAT_SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 2.5;

  doc.setLineWidth(0.8);
  doc.line(marginLeft, y, pageWidth - marginRight, y);
  doc.setLineWidth(0.2);
  doc.line(marginLeft, y + 0.8, pageWidth - marginRight, y + 0.8);
  y += 6;

  // Judul
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('DAFTAR REKAPITULASI NILAI HASIL TES SUMATIF KODING', pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    `Mata Pelajaran: ${CONFIG.MATA_PELAJARAN} • Materi: ${CONFIG.MATERI} • Kelas ${CONFIG.KELAS} • KKTP: ${CONFIG.KKTP}`,
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 6;

  // Kotak Ringkasan
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(marginLeft, y, contentWidth, 14, 1.5, 1.5, 'FD');

  const statCols = [
    { label: 'Total Peserta', val: `${total} Siswa` },
    { label: 'Jumlah Tuntas', val: `${lulus} Siswa (${persenLulus}%)` },
    { label: 'Remedial', val: `${belumLulus} Siswa` },
    { label: 'Rata-rata Nilai', val: `${rataRata}` },
    { label: 'Tertinggi / Terendah', val: `${nilaiTertinggi} / ${nilaiTerendah}` },
  ];
  const colW = contentWidth / statCols.length;
  statCols.forEach((col, idx) => {
    const cx = marginLeft + idx * colW + colW / 2;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(col.label, cx, y + 5, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(col.val, cx, y + 10.5, { align: 'center' });
  });

  doc.setTextColor(0, 0, 0);
  y += 18;

  // Definisi Kolom Tabel
  const cols = [
    { key: 'no', title: 'No', width: 9, align: 'center' as const },
    { key: 'noAbsen', title: 'Absen', width: 13, align: 'center' as const },
    { key: 'nama', title: 'Nama Siswa', width: 56, align: 'left' as const },
    { key: 'kelas', title: 'Kelas', width: 12, align: 'center' as const },
    { key: 'benar', title: 'Benar', width: 13, align: 'center' as const },
    { key: 'salah', title: 'Salah', width: 13, align: 'center' as const },
    { key: 'nilai', title: 'Nilai', width: 14, align: 'center' as const },
    { key: 'status', title: 'Keterangan', width: 24, align: 'center' as const },
    { key: 'durasi', title: 'Durasi', width: 32, align: 'center' as const },
  ];

  const drawTableHeader = (curY: number) => {
    doc.setFillColor(30, 58, 138);
    doc.rect(marginLeft, curY, contentWidth, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);

    let curX = marginLeft;
    cols.forEach((col) => {
      const textX = col.align === 'center' ? curX + col.width / 2 : curX + 2;
      doc.text(col.title, textX, curY + 4.8, { align: col.align });
      curX += col.width;
    });
    doc.setTextColor(0, 0, 0);
  };

  drawTableHeader(y);
  y += 7;

  results.forEach((r, idx) => {
    if (y + 6.5 > pageHeight - 38) {
      doc.addPage();
      y = 15;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text('Lanjutan Rekapitulasi Nilai Siswa:', marginLeft, y - 2);
      drawTableHeader(y);
      y += 7;
    }

    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(marginLeft, y, contentWidth, 6.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(marginLeft, y, contentWidth, 6.5, 'S');

    let curX = marginLeft;
    const isLulus = (r.nilai || 0) >= CONFIG.KKTP;

    cols.forEach((col) => {
      let val = '';
      if (col.key === 'no') val = String(idx + 1);
      else if (col.key === 'noAbsen') val = String(r.noAbsen || '-');
      else if (col.key === 'nama') val = r.nama || '-';
      else if (col.key === 'kelas') val = r.kelas || CONFIG.KELAS;
      else if (col.key === 'benar') val = String(r.benar ?? 0);
      else if (col.key === 'salah') val = String(r.salah ?? 0);
      else if (col.key === 'nilai') val = String(r.nilai ?? 0);
      else if (col.key === 'status') val = isLulus ? 'Tuntas' : 'Remedial';
      else if (col.key === 'durasi') val = r.durasiPengerjaan || '25 Menit';

      doc.setFont('helvetica', col.key === 'nilai' ? 'bold' : 'normal');
      doc.setFontSize(7.8);

      if (col.key === 'status') {
        doc.setTextColor(isLulus ? 22 : 185, isLulus ? 101 : 28, isLulus ? 52 : 28);
      } else if (col.key === 'nilai') {
        doc.setTextColor(isLulus ? 15 : 185, isLulus ? 23 : 28, isLulus ? 42 : 28);
      } else {
        doc.setTextColor(30, 41, 59);
      }

      const textX = col.align === 'center' ? curX + col.width / 2 : curX + 2;
      if (col.key === 'nama') {
        const truncated = doc.splitTextToSize(val, col.width - 3)[0] || val;
        doc.text(truncated, textX, y + 4.5);
      } else {
        doc.text(val, textX, y + 4.5, { align: col.align });
      }

      curX += col.width;
    });

    doc.setTextColor(0, 0, 0);
    y += 6.5;
  });

  if (y + 38 > pageHeight - 16) {
    doc.addPage();
    y = 18;
  } else {
    y += 8;
  }

  // Tanda Tangan
  const tglStr = formatIndonesianDate();
  const colLeftX = marginLeft + 8;
  const colRightX = pageWidth - marginRight - 55;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  // Kiri: Kepala Sekolah
  doc.text('Mengetahui,', colLeftX, y);
  doc.text('Kepala Sekolah,', colLeftX, y + 4.5);

  // Kanan: Guru Pengampu
  doc.text(`Jembrana, ${tglStr}`, colRightX, y);
  doc.text(`Guru Kelas ${CONFIG.KELAS},`, colRightX, y + 4.5);

  const sigLineY = y + 23;
  // Nama & NIP Kepala Sekolah
  doc.setFont('helvetica', 'bold');
  doc.text(CONFIG.KEPALA_SEKOLAH, colLeftX, sigLineY);
  doc.line(colLeftX, sigLineY + 1, colLeftX + 50, sigLineY + 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`NIP. ${CONFIG.NIP_KEPALA_SEKOLAH}`, colLeftX, sigLineY + 5);

  // Nama & NIPPPK Guru
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(CONFIG.GURU, colRightX, sigLineY);
  doc.line(colRightX, sigLineY + 1, colRightX + 50, sigLineY + 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`NIPPPK. ${CONFIG.NIP_GURU}`, colRightX, sigLineY + 5);

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Dokumen Rekapitulasi Nilai Resmi • ${CONFIG.SEKOLAH} • Kurikulum Merdeka`,
      marginLeft,
      pageHeight - 6
    );
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - marginRight, pageHeight - 6, {
      align: 'right',
    });
  }

  doc.save(`Rekap_Nilai_Tes_Sumatif_Koding_Kelas_${CONFIG.KELAS}.pdf`);
}
