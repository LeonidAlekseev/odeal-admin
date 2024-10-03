import { Flex, Avatar, Typography } from "antd";
import type { ICustomer } from "../../../interfaces";
import { MEDIA_API_URL } from "@/utils/constants";

type Props = {
  customer?: ICustomer;
};

export const CustomerInfoSummary = ({ customer }: Props) => {
  return (
    <Flex align="center" gap={32}>
      <Avatar
        size={96}
        src={`${MEDIA_API_URL}${customer?.user?.avatar?.url}`}
      />
      <Flex vertical>
        <Typography.Text type="secondary">#{customer?.id}</Typography.Text>
        <Typography.Title
          level={3}
          style={{
            margin: 0,
          }}
        >
          {customer?.user?.fullName}
        </Typography.Title>
      </Flex>
    </Flex>
  );
};
