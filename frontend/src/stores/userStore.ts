import { apiGet, apiPost } from "@/lib/api";
import type { User } from "@/types/user";
import { create } from "zustand";

type UserStoreState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
};

type UserStoreActions = {
  sendMagicLink: (email: string) => Promise<void>;
  verifyMagicLink: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
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
  sendMagicLink: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiPost<{ message: string }>("/auth/magic-link/send", { email });
      set({ isLoading: false, error: null });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send magic link";
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  verifyMagicLink: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiPost<{ user: User }>("/auth/magic-link/verify", {
        token,
      });

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to verify magic link";
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await apiPost<{ success: boolean }>("/auth/signout");
    } catch {
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
    } catch {
      set({ user: null, isAuthenticated: false });
    }
  },

  updateUsername: async (username: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiPost<{ user: User }>("/user/update-username", {
        username,
      });
      set({
        user: data.user,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update username";
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  deleteAccount: async () => {
    set({ isLoading: true, error: null });
    try {
      await apiPost<{ success: boolean }>("/user/delete-account", {});
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete account";
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
