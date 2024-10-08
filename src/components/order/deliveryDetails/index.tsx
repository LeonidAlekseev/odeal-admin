"use client";

import { Flex, Grid, List, Space, Steps, Typography, theme } from "antd";
import type { IEvent, IOrder } from "@/interfaces";
import { useTranslate } from "@refinedev/core";
import { dayjsExtend } from "@/utils/dayjs";
import {
  ClockCircleOutlined,
  HistoryOutlined,
  LoadingOutlined,
  PhoneOutlined,
  ShopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMemo } from "react";
import { AgentWhiteIcon } from "../../icons";
import { useConfigProvider } from "@/context";

type Props = {
  order: IOrder;
};

export const OrderDeliveryDetails = ({ order }: Props) => {
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoints = Grid.useBreakpoint();
  const { mode } = useConfigProvider();

  const details = useMemo(() => {
    const list: {
      icon: React.ReactNode;
      title: string;
      description: string;
    }[] = [
      {
        // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
        icon: <ShopOutlined />,
        title: t("orders.fields.store"),
        description: order.courier?.store?.title,
      },
      {
        // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
        icon: <AgentWhiteIcon />,
        title: t("orders.fields.courier"),
        description: order.courier?.user?.fullName,
      },
      {
        // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
        icon: <PhoneOutlined />,
        title: t("orders.fields.phone"),
        description: order.customer?.user?.gsm,
      },
      {
        // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
        icon: <UserOutlined />,
        title: t("orders.fields.customer"),
        description: `${order.customer?.user?.fullName}`,
      },
      {
        // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
        icon: <HistoryOutlined />,
        title: t("orders.fields.createdAt"),
        description: order.createdAt,
      },
    ];

    return list;
  }, [order]);

  return (
    <Flex vertical>
      <Steps
        direction={breakpoints.xl ? "vertical" : "horizontal"}
        current={getCurrentStep(order)}
        style={{
          padding: "24px",
        }}
      >
        {order?.events?.map((event, index) => {
          const status = getStepStatus(order, event, index);
          const isLast = index === order?.events?.length - 1;

          return (
            <Steps.Step
              key={index}
              style={{
                paddingBottom: isLast ? "0" : "24px",
              }}
              status={status}
              title={t(`enum.orderStatuses.${event.status?.text}`)}
              icon={
                getNotFinishedCurrentStep(order, event, index) && (
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  <LoadingOutlined />
                )
              }
              description={
                event.createdAt && (
                  <Flex wrap={"wrap"} gap={4}>
                    <div>
                      {dayjsExtend(event.createdAt).format("DD.MM.YYYY")}
                    </div>
                    <div>{dayjsExtend(event.createdAt).format("HH:mm:ss")}</div>
                  </Flex>
                )
              }
            />
          );
        })}
      </Steps>
      <List
        size="large"
        dataSource={details}
        style={{
          borderTop: `1px solid ${token.colorBorderSecondary}`,
        }}
        renderItem={(item) => (
          <List.Item>
            <Flex gap={8}>
              <Space
                style={{
                  width: "120px",
                }}
              >
                <div
                  style={{
                    color: mode === "dark" ? token.volcano9 : token.volcano6,
                  }}
                >
                  {item.icon}
                </div>
                <Typography.Text type="secondary">{item.title}</Typography.Text>
              </Space>
              <Typography.Text>{item.description}</Typography.Text>
            </Flex>
          </List.Item>
        )}
      />
    </Flex>
  );
};

const getCurrentStep = (order: IOrder) => {
  return order?.events?.findIndex(
    (el) => el.status?.text === order?.status?.text
  );
};

const getNotFinishedCurrentStep = (
  order: IOrder,
  event: IEvent,
  index: number
) => {
  return (
    event.status?.text !== "Cancelled" &&
    event.status?.text !== "Delivered" &&
    order?.events?.findIndex(
      (el) => el.status?.text === order?.status?.text
    ) === index
  );
};

const getStepStatus = (order: IOrder, event: IEvent, index: number) => {
  if (!event.createdAt) return "wait";
  if (event?.status?.text === "Cancelled") return "error";
  if (getNotFinishedCurrentStep(order, event, index)) return "process";
  return "finish";
};
