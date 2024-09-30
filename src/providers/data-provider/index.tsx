"use client";

import jsonServerDataProvider from "@refinedev/simple-rest";

const API_URL = "https://api.finefoods.refine.dev";

export const dataProvider = jsonServerDataProvider(API_URL);
