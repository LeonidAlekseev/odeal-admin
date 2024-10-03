"use client";

import type { AuthProvider } from "@refinedev/core";
import { AuthHelper } from "@refinedev/strapi-v4";
import Cookies from "js-cookie";
import { axiosInstance } from "@/utils/axios-instance";
import { AUTH_API_URL, AUTH_TOKEN_KEY } from "@/utils/constants";
import type { IIdentity } from "@/interfaces";

const strapiAuthHelper = AuthHelper(AUTH_API_URL);

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const { data, status } = await strapiAuthHelper.login(email, password);

    if (status === 200) {
      Cookies.set(AUTH_TOKEN_KEY, data.jwt, {
        expires: 30, // 30 days
        path: "/",
      });

      // set header axios instance
      axiosInstance.defaults.headers.common = {
        Authorization: `Bearer ${data.jwt}`,
      };

      return {
        success: true,
        redirectTo: "/",
        successNotification: {
          message: "Успешный вход",
          description: "Вы вошли в систему",
        },
      };
    }
    return {
      success: false,
      error: {
        statusCode: 401,
        message: "Ошибка входа",
        description: "Попробуйте повторить еще раз",
      },
      errorNotification: {
        message: "Ошибка входа",
        description: "Попробуйте повторить еще раз",
      },
    };
  },
  logout: async () => {
    Cookies.remove(AUTH_TOKEN_KEY, { path: "/" });
    return {
      success: true,
      redirectTo: "/",
      successNotification: {
        message: "Успешный выход",
        description: "Вы вышли из системы",
      },
    };
  },
  check: async () => {
    const token = Cookies.get(AUTH_TOKEN_KEY);
    if (token) {
      axiosInstance.defaults.headers.common = {
        Authorization: `Bearer ${token}`,
      };
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = Cookies.get(AUTH_TOKEN_KEY);
    if (!token) {
      return null;
    }

    const { data, status } = await strapiAuthHelper.me(token, {
      meta: {
        populate: ["avatar"],
      },
    });
    if (status === 200) {
      const { id, username, email, avatar } = data as IIdentity;
      return {
        id,
        username,
        email,
        avatar,
      };
    }

    return null;
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
};
