// K-Means sederhana untuk klasifikasi prioritas pengiriman menyesuaikan dengan dataset
type DataPoint = {
  berat: number;
  koli: number;
};

// centroid dari hasil training Python
const centroids = [
  { berat: 0.01331242, koli: 0.00154281 }, // rendah
  { berat: 0.35661017, koli: 0.12193787 }, // tinggi
  { berat: 0.09167284, koli: 0.02149923 }, // sedang
];

// normalisasi (MinMax manual)
const normalize = (value: number, min: number, max: number) => {
  return (value - min) / (max - min);
};

// ⚠️ HARUS kamu sesuaikan dari dataset
const MIN_BERAT = 1.0;
const MAX_BERAT = 6700.0;
const MIN_KOLI = 1.0;
const MAX_KOLI = 752.0;

export const hitungPrioritas = (data: DataPoint) => {
  // normalisasi
  const berat = normalize(data.berat, MIN_BERAT, MAX_BERAT);
  const koli = normalize(data.koli, MIN_KOLI, MAX_KOLI);

  // hitung jarak ke tiap centroid
  const distances = centroids.map((c) => {
    return Math.sqrt(
      Math.pow(berat - c.berat, 2) +
      Math.pow(koli - c.koli, 2)
    );
  });

  const cluster = distances.indexOf(Math.min(...distances));

  // mapping prioritas
  const mapping: any = {
    0: "Prioritas Rendah",
    1: "Prioritas Tinggi",
    2: "Prioritas Sedang",
  };

  return mapping[cluster];
};