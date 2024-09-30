"use client";

import { useGetToPath, useBack } from "@refinedev/core";
import { ProductDrawerForm } from "@/components/product/drawer-form";
import { useSearchParams } from "next/navigation";

const ProductCreate = () => {
  const back = useBack();

  return <ProductDrawerForm action="create" onMutationSuccess={back} />;
};

export default ProductCreate;
