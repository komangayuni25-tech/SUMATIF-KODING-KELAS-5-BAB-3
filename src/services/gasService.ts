import { CONFIG } from '../config';
import { ExamResult } from '../types';

/**
 * Service untuk komunikasi dengan Google Apps Script Web App & Penyimpanan Lokal
 */

const STORAGE_LOCAL_RESULTS_KEY = 'sd3_local_exam_results_koding_v1';
const STORAGE_CUSTOM_GAS_URL_KEY = 'sd3_custom_gas_url';

// Helper generator skor matriks deterministik
function generateMatrixScores(correctList: number[], partialList: number[] = []): Record<number, number> {
  const map: Record<number, number> = {};
  for (let i = 1; i <= 40; i++) {
    if (correctList.includes(i)) {
      map[i] = 1;
    } else if (partialList.includes(i)) {
      map[i] = 0.67;
    } else {
      map[i] = 0;
    }
  }
  return map;
}

// Data awal siswa kelas 5 SD Negeri 3 Loloan Timur
export const SAMPLE_STUDENTS_RESULTS: ExamResult[] = [
  {
    id: 'sample-01',
    timestamp: '20/10/2026, 08.45.12',
    nama: 'I Putu Arya Pratama',
    noAbsen: '01',
    kelas: '5',
    tglLahir: '14 Mei 2015',
    durasiPengerjaan: '22 Menit 14 Detik',
    benar: 38,
    salah: 2,
    nilai: 95,
    status: 'Tuntas',
    matrixScores: generateMatrixScores(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 40],
      [39]
    ),
  },
  {
    id: 'sample-02',
    timestamp: '20/10/2026, 08.48.30',
    nama: 'Ni Kadek Dwi Lestari',
    noAbsen: '02',
    kelas: '5',
    tglLahir: '21 Agustus 2015',
    durasiPengerjaan: '25 Menit 40 Detik',
    benar: 35,
    salah: 5,
    nilai: 88,
    status: 'Tuntas',
    matrixScores: generateMatrixScores(
      [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 27, 28, 29, 30, 31, 32, 34, 35, 36, 37, 39, 40],
      [38]
    ),
  },
  {
    id: 'sample-03',
    timestamp: '20/10/2026, 08.52.05',
    nama: 'I Komang Bagus Aditya',
    noAbsen: '03',
    kelas: '5',
    tglLahir: '05 Januari 2015',
    durasiPengerjaan: '27 Menit 18 Detik',
    benar: 31,
    salah: 9,
    nilai: 78,
    status: 'Tuntas',
    matrixScores: generateMatrixScores(
      [1, 2, 3, 4, 6, 8, 9, 10, 11, 12, 13, 16, 17, 18, 19, 20, 21, 23, 24, 25, 27, 28, 29, 30, 31, 34, 35, 36, 37, 38, 40]
    ),
  },
  {
    id: 'sample-04',
    timestamp: '20/10/2026, 08.55.44',
    nama: 'Ni Ketut Citra Dewi',
    noAbsen: '04',
    kelas: '5',
    tglLahir: '11 November 2014',
    durasiPengerjaan: '29 Menit 05 Detik',
    benar: 27,
    salah: 13,
    nilai: 68,
    status: 'Tuntas',
    matrixScores: generateMatrixScores(
      [1, 2, 3, 4, 8, 9, 10, 12, 13, 16, 17, 19, 20, 21, 24, 25, 27, 28, 29, 30, 31, 34, 35, 36, 37, 38, 40]
    ),
  },
  {
    id: 'sample-05',
    timestamp: '20/10/2026, 08.58.12',
    nama: 'I Gede Surya Wiguna',
    noAbsen: '05',
    kelas: '5',
    tglLahir: '03 Maret 2015',
    durasiPengerjaan: '32 Menit 11 Detik',
    benar: 22,
    salah: 18,
    nilai: 55,
    status: 'Remedial',
    matrixScores: generateMatrixScores(
      [1, 2, 3, 8, 9, 10, 12, 13, 16, 17, 19, 20, 21, 24, 25, 27, 29, 30, 31, 34, 36, 37]
    ),
  },
  {
    id: 'sample-06',
    timestamp: '20/10/2026, 09.01.20',
    nama: 'Ni Made Ayu Saraswati',
    noAbsen: '06',
    kelas: '5',
    tglLahir: '19 Juli 2015',
    durasiPengerjaan: '34 Menit 45 Detik',
    benar: 19,
    salah: 21,
    nilai: 48,
    status: 'Remedial',
    matrixScores: generateMatrixScores(
      [1, 2, 3, 8, 10, 12, 13, 17, 19, 20, 21, 24, 25, 27, 29, 30, 34, 36, 37]
    ),
  },
];

export const gasService = {
  /**
   * Mendapatkan URL Google Apps Script yang aktif
   */
  getGasUrl(): string {
    try {
      const custom = localStorage.getItem(STORAGE_CUSTOM_GAS_URL_KEY);
      if (custom && custom.trim().startsWith('http')) {
        return custom.trim();
      }
    } catch {
      // ignore
    }
    return CONFIG.GOOGLE_APPS_SCRIPT_URL;
  },

  /**
   * Menyimpan URL Google Apps Script kustom
   */
  setGasUrl(url: string): void {
    try {
      if (!url || !url.trim()) {
        localStorage.removeItem(STORAGE_CUSTOM_GAS_URL_KEY);
      } else {
        localStorage.setItem(STORAGE_CUSTOM_GAS_URL_KEY, url.trim());
      }
    } catch (e) {
      console.warn('Gagal menyimpan URL GAS kustom ke localStorage:', e);
    }
  },

  /**
   * Mengembalikan URL ke default
   */
  resetGasUrl(): void {
    try {
      localStorage.removeItem(STORAGE_CUSTOM_GAS_URL_KEY);
    } catch {
      // ignore
    }
  },

  /**
   * Mengambil hasil tes yang tersimpan di perangkat lokal
   */
  getLocalExamResults(): ExamResult[] {
    try {
      const saved = localStorage.getItem(STORAGE_LOCAL_RESULTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Gagal membaca data hasil tes lokal:', e);
    }
    // Jika masih kosong, inisialisasi dengan data contoh kelas 5
    return SAMPLE_STUDENTS_RESULTS;
  },

  /**
   * Menyimpan hasil tes ke penyimpanan lokal (Zero Data Loss)
   */
  saveLocalExamResult(result: ExamResult): void {
    try {
      const current = this.getLocalExamResults();
      const existingIdx = current.findIndex(
        (item) =>
          item.id === result.id ||
          (item.nama.toLowerCase() === result.nama.toLowerCase() &&
            item.timestamp === result.timestamp)
      );

      if (existingIdx >= 0) {
        current[existingIdx] = result;
      } else {
        current.unshift(result);
      }

      localStorage.setItem(STORAGE_LOCAL_RESULTS_KEY, JSON.stringify(current));
    } catch (e) {
      console.warn('Gagal menyimpan hasil tes ke localStorage:', e);
    }
  },

  /**
   * Menghapus hasil tes dari penyimpanan lokal
   */
  deleteLocalExamResult(idOrTimestamp: string, nama?: string): void {
    try {
      const current = this.getLocalExamResults();
      const filtered = current.filter(
        (r) =>
          r.id !== idOrTimestamp &&
          r.timestamp !== idOrTimestamp &&
          !(nama && r.nama.toLowerCase() === nama.toLowerCase())
      );
      localStorage.setItem(STORAGE_LOCAL_RESULTS_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.warn('Gagal menghapus data hasil tes lokal:', e);
    }
  },

  /**
   * Menguji koneksi ke URL Google Apps Script
   */
  async testGasConnection(
    customUrl?: string
  ): Promise<{ success: boolean; message: string; rowCount?: number }> {
    const url = (customUrl || this.getGasUrl()).trim();
    if (!url || !url.startsWith('http')) {
      return { success: false, message: 'URL Google Apps Script tidak valid.' };
    }

    try {
      const testUrl = `${url}${url.includes('?') ? '&' : '?'}action=read&t=${Date.now()}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(testUrl, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            message:
              'Server merespons HTTP 404. Pastikan Web App sudah di-Deploy dengan jenis "Web App" dan akses "Anyone".',
          };
        }
        return {
          success: false,
          message: `Server merespons status HTTP ${response.status}`,
        };
      }

      const text = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {
        return {
          success: true,
          message: 'Terhubung ke server Google Apps Script (Respons non-JSON).',
          rowCount: 0,
        };
      }

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.rows)
        ? data.rows
        : [];

      return {
        success: true,
        message: `Koneksi berhasil! Terhubung ke Google Spreadsheet (${list.length} baris data ditemukan).`,
        rowCount: list.length,
      };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return {
          success: false,
          message: 'Koneksi waktu habis (Timeout 8 detik).',
        };
      }
      return {
        success: false,
        message: err.message || 'Gagal terhubung ke Google Apps Script.',
      };
    }
  },

  /**
   * Mengirim hasil tes siswa ke Google Apps Script Web App & Penyimpanan Lokal
   */
  async submitExamResult(
    result: ExamResult
  ): Promise<{ success: boolean; message: string; savedLocally: boolean }> {
    this.saveLocalExamResult(result);

    const url = this.getGasUrl();
    if (!url || !url.startsWith('http')) {
      return {
        success: true,
        savedLocally: true,
        message: 'Hasil tes berhasil disimpan di perangkat ini.',
      };
    }

    const payload = {
      action: 'submit',
      id: result.id || `res-${Date.now()}`,
      timestamp: result.timestamp || new Date().toLocaleString('id-ID'),
      nama: result.nama,
      kelas: result.kelas || CONFIG.KELAS,
      noAbsen: result.noAbsen,
      tglLahir: result.tglLahir || '',
      durasiPengerjaan: result.durasiPengerjaan || '25 Menit',
      benar: result.benar,
      salah: result.salah,
      nilai: result.nilai,
      status: result.status,
      mataPelajaran: CONFIG.MATA_PELAJARAN,
      sekolah: CONFIG.SEKOLAH,
      studentName: result.nama,
      className: result.kelas || CONFIG.KELAS,
      absenNumber: result.noAbsen,
      correctCount: result.benar,
      incorrectCount: result.salah,
      totalQuestions: (result.benar || 0) + (result.salah || 0),
      finalScore: result.nilai,
      answers: result.detailJawaban || {},
      matrixScores: result.matrixScores || {},
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        return {
          success: true,
          savedLocally: true,
          message: 'Data tersimpan di perangkat lokal (koneksi remote mengalami kendala).',
        };
      }

      return {
        success: true,
        savedLocally: true,
        message: 'Hasil ujian berhasil dikirim dan tersinkronisasi dengan Google Spreadsheet!',
      };
    } catch {
      return {
        success: true,
        savedLocally: true,
        message: 'Data tersimpan di perangkat lokal.',
      };
    }
  },

  /**
   * Mengambil hasil tes dari Google Spreadsheet via GAS
   */
  async fetchExamResults(): Promise<ExamResult[]> {
    const localResults = this.getLocalExamResults();
    const url = this.getGasUrl();

    if (!url || !url.startsWith('http')) {
      return localResults;
    }

    const readUrl = `${url}${url.includes('?') ? '&' : '?'}action=read&t=${Date.now()}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const response = await fetch(readUrl, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        return localResults;
      }

      const raw = await response.json();
      let list: any[] = [];

      if (Array.isArray(raw)) {
        list = raw;
      } else if (raw && Array.isArray(raw.data)) {
        list = raw.data;
      } else if (raw && raw.status === 'success' && Array.isArray(raw.rows)) {
        list = raw.rows;
      }

      const remoteResults: ExamResult[] = list
        .filter((item: any) => {
          const name = item.Nama || item.nama || item.studentName || item['Nama Siswa'];
          return name && String(name).trim().length > 0;
        })
        .map((item: any, idx: number) => {
          const timestamp =
            item.Timestamp || item.timestamp || item.waktu || new Date().toLocaleString('id-ID');
          const nama =
            item.studentName || item.Nama || item.nama || item['Nama Siswa'] || 'Siswa';
          const kelas = item.className || item.Kelas || item.kelas || CONFIG.KELAS;
          const noAbsen = String(
            item.absenNumber || item['Nomor Absen'] || item.noAbsen || item.NoAbsen || '-'
          );
          const durasiPengerjaan = item.durasiPengerjaan || item.Durasi || '25 Menit';
          const benar = Number(item.correctCount ?? item.Benar ?? item.benar ?? 0);
          const salah = Number(item.incorrectCount ?? item.Salah ?? item.salah ?? 0);
          const nilai = Number(item.finalScore ?? item.Nilai ?? item.nilai ?? 0);
          const status = item.status || (nilai >= CONFIG.KKTP ? 'Tuntas' : 'Remedial');
          const tglLahir = item.birthDate || item['Tanggal Lahir'] || item.tglLahir || '';

          return {
            id: item.id || `gas-${idx}-${timestamp}`,
            timestamp,
            nama,
            kelas,
            noAbsen,
            tglLahir,
            durasiPengerjaan,
            benar,
            salah,
            nilai,
            status: status === 'Tuntas' || status === 'Lulus' ? 'Tuntas' : 'Remedial',
          };
        });

      // Gabungkan data remote dengan lokal
      const combined = [...remoteResults];
      localResults.forEach((loc) => {
        const alreadyInRemote = combined.some(
          (rem) =>
            rem.nama.trim().toLowerCase() === loc.nama.trim().toLowerCase() &&
            rem.noAbsen === loc.noAbsen
        );
        if (!alreadyInRemote) {
          combined.push(loc);
        }
      });

      return combined.length > 0 ? combined : localResults;
    } catch {
      return localResults;
    }
  },

  /**
   * Menghapus data dari Google Spreadsheet via GAS dan Penyimpanan Lokal
   */
  async deleteExamResult(timestamp: string, nama: string): Promise<boolean> {
    this.deleteLocalExamResult(timestamp, nama);
    const url = this.getGasUrl();
    if (!url || !url.startsWith('http')) return true;

    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action: 'delete', timestamp, nama, studentName: nama }),
      });
      return true;
    } catch {
      return true;
    }
  },
};
