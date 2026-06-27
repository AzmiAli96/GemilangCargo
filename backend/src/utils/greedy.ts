export interface GreedyState {
  totalBerat: number;
  totalHarga: number;
}

export const getPriorityValue = (prioritas: string): number => {
  const value = prioritas.toUpperCase();
  if (value.includes("TINGGI")) {
    return 3;
  }

  if (value.includes("SEDANG")) {
    return 2;
  }

  if (value.includes("RENDAH")) {
    return 1;
  }

  return 0;
};

export const sortPesanan = (pesanan: any[]) => {
  return [...pesanan].sort((a, b) => {

    const aCustom =
      a.hargaCustom !== null ? 1 : 0;

    const bCustom =
      b.hargaCustom !== null ? 1 : 0;

    if (aCustom !== bCustom) {
      return bCustom - aCustom;
    }

    const priorityDiff =
      getPriorityValue(b.prioritas) -
      getPriorityValue(a.prioritas);

    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return (
      new Date(a.tanggalMasuk).getTime() -
      new Date(b.tanggalMasuk).getTime()
    );
  });
};

export const groupPesananByPriority = (pesanan: any[]) => {
  return {
    custom: pesanan.filter(p => p.hargaCustom !== null),
    tinggi: pesanan.filter(
      p => p.hargaCustom === null && getPriorityValue(p.prioritas) === 3
    ),
    sedang: pesanan.filter(
      p => p.hargaCustom === null && getPriorityValue(p.prioritas) === 2
    ),
    rendah: pesanan.filter(
      p => p.hargaCustom === null && getPriorityValue(p.prioritas) === 1
    )
  };
};

export const isiTruck = (
  daftarPesanan: any[],
  usedOrders: Set<number>,
  selectedOrders: any[],
  kapasitasTruck: number,
  state: GreedyState
) => {

  for (const order of daftarPesanan) {

    if (usedOrders.has(order.id)) {
      continue;
    }

    const beratOrder =
      Number(order.berat);

    const hargaOrder =
      Number(order.total);

    const nextBerat =
      state.totalBerat + beratOrder;

    if (
      nextBerat > kapasitasTruck
    ) {
      continue;
    }

    selectedOrders.push(order);

    usedOrders.add(order.id);

    state.totalBerat += beratOrder;
    state.totalHarga += hargaOrder;
  }
};