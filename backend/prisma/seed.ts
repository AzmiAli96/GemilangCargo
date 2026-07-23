import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

async function main() {
    // ====================
    // SEED ROLE
    // ====================
    // const roles = await prisma.role.createMany({
    //     data: [
    //         { name: "admin" },
    //         { name: "staff" },
    //         { name: "sopir" },
    //         { name: "pelanggan" },
    //     ],
    //     skipDuplicates: true,
    // });

    // console.log("Role seeded");

    // // ====================
    // // SEED USER
    // // ====================

    // const adminRole = await prisma.role.findUnique({
    //     where: { name: "admin" },
    // });

    // const staffRole = await prisma.role.findUnique({
    //     where: { name: "staff" },
    // });

    // const sopirRole = await prisma.role.findUnique({
    //     where: { name: "sopir" },
    // });

    // const pelangganRole = await prisma.role.findUnique({
    //     where: { name: "pelanggan" },
    // });

    // const hashedPassword = await bcrypt.hash("123456", 10);

    // await prisma.user.createMany({
    //     data: [
    //         {
    //             name: "Admin",
    //             alamat: "Bukittinggi",
    //             noHp: "082199175396",
    //             email: "admin@gmail.com",
    //             password: hashedPassword,
    //             roleId: adminRole!.id,
    //         },
    //         {
    //             name: "Aur Kuning staff",
    //             alamat: "aur kuning",
    //             email: "aurkuning@gmail.com",
    //             password: hashedPassword,
    //             roleId: staffRole!.id,
    //         },
    //         {
    //             name: "sopir 1",
    //             email: "sopir@gmail.com",
    //             password: hashedPassword,
    //             roleId: sopirRole!.id,
    //         },
    //         {
    //             name: "sopir 2",
    //             alamat: "Bukittinggi",
    //             roleId: sopirRole!.id,
    //         },
    //         {
    //             name: "Pelanggan 1",
    //             alamat: "Padang",
    //             roleId: pelangganRole!.id,
    //         },
    //         {
    //             name: "Pelanggan 2",
    //             alamat: "Bukittinggi",
    //             roleId: pelangganRole!.id,
    //         },
    //     ],
    //     skipDuplicates: true,
    // });

    // console.log("User seeded");

    // // ====================
    // // SEED PRICE
    // // ====================

    // await prisma.harga.createMany({
    //     data: [
    //         // SUMATERA BARAT
    //         {
    //             provinsi: "SUMATERA BARAT",
    //             kota: "DAERAH BUKITTINGGI",
    //             hargaTarif: 2500,
    //         },
    //         { provinsi: "SUMATERA BARAT", kota: "AUR KUNING", hargaTarif: 2100 },
    //         { provinsi: "SUMATERA BARAT", kota: "PASAR ATAS", hargaTarif: 2300 },
    //         { provinsi: "SUMATERA BARAT", kota: "PADANG", hargaTarif: 3000 },
    //         { provinsi: "SUMATERA BARAT", kota: "PADANG PANJANG", hargaTarif: 3000 },
    //         { provinsi: "SUMATERA BARAT", kota: "BATUSANGKAR", hargaTarif: 3500 },
    //         { provinsi: "SUMATERA BARAT", kota: "PAYAKUMBUH KOTA", hargaTarif: 3000 },
    //         {
    //             provinsi: "SUMATERA BARAT",
    //             kota: "PAYAKUMBUH DAERAH",
    //             hargaTarif: 3500,
    //         },
    //         { provinsi: "SUMATERA BARAT", kota: "PARIAMAN", hargaTarif: 3500 },
    //         { provinsi: "SUMATERA BARAT", kota: "PADANG PARIAMAN", hargaTarif: 4000 },
    //         { provinsi: "SUMATERA BARAT", kota: "SOLOK KOTA", hargaTarif: 3000 },
    //         { provinsi: "SUMATERA BARAT", kota: "ALAHAN PANJANG", hargaTarif: 5000 },
    //         { provinsi: "SUMATERA BARAT", kota: "SAWAHLUNTO", hargaTarif: 5000 },
    //         { provinsi: "SUMATERA BARAT", kota: "DAMASARAYA", hargaTarif: 5000 },
    //         { provinsi: "SUMATERA BARAT", kota: "PESISIR SELATAN", hargaTarif: 6000 },
    //         { provinsi: "SUMATERA BARAT", kota: "LUBUK BASUNG", hargaTarif: 4000 },
    //         { provinsi: "SUMATERA BARAT", kota: "PASAMAN BARAT", hargaTarif: 5000 },
    //         { provinsi: "SUMATERA BARAT", kota: "PASAMAN TIMUR", hargaTarif: 5000 },
    //         { provinsi: "SUMATERA BARAT", kota: "LUBUK SIKAPING", hargaTarif: 4500 },
    //         { provinsi: "SUMATERA BARAT", kota: "KINALI", hargaTarif: 4000 },
    //         {
    //             provinsi: "SUMATERA BARAT",
    //             kota: "TANJUNG ALAI KOTO MALINTANG",
    //             hargaTarif: 4000,
    //         },

    //         // RIAU
    //         { provinsi: "RIAU", kota: "SUNGAI APIT", hargaTarif: 6000 },
    //         { provinsi: "RIAU", kota: "PEKANBARU", hargaTarif: 3000 },
    //         { provinsi: "RIAU", kota: "DUMAI", hargaTarif: 3500 },
    //         { provinsi: "RIAU", kota: "DURI", hargaTarif: 3500 },
    //         { provinsi: "RIAU", kota: "BENGKALIS", hargaTarif: 5000 },
    //         { provinsi: "RIAU", kota: "UJUNG TANJUNG", hargaTarif: 4500 },
    //         { provinsi: "RIAU", kota: "TANJUNG BALAI KARIMUN", hargaTarif: 6000 },
    //         { provinsi: "RIAU", kota: "TEMBILAHAN", hargaTarif: 4500 },
    //         { provinsi: "RIAU", kota: "UJUNG BATU", hargaTarif: 4000 },
    //         { provinsi: "RIAU", kota: "SIAK HULU", hargaTarif: 4000 },
    //         {
    //             provinsi: "RIAU",
    //             kota: "KAMPAR KIRI TENGAH, LUBUK SAKAI",
    //             hargaTarif: 4000,
    //         },
    //         {
    //             provinsi: "RIAU",
    //             kota: "INDRAGIRI HULU, BUKIT KALIM",
    //             hargaTarif: 5000,
    //         },

    //         // SUMATERA UTARA
    //         { provinsi: "SUMATERA UTARA", kota: "GUNUNG SITOLI", hargaTarif: 5000 },
    //         {
    //             provinsi: "SUMATERA UTARA",
    //             kota: "PADANG SIDEMPUAN",
    //             hargaTarif: 4500,
    //         },
    //         { provinsi: "SUMATERA UTARA", kota: "NIAS", hargaTarif: 6000 },
    //         { provinsi: "SUMATERA UTARA", kota: "PADANG LAWAS", hargaTarif: 6000 },
    //         { provinsi: "SUMATERA UTARA", kota: "SIBUHUAN", hargaTarif: 6000 },
    //     ],
    //     skipDuplicates: true,
    // });

    // console.log("Price seeded");

    // // ====================
    // // SEED [PESANAN]
    // // ====================

    await prisma.pesanan.createMany({
        data: [
            {
                userId: 6,
                hargaId: 2,
                noSpb: "0131",
                koli: 1,
                berat: 20,
                tujuan: "Terminal",
                statusPay: "Belum Lunas",
                total: 42000,
                prioritas: "Prioritas Rendah",
            },
            {
                userId: 5,
                hargaId: 1,
                noSpb: "0132",
                koli: 2,
                berat: 40,
                tujuan: "Contoh",
                statusPay: "Belum Lunas",
                total: 100000,
                prioritas: "Prioritas Rendah",
            },
            {
                userId: 6,
                hargaId: 3,
                noSpb: "0133",
                koli: 4,
                berat: 80,
                tujuan: "Contoh",
                statusPay: "Belum Lunas",
                total: 184000,
                prioritas: "Prioritas Rendah",
            },
            {
                userId: 5,
                hargaId: 2,
                noSpb: "0134",
                koli: 8,
                berat: 160,
                tujuan: "Contoh",
                statusPay: "Belum Lunas",
                total: 336000,
                prioritas: "Prioritas Rendah",
            },
            {
                userId: 6,
                hargaId: 1,
                noSpb: "0135",
                koli: 8,
                berat: 320,
                tujuan: "Contoh",
                statusPay: "Belum Lunas",
                total: 800000,
                prioritas: "Prioritas Sedang",
            },
            {
                userId: 5,
                hargaId: 3,
                noSpb: "0136",
                koli: 16,
                berat: 640,
                tujuan: "Contoh",
                statusPay: "Belum Lunas",
                total: 1472000,
                prioritas: "Prioritas Sedang",
            },
            {
                userId: 6,
                hargaId: 1,
                noSpb: "0137",
                koli: 32,
                berat: 1280,
                tujuan: "Contoh",
                statusPay: "Belum Lunas",
                total: 3200000,
                prioritas: "Prioritas Sedang",
            },
            {
                userId: 5,
                hargaId: 2,
                noSpb: "0138",
                koli: 64,
                berat: 2560,
                tujuan: "Contoh",
                statusPay: "Belum Lunas",
                total: 5376000,
                prioritas: "Prioritas Tinggi",
            },
            {
                userId: 6,
                hargaId: 3,
                noSpb: "0139",
                koli: 128,
                berat: 3000,
                tujuan: "Contoh",
                statusPay: "Belum Lunas",
                total: 6900000,
                prioritas: "Prioritas Tinggi",
            },
            {
                userId: 5,
                hargaId: 3,
                noSpb: "0140",
                koli: 1,
                berat: 88,
                tujuan: "contoh",
                statusPay: "Belum Lunas",
                total: 202400,
                prioritas: "Prioritas Rendah",
            },
            {
                userId: 6,
                hargaId: 1,
                noSpb: "0141",
                koli: 1,
                berat: 58,
                tujuan: "contoh",
                statusPay: "Belum Lunas",
                total: 145000,
                prioritas: "Prioritas Rendah",
            },
            {
                userId: 5,
                hargaId: 2,
                noSpb: "0142",
                koli: 1,
                berat: 28,
                tujuan: "contoh",
                statusPay: "Belum Lunas",
                total: 58800,
                prioritas: "Prioritas Rendah",
            },
            {
                userId: 6,
                hargaId: 1,
                noSpb: "0143",
                koli: 1,
                berat: 30,
                tujuan: "contoh",
                statusPay: "Belum Lunas",
                total: 75000,
                prioritas: "Prioritas Rendah",
            },
            {
                userId: 6,
                hargaId: 3,
                noSpb: "0144",
                koli: 1,
                berat: 18,
                tujuan: "contoh",
                statusPay: "Belum Lunas",
                total: 41400,
                prioritas: "Prioritas Rendah",
            },
            {
                userId: 5,
                hargaId: 2,
                noSpb: "0145",
                koli: 1,
                berat: 46,
                tujuan: "contoh",
                statusPay: "Belum Lunas",
                total: 96600,
                prioritas: "Prioritas Rendah",
            },
            {
                userId: 6,
                hargaId: 2,
                noSpb: "0146",
                koli: 1,
                berat: 24,
                tujuan: "contoh",
                statusPay: "Belum Lunas",
                total: 50400,
                prioritas: "Prioritas Rendah",
            },
            {
                userId: 5,
                hargaId: 1,
                noSpb: "0147",
                koli: 1,
                berat: 68,
                tujuan: "contoh",
                statusPay: "Belum Lunas",
                total: 170000,
                prioritas: "Prioritas Rendah",
            },
            {
                userId: 6,
                hargaId: 3,
                noSpb: "0148",
                koli: 1,
                berat: 15,
                tujuan: "contoh",
                statusPay: "Belum Lunas",
                total: 34500,
                prioritas: "Prioritas Rendah",
            },
            {
                userId: 5,
                hargaId: 1,
                noSpb: "0149",
                koli: 1,
                berat: 22,
                tujuan: "contoh",
                statusPay: "Belum Lunas",
                total: 55000,
                prioritas: "Prioritas Rendah",
            },
            {
                userId: 6,
                hargaId: 2,
                noSpb: "0150",
                koli: 5,
                berat: 65,
                tujuan: "contoh",
                statusPay: "Belum Lunas",
                total: 136500,
                prioritas: "Prioritas Rendah",
            },
            {
                userId: 5,
                hargaId: 3,
                noSpb: "0151",
                koli: 11,
                berat: 143,
                tujuan: "contoh",
                statusPay: "Belum Lunas",
                total: 328900,
                prioritas: "Prioritas Rendah",
            },
            {
                userId: 6,
                hargaId: 1,
                noSpb: "0152",
                koli: 13,
                berat: 169,
                tujuan: "contoh",
                statusPay: "Belum Lunas",
                total: 422500,
                prioritas: "Prioritas Rendah",
            },
            {
                userId: 5,
                hargaId: 2,
                noSpb: "0153",
                koli: 6,
                berat: 78,
                tujuan: "contoh",
                statusPay: "Belum Lunas",
                total: 163800,
                prioritas: "Prioritas Rendah",
            },
            {
                userId: 6,
                hargaId: 3,
                noSpb: "0154",
                koli: 4,
                berat: 52,
                tujuan: "contoh",
                statusPay: "Belum Lunas",
                total: 119600,
                prioritas: "Prioritas Rendah",
            },
            {
                userId: 5,
                hargaId: 1,
                noSpb: "0155",
                koli: 10,
                berat: 130,
                tujuan: "contoh",
                statusPay: "Belum Lunas",
                total: 325000,
                prioritas: "Prioritas Rendah",
            },
            {
                userId: 5,
                hargaId: 3,
                noSpb: "0156",
                koli: 3,
                berat: 384,
                tujuan: "contoh",
                statusPay: "Belum Lunas",
                total: 883200,
                prioritas: "Prioritas Sedang",
            },
            {
                userId: 6,
                hargaId: 2,
                noSpb: "0157",
                koli: 27,
                berat: 507,
                tujuan: "contoh",
                statusPay: "Belum Lunas",
                total: 1064700,
                prioritas: "Prioritas Sedang",
            },
            {
                userId: 5,
                hargaId: 1,
                noSpb: "0158",
                koli: 1,
                berat: 40,
                tujuan: "contoh",
                statusPay: "Belum Lunas",
                total: 100000,
                prioritas: "Prioritas Rendah",
            },
            {
                userId: 6,
                hargaId: 3,
                noSpb: "0159",
                koli: 1,
                berat: 128,
                tujuan: "contoh",
                statusPay: "Belum Lunas",
                total: 294400,
                prioritas: "Prioritas Rendah",
            },
            {
                userId: 6,
                hargaId: 2,
                noSpb: "0160",
                koli: 1,
                berat: 141,
                tujuan: "contoh",
                statusPay: "Belum Lunas",
                total: 296100,
                prioritas: "Prioritas Rendah",
            },
            // {
            //     "userId": 5,
            //     "hargaId": 1,
            //     "noSpb": "0091",
            //     "koli": 1,
            //     "berat": 10,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 25000,
            //     "prioritas": "Prioritas Rendah"
            // },
            // {
            //     "userId": 6,
            //     "hargaId": 3,
            //     "noSpb": "0092",
            //     "koli": 1,
            //     "berat": 58,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 133400,
            //     "prioritas": "Prioritas Rendah"
            // },
            // {
            //     "userId": 5,
            //     "hargaId": 2,
            //     "noSpb": "0093",
            //     "koli": 20,
            //     "berat": 350,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 735000,
            //     "prioritas": "Prioritas Sedang"
            // },
            // {
            //     "userId": 6,
            //     "hargaId": 1,
            //     "noSpb": "0094",
            //     "koli": 1,
            //     "berat": 66,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 165000,
            //     "prioritas": "Prioritas Rendah"
            // },
            // {
            //     "userId": 5,
            //     "hargaId": 3,
            //     "noSpb": "0095",
            //     "koli": 1,
            //     "berat": 68,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 156400,
            //     "prioritas": "Prioritas Rendah"
            // },
            // {
            //     "userId": 5,
            //     "hargaId": 2,
            //     "noSpb": "0096",
            //     "koli": 18,
            //     "berat": 450,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 945000,
            //     "prioritas": "Prioritas Sedang"
            // },
            // {
            //     "userId": 6,
            //     "hargaId": 1,
            //     "noSpb": "0097",
            //     "koli": 6,
            //     "berat": 150,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 375000,
            //     "prioritas": "Prioritas Rendah"
            // },
            // {
            //     "userId": 5,
            //     "hargaId": 3,
            //     "noSpb": "0098",
            //     "koli": 1,
            //     "berat": 20,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 46000,
            //     "prioritas": "Prioritas Rendah"
            // },
            // {
            //     "userId": 6,
            //     "hargaId": 2,
            //     "noSpb": "0099",
            //     "koli": 1,
            //     "berat": 16,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 33600,
            //     "prioritas": "Prioritas Rendah"
            // },
            // {
            //     "userId": 6,
            //     "hargaId": 1,
            //     "noSpb": "0100",
            //     "koli": 1,
            //     "berat": 85,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 212500,
            //     "prioritas": "Prioritas Rendah"
            // },
            // {
            //     "userId": 5,
            //     "hargaId": 3,
            //     "noSpb": "0101",
            //     "koli": 2,
            //     "berat": 90,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 207000,
            //     "prioritas": "Prioritas Rendah"
            // },
            // {
            //     "userId": 6,
            //     "hargaId": 2,
            //     "noSpb": "0102",
            //     "koli": 1,
            //     "berat": 86,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 180600,
            //     "prioritas": "Prioritas Rendah"
            // },
            // {
            //     "userId": 5,
            //     "hargaId": 1,
            //     "noSpb": "0103",
            //     "koli": 1,
            //     "berat": 52,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 130000,
            //     "prioritas": "Prioritas Rendah"
            // },
            // {
            //     "userId": 6,
            //     "hargaId": 3,
            //     "noSpb": "0104",
            //     "koli": 12,
            //     "berat": 149,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 342700,
            //     "prioritas": "Prioritas Rendah"
            // },
            // {
            //     "userId": 5,
            //     "hargaId": 2,
            //     "noSpb": "0105",
            //     "koli": 1,
            //     "berat": 88,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 184800,
            //     "prioritas": "Prioritas Rendah"
            // },
            // {
            //     "userId": 6,
            //     "hargaId": 1,
            //     "noSpb": "0106",
            //     "koli": 1,
            //     "berat": 90,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 225000,
            //     "prioritas": "Prioritas Rendah"
            // },
            // {
            //     "userId": 5,
            //     "hargaId": 3,
            //     "noSpb": "0107",
            //     "koli": 2,
            //     "berat": 160,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 368000,
            //     "prioritas": "Prioritas Rendah"
            // },
            // {
            //     "userId": 6,
            //     "hargaId": 2,
            //     "noSpb": "0108",
            //     "koli": 2,
            //     "berat": 165,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 346500,
            //     "prioritas": "Prioritas Rendah"
            // },
            // {
            //     "userId": 5,
            //     "hargaId": 1,
            //     "noSpb": "0109",
            //     "koli": 2,
            //     "berat": 180,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 450000,
            //     "prioritas": "Prioritas Rendah"
            // },
            // {
            //     "userId": 6,
            //     "hargaId": 3,
            //     "noSpb": "0110",
            //     "koli": 1,
            //     "berat": 61,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 140300,
            //     "prioritas": "Prioritas Rendah"
            // },
            // {
            //     "userId": 5,
            //     "hargaId": 2,
            //     "noSpb": "0111",
            //     "koli": 1,
            //     "berat": 42,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 88200,
            //     "prioritas": "Prioritas Rendah"
            // },
            // {
            //     "userId": 6,
            //     "hargaId": 1,
            //     "noSpb": "0112",
            //     "koli": 1,
            //     "berat": 68,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 170000,
            //     "prioritas": "Prioritas Rendah"
            // },
            // {
            //     "userId": 5,
            //     "hargaId": 3,
            //     "noSpb": "0113",
            //     "koli": 1,
            //     "berat": 64,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 147200,
            //     "prioritas": "Prioritas Rendah"
            // },
            // {
            //     "userId": 6,
            //     "hargaId": 2,
            //     "noSpb": "0114",
            //     "koli": 1,
            //     "berat": 76,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 159600,
            //     "prioritas": "Prioritas Rendah"
            // },
            // {
            //     "userId": 5,
            //     "hargaId": 1,
            //     "noSpb": "0115",
            //     "koli": 1,
            //     "berat": 52,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 130000,
            //     "prioritas": "Prioritas Rendah"
            // },
            // {
            //     "userId": 6,
            //     "hargaId": 3,
            //     "noSpb": "0116",
            //     "koli": 1,
            //     "berat": 54,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 124200,
            //     "prioritas": "Prioritas Rendah"
            // },
            // {
            //     "userId": 5,
            //     "hargaId": 2,
            //     "noSpb": "0117",
            //     "koli": 1,
            //     "berat": 56,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 117600,
            //     "prioritas": "Prioritas Rendah"
            // },
            // {
            //     "userId": 6,
            //     "hargaId": 1,
            //     "noSpb": "0118",
            //     "koli": 1,
            //     "berat": 90,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 225000,
            //     "prioritas": "Prioritas Rendah"
            // },
            // {
            //     "userId": 5,
            //     "hargaId": 3,
            //     "noSpb": "0119",
            //     "koli": 1,
            //     "berat": 24,
            //     "tujuan": "contoh",
            //     "statusPay": "Belum Lunas",
            //     "total": 55200,
            //     "prioritas": "Prioritas Rendah"
            // }
        ],
        skipDuplicates: true,
    });

    console.log("Pesanan seeded");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
