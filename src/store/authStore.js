import { create } from "zustand";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,
  login: (user) => set({ user, isLoading: false }),
  logout: () => set({ user: null, isLoading: false }),
  initializeAuth: () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        set({ user, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    });
  },
}));

export default useAuthStore;