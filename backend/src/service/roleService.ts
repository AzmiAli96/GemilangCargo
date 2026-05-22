import { getRole } from "../repository/roleRepo";

export const getAllRole = async () => {
    const roles = await getRole();
    return roles;
}  