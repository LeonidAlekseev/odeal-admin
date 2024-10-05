"use client";

import { useState } from "react";
import { type UseFormProps, useForm } from "@refinedev/antd";
import type { IStore } from "@/interfaces";

type Props = {
  action: UseFormProps["action"];
};

export const useStoreForm = (props: Props) => {
  const [isFormDisabled, setIsFormDisabled] = useState(
    () => props.action === "edit"
  );

  const form = useForm<IStore>({
    action: props.action,
    redirect: false,
    onMutationSuccess: () => {
      setIsFormDisabled(true);
    },
  });
  const store = form.queryResult?.data?.data;

  const handleSetIsFormDisabled = (value: boolean) => {
    form.formProps.form?.resetFields();
    setIsFormDisabled(value);
  };

  const isLoading = form.queryResult?.isFetching || form.formLoading;

  return {
    ...form,
    store,
    formLoading: isLoading,
    isFormDisabled,
    setIsFormDisabled: handleSetIsFormDisabled,
  };
};
