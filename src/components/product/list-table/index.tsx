"use client";

import {
  type HttpError,
  getDefaultFilter,
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
import type { ICategory, IProduct } from "@/interfaces";
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
import { ProductStatus } from "../status";
import { PaginationTotal } from "../../paginationTotal";
import { EyeOutlined, CopyOutlined, SearchOutlined } from "@ant-design/icons";
import { MEDIA_API_URL } from "@/utils/constants";

export const ProductListTable = () => {
  const { token } = theme.useToken();
  const t = useTranslate();

  const { tableProps, sorters, filters } = useTable<IProduct, HttpError>({
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
      populate: ["image", "category"],
    },
  });

  const { selectProps: categorySelectProps, query: queryResult } =
    useSelect<ICategory>({
      resource: "categories",
      optionLabel: "title",
      optionValue: "id",
      defaultValue: getDefaultFilter("category.id", filters, "in"),
    });

  const categories = queryResult?.data?.data || [];

  return (
    <Table
      {...tableProps}
      rowKey="id"
      scroll={{ x: true }}
      pagination={{
        ...tableProps.pagination,
        showTotal: (total) => (
          <PaginationTotal total={total} entityName="products" />
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
              placeholder={t("products.filter.id.placeholder")}
            />
          </FilterDropdown>
        )}
      />
      <Table.Column
        key="image"
        dataIndex="image"
        title={t("products.fields.image.label")}
        render={(image: IProduct["image"]) => {
          return (
            <Avatar
              shape="square"
              src={`${MEDIA_API_URL}${image?.thumbnail?.url || image?.url}`}
              alt={image?.name}
            />
          );
        }}
      />
      <Table.Column
        sorter
        key="name"
        dataIndex="name"
        title={t("products.fields.name")}
        filterIcon={(filtered) => (
          // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter("name", filters, "contains")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder={t("products.filter.name.placeholder")} />
          </FilterDropdown>
        )}
        render={(value: string) => {
          return (
            <Typography.Text
              style={{
                whiteSpace: "nowrap",
              }}
            >
              {value}
            </Typography.Text>
          );
        }}
      />
      <Table.Column
        sorter
        key="description"
        dataIndex="description"
        title={t("products.fields.description")}
        width={432}
        filterIcon={(filtered) => (
          // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter(
          "description",
          filters,
          "contains"
        )}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder={t("products.filter.description.placeholder")} />
          </FilterDropdown>
        )}
        render={(description: string) => {
          return (
            <Typography.Paragraph
              ellipsis={{ rows: 1, tooltip: true }}
              style={{
                maxWidth: "400px",
                marginBottom: 0,
              }}
            >
              {description}
            </Typography.Paragraph>
          );
        }}
      />
      <Table.Column
        sorter
        key="price"
        dataIndex="price"
        title={t("products.fields.price")}
        align="right"
        defaultSortOrder={getDefaultSortOrder("price", sorters)}
        render={(price: number) => {
          return (
            <NumberField
              value={price}
              style={{
                width: "80px",
                fontVariantNumeric: "tabular-nums",
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
      <Table.Column<IProduct>
        sorter
        key="category.id"
        dataIndex={["category", "title"]}
        title={t("products.fields.category")}
        width={128}
        defaultFilteredValue={getDefaultFilter("category.id", filters, "in")}
        filterDropdown={(props) => {
          return (
            <FilterDropdown
              {...props}
              selectedKeys={props.selectedKeys.map((item) => Number(item))}
            >
              <Select
                {...categorySelectProps}
                style={{ width: "200px" }}
                allowClear
                mode="multiple"
                placeholder={t("products.filter.category.placeholder")}
              />
            </FilterDropdown>
          );
        }}
        render={(_, record) => {
          const category = categories.find(
            (category) => category?.id === record.category?.id
          );

          return (
            <Typography.Text
              style={{
                whiteSpace: "nowrap",
              }}
            >
              {category?.title || "-"}
            </Typography.Text>
          );
        }}
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
        title={t("products.fields.isActive.label")}
        defaultSortOrder={getDefaultSortOrder("isActive", sorters)}
        defaultFilteredValue={getDefaultFilter("isActive", filters, "in")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Select
              style={{ width: "200px" }}
              allowClear
              mode="multiple"
              placeholder={t("products.filter.isActive.placeholder")}
            >
              <Select.Option value="true">
                {t("products.fields.isActive.true")}
              </Select.Option>
              <Select.Option value="false">
                {t("products.fields.isActive.false")}
              </Select.Option>
            </Select>
          </FilterDropdown>
        )}
        render={(isActive: boolean) => {
          return <ProductStatus value={isActive} />;
        }}
      />
      <Table.Column
        key="actions"
        dataIndex="id"
        title={t("table.actions")}
        fixed="right"
        align="center"
        render={(_, record: IProduct) => {
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
