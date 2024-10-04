"use client";

import { useTranslate } from "@refinedev/core";
import { CreateButton, List } from "@refinedev/antd";
import { Segmented } from "antd";
import { CategoryListTable } from "@/components";

const StoreList = () => {
  const t = useTranslate();

  return (
    <>
      <List
        breadcrumb={false}
        headerButtons={(props) => [
          <Segmented
            key="view"
            size="large"
            value={"table"}
            style={{ marginRight: 24 }}
            options={[]}
          />,
          <CreateButton {...props.createButtonProps} key="create" size="large">
            {t("categories.addNewCategory")}
          </CreateButton>,
        ]}
      >
        <CategoryListTable />
      </List>
    </>
  );
};

export default StoreList;
