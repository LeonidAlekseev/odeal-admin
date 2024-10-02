"use client";

import type { AuthProvider } from "@refinedev/core";
import { AuthHelper } from "@refinedev/strapi-v4";
import Cookies from "js-cookie";
import { axiosInstance } from "@/utils/axios-instance";
import { AUTH_API_URL, AUTH_TOKEN_KEY } from "@/utils/constants";

const strapiAuthHelper = AuthHelper(AUTH_API_URL);

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    // TODO
    // const { data, status } = await strapiAuthHelper.login(email, password);
    const data = {
      jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    };
    const status = 200;
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
  register: async ({ email, password }) => {
    try {
      await authProvider.login({ email, password });
      return {
        success: true,
        successNotification: {
          message: "Успешная регистрация",
          description: "Вы зарегистрировались системе",
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          statusCode: 401,
          message: "Ошибка регистрации",
          description: "Попробуйте повторить еще раз",
        },
        errorNotification: {
          message: "Ошибка регистрации",
          description: "Попробуйте повторить еще раз",
        },
      };
    }
  },
  updatePassword: async () => {
    // TODO
    return {
      success: false,
      error: {
        statusCode: 401,
        message: "Ошибка обновления пароля",
        description: "Попробуйте повторить еще раз",
      },
      errorNotification: {
        message: "Ошибка обновления пароля",
        description: "Попробуйте повторить еще раз",
      },
    };
  },
  forgotPassword: async ({ email }) => {
    // TODO
    return {
      success: false,
      error: {
        statusCode: 401,
        message: "Ошибка сброса пароля",
        description: "Попробуйте повторить еще раз",
      },
      errorNotification: {
        message: "Ошибка сброса пароля",
        description: "Попробуйте повторить еще раз",
      },
    };
  },
  logout: async () => {
    Cookies.remove(AUTH_TOKEN_KEY, { path: "/" });
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
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
      error: {
        message: "Проверка не пройдена",
        name: "Токен не найден",
      },
      logout: true,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    // TODO
    const token = Cookies.get(AUTH_TOKEN_KEY);
    if (!token) {
      return null;
    }

    return {
      id: 1,
      name: "James Sullivan",
      avatar: "https://i.pravatar.cc/150",
    };
  },
};
