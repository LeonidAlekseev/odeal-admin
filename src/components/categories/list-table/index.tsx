import { useTranslate, getDefaultFilter } from "@refinedev/core";
import {
  useTable,
  ShowButton,
  FilterDropdown,
  getDefaultSortOrder,
  EditButton,
} from "@refinedev/antd";
import { Input, InputNumber, Select, Table, Typography, theme } from "antd";
import type { ICategory } from "@/interfaces";
import {
  CategoryStatus,
  PaginationTotal,
  TableCategoryProductColumn,
} from "@/components";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";

export const CategoryListTable = () => {
  const { token } = theme.useToken();
  const t = useTranslate();

  const { tableProps, sorters, filters } = useTable<ICategory>({
    filters: {
      initial: [
        {
          field: "title",
          operator: "contains",
          value: "",
        },
      ],
    },
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
          <PaginationTotal total={total} entityName="categories" />
        ),
      }}
      locale={{
        emptyText: t("search.nothing"),
      }}
    >
      <Table.Column
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
              placeholder={t("categories.filter.id.placeholder")}
            />
          </FilterDropdown>
        )}
      />
      <Table.Column
        dataIndex="title"
        title={t("categories.fields.title")}
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
            <Input placeholder={t("categories.filter.title.placeholder")} />
          </FilterDropdown>
        )}
      />
      <Table.Column<ICategory>
        key="id"
        dataIndex="id"
        width={576}
        title={t("categories.fields.products")}
        render={(_, record) => {
          return <TableCategoryProductColumn category={record} />;
        }}
      />
      <Table.Column
        dataIndex="isActive"
        title={t("categories.fields.isActive.label")}
        sorter
        defaultSortOrder={getDefaultSortOrder("isActive", sorters)}
        defaultFilteredValue={getDefaultFilter("isActive", filters, "in")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Select
              style={{ width: "200px" }}
              allowClear
              mode="multiple"
              placeholder={t("categories.filter.isActive.placeholder")}
            >
              <Select.Option value="true">
                {t("categories.fields.isActive.true")}
              </Select.Option>
              <Select.Option value="false">
                {t("categories.fields.isActive.false")}
              </Select.Option>
            </Select>
          </FilterDropdown>
        )}
        render={(value) => <CategoryStatus value={value} />}
      />
      <Table.Column<ICategory>
        fixed="right"
        title={t("table.actions")}
        dataIndex="actions"
        key="actions"
        align="center"
        render={(_, record) => (
          <EditButton
            // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
            icon={<EyeOutlined />}
            recordItemId={record.id}
            hideText
          />
        )}
      />
    </Table>
  );
};
