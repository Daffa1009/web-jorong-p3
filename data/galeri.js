// data/galeri.js
// Fallback data galeri dengan support multi-foto (foto_cover + galeri_foto array)

export const galeriList = [
  {
    id: "1",
    judul: "Gotong Royong Kebersihan Jalan Jorong dan Saluran Irigasi",
    kategori: "Sosial Kepemudaan",
    foto_url: "https://picsum.photos/800/600?random=30",
    foto_cover: "https://picsum.photos/800/600?random=30",
    foto: "https://picsum.photos/800/600?random=30",
    tanggal: "2026-05-12",
    galeri_foto: [
      { id: "1a", foto_url: "https://picsum.photos/800/600?random=30", urutan: 0 },
      { id: "1b", foto_url: "https://picsum.photos/800/600?random=36", urutan: 1 },
      { id: "1c", foto_url: "https://picsum.photos/800/600?random=37", urutan: 2 },
    ],
  },
  {
    id: "2",
    judul: "Penanaman Bibit Padi Serentak Lereng Marapi",
    kategori: "Pertanian & Ekonomi",
    foto_url: "https://picsum.photos/800/600?random=31",
    foto_cover: "https://picsum.photos/800/600?random=31",
    foto: "https://picsum.photos/800/600?random=31",
    tanggal: "2026-06-20",
    galeri_foto: [
      { id: "2a", foto_url: "https://picsum.photos/800/600?random=31", urutan: 0 },
      { id: "2b", foto_url: "https://picsum.photos/800/600?random=38", urutan: 1 },
      { id: "2c", foto_url: "https://picsum.photos/800/600?random=39", urutan: 2 },
      { id: "2d", foto_url: "https://picsum.photos/800/600?random=40", urutan: 3 },
    ],
  },
  {
    id: "3",
    judul: "Pelatihan Administrasi Digital bagi Perangkat Jorong",
    kategori: "Pemerintahan",
    foto_url: "https://picsum.photos/800/600?random=32",
    foto_cover: "https://picsum.photos/800/600?random=32",
    foto: "https://picsum.photos/800/600?random=32",
    tanggal: "2026-07-04",
    galeri_foto: [
      { id: "3a", foto_url: "https://picsum.photos/800/600?random=32", urutan: 0 },
      { id: "3b", foto_url: "https://picsum.photos/800/600?random=41", urutan: 1 },
    ],
  },
  {
    id: "4",
    judul: "Festival Budaya Nagari Tuo Tahunan",
    kategori: "Budaya",
    foto_url: "https://picsum.photos/800/600?random=33",
    foto_cover: "https://picsum.photos/800/600?random=33",
    foto: "https://picsum.photos/800/600?random=33",
    tanggal: "2026-06-10",
    galeri_foto: [
      { id: "4a", foto_url: "https://picsum.photos/800/600?random=33", urutan: 0 },
      { id: "4b", foto_url: "https://picsum.photos/800/600?random=42", urutan: 1 },
      { id: "4c", foto_url: "https://picsum.photos/800/600?random=43", urutan: 2 },
      { id: "4d", foto_url: "https://picsum.photos/800/600?random=44", urutan: 3 },
      { id: "4e", foto_url: "https://picsum.photos/800/600?random=45", urutan: 4 },
    ],
  },
  {
    id: "5",
    judul: "Perbaikan Jembatan Penghubung Sawah Berundak",
    kategori: "Infrastruktur",
    foto_url: "https://picsum.photos/800/600?random=34",
    foto_cover: "https://picsum.photos/800/600?random=34",
    foto: "https://picsum.photos/800/600?random=34",
    tanggal: "2026-04-18",
    galeri_foto: [
      { id: "5a", foto_url: "https://picsum.photos/800/600?random=34", urutan: 0 },
      { id: "5b", foto_url: "https://picsum.photos/800/600?random=46", urutan: 1 },
      { id: "5c", foto_url: "https://picsum.photos/800/600?random=47", urutan: 2 },
    ],
  },
  {
    id: "6",
    judul: "Diskusi Adat: Peran Pemuda dalam Menjaga Tradisi Sarat Nan Ampek",
    kategori: "Sosial Kepemudaan",
    foto_url: "https://picsum.photos/800/600?random=35",
    foto_cover: "https://picsum.photos/800/600?random=35",
    foto: "https://picsum.photos/800/600?random=35",
    tanggal: "2026-03-22",
    galeri_foto: [
      { id: "6a", foto_url: "https://picsum.photos/800/600?random=35", urutan: 0 },
      { id: "6b", foto_url: "https://picsum.photos/800/600?random=48", urutan: 1 },
    ],
  },
];

export const kategoriGaleri = [
  "Semua",
  "Sosial Kepemudaan",
  "Pertanian & Ekonomi",
  "Pemerintahan",
  "Budaya",
  "Infrastruktur",
];
