import React, { useState, useMemo, useEffect } from 'react';
import { CONFIG } from '../config';
import {
  Question,
  ShuffledQuestion,
  StudentIdentity,
  AnswerValue,
  ExamResult,
  OptionItem,
} from '../types';
import { gasService } from '../services/gasService';
import { downloadExamQuestionsPDF } from '../utils/pdfGenerator';
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Download,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  User,
  Check,
} from 'lucide-react';

interface Stage2ExamProps {
  student: StudentIdentity;
  questions: Question[];
  onFinishExam: (result: ExamResult) => void;
}

// Fisher-Yates shuffle helper
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const Stage2Exam: React.FC<Stage2ExamProps> = ({
  student,
  questions,
  onFinishExam,
}) => {
  // Waktu mulai pengerjaan tes
  const [startTime] = useState<number>(() => Date.now());
  const [elapsedTimeSec, setElapsedTimeSec] = useState<number>(0);

  // Timer interval detik
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTimeSec(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  // Format timer MM:SS
  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 1. Acak urutan opsi jawaban saat tes dimulai (tetap pertahankan id asli untuk penilaian)
  const shuffledQuestions = useMemo<ShuffledQuestion[]>(() => {
    return questions.map((q: Question) => {
      if (q.type === 'pg' && q.options && q.options.length > 0) {
        const shuffledOpts: OptionItem[] = shuffleArray<OptionItem>(q.options);
        const standardLabels = ['A', 'B', 'C', 'D'];
        const remappedOptions: OptionItem[] = shuffledOpts.map((opt, idx) => ({
          id: standardLabels[idx] || opt.id,
          text: opt.text,
        }));

        return {
          ...q,
          originalQuestionId: q.id,
          shuffledOptions: remappedOptions,
        };
      }
      return {
        ...q,
        originalQuestionId: q.id,
      };
    });
  }, [questions]);

  // State pengerjaan
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentQ = shuffledQuestions[currentIndex];
  const totalQuestions = shuffledQuestions.length;

  // Cek apakah soal nomor tertentu sudah dijawab
  const isQuestionAnswered = (idx: number): boolean => {
    const ans = answers[idx];
    if (ans === undefined || ans === null) return false;

    const q = shuffledQuestions[idx];
    if (q.type === 'pg' || q.type === 'benar_salah') {
      return typeof ans === 'string' && ans.length > 0;
    }
    if (q.type === 'pgk_kategori') {
      if (typeof ans === 'object' && !Array.isArray(ans)) {
        const statements = q.statements || [];
        return statements.length > 0 && statements.every((st) => ans[st.id] !== undefined);
      }
      return false;
    }
    return false;
  };

  // Hitung jumlah soal yang telah dijawab
  const answeredCount = useMemo(() => {
    let count = 0;
    for (let i = 0; i < totalQuestions; i++) {
      if (isQuestionAnswered(i)) count++;
    }
    return count;
  }, [answers, totalQuestions, shuffledQuestions]);

  const allAnswered = answeredCount === totalQuestions;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // Handler jawaban Pilihan Ganda (PG)
  const handleSelectPG = (optionText: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionText,
    }));
  };

  // Handler jawaban Benar / Salah tunggal
  const handleSelectBenarSalah = (val: 'Benar' | 'Salah') => {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: val,
    }));
  };

  // Handler jawaban PGK Kategori (3 Pernyataan Benar/Salah)
  const handleSetCategoryStatement = (statementId: string, value: boolean) => {
    setAnswers((prev) => {
      const currentMap =
        typeof prev[currentIndex] === 'object' && !Array.isArray(prev[currentIndex])
          ? { ...(prev[currentIndex] as Record<string, boolean>) }
          : {};
      currentMap[statementId] = value;
      return {
        ...prev,
        [currentIndex]: currentMap,
      };
    });
  };

  // Navigasi soal
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) setCurrentIndex(currentIndex + 1);
  };

  // Hitung Nilai & Validasi Komprehensif
  const calculateResult = (): ExamResult => {
    let totalScoreSum = 0;
    let benarCount = 0;
    const matrixScores: Record<number, number> = {};
    const detailJawabanMapped: Record<number, AnswerValue> = {};

    shuffledQuestions.forEach((sq, idx) => {
      const userAns = answers[idx];
      const origQ = questions.find((q) => q.id === sq.originalQuestionId) || sq;
      detailJawabanMapped[origQ.id] = userAns;

      if (sq.type === 'pg') {
        const correctOpt = origQ.options?.find((o) => o.id === origQ.correctAnswer);
        if (correctOpt && userAns === correctOpt.text) {
          totalScoreSum += 1;
          benarCount += 1;
          matrixScores[origQ.id] = 1;
        } else {
          matrixScores[origQ.id] = 0;
        }
      } else if (sq.type === 'benar_salah') {
        if (
          typeof userAns === 'string' &&
          typeof origQ.correctAnswer === 'string' &&
          userAns.trim().toLowerCase() === origQ.correctAnswer.trim().toLowerCase()
        ) {
          totalScoreSum += 1;
          benarCount += 1;
          matrixScores[origQ.id] = 1;
        } else {
          matrixScores[origQ.id] = 0;
        }
      } else if (sq.type === 'pgk_kategori') {
        const statements = origQ.statements || [];
        const userMap = (typeof userAns === 'object' && !Array.isArray(userAns) ? userAns : {}) as Record<string, boolean>;

        let statementsCorrect = 0;
        statements.forEach((st) => {
          if (userMap[st.id] === st.correctAnswer) {
            statementsCorrect += 1;
          }
        });

        if (statementsCorrect === statements.length) {
          totalScoreSum += 1;
          benarCount += 1;
          matrixScores[origQ.id] = 1;
        } else {
          const partial = Number((statementsCorrect / (statements.length || 1)).toFixed(2));
          totalScoreSum += partial;
          matrixScores[origQ.id] = partial;
        }
      }
    });

    const finalScore = Math.round((totalScoreSum / totalQuestions) * 100);
    const salahCount = totalQuestions - benarCount;
    const status: 'Tuntas' | 'Remedial' = finalScore >= CONFIG.KKTP ? 'Tuntas' : 'Remedial';

    const tglLahirStr = student.tglLahir
      ? `${student.tglLahir.hari} ${student.tglLahir.bulan} ${student.tglLahir.tahun}`
      : '-';

    const durationMins = Math.floor(elapsedTimeSec / 60);
    const durationSecs = elapsedTimeSec % 60;
    const durasiPengerjaanStr =
      durationMins > 0 ? `${durationMins} Menit ${durationSecs} Detik` : `${durationSecs} Detik`;

    return {
      id: `res-${Date.now()}`,
      timestamp: new Date().toLocaleString('id-ID'),
      nama: student.nama,
      noAbsen: student.noAbsen,
      kelas: CONFIG.KELAS,
      tglLahir: tglLahirStr,
      durasiPengerjaan: durasiPengerjaanStr,
      benar: benarCount,
      salah: salahCount,
      nilai: finalScore,
      status,
      detailJawaban: detailJawabanMapped,
      matrixScores,
    };
  };

  // Proses Kirim Jawaban
  const handleConfirmSubmit = async () => {
    if (!allAnswered) {
      alert('Masih ada butir soal yang belum dijawab. Harap jawab seluruh soal terlebih dahulu!');
      setShowConfirmModal(false);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const calculatedResult = calculateResult();

    try {
      await gasService.submitExamResult(calculatedResult);
      setIsSubmitting(false);
      setShowConfirmModal(false);
      onFinishExam(calculatedResult);
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmitError(
        err.message ||
          'Gagal mengirim data ke server. Data tetap disimpan di perangkat lokal.'
      );
      // Tetap lanjutkan agar siswa tidak kehilangan hasil
      setTimeout(() => {
        onFinishExam(calculatedResult);
      }, 1200);
    }
  };

  const currentOptions = currentQ.shuffledOptions || currentQ.options || [];

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
      {/* Header Info Siswa, Durasi & Progres */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">{student.nama}</span>
                <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">
                  Absen: {student.noAbsen}
                </span>
                <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded">
                  Kelas {CONFIG.KELAS}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {CONFIG.SEKOLAH} • {CONFIG.MATA_PELAJARAN} ({CONFIG.MATERI})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Indikator Timer Pengerjaan */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl font-mono text-xs font-bold">
              <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
              <span>Waktu: {formatTimer(elapsedTimeSec)}</span>
            </div>

            {/* Tombol Unduh Naskah Soal PDF */}
            <button
              id="btn-download-questions-pdf"
              onClick={() => downloadExamQuestionsPDF(questions)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-300 cursor-pointer"
              title="Unduh Lembar Naskah Soal dalam bentuk PDF"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Unduh Naskah</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-slate-600">
              Progres: <span className="text-blue-700 font-bold">{answeredCount}</span> dari {totalQuestions} Soal Terjawab
            </span>
            <span className="text-blue-700 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Layout: Konten Soal + Navigasi Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: Lembar Soal Aktif */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 min-h-[440px] flex flex-col justify-between">
            <div>
              {/* Header Nomor, Tipe Soal & Kompetensi */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm sm:text-base font-extrabold px-3 py-1 bg-blue-700 text-white rounded-xl shadow-2xs">
                    Soal No. {currentIndex + 1}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                    {currentQ.type === 'pg' && 'Pilihan Ganda'}
                    {currentQ.type === 'pgk_kategori' && 'Pilihan Ganda Kompleks Kategori'}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                    Level {currentQ.level || 'L2'}
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  {currentQ.topic}
                </span>
              </div>

              {/* Petunjuk Pengisian */}
              <div className="mb-4 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-100 inline-block">
                {currentQ.type === 'pg' && 'Pilihlah salah satu jawaban yang paling tepat (A, B, C, atau D).'}
                {currentQ.type === 'pgk_kategori' && 'Tentukan pilihan Benar atau Salah pada setiap pernyataan di bawah ini.'}
              </div>

              {/* Gambar / Diagram Ilustrasi Edukatif Soal */}
              {currentQ.image && (
                <div className="mb-5 p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex justify-center shadow-2xs">
                  {currentQ.image.startsWith('<svg') ? (
                    <div
                      className="w-full flex justify-center"
                      dangerouslySetInnerHTML={{ __html: currentQ.image }}
                    />
                  ) : (
                    <img
                      src={currentQ.image}
                      alt={`Ilustrasi Soal Nomor ${currentIndex + 1}`}
                      className="max-h-60 object-contain rounded-lg"
                    />
                  )}
                </div>
              )}

              {/* Teks Soal */}
              <div className="text-sm sm:text-base text-slate-900 leading-relaxed font-medium whitespace-pre-line mb-6">
                {currentQ.text}
              </div>

              {/* Tampilan Opsi Jawaban: Pilihan Ganda (PG) */}
              {currentQ.type === 'pg' && (
                <div className="space-y-2.5">
                  {currentOptions.map((opt) => {
                    const isSelected = answers[currentIndex] === opt.text;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectPG(opt.text)}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-semibold ring-1 ring-blue-500'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {opt.id}
                        </div>
                        <span className="text-xs sm:text-sm mt-0.5 leading-normal flex-1">
                          {opt.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Tampilan Opsi Jawaban: PGK Kategori (3 Pernyataan Benar / Salah) */}
              {currentQ.type === 'pgk_kategori' && (
                <div className="space-y-3">
                  {(currentQ.statements || []).map((st, sIdx) => {
                    const ansMap =
                      typeof answers[currentIndex] === 'object' && !Array.isArray(answers[currentIndex])
                        ? (answers[currentIndex] as Record<string, boolean>)
                        : {};
                    const currentVal = ansMap[st.id];

                    return (
                      <div
                        key={st.id}
                        className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/60"
                      >
                        <p className="text-xs sm:text-sm text-slate-800 font-medium mb-3">
                          <span className="font-bold text-blue-700 mr-1.5">
                            Pernyataan {sIdx + 1}:
                          </span>
                          {st.text}
                        </p>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleSetCategoryStatement(st.id, true)}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                              currentVal === true
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>BENAR</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetCategoryStatement(st.id, false)}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                              currentVal === false
                                ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
                                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>SALAH</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Tombol Aksi Bawah: Sebelumnya & Berikutnya */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 gap-3">
              <button
                id="btn-prev-question"
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              {currentIndex < totalQuestions - 1 ? (
                <button
                  id="btn-next-question"
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-1 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  id="btn-submit-exam-trigger"
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>KIRIM JAWABAN TES</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Papan Nomor Soal (Navigasi Cepat 1 s.d. 40) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Navigasi Butir Soal (1 - {totalQuestions})
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {answeredCount}/{totalQuestions} Terjawab
              </span>
            </div>

            {/* Grid 40 Nomor Soal */}
            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2 max-h-[380px] overflow-y-auto pr-1">
              {shuffledQuestions.map((q, idx) => {
                const isAnswered = isQuestionAnswered(idx);
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer relative ${
                      isCurrent
                        ? 'ring-2 ring-blue-600 bg-blue-700 text-white shadow-xs'
                        : isAnswered
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {idx + 1}
                    {q.type === 'pgk_kategori' && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-500" title="PGK Kategori" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Keterangan Warna */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-blue-700 shrink-0" />
                <span>Soal Sedang Dibuka</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-300 shrink-0" />
                <span>Sudah Dijawab</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-slate-100 border border-slate-200 shrink-0" />
                <span>Belum Dijawab</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 ml-0.5" />
                <span>Titik Ungu: Soal PGK Kategori</span>
              </div>
            </div>

            {/* Tombol Kirim Cepat di Samping */}
            <div className="mt-5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Selesaikan &amp; Kirim Jawaban</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Pengiriman Jawaban */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Konfirmasi Pengiriman Jawaban Tes
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 mt-2 mb-4">
              Apakah Anda yakin ingin menyelesaikan tes sekarang?
              <br />
              <span className="font-semibold text-slate-800">
                {answeredCount} dari {totalQuestions} soal
              </span>{' '}
              telah Anda jawab dengan durasi {formatTimer(elapsedTimeSec)}.
            </p>

            {!allAnswered && (
              <div className="p-3 mb-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2 text-left">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Perhatian: Masih ada{' '}
                  <strong className="font-bold">{totalQuestions - answeredCount} soal</strong>{' '}
                  yang belum terjawab. Sebaiknya periksa kembali lembar jawaban Anda!
                </span>
              </div>
            )}

            {submitError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-left">
                {submitError}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 mt-5">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Periksa Kembali
              </button>

              <button
                type="button"
                id="btn-confirm-submit-exam"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Ya, Kirim Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
