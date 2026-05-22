import { prisma } from "../lib/prisma"
import bcrypt from "bcrypt"

async function main() {

    // ====================
    // SEED ROLE
    // ====================
    const roles = await prisma.role.createMany({
        data: [
            { name: "admin" },
            { name: "staff" },
            { name: "driver" },
            { name: "customer" }
        ],
        skipDuplicates: true
    })

    console.log("Role seeded")

    // ====================
    // SEED USER
    // ====================

    const adminRole = await prisma.role.findUnique({
        where: { name: "admin" }
    })

    const staffRole = await prisma.role.findUnique({
        where: { name: "staff" }
    })

    const driverRole = await prisma.role.findUnique({
        where: { name: "driver" }
    })

    const customerRole = await prisma.role.findUnique({
        where: { name: "customer" }
    })


    const hashedPassword = await bcrypt.hash("123456", 10)

    await prisma.user.createMany({
        data: [
            {
                name: "Admin",
                alamat: "Bukittinggi",
                noTelp: "082199175396",
                email: "admin@gmail.com",
                password: hashedPassword,
                roleId: adminRole!.id
            },
            {
                name: "Aur Kuning staff",
                alamat: "aur kuning",
                noTelp: "081234567891",
                email: "aurkuning@gmail.com",
                password: hashedPassword,
                roleId: staffRole!.id
            },
            {
                name: "Driver 1",
                noTelp: "081234567892",
                email: "driver@gmail.com",
                password: hashedPassword,
                roleId: driverRole!.id
            },
            {
                name: "Customer 1",
                alamat: "Padang",
                noTelp: "081234567891",
                email: "customer@gmail.com",
                password: hashedPassword,
                roleId: customerRole!.id
            },
        ],
        skipDuplicates: true
    })

    console.log("User seeded")

    // ====================
    // SEED PRICE
    // ====================

    await prisma.price.createMany({
        data: [
            // SUMATERA BARAT
            { provinsi: "SUMATERA BARAT", kota: "DAERAH BUKITTINGGI", hargaTarif: 2500 },
            { provinsi: "SUMATERA BARAT", kota: "AUR KUNING", hargaTarif: 2100 },
            { provinsi: "SUMATERA BARAT", kota: "PASAR ATAS", hargaTarif: 2300 },
            { provinsi: "SUMATERA BARAT", kota: "PADANG", hargaTarif: 3000 },
            { provinsi: "SUMATERA BARAT", kota: "PADANG PANJANG", hargaTarif: 3000 },
            { provinsi: "SUMATERA BARAT", kota: "BATUSANGKAR", hargaTarif: 3500 },
            { provinsi: "SUMATERA BARAT", kota: "PAYAKUMBUH KOTA", hargaTarif: 3000 },
            { provinsi: "SUMATERA BARAT", kota: "PAYAKUMBUH DAERAH", hargaTarif: 3500 },
            { provinsi: "SUMATERA BARAT", kota: "PARIAMAN", hargaTarif: 3500 },
            { provinsi: "SUMATERA BARAT", kota: "PADANG PARIAMAN", hargaTarif: 4000 },
            { provinsi: "SUMATERA BARAT", kota: "SOLOK KOTA", hargaTarif: 3000 },
            { provinsi: "SUMATERA BARAT", kota: "ALAHAN PANJANG", hargaTarif: 5000 },
            { provinsi: "SUMATERA BARAT", kota: "SAWAHLUNTO", hargaTarif: 5000 },
            { provinsi: "SUMATERA BARAT", kota: "DAMASARAYA", hargaTarif: 5000 },
            { provinsi: "SUMATERA BARAT", kota: "PESISIR SELATAN", hargaTarif: 6000 },
            { provinsi: "SUMATERA BARAT", kota: "LUBUK BASUNG", hargaTarif: 4000 },
            { provinsi: "SUMATERA BARAT", kota: "PASAMAN BARAT", hargaTarif: 5000 },
            { provinsi: "SUMATERA BARAT", kota: "PASAMAN TIMUR", hargaTarif: 5000 },
            { provinsi: "SUMATERA BARAT", kota: "LUBUK SIKAPING", hargaTarif: 4500 },
            { provinsi: "SUMATERA BARAT", kota: "KINALI", hargaTarif: 4000 },
            { provinsi: "SUMATERA BARAT", kota: "TANJUNG ALAI KOTO MALINTANG", hargaTarif: 4000 },

            // RIAU
            { provinsi: "RIAU", kota: "SUNGAI APIT", hargaTarif: 6000 },
            { provinsi: "RIAU", kota: "PEKANBARU", hargaTarif: 3000 },
            { provinsi: "RIAU", kota: "DUMAI", hargaTarif: 3500 },
            { provinsi: "RIAU", kota: "DURI", hargaTarif: 3500 },
            { provinsi: "RIAU", kota: "BENGKALIS", hargaTarif: 5000 },
            { provinsi: "RIAU", kota: "UJUNG TANJUNG", hargaTarif: 4500 },
            { provinsi: "RIAU", kota: "TANJUNG BALAI KARIMUN", hargaTarif: 6000 },
            { provinsi: "RIAU", kota: "TEMBILAHAN", hargaTarif: 4500 },
            { provinsi: "RIAU", kota: "UJUNG BATU", hargaTarif: 4000 },
            { provinsi: "RIAU", kota: "SIAK HULU", hargaTarif: 4000 },
            { provinsi: "RIAU", kota: "KAMPAR KIRI TENGAH, LUBUK SAKAI", hargaTarif: 4000 },
            { provinsi: "RIAU", kota: "INDRAGIRI HULU, BUKIT KALIM", hargaTarif: 5000 },

            // SUMATERA UTARA
            { provinsi: "SUMATERA UTARA", kota: "GUNUNG SITOLI", hargaTarif: 5000 },
            { provinsi: "SUMATERA UTARA", kota: "PADANG SIDEMPUAN", hargaTarif: 4500 },
            { provinsi: "SUMATERA UTARA", kota: "NIAS", hargaTarif: 6000 },
            { provinsi: "SUMATERA UTARA", kota: "PADANG LAWAS", hargaTarif: 6000 },
            { provinsi: "SUMATERA UTARA", kota: "SIBUHUAN", hargaTarif: 6000 }
        ],
        skipDuplicates: true
    })

    console.log("Price seeded")

}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })