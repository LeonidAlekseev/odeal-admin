"use client";

import { useMemo } from "react";
import {
  useTranslate,
  type HttpError,
  getDefaultFilter,
  useExport,
  useGo,
  useNavigation,
} from "@refinedev/core";
import {
  List,
  useTable,
  DateField,
  FilterDropdown,
  getDefaultSortOrder,
  ExportButton,
} from "@refinedev/antd";
import {
  Table,
  Avatar,
  Typography,
  theme,
  InputNumber,
  Input,
  Select,
  Button,
} from "antd";

import type { ICustomer, IUser, IUserFilterVariables } from "@/interfaces";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { PaginationTotal, UserStatus } from "@/components";
import { usePathname } from "next/navigation";
import { MEDIA_API_URL } from "@/utils/constants";

const CustomerList = () => {
  const go = useGo();
  const pathname = usePathname();
  const { showUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();

  const { tableProps, filters, sorters } = useTable<
    ICustomer,
    HttpError,
    IUserFilterVariables
  >({
    filters: {
      initial: [
        {
          field: "user.fullName",
          operator: "contains",
          value: "",
        },
      ],
    },
    sorters: {
      initial: [
        {
          field: "id",
          order: "desc",
        },
      ],
    },
    syncWithLocation: true,
    meta: {
      populate: {
        user: {
          populate: ["avatar"],
        },
      },
    },
  });

  const { isLoading, triggerExport } = useExport<ICustomer>({
    sorters,
    filters,
    meta: {
      populate: {
        user: {
          populate: ["fullName", "gsm", "isActive"],
        },
      },
    },
    pageSize: 50,
    maxItemCount: 50, // TODO
    mapData: (item) => {
      return {
        id: item.id,
        fullName: item.user?.fullName,
        gsm: item.user?.gsm,
        isActive: item.user?.isActive,
        createdAt: item.createdAt,
      };
    },
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
        scroll={{ x: true }}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="users" />
          ),
        }}
        locale={{
          emptyText: t("search.nothing"),
        }}
      >
        <Table.Column
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
          key="avatar"
          dataIndex={["user", "avatar"]}
          title={t("users.fields.avatar.label")}
          render={(value) => <Avatar src={`${MEDIA_API_URL}${value?.url}`} />}
        />
        <Table.Column
          key="fullName"
          dataIndex={["user", "fullName"]}
          title={t("users.fields.name")}
          defaultFilteredValue={getDefaultFilter(
            "user.fullName",
            filters,
            "contains"
          )}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input
                style={{ width: "100%" }}
                placeholder={t("users.filter.name.placeholder")}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column
          key="gsm"
          dataIndex={["user", "gsm"]}
          title={t("users.fields.gsm")}
          defaultFilteredValue={getDefaultFilter("user.gsm", filters, "eq")}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input
                style={{ width: "100%" }}
                placeholder={t("users.filter.gsm.placeholder")}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column
          key="createdAt"
          dataIndex="createdAt"
          title={t("users.fields.createdAt")}
          render={(value) => <DateField value={value} format="LLL" />}
          sorter
        />
        <Table.Column
          key="isActive"
          dataIndex={["user", "isActive"]}
          title={t("users.fields.isActive.label")}
          render={(value) => {
            return <UserStatus value={value} />;
          }}
          sorter
          defaultSortOrder={getDefaultSortOrder("isActive", sorters)}
          defaultFilteredValue={getDefaultFilter(
            "user.isActive",
            filters,
            "eq"
          )}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                style={{ width: "100%" }}
                placeholder={t("users.filter.isActive.placeholder")}
              >
                <Select.Option value="true">
                  {t("users.fields.isActive.true")}
                </Select.Option>
                <Select.Option value="false">
                  {t("users.fields.isActive.false")}
                </Select.Option>
              </Select>
            </FilterDropdown>
          )}
        />
        <Table.Column<ICustomer>
          fixed="right"
          title={t("table.actions")}
          render={(_, record) => (
            <Button
              // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
              icon={<EyeOutlined />}
              onClick={() => {
                return go({
                  to: `${showUrl("customers", record.id)}`,
                  query: {
                    to: pathname,
                  },
                  options: {
                    keepQuery: true,
                  },
                  type: "push",
                });
              }}
            />
          )}
        />
      </Table>
    </List>
  );
};

export default CustomerList;
