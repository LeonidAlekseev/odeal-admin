"use client";

import { useState } from "react";
import { type UseFormProps, useForm } from "@refinedev/antd";
import type { IOrder } from "@/interfaces";
import { Form } from "antd";

type Props = {
  action: UseFormProps["action"];
};

export const useOrderForm = (props: Props) => {
  const [isFormDisabled, setIsFormDisabled] = useState(
    () => props.action === "edit"
  );

  const form = useForm<IOrder>({
    action: props.action,
    redirect: false,
    onMutationSuccess: () => {
      setIsFormDisabled(true);
    },
    meta: {
      populate: {
        courier: {
          populate: {
            user: { populate: ["fullName"] },
            store: { populate: ["title"] },
          },
        },
        product: { populate: ["name"] },
        status: { populate: ["text"] },
      },
    },
  });

  const order = form.queryResult?.data?.data;

  const handleSetIsFormDisabled = (value: boolean) => {
    form.formProps.form?.resetFields();
    setIsFormDisabled(value);
  };

  const isLoading = form.queryResult?.isFetching || form.formLoading;

  return {
    ...form,
    order,
    formLoading: isLoading,
    isFormDisabled,
    setIsFormDisabled: handleSetIsFormDisabled,
  };
};

export const useOrderMetaForm = (props: Props) => {
  const [isFormDisabled, setIsFormDisabled] = useState(
    () => props.action === "edit" || props.action === "clone"
  );

  const form = useForm<IOrder>({
    action: props.action,
    redirect: false,
    onMutationSuccess: () => {
      setIsFormDisabled(true);
    },
    meta: {
      populate: {
        product: { populate: ["name", "metadata"] },
      },
    },
  });

  const order = form.queryResult?.data?.data;

  const handleSetIsFormDisabled = (value: boolean) => {
    form.formProps.form?.resetFields();
    setIsFormDisabled(value);
  };

  const isLoading = form.queryResult?.isFetching || form.formLoading;

  return {
    ...form,
    order,
    formLoading: isLoading,
    isFormDisabled,
    setIsFormDisabled: handleSetIsFormDisabled,
  };
};
