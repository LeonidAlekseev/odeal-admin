"use client";

import React, { Suspense } from "react";
import { NavigateToResource } from "@refinedev/nextjs-router";

import dayjs from "dayjs";
import WeekDay from "dayjs/plugin/weekday";
import LocaleData from "dayjs/plugin/localeData";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(WeekDay);
dayjs.extend(LocaleData);
dayjs.extend(LocalizedFormat);

const IndexPage = () => {
  return (
    <Suspense>
      <NavigateToResource resource="dashboard" />
    </Suspense>
  );
};

export default IndexPage;
