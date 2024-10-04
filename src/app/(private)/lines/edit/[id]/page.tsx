"use client";

import { useTranslate } from "@refinedev/core";
import { ListButton } from "@refinedev/antd";
import { Flex, Divider } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { CategoryForm } from "@/components";
import _debounce from "lodash/debounce";

const CategoryEdit = () => {
  const t = useTranslate();

  return (
    <>
      <Flex>
        {/* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */}
        <ListButton icon={<LeftOutlined />}>
          {t("categories.categories")}
        </ListButton>
      </Flex>
      <Divider />
      <CategoryForm action="edit" />
    </>
  );
};

export default CategoryEdit;
