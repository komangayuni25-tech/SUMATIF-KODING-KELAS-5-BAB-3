/**
 * Definisi Type & Interface Aplikasi Tes Sumatif
 * Koding Kelas 5 - Perkembangan Teknologi Digital
 */

export type QuestionType = 'pg' | 'pgk_kategori' | 'benar_salah' | 'pgk';
export type Difficulty = 'Mudah' | 'Sedang' | 'Sukar';
export type CognitiveLevel = 'L1' | 'L2' | 'L3';

export interface StudentBirthDate {
  hari: string;
  bulan: string;
  tahun: string;
}

export interface StudentIdentity {
  nama: string;
  noAbsen: string;
  tglLahir: StudentBirthDate;
}

export interface OptionItem {
  id: string; // e.g. 'A', 'B', 'C', 'D'
  text: string;
}

export interface StatementItem {
  id: string; // e.g. 's1', 's2', 's3'
  text: string;
  correctAnswer: boolean; // true = Benar, false = Salah
}

export interface Question {
  id: number;
  type: QuestionType;
  text: string;
  image?: string; // Gambar/Diagram visual SVG atau ilustrasi edukatif
  options?: OptionItem[]; // Untuk 'pg' (4 opsi A, B, C, D)
  statements?: StatementItem[]; // Untuk 'pgk_kategori' (3 pernyataan Benar/Salah)
  correctAnswer?: string | string[]; // string untuk 'pg' (e.g. 'B')
  difficulty: Difficulty;
  level: CognitiveLevel; // L1 (Mengingat/Memahami), L2 (Aplikasi), L3 (Penalaran/Analisis)
  competency: string; // Sesuai 3 Tujuan Pembelajaran
  indicator: string; // Indikator ketercapaian soal
  explanation: string;
  topic: string;
}

export interface ShuffledQuestion extends Question {
  originalQuestionId: number;
  shuffledOptions?: OptionItem[];
}

export type AnswerValue = string | string[] | Record<string, boolean>;

export interface ExamResult {
  id?: string;
  timestamp: string;
  nama: string;
  noAbsen: string;
  kelas: string;
  tglLahir?: string;
  durasiPengerjaan?: string; // e.g. "24 Menit"
  benar: number;
  salah: number;
  nilai: number; // Skala 0 - 100
  status: 'Tuntas' | 'Remedial' | 'Lulus' | 'Belum Lulus';
  detailJawaban?: Record<number, AnswerValue>;
  matrixScores?: Record<number, number>; // questionId -> skor per butir (0 s.d. 1)
}

export type AppStage = 1 | 2 | 3 | 4;
