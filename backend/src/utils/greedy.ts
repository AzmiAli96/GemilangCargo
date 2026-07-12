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
  truckStates: {
    truckId: number;
    kapasitasTruck: number;
    selectedOrders: any[];
    state: GreedyState;
  }[]
) => {

  for (const order of daftarPesanan) {
    if (usedOrders.has(order.id)) {
      continue;
    }

    const beratOrder = Number(order.berat);
    const hargaOrder = Number(order.total);

    let bestTruck: (typeof truckStates)[number] | null = null;
    let bestSisaKapasitas = Infinity;

    for (const t of truckStates) {
      const sisaKapasitas = t.kapasitasTruck - t.state.totalBerat;
      if (beratOrder <= sisaKapasitas && sisaKapasitas < bestSisaKapasitas) {
        bestTruck = t;
        bestSisaKapasitas = sisaKapasitas;
      }
    }

    if (!bestTruck) continue;

    bestTruck.selectedOrders.push(order);
    usedOrders.add(order.id);
    bestTruck.state.totalBerat += beratOrder;
    bestTruck.state.totalHarga += hargaOrder;
  }
};