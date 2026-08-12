import { beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "firebase/auth";

const { onAuthStateChanged, signInWithEmailAndPassword, signOut } = vi.hoisted(
  () => ({
    onAuthStateChanged: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
  })
);

vi.mock("firebase/auth", () => ({
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
}));

vi.mock("@/firebase", () => ({ auth: {} }));

const { default: useAuthStore } = await import("./authStore");

const mockUser = { uid: "user-1" } as User;

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isLoading: true });
    onAuthStateChanged.mockReset();
    signInWithEmailAndPassword.mockReset();
    signOut.mockReset();
  });

  it("starts with no user and loading true", () => {
    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      isLoading: true,
    });
  });

  it("login sets the user and clears loading", () => {
    useAuthStore.getState().login(mockUser);
    expect(useAuthStore.getState()).toMatchObject({
      user: mockUser,
      isLoading: false,
    });
  });

  it("logout clears the user and loading", () => {
    useAuthStore.getState().login(mockUser);
    useAuthStore.getState().logout();
    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      isLoading: false,
    });
  });

  it("initializeAuth subscribes and reflects the auth callback's user", () => {
    useAuthStore.getState().initializeAuth();
    expect(onAuthStateChanged).toHaveBeenCalledTimes(1);

    const callback = onAuthStateChanged.mock.calls[0][1];
    callback(mockUser);
    expect(useAuthStore.getState()).toMatchObject({
      user: mockUser,
      isLoading: false,
    });

    callback(null);
    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      isLoading: false,
    });
  });

  it("signIn resolves the signed-in user and updates state", async () => {
    signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });

    const result = await useAuthStore.getState().signIn("a@b.com", "password");

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      {},
      "a@b.com",
      "password"
    );
    expect(result).toBe(mockUser);
    expect(useAuthStore.getState()).toMatchObject({
      user: mockUser,
      isLoading: false,
    });
  });

  it("signIn propagates rejection without changing state", async () => {
    const error = new Error("invalid credentials");
    signInWithEmailAndPassword.mockRejectedValue(error);

    await expect(
      useAuthStore.getState().signIn("a@b.com", "wrong")
    ).rejects.toThrow(error);
    expect(useAuthStore.getState().user).toBeNull();
  });

  it("signOutUser signs out and clears the user", async () => {
    useAuthStore.getState().login(mockUser);
    signOut.mockResolvedValue(undefined);

    await useAuthStore.getState().signOutUser();

    expect(signOut).toHaveBeenCalledWith({});
    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      isLoading: false,
    });
  });
});
