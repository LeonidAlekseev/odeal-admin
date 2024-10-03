"use client";

import { AuthPage as AntdAuthPage } from "@refinedev/antd";
import { authRenderContent } from "../_auth_render";

const AuthPage = () => {
  // TODO
  const formPropsDemo = {
    initialValues: {
      email: "admindemo@demo.demo",
      password: "admindemo",
      remember: false,
    },
  };

  return (
    <AntdAuthPage
      type="login"
      wrapperProps={{
        style: {
          background:
            "linear-gradient(130deg, rgba(193,67,25,1) 0%, rgba(87,23,1,1) 100%)",
        },
      }}
      renderContent={authRenderContent}
      formProps={formPropsDemo}
    />
  );
};

export default AuthPage;
