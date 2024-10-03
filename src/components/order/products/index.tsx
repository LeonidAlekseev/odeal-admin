import { useTranslate } from "@refinedev/core";
import { Avatar, Flex, Table, Typography } from "antd";
import type { IOrder } from "../../../interfaces";
import { getUniqueListWithCount } from "../../../utils";
import { NumberField } from "@refinedev/antd";
import { MEDIA_API_URL } from "@/utils/constants";

type Props = {
  order?: IOrder;
};

export const OrderProducts = ({ order }: Props) => {
  const t = useTranslate();

  const products = order?.products || [];
  const uniqueProducts = getUniqueListWithCount({
    list: products,
    field: "id",
  });

  return (
    <Table
      dataSource={uniqueProducts}
      loading={!order}
      pagination={false}
      scroll={{
        x: true,
      }}
      footer={(products) => {
        return (
          <Flex justify="flex-end" gap={16}>
            <Typography.Text>{t("orders.fields.total")}</Typography.Text>
            <NumberField
              value={products.reduce(
                (acc, product) => acc + product.count * product.price,
                0
              )}
              options={{ style: "currency", currency: "RUB" }}
            />
          </Flex>
        );
      }}
      locale={{
        emptyText: t("search.nothing"),
      }}
    >
      <Table.Column<(typeof uniqueProducts)[number]>
        title={t("orders.fields.product")}
        dataIndex="name"
        key="name"
        render={(_, record) => {
          const image = record.images?.[0];

          return (
            <Flex
              gap={16}
              align="center"
              style={{
                whiteSpace: "nowrap",
              }}
            >
              <Avatar
                shape="square"
                src={`${MEDIA_API_URL}${image?.thumbnail?.url || image?.url}`}
                alt={image?.name}
              />
              <Typography.Text>{record.name}</Typography.Text>
            </Flex>
          );
        }}
      />
      <Table.Column
        align="end"
        title={t("orders.fields.quantity")}
        dataIndex="count"
        key="count"
      />
      <Table.Column
        title={t("orders.fields.price")}
        dataIndex="price"
        align="end"
        key="price"
        render={(value) => {
          return (
            <NumberField
              value={value}
              style={{
                whiteSpace: "nowrap",
              }}
              options={{ style: "currency", currency: "RUB" }}
            />
          );
        }}
      />
      <Table.Column<(typeof uniqueProducts)[number]>
        title={t("orders.fields.total")}
        dataIndex="id"
        align="end"
        key="total"
        render={(_, record) => {
          return (
            <NumberField
              value={record.count * record.price}
              options={{ style: "currency", currency: "RUB" }}
              style={{
                whiteSpace: "nowrap",
              }}
            />
          );
        }}
      />
    </Table>
  );
};
