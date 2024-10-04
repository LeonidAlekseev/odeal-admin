import { useTable } from "@refinedev/antd";
import type { IProduct, ICategory } from "../../../interfaces";
import { Table } from "antd";
import { useTranslate } from "@refinedev/core";

type Props = {
  category?: ICategory;
};

export const CategoryProductTable = (props: Props) => {
  const t = useTranslate();

  const { tableProps } = useTable<IProduct>({
    resource: "products",
    filters: {
      permanent: [
        {
          field: "category.id",
          value: props.category?.id,
          operator: "eq",
        },
      ],
    },
    pagination: {
      mode: "off",
    },
    queryOptions: {
      enabled: !!props.category?.id,
    },
  });

  return (
    <Table
      {...tableProps}
      rowKey="id"
      scroll={{
        x: true,
      }}
      locale={{
        emptyText: t("search.nothing"),
      }}
    >
      <Table.Column
        dataIndex="name"
        title={t("products.products")}
        render={(value) => value}
      />
      <Table.Column
        dataIndex="description"
        title={t("products.fields.description")}
        render={(value) => value}
      />
    </Table>
  );
};
