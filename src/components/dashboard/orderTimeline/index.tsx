import { useTranslate, useNavigation, useInfiniteList } from "@refinedev/core";
import { useSimpleList } from "@refinedev/antd";
import {
  Typography,
  List as AntdList,
  Tooltip,
  ConfigProvider,
  theme,
  Card,
  Col,
  Divider,
  Input,
  List,
  Row,
  Skeleton,
  Space,
  Spin,
} from "antd";
import { dayjsExtend } from "@/utils/dayjs";
import InfiniteScroll from "react-infinite-scroll-component";
import type { IOrder } from "@/interfaces";
import { OrderStatus } from "../../order/status";

type Props = {
  height?: string;
};

export const OrderTimeline = ({ height = "760px" }: Props) => {
  const t = useTranslate();
  const { token } = theme.useToken();
  const { edit } = useNavigation();

  const { data, isLoading, hasNextPage, fetchNextPage } =
    useInfiniteList<IOrder>({
      resource: "orders",
      sorters: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
      pagination: {
        current: 1,
        pageSize: 8,
      },
      meta: {
        populate: {
          status: { populate: ["id", "text"] },
        },
      },
    });

  const orders = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div
      id="scrollableDiv"
      style={{
        display: "block",
        height: height,
        overflow: "auto",
      }}
    >
      <InfiniteScroll
        dataLength={orders.length}
        next={() => fetchNextPage()}
        hasMore={hasNextPage || false}
        loader={
          <Spin
            spinning
            style={{
              height: "56px",
              display: "flex",
              justifyContent: "center",
              marginTop: "16px",
            }}
          />
        }
        endMessage={<Divider plain>{t("search.nothing")}</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <List
          itemLayout="horizontal"
          dataSource={orders}
          renderItem={(item) => {
            return (
              <List.Item
                onClick={() => edit("orders", item.id)}
                style={{
                  cursor: "pointer",
                  height: "54px",
                  padding: "16px",
                }}
                actions={[
                  <Typography.Text
                    style={{
                      color: token.colorTextDescription,
                    }}
                    key={"createdAt"}
                  >
                    {dayjsExtend(item.createdAt).fromNow()}
                  </Typography.Text>,
                ]}
              >
                <Skeleton
                  style={{ display: "flex", width: "100%" }}
                  avatar={false}
                  title={false}
                  paragraph={{ rows: 1, width: "100%" }}
                  loading={isLoading}
                  active
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ width: "128px" }}>
                      <OrderStatus status={item.status?.id} />
                    </div>
                    <Typography.Text strong>
                      #{item.orderNumber}
                    </Typography.Text>
                  </div>
                </Skeleton>
              </List.Item>
            );
          }}
        />
      </InfiniteScroll>
    </div>
  );
};
