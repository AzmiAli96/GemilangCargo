import { Request, Response } from "express";
import { deleteUserid, getAllUser, getAllUsers, getUserById, login, putUser, register } from "../service/userService";

export const getAllUsersController = async (req: Request, res: Response) => {
    try {
        const user = await getAllUsers();
        res.status(200).json({ message: "Get roles successful", data: user });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const loginController = async (req: Request, res: Response) => {
    try {
        const result = await login(req.body);
        res.status(200).json({ message: "Login successful", data: result });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const LogoutController = async (req: Request, res: Response) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout success" });
};

export const getUsersByIdController = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const user = await getUserById(id);
        res.status(200).json({ message: "Get user by id successful", data: user });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

    export const registerController = async (req: Request, res: Response) => {
        try {
            const result = await register(req.body);
            res.status(201).json({ message: "Registration successful", data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    export const getUsersController = async (req: Request, res: Response) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = String(req.query.search || "");

            const result = await getAllUser({ page, limit, search });
            res.status(200).json({
                message: "Get users successful",
                data: result,
                meta: result.meta,
            });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    export const putUserController = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const result = await putUser(id, req.body);
            res.status(200).json({ message: "User updated successfully", data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    export const deleteUserController = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const result = await deleteUserid(id);
            res.status(200).json({ message: "User deleted successfully", data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }