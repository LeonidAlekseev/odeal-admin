"use client";

import { useEffect, useState } from "react";
import { type UseFormProps, useForm } from "@refinedev/antd";
import { useDebounceValue } from "usehooks-ts";
import type { IStore } from "../../../interfaces";

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

  // we are using these debounced values to get lang and lat from the address text
  // to minimize the number of requests, we are using debounced values
  const [debouncedAdressValue, setDebouncedAdressValue] = useDebounceValue(
    form.formProps.form?.getFieldValue(["address", "text"]),
    500
  );

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
    handleAddressChange: (address: string) => setDebouncedAdressValue(address),
  };
};
