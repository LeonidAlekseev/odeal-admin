"use client";

import { useGo, useNavigation, useTranslate } from "@refinedev/core";
import { CreateButton, List } from "@refinedev/antd";
import { OrderListTable } from "@/components";
import { useState } from "react";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Segmented } from "antd";
import { usePathname } from "next/navigation";

type View = "table" | "card";

const OrderList = () => {
  const go = useGo();
  const { replace } = useNavigation();
  const pathname = usePathname();
  const { createUrl } = useNavigation();

  const t = useTranslate();

  return (
    <List
      breadcrumb={false}
      headerButtons={(props) => [
        <CreateButton
          {...props.createButtonProps}
          key="create"
          size="large"
          onClick={() => {
            return go({
              to: `${createUrl("orders")}`,
              query: {
                to: pathname,
              },
              options: {
                keepQuery: true,
              },
              type: "push",
            });
          }}
        >
          {t("orders.actions.add")}
        </CreateButton>,
      ]}
    >
      <OrderListTable />
    </List>
  );
};

export default OrderList;
