import { create } from "zustand";
import type { User } from "@/types/auth";

type AuthStore = {
	// State
	user: User | null;
	accessToken: string | null;
	isAuthenticated: boolean;

	// Actions
	setUser: (user: User | null) => void;
	setAccessToken: (accessToken: string | null) => void;
	setIsAuthenticated: (isAuthenticated: boolean) => void;
	clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
	user: null,
	accessToken: null,
	isAuthenticated: false,

	setUser: (user: User | null) => set({ user }),
	setAccessToken: (accessToken: string | null) => set({ accessToken }),
	setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
	clearAuth: () => set({ user: null, accessToken: null, isAuthenticated: false }),
}));
