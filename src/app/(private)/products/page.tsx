"use client";

import { useGo, useNavigation, useTranslate } from "@refinedev/core";
import { CreateButton, List } from "@refinedev/antd";
import { ProductListCard, ProductListTable } from "@/components";
import { useState } from "react";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Segmented } from "antd";
import { usePathname } from "next/navigation";

type View = "table" | "card";

const ProductList = () => {
  const go = useGo();
  const { replace } = useNavigation();
  const pathname = usePathname();
  const { createUrl } = useNavigation();

  const [view, setView] = useState<View>(
    (localStorage.getItem("product-view") as View) || "table"
  );

  const handleViewChange = (value: View) => {
    // remove query params (pagination, filters, etc.) when changing view
    replace("");

    setView(value);
    localStorage.setItem("product-view", value);
  };

  const t = useTranslate();

  return (
    <List
      breadcrumb={false}
      headerButtons={(props) => [
        <Segmented<View>
          key="view"
          size="large"
          value={view}
          style={{ marginRight: 24 }}
          options={[
            {
              label: "",
              value: "table",
              // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
              icon: <UnorderedListOutlined />,
            },
            {
              label: "",
              value: "card",
              // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
              icon: <AppstoreOutlined />,
            },
          ]}
          onChange={handleViewChange}
        />,
        <CreateButton
          {...props.createButtonProps}
          key="create"
          size="large"
          onClick={() => {
            return go({
              to: `${createUrl("products")}`,
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
          {t("products.actions.add")}
        </CreateButton>,
      ]}
    >
      {view === "table" && <ProductListTable />}
      {view === "card" && <ProductListCard />}
    </List>
  );
};

export default ProductList;
