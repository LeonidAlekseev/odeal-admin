import { NumberField, useTable } from "@refinedev/antd";
import type { IOrder, IOrderFilterVariables, ICustomer } from "@/interfaces";
import { type HttpError, useNavigation, useTranslate } from "@refinedev/core";
import { Table, Typography } from "antd";
import { OrderStatus, OrderTableColumnProducts } from "../../order";

type Props = {
  customer?: ICustomer;
};

export const CustomerOrderHistory = ({ customer }: Props) => {
  const t = useTranslate();
  const { show } = useNavigation();

  const { tableProps } = useTable<IOrder, HttpError, IOrderFilterVariables>({
    resource: "orders",
    initialSorter: [
      {
        field: "createdAt",
        order: "desc",
      },
    ],
    permanentFilter: [
      {
        field: "customer.id",
        operator: "eq",
        value: customer?.id,
      },
    ],
    initialPageSize: 4,
    queryOptions: {
      enabled: customer !== undefined,
    },
    syncWithLocation: false,
    meta: {
      populate: {
        product: { populate: ["image"] },
        customer: { populate: ["id"] },
        courier: { populate: { user: { populate: ["fullName"] } } },
        status: { populate: ["status"] },
      },
    },
  });

  return (
    <Table
      {...tableProps}
      rowKey="id"
      onRow={(record) => {
        return {
          onClick: () => {
            show("orders", record.id);
          },
        };
      }}
      pagination={{
        ...tableProps.pagination,
        hideOnSinglePage: true,
      }}
      locale={{
        emptyText: t("search.nothing"),
      }}
    >
      <Table.Column
        title={`${t("orders.order")} #`}
        dataIndex="id"
        key="id"
        render={(value) => (
          <Typography.Text
            style={{
              whiteSpace: "nowrap",
            }}
          >
            #{value}
          </Typography.Text>
        )}
      />
      <Table.Column
        key="status.text"
        dataIndex="status"
        title={t("orders.fields.status")}
        render={(status) => {
          return <OrderStatus status={status.text} />;
        }}
      />
      <Table.Column<IOrder>
        key="product"
        dataIndex="product"
        title={t("orders.fields.products")}
        render={(_, record) => {
          return <OrderTableColumnProducts order={record} />;
        }}
      />
      <Table.Column<IOrder>
        dataIndex="amount"
        align="end"
        title={t("orders.fields.amount")}
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
      <Table.Column
        key="courier.user.fullName"
        dataIndex={["courier", "user", "fullName"]}
        title={t("couriers.couriers")}
      />
    </Table>
  );
};
