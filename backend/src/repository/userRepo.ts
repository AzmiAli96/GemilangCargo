import prisma from "../db/prisma";
import { userData } from "../types/user";
import bcrypt from "bcrypt";

export const AllUser = async () => {
    const user = await prisma.user.findMany();
    return user
}

export const getUser = async (
    skip: number,
    take: number,
    search: string
) => {

    const where = search
        ? {
            OR: [
                { name: { contains: search, mode: "insensitive" as const } },
                { email: { contains: search, mode: "insensitive" as const } },
                { noHp: { contains: search, mode: "insensitive" as const } },
                { alamat: { contains: search, mode: "insensitive" as const } },
            ],
        }
        : {}; // kalau kosong ambil semua

    return await prisma.user.findMany({
        skip,
        take,
        where,
        include: {
            role: true,
        },orderBy: {
            id: "desc",
        }
    });
};

export const countUser = async (search: string) => {
    const where = search
        ? {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { noHp: { contains: search, mode: "insensitive" } },
            ],
        }
        : {};
    return await prisma.user.count();
};

export const getUserEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email }
    });
}

export const loginUser = async (item: userData) => {
    const user = await prisma.user.findUnique({
        where: { email: item.email }
    });
    return user;
}

export const registerUser = async (item: userData) => {
    let hashPassword: string | null = null;

    if (item.password) {
        hashPassword = await bcrypt.hash(item.password, 10);
    }

    const user = await prisma.user.create({
        data: {
            email: item.email || undefined,
            password: hashPassword,
            name: item.name,
            alamat: item.alamat ?? null,
            noHp: item.noHp ?? null,
            roleId: item.roleId
        }
    });
    return user;
}

export const UserById = async (id: number) => {
    const user = await prisma.user.findUnique({
        where: { id },
    });
    return user;
}

export const updateUser = async (id: number, item: userData) => {
    const updateUser = await prisma.user.update({
        where: { id },
        data: {
            name: item.name,
            email: item.email,
            alamat: item.alamat,
            noHp: item.noHp,
            roleId: item.roleId,
            image: item.image
        }
    });
    return updateUser;
}

export const deleteUser = async (id: number) => {
    await prisma.user.delete({
        where: { id }
    });
}