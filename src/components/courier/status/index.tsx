"use client";

import { ReactNode } from "react";
import { Flex, Skeleton, Spin, Tag, Typography, theme } from "antd";
import { CheckCircleOutlined, PoweroffOutlined } from "@ant-design/icons";
import { useTranslate } from "@refinedev/core";
import type { ICourier } from "../../../interfaces";
import { useConfigProvider } from "../../../context";
import { AgentWhiteIcon } from "../../icons";

type Status = ICourier["status"]["text"];

interface IVariant {
  icon: ReactNode;
  tagColor: string;
  tagTextColor: {
    dark: string;
    light: string;
  };
}

type Props = {
  value?: Status;
  isLoading?: boolean;
};

export const CourierStatus = ({ value, isLoading }: Props) => {
  const t = useTranslate();
  const { token } = theme.useToken();
  const { mode } = useConfigProvider();

  const variant: { [key: string]: IVariant } = {
    Available: {
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      icon: <CheckCircleOutlined />,
      tagColor: "green",
      tagTextColor: {
        dark: token.colorSuccess,
        light: "#3C8618",
      },
    },
    Offline: {
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      icon: <PoweroffOutlined />,
      tagColor: "default",
      tagTextColor: {
        dark: token.colorTextTertiary,
        light: token.colorTextTertiary,
      },
    },
    "On The Way": {
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      icon: <AgentWhiteIcon />,
      tagColor: "blue",
      tagTextColor: {
        dark: token.blue7,
        light: token.blue5,
      },
    },
  };

  const valueText =
    value == undefined || variant[value] == undefined ? "Offline" : value;
  const currentVariant = variant[valueText];
  const { tagColor, tagTextColor, icon } = currentVariant;

  if (isLoading) {
    return (
      <Flex
        align="center"
        style={{
          width: "108px",
          height: "24px",
        }}
      >
        <Spin size="small" spinning>
          <Skeleton.Button
            style={{
              width: "108px",
              height: "24px",
            }}
          />
        </Spin>
      </Flex>
    );
  }

  return (
    <Tag
      color={tagColor}
      style={{
        color: tagTextColor[mode],
        marginInlineEnd: "0",
      }}
      icon={icon}
    >
      {!isLoading && (
        <Typography.Text
          style={{
            color: tagTextColor[mode],
          }}
        >
          {t(`couriers.fields.status.${valueText}`)}
        </Typography.Text>
      )}
    </Tag>
  );
};
