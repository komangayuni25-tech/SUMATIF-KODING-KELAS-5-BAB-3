import { Question } from '../types';

export const INITIAL_QUESTIONS: Question[] = [
  // ==========================================
  // BAGIAN I: PILIHAN GANDA (35 SOAL)
  // ==========================================

  // --- SOAL 1 ---
  {
    id: 1,
    type: 'pg',
    topic: 'Konsep Teknologi Digital',
    competency: 'Menginterpretasikan teknologi digital dengan benar',
    level: 'L1',
    difficulty: 'Mudah',
    indicator: 'Peserta didik dapat mengidentifikasi definisi dasar dari teknologi digital.',
    text: 'Teknologi digital merupakan teknologi yang mengubah semua informasi dan data menjadi kode berbasis angka. Angka dasar yang digunakan dalam sistem digital adalah...',
    image: `<svg viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-md mx-auto">
      <rect width="400" height="120" rx="10" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5"/>
      <rect x="25" y="20" width="165" height="80" rx="8" fill="#EFF6FF" stroke="#3B82F6" stroke-dasharray="3 3"/>
      <text x="107" y="45" font-size="12" font-weight="bold" fill="#1D4ED8" text-anchor="middle">Sinyal Analog</text>
      <path d="M 40 75 Q 60 50, 80 75 T 120 75 T 160 75" fill="none" stroke="#2563EB" stroke-width="2.5"/>
      <rect x="210" y="20" width="165" height="80" rx="8" fill="#F0FDF4" stroke="#16A34A"/>
      <text x="292" y="45" font-size="12" font-weight="bold" fill="#15803D" text-anchor="middle">Sinyal Digital (Biner)</text>
      <path d="M 225 80 L 245 80 L 245 55 L 265 55 L 265 80 L 285 80 L 285 55 L 305 55 L 305 80 L 325 80 L 325 55 L 345 55" fill="none" stroke="#16A34A" stroke-width="2.5"/>
      <text x="285" y="105" font-size="10" font-weight="bold" fill="#047857" text-anchor="middle">Kode: [ 0 ] dan [ 1 ]</text>
    </svg>`,
    options: [
      { id: 'A', text: 'Angka 0 dan 1 (Sistem Biner)' },
      { id: 'B', text: 'Angka 1 sampai dengan 10 (Sistem Desimal)' },
      { id: 'C', text: 'Angka Romawi I, V, dan X' },
      { id: 'D', text: 'Angka pecahan 1/2 dan 1/4' },
    ],
    correctAnswer: 'A',
    explanation:
      'Teknologi digital bekerja dengan memproses informasi ke dalam kode biner (binary code) yang hanya terdiri dari dua angka simbolik, yaitu angka 0 (keadaan mati/off) dan angka 1 (keadaan hidup/on).',
  },

  // --- SOAL 2 ---
  {
    id: 2,
    type: 'pg',
    topic: 'Sejarah Alat Hitung',
    competency: 'Menjelaskan sejarah teknologi digital dengan runtut',
    level: 'L1',
    difficulty: 'Mudah',
    indicator: 'Peserta didik dapat menyebutkan alat hitung kuno yang menjadi cikal bakal komputer.',
    text: 'Perhatikan gambar alat hitung tradisional di atas!\nAlat hitung kuno yang menggunakan deretan manik-manik pada kawat kayu dan menjadi cikal bakal awal mula perkembangan komputasi disebut...',
    image: `<svg viewBox="0 0 380 120" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-sm mx-auto">
      <rect width="380" height="120" rx="10" fill="#FFFBEB" stroke="#FDE68A" stroke-width="1.5"/>
      <rect x="50" y="20" width="280" height="80" rx="6" fill="#78350F" stroke="#451A03" stroke-width="3"/>
      <line x1="50" y1="50" x2="330" y2="50" stroke="#451A03" stroke-width="3"/>
      <!-- wires -->
      <line x1="95" y1="23" x2="95" y2="97" stroke="#D97706" stroke-width="2"/>
      <line x1="140" y1="23" x2="140" y2="97" stroke="#D97706" stroke-width="2"/>
      <line x1="185" y1="23" x2="185" y2="97" stroke="#D97706" stroke-width="2"/>
      <line x1="230" y1="23" x2="230" y2="97" stroke="#D97706" stroke-width="2"/>
      <line x1="275" y1="23" x2="275" y2="97" stroke="#D97706" stroke-width="2"/>
      <!-- beads -->
      <circle cx="95" cy="36" r="8" fill="#FBBF24"/>
      <circle cx="95" cy="68" r="8" fill="#F59E0B"/>
      <circle cx="140" cy="36" r="8" fill="#FBBF24"/>
      <circle cx="140" cy="80" r="8" fill="#F59E0B"/>
      <circle cx="185" cy="36" r="8" fill="#FBBF24"/>
      <circle cx="185" cy="68" r="8" fill="#F59E0B"/>
      <circle cx="230" cy="36" r="8" fill="#FBBF24"/>
      <circle cx="230" cy="80" r="8" fill="#F59E0B"/>
      <circle cx="275" cy="36" r="8" fill="#FBBF24"/>
      <circle cx="275" cy="68" r="8" fill="#F59E0B"/>
      <text x="190" y="112" font-size="11" font-weight="bold" fill="#78350F" text-anchor="middle">Alat Hitung Manik-Manik Kayu</text>
    </svg>`,
    options: [
      { id: 'A', text: 'Sempoa (Abakus)' },
      { id: 'B', text: 'Kalkulator Digital' },
      { id: 'C', text: 'Punched Card' },
      { id: 'D', text: 'Microprocessor' },
    ],
    correctAnswer: 'A',
    explanation:
      'Sempoa atau Abakus adalah salah satu alat hitung tertua yang diciptakan ribuan tahun lalu di Babilonia dan Tiongkok. Alat ini merupakan fondasi awal manusia memanipulasi nilai angka sebelum ditemukannya mesin hitung mekanis.',
  },

  // --- SOAL 3 ---
  {
    id: 3,
    type: 'pg',
    topic: 'Tokoh Komputer',
    competency: 'Menjelaskan sejarah teknologi digital dengan runtut',
    level: 'L1',
    difficulty: 'Mudah',
    indicator: 'Peserta didik dapat mengenali tokoh ilmuwan yang dijuluki Bapak Komputer.',
    text: 'Tokoh ilmuwan yang dijuluki sebagai "Bapak Komputer" karena merancang konsep Mesin Analitis (Analytical Engine) pertama kali adalah...',
    options: [
      { id: 'A', text: 'Albert Einstein' },
      { id: 'B', text: 'Charles Babbage' },
      { id: 'C', text: 'Thomas Alva Edison' },
      { id: 'D', text: 'Alexander Graham Bell' },
    ],
    correctAnswer: 'B',
    explanation:
      'Charles Babbage adalah matematikawan Inggris yang dijuluki sebagai Bapak Komputer karena ia merancang Difference Engine dan Analytical Engine yang memiliki konsep dasar input, proses, dan output komputasi modern.',
  },

  // --- SOAL 4 ---
  {
    id: 4,
    type: 'pg',
    topic: 'Programmer Pertama',
    competency: 'Menjelaskan sejarah teknologi digital dengan runtut',
    level: 'L1',
    difficulty: 'Sedang',
    indicator: 'Peserta didik dapat mengidentifikasi programmer komputer pertama di dunia.',
    text: 'Ilmuwan perempuan yang bekerja sama dengan Charles Babbage dan diakui sebagai programmer komputer pertama di dunia berkat catatannya tentang instruksi algoritma mesin hitung adalah...',
    options: [
      { id: 'A', text: 'Ada Lovelace' },
      { id: 'B', text: 'Marie Curie' },
      { id: 'C', text: 'Florence Nightingale' },
      { id: 'D', text: 'Grace Hopper' },
    ],
    correctAnswer: 'A',
    explanation:
      'Ada Lovelace menulis algoritma pertama untuk diproses oleh Mesin Analitis milik Charles Babbage, menjadikannya programmer komputer pertama dalam sejarah peradaban dunia.',
  },

  // --- SOAL 5 ---
  {
    id: 5,
    type: 'pg',
    topic: 'Generasi Komputer Pertama',
    competency: 'Menjelaskan sejarah teknologi digital dengan runtut',
    level: 'L2',
    difficulty: 'Sedang',
    indicator: 'Peserta didik dapat menentukan komponen utama komputer generasi pertama.',
    text: 'Perhatikan gambar komponen komputer generasi pertama di atas!\nKomputer generasi pertama (seperti ENIAC pada era tahun 1940-an) memiliki ukuran sebesar ruangan kamar dan menggunakan komponen utama berupa...',
    image: `<svg viewBox="0 0 360 120" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-sm mx-auto">
      <rect width="360" height="120" rx="10" fill="#0F172A" stroke="#334155" stroke-width="1.5"/>
      <g transform="translate(145, 15)">
        <rect x="15" y="55" width="40" height="25" rx="3" fill="#64748B"/>
        <path d="M 20 55 C 10 30, 20 10, 35 10 C 50 10, 60 30, 50 55 Z" fill="#F59E0B" fill-opacity="0.25" stroke="#F59E0B" stroke-width="2"/>
        <path d="M 30 20 L 30 45 M 40 20 L 40 45" stroke="#FDE68A" stroke-width="1.5"/>
        <line x1="25" y1="80" x2="25" y2="92" stroke="#CBD5E1" stroke-width="2"/>
        <line x1="35" y1="80" x2="35" y2="92" stroke="#CBD5E1" stroke-width="2"/>
        <line x1="45" y1="80" x2="45" y2="92" stroke="#CBD5E1" stroke-width="2"/>
      </g>
      <text x="180" y="112" font-size="11" font-weight="bold" fill="#FDE68A" text-anchor="middle">Komponen Tabung Hampa Udara (Vacuum Tube)</text>
    </svg>`,
    options: [
      { id: 'A', text: 'Tabung Hampa Udara (Vacuum Tube)' },
      { id: 'B', text: 'Microchip Prosesor Intel' },
      { id: 'C', text: 'Keping Hard Disk SATA' },
      { id: 'D', text: 'Layar Sentuh (Touchscreen)' },
    ],
    correctAnswer: 'A',
    explanation:
      'Komputer generasi pertama (1940-1959) menggunakan tabung hampa udara (vacuum tube) sebagai sirkuit elektronik utama. Tabung ini menghasilkan panas tinggi, sering rusak, dan membuat komputer berukuran luar biasa besar.',
  },

  // --- SOAL 6 ---
  {
    id: 6,
    type: 'pg',
    topic: 'Generasi Komputer Kedua',
    competency: 'Menjelaskan sejarah teknologi digital dengan runtut',
    level: 'L2',
    difficulty: 'Sedang',
    indicator: 'Peserta didik dapat menjelaskan terobosan komponen penemu pada komputer generasi kedua.',
    text: 'Pada komputer generasi kedua, tabung hampa udara yang mudah panas digantikan oleh komponen elektronik yang jauh lebih kecil, hemat energi, dan cepat, yaitu...',
    options: [
      { id: 'A', text: 'Transistor' },
      { id: 'B', text: 'Baterai Kering' },
      { id: 'C', text: 'Lampu Pijar' },
      { id: 'D', text: 'Kipas Angin' },
    ],
    correctAnswer: 'A',
    explanation:
      'Transistor ditemukan pada akhir 1940-an dan digunakan pada komputer generasi kedua (1959-1965). Transistor jauh lebih kecil, tahan lama, dan tidak menghasilkan panas berlebih seperti tabung hampa.',
  },

  // --- SOAL 7 ---
  {
    id: 7,
    type: 'pg',
    topic: 'Generasi Komputer Ketiga & Keempat',
    competency: 'Menjelaskan sejarah teknologi digital dengan runtut',
    level: 'L2',
    difficulty: 'Sedang',
    indicator: 'Peserta didik dapat menghubungkan penemuan Integrated Circuit (IC) dan Mikroprosesor.',
    text: 'Perhatikan evolusi komponen sirkuit komputer di atas!\nRibuan hingga jutaan transistor yang dipadatkan ke dalam satu lempengan silikon kecil dikenal dengan sebutan...',
    image: `<svg viewBox="0 0 380 120" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-sm mx-auto">
      <rect width="380" height="120" rx="10" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.5"/>
      <g transform="translate(130, 20)">
        <rect x="0" y="0" width="120" height="60" rx="6" fill="#1E293B" stroke="#0F172A"/>
        <circle cx="60" cy="30" r="16" fill="#0EA5E9" fill-opacity="0.2"/>
        <text x="60" y="34" font-size="11" font-weight="bold" fill="#38BDF8" text-anchor="middle">CPU CHIP</text>
        <!-- pins left -->
        <rect x="-10" y="8" width="10" height="6" fill="#94A3B8"/>
        <rect x="-10" y="22" width="10" height="6" fill="#94A3B8"/>
        <rect x="-10" y="36" width="10" height="6" fill="#94A3B8"/>
        <rect x="-10" y="48" width="10" height="6" fill="#94A3B8"/>
        <!-- pins right -->
        <rect x="120" y="8" width="10" height="6" fill="#94A3B8"/>
        <rect x="120" y="22" width="10" height="6" fill="#94A3B8"/>
        <rect x="120" y="36" width="10" height="6" fill="#94A3B8"/>
        <rect x="120" y="48" width="10" height="6" fill="#94A3B8"/>
      </g>
      <text x="190" y="105" font-size="11" font-weight="bold" fill="#0F172A" text-anchor="middle">Sirkuit Terpadu (IC) &amp; Mikroprosesor</text>
    </svg>`,
    options: [
      { id: 'A', text: 'Integrated Circuit (IC) / Mikroprosesor' },
      { id: 'B', text: 'Kabel Tembaga' },
      { id: 'C', text: 'Saklar Lampu' },
      { id: 'D', text: 'Pita Magnetik Analog' },
    ],
    correctAnswer: 'A',
    explanation:
      'Integrated Circuit (IC) atau sirkuit terpadu menggabungkan ribuan transistor ke dalam serpihan silikon kecil. Perkembangan ini melahirkan mikroprosesor yang menjadi otak komputer modern saat ini.',
  },

  // --- SOAL 8 ---
  {
    id: 8,
    type: 'pg',
    topic: 'Konsep Analog vs Digital',
    competency: 'Menginterpretasikan teknologi digital dengan benar',
    level: 'L2',
    difficulty: 'Mudah',
    indicator: 'Peserta didik dapat membedakan contoh perangkat analog dan perangkat digital.',
    text: 'Di bawah ini pasangan benda yang menunjukkan perubahan dari teknologi analog menjadi teknologi digital yang tepat adalah...',
    options: [
      { id: 'A', text: 'Jam dinding jarum beralih menjadi smartwatch digital' },
      { id: 'B', text: 'Sepeda kayuh beralih menjadi sepeda ontel' },
      { id: 'C', text: 'Pena tinta beralih menjadi pensil kayu' },
      { id: 'D', text: 'Papan tulis kapur beralih menjadi batu tulis' },
    ],
    correctAnswer: 'A',
    explanation:
      'Jam dinding jarum bekerja secara mekanis/analog dengan pergerakan roda gigi kontinu, sedangkan smartwatch menampilkan angka dan memproses data menggunakan kode biner digital.',
  },

  // --- SOAL 9 ---
  {
    id: 9,
    type: 'pg',
    topic: 'Sistem Bilangan Biner',
    competency: 'Menginterpretasikan teknologi digital dengan benar',
    level: 'L2',
    difficulty: 'Sedang',
    indicator: 'Peserta didik dapat menginterpretasikan arti bilangan biner 1 dan 0 dalam perangkat koding.',
    text: 'Dalam sirkuit koding dan elektronika digital, angka biner "1" dan "0" melambangkan kondisi arus listrik, yaitu...',
    options: [
      { id: 'A', text: '1 = Arus mengalir (ON), 0 = Arus terputus (OFF)' },
      { id: 'B', text: '1 = Arus terputus (OFF), 0 = Arus mengalir (ON)' },
      { id: 'C', text: '1 = Rusak, 0 = Bagus' },
      { id: 'D', text: '1 = Baterai kosong, 0 = Baterai penuh' },
    ],
    correctAnswer: 'A',
    explanation:
      'Di dalam komputer, saklar mikroskopis mengenali angka 1 sebagai keadaan ada aliran listrik (High/ON) dan angka 0 sebagai keadaan tidak ada tegangan/aliran listrik (Low/OFF).',
  },

  // --- SOAL 10 ---
  {
    id: 10,
    type: 'pg',
    topic: 'Satuan Data Digital',
    competency: 'Menginterpretasikan teknologi digital dengan benar',
    level: 'L1',
    difficulty: 'Mudah',
    indicator: 'Peserta didik dapat menyebutkan satuan data terkecil dalam sistem komputer.',
    text: 'Satuan penyimpanan data digital terkecil di dalam komputer yang hanya bernilai satu digit biner (0 atau 1) disebut...',
    options: [
      { id: 'A', text: 'Bit (Binary Digit)' },
      { id: 'B', text: 'Kilogram' },
      { id: 'C', text: 'Centimeter' },
      { id: 'D', text: 'Liter' },
    ],
    correctAnswer: 'A',
    explanation:
      'Bit (singkatan dari Binary Digit) adalah satuan terkecil penyimpanan informasi digital. 8 bit yang digabung bersama akan membentuk 1 Byte.',
  },

  // --- SOAL 11 ---
  {
    id: 11,
    type: 'pg',
    topic: 'Satuan Data Byte',
    competency: 'Menginterpretasikan teknologi digital dengan benar',
    level: 'L2',
    difficulty: 'Sedang',
    indicator: 'Peserta didik dapat menghitung hubungan antara bit dan byte.',
    text: 'Jika 1 Byte terdiri dari 8 bit, maka banyaknya bit pada data berukuran 3 Byte adalah...',
    options: [
      { id: 'A', text: '11 bit' },
      { id: 'B', text: '16 bit' },
      { id: 'C', text: '24 bit' },
      { id: 'D', text: '32 bit' },
    ],
    correctAnswer: 'C',
    explanation:
      'Karena 1 Byte = 8 bit, maka 3 Byte = 3 × 8 = 24 bit.',
  },

  // --- SOAL 12 ---
  {
    id: 12,
    type: 'pg',
    topic: 'Perangkat Keras (Hardware)',
    competency: 'Menginterpretasikan teknologi digital dengan benar',
    level: 'L1',
    difficulty: 'Mudah',
    indicator: 'Peserta didik dapat mengelompokkan perangkat keras masukan (input device).',
    text: 'Perangkat komputer yang berfungsi untuk memasukkan data tulisan atau huruf ke dalam komputer oleh pengguna disebut...',
    options: [
      { id: 'A', text: 'Monitor' },
      { id: 'B', text: 'Keyboard (Papan Ketik)' },
      { id: 'C', text: 'Speaker' },
      { id: 'D', text: 'Printer' },
    ],
    correctAnswer: 'B',
    explanation:
      'Keyboard adalah perangkat input yang digunakan pengguna untuk memasukkan huruf, angka, dan perintah ke dalam sistem komputer.',
  },

  // --- SOAL 13 ---
  {
    id: 13,
    type: 'pg',
    topic: 'Perangkat Lunak (Software)',
    competency: 'Menginterpretasikan teknologi digital dengan benar',
    level: 'L2',
    difficulty: 'Mudah',
    indicator: 'Peserta didik dapat membedakan perangkat keras dan perangkat lunak.',
    text: 'Kumpulan instruksi kode atau program yang tidak berwujud fisik namun dapat dijalankan di komputer untuk mengerjakan tugas tertentu dinamakan...',
    options: [
      { id: 'A', text: 'Perangkat Lunak (Software)' },
      { id: 'B', text: 'Perangkat Keras (Hardware)' },
      { id: 'C', text: 'Kabel Listrik' },
      { id: 'D', text: 'Stop Kontak' },
    ],
    correctAnswer: 'A',
    explanation:
      'Software (perangkat lunak) adalah program atau kode perintah yang menginstruksikan hardware komputer apa yang harus dilakukan, misalnya aplikasi browser, Scratch koding, dan sistem operasi.',
  },

  // --- SOAL 14 ---
  {
    id: 14,
    type: 'pg',
    topic: 'Sejarah Media Penyimpanan',
    competency: 'Menjelaskan sejarah teknologi digital dengan runtut',
    level: 'L2',
    difficulty: 'Sedang',
    indicator: 'Peserta didik dapat menyusun urutan kronologis media penyimpanan data komputer.',
    text: 'Perhatikan urutan evolusi media penyimpanan data komputer berikut:\n(1) Kartu Plong (Punch Card) kertas\n(2) Disket (Floppy Disk) magnetik\n(3) Flashdisk USB / Cloud Storage (Penyimpanan Awan)\nUrutan perkembangan media penyimpanan data dari yang paling awal hingga paling modern adalah...',
    image: `<svg viewBox="0 0 380 90" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-sm mx-auto">
      <rect width="380" height="90" rx="8" fill="#F8FAFC" stroke="#E2E8F0"/>
      <!-- card 1 -->
      <rect x="20" y="15" width="80" height="60" rx="4" fill="#FEF3C7" stroke="#D97706"/>
      <text x="60" y="42" font-size="9" font-weight="bold" fill="#92400E" text-anchor="middle">(1) Punch Card</text>
      <text x="60" y="55" font-size="8" fill="#B45309" text-anchor="middle">Tahun 1900-an</text>
      <!-- arrow 1 -->
      <path d="M 110 45 L 130 45 M 125 40 L 130 45 L 125 50" stroke="#64748B" stroke-width="2"/>
      <!-- card 2 -->
      <rect x="140" y="15" width="80" height="60" rx="4" fill="#E0E7FF" stroke="#4F46E5"/>
      <text x="180" y="42" font-size="9" font-weight="bold" fill="#3730A3" text-anchor="middle">(2) Disket</text>
      <text x="180" y="55" font-size="8" fill="#4338CA" text-anchor="middle">Era 1980-an</text>
      <!-- arrow 2 -->
      <path d="M 230 45 L 250 45 M 245 40 L 250 45 L 245 50" stroke="#64748B" stroke-width="2"/>
      <!-- card 3 -->
      <rect x="260" y="15" width="100" height="60" rx="4" fill="#DCFCE7" stroke="#16A34A"/>
      <text x="310" y="40" font-size="9" font-weight="bold" fill="#166534" text-anchor="middle">(3) Cloud &amp; USB</text>
      <text x="310" y="54" font-size="8" fill="#15803D" text-anchor="middle">Era Modern</text>
    </svg>`,
    options: [
      { id: 'A', text: '(1) -> (2) -> (3)' },
      { id: 'B', text: '(3) -> (2) -> (1)' },
      { id: 'C', text: '(2) -> (1) -> (3)' },
      { id: 'D', text: '(1) -> (3) -> (2)' },
    ],
    correctAnswer: 'A',
    explanation:
      'Perkembangan media penyimpanan data diawali dari kartu berlubang (Punch card) kertas, kemudian berkembang menjadi disket magnetik berkapasitas 1,44 MB, hingga kini menggunakan flashdisk dan Cloud Storage di internet.',
  },

  // --- SOAL 15 ---
  {
    id: 15,
    type: 'pg',
    topic: 'Sejarah Internet',
    competency: 'Menjelaskan sejarah teknologi digital dengan runtut',
    level: 'L1',
    difficulty: 'Sedang',
    indicator: 'Peserta didik dapat menyebutkan nama jaringan komputer pertama yang menjadi cikal bakal internet.',
    text: 'Cikal bakal jaringan internet di dunia berawal dari proyek jaringan komputer milik Departemen Pertahanan Amerika Serikat pada tahun 1969 yang dinamakan...',
    options: [
      { id: 'A', text: 'ARPANET' },
      { id: 'B', text: 'FACEBOOK' },
      { id: 'C', text: 'BLUETOOTH' },
      { id: 'D', text: 'HOTSPOT' },
    ],
    correctAnswer: 'A',
    explanation:
      'ARPANET (Advanced Research Projects Agency Network) dibuat pada tahun 1969 dan berhasil menghubungkan 4 komputer universitas di Amerika Serikat. Ini adalah cikal bakal lahirnya jaringan internet dunia.',
  },

  // --- SOAL 16 ---
  {
    id: 16,
    type: 'pg',
    topic: 'Sejarah Web & Browser',
    competency: 'Menjelaskan sejarah teknologi digital dengan runtut',
    level: 'L1',
    difficulty: 'Sedang',
    indicator: 'Peserta didik dapat mengenali penemu World Wide Web (WWW).',
    text: 'Tokoh ilmuwan yang menciptakan sistem World Wide Web (WWW) pada tahun 1989 sehingga informasi internet dapat diakses melalui halaman web grafis adalah...',
    options: [
      { id: 'A', text: 'Tim Berners-Lee' },
      { id: 'B', text: 'Steve Jobs' },
      { id: 'C', text: 'Mark Zuckerberg' },
      { id: 'D', text: 'Elon Musk' },
    ],
    correctAnswer: 'A',
    explanation:
      'Sir Tim Berners-Lee menemukan World Wide Web (WWW), bahasa HTML, dan browser web pertama di laboratorium CERN Swiss pada tahun 1989.',
  },

  // --- SOAL 17 ---
  {
    id: 17,
    type: 'pg',
    topic: 'Perkembangan Telepon Seluler',
    competency: 'Menjelaskan sejarah teknologi digital dengan runtut',
    level: 'L2',
    difficulty: 'Mudah',
    indicator: 'Peserta didik dapat membandingkan handphone jadul generasi 1G/2G dengan smartphone modern.',
    text: 'Jika telepon seluler generasi awal hanya dapat digunakan untuk melakukan panggilan suara dan mengirim pesan teks pendek (SMS), smartphone modern saat ini memiliki keunggulan berupa...',
    options: [
      { id: 'A', text: 'Mendukung panggilan video, internet berkecepatan tinggi, navigasi GPS, dan layar sentuh' },
      { id: 'B', text: 'Memiliki antena besi yang panjang dan berat 2 kilogram' },
      { id: 'C', text: 'Hanya bisa digunakan bila terhubung dengan kabel tiang telepon' },
      { id: 'D', text: 'Layar monokrom hitam putih tanpa warna' },
    ],
    correctAnswer: 'A',
    explanation:
      'Smartphone masa kini menggabungkan komputer mini dengan kamera canggih, sensor GPS, akses internet 4G/5G, dan layar sentuh yang serbaguna.',
  },

  // --- SOAL 18 ---
  {
    id: 18,
    type: 'pg',
    topic: 'Penyimpanan Awan (Cloud Computing)',
    competency: 'Menginterpretasikan teknologi digital dengan benar',
    level: 'L2',
    difficulty: 'Sedang',
    indicator: 'Peserta didik dapat menginterpretasikan konsep komputasi awan (Cloud Storage).',
    text: 'Perhatikan gambar layanan Google Drive di atas!\nTeknologi yang memungkinkan kita menyimpan file dokumen, foto, dan tugas sekolah di server internet sehingga bisa dibuka dari komputer mana saja disebut...',
    image: `<svg viewBox="0 0 360 120" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-sm mx-auto">
      <rect width="360" height="120" rx="10" fill="#F0F9FF" stroke="#BAE6FD" stroke-width="1.5"/>
      <g transform="translate(130, 20)">
        <path d="M 25 45 A 20 20 0 0 1 50 25 A 30 30 0 0 1 95 30 A 20 20 0 0 1 105 55 L 20 55 A 15 15 0 0 1 25 45 Z" fill="#38BDF8" stroke="#0284C7" stroke-width="2"/>
        <text x="62" y="47" font-size="10" font-weight="bold" fill="#0C4A6E" text-anchor="middle">CLOUD</text>
      </g>
      <text x="180" y="105" font-size="11" font-weight="bold" fill="#0369A1" text-anchor="middle">Komputasi &amp; Penyimpanan Awan (Cloud Computing)</text>
    </svg>`,
    options: [
      { id: 'A', text: 'Cloud Storage (Penyimpanan Awan)' },
      { id: 'B', text: 'Kaset Pita Tape' },
      { id: 'C', text: 'Kertas Kalkir' },
      { id: 'D', text: 'Piringan Hitam' },
    ],
    correctAnswer: 'A',
    explanation:
      'Cloud Storage adalah media penyimpanan online di mana data disimpan di server jarak jauh penyedia layanan dan dapat diakses kapan saja melalui jaringan internet.',
  },

  // --- SOAL 19 ---
  {
    id: 19,
    type: 'pg',
    topic: 'Manfaat Digital di Pendidikan',
    competency: 'Menganalisis manfaat digital dalam kehidupan sehari-hari dengan tepat',
    level: 'L2',
    difficulty: 'Mudah',
    indicator: 'Peserta didik dapat menentukan contoh penerapan teknologi digital dalam bidang pendidikan.',
    text: 'Siswa kelas 5 SD Negeri 3 Loloan Timur dapat mengerjakan tugas koding secara daring, mengunduh modul belajar, dan membaca buku digital. Hal ini merupakan manfaat teknologi digital dalam bidang...',
    options: [
      { id: 'A', text: 'Pendidikan (E-Learning)' },
      { id: 'B', text: 'Pertambangan minyak bumi' },
      { id: 'C', text: 'Pabrik tekstil pakaian' },
      { id: 'D', text: 'Peternakan sapi potong' },
    ],
    correctAnswer: 'A',
    explanation:
      'Pemanfaatan aplikasi ujian digital, Google Classroom, dan platform koding merupakan wujud nyata manfaat teknologi digital di bidang pendidikan (Education/E-Learning).',
  },

  // --- SOAL 20 ---
  {
    id: 20,
    type: 'pg',
    topic: 'Manfaat Digital di Perdagangan (E-Commerce)',
    competency: 'Menganalisis manfaat digital dalam kehidupan sehari-hari dengan tepat',
    level: 'L2',
    difficulty: 'Mudah',
    indicator: 'Peserta didik dapat mengidentifikasi istilah jual beli online.',
    text: 'Ibu berbelanja kebutuhan buku sekolah melalui aplikasi di smartphone tanpa harus datang langsung ke toko fisik, lalu barang diantar kurir ke rumah. Kegiatan jual beli barang lewat internet ini dikenal dengan istilah...',
    options: [
      { id: 'A', text: 'E-Commerce (Perdagangan Elektronik)' },
      { id: 'B', text: 'Barter Tradisional' },
      { id: 'C', text: 'Pasar Apung' },
      { id: 'D', text: 'Pelelangan Kayu' },
    ],
    correctAnswer: 'A',
    explanation:
      'E-Commerce atau toko online adalah aktivitas jual beli barang dan jasa yang memanfaatkan jaringan internet dan platform digital.',
  },

  // --- SOAL 21 ---
  {
    id: 21,
    type: 'pg',
    topic: 'Pembayaran Digital',
    competency: 'Menganalisis manfaat digital dalam kehidupan sehari-hari dengan tepat',
    level: 'L2',
    difficulty: 'Mudah',
    indicator: 'Peserta didik dapat mengenali teknologi pembayaran kode QR (QRIS).',
    text: 'Perhatikan gambar kode kotak hitam-putih di atas!\nTeknologi kode dua dimensi yang digunakan untuk melakukan pembayaran digital non-tunai secara cepat menggunakan kamera smartphone di Indonesia dinamakan...',
    image: `<svg viewBox="0 0 360 120" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-sm mx-auto">
      <rect width="360" height="120" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
      <g transform="translate(145, 12)">
        <rect x="0" y="0" width="70" height="70" rx="6" fill="#F8FAFC" stroke="#0F172A" stroke-width="2"/>
        <!-- QR markers -->
        <rect x="8" y="8" width="18" height="18" fill="#0F172A"/>
        <rect x="12" y="12" width="10" height="10" fill="#FFFFFF"/>
        <rect x="14" y="14" width="6" height="6" fill="#0F172A"/>

        <rect x="44" y="8" width="18" height="18" fill="#0F172A"/>
        <rect x="48" y="12" width="10" height="10" fill="#FFFFFF"/>
        <rect x="50" y="14" width="6" height="6" fill="#0F172A"/>

        <rect x="8" y="44" width="18" height="18" fill="#0F172A"/>
        <rect x="12" y="48" width="10" height="10" fill="#FFFFFF"/>
        <rect x="14" y="50" width="6" height="6" fill="#0F172A"/>
        <!-- random dots -->
        <rect x="32" y="32" width="6" height="6" fill="#EF4444"/>
        <rect x="44" y="44" width="6" height="6" fill="#0F172A"/>
      </g>
      <text x="180" y="105" font-size="11" font-weight="bold" fill="#0F172A" text-anchor="middle">Standar Kode Pembayaran Digital (QRIS)</text>
    </svg>`,
    options: [
      { id: 'A', text: 'QR Code / QRIS' },
      { id: 'B', text: 'Surat Berharga' },
      { id: 'C', text: 'Kwitansi Kertas' },
      { id: 'D', text: 'Kupon Hadiah' },
    ],
    correctAnswer: 'A',
    explanation:
      'QRIS (Quick Response Code Indonesian Standard) adalah teknologi kode QR terpadu yang memfasilitasi transaksi non-tunai di Indonesia melalui dompet digital dan perbankan digital.',
  },

  // --- SOAL 22 ---
  {
    id: 22,
    type: 'pg',
    topic: 'Internet of Things (IoT)',
    competency: 'Menginterpretasikan teknologi digital dengan benar',
    level: 'L3',
    difficulty: 'Sukar',
    indicator: 'Peserta didik dapat menganalisis konsep Internet of Things (IoT).',
    text: 'Lampu kamar, pendingin ruangan (AC), dan kunci pintu rumah yang dapat dikendalikan dari jarak jauh melalui smartphone di mana saja terhubung melalui konsep...',
    options: [
      { id: 'A', text: 'Internet of Things (IoT / Internet untuk Segala Benda)' },
      { id: 'B', text: 'Surat Pos Kilat' },
      { id: 'C', text: 'Panggilan Telepon Rumah Kabel' },
      { id: 'D', text: 'Mesin Ketik Manual' },
    ],
    correctAnswer: 'A',
    explanation:
      'Internet of Things (IoT) adalah konsep di mana berbagai peralatan rumah tangga dipasangi sensor dan terhubung ke internet sehingga dapat saling berkomunikasi dan dikendalikan pengguna dari aplikasi gawai.',
  },

  // --- SOAL 23 ---
  {
    id: 23,
    type: 'pg',
    topic: 'Kecerdasan Buatan (AI)',
    competency: 'Menganalisis manfaat digital dalam kehidupan sehari-hari dengan tepat',
    level: 'L2',
    difficulty: 'Sedang',
    indicator: 'Peserta didik dapat mengidentifikasi pemanfaatan Artificial Intelligence (AI).',
    text: 'Sistem komputer yang dirancang mampu mengenali wajah manusia pada kamera ponsel atau mengenali perintah suara pengguna (seperti Google Assistant) memanfaatkan teknologi...',
    options: [
      { id: 'A', text: 'Artificial Intelligence (Kecerdasan Buatan)' },
      { id: 'B', text: 'Roda Gigi Jam Mekanik' },
      { id: 'C', text: 'Tenaga Uap Air' },
      { id: 'D', text: 'Kabel Telegraf' },
    ],
    correctAnswer: 'A',
    explanation:
      'Kecerdasan Buatan (AI / Artificial Intelligence) memungkinkan sistem komputer untuk belajar memproses data seperti pengenalan wajah, suara, dan teks layaknya kecerdasan manusia.',
  },

  // --- SOAL 24 ---
  {
    id: 24,
    type: 'pg',
    topic: 'Algoritma Pemrograman',
    competency: 'Menginterpretasikan teknologi digital dengan benar',
    level: 'L2',
    difficulty: 'Sedang',
    indicator: 'Peserta didik dapat mengartikan definisi algoritma dalam koding.',
    text: 'Perhatikan diagram alur koding di atas!\nUrutan langkah-langkah logis dan teratur yang disusun untuk memecahkan suatu masalah atau menjalankan perintah komputer disebut...',
    image: `<svg viewBox="0 0 380 110" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-sm mx-auto">
      <rect width="380" height="110" rx="10" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5"/>
      <!-- flow shapes -->
      <g transform="translate(30, 20)">
        <rect x="0" y="10" width="75" height="32" rx="16" fill="#10B981"/>
        <text x="37" y="30" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">MULAI</text>

        <path d="M 75 26 L 105 26 M 100 22 L 105 26 L 100 30" stroke="#475569" stroke-width="2"/>

        <rect x="105" y="10" width="90" height="32" rx="6" fill="#3B82F6"/>
        <text x="150" y="30" font-size="10" font-weight="bold" fill="#FFFFFF" text-anchor="middle">LANGKAH 1</text>

        <path d="M 195 26 L 225 26 M 220 22 L 225 26 L 220 30" stroke="#475569" stroke-width="2"/>

        <rect x="225" y="10" width="75" height="32" rx="16" fill="#EF4444"/>
        <text x="262" y="30" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">SELESAI</text>
      </g>
      <text x="190" y="90" font-size="11" font-weight="bold" fill="#0F172A" text-anchor="middle">Bagan Alir Urutan Perintah Komputer</text>
    </svg>`,
    options: [
      { id: 'A', text: 'Algoritma' },
      { id: 'B', text: 'Virus Komputer' },
      { id: 'C', text: 'Stopkontak' },
      { id: 'D', text: 'Monitor' },
    ],
    correctAnswer: 'A',
    explanation:
      'Algoritma adalah serangkaian instruksi terstruktur dan runtut yang diikuti oleh komputer untuk menyelesaikan suatu tugas komputasi.',
  },

  // --- SOAL 25 ---
  {
    id: 25,
    type: 'pg',
    topic: 'Koding Visual Blok',
    competency: 'Menginterpretasikan teknologi digital dengan benar',
    level: 'L2',
    difficulty: 'Mudah',
    indicator: 'Peserta didik dapat mengidentifikasi aplikasi koding berbasis blok warna-warni.',
    text: 'Aplikasi pemrograman ramah anak yang menggunakan balok-balok kode warna-warni (seperti puzzle) yang disusun untuk membuat animasi dan game sederhana disebut...',
    options: [
      { id: 'A', text: 'Scratch' },
      { id: 'B', text: 'Kalkulator Beras' },
      { id: 'C', text: 'Mesin Tik Manual' },
      { id: 'D', text: 'Radio FM' },
    ],
    correctAnswer: 'A',
    explanation:
      'Scratch adalah perangkat lunak koding visual berbasis blok yang dikembangkan MIT untuk mengenalkan konsep logika pemrograman kepada siswa sejak usia sekolah dasar.',
  },

  // --- SOAL 26 ---
  {
    id: 26,
    type: 'pg',
    topic: 'Keamanan Digital (Password)',
    competency: 'Menganalisis manfaat digital dalam kehidupan sehari-hari dengan tepat',
    level: 'L3',
    difficulty: 'Sedang',
    indicator: 'Peserta didik dapat menganalisis pembuatan kata sandi (password) yang kuat dan aman.',
    text: 'Agar akun belajar digital dan data pribadi siswa terlindung dari akses pihak yang tidak bertanggung jawab, kriteria kata sandi (password) yang paling aman adalah...',
    options: [
      { id: 'A', text: 'Kombinasi huruf besar, huruf kecil, angka, dan simbol unik minimal 8 karakter' },
      { id: 'B', text: 'Hanya angka urut 12345678' },
      { id: 'C', text: 'Tanggal lahir sendiri yang mudah ditebak teman' },
      { id: 'D', text: 'Kata "password" atau "rahasia"' },
    ],
    correctAnswer: 'A',
    explanation:
      'Kata sandi yang kuat harus menggabungkan huruf kapital, huruf kecil, angka, dan simbol serta tidak memakai informasi umum seperti tanggal lahir atau deretan angka sederhana.',
  },

  // --- SOAL 27 ---
  {
    id: 27,
    type: 'pg',
    topic: 'Etika Bermedia Digital',
    competency: 'Menganalisis manfaat digital dalam kehidupan sehari-hari dengan tepat',
    level: 'L3',
    difficulty: 'Sedang',
    indicator: 'Peserta didik dapat menerapkan etika yang baik dalam berkomunikasi di ruang digital.',
    text: 'Saat berkomunikasi di grup pesan sekolah atau media sosial, tindakan yang mencerminkan etika digital (netiket) yang terpuji adalah...',
    options: [
      { id: 'A', text: 'Menggunakan bahasa yang sopan, menghargai pendapat teman, dan tidak menyebarkan berita bohong (hoaks)' },
      { id: 'B', text: 'Mengejek dan menulis komentar kasar menggunakan nama samaran' },
      { id: 'C', text: 'Menyebarkan foto aib teman tanpa izin' },
      { id: 'D', text: 'Meneruskan pesan berantai yang belum jelas kebenarannya' },
    ],
    correctAnswer: 'A',
    explanation:
      'Etika digital mengajarkan warga digital untuk selalu bertutur kata sopan, menjaga rasa hormat, melindungi privasi orang lain, dan menyaring kebenaran informasi sebelum membagikannya.',
  },

  // --- SOAL 28 ---
  {
    id: 28,
    type: 'pg',
    topic: 'Manfaat Digital di Bidang Kesehatan (Telemedicine)',
    competency: 'Menganalisis manfaat digital dalam kehidupan sehari-hari dengan tepat',
    level: 'L2',
    difficulty: 'Sedang',
    indicator: 'Peserta didik dapat menganalisis manfaat teknologi digital dalam bidang kesehatan.',
    text: 'Saat ini pasien dapat berkonsultasi dengan dokter dan mendapatkan resep obat melalui aplikasi di ponsel tanpa harus antre lama di rumah sakit. Layanan kesehatan digital jarak jauh ini dinamakan...',
    options: [
      { id: 'A', text: 'Telemedicine' },
      { id: 'B', text: 'Telegraf' },
      { id: 'C', text: 'Telepon Koin' },
      { id: 'D', text: 'Pemberitahuan Radio' },
    ],
    correctAnswer: 'A',
    explanation:
      'Telemedicine adalah penggunaan teknologi komunikasi digital untuk memberikan layanan medis jarak jauh, seperti konsultasi dokter, pemantauan kesehatan, dan pengiriman resep.',
  },

  // --- SOAL 29 ---
  {
    id: 29,
    type: 'pg',
    topic: 'Manfaat Digital di Transportasi Online',
    competency: 'Menganalisis manfaat digital dalam kehidupan sehari-hari dengan tepat',
    level: 'L2',
    difficulty: 'Mudah',
    indicator: 'Peserta didik dapat menganalisis fitur navigasi digital pada transportasi daring.',
    text: 'Aplikasi ojek dan taksi online dapat melacak lokasi penjemputan penumpang dan menghitung perkiraan tarif secara akurat berkat bantuan teknologi navigasi satelit digital, yaitu...',
    options: [
      { id: 'A', text: 'GPS (Global Positioning System)' },
      { id: 'B', text: 'Kompas Jarum Magnet' },
      { id: 'C', text: 'Bintang Pari di Langit' },
      { id: 'D', text: 'Jam Pasir' },
    ],
    correctAnswer: 'A',
    explanation:
      'GPS menggunakan konstelasi satelit di orbit bumi untuk menentukan koordinat posisi gawai secara presisi sehingga aplikasi peta dan transportasi dapat memandu arah secara langsung.',
  },

  // --- SOAL 30 ---
  {
    id: 30,
    type: 'pg',
    topic: 'Dampak Negatif & Pengelolaan Waktu Layar (Screen Time)',
    competency: 'Menganalisis manfaat digital dalam kehidupan sehari-hari dengan tepat',
    level: 'L3',
    difficulty: 'Sedang',
    indicator: 'Peserta didik dapat menganalisis cara mencegah dampak negatif penggunaan gawai digital.',
    text: 'Terlalu lama menatap layar gawai (gadget) hingga larut malam dapat menyebabkan gangguan kesehatan mata dan kurang tidur. Cara bijak mencegah dampak negatif ini adalah...',
    options: [
      { id: 'A', text: 'Membatasi waktu penggunaan (screen time) dan meluangkan waktu berolahraga di luar ruangan' },
      { id: 'B', text: 'Bermain game di ponsel hingga pagi hari' },
      { id: 'C', text: 'Menatap layar dalam ruangan yang gelap gulita' },
      { id: 'D', text: 'Mendekatkan layar gawai ke mata kurang dari 5 centimeter' },
    ],
    correctAnswer: 'A',
    explanation:
      'Keseimbangan hidup digital (digital wellbeing) sangat penting bagi anak sekolah, dengan membatasi screen time maksimal 1-2 jam sehari, beristirahat setiap 20 menit, dan aktif bergerak di dunia nyata.',
  },

  // --- SOAL 31 ---
  {
    id: 31,
    type: 'pg',
    topic: 'Evolusi Layar Komputer',
    competency: 'Menjelaskan sejarah teknologi digital dengan runtut',
    level: 'L2',
    difficulty: 'Sedang',
    indicator: 'Peserta didik dapat membedakan monitor tabung kaca CRT dengan layar datar LED/LCD.',
    text: 'Komputer masa lalu menggunakan monitor tabung cembung yang tebal dan memakan tempat (tabung CRT). Kini layar komputer berevolusi menjadi sangat tipis, jernih, dan hemat daya menggunakan teknologi...',
    options: [
      { id: 'A', text: 'LED / LCD Flat Screen' },
      { id: 'B', text: 'Kaca Spion Mobil' },
      { id: 'C', text: 'Cermin Rias' },
      { id: 'D', text: 'Kertas Mika' },
    ],
    correctAnswer: 'A',
    explanation:
      'Layar modern menggunakan panel LCD (Liquid Crystal Display) atau LED/OLED yang berbentuk pipih, sangat ringan, beresolusi tinggi, dan jauh lebih hemat konsumsi daya dibanding monitor CRT jadul.',
  },

  // --- SOAL 32 ---
  {
    id: 32,
    type: 'pg',
    topic: 'Logika Pemrograman (Percabangan IF-ELSE)',
    competency: 'Menginterpretasikan teknologi digital dengan benar',
    level: 'L3',
    difficulty: 'Sukar',
    indicator: 'Peserta didik dapat menginterpretasikan logika percabangan kondisional pada koding.',
    text: 'Perhatikan potongan logika koding berikut:\n"JIKA skor tes >= 60 MAKA status = Tuntas, SELAIN ITU status = Remedial".\nJika seorang siswa memperoleh skor 75, maka status yang ditampilkan komputer adalah...',
    options: [
      { id: 'A', text: 'Tuntas' },
      { id: 'B', text: 'Remedial' },
      { id: 'C', text: 'Kosong' },
      { id: 'D', text: 'Eror' },
    ],
    correctAnswer: 'A',
    explanation:
      'Karena nilai siswa adalah 75, dan 75 lebih besar atau sama dengan 60 (kondisi bernilai BENAR/TRUE), maka komputer akan menjalankan blok perintah pertama yaitu "Tuntas".',
  },

  // --- SOAL 33 ---
  {
    id: 33,
    type: 'pg',
    topic: 'Pertanian Cerdas (Smart Agriculture)',
    competency: 'Menganalisis manfaat digital dalam kehidupan sehari-hari dengan tepat',
    level: 'L3',
    difficulty: 'Sukar',
    indicator: 'Peserta didik dapat menganalisis pemanfaatan teknologi digital pada sektor pertanian modern.',
    text: 'Petani modern di era digital dapat menyiram tanaman secara otomatis hanya jika sensor mendeteksi tanah sedang kering, serta memantau pertumbuhan padi menggunakan drone berkamera. Penerapan ini disebut...',
    options: [
      { id: 'A', text: 'Smart Agriculture (Pertanian Cerdas Berbasis Digital)' },
      { id: 'B', text: 'Membajak sawah dengan tenaga kerbau manual' },
      { id: 'C', text: 'Menjemur padi di pinggir jalan raya' },
      { id: 'D', text: 'Menampi beras dengan tampah bambu' },
    ],
    correctAnswer: 'A',
    explanation:
      'Pertanian cerdas (Smart Agriculture) menggabungkan sensor IoT tanah, drone pemantau, dan kecerdasan buatan untuk mengoptimalkan hasil panen secara presisi dan hemat air.',
  },

  // --- SOAL 34 ---
  {
    id: 34,
    type: 'pg',
    topic: 'Penyimpanan Data USB Flashdrive',
    competency: 'Menjelaskan sejarah teknologi digital dengan runtut',
    level: 'L1',
    difficulty: 'Mudah',
    indicator: 'Peserta didik dapat mengenali kepanjangan singkatan USB pada teknologi digital.',
    text: 'Kabel penghubung dan colokan port serbaguna pada perangkat komputer dan smartphone dikenal dengan singkatan USB. Kepanjangan dari USB adalah...',
    options: [
      { id: 'A', text: 'Universal Serial Bus' },
      { id: 'B', text: 'Unit Sinyal Baru' },
      { id: 'C', text: 'United States Bank' },
      { id: 'D', text: 'Ultra Speed Battery' },
    ],
    correctAnswer: 'A',
    explanation:
      'USB adalah singkatan dari Universal Serial Bus, standar industri untuk kabel, konektor, dan protokol komunikasi antarmuka perangkat keras komputer.',
  },

  // --- SOAL 35 ---
  {
    id: 35,
    type: 'pg',
    topic: 'Kecerdasan Buatan & Robotika',
    competency: 'Menganalisis manfaat digital dalam kehidupan sehari-hari dengan tepat',
    level: 'L3',
    difficulty: 'Sedang',
    indicator: 'Peserta didik dapat memprediksi masa depan teknologi digital dalam membantu pekerjaan manusia.',
    text: 'Di pabrik pembuatan mobil modern, pekerjaan merakit dan mengecat komponen berat dilakukan oleh lengan robot yang diprogram komputer. Manfaat utama robotika dalam kegiatan tersebut adalah...',
    options: [
      { id: 'A', text: 'Meningkatkan ketepatan hasil produksi, mempercepat waktu pengerjaan, dan menjaga keselamatan pekerja' },
      { id: 'B', text: 'Membuat pabrik menjadi lambat dan sering berhenti' },
      { id: 'C', text: 'Menghabiskan banyak kertas kantor' },
      { id: 'D', text: 'Mengharuskan pekerja mengangkat beban ratusan kilogram secara manual' },
    ],
    correctAnswer: 'A',
    explanation:
      'Penggunaan robot industri membantu pabrik bekerja dengan akurasi mikro-milimeter secara konsisten 24 jam tanpa lelah, serta melindungi manusia dari tugas-tugas berisiko tinggi.',
  },

  // ==========================================
  // BAGIAN II: PILIHAN GANDA KOMPLEKS KATEGORI (5 SOAL)
  // Setiap soal memiliki 3 deskripsi/pernyataan yang harus direspons Benar atau Salah
  // ==========================================

  // --- SOAL 36 (PGK Kategori 1) ---
  {
    id: 36,
    type: 'pgk_kategori',
    topic: 'Konsep Sinyal dan Sistem Biner',
    competency: 'Menginterpretasikan teknologi digital dengan benar',
    level: 'L2',
    difficulty: 'Sedang',
    indicator: 'Peserta didik dapat memverifikasi kebenaran pernyataan terkait karakteristik sinyal dan kode biner.',
    text: 'Perhatikan gambar perbandingan sinyal analog dan digital di atas!\nTentukan apakah masing-masing pernyataan berikut BENAR atau SALAH berdasarkan karakteristik teknologi digital:',
    image: `<svg viewBox="0 0 380 110" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-sm mx-auto">
      <rect width="380" height="110" rx="10" fill="#F8FAFC" stroke="#CBD5E1"/>
      <g transform="translate(20, 15)">
        <rect x="0" y="0" width="160" height="80" rx="6" fill="#EFF6FF" stroke="#3B82F6"/>
        <text x="80" y="24" font-size="11" font-weight="bold" fill="#1E40AF" text-anchor="middle">Sinyal Analog</text>
        <path d="M 20 52 Q 40 25, 60 52 T 100 52 T 140 52" fill="none" stroke="#2563EB" stroke-width="2"/>
        <text x="80" y="70" font-size="9" fill="#1E3A8A" text-anchor="middle">Gelombang Berkelanjutan</text>
      </g>
      <g transform="translate(200, 15)">
        <rect x="0" y="0" width="160" height="80" rx="6" fill="#F0FDF4" stroke="#16A34A"/>
        <text x="80" y="24" font-size="11" font-weight="bold" fill="#15803D" text-anchor="middle">Sinyal Digital</text>
        <path d="M 20 60 L 40 60 L 40 38 L 60 38 L 60 60 L 80 60 L 80 38 L 100 38 L 100 60 L 120 60 L 120 38 L 140 38" fill="none" stroke="#16A34A" stroke-width="2"/>
        <text x="80" y="74" font-size="9" font-weight="bold" fill="#047857" text-anchor="middle">Diskret: [ 0 ] &amp; [ 1 ]</text>
      </g>
    </svg>`,
    statements: [
      {
        id: 's1',
        text: 'Sinyal digital mengirimkan informasi dalam bentuk gelombang kotak diskret yang terdiri dari kombinasi angka 0 dan 1.',
        correctAnswer: true,
      },
      {
        id: 's2',
        text: 'Komputer digital dapat memproses data huruf dan suara tanpa perlu mengubahnya menjadi kode biner terlebih dahulu.',
        correctAnswer: false,
      },
      {
        id: 's3',
        text: 'Satu Byte penyimpanan data dalam sistem komputasi setara dengan kumpulan 8 bit digit biner.',
        correctAnswer: true,
      },
    ],
    explanation:
      'Pernyataan 1 BENAR (sinyal digital bersifat diskret 0 dan 1). Pernyataan 2 SALAH (semua suara, teks, dan gambar wajib dikonversi menjadi biner 0 dan 1 agar dapat diolah CPU). Pernyataan 3 BENAR (1 Byte = 8 bit).',
  },

  // --- SOAL 37 (PGK Kategori 2) ---
  {
    id: 37,
    type: 'pgk_kategori',
    topic: 'Sejarah Evolusi Komputer dan Komponennya',
    competency: 'Menjelaskan sejarah teknologi digital dengan runtut',
    level: 'L2',
    difficulty: 'Sedang',
    indicator: 'Peserta didik dapat mengevaluasi kebenaran fakta sejarah komputer dari generasi ke generasi.',
    text: 'Perhatikan infografis tahapan generasi komputer di atas!\nTentukan kebenaran masing-masing pernyataan berikut (BENAR atau SALAH):',
    image: `<svg viewBox="0 0 380 110" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-sm mx-auto">
      <rect width="380" height="110" rx="10" fill="#F1F5F9" stroke="#E2E8F0"/>
      <g transform="translate(15, 18)">
        <rect x="0" y="0" width="75" height="55" rx="5" fill="#FEF3C7" stroke="#D97706"/>
        <text x="37" y="24" font-size="9" font-weight="bold" fill="#92400E" text-anchor="middle">Gen 1 (1940)</text>
        <text x="37" y="42" font-size="8" fill="#78350F" text-anchor="middle">Tabung Hampa</text>

        <rect x="90" y="0" width="75" height="55" rx="5" fill="#E0E7FF" stroke="#4F46E5"/>
        <text x="127" y="24" font-size="9" font-weight="bold" fill="#3730A3" text-anchor="middle">Gen 2 (1950)</text>
        <text x="127" y="42" font-size="8" fill="#312E81" text-anchor="middle">Transistor</text>

        <rect x="180" y="0" width="75" height="55" rx="5" fill="#DCFCE7" stroke="#16A34A"/>
        <text x="217" y="24" font-size="9" font-weight="bold" fill="#166534" text-anchor="middle">Gen 3 (1960)</text>
        <text x="217" y="42" font-size="8" fill="#14532D" text-anchor="middle">Sirkuit IC</text>

        <rect x="270" y="0" width="80" height="55" rx="5" fill="#CFFAFE" stroke="#0891B2"/>
        <text x="310" y="24" font-size="9" font-weight="bold" fill="#155E75" text-anchor="middle">Gen 4 &amp; 5</text>
        <text x="310" y="42" font-size="8" fill="#164E63" text-anchor="middle">Mikroprosesor</text>
      </g>
      <text x="190" y="96" font-size="10" font-weight="bold" fill="#334155" text-anchor="middle">Garis Waktu Evolusi Komponen Komputer</text>
    </svg>`,
    statements: [
      {
        id: 's1',
        text: 'Komputer generasi pertama ENIAC berukuran sebesar ruangan kamar dan menghabiskan daya listrik yang sangat besar.',
        correctAnswer: true,
      },
      {
        id: 's2',
        text: 'Penemuan transistor membuat komputer menjadi lebih besar dan lebih lambat dibanding komputer tabung hampa.',
        correctAnswer: false,
      },
      {
        id: 's3',
        text: 'Mikroprosesor memungkinkan terciptanya komputer meja (PC), laptop, dan telepon pintar yang kita gunakan hari ini.',
        correctAnswer: true,
      },
    ],
    explanation:
      'Pernyataan 1 BENAR (ENIAC memiliki berat sekitar 30 ton dan mengisi ruangan 167 meter persegi). Pernyataan 2 SALAH (transistor justru membuat komputer berkali-kali lipat lebih kecil, cepat, dan dingin). Pernyataan 3 BENAR (mikroprosesor memicu revolusi PC dan gawai pintar).',
  },

  // --- SOAL 38 (PGK Kategori 3) ---
  {
    id: 38,
    type: 'pgk_kategori',
    topic: 'Pemanfaatan Internet dan Perangkat Pintar (IoT)',
    competency: 'Menganalisis manfaat digital dalam kehidupan sehari-hari dengan tepat',
    level: 'L3',
    difficulty: 'Sukar',
    indicator: 'Peserta didik dapat menilai efektivitas pemanfaatan Internet of Things dalam kehidupan rumah tangga modern.',
    text: 'Perhatikan ilustrasi ekosistem rumah pintar (Smart Home) di atas!\nTentukan kebenaran masing-masing pernyataan berikut mengenai Internet of Things (IoT):',
    image: `<svg viewBox="0 0 380 115" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-sm mx-auto">
      <rect width="380" height="115" rx="10" fill="#F8FAFC" stroke="#CBD5E1"/>
      <g transform="translate(145, 12)">
        <circle cx="45" cy="40" r="30" fill="#EEF2FF" stroke="#6366F1" stroke-width="2"/>
        <text x="45" y="44" font-size="10" font-weight="bold" fill="#4338CA" text-anchor="middle">ROUTER WI-FI</text>
      </g>
      <!-- Connected devices -->
      <rect x="25" y="25" width="75" height="28" rx="5" fill="#ECFDF5" stroke="#10B981"/>
      <text x="62" y="43" font-size="9" font-weight="bold" fill="#065F46" text-anchor="middle">CCTV Pintar</text>
      <line x1="100" y1="39" x2="160" y2="45" stroke="#10B981" stroke-dasharray="3 3"/>

      <rect x="25" y="65" width="75" height="28" rx="5" fill="#FEF3C7" stroke="#F59E0B"/>
      <text x="62" y="83" font-size="9" font-weight="bold" fill="#92400E" text-anchor="middle">Lampu Otomatis</text>
      <line x1="100" y1="75" x2="160" y2="60" stroke="#F59E0B" stroke-dasharray="3 3"/>

      <rect x="280" y="25" width="75" height="28" rx="5" fill="#EFF6FF" stroke="#3B82F6"/>
      <text x="317" y="43" font-size="9" font-weight="bold" fill="#1D4ED8" text-anchor="middle">Kunci Pintu</text>
      <line x1="220" y1="45" x2="280" y2="39" stroke="#3B82F6" stroke-dasharray="3 3"/>

      <rect x="280" y="65" width="75" height="28" rx="5" fill="#FCE7F3" stroke="#EC4899"/>
      <text x="317" y="83" font-size="9" font-weight="bold" fill="#9D174D" text-anchor="middle">AC &amp; Kulkas</text>
      <line x1="220" y1="60" x2="280" y2="75" stroke="#EC4899" stroke-dasharray="3 3"/>

      <text x="190" y="105" font-size="10" font-weight="bold" fill="#475569" text-anchor="middle">Peralatan Rumah Tangga Terkoneksi Internet</text>
    </svg>`,
    statements: [
      {
        id: 's1',
        text: 'Perangkat IoT membutuhkan koneksi jaringan internet atau Wi-Fi untuk mengirim dan menerima perintah dari smartphone pengguna.',
        correctAnswer: true,
      },
      {
        id: 's2',
        text: 'Lampu cerdas IoT hanya bisa dihidupkan jika saklar fisiknya ditekan langsung dengan tangan di dinding rumah.',
        correctAnswer: false,
      },
      {
        id: 's3',
        text: 'Kamera CCTV cerdas dapat mengirimkan peringatan darurat ke ponsel pemilik rumah jika mendeteksi adanya gerakan mencurigakan di malam hari.',
        correctAnswer: true,
      },
    ],
    explanation:
      'Pernyataan 1 BENAR (koneksi jaringan adalah nyawa utama IoT). Pernyataan 2 SALAH (keunggulan IoT adalah bisa dikendalikan otomatis dari jarak jauh lewat aplikasi smartphone). Pernyataan 3 BENAR (sensor gerak CCTV IoT otomatis memicu notifikasi push ke gawai).',
  },

  // --- SOAL 39 (PGK Kategori 4) ---
  {
    id: 39,
    type: 'pgk_kategori',
    topic: 'Etika, Hak Cipta, dan Keamanan Siber',
    competency: 'Menganalisis manfaat digital dalam kehidupan sehari-hari dengan tepat',
    level: 'L3',
    difficulty: 'Sukar',
    indicator: 'Peserta didik dapat menganalisis penerapan keamanan data dan etika bermedia digital.',
    text: 'Dalam beraktivitas di dunia digital, kita wajib menjaga keamanan data pribadi dan menjunjung tinggi etika berinternet.\nTentukan apakah pernyataan berikut BENAR atau SALAH:',
    statements: [
      {
        id: 's1',
        text: 'Memberikan informasi kata sandi (password) email atau PIN bank kepada orang asing di media sosial sangat berbahaya karena memicu pencurian akun.',
        correctAnswer: true,
      },
      {
        id: 's2',
        text: 'Menyalin karya tulisan atau gambar orang lain di internet dan mengakuinya sebagai buatan sendiri tanpa izin diperbolehkan secara hukum digital.',
        correctAnswer: false,
      },
      {
        id: 's3',
        text: 'Memverifikasi kebenaran sumber berita sebelum menyebarkannya di grup WhatsApp dapat mencegah tersebarnya hoaks dan kepanikan publik.',
        correctAnswer: true,
      },
    ],
    explanation:
      'Pernyataan 1 BENAR (PIN dan password wajib dijaga ketat). Pernyataan 2 SALAH (mengakui karya orang lain tanpa izin melanggar hak cipta dan disebut plagiarisme). Pernyataan 3 BENAR (selalu cek sumber berita terpercaya untuk memerangi disinformasi/hoaks).',
  },

  // --- SOAL 40 (PGK Kategori 5) ---
  {
    id: 40,
    type: 'pgk_kategori',
    topic: 'Koding, Algoritma, dan Logika Komputasi',
    competency: 'Menginterpretasikan teknologi digital dengan benar',
    level: 'L3',
    difficulty: 'Sukar',
    indicator: 'Peserta didik dapat menganalisis konsep dasar algoritma dan berpikir komputasional dalam pembuatan program.',
    text: 'Perhatikan konsep dasar koding dan berpikir komputasional berikut!\nTentukan kebenaran masing-masing pernyataan (BENAR atau SALAH):',
    image: `<svg viewBox="0 0 380 110" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-sm mx-auto">
      <rect width="380" height="110" rx="10" fill="#F8FAFC" stroke="#E2E8F0"/>
      <g transform="translate(25, 20)">
        <rect x="0" y="0" width="95" height="40" rx="6" fill="#EFF6FF" stroke="#3B82F6"/>
        <text x="47" y="24" font-size="10" font-weight="bold" fill="#1E40AF" text-anchor="middle">1. INPUT</text>
        <path d="M 95 20 L 120 20 M 115 16 L 120 20 L 115 24" stroke="#64748B" stroke-width="2"/>

        <rect x="120" y="0" width="95" height="40" rx="6" fill="#F0FDF4" stroke="#16A34A"/>
        <text x="167" y="24" font-size="10" font-weight="bold" fill="#15803D" text-anchor="middle">2. PROSES</text>
        <path d="M 215 20 L 240 20 M 235 16 L 240 20 L 235 24" stroke="#64748B" stroke-width="2"/>

        <rect x="240" y="0" width="95" height="40" rx="6" fill="#FEF3C7" stroke="#F59E0B"/>
        <text x="287" y="24" font-size="10" font-weight="bold" fill="#B45309" text-anchor="middle">3. OUTPUT</text>
      </g>
      <text x="190" y="88" font-size="10" font-weight="bold" fill="#334155" text-anchor="middle">Tiga Tahapan Utama Cara Kerja Sistem Komputer</text>
    </svg>`,
    statements: [
      {
        id: 's1',
        text: 'Komputer akan menghasilkan keluaran (output) yang salah apabila instruksi algoritma atau data masukan (input) yang diberikan salah.',
        correctAnswer: true,
      },
      {
        id: 's2',
        text: 'Dalam koding Scratch, blok perintah yang disusun secara sembarangan tanpa urutan logis tetap akan membuat animasi bergerak sempurna.',
        correctAnswer: false,
      },
      {
        id: 's3',
        text: 'Keterampilan belajar koding sejak sekolah dasar melatih kemampuan anak dalam memecahkan masalah (problem solving) secara terstruktur.',
        correctAnswer: true,
      },
    ],
    explanation:
      'Pernyataan 1 BENAR (prinsip GIGO: Garbage In, Garbage Out). Pernyataan 2 SALAH (komputer mengikuti urutan kode secara tepat baris per baris; jika urutan salah, program akan eror atau tidak berfungsi). Pernyataan 3 BENAR (koding melatih daya nalar, logika, dan penyelesaian masalah analitis).',
  },
];
