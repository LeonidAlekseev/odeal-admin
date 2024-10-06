"use client";

import {
  type HttpError,
  getDefaultFilter,
  useExport,
  useGo,
  useNavigation,
  useTranslate,
} from "@refinedev/core";
import {
  CloneButton,
  DateField,
  EditButton,
  FilterDropdown,
  NumberField,
  getDefaultSortOrder,
  useSelect,
  useTable,
} from "@refinedev/antd";
import type { ICategory, IOrder, IProduct, IStatus } from "@/interfaces";
import {
  Avatar,
  Button,
  Flex,
  Input,
  InputNumber,
  Select,
  Table,
  Typography,
  theme,
} from "antd";
import { OrderStatus } from "../status";
import { PaginationTotal } from "../../paginationTotal";
import { EyeOutlined, CopyOutlined, SearchOutlined } from "@ant-design/icons";
import { usePathname } from "next/navigation";

export const OrderListTable = () => {
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const pathname = usePathname();
  const { showUrl } = useNavigation();

  const { tableProps, sorters, filters } = useTable<IOrder, HttpError>({
    filters: {
      initial: [
        {
          field: "courier.user.fullName",
          operator: "contains",
          value: "",
        },
        {
          field: "product.id",
          operator: "in",
          value: [],
        },
        {
          field: "status",
          operator: "in",
          value: [],
        },
      ],
    },
    meta: {
      populate: {
        courier: {
          populate: {
            user: { populate: ["fullName"] },
            store: { populate: ["title"] },
          },
        },
        product: { populate: ["name"] },
        status: { populate: ["id", "text"] },
      },
    },
  });

  const { selectProps: productSelectProps, query: queryResult } =
    useSelect<IProduct>({
      resource: "products",
      optionLabel: "name",
      optionValue: "id",
      defaultValue: getDefaultFilter("product.id", filters, "in"),
    });

  const products = queryResult?.data?.data || [];

  const { selectProps: statusSelectProps } = useSelect<IStatus>({
    resource: "statuses",
    optionLabel: "text",
    optionValue: "text",
    defaultValue: getDefaultFilter("status.text", filters, "in"),
  });

  const { isLoading, triggerExport } = useExport<IOrder>({
    sorters,
    filters,
    meta: {
      populate: {
        courier: {
          populate: {
            user: { populate: ["fullName"] },
            store: { populate: ["title"] },
          },
        },
        product: { populate: ["name"] },
        status: { populate: ["text"] },
      },
    },
    pageSize: 50,
    maxItemCount: 50, // TODO
    mapData: (item) => {
      return {
        id: item.id,
        orderNumber: item.orderNumber,
        status: item.status?.text,
        amount: item.amount,
        product: item.product?.name,
        branch: item.courier?.store?.title,
        agent: item.courier?.user?.fullName,
      };
    },
  });

  return (
    <Table
      {...tableProps}
      rowKey="id"
      scroll={{ x: true }}
      pagination={{
        ...tableProps.pagination,
        showTotal: (total) => (
          <PaginationTotal total={total} entityName="orders" />
        ),
      }}
      locale={{
        emptyText: t("search.nothing"),
      }}
    >
      <Table.Column
        sorter
        key="id"
        dataIndex="id"
        title={
          <Typography.Text
            style={{
              whiteSpace: "nowrap",
            }}
          >
            ID
          </Typography.Text>
        }
        width={80}
        render={(value) => (
          <Typography.Text
            style={{
              whiteSpace: "nowrap",
            }}
          >
            #{value}
          </Typography.Text>
        )}
        filterIcon={(filtered) => (
          // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter("id", filters, "eq")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <InputNumber
              addonBefore="#"
              style={{ width: "100%" }}
              placeholder={t("orders.filter.id.placeholder")}
            />
          </FilterDropdown>
        )}
      />
      <Table.Column
        sorter
        key="orderNumber"
        dataIndex="orderNumber"
        title={t("orders.fields.order")}
        render={(value) => (
          <Typography.Text
            style={{
              whiteSpace: "nowrap",
            }}
          >
            #{value}
          </Typography.Text>
        )}
        filterIcon={(filtered) => (
          // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter("orderNumber", filters, "eq")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <InputNumber
              addonBefore="#"
              style={{ width: "100%" }}
              placeholder={t("orders.filter.orderNumber.placeholder")}
            />
          </FilterDropdown>
        )}
      />
      <Table.Column<IOrder>
        sorter
        key="product.id"
        dataIndex={["product", "name"]}
        title={t("orders.fields.products")}
        width={128}
        defaultFilteredValue={getDefaultFilter("product.id", filters, "in")}
        filterDropdown={(props) => {
          return (
            <FilterDropdown
              {...props}
              selectedKeys={props.selectedKeys.map((item) => Number(item))}
            >
              <Select
                {...productSelectProps}
                style={{ width: "200px" }}
                allowClear
                mode="multiple"
                placeholder={t("orders.filter.products.placeholder")}
              />
            </FilterDropdown>
          );
        }}
        render={(_, record) => {
          const category = products.find(
            (product) => product?.id === record.product?.id
          );

          return (
            <Typography.Text
              style={{
                whiteSpace: "nowrap",
              }}
            >
              {category?.name || "-"}
            </Typography.Text>
          );
        }}
      />
      <Table.Column
        sorter
        key="amount"
        dataIndex="amount"
        align="right"
        title={t("orders.fields.amount")}
        defaultSortOrder={getDefaultSortOrder("amount", sorters)}
        render={(value) => {
          return (
            <NumberField
              options={{
                currency: "RUB",
                style: "currency",
              }}
              value={value}
            />
          );
        }}
      />
      <Table.Column
        sorter
        key="courier.store.title"
        dataIndex={["courier", "store", "title"]}
        title={t("orders.fields.store")}
        filterIcon={(filtered) => (
          // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter(
          "courier.store.title",
          filters,
          "contains"
        )}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder={t("orders.filter.store.placeholder")} />
          </FilterDropdown>
        )}
      />
      <Table.Column
        sorter
        key="courier.user.fullName"
        dataIndex={["courier", "user", "fullName"]}
        title={t("orders.fields.courier")}
        filterIcon={(filtered) => (
          // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter(
          "courier.user.fullName",
          filters,
          "contains"
        )}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder={t("orders.filter.courier.placeholder")} />
          </FilterDropdown>
        )}
      />
      <Table.Column
        sorter
        key="createdAt"
        dataIndex="createdAt"
        title={t("orders.fields.createdAt")}
        render={(value) => <DateField value={value} format="LLL" />}
      />
      <Table.Column<IOrder>
        sorter
        key="status.text"
        dataIndex="status"
        title={t("orders.fields.status")}
        render={(status) => {
          return <OrderStatus status={status.id} />;
        }}
        defaultSortOrder={getDefaultSortOrder("status.text", sorters)}
        defaultFilteredValue={getDefaultFilter("status.text", filters, "in")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Select
              {...statusSelectProps}
              style={{ width: "200px" }}
              allowClear
              mode="multiple"
              placeholder={t("orders.filter.status.placeholder")}
            />
          </FilterDropdown>
        )}
      />
      <Table.Column
        key="actions"
        dataIndex="id"
        title={t("table.actions")}
        fixed="right"
        align="center"
        render={(_, record: IOrder) => {
          return (
            <Flex gap={8} justify="flex-end" align="center">
              <EditButton
                // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                icon={<EyeOutlined />}
                recordItemId={record.id}
                hideText
              />
              <CloneButton
                // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                icon={<CopyOutlined />}
                recordItemId={record.id}
                hideText
              />
            </Flex>
          );
        }}
      />
    </Table>
  );
};
