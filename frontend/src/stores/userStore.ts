import { apiGet, apiPost } from "@/lib/api";
import type { LoginPayload, RegisterPayload, User } from "@/types/user";
import { create } from "zustand";

type UserStoreState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
};

type UserStoreActions = {
  register: (payload: RegisterPayload) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
};

type UserStore = UserStoreState & UserStoreActions;

export const useUser = create<UserStore>((set) => ({
  // Initial state
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  // Actions
  register: async (payload: RegisterPayload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiPost<{ user: User }>("/auth/register", payload);

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred during registration";
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  login: async (payload: LoginPayload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiPost<{ user: User }>("/auth/signin", payload);

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred during login";
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await apiPost<{ success: boolean }>("/auth/signout");
    } catch (err) {
      // Continue logout even if API call fails
    } finally {
      // Always clear the local state even if API call fails
      set({ user: null, isAuthenticated: false, error: null });
    }
  },

  checkAuth: async () => {
    try {
      const data = await apiGet<{ user: User }>("/auth/session");
      set({
        user: data.user,
        isAuthenticated: true,
        error: null,
      });
    } catch (err) {
      set({ user: null, isAuthenticated: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
