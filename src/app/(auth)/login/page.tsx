"use client";

import React, { useState } from "react";
import { AuthPage as AntdAuthPage } from "@refinedev/antd";
import { authRenderContent } from "../_auth_render";
import { DemoModal } from "./_demo_modal";

const AuthPage = () => {
  return (
    <>
      <DemoModal />
      <AntdAuthPage
        type="login"
        wrapperProps={{
          style: {
            background:
              "linear-gradient(130deg, rgba(193,67,25,1) 0%, rgba(87,23,1,1) 100%)",
          },
        }}
        renderContent={authRenderContent}
      />
    </>
  );
};

export default AuthPage;
