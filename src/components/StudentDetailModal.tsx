import React, { useState, useMemo } from 'react';
import { CONFIG } from '../config';
import { ExamResult, Question } from '../types';
import { downloadStudentResultPDF, getItemScore } from '../utils/pdfGenerator';
import {
  X,
  Download,
  User,
  Calendar,
  Hash,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface StudentDetailModalProps {
  result: ExamResult | null;
  questions: Question[];
  isOpen: boolean;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  result,
  questions,
  isOpen,
  onClose,
}) => {
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);

  if (!isOpen || !result) return null;

  const isPass = (result.nilai || 0) >= CONFIG.KKTP;

  // Analisis Performa per Tujuan Pembelajaran (TP 1, TP 2, TP 3)
  const tpAnalysis = useMemo(() => {
    const map: Record<string, { total: number; earned: number; label: string }> = {
      TP1: {
        total: 0,
        earned: 0,
        label: 'Menginterpretasikan teknologi digital dengan benar',
      },
      TP2: {
        total: 0,
        earned: 0,
        label: 'Menjelaskan sejarah teknologi digital dengan runtut',
      },
      TP3: {
        total: 0,
        earned: 0,
        label: 'Menganalisis manfaat digital dalam kehidupan sehari-hari dengan tepat',
      },
    };

    const wrongQuestions: Array<{ q: Question; score: number }> = [];

    questions.forEach((q, idx) => {
      const score = getItemScore(result, q, idx);

      let tpKey = 'TP1';
      if (q.competency.includes('sejarah') || q.competency.includes('runtut')) {
        tpKey = 'TP2';
      } else if (q.competency.includes('manfaat') || q.competency.includes('sehari')) {
        tpKey = 'TP3';
      }

      map[tpKey].total += 1;
      map[tpKey].earned += score;

      if (score < 1) {
        wrongQuestions.push({ q, score });
      }
    });

    return { map, wrongQuestions };
  }, [result, questions]);

  const selectedQ = questions.find((q) => q.id === selectedQuestionId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Modal */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{result.nama}</h3>
                <span className="text-xs bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded-md">
                  Absen {result.noAbsen}
                </span>
                <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md">
                  Kelas {result.kelas || CONFIG.KELAS}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {CONFIG.SEKOLAH} • {CONFIG.MATA_PELAJARAN} ({CONFIG.MATERI})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Konten Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Kartu Ringkasan Hasil Ujian */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Nilai Akhir */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Nilai Akhir
              </span>
              <div className="my-1">
                <span
                  className={`text-3xl sm:text-4xl font-black ${
                    isPass ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {result.nilai}
                </span>
                <span className="text-xs text-slate-400 ml-1">/ 100</span>
              </div>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md inline-block text-center ${
                  isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {isPass ? 'TUNTAS (≥ KKTP 60)' : 'REMEDIAL (< KKTP 60)'}
              </span>
            </div>

            {/* Jawaban Benar */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between">
              <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Jawaban Benar
              </span>
              <div className="my-1">
                <span className="text-2xl sm:text-3xl font-black text-emerald-900">
                  {result.benar}
                </span>
                <span className="text-xs text-emerald-700 ml-1">dari {questions.length}</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold">
                Skor Penuh (1.00)
              </span>
            </div>

            {/* Jawaban Salah / Parsial */}
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col justify-between">
              <span className="text-[11px] font-bold text-rose-800 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" />
                Salah / Belum Sempurna
              </span>
              <div className="my-1">
                <span className="text-2xl sm:text-3xl font-black text-rose-900">
                  {result.salah}
                </span>
                <span className="text-xs text-rose-700 ml-1">soal</span>
              </div>
              <span className="text-[11px] text-rose-700 font-semibold">
                Perlu Evaluasi
              </span>
            </div>

            {/* Durasi & Waktu */}
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col justify-between">
              <span className="text-[11px] font-bold text-indigo-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Durasi Pengerjaan
              </span>
              <div className="my-1">
                <span className="text-base sm:text-lg font-bold text-indigo-900 block truncate">
                  {result.durasiPengerjaan || '25 Menit'}
                </span>
              </div>
              <span className="text-[11px] text-indigo-600 block truncate">
                {result.timestamp}
              </span>
            </div>
          </div>

          {/* 1. Matriks Respon Butir Soal Siswa (1 s.d. 40) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Peta Respon Butir Soal (Nomor 1 s.d. {questions.length})
              </h4>
              <span className="text-[11px] text-slate-500">
                Klik salah satu nomor untuk melihat detail soal &amp; indikator
              </span>
            </div>

            {/* Grid 40 Butir */}
            <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5 pt-1">
              {questions.map((q, idx) => {
                const score = getItemScore(result, q, idx);
                let colorClass = 'bg-rose-100 text-rose-800 border-rose-300';
                if (score === 1) {
                  colorClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                } else if (score > 0 && score < 1) {
                  colorClass = 'bg-amber-100 text-amber-800 border-amber-300';
                }

                const isSelected = selectedQuestionId === q.id;

                return (
                  <button
                    key={q.id}
                    onClick={() => setSelectedQuestionId(isSelected ? null : q.id)}
                    className={`h-8 rounded-lg text-xs font-bold border transition-all flex items-center justify-center cursor-pointer ${colorClass} ${
                      isSelected ? 'ring-2 ring-blue-600 shadow-sm scale-105' : 'hover:scale-102'
                    }`}
                    title={`Soal No. ${q.id} - Skor: ${score} (${q.topic})`}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>

            {/* Legenda Warna */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-300" />
                <span>Benar Penuh (1.0)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-amber-100 border border-amber-300" />
                <span>Benar Sebagian (0.33 / 0.67)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-rose-100 border border-rose-300" />
                <span>Salah (0.0)</span>
              </div>
            </div>

            {/* Pratinjau Butir Soal yang Diklik */}
            {selectedQ && (
              <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-blue-200 text-xs space-y-1.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between font-bold text-blue-900">
                  <span>
                    Soal No. {selectedQ.id} [{selectedQ.type === 'pg' ? 'Pilihan Ganda' : 'PGK Kategori'}] - Level {selectedQ.level || 'L2'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Skor Siswa: {getItemScore(result, selectedQ, selectedQ.id - 1)}
                  </span>
                </div>
                <p className="text-slate-700 font-medium whitespace-pre-line">{selectedQ.text}</p>
                <p className="text-slate-500 text-[11px]">
                  <strong>Indikator:</strong> {selectedQ.indicator || selectedQ.topic}
                </p>
                <div className="p-2 rounded bg-white border border-slate-200 text-slate-600 text-[11px]">
                  <span className="font-bold text-slate-800">Kunci &amp; Pembahasan: </span>
                  {selectedQ.explanation}
                </div>
              </div>
            )}
          </div>

          {/* 2. Analisis Capaian per Tujuan Pembelajaran (TP 1, TP 2, TP 3) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Tingkat Penguasaan per Capaian / Tujuan Pembelajaran
            </h4>

            <div className="space-y-3">
              {Object.entries(tpAnalysis.map).map(([key, data]) => {
                const percent = data.total > 0 ? Math.round((data.earned / data.total) * 100) : 0;
                const isTpTuntas = percent >= CONFIG.KKTP;

                return (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-800">
                        <strong className="text-blue-700 mr-1.5">[{key}]</strong>
                        {data.label}
                      </span>
                      <span className={`font-bold ${isTpTuntas ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {data.earned.toFixed(1)}/{data.total} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isTpTuntas ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Daftar Kelemahan Indikator & Topik Materi */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Analisis Kelemahan Indikator Materi yang Belum Dikuasai
            </h4>

            {tpAnalysis.wrongQuestions.length === 0 ? (
              <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Luar biasa! Siswa ini menjawab seluruh 40 butir soal dengan tepat tanpa ada kesalahan indikator.
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-slate-600">
                  Berikut butir soal dan indikator spesifik yang perlu mendapatkan perhatian pembinaan:
                </p>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                  {tpAnalysis.wrongQuestions.map(({ q, score }) => (
                    <div key={q.id} className="p-3 bg-white flex items-start justify-between gap-3 hover:bg-slate-50">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-slate-900">Soal No. {q.id}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 font-semibold text-slate-600">
                            {q.topic}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">
                            Level {q.level || 'L2'}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px]">{q.indicator || q.text}</p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold shrink-0 ${
                          score > 0
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {score > 0 ? `Parsial (${score})` : 'Salah (0.0)'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. Rekomendasi Tindak Lanjut & Remedial Spesifik */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-blue-200 bg-blue-50/30 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Rekomendasi Tindak Lanjut Pedagogis Guru
            </h4>

            {isPass ? (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Program Pengayaan (Enrichment)</span>
                </div>
                <p className="leading-relaxed">
                  Peserta didik telah berhasil menguasai materi <strong>Perkembangan Teknologi Digital</strong> dengan mencapai nilai di atas kriteria KKTP ({result.nilai} ≥ 60).
                </p>
                <ul className="list-disc list-inside space-y-1 text-emerald-800 font-medium">
                  <li>Berikan tantangan koding visual tingkat lanjut pada platform Scratch (pembuatan game sederhana dengan sensor/variabel).</li>
                  <li>Tugaskan siswa menjadi <strong>Tutor Sebaya</strong> untuk mendampingi rekan kelas yang masih remedial.</li>
                  <li>Ajak mengeksplorasi konsep kecerdasan buatan (AI) ramah anak dan keamanan siber dasar.</li>
                </ul>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-amber-800">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Program Remedial Terfokus</span>
                </div>
                <p className="leading-relaxed">
                  Peserta didik belum mencapai kriteria KKTP minimal 60 (Perolehan: {result.nilai}). Perlu pendampingan remedial intensif pada:
                </p>
                <ul className="list-disc list-inside space-y-1 text-amber-800 font-medium">
                  {tpAnalysis.wrongQuestions.slice(0, 3).map(({ q }) => (
                    <li key={q.id}>
                      Penguatan konsep: <strong>{q.topic}</strong> ({q.competency})
                    </li>
                  ))}
                  <li>Gunakan media visual/video pembelajaran mengenai garis waktu sejarah komputer dan sistem bilangan biner.</li>
                  <li>Lakukan bimbingan individu atau kelompok kecil sebelum memberikan tes remedial ulang.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => downloadStudentResultPDF(result)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Lembar Hasil Siswa (PDF)</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Tutup Jendela
          </button>
        </div>
      </div>
    </div>
  );
};
