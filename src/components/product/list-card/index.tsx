"use client";

import {
  type HttpError,
  useGo,
  useList,
  useNavigation,
  useTranslate,
} from "@refinedev/core";
import {
  CloneButton,
  EditButton,
  NumberField,
  useSimpleList,
} from "@refinedev/antd";
import type { ICategory, IProduct } from "@/interfaces";
import {
  Card,
  Divider,
  Flex,
  List,
  Skeleton,
  Tag,
  Typography,
  theme,
} from "antd";
import { ProductStatus } from "../status";
import { PaginationTotal } from "../../paginationTotal";
import { EyeOutlined, CopyOutlined, TagOutlined } from "@ant-design/icons";
import { useMemo } from "react";
import { useStyles } from "./styled";
import { usePathname } from "next/navigation";
import { MEDIA_API_URL } from "@/utils/constants";

export const ProductListCard = () => {
  const { styles, cx } = useStyles();
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const pathname = usePathname();
  const { showUrl } = useNavigation();

  const {
    listProps: productListProps,
    filters,
    setFilters,
  } = useSimpleList<IProduct, HttpError>({
    pagination: {
      current: 1,
      pageSize: 12,
    },
    filters: {
      initial: [
        {
          field: "category.id",
          operator: "in",
          value: [],
        },
      ],
    },
    meta: {
      populate: ["image", "category"],
    },
  });

  const { data: categoryData, isLoading: categoryIsLoading } = useList<
    ICategory,
    HttpError
  >({
    resource: "categories",
    pagination: {
      mode: "off",
    },
  });
  const categories = categoryData?.data || [];

  const categoryFilters = useMemo(() => {
    const filter = filters.find((filter) => {
      if ("field" in filter) {
        return filter.field === "category.id";
      }

      return false;
    });

    const filterValues = filter?.value?.map((value: string | number) =>
      Number(value)
    );

    return {
      operator: filter?.operator || "in",
      value: (filterValues || []) as number[],
    };
  }, [filters]).value;

  const hasCategoryFilter = categoryFilters?.length > 0;

  const handleOnTagClick = (categoryId: number) => {
    const newFilters = categoryFilters;
    const hasCurrentFilter = newFilters.includes(categoryId);
    if (hasCurrentFilter) {
      newFilters.splice(newFilters.indexOf(categoryId), 1);
    } else {
      newFilters.push(categoryId);
    }

    setFilters([
      {
        field: "category.id",
        operator: "in",
        value: newFilters,
      },
    ]);
  };

  return (
    <>
      <Divider style={{ margin: "16px 0px" }} />
      <Flex
        wrap="nowrap"
        gap={12}
        style={{
          width: "100%",
          overflowX: "auto",
        }}
      >
        <Tag
          style={{ padding: "4px 10px 4px 10px", cursor: "pointer" }}
          color={!hasCategoryFilter ? token.colorPrimary : undefined}
          // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
          icon={<TagOutlined />}
          onClick={() => {
            setFilters([
              {
                field: "category.id",
                operator: "in",
                value: [],
              },
            ]);
          }}
        >
          {t("products.filter.allCategories.label")}
        </Tag>
        {!categoryIsLoading &&
          categories.map((category) => (
            <Tag
              key={category.id}
              color={
                categoryFilters?.includes(category.id) ? "orange" : undefined
              }
              style={{
                padding: "4px 10px 4px 10px",
                cursor: "pointer",
              }}
              onClick={() => {
                handleOnTagClick(category.id);
              }}
            >
              {category.title}
            </Tag>
          ))}

        {categoryIsLoading &&
          Array.from({ length: 10 }).map((_, index) => (
            <Skeleton.Button
              key={index}
              style={{
                width: "108px",
                height: "30px",
              }}
              active
            />
          ))}
      </Flex>
      <Divider style={{ margin: "16px 0px" }} />
      <List
        {...productListProps}
        pagination={{
          ...productListProps.pagination,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName={"products"} />
          ),
        }}
        grid={{
          gutter: [16, 16],
          column: 4,
          xxl: 4,
          xl: 4,
          lg: 3,
          md: 2,
          sm: 1,
          xs: 1,
        }}
        renderItem={(item) => (
          <List.Item style={{ height: "100%" }}>
            <Card
              hoverable
              bordered={false}
              className={styles.card}
              styles={{
                body: {
                  padding: 16,
                },
                cover: {
                  position: "relative",
                },
                actions: {
                  marginTop: "auto",
                },
              }}
              cover={
                <>
                  <Flex gap={8} justify="center" align="center">
                    <EditButton
                      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                      icon={<EyeOutlined />}
                      recordItemId={item.id}
                      className={cx(styles.viewButton, "viewButton")}
                      hideText
                    />
                    <CloneButton
                      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                      icon={<CopyOutlined />}
                      recordItemId={item.id}
                      className={cx(styles.cloneButton, "cloneButton")}
                      hideText
                    />
                  </Flex>
                  <img
                    src={`${MEDIA_API_URL}${item.image?.url}`}
                    alt={item.image?.name}
                    style={{
                      aspectRatio: 288 / 160,
                      objectFit: "cover",
                    }}
                  />
                </>
              }
              actions={[
                <Flex
                  key="actions"
                  justify="space-between"
                  style={{
                    padding: "0 16px",
                  }}
                >
                  <Typography.Text key="category.title">
                    {
                      categories.find(
                        (category) => category.id === item.category.id
                      )?.title
                    }
                  </Typography.Text>
                  <ProductStatus key="status" value={item.isActive} />
                </Flex>,
              ]}
            >
              <Card.Meta
                title={
                  <Flex>
                    <Typography.Title
                      level={5}
                      ellipsis={{
                        rows: 1,
                        tooltip: item.name,
                      }}
                    >
                      {item.name}
                    </Typography.Title>

                    <NumberField
                      value={item.price}
                      style={{
                        paddingLeft: "8px",
                        marginLeft: "auto",
                      }}
                      options={{
                        style: "currency",
                        currency: "RUB",
                      }}
                    />
                  </Flex>
                }
                description={item.description}
              />
            </Card>
          </List.Item>
        )}
      />
    </>
  );
};
