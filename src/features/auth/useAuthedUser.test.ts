import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "firebase/auth";

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock("@/firebase", () => ({ auth: {} }));

const { default: useAuthStore } = await import("@/store/authStore");
const { default: useAuthedUser } = await import("./useAuthedUser");

const mockUser = { uid: "user-1" } as User;

describe("useAuthedUser", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isLoading: true });
  });

  it("returns the current user when one is set", () => {
    useAuthStore.setState({ user: mockUser, isLoading: false });
    const { result } = renderHook(() => useAuthedUser());
    expect(result.current).toBe(mockUser);
  });

  it("throws when there is no user", () => {
    expect(() => renderHook(() => useAuthedUser())).toThrow(
      "useAuthedUser must be used within a PrivateRoute"
    );
  });
});
