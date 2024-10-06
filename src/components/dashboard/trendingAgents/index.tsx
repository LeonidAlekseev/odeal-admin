import { NumberField, useSimpleList } from "@refinedev/antd";
import { Typography, Avatar, List as AntdList, Flex } from "antd";
import type { ITrendingAgents } from "@/interfaces";
import {
  Rank1Icon,
  Rank2Icon,
  Rank3Icon,
  Rank4Icon,
  Rank5Icon,
} from "../../icons";
import type { ReactNode } from "react";
import { useTranslate, useNavigation } from "@refinedev/core";
import { MEDIA_API_URL } from "@/utils/constants";

export const TrendingAgents: React.FC = () => {
  const t = useTranslate();
  const { edit } = useNavigation();
  const { listProps } = useSimpleList<ITrendingAgents>({
    resource: "stats/best-agents-by-value",
    pagination: { pageSize: 5, current: 1 },
    syncWithLocation: false,
    queryOptions: { retry: 4 },
  });

  return (
    <AntdList
      {...listProps}
      pagination={false}
      size="large"
      bordered={false}
      renderItem={(item, index) => {
        return (
          <AntdList.Item
            key={index}
            onClick={() => edit("couriers", item.agent?.id)}
            style={{
              borderBlockEnd: "none",
              cursor: "pointer",
            }}
          >
            <Flex
              gap={24}
              style={{
                width: "100%",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "relative",
                }}
              >
                <Avatar
                  shape="square"
                  style={{
                    borderRadius: 24,
                  }}
                  size={{
                    xs: 64,
                    sm: 64,
                    md: 64,
                    lg: 108,
                    xl: 120,
                    xxl: 120,
                  }}
                  src={`${MEDIA_API_URL}${item.agent?.avatar?.url}`}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: -8,
                  }}
                >
                  {RankIcons[index + 1]}
                </div>
              </div>
              <Flex
                vertical
                gap="10px"
                justify="center"
                style={{
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                <Flex vertical justify="center">
                  <div>
                    <Typography.Paragraph
                      ellipsis={{
                        rows: 1,
                        tooltip: {
                          placement: "top",
                          title: item.agent?.fullName,
                        },
                      }}
                      style={{
                        margin: 0,
                        fontSize: 24,
                      }}
                      strong={index <= 2}
                    >
                      {item.agent?.fullName}
                    </Typography.Paragraph>
                  </div>
                  <NumberField
                    type="secondary"
                    options={{
                      currency: "RUB",
                      style: "currency",
                      notation: "standard",
                    }}
                    value={item.value}
                    strong
                  />
                </Flex>
                <Typography.Text
                  style={{
                    fontSize: 16,
                  }}
                  type="secondary"
                >
                  {t("dashboard.stats.sales")}
                  <Typography.Text strong> {item.sales} </Typography.Text>
                  {t("dashboard.stats.units")}
                </Typography.Text>
              </Flex>
            </Flex>
          </AntdList.Item>
        );
      }}
    />
  );
};

const RankIcons: Record<number, ReactNode> = {
  1: <Rank1Icon />,
  2: <Rank2Icon />,
  3: <Rank3Icon />,
  4: <Rank4Icon />,
  5: <Rank5Icon />,
};
