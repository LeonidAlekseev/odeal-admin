"use client";

import {
  useTranslate,
  useExport,
  useNavigation,
  type HttpError,
  getDefaultFilter,
} from "@refinedev/core";

import {
  List,
  useTable,
  getDefaultSortOrder,
  DateField,
  NumberField,
  useSelect,
  ExportButton,
  FilterDropdown,
} from "@refinedev/antd";
import { SearchOutlined } from "@ant-design/icons";
import { Table, Input, Select, Typography, theme, InputNumber } from "antd";

import {
  OrderStatus,
  OrderActions,
  PaginationTotal,
  OrderTableColumnProducts,
} from "@/components";
import type { IOrder, IOrderFilterVariables, IStatus } from "@/interfaces";

const OrderList = () => {
  const { token } = theme.useToken();

  const { tableProps, sorters, filters } = useTable<
    IOrder,
    HttpError,
    IOrderFilterVariables
  >({
    filters: {
      initial: [
        {
          field: "customer.user.fullName",
          operator: "contains",
          value: "",
        },
        {
          field: "courier.user.fullName",
          operator: "contains",
          value: "",
        },
      ],
    },
    meta: {
      populate: {
        product: { populate: ["image"] },
        customer: { populate: { user: { populate: ["fullName"] } } },
        courier: {
          populate: {
            user: { populate: ["fullName"] },
            store: { populate: ["title"] },
          },
        },
        status: { populate: ["text"] },
      },
    },
  });

  const t = useTranslate();
  const { show } = useNavigation();

  const { isLoading, triggerExport } = useExport<IOrder>({
    sorters,
    filters,
    meta: {
      populate: {
        customer: { populate: { user: { populate: ["fullName"] } } },
        courier: {
          populate: {
            user: { populate: ["fullName"] },
            store: { populate: ["title"] },
          },
        },
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
        branch: item.courier?.store?.title,
        agent: item.courier?.user?.fullName,
        customer: item.customer?.user?.fullName,
      };
    },
  });

  const { selectProps: orderSelectProps } = useSelect<IStatus>({
    resource: "statuses",
    optionLabel: "text",
    optionValue: "text",
    defaultValue: getDefaultFilter("status.text", filters, "in"),
  });

  return (
    <List
      breadcrumb={false}
      headerProps={{
        extra: <ExportButton onClick={triggerExport} loading={isLoading} />,
      }}
    >
      <Table
        {...tableProps}
        rowKey="id"
        style={{
          cursor: "pointer",
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              show("orders", record.id);
            },
          };
        }}
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
          key="status.text"
          dataIndex="status"
          title={t("orders.fields.status")}
          render={(status) => {
            return <OrderStatus status={status.text} />;
          }}
          sorter
          defaultSortOrder={getDefaultSortOrder("status.text", sorters)}
          defaultFilteredValue={getDefaultFilter("status.text", filters, "in")}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                {...orderSelectProps}
                style={{ width: "200px" }}
                allowClear
                mode="multiple"
                placeholder={t("orders.filter.status.placeholder")}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column<IOrder>
          key="product"
          dataIndex="product"
          title={t("orders.fields.products")}
          render={(_, record) => {
            return <OrderTableColumnProducts order={record} />;
          }}
        />
        <Table.Column
          align="right"
          key="amount"
          dataIndex="amount"
          title={t("orders.fields.amount")}
          defaultSortOrder={getDefaultSortOrder("amount", sorters)}
          sorter
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
          key="customer.user.fullName"
          dataIndex={["customer", "user", "fullName"]}
          title={t("orders.fields.customer")}
          filterIcon={(filtered) => (
            // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
            <SearchOutlined
              style={{
                color: filtered ? token.colorPrimary : undefined,
              }}
            />
          )}
          defaultFilteredValue={getDefaultFilter(
            "customer.user.fullName",
            filters,
            "contains"
          )}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder={t("orders.filter.customer.placeholder")} />
            </FilterDropdown>
          )}
        />
        <Table.Column
          key="createdAt"
          dataIndex="createdAt"
          title={t("orders.fields.createdAt")}
          render={(value) => <DateField value={value} format="LLL" />}
          sorter
        />
        <Table.Column<IOrder>
          fixed="right"
          title={t("table.actions")}
          dataIndex="actions"
          key="actions"
          align="center"
          render={(_value, record) => <OrderActions record={record} />}
        />
      </Table>
    </List>
  );
};

export default OrderList;
