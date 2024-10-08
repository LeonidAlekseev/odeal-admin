import { useNavigation, useTranslate } from "@refinedev/core";
import { NumberField, useTable } from "@refinedev/antd";
import { Typography, Table, theme, Space, Flex } from "antd";

import { OrderActions } from "@/components";

import type { IOrder } from "@/interfaces";
import { useStyles } from "./styled";
import { getUniqueListWithCount } from "@/utils";

export const RecentOrders: React.FC = () => {
  const t = useTranslate();
  const { token } = theme.useToken();
  const { styles } = useStyles();

  const { tableProps } = useTable<IOrder>({
    resource: "orders",
    initialSorter: [
      {
        field: "createdAt",
        order: "desc",
      },
    ],
    initialPageSize: 10,
    permanentFilter: [
      {
        field: "status.text",
        operator: "eq",
        value: "Pending",
      },
    ],
    syncWithLocation: false,
    meta: {
      populate: {
        courier: { populate: { user: { populate: ["fullName"] } } },
      },
    },
  });

  const { show } = useNavigation();

  return (
    <Table
      {...tableProps}
      rowKey="id"
      showHeader={false}
      pagination={{
        ...tableProps.pagination,
        hideOnSinglePage: true,
        showSizeChanger: false,
        className: styles.pagination,
      }}
      locale={{
        emptyText: t("search.nothing"),
      }}
    >
      <Table.Column<IOrder>
        dataIndex="orderNumber"
        className={styles.column}
        render={(_, record) => (
          <Typography.Link
            strong
            onClick={() => show("orders", record.id)}
            style={{
              whiteSpace: "nowrap",
              color: token.colorTextHeading,
            }}
          >
            #{record.orderNumber}
          </Typography.Link>
        )}
      />
      <Table.Column<IOrder>
        dataIndex="id"
        className={styles.column}
        render={(_, record) => {
          return (
            <Space
              size={0}
              direction="vertical"
              style={{
                maxWidth: "220px",
              }}
            >
              <Typography.Text
                ellipsis
                style={{
                  fontSize: 12,
                }}
                type="secondary"
              >
                {record?.orderNumber}
              </Typography.Text>
              <Typography.Text
                style={{
                  fontSize: 14,
                }}
              >
                {record?.amount}
              </Typography.Text>
            </Space>
          );
        }}
      />
      <Table.Column<IOrder>
        dataIndex="product"
        className={styles.column}
        render={(product: IOrder["product"]) => {
          if (!product) {
            return <Typography.Text>-</Typography.Text>;
          }

          const uniqueProducts = getUniqueListWithCount({
            list: [product],
            field: "id",
          });

          return (
            <Space
              size={0}
              direction="vertical"
              style={{
                maxWidth: "220px",
              }}
            >
              {uniqueProducts.map((product) => (
                <Flex key={product.id} gap={4}>
                  <Typography.Text ellipsis>{product.name}</Typography.Text>
                  <span
                    style={{
                      color: token.colorTextSecondary,
                    }}
                  >
                    x{product.count}
                  </span>
                </Flex>
              ))}
            </Space>
          );
        }}
      />
      <Table.Column<IOrder>
        dataIndex="amount"
        className={styles.column}
        align="end"
        render={(amount) => {
          return (
            <NumberField
              value={amount}
              style={{
                whiteSpace: "nowrap",
              }}
              options={{
                style: "currency",
                currency: "RUB",
              }}
            />
          );
        }}
      />
      <Table.Column<IOrder>
        fixed="right"
        key="actions"
        className={styles.column}
        align="end"
        render={(_, record) => <OrderActions record={record} />}
      />
    </Table>
  );
};
