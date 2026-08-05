import React from "react";
import useAuthStore from "./authStore";

export default function withAuth(Component) {
  return function WithAuth(props) {
    const user = useAuthStore((state) => state.user);
    const authLogin = useAuthStore((state) => state.login);
    const authLogout = useAuthStore((state) => state.logout);
    const authLoading = useAuthStore((state) => state.isLoading);

    return (
      <Component
        {...props}
        user={user}
        uid={user?.uid || ""}
        isAuthenticated={Boolean(user)}
        authLogin={authLogin}
        authLogout={authLogout}
        authLoading={authLoading}
      />
    );
  };
}