"use client";

import { useState } from "react";
import { type HttpError, useList } from "@refinedev/core";
import { Flex, Popover, Avatar } from "antd";
import type { ICategory, IProduct } from "@/interfaces";
import { ProductDrawerForm } from "../../product/drawer-form";
import { ProductDrawerShow } from "../../product/drawer-show";
import { MEDIA_API_URL } from "@/utils/constants";

type Props = {
  category: ICategory;
};

export const TableCategoryProductColumn = ({ category }: Props) => {
  const [productId, setProductId] = useState<number | null>(null);
  const [drawerAction, setDrawerAction] = useState<"show" | "edit">("show");

  const { data, isLoading } = useList<IProduct, HttpError>({
    resource: "products",
    queryOptions: {
      enabled: !!category.id,
    },
    pagination: {
      mode: "off",
    },
    filters: [
      {
        field: "category.id",
        operator: "eq",
        value: category.id,
      },
    ],
    meta: {
      populate: ["image"],
    },
  });

  const products = data?.data || [];

  if (isLoading) {
    return (
      <Flex gap={8} wrap="wrap">
        {Array.from({ length: 10 }).map((_, index) => (
          <Avatar
            key={index}
            shape="square"
            style={{
              aspectRatio: 32 / 32,
              width: 32,
              height: 32,
            }}
          />
        ))}
      </Flex>
    );
  }

  return (
    <>
      <Flex gap={8} wrap="wrap">
        {products.map((product) => {
          const image = product?.image;
          return (
            <Popover
              key={product.id}
              title={product?.name?.substring(0, 12) + "..."}
              content={product?.description?.substring(0, 24) + "..."}
            >
              <Avatar
                shape="square"
                src={`${MEDIA_API_URL}${image?.thumbnail?.url || image?.url}`}
                alt={image?.name}
                style={{
                  cursor: "pointer",
                  aspectRatio: 32 / 32,
                  width: 32,
                  height: 32,
                }}
                onClick={() => {
                  setProductId(product.id);
                }}
              />
            </Popover>
          );
        })}
      </Flex>
      {productId &&
        (drawerAction === "show" ? (
          <ProductDrawerShow
            id={productId}
            onEdit={() => {
              setDrawerAction("edit");
            }}
            onClose={() => {
              setProductId(null);
            }}
          />
        ) : (
          <ProductDrawerForm
            action="edit"
            id={productId}
            onMutationSuccess={() => {
              setDrawerAction("show");
            }}
            onClose={() => {
              setProductId(null);
            }}
          />
        ))}
    </>
  );
};
