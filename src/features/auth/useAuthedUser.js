import useAuthStore from "@/store/authStore";

/**
 * Reads the current user for pages rendered inside PrivateRoute, where a
 * user is already guaranteed to exist. Throws instead of returning a
 * nullable value so callers don't need to re-guard against "no user".
 */
export default function useAuthedUser() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    throw new Error("useAuthedUser must be used within a PrivateRoute");
  }

  return user;
}
