/**
 * Konfigurasi Utama Aplikasi Tes Sumatif
 * SD NEGERI 3 LOLOAN TIMUR - JEMBRANA - KELAS 5
 * Mata Pelajaran: KODING (Materi: Perkembangan Teknologi Digital)
 */

export const CONFIG = {
  SEKOLAH: "SD Negeri 3 Loloan Timur",
  ALAMAT_SEKOLAH: "Jl. Merak No. 12, Loloan Timur, Kec. Negara, Kab. Jembrana - Bali",
  KOTA: "Jembrana",
  KELAS: "5",
  MATA_PELAJARAN: "KODING",
  MATERI: "Perkembangan Teknologi Digital",
  GURU: "Komang Ayu, S.Pd",
  NIP_GURU: "198605022022212030", // NIPPPK Guru
  KEPALA_SEKOLAH: "Susilo Fitri Yatmoko, M.Pd",
  NIP_KEPALA_SEKOLAH: "19880521 201101 1 010",
  KKTP: 60, // Kriteria Ketercapaian Tujuan Pembelajaran: 60
  ADMIN_PASSWORD: "GURUADMIN",
  
  // 3 Elemen / Capaian Pembelajaran Utama
  TUJUAN_PEMBELAJARAN: [
    {
      id: "TP1",
      kode: "TP-1",
      judul: "Menginterpretasikan teknologi digital dengan benar",
      deskripsi: "Memahami konsep data digital, sistem bilangan biner, sinyal analog vs digital, komponen perangkat keras/lunak, dan logika komputasi.",
    },
    {
      id: "TP2",
      kode: "TP-2",
      judul: "Menjelaskan sejarah teknologi digital dengan runtut",
      deskripsi: "Menelusuri kronologi evolusi alat hitung manual, mekanik, tabung hampa generasi 1, transistor, IC/mikroprosesor, hingga era internet & komputasi modern.",
    },
    {
      id: "TP3",
      kode: "TP-3",
      judul: "Menganalisis manfaat digital dalam kehidupan sehari-hari dengan tepat",
      deskripsi: "Menganalisis peranan teknologi digital, IoT, kecerdasan buatan (AI), otomatisasi, etika digital, serta dampaknya dalam bidang pendidikan, kesehatan, dan masyarakat.",
    },
  ],

  // Endpoint Google Apps Script Web App utama
  GOOGLE_APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbyVhWUJvJTJZKoFFrAupa9eOQGc-rXlyvkmyG4RDThAajanzuktygejhYn1SKMjyt22Rg/exec",
};
