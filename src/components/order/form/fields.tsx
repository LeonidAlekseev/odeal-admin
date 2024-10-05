"use client";

import { useEffect, useRef } from "react";
import {
  type UseFormProps,
  useNavigation,
  useTranslate,
} from "@refinedev/core";
import {
  useSelect,
  DeleteButton,
  ListButton,
  SaveButton,
  type UseFormReturnType,
} from "@refinedev/antd";
import {
  Form,
  Input,
  type InputProps,
  Segmented,
  Card,
  Flex,
  Divider,
  InputNumber,
  Button,
  type InputRef,
  Select,
} from "antd";
import _debounce from "lodash/debounce";
import type { IOrder, IStatus } from "@/interfaces";
import {
  EditOutlined,
  FunctionOutlined,
  RightCircleOutlined,
  ScanOutlined,
  TagsOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { FormItemEditable, FormItemHorizontal } from "../../form";
import { OrderStatus } from "../status";

type Props = {
  order?: IOrder;
  formProps: UseFormReturnType<IOrder>["formProps"];
  saveButtonProps: UseFormReturnType<IOrder>["saveButtonProps"];
  action: UseFormProps["action"];
  isFormDisabled: boolean;
  setIsFormDisabled: (value: boolean) => void;
};

export const OrderFormFields = ({
  order,
  formProps,
  saveButtonProps,
  action,
  isFormDisabled,
  setIsFormDisabled,
}: Props) => {
  const titleInputRef = useRef<InputRef>(null);

  const t = useTranslate();
  const { list } = useNavigation();

  useEffect(() => {
    if (!isFormDisabled) {
      titleInputRef.current?.focus();
    }
  }, [isFormDisabled]);

  const statusField = Form.useWatch("status", formProps.form);

  const { selectProps: productsSelectProps } = useSelect({
    resource: "products",
    optionLabel: "name",
    optionValue: "id",
    defaultValue: order?.courier?.id,
  });

  const { selectProps: courierSelectProps } = useSelect({
    resource: "couriers",
    optionLabel: "user.fullName",
    optionValue: "id",
    defaultValue: order?.courier?.id,
    meta: {
      populate: ["user"],
    },
  });

  const { selectProps: statusSelectProps } = useSelect<IStatus>({
    resource: "statuses",
    optionLabel: "text",
    optionValue: "text",
  });

  return (
    <Form {...formProps} layout="horizontal" disabled={isFormDisabled}>
      <FormItemEditable
        formItemProps={{
          name: "orderNumber",
          style: {
            width: "100%",
            marginBottom: "0",
          },
          rules: [
            {
              required: true,
            },
          ],
        }}
      >
        <Input
          ref={titleInputRef}
          size="large"
          placeholder={t("orders.fields.orderNumber")}
        />
      </FormItemEditable>
      <Card
        style={{
          marginTop: "16px",
        }}
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <FormItemHorizontal
          name={["status", "text"]}
          initialValue={true}
          // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
          icon={<RightCircleOutlined />}
          label={t("orders.fields.status")}
        >
          {isFormDisabled ? (
            <OrderStatus status={statusField?.text} />
          ) : (
            <Select
              {...statusSelectProps}
              placeholder={t("orders.fields.status")}
              style={{ width: "200px" }}
            />
          )}
        </FormItemHorizontal>
        <Divider
          style={{
            margin: 0,
          }}
        />
        <FormItemHorizontal
          // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
          icon={<ScanOutlined />}
          label={t("orders.fields.product")}
          name={["product", "name"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            {...productsSelectProps}
            placeholder={t("orders.fields.products")}
            style={{ width: "200px" }}
          />
        </FormItemHorizontal>
        <Divider
          style={{
            margin: 0,
          }}
        />
        <FormItemHorizontal
          // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
          icon={<TagsOutlined />}
          label={t("orders.fields.amount")}
          name="amount"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber prefix={"₽"} style={{ width: "150px" }} />
        </FormItemHorizontal>
        <Divider
          style={{
            margin: 0,
          }}
        />
        <FormItemHorizontal
          // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
          icon={<ScanOutlined />}
          label={t("orders.fields.courier")}
          name={["courier", "user", "fullName"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            {...courierSelectProps}
            placeholder={t("orders.fields.courier")}
            style={{ width: "200px" }}
          />
        </FormItemHorizontal>
      </Card>
      <Flex
        align="center"
        justify="space-between"
        style={{
          padding: "16px 16px 0px 16px",
        }}
      >
        {(action === "create" || action === "clone") && (
          <>
            <ListButton icon={false}>{t("actions.cancel")}</ListButton>
            <SaveButton
              {...saveButtonProps}
              style={{
                marginLeft: "auto",
              }}
              htmlType="submit"
              type="primary"
              icon={null}
            >
              {t("buttons.save")}
            </SaveButton>
          </>
        )}
        {action === "edit" &&
          (isFormDisabled ? (
            <>
              <DeleteButton
                type="text"
                onSuccess={() => {
                  list("orders");
                }}
                style={{
                  marginLeft: "-16px",
                }}
              />
              <Button
                style={{
                  marginLeft: "auto",
                }}
                disabled={false}
                // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                icon={<EditOutlined />}
                onClick={() => setIsFormDisabled(false)}
              >
                {t("actions.edit")}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setIsFormDisabled(true)}>
                {t("actions.cancel")}
              </Button>
              <SaveButton
                {...saveButtonProps}
                style={{
                  marginLeft: "auto",
                }}
                htmlType="submit"
                type="primary"
                icon={null}
              >
                {t("buttons.save")}
              </SaveButton>
            </>
          ))}
      </Flex>
    </Form>
  );
};
