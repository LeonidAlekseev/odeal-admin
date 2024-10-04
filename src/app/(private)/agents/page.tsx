"use client";

import {
  useTranslate,
  getDefaultFilter,
  useNavigation,
  useGo,
} from "@refinedev/core";
import {
  CreateButton,
  EditButton,
  FilterDropdown,
  List,
  useTable,
} from "@refinedev/antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { Table, Avatar, Typography, theme, InputNumber, Input } from "antd";
import InputMask from "react-input-mask";
import type { ICourier } from "@/interfaces";
import { PaginationTotal, CourierStatus } from "@/components";
import { usePathname } from "next/navigation";
import { MEDIA_API_URL } from "@/utils/constants";

const CourierList = () => {
  const go = useGo();
  const pathname = usePathname();
  const { createUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();

  const { tableProps, filters } = useTable<ICourier>({
    filters: {
      initial: [
        {
          field: "user.fullName",
          operator: "contains",
          value: "",
        },
        {
          field: "licensePlate",
          operator: "contains",
          value: "",
        },
        {
          field: "user.email",
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
        store: {
          populate: ["title"],
        },
        status: {
          populate: ["text"],
        },
      },
    },
  });

  return (
    <>
      <List
        breadcrumb={false}
        headerButtons={(props) => [
          <CreateButton
            {...props.createButtonProps}
            key="create"
            size="large"
            onClick={() => {
              return go({
                to: `${createUrl("couriers")}`,
                query: {
                  to: pathname,
                },
                options: {
                  keepQuery: true,
                },
                type: "push",
              });
            }}
          >
            {t("couriers.actions.add")}
          </CreateButton>,
        ]}
      >
        <Table
          {...tableProps}
          rowKey="id"
          scroll={{ x: true }}
          pagination={{
            ...tableProps.pagination,
            showTotal: (total) => (
              <PaginationTotal total={total} entityName="couriers" />
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
                  placeholder={t("couriers.filter.id.placeholder")}
                />
              </FilterDropdown>
            )}
          />
          <Table.Column
            key="avatar"
            dataIndex={["user", "avatar"]}
            title={t("couriers.fields.avatar.label")}
            render={(value) => <Avatar src={`${MEDIA_API_URL}${value?.url}`} />}
          />
          <Table.Column<ICourier>
            key="fullName"
            dataIndex={["user", "fullName"]}
            title={t("couriers.fields.name.label")}
            filterIcon={(filtered) => (
              // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
              <SearchOutlined
                style={{
                  color: filtered ? token.colorPrimary : undefined,
                }}
              />
            )}
            defaultFilteredValue={getDefaultFilter(
              "user.fullName",
              filters,
              "contains"
            )}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder={t("couriers.filter.name.placeholder")} />
              </FilterDropdown>
            )}
          />
          <Table.Column
            key="licensePlate"
            dataIndex="licensePlate"
            title={() => {
              return (
                <Typography.Text
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {t("couriers.fields.licensePlate.label")}
                </Typography.Text>
              );
            }}
            filterIcon={(filtered) => (
              // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
              <SearchOutlined
                style={{
                  color: filtered ? token.colorPrimary : undefined,
                }}
              />
            )}
            defaultFilteredValue={getDefaultFilter(
              "licensePlate",
              filters,
              "contains"
            )}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input
                  placeholder={t("couriers.filter.licensePlate.placeholder")}
                />
              </FilterDropdown>
            )}
            render={(value) => (
              <Typography.Text
                style={{
                  whiteSpace: "nowrap",
                }}
              >
                {value}
              </Typography.Text>
            )}
          />
          <Table.Column
            key="gsm"
            dataIndex={["user", "gsm"]}
            title={t("couriers.fields.gsm.label")}
            filterIcon={(filtered) => (
              // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
              <SearchOutlined
                style={{
                  color: filtered ? token.colorPrimary : undefined,
                }}
              />
            )}
            defaultFilteredValue={getDefaultFilter("user.gsm", filters, "eq")}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <InputMask mask="(999) 999 99 99">
                  {/* 
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore */}
                  {(props: InputProps) => <Input {...props} />}
                </InputMask>
              </FilterDropdown>
            )}
            render={(value) => (
              <Typography.Text
                style={{
                  whiteSpace: "nowrap",
                }}
              >
                {value}
              </Typography.Text>
            )}
          />
          <Table.Column<ICourier>
            dataIndex={["store", "title"]}
            key="store"
            title={t("couriers.fields.store.label")}
          />
          <Table.Column<ICourier>
            dataIndex={["status", "text"]}
            key="status"
            title={t("couriers.fields.status.label")}
            render={(_, record) => {
              return <CourierStatus value={record.status.text} />;
            }}
          />
          <Table.Column
            title={t("table.actions")}
            key="actions"
            dataIndex="id"
            fixed="right"
            align="center"
            render={(value) => {
              return (
                <EditButton
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  icon={<EyeOutlined />}
                  hideText
                  recordItemId={value}
                />
              );
            }}
          />
        </Table>
      </List>
    </>
  );
};

export default CourierList;
