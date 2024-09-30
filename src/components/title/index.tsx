"use client";

import { useLink } from "@refinedev/core";
import { Space, theme } from "antd";

import { MainLogoIcon, MainLogoText } from "@/components";
import { Logo } from "./styled";

type TitleProps = {
  collapsed: boolean;
};

const MainLogoProps = {
  "--main-logo-prop-light": "#FE7D55",
  "--main-logo-prop-dark": "#FB5821",
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  const { token } = theme.useToken();
  const Link = useLink();

  return (
    <Logo>
      <Link to="/" style={MainLogoProps}>
        {collapsed ? (
          <MainLogoIcon />
        ) : (
          <Space size={12}>
            <MainLogoIcon style={{ opacity: 0.9 }} />
            <MainLogoText
              style={{
                color: token.colorPrimary,
                width: "100%",
                height: "auto",
              }}
            />
          </Space>
        )}
      </Link>
    </Logo>
  );
};
