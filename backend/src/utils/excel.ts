import * as XLSX from "xlsx";
import ExcelJS from "exceljs";

const borderStyle: Partial<ExcelJS.Borders> = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

const headerFill: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "D9D9D9" },
};

const styleHeaderRow = (row: ExcelJS.Row, colCount: number) => {
  for (let i = 1; i <= colCount; i++) {
    const cell = row.getCell(i);
    cell.font = { bold: true };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.fill = headerFill;
    cell.border = borderStyle;
  }
};

const styleDataRow = (
  row: ExcelJS.Row,
  colCount: number,
  centerCols: number[] = []
) => {
  for (let i = 1; i <= colCount; i++) {
    const cell = row.getCell(i);
    cell.border = borderStyle;
    if (centerCols.includes(i)) {
      cell.alignment = { horizontal: "center", vertical: "middle" };
    }
  }
};

const styleTitleRow = (
  sheet: ExcelJS.Worksheet,
  rowNumber: number,
  colCount: number
) => {
  const lastColLetter = sheet.getColumn(colCount).letter;
  sheet.mergeCells(`A${rowNumber}:${lastColLetter}${rowNumber}`);
  const cell = sheet.getCell(`A${rowNumber}`);
  cell.font = { bold: true, size: 14 };
  cell.alignment = { horizontal: "center", vertical: "middle" };
};

const autoFitColumns = (
  sheet: ExcelJS.Worksheet,
  minWidth = 10,
  skipRows: number[] = [1]
) => {
  sheet.columns.forEach((column) => {
    let maxLength = minWidth;
    column?.eachCell?.({ includeEmpty: true }, (cell, rowNumber) => {
      if (skipRows.includes(rowNumber)) return;
      const value = cell.value ? String(cell.value) : "";
      maxLength = Math.max(maxLength, value.length + 2);
    });
    column.width = maxLength;
  });
};
// === Style khusus header biru untuk sheet Laba Rugi ===
const blueHeaderFill: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF1F4E78" }, // biru gelap
};

const styleBlueHeaderRow = (row: ExcelJS.Row, colCount: number) => {
  for (let i = 1; i <= colCount; i++) {
    const cell = row.getCell(i);
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.fill = blueHeaderFill;
    cell.border = borderStyle;
  }
};

export const generateLaporanExcel = async (laporan: any[], bulan: number, tahun: number, pengeluaran: any[]) => {
  const workbook = new ExcelJS.Workbook();
  const sheetCounter = new Map<string, number>();
  const namaBulan = [
    "",
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember"
  ];

  const periode = `${namaBulan[bulan]} ${tahun}`;

  const formatTanggal = (tanggal: Date) => {
    return new Date(tanggal).toLocaleDateString("id-ID");
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const PESANAN_COL_COUNT = 9;

  for (const item of laporan) {
    const namaSheet = formatTanggal(item.tanggalJalan)
      .replace(/\//g, "-");

    const total = (sheetCounter.get(namaSheet) ?? 0) + 1;
    sheetCounter.set(namaSheet, total);

    const finalName = total === 1
      ? namaSheet
      : `${namaSheet} (${total})`;

    const sheet = workbook.addWorksheet(finalName);

    const namaSopir = item.sopir
      .map((s: any) => s.name)
      .join(", ");

    const totalKeseluruhan = item.pesanan.reduce(
      (sum: number, p: any) => sum + Number(p.total),
      0
    );

    sheet.addRow([`LAPORAN BARANG HARIAN GEMILANG CARGO ${periode}`]);
    styleTitleRow(sheet, 1, PESANAN_COL_COUNT);
    sheet.addRow([]);
    sheet.addRow(["Truck", item.truck.platNomor]);
    sheet.addRow(["Tanggal", formatTanggal(item.tanggalJalan)]);
    sheet.addRow(["Sopir", namaSopir]);
    sheet.addRow(["Status", item.statusPengiriman]);
    sheet.addRow(["BB", formatRupiah(item.bb)]);
    sheet.addRow([]);

    const headerRow = sheet.addRow([
      "NO SPB",
      "Nama / TOKO",
      "Koli",
      "Berat",
      "Harga",
      "Total",
      "statusPay",
      "Tujuan",
      "ket",
    ]);
    styleHeaderRow(headerRow, PESANAN_COL_COUNT);

    const centerCols = [3, 4, 5];
    item.pesanan.forEach(p => {
      const harga =
        p.harga?.hargaTarif != null
          ? Number(p.harga.hargaTarif)
          : Number(p.hargaCustom);

      const row = sheet.addRow([
        p.noSpb,
        p.user.name,
        Number(p.koli),
        Number(p.berat),
        formatRupiah(harga),
        formatRupiah(Number(p.total)),
        p.statusPay,
        p.tujuan,
        p.ket
      ]);
      styleDataRow(row, PESANAN_COL_COUNT, centerCols);
    });

    const totalRow = sheet.addRow([
      "",
      "Total Keseluruhan",
      "",
      "",
      "",
      formatRupiah(totalKeseluruhan)
    ]);
    styleDataRow(totalRow, PESANAN_COL_COUNT);
    totalRow.getCell(2).font = { bold: true };
    totalRow.getCell(6).font = { bold: true };

    autoFitColumns(sheet);
  }

  const summarySheet = workbook.addWorksheet("Rekapitulasi");
  const REKAP_COL_COUNT = 6;
  const totalLaba = laporan.reduce(
    (sum, item) => sum + (Number(item.totalHarga) - Number(item.bb)),
    0
  );
  summarySheet.addRow([`REKAPITULASI ${periode}`]);
  styleTitleRow(summarySheet, 1, REKAP_COL_COUNT);

  summarySheet.addRow([]);
  const rekapHeaderRow = summarySheet.addRow([
    "Tanggal Jalan",
    "Truck",
    "Sopir",
    "Total Pendapatan",
    "BB",
    "Laba",
  ]);
  styleHeaderRow(rekapHeaderRow, REKAP_COL_COUNT);

  laporan.forEach(item => {
    const Laba = item.totalHarga - item.bb;
    const namaSopir = item.sopir
      .map((s: any) => s.name)
      .join(", ");

    const row = summarySheet.addRow([
      formatTanggal(item.tanggalJalan),
      item.truck.platNomor,
      namaSopir,
      formatRupiah(item.totalHarga),
      formatRupiah(item.bb),
      formatRupiah(Laba)
    ]);
    styleDataRow(row, REKAP_COL_COUNT);
  })
  const totalLabaRow = summarySheet.addRow([
    "",
    "Total Laba",
    "",
    "",
    "",
    formatRupiah(totalLaba)
  ]);
  styleDataRow(totalLabaRow, REKAP_COL_COUNT);
  totalLabaRow.getCell(2).font = { bold: true };
  totalLabaRow.getCell(6).font = { bold: true };

  autoFitColumns(summarySheet);


  const pengeluaranSheet = workbook.addWorksheet("NARACA");
  const PENGELUARAN_COL_COUNT = 4;

  pengeluaranSheet.addRow(["NARACA SALDO"]);
  styleTitleRow(pengeluaranSheet, 1, PENGELUARAN_COL_COUNT);

  pengeluaranSheet.addRow(["CV. GEMILANG CARGO"]);
  pengeluaranSheet.mergeCells(`A2:D2`);
  pengeluaranSheet.getCell("A2").alignment = { horizontal: "center" }

  pengeluaranSheet.addRow([`PERIODE ${periode}`]);
  pengeluaranSheet.mergeCells(`A3:D3`);
  pengeluaranSheet.getCell("A3").alignment = { horizontal: "center" };

  pengeluaranSheet.addRow([]);
  const pengeluaranHeaderRow = pengeluaranSheet.addRow([
    "Truck",
    "Nama",
    "Kategori",
    "Nominal"
  ]);
  styleHeaderRow(pengeluaranHeaderRow, PENGELUARAN_COL_COUNT);

  pengeluaran.forEach(item => {
    const truck = item.pengiriman?.truck?.platNomor ??
      "Pengeluaran Umum";
    const row = pengeluaranSheet.addRow([
      truck,
      item.nama,
      item.kategori,
      formatRupiah(Number(item.nominal))
    ]);
    styleDataRow(row, PENGELUARAN_COL_COUNT);
  });
  autoFitColumns(pengeluaranSheet);

  const labaRugiSheet = workbook.addWorksheet("Laba Rugi");
  const LABA_RUGI_COL_COUNT = 4; 

  labaRugiSheet.addRow([`LAPORAN LABA RUGI ${periode}`]);
  styleTitleRow(labaRugiSheet, 1, LABA_RUGI_COL_COUNT);

  labaRugiSheet.addRow([]);

  const labaRugiHeaderRow = labaRugiSheet.addRow([
    "Kode",
    "Nama Akun",
    "Pendapatan",
    "Pengeluaran",
  ]);
  styleBlueHeaderRow(labaRugiHeaderRow, LABA_RUGI_COL_COUNT);

  // --- Baris Pendapatan ---
  // totalLaba sudah dihitung sebelumnya dari laporan (totalHarga - bb)
  const pendapatanRow = labaRugiSheet.addRow([
    "Pendapatan",
    "Pendapatan Jasa Ekspedisi",
    formatRupiah(totalLaba),
    "",
  ]);
  styleDataRow(pendapatanRow, LABA_RUGI_COL_COUNT, [1]);

  // --- Baris Pengeluaran per Kategori ---
  const pengeluaranPerKategori = pengeluaran.reduce(
    (acc: Record<string, number>, item: any) => {
      const kategori = item.kategori ?? "Lainnya";
      const nominal = Number(item.nominal) || 0;
      acc[kategori] = (acc[kategori] || 0) + nominal;
      return acc;
    },
    {} as Record<string, number>
  );

  let totalPengeluaranKategori = 0;
  Object.entries(pengeluaranPerKategori).forEach(([kategori, nominal]) => {
    totalPengeluaranKategori += nominal;
    const row = labaRugiSheet.addRow([
      "Pengeluaran",
      kategori,
      "",
      formatRupiah(nominal),
    ]);
    styleDataRow(row, LABA_RUGI_COL_COUNT, [1]);
  });

  // --- Baris TOTAL ---
  const totalLabaRugiRow = labaRugiSheet.addRow([
    "",
    "TOTAL",
    formatRupiah(totalLaba),
    formatRupiah(totalPengeluaranKategori),
  ]);
  styleDataRow(totalLabaRugiRow, LABA_RUGI_COL_COUNT);
  for (let i = 2; i <= LABA_RUGI_COL_COUNT; i++) {
    totalLabaRugiRow.getCell(i).font = { bold: true };
  }

  // --- Baris LABA (di bawah TOTAL) ---
  const labaRow = labaRugiSheet.addRow([
    "",
    "LABA",
    "",
    formatRupiah(totalLaba - totalPengeluaranKategori),
  ]);
  styleDataRow(labaRow, LABA_RUGI_COL_COUNT);
  labaRow.getCell(2).font = { bold: true };
  labaRow.getCell(4).font = { bold: true };

  autoFitColumns(labaRugiSheet);

  return workbook;
};










export const readExcel = (filePath: string) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);
  return data;
};

