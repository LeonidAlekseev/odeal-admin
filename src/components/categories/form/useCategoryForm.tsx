"use client";

import { useState } from "react";
import { type UseFormProps, useForm } from "@refinedev/antd";
import type { ICategory } from "../../../interfaces";

type Props = {
  action: UseFormProps["action"];
};

export const useCategoryForm = (props: Props) => {
  const [isFormDisabled, setIsFormDisabled] = useState(
    () => props.action === "edit"
  );

  const form = useForm<ICategory>({
    action: props.action,
    redirect: false,
    onMutationSuccess: () => {
      setIsFormDisabled(true);
    },
  });
  const category = form.queryResult?.data?.data;

  const handleSetIsFormDisabled = (value: boolean) => {
    form.formProps.form?.resetFields();
    setIsFormDisabled(value);
  };

  const isLoading = form.queryResult?.isFetching || form.formLoading;

  return {
    ...form,
    category,
    formLoading: isLoading,
    isFormDisabled,
    setIsFormDisabled: handleSetIsFormDisabled,
  };
};
