"use client";
import { apiRequest } from "@/service/api.service";
import { userData } from "@/types";
import { createContext, useContext, useEffect, useState, } from "react";


interface AuthContextType {
    user: userData | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
    logout: () => void;
}
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children, }: { children: React.ReactNode; }) => {
    const [user, setUser] = useState<userData | null>(null);
    const [loading, setLoading] = useState(true);
    const refreshUser = async () => {
        try {
            const local = localStorage.getItem("user");
            if (!local) {
                setUser(null);
                return;
            }
            const loginUser = JSON.parse(local);
            const response = await apiRequest({
                endpoint: `/users/${loginUser.id}`,
            });
            console.log("Login dengan ", response.data);
            setUser(response.data);
        } catch (err) {
            console.error(err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                refreshUser,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {

    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth harus berada di dalam AuthProvider"
        );
    }

    return context;
};