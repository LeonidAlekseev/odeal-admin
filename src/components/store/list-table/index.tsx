import { useTranslate, getDefaultFilter } from "@refinedev/core";
import {
  useTable,
  ShowButton,
  FilterDropdown,
  getDefaultSortOrder,
  EditButton,
  CloneButton,
  DateField,
} from "@refinedev/antd";
import {
  Flex,
  Input,
  InputNumber,
  Select,
  Table,
  Typography,
  theme,
} from "antd";
import type { IStore } from "@/interfaces";
import { PaginationTotal } from "@/components";
import { CopyOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { StoreStatus } from "@/components/store";

export const StoreListTable = () => {
  const { token } = theme.useToken();
  const t = useTranslate();

  const { tableProps, sorters, filters } = useTable<IStore>({
    sorters: {
      initial: [
        {
          field: "id",
          order: "desc",
        },
      ],
    },
    syncWithLocation: true,
  });

  return (
    <Table
      {...tableProps}
      rowKey="id"
      scroll={{
        x: true,
      }}
      pagination={{
        ...tableProps.pagination,
        showTotal: (total) => (
          <PaginationTotal total={total} entityName="stores" />
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
        width={80}
        title={
          <Typography.Text
            style={{
              whiteSpace: "nowrap",
            }}
          >
            ID
          </Typography.Text>
        }
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
              placeholder={t("stores.filter.id.placeholder")}
            />
          </FilterDropdown>
        )}
      />
      <Table.Column
        sorter
        key="title"
        dataIndex="title"
        title={t("stores.fields.title")}
        filterIcon={(filtered) => (
          // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter("title", filters, "contains")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder={t("stores.filter.title.placeholder")} />
          </FilterDropdown>
        )}
      />
      <Table.Column
        sorter
        key="email"
        dataIndex="email"
        title={t("stores.fields.email")}
        filterIcon={(filtered) => (
          // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter("email", filters, "contains")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder={t("stores.filter.email.placeholder")} />
          </FilterDropdown>
        )}
      />
      <Table.Column
        sorter
        key="gsm"
        dataIndex="gsm"
        title={t("stores.fields.gsm")}
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
        key="createdAt"
        dataIndex="createdAt"
        title={t("orders.fields.createdAt")}
        render={(value) => <DateField value={value} format="LLL" />}
      />
      <Table.Column
        sorter
        key="isActive"
        dataIndex="isActive"
        title={t("stores.fields.isActive.label")}
        defaultSortOrder={getDefaultSortOrder("isActive", sorters)}
        defaultFilteredValue={getDefaultFilter("isActive", filters, "in")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Select
              style={{ width: "200px" }}
              allowClear
              mode="multiple"
              placeholder={t("stores.filter.isActive.placeholder")}
            >
              <Select.Option value="true">
                {t("stores.fields.isActive.true")}
              </Select.Option>
              <Select.Option value="false">
                {t("stores.fields.isActive.false")}
              </Select.Option>
            </Select>
          </FilterDropdown>
        )}
        render={(value) => <StoreStatus value={value} />}
      />
      <Table.Column<IStore>
        key="actions"
        dataIndex="id"
        fixed="right"
        title={t("table.actions")}
        align="center"
        render={(_, record) => (
          <Flex gap={8} justify="flex-end" align="center">
            <EditButton
              // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
              icon={<EyeOutlined />}
              recordItemId={record.id}
              hideText
            />
            {/* <CloneButton
              // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
              icon={<CopyOutlined />}
              recordItemId={record.id}
              hideText
            /> */}
          </Flex>
        )}
      />
    </Table>
  );
};
