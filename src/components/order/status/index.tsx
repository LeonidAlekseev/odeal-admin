"use client";

import {
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useTranslate } from "@refinedev/core";
import { Tag } from "antd";
import { AgentWhiteIcon } from "../../icons";

type StatusProps = {
  status: number;
};

export const OrderStatus: React.FC<StatusProps> = ({ status }) => {
  const t = useTranslate();
  let color;
  let icon;
  let text;

  switch (status) {
    case 1:
      text = "Ready";
      color = "cyan";
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      icon = <BellOutlined />;
      break;
    case 2:
      text = "Pending";
      color = "orange";
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      icon = <ClockCircleOutlined />;
      break;
    case 3:
      text = "On The Way";
      color = "blue";
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      icon = <AgentWhiteIcon />;
      break;
    case 4:
      text = "Delivered";
      color = "green";
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      icon = <CheckCircleOutlined />;
      break;
    case 5:
      text = "Cancelled";
      color = "red";
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      icon = <CloseCircleOutlined />;
      break;
  }

  return (
    <Tag color={color} icon={icon}>
      {t(`enum.orderStatuses.${text}`)}
    </Tag>
  );
};
