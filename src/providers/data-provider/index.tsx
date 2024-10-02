"use client";

import { DataProvider } from "@refinedev/strapi-v4";
import { axiosInstance } from "@/utils/axios-instance";
import { DATA_API_URL } from "@/utils/constants";

export const dataProvider = DataProvider(DATA_API_URL, axiosInstance);
