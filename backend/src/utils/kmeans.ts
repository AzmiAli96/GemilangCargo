type DataPoint = {
  berat: number;
  koli: number;
};

// centroid hasil training terbaru
const centroids = [
  { berat: 0.028811, koli: 0.002845 }, // C1
  { berat: 0.171032, koli: 0.064863 }, // C2
  { berat: 0.512203, koli: 0.399536 }, // C3
];

// normalisasi Min-Max
const normalize = (value: number, min: number, max: number) => {
  return (value - min) / (max - min);
};

const MIN_BERAT = 5.0;
const MAX_BERAT = 2245.0;
const MIN_KOLI = 1.0;
const MAX_KOLI = 154.0;

export const hitungPrioritas = (data: DataPoint) => {
  const berat = normalize(data.berat, MIN_BERAT, MAX_BERAT);
  const koli = normalize(data.koli, MIN_KOLI, MAX_KOLI);

  const distances = centroids.map((c) =>
    Math.sqrt(
      Math.pow(berat - c.berat, 2) +
      Math.pow(koli - c.koli, 2)
    )
  );

  const cluster = distances.indexOf(Math.min(...distances));

  const mapping: Record<number, string> = {
    0: "Prioritas Rendah", // C1
    1: "Prioritas Sedang", // C2
    2: "Prioritas Tinggi", // C3
  };

  return mapping[cluster];
};

export const hitungBeratTagih = (berat: number): number => {
  if (berat > 0 && berat < 50) {
    return 50;
  }
  return berat;
};