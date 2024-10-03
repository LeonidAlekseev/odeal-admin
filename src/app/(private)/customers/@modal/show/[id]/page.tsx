"use client";

import { useShow } from "@refinedev/core";
import { useBack } from "@refinedev/core";
import { Flex, Grid } from "antd";
import type { ICustomer } from "@/interfaces";
import {
  CustomerInfoList,
  CustomerInfoSummary,
  CustomerOrderHistory,
  Drawer,
} from "@/components";

const CustomerShow = () => {
  const back = useBack();

  const breakpoint = Grid.useBreakpoint();
  const { query: queryResult } = useShow<ICustomer>({
    meta: {
      populate: {
        user: {
          populate: ["avatar"],
        },
      },
    },
  });

  const { data } = queryResult;
  const customer = data?.data;
  const user = customer?.user;

  return (
    <Drawer open onClose={back} width={breakpoint.sm ? "736px" : "100%"}>
      <Flex
        vertical
        gap={32}
        style={{
          padding: "32px",
        }}
      >
        <CustomerInfoSummary customer={customer} />
        <CustomerInfoList customer={user} />
        <CustomerOrderHistory customer={customer} />
      </Flex>
    </Drawer>
  );
};

export default CustomerShow;
