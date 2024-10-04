"use client";

import { useState } from "react";
import { type UseFormProps, useForm } from "@refinedev/antd";
import type { IProduct } from "../../../interfaces";

type Props = {
  action: UseFormProps["action"];
};

export const useProductForm = (props: Props) => {
  const [isFormDisabled, setIsFormDisabled] = useState(
    () => props.action === "edit"
  );

  const form = useForm<IProduct>({
    action: props.action,
    redirect: false,
    onMutationSuccess: () => {
      setIsFormDisabled(true);
    },
    meta: {
      populate: ["category", "image"],
    },
  });
  const product = form.queryResult?.data?.data;

  const handleSetIsFormDisabled = (value: boolean) => {
    form.formProps.form?.resetFields();
    setIsFormDisabled(value);
  };

  const isLoading = form.queryResult?.isFetching || form.formLoading;

  return {
    ...form,
    product,
    formLoading: isLoading,
    isFormDisabled,
    setIsFormDisabled: handleSetIsFormDisabled,
  };
};
