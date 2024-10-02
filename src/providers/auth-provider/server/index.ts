import type { AuthProvider } from "@refinedev/core";
import { AUTH_API_URL, AUTH_TOKEN_KEY } from "@/utils/constants";
import { cookies } from "next/headers";

export const authProviderServer: Pick<AuthProvider, "check"> = {
  check: async () => {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_TOKEN_KEY);
    const url = new URL("/users/me", AUTH_API_URL);

    if (!token) {
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }

    // TODO
    return {
      authenticated: true,
    };

    try {
      const response = await fetch(url.href, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token!.value}`,
        },
        cache: "no-cache",
      });
      const data = await response.json();
      if (data.error || !response.ok) {
        return {
          authenticated: false,
          redirectTo: "/login",
          error: data.error,
        };
      }

      return {
        authenticated: true,
      };
    } catch (error) {
      return {
        authenticated: false,
        redirectTo: "/login",
        error: error,
      };
    }
  },
};
