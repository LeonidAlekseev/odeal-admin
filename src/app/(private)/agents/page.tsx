"use client";

import {
  useTranslate,
  getDefaultFilter,
  useNavigation,
  useGo,
  useExport,
} from "@refinedev/core";
import {
  CreateButton,
  CloneButton,
  EditButton,
  ExportButton,
  FilterDropdown,
  getDefaultSortOrder,
  List,
  useTable,
  useSelect,
} from "@refinedev/antd";
import { EyeOutlined, CopyOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Table,
  Avatar,
  Typography,
  theme,
  InputNumber,
  Input,
  Flex,
  Select,
} from "antd";
import InputMask from "react-input-mask";
import type { ICourier, IStatus } from "@/interfaces";
import { PaginationTotal, CourierStatus } from "@/components";
import { usePathname } from "next/navigation";
import { MEDIA_API_URL } from "@/utils/constants";

const CourierList = () => {
  const go = useGo();
  const pathname = usePathname();
  const { createUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();

  const { tableProps, filters, sorters } = useTable<ICourier>({
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

  const { isLoading, triggerExport } = useExport<ICourier>({
    sorters,
    filters,
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
    pageSize: 50,
    maxItemCount: 50, // TODO
    mapData: (item) => {
      return {
        id: item.id,
        fullName: item.user?.fullName,
        licensePlate: item.licensePlate,
        gsm: item.user?.gsm,
        store: item.store?.title,
        city: item.user?.city,
        status: item.status?.text,
        createdAt: item.createdAt,
      };
    },
  });

  const { selectProps: statusSelectProps } = useSelect<IStatus>({
    resource: "statuses",
    optionLabel: "text",
    optionValue: "text",
  });

  return (
    <>
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
              <PaginationTotal total={total} entityName="couriers" />
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
                  placeholder={t("couriers.filter.id.placeholder")}
                />
              </FilterDropdown>
            )}
          />
          <Table.Column
            key="user.avatar"
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
            sorter
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
            sorter
            key="user.gsm"
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
            sorter
            key="store.title"
            dataIndex={["store", "title"]}
            title={t("couriers.fields.store.label")}
          />
          <Table.Column<ICourier>
            sorter
            key="status.text"
            dataIndex={["status", "text"]}
            title={t("couriers.fields.status.label")}
            defaultSortOrder={getDefaultSortOrder("isActive", sorters)}
            defaultFilteredValue={getDefaultFilter("isActive", filters, "in")}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select
                  {...statusSelectProps}
                  placeholder={t("orders.fields.status")}
                  style={{ width: "200px" }}
                />
              </FilterDropdown>
            )}
            render={(_, record) => {
              return <CourierStatus value={record.status?.text} />;
            }}
          />
          <Table.Column
            key="actions"
            dataIndex="id"
            title={t("table.actions")}
            fixed="right"
            align="center"
            render={(value) => {
              return (
                <Flex gap={8} justify="flex-end" align="center">
                  <EditButton
                    // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                    icon={<EyeOutlined />}
                    recordItemId={value}
                    hideText
                  />
                  {/* <CloneButton
                    // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                    icon={<CopyOutlined />}
                    recordItemId={value}
                    hideText
                  /> */}
                </Flex>
              );
            }}
          />
        </Table>
      </List>
    </>
  );
};

export default CourierList;
