"use client";

import { AuthPage as AntdAuthPage, type AuthProps } from "@refinedev/antd";
import { authRenderContent, authWrapperProps } from "../_auth_render";

const AuthPage: React.FC<AuthProps> = ({ formProps }) => {
  return (
    <AntdAuthPage
      type="forgotPassword"
      wrapperProps={authWrapperProps}
      renderContent={authRenderContent}
      formProps={formProps}
    />
  );
};

export default AuthPage;
