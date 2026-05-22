import { Request, Response } from "express";
import { getAllRole } from "../service/roleService";

export const getRoleController = async (req: Request, res: Response) => {
    try {
        const result = await getAllRole();
        res.status(200).json({ message: "Get roles successful", data: result });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}