"use client";

import React, { Suspense } from "react";
import { NavigateToResource } from "@refinedev/nextjs-router";

const IndexPage = () => {
  return (
    <Suspense>
      <NavigateToResource resource="dashboard" />
    </Suspense>
  );
};

export default IndexPage;
