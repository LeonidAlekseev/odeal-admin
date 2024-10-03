import { useTable } from "@refinedev/antd";
import type { ICourier, IStore } from "../../../interfaces";
import { Table } from "antd";
import { useTranslate } from "@refinedev/core";

type Props = {
  store?: IStore;
};

export const StoreCourierTable = (props: Props) => {
  const t = useTranslate();

  const { tableProps } = useTable<ICourier>({
    resource: "couriers",
    filters: {
      permanent: [
        {
          field: "store.id",
          value: props.store?.id,
          operator: "eq",
        },
      ],
    },
    pagination: {
      mode: "off",
    },
    queryOptions: {
      enabled: !!props.store?.id,
    },
    meta: {
      populate: {
        user: {
          populate: ["fullName"],
        },
      },
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
        dataIndex={["user", "fullName"]}
        title={t("couriers.couriers")}
        render={(value) => value}
      />
      <Table.Column
        dataIndex="licensePlate"
        title={t("couriers.fields.licensePlate.label")}
        render={(value) => value}
      />
    </Table>
  );
};
