import { create } from "zustand";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "../firebase";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  initializeAuth: () => void;
  signIn: (email: string, password: string) => Promise<User>;
  signOutUser: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  login: (user) => set({ user, isLoading: false }),
  logout: () => set({ user: null, isLoading: false }),
  initializeAuth: () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        set({ user, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    });
  },
  signIn: async (email, password) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    set({ user, isLoading: false });
    return user;
  },

  signOutUser: async () => {
    await signOut(auth);
    set({ user: null, isLoading: false });
  },
}));

export default useAuthStore;
