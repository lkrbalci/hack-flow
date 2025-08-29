// store/authStore.ts
import { create } from "zustand";
import { Models } from "appwrite";

// Define the shape of your store's state and actions
interface AuthState {
  currentUser: Models.User<Models.Preferences> | null;
  setUser: (user: Models.User<Models.Preferences> | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,

  setUser: (user) => set({ currentUser: user }),
}));
