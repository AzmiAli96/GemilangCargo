type DataPoint = {
  berat: number;
  koli: number;
};

// centroid dari hasil training Python
const centroids = [
  { berat: 0.01361458, koli: 0.00161088 }, // rendah
  { berat: 0.3789604, koli: 0.13806728 }, // tinggi
  { berat: 0.09734678, koli: 0.02279409 }, // sedang
];

// normalisasi (MinMax manual)
const normalize = (value: number, min: number, max: number) => {
  return (value - min) / (max - min);
};

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

export const hitungBeratTagih = (berat: number): number => {
    if (berat > 0 && berat < 50) {
        return 50;
    }
    return berat;
};