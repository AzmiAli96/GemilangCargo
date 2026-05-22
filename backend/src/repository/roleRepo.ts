import prisma from "../db/prisma";


export const getRole = async () => {
    const roles = await prisma.role.findMany();
    return roles;
}