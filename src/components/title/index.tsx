"use client";

import { useLink } from "@refinedev/core";
import { Space, theme } from "antd";

import { MainLogoIcon, MainLogoText } from "@/components";
import { Logo } from "./styled";

type TitleProps = {
  collapsed: boolean;
};

const MainLogoIconStyle = {
  filter:
    "invert(3%) sepia(35%) saturate(3500%) hue-rotate(315deg) brightness(100%) contrast(85%)",
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  const { token } = theme.useToken();
  const Link = useLink();

  return (
    <Logo>
      <Link to="/">
        {collapsed ? (
          <MainLogoIcon style={MainLogoIconStyle} />
        ) : (
          <Space size={12}>
            <MainLogoIcon style={MainLogoIconStyle} />
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
