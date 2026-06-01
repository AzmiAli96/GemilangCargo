import { getPagination, getPagingData } from "../utils/pagination";
import { AllUser, countUser, deleteUser, getUser, getUserEmail, loginUser, registerUser, updateUser, UserById } from "../repository/userRepo";
import { userData } from "../types/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getAllUsers = async () => {
    const user = await AllUser();
    return user;
}

export const getAllUser = async ({ page, limit, search }: { page: number; limit: number, search: string }) => {
    const { skip, take, currentPage } = getPagination(page, limit);

    const users = await getUser(skip, take, search);
    const total = await countUser(search);

    return {
        data: users,
        meta: getPagingData(total, currentPage, take),
    };
}

export const login = async (item: userData) => {
    const user = await loginUser(item);

    if (!user) {
        throw new Error("user tidak ditemukan, pastikan email sudah benar");
    }

    if (!user.password) {
        throw new Error("User ini tidak memiliki akses login");
    }

    const isPasswordValid = await bcrypt.compare(item.password, user.password);

    if (!isPasswordValid) {
        throw new Error("password salah");
    }

    const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        alamat: user.alamat,
        noHp: user.noHp,
        roleId: user.roleId
    }

    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret!, { expiresIn: "1h" });

    return { ...user, token };
}

export const register = async (item: userData) => {
    if (item.email) {
        const adaUser = await getUserEmail(item.email);
        if (adaUser) {
            throw new Error("Email sudah terdaftar, silahkan gunakan email lain");
        }
    }

    const user = await registerUser(item);
    return user;
}

export const putUser = async (id: number, item: userData) => {
    const user = await updateUser(id, item);
    return user;
}

export const deleteUserid = async (id: number) => {
    const user = await deleteUser(id);
    return user;
}

export const getUserById = async (id: number) => {
    const user = await UserById(id);
    return user;
}