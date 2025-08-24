export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: "community" | "government" | "culture" | "sports";
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: "high" | "medium" | "low";
  category: "general" | "emergency" | "maintenance" | "event";
}

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Rapat Dewan Desa",
    date: "2024-09-15",
    time: "19:00",
    location: "Balai Desa",
    description: "Rapat rutin bulanan dewan desa untuk membahas urusan masyarakat dan proyek-proyek mendatang. Semua warga diundang untuk hadir dan menyampaikan aspirasi.",
    category: "government"
  },
  {
    id: "2",
    title: "Festival Panen Tahunan",
    date: "2024-09-22",
    time: "14:00",
    location: "Alun-alun Desa",
    description: "Bergabunglah dengan festival panen tradisional kami dengan makanan lokal, musik, dan kerajinan tangan. Acara ini merupakan tradisi turun temurun desa kita.",
    category: "culture"
  },
  {
    id: "3",
    title: "Workshop Kebun Komunitas",
    date: "2024-09-08",
    time: "10:00",
    location: "Kebun Komunitas",
    description: "Pelajari teknik berkebun berkelanjutan dan bantu merawat ruang komunitas kita. Akan ada penyuluhan dari dinas pertanian setempat.",
    category: "community"
  },
  {
    id: "4",
    title: "Pertandingan Sepak Bola Desa",
    date: "2024-09-10",
    time: "15:00",
    location: "Lapangan Olahraga",
    description: "Pertandingan persahabatan antara tim lokal. Semua warga diundang untuk menonton dan memberikan dukungan!",
    category: "sports"
  }
];

export const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Pemeliharaan Pipa Air Utama",
    content: "Pasokan air akan terganggu sementara pada tanggal 5 September dari pukul 09:00 hingga 15:00 untuk pekerjaan pemeliharaan penting di Jalan Beringin. Mohon warga mempersiapkan cadangan air.",
    date: "2024-09-01",
    priority: "high",
    category: "maintenance"
  },
  {
    id: "2",
    title: "Pedoman Daur Ulang Baru",
    content: "Mulai 1 Oktober, pedoman daur ulang baru akan diberlakukan. Harap pisahkan barang kaca dari bahan daur ulang lainnya. Jadwal pengumpulan tetap tidak berubah.",
    date: "2024-08-28",
    priority: "medium",
    category: "general"
  },
  {
    id: "3",
    title: "Upgrade WiFi Desa Selesai",
    content: "Upgrade jaringan WiFi desa telah selesai. Warga sekarang dapat mengakses internet dengan kecepatan lebih tinggi di semua area publik.",
    date: "2024-08-25",
    priority: "low",
    category: "general"
  },
  {
    id: "4",
    title: "Pembaruan Kontak Darurat",
    content: "Harap pastikan informasi kontak darurat Anda terbaru dengan kantor desa. Ini membantu kami menghubungi Anda selama pengumuman penting.",
    date: "2024-08-20",
    priority: "medium",
    category: "emergency"
  }
];