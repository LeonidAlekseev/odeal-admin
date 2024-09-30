"use client";

import { useCallback } from "react";
import { useShow } from "@refinedev/core";
import { useBack } from "@refinedev/core";
import { Flex, Grid } from "antd";
import type { IUser } from "@/interfaces";
import {
  CustomerInfoList,
  CustomerInfoSummary,
  CustomerOrderHistory,
  Drawer,
} from "@/components";

const CustomerShow = () => {
  const back = useBack();

  const breakpoint = Grid.useBreakpoint();
  const { query: queryResult } = useShow<IUser>();

  const { data } = queryResult;
  const user = data?.data;

  return (
    <Drawer open onClose={back} width={breakpoint.sm ? "736px" : "100%"}>
      <Flex
        vertical
        gap={32}
        style={{
          padding: "32px",
        }}
      >
        <CustomerInfoSummary customer={user} />
        <CustomerInfoList customer={user} />
        <CustomerOrderHistory customer={user} />
      </Flex>
    </Drawer>
  );
};

export default CustomerShow;
