import { create } from "zustand";
import type { User } from "@/types/auth";

type AuthStore = {
	// State
	user: User | null;
	accessToken: string | null;
	isAuthenticated: boolean;
	isInitialized: boolean; // Critical: tracks if auth check is complete
	initializationError: string | null; // Track initialization errors

	// Actions
	setUser: (user: User | null) => void;
	setAccessToken: (accessToken: string | null) => void;
	setIsAuthenticated: (isAuthenticated: boolean) => void;
	setIsInitialized: (isInitialized: boolean) => void;
	setInitializationError: (error: string | null) => void;
	clearAuth: () => void;
	// Helper to set authenticated state all at once
	setAuthenticatedUser: (user: User, accessToken: string) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
	// State
	user: null,
	accessToken: null,
	isAuthenticated: false,
	isInitialized: false,
	initializationError: null,

	// Actions
	setUser: (user: User | null) => set({ user }),
	setAccessToken: (accessToken: string | null) => set({ accessToken }),
	setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
	setIsInitialized: (isInitialized: boolean) => set({ isInitialized }),
	setInitializationError: (error: string | null) =>
		set({ initializationError: error }),

	setAuthenticatedUser: (user: User, accessToken: string) =>
		set({
			user,
			accessToken,
			isAuthenticated: true,
			initializationError: null,
		}),

	clearAuth: () =>
		set({
			user: null,
			accessToken: null,
			isAuthenticated: false,
			isInitialized: true, // Keep initialized true after clearing
			initializationError: null,
		}),
}));