"use client";

import { CreateButton, List } from "@refinedev/antd";

import { StoreListTable } from "@/components";
import { Segmented } from "antd";
import { useTranslate } from "@refinedev/core";

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
            {t("stores.addNewStore")}
          </CreateButton>,
        ]}
      >
        <StoreListTable />
      </List>
    </>
  );
};

export default StoreList;
