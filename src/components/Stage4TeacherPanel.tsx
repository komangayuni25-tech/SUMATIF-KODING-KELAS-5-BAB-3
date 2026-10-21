import React, { useState, useEffect, useMemo } from 'react';
import { CONFIG } from '../config';
import { ExamResult, Question } from '../types';
import { gasService } from '../services/gasService';
import {
  downloadStudentResultPDF,
  downloadExamQuestionsPDF,
  downloadResultsRecapPDF,
  downloadExamGridPDF,
  downloadItemAnalysisReportPDF,
  exportItemMatrixToCSV,
  exportResultsToCSV,
  getItemScore,
} from '../utils/pdfGenerator';
import { QuestionEditorModal } from './QuestionEditorModal';
import { GasGuideModal } from './GasGuideModal';
import { GasSettingsModal } from './GasSettingsModal';
import { StudentDetailModal } from './StudentDetailModal';
import {
  Users,
  CheckCircle2,
  XCircle,
  TrendingUp,
  RefreshCw,
  Search,
  Filter,
  Download,
  FileDown,
  Trash2,
  Eye,
  FileSpreadsheet,
  Edit3,
  BookOpen,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Code2,
  ToggleLeft,
  ToggleRight,
  Check,
  Award,
  Settings,
  Grid,
  FileText,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface Stage4TeacherPanelProps {
  questions: Question[];
  onUpdateQuestion: (updated: Question) => void;
  allowReview: boolean;
  onToggleAllowReview: (val: boolean) => void;
  onResetDefaultQuestions?: () => void;
}

export const Stage4TeacherPanel: React.FC<Stage4TeacherPanelProps> = ({
  questions,
  onUpdateQuestion,
  allowReview,
  onToggleAllowReview,
  onResetDefaultQuestions,
}) => {
  // State data hasil siswa
  const [results, setResults] = useState<ExamResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // 3 Tab di Panel Guru: matriks (analisis butir), rekap (nilai), soal (bank soal & kisi-kisi)
  const [activeTab, setActiveTab] = useState<'matriks' | 'rekap' | 'soal'>('matriks');

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');

  // Sorting di Rekap Nilai
  const [sortField, setSortField] = useState<'timestamp' | 'nama' | 'nilai' | 'noAbsen'>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Pagination di Rekap Nilai
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter Bank Soal
  const [filterBankTP, setFilterBankTP] = useState('Semua');
  const [filterBankLevel, setFilterBankLevel] = useState('Semua');
  const [filterBankKesukaran, setFilterBankKesukaran] = useState('Semua');

  // Modal states
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<ExamResult | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showGasGuide, setShowGasGuide] = useState(false);
  const [showGasSettings, setShowGasSettings] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<ExamResult | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Ambil data hasil tes
  const loadDataFromGAS = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const data = await gasService.fetchExamResults();
      setResults(data);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
      const localData = gasService.getLocalExamResults();
      setResults(localData);
      setApiError('Data hasil tes dimuat dari memori lokal perangkat ini.');
    }
  };

  useEffect(() => {
    loadDataFromGAS();
  }, []);

  // Hapus Data Siswa
  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    setIsDeleting(true);
    try {
      await gasService.deleteExamResult(studentToDelete.timestamp, studentToDelete.nama);
      setResults((prev) =>
        prev.filter(
          (r) =>
            r.id !== studentToDelete.id &&
            !(r.timestamp === studentToDelete.timestamp && r.nama === studentToDelete.nama)
        )
      );
      setIsDeleting(false);
      setStudentToDelete(null);
    } catch {
      setResults((prev) => prev.filter((r) => r.id !== studentToDelete.id));
      setIsDeleting(false);
      setStudentToDelete(null);
    }
  };

  // Ringkasan Statistik Siswa
  const stats = useMemo(() => {
    const total = results.length;
    if (total === 0) {
      return { total: 0, lulus: 0, belumLulus: 0, rataRata: 0, persenLulus: 0 };
    }
    const lulus = results.filter((r) => (r.nilai || 0) >= CONFIG.KKTP).length;
    const belumLulus = total - lulus;
    const sumNilai = results.reduce((acc, curr) => acc + (Number(curr.nilai) || 0), 0);
    const rataRata = Math.round((sumNilai / total) * 10) / 10;
    const persenLulus = Math.round((lulus / total) * 100);
    return { total, lulus, belumLulus, rataRata, persenLulus };
  }, [results]);

  // Perhitungan Otomatis Kartu Ringkasan Kisi-Kisi Soal (Summary Cards)
  const questionDistributions = useMemo(() => {
    const total = questions.length;

    // 1. Distribusi Bentuk Soal
    const pgCount = questions.filter((q) => q.type === 'pg').length;
    const pgkKategoriCount = questions.filter((q) => q.type === 'pgk_kategori').length;

    // 2. Distribusi Elemen / Capaian Pembelajaran
    let tp1Count = 0;
    let tp2Count = 0;
    let tp3Count = 0;

    questions.forEach((q) => {
      if (q.competency.includes('sejarah') || q.competency.includes('runtut')) {
        tp2Count++;
      } else if (q.competency.includes('manfaat') || q.competency.includes('sehari')) {
        tp3Count++;
      } else {
        tp1Count++;
      }
    });

    // 3. Distribusi Level Kognitif
    const l1Count = questions.filter((q) => q.level === 'L1').length;
    const l2Count = questions.filter((q) => q.level === 'L2').length;
    const l3Count = questions.filter((q) => q.level === 'L3').length;

    // 4. Distribusi Tingkat Kesukaran
    const mudahCount = questions.filter((q) => q.difficulty === 'Mudah').length;
    const sedangCount = questions.filter((q) => q.difficulty === 'Sedang').length;
    const sukarCount = questions.filter((q) => q.difficulty === 'Sukar').length;

    return {
      total,
      pgCount,
      pgkKategoriCount,
      tp1Count,
      tp2Count,
      tp3Count,
      l1Count,
      l2Count,
      l3Count,
      mudahCount,
      sedangCount,
      sukarCount,
    };
  }, [questions]);

  // Statistik per Butir Soal untuk Baris Bawah Matriks (1 s.d. 40)
  const itemAnalysisStats = useMemo(() => {
    const totalSiswa = results.length;

    return questions.map((q, idx) => {
      let sumScore = 0;
      results.forEach((r) => {
        sumScore += getItemScore(r, q, idx);
      });

      const percent = totalSiswa > 0 ? Math.round((sumScore / totalSiswa) * 100) : 0;
      let label: 'Mudah' | 'Sedang' | 'Sukar' = 'Sedang';
      if (percent > 70) label = 'Mudah';
      else if (percent < 30) label = 'Sukar';

      return {
        questionId: q.id,
        sumCorrect: Math.round(sumScore * 10) / 10,
        percent,
        empirisDifficulty: label,
      };
    });
  }, [results, questions]);

  // Filter & Sort Data Siswa
  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...results];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((r) => r.nama.toLowerCase().includes(q));
    }

    if (filterStatus !== 'Semua') {
      filtered = filtered.filter((r) => {
        const isTuntas = (r.nilai || 0) >= CONFIG.KKTP;
        return filterStatus === 'Tuntas' ? isTuntas : !isTuntas;
      });
    }

    filtered.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'nilai' || sortField === 'noAbsen') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      } else {
        valA = String(valA || '').toLowerCase();
        valB = String(valB || '').toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [results, searchQuery, filterStatus, sortField, sortDirection]);

  // Pagination Slice
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedResults.length / itemsPerPage));
  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedResults.slice(start, start + itemsPerPage);
  }, [filteredAndSortedResults, currentPage, itemsPerPage]);

  const toggleSort = (field: 'timestamp' | 'nama' | 'nilai' | 'noAbsen') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filtered Bank Soal
  const filteredBankQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (filterBankTP !== 'Semua') {
        if (filterBankTP === 'TP1' && !q.competency.includes('teknologi digital')) return false;
        if (filterBankTP === 'TP2' && !q.competency.includes('sejarah')) return false;
        if (filterBankTP === 'TP3' && !q.competency.includes('manfaat')) return false;
      }
      if (filterBankLevel !== 'Semua' && q.level !== filterBankLevel) return false;
      if (filterBankKesukaran !== 'Semua' && q.difficulty !== filterBankKesukaran) return false;
      return true;
    });
  }, [questions, filterBankTP, filterBankLevel, filterBankKesukaran]);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                Panel Guru Kelas {CONFIG.KELAS}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {CONFIG.SEKOLAH} • {CONFIG.MATA_PELAJARAN} ({CONFIG.MATERI})
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                KKTP: {CONFIG.KKTP}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Dashboard Evaluasi &amp; Analisis Butir Soal Tes Sumatif
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Guru Pengampu: <strong className="text-slate-800">{CONFIG.GURU}</strong> (NIPPPK. {CONFIG.NIP_GURU}) | Kepala Sekolah: <strong className="text-slate-800">{CONFIG.KEPALA_SEKOLAH}</strong>
            </p>
          </div>

          {/* Tombol Aksi Cepat Atas */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowGasSettings(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200 cursor-pointer"
              title="Pengaturan URL Google Spreadsheet"
            >
              <Settings className="w-3.5 h-3.5 text-blue-600" />
              <span>URL Spreadsheet</span>
            </button>

            <button
              onClick={() => setShowGasGuide(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-300 cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Panduan GAS</span>
            </button>

            <button
              onClick={loadDataFromGAS}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>REFRESH DATA</span>
            </button>
          </div>
        </div>

        {/* Toggle Otorisasi Pembahasan Soal untuk Siswa */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Akses Kunci &amp; Pembahasan Siswa:</span>
            <span className="text-slate-500">
              {allowReview
                ? 'Siswa dapat melihat kunci jawaban dan pembahasan setelah submit.'
                : 'Kunci jawaban dan pembahasan disembunyikan dari siswa.'}
            </span>
          </div>
          <button
            onClick={() => onToggleAllowReview(!allowReview)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              allowReview
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200'
            }`}
          >
            {allowReview ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4" />}
            <span>{allowReview ? 'Pembahasan Aktif' : 'Pembahasan Nonaktif'}</span>
          </button>
        </div>
      </div>

      {/* 4 Kartu Statistik Siswa */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block font-medium">Total Peserta</span>
            <span className="text-2xl font-black text-slate-900 block">{stats.total}</span>
            <span className="text-[11px] text-slate-400">Siswa submit</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-emerald-700 block font-bold">Jumlah Tuntas</span>
            <span className="text-2xl font-black text-emerald-900 block">{stats.lulus}</span>
            <span className="text-[11px] text-emerald-600 font-semibold">
              Nilai ≥ {CONFIG.KKTP} ({stats.persenLulus}%)
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-amber-700 block font-bold">Jumlah Remedial</span>
            <span className="text-2xl font-black text-amber-900 block">{stats.belumLulus}</span>
            <span className="text-[11px] text-amber-600 font-semibold">Perlu Bimbingan</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-indigo-700 block font-bold">Rata-Rata Nilai</span>
            <span className="text-2xl font-black text-indigo-900 block">{stats.rataRata}</span>
            <span className="text-[11px] text-slate-400">Skala 0 - 100</span>
          </div>
        </div>
      </div>

      {/* Navigasi 3 Tab Panel Guru */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-3xl px-6 pt-3 gap-6 text-xs sm:text-sm font-bold overflow-x-auto">
        {/* TAB 1: ANALISIS BUTIR SOAL (MATRIKS RESPON SISWA) */}
        <button
          onClick={() => setActiveTab('matriks')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'matriks'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Analisis Butir Soal (Matriks Respon)</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-extrabold">
            40 Butir
          </span>
        </button>

        {/* TAB 2: REKAP DATA NILAI SISWA */}
        <button
          onClick={() => setActiveTab('rekap')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'rekap'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Rekap Data Nilai Siswa</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-extrabold">
            {results.length} Siswa
          </span>
        </button>

        {/* TAB 3: BANK SOAL & KISI-KISI */}
        <button
          onClick={() => setActiveTab('soal')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'soal'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Bank Soal &amp; Kisi-Kisi Otomatis</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-extrabold">
            Ringkasan Distribusi
          </span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: ANALISIS BUTIR SOAL (MATRIKS RESPON SISWA)             */}
      {/* ============================================================== */}
      {activeTab === 'matriks' && (
        <div className="bg-white rounded-b-3xl p-6 shadow-xs border border-t-0 border-slate-200 space-y-6">
          {/* Header Aksi Tab Matriks */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Grid className="w-5 h-5 text-blue-600" />
                Matriks Respon Siswa &amp; Analisis Butir Soal (Nomor 1 s.d. 40)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Baris = Nama Siswa • Kolom = Nomor Butir Soal • Hijau: Benar (1.0), Kuning: Parsial (0.33/0.67), Merah: Salah (0.0). Klik nama siswa untuk detail remedial.
              </p>
            </div>

            {/* Tombol Ekspor Matriks */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => exportItemMatrixToCSV(results, questions)}
                disabled={results.length === 0}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-300 disabled:opacity-50 cursor-pointer shadow-2xs"
                title="Ekspor seluruh matriks butir soal 1..40 ke file Excel / CSV"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <span>Ekspor Matriks (Excel / CSV)</span>
              </button>

              <button
                onClick={() => downloadItemAnalysisReportPDF(results, questions)}
                disabled={results.length === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                title="Unduh Laporan Analisis Butir Soal & Daya Serap Siswa (PDF Resmi Kedinasan)"
              >
                <FileDown className="w-4 h-4" />
                <span>Unduh PDF Laporan Analisis Butir</span>
              </button>
            </div>
          </div>

          {/* Legenda Warna Matriks */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Petunjuk Status:
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">
                1
              </span>
              <span>Benar (Skor 1.00)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-amber-400 text-amber-950 flex items-center justify-center text-[10px] font-black">
                P
              </span>
              <span>Benar Sebagian (PGK Kategori)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-rose-500 text-white flex items-center justify-center text-[10px] font-black">
                0
              </span>
              <span>Salah (Skor 0.00)</span>
            </div>
            <div className="ml-auto text-slate-500 text-[11px] font-medium hidden md:block">
              *Tingkat Kesukaran Empiris di baris bawah: Mudah (&gt;70%), Sedang (30-70%), Sukar (&lt;30%)
            </div>
          </div>

          {/* TABEL MATRIKS INTERAKTIF HORIZONTAL SCROLL */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-2xs max-h-[600px] relative">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-900 text-white sticky top-0 z-20 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-3 py-3 w-10 text-center sticky left-0 bg-slate-900 z-30 shadow-r">
                    No
                  </th>
                  <th className="px-3 py-3 w-12 text-center sticky left-10 bg-slate-900 z-30 shadow-r">
                    Absen
                  </th>
                  <th className="px-4 py-3 min-w-[190px] sticky left-22 bg-slate-900 z-30 shadow-r">
                    Nama Siswa (Klik untuk Detail)
                  </th>

                  {/* Kolom Butir Soal 1 s.d. 40 */}
                  {questions.map((q) => (
                    <th
                      key={q.id}
                      className="px-1.5 py-3 w-8 text-center border-l border-slate-800 font-bold cursor-pointer hover:bg-slate-800 transition-colors"
                      title={`Soal #${q.id} [${q.type === 'pg' ? 'PG' : 'PGK Kategori'}] - Level ${q.level || 'L2'} (${q.topic})`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-[11px] text-blue-200">{q.id}</span>
                        <span className="text-[8px] font-normal text-slate-400">
                          {q.type === 'pg' ? 'PG' : 'Ktg'}
                        </span>
                      </div>
                    </th>
                  ))}

                  {/* Kolom Rekapitulasi Kanan */}
                  <th className="px-3 py-3 text-center bg-slate-800 border-l border-slate-700 min-w-[70px]">
                    Total Skor
                  </th>
                  <th className="px-3 py-3 text-center bg-slate-800 border-l border-slate-700 min-w-[70px]">
                    Nilai Akhir
                  </th>
                  <th className="px-3 py-3 text-center bg-slate-800 border-l border-slate-700 min-w-[95px]">
                    Status (KKTP 60)
                  </th>
                  <th className="px-3 py-3 text-center bg-slate-800 border-l border-slate-700 min-w-[100px]">
                    Durasi
                  </th>
                  <th className="px-3 py-3 text-center bg-slate-800 border-l border-slate-700 min-w-[75px]">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white font-medium text-slate-800">
                {results.length === 0 ? (
                  <tr>
                    <td
                      colSpan={questions.length + 8}
                      className="text-center py-12 text-slate-400 italic"
                    >
                      Belum ada respon siswa yang tersimpan.
                    </td>
                  </tr>
                ) : (
                  results.map((r, idx) => {
                    const isTuntas = (r.nilai || 0) >= CONFIG.KKTP;
                    let studentTotalEarned = 0;

                    return (
                      <tr
                        key={r.id || idx}
                        className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                        onClick={() => setSelectedStudentForDetail(r)}
                      >
                        <td className="px-3 py-2.5 text-center font-bold text-slate-500 sticky left-0 bg-white group-hover:bg-blue-50/50 z-10 shadow-r">
                          {idx + 1}
                        </td>
                        <td className="px-3 py-2.5 text-center font-bold text-slate-700 sticky left-10 bg-white group-hover:bg-blue-50/50 z-10 shadow-r">
                          {r.noAbsen}
                        </td>
                        <td className="px-4 py-2.5 font-bold text-slate-900 truncate max-w-[200px] sticky left-22 bg-white group-hover:bg-blue-50/50 z-10 shadow-r flex items-center justify-between">
                          <span className="truncate">{r.nama}</span>
                          <Eye className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity ml-1.5 shrink-0" />
                        </td>

                        {/* Sel Respon Soal 1 s.d. 40 */}
                        {questions.map((q, qIdx) => {
                          const score = getItemScore(r, q, qIdx);
                          studentTotalEarned += score;

                          let bgClass = 'bg-rose-50 text-rose-700 hover:bg-rose-100';
                          let cellText = '0';

                          if (score === 1) {
                            bgClass = 'bg-emerald-50 text-emerald-800 font-bold hover:bg-emerald-100';
                            cellText = '1';
                          } else if (score > 0 && score < 1) {
                            bgClass = 'bg-amber-50 text-amber-900 font-bold hover:bg-amber-100';
                            cellText = score === 0.67 ? '⅔' : score === 0.33 ? '⅓' : 'P';
                          }

                          return (
                            <td
                              key={q.id}
                              className={`p-1 text-center border-l border-slate-100 transition-colors ${bgClass}`}
                              title={`${r.nama} - Soal #${q.id} (${q.topic}): Skor ${score}`}
                            >
                              <span className="inline-block w-6 h-6 leading-6 rounded-md text-[11px]">
                                {cellText}
                              </span>
                            </td>
                          );
                        })}

                        {/* Rekap Nilai Siswa */}
                        <td className="px-3 py-2.5 text-center font-bold text-slate-700 bg-slate-50/60 border-l border-slate-200">
                          {studentTotalEarned.toFixed(1)}
                        </td>
                        <td className="px-3 py-2.5 text-center font-black text-sm text-slate-900 bg-slate-50/60 border-l border-slate-200">
                          <span className={isTuntas ? 'text-emerald-700' : 'text-amber-700'}>
                            {r.nilai}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-center border-l border-slate-200 bg-slate-50/60">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] inline-block ${
                              isTuntas
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {isTuntas ? 'Tuntas' : 'Remedial'}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-center text-slate-600 text-[11px] border-l border-slate-200 bg-slate-50/60">
                          {r.durasiPengerjaan || '25 Menit'}
                        </td>
                        <td className="px-3 py-2.5 text-center border-l border-slate-200 bg-slate-50/60">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStudentForDetail(r);
                            }}
                            className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[10px] rounded-lg border border-blue-200 transition-colors"
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

              {/* BARIS STATISTIK DI BAGIAN BAWAH PER BUTIR SOAL */}
              <tfoot className="bg-slate-100 text-slate-800 font-bold border-t-2 border-slate-300 text-[11px] sticky bottom-0 z-20">
                {/* Baris 1: Jumlah Siswa Menjawab Benar */}
                <tr className="bg-slate-100 border-b border-slate-200">
                  <td
                    colSpan={3}
                    className="px-4 py-2 font-black text-slate-800 text-right sticky left-0 bg-slate-100 z-30 shadow-r"
                  >
                    Jumlah Siswa Menjawab Benar:
                  </td>
                  {itemAnalysisStats.map((item) => (
                    <td
                      key={`correct-${item.questionId}`}
                      className="px-1 py-2 text-center border-l border-slate-200 text-slate-900 font-black"
                    >
                      {item.sumCorrect}
                    </td>
                  ))}
                  <td colSpan={5} className="bg-slate-100 border-l border-slate-200" />
                </tr>

                {/* Baris 2: Persentase Ketercapaian Butir (%) */}
                <tr className="bg-blue-50/70 border-b border-blue-200">
                  <td
                    colSpan={3}
                    className="px-4 py-2 font-black text-blue-900 text-right sticky left-0 bg-blue-50 z-30 shadow-r"
                  >
                    Persentase Ketercapaian (%):
                  </td>
                  {itemAnalysisStats.map((item) => (
                    <td
                      key={`percent-${item.questionId}`}
                      className="px-1 py-2 text-center border-l border-blue-200 text-blue-900 font-black text-[10px]"
                    >
                      {item.percent}%
                    </td>
                  ))}
                  <td colSpan={5} className="bg-blue-50 border-l border-blue-200" />
                </tr>

                {/* Baris 3: Klasifikasi Empiris Tingkat Kesukaran */}
                <tr className="bg-slate-100">
                  <td
                    colSpan={3}
                    className="px-4 py-2.5 font-black text-slate-800 text-right sticky left-0 bg-slate-100 z-30 shadow-r"
                  >
                    Tingkat Kesukaran Empiris:
                  </td>
                  {itemAnalysisStats.map((item) => {
                    let badgeClass = 'bg-blue-100 text-blue-800';
                    let shortLabel = 'Sdg';
                    if (item.empirisDifficulty === 'Mudah') {
                      badgeClass = 'bg-emerald-100 text-emerald-800';
                      shortLabel = 'Mdh';
                    } else if (item.empirisDifficulty === 'Sukar') {
                      badgeClass = 'bg-rose-100 text-rose-800';
                      shortLabel = 'Skr';
                    }

                    return (
                      <td
                        key={`diff-${item.questionId}`}
                        className="p-1 text-center border-l border-slate-200"
                      >
                        <span
                          className={`inline-block px-1 py-0.5 rounded font-extrabold text-[9px] ${badgeClass}`}
                          title={`Soal #${item.questionId}: ${item.empirisDifficulty} (${item.percent}%)`}
                        >
                          {shortLabel}
                        </span>
                      </td>
                    );
                  })}
                  <td colSpan={5} className="bg-slate-100 border-l border-slate-200" />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: REKAP DATA NILAI SISWA                                 */}
      {/* ============================================================== */}
      {activeTab === 'rekap' && (
        <div className="bg-white rounded-b-3xl p-6 shadow-xs border border-t-0 border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Tabel Rekapitulasi Data Nilai Peserta Didik
              </h3>
              <p className="text-xs text-slate-500">
                Tersinkronisasi otomatis dengan Google Spreadsheet &amp; memori lokal perangkat.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadResultsRecapPDF(filteredAndSortedResults)}
                disabled={results.length === 0}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Download Rekap (PDF)</span>
              </button>

              <button
                onClick={() => exportResultsToCSV(results)}
                disabled={results.length === 0}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-300 disabled:opacity-50 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Download Rekap (CSV)</span>
              </button>
            </div>
          </div>

          {/* Baris Pencarian & Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari nama siswa..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
              >
                <option value="Semua">Semua Status Ketercapaian</option>
                <option value="Tuntas">Tuntas (≥ {CONFIG.KKTP})</option>
                <option value="Remedial">Remedial (&lt; {CONFIG.KKTP})</option>
              </select>
            </div>
          </div>

          {/* Tabel Nilai */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-center w-12">No</th>
                  <th
                    className="px-4 py-3 text-center w-20 cursor-pointer hover:bg-slate-100"
                    onClick={() => toggleSort('noAbsen')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Absen</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 cursor-pointer hover:bg-slate-100"
                    onClick={() => toggleSort('nama')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Nama Siswa</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center w-16">Kelas</th>
                  <th className="px-4 py-3 text-center w-16">Benar</th>
                  <th className="px-4 py-3 text-center w-16">Salah</th>
                  <th
                    className="px-4 py-3 text-center w-20 cursor-pointer hover:bg-slate-100"
                    onClick={() => toggleSort('nilai')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Nilai</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center w-24">Status</th>
                  <th className="px-4 py-3 text-center w-28">Durasi</th>
                  <th className="px-4 py-3 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white font-medium text-slate-800">
                {paginatedResults.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-8 text-slate-400 italic">
                      Tidak ada data siswa yang cocok dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  paginatedResults.map((r, idx) => {
                    const rowNumber = (currentPage - 1) * itemsPerPage + idx + 1;
                    const isTuntas = (r.nilai || 0) >= CONFIG.KKTP;

                    return (
                      <tr key={r.id || idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-center font-bold text-slate-500">
                          {rowNumber}
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-slate-700">
                          {r.noAbsen}
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-900">{r.nama}</td>
                        <td className="px-4 py-3 text-center">{r.kelas || CONFIG.KELAS}</td>
                        <td className="px-4 py-3 text-center text-emerald-700 font-bold">
                          {r.benar}
                        </td>
                        <td className="px-4 py-3 text-center text-rose-700 font-bold">
                          {r.salah}
                        </td>
                        <td className="px-4 py-3 text-center font-black text-sm">
                          <span className={isTuntas ? 'text-emerald-700' : 'text-amber-700'}>
                            {r.nilai}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              isTuntas
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isTuntas ? 'Tuntas' : 'Remedial'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-slate-600 text-[11px]">
                          {r.durasiPengerjaan || '25 Menit'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setSelectedStudentForDetail(r)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Lihat Detail Analisis & Jawaban Siswa"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => downloadStudentResultPDF(r)}
                              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Download Lembar Hasil (PDF)"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setStudentToDelete(r)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Data Siswa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <span>
              Menampilkan {paginatedResults.length} dari {filteredAndSortedResults.length} data siswa
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: BANK SOAL & KISI-KISI OTOMATIS (SUMMARY CARDS)          */}
      {/* ============================================================== */}
      {activeTab === 'soal' && (
        <div className="bg-white rounded-b-3xl p-6 shadow-xs border border-t-0 border-slate-200 space-y-6">
          {/* Header & Tombol Kisi-Kisi */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Bank Soal, Distribusi Kompetensi &amp; Kisi-Kisi Soal
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Total {questions.length} butir soal ({questionDistributions.pgCount} Pilihan Ganda &amp; {questionDistributions.pgkKategoriCount} PGK Kategori)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Tombol Unduh PDF Kisi-Kisi Soal */}
              <button
                id="btn-download-kisi-kisi-pdf"
                onClick={() => downloadExamGridPDF(questions)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs cursor-pointer"
                title="Unduh Dokumen Kisi-Kisi Soal Resmi Kedinasan Lengkap dengan Kop dan Tanda Tangan"
              >
                <FileText className="w-4 h-4" />
                <span>Unduh PDF Kisi-Kisi Soal</span>
              </button>

              {/* Tombol Unduh Naskah Soal */}
              <button
                onClick={() => downloadExamQuestionsPDF(questions)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-300 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Unduh Naskah Soal (PDF)</span>
              </button>

              {/* Tombol Reset ke Default */}
              {onResetDefaultQuestions && (
                <button
                  onClick={() => {
                    if (confirm('Apakah Anda yakin ingin mereset seluruh bank soal ke 40 butir standar Koding?')) {
                      onResetDefaultQuestions();
                    }
                  }}
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors border border-rose-200 cursor-pointer"
                  title="Kembalikan seluruh soal ke 40 butir standar kurikulum"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Soal Standar</span>
                </button>
              )}
            </div>
          </div>

          {/* 4 KARTU RINGKASAN DISTRIBUSI OTOMATIS (SUMMARY CARDS) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Distribusi Elemen / Kompetensi */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-blue-900">
                  Distribusi Kompetensi
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-200 text-blue-950">
                  3 TP
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-[11px] truncate max-w-[150px]" title="TP 1: Menginterpretasikan teknologi digital">
                    TP-1 (Interpretasi):
                  </span>
                  <span className="font-bold text-blue-900">
                    {questionDistributions.tp1Count} Soal ({Math.round((questionDistributions.tp1Count / questions.length) * 100)}%)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-[11px] truncate max-w-[150px]" title="TP 2: Menjelaskan sejarah teknologi digital">
                    TP-2 (Sejarah Digital):
                  </span>
                  <span className="font-bold text-blue-900">
                    {questionDistributions.tp2Count} Soal ({Math.round((questionDistributions.tp2Count / questions.length) * 100)}%)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-[11px] truncate max-w-[150px]" title="TP 3: Menganalisis manfaat digital">
                    TP-3 (Manfaat Digital):
                  </span>
                  <span className="font-bold text-blue-900">
                    {questionDistributions.tp3Count} Soal ({Math.round((questionDistributions.tp3Count / questions.length) * 100)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Distribusi Level Kognitif */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-900">
                  Distribusi Level Kognitif
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-200 text-indigo-950">
                  L1, L2, L3
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-[11px]">Level 1 (Mengingat):</span>
                  <span className="font-bold text-indigo-900">
                    {questionDistributions.l1Count} Butir ({Math.round((questionDistributions.l1Count / questions.length) * 100)}%)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-[11px]">Level 2 (Penerapan):</span>
                  <span className="font-bold text-indigo-900">
                    {questionDistributions.l2Count} Butir ({Math.round((questionDistributions.l2Count / questions.length) * 100)}%)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-[11px]">Level 3 (Penalaran):</span>
                  <span className="font-bold text-indigo-900">
                    {questionDistributions.l3Count} Butir ({Math.round((questionDistributions.l3Count / questions.length) * 100)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Distribusi Tingkat Kesukaran */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                  Tingkat Kesukaran
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-950">
                  Proporsional
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-[11px]">Mudah:</span>
                  <span className="font-bold text-emerald-800">
                    {questionDistributions.mudahCount} Butir ({Math.round((questionDistributions.mudahCount / questions.length) * 100)}%)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-[11px]">Sedang:</span>
                  <span className="font-bold text-blue-800">
                    {questionDistributions.sedangCount} Butir ({Math.round((questionDistributions.sedangCount / questions.length) * 100)}%)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-[11px]">Sukar:</span>
                  <span className="font-bold text-rose-800">
                    {questionDistributions.sukarCount} Butir ({Math.round((questionDistributions.sukarCount / questions.length) * 100)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Distribusi Bentuk Soal */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-900">
                  Bentuk Soal
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-950">
                  40 Butir
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-[11px]">Pilihan Ganda (PG):</span>
                  <span className="font-bold text-emerald-900">
                    {questionDistributions.pgCount} Butir (No. 1-35)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-[11px]">PGK Kategori (B/S):</span>
                  <span className="font-bold text-emerald-900">
                    {questionDistributions.pgkKategoriCount} Butir (No. 36-40)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-[11px]">Deskripsi per Butir:</span>
                  <span className="font-bold text-emerald-900">3 Pernyataan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bank Soal */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Filter Capaian (TP)
              </label>
              <select
                value={filterBankTP}
                onChange={(e) => setFilterBankTP(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
              >
                <option value="Semua">Semua Capaian (TP)</option>
                <option value="TP1">TP 1: Menginterpretasikan Teknologi Digital</option>
                <option value="TP2">TP 2: Menjelaskan Sejarah Teknologi Digital</option>
                <option value="TP3">TP 3: Menganalisis Manfaat Digital</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Filter Level Kognitif
              </label>
              <select
                value={filterBankLevel}
                onChange={(e) => setFilterBankLevel(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
              >
                <option value="Semua">Semua Level (L1, L2, L3)</option>
                <option value="L1">Level 1 (Mengingat/C1-C2)</option>
                <option value="L2">Level 2 (Aplikasi/C3)</option>
                <option value="L3">Level 3 (Penalaran/C4-C6)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Filter Tingkat Kesukaran
              </label>
              <select
                value={filterBankKesukaran}
                onChange={(e) => setFilterBankKesukaran(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
              >
                <option value="Semua">Semua Tingkat Kesukaran</option>
                <option value="Mudah">Mudah</option>
                <option value="Sedang">Sedang</option>
                <option value="Sukar">Sukar</option>
              </select>
            </div>
          </div>

          {/* Daftar Butir Soal */}
          <div className="space-y-4 pt-2">
            {filteredBankQuestions.map((q) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-3"
              >
                {/* Baris Meta Soal */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-sm px-2.5 py-1 rounded-lg bg-blue-700 text-white">
                      Soal No. {q.id}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-200 text-slate-800">
                      {q.type === 'pg' ? 'Pilihan Ganda' : 'PGK Kategori (3 Pernyataan)'}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200">
                      Level {q.level || 'L2'}
                    </span>
                    <span className="text-xs font-medium text-slate-600">{q.topic}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        q.difficulty === 'Mudah'
                          ? 'bg-emerald-100 text-emerald-800'
                          : q.difficulty === 'Sedang'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                    <button
                      onClick={() => setEditingQuestion(q)}
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Butir</span>
                    </button>
                  </div>
                </div>

                {/* Indikator Kisi-Kisi */}
                <div className="text-[11px] text-slate-600 font-medium">
                  <strong>Indikator:</strong> {q.indicator || q.topic} • <strong>Kompetensi:</strong> {q.competency}
                </div>

                {/* Pratinjau Ilustrasi Gambar Soal */}
                {q.image && (
                  <div className="p-3 bg-white border border-slate-200 rounded-xl overflow-hidden flex justify-center max-w-sm">
                    {q.image.startsWith('<svg') ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: q.image }}
                        className="w-full flex justify-center scale-90"
                      />
                    ) : (
                      <img
                        src={q.image}
                        alt={`Ilustrasi Soal #${q.id}`}
                        className="max-h-36 object-contain"
                      />
                    )}
                  </div>
                )}

                <p className="text-xs sm:text-sm text-slate-900 font-medium whitespace-pre-line leading-relaxed">
                  {q.text}
                </p>

                {/* Opsi Jawaban PG */}
                {q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt) => {
                      const isCorrect = q.correctAnswer === opt.id;
                      return (
                        <div
                          key={opt.id}
                          className={`p-2 rounded-lg border flex items-start gap-2 ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="w-5 font-bold">{opt.id}.</span>
                          <span className="flex-1">{opt.text}</span>
                          {isCorrect && (
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Pernyataan Kategori (3 Benar/Salah) */}
                {q.statements && (
                  <div className="space-y-1.5 text-xs">
                    {q.statements.map((st, sIdx) => (
                      <div
                        key={st.id}
                        className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between"
                      >
                        <span className="font-medium text-slate-800">
                          <strong className="mr-1 text-blue-700">{sIdx + 1}.</strong>
                          {st.text}
                        </span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                            st.correctAnswer
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {st.correctAnswer ? 'BENAR' : 'SALAH'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pembahasan & Kunci */}
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-slate-700">
                  <span className="font-bold text-blue-900 block mb-0.5">
                    Kunci Jawaban &amp; Pembahasan:
                  </span>
                  <p className="whitespace-pre-line leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Detail Hasil Siswa */}
      <StudentDetailModal
        result={selectedStudentForDetail}
        questions={questions}
        isOpen={Boolean(selectedStudentForDetail)}
        onClose={() => setSelectedStudentForDetail(null)}
      />

      {/* Modal Edit Soal */}
      <QuestionEditorModal
        question={editingQuestion}
        isOpen={Boolean(editingQuestion)}
        onClose={() => setEditingQuestion(null)}
        onSave={(updated) => {
          onUpdateQuestion(updated);
          setEditingQuestion(null);
        }}
      />

      {/* Modal Panduan Skrip Google Apps Script */}
      <GasGuideModal isOpen={showGasGuide} onClose={() => setShowGasGuide(false)} />

      {/* Modal Pengaturan URL Google Apps Script */}
      <GasSettingsModal
        isOpen={showGasSettings}
        onClose={() => setShowGasSettings(false)}
        onOpenGasGuide={() => setShowGasGuide(true)}
        onDataSynced={loadDataFromGAS}
      />

      {/* Modal Konfirmasi Hapus Data Siswa */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Hapus Data Siswa</h3>
                <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 mb-5">
              Apakah Anda yakin ingin menghapus data ujian atas nama{' '}
              <strong className="text-slate-900 font-bold">{studentToDelete.nama}</strong> (Nomor
              Absen {studentToDelete.noAbsen})?
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Ya, Hapus Data</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
