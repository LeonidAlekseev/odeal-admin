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
import type { IProduct } from "@/interfaces";
import {
  EditOutlined,
  FunctionOutlined,
  RightCircleOutlined,
  ScanOutlined,
  TagsOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { FormItemEditable, FormItemHorizontal } from "../../form";
import { ProductStatus } from "../status";
import { ProductFormItemAvatar } from "../form-item-avatar";

type Props = {
  product?: IProduct;
  formProps: UseFormReturnType<IProduct>["formProps"];
  saveButtonProps: UseFormReturnType<IProduct>["saveButtonProps"];
  action: UseFormProps["action"];
  isFormDisabled: boolean;
  setIsFormDisabled: (value: boolean) => void;
};

export const ProductFormFields = ({
  product,
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

  const statusField = Form.useWatch("isActive", formProps.form);

  const { selectProps: storeSelectProps } = useSelect({
    resource: "categories",
    defaultValue: product?.category?.id,
  });

  return (
    <Form {...formProps} layout="horizontal" disabled={isFormDisabled}>
      <Flex align="center" gap={24}>
        <ProductFormItemAvatar
          formProps={formProps}
          disabled={isFormDisabled}
        />
        <FormItemEditable
          formItemProps={{
            name: "name",
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
            placeholder={t("products.fields.name")}
          />
        </FormItemEditable>
      </Flex>
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
          name="isActive"
          initialValue={true}
          // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
          icon={<RightCircleOutlined />}
          label={t("products.fields.isActive.label")}
        >
          {isFormDisabled ? (
            <ProductStatus value={statusField} />
          ) : (
            <Segmented
              options={[
                {
                  label: t("products.fields.isActive.true"),
                  value: true,
                },
                {
                  label: t("products.fields.isActive.false"),
                  value: false,
                },
              ]}
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
          label={t("products.fields.category")}
          name={["category", "id"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select {...storeSelectProps} />
        </FormItemHorizontal>
        <Divider
          style={{
            margin: 0,
          }}
        />
        <FormItemHorizontal
          // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
          icon={<TagsOutlined />}
          label={t("products.fields.price")}
          name="price"
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
          icon={<UnorderedListOutlined />}
          label={t("products.fields.description")}
          name="description"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea />
        </FormItemHorizontal>
        {action != "create" && (
          <FormItemHorizontal
            // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
            icon={<FunctionOutlined />}
            label={t("products.fields.metadata.label")}
            name="metadata"
            rules={[
              {
                required: true,
              },
            ]}
            flexProps={{ style: { height: "0px", overflow: "hidden" } }}
          >
            <Input type="hidden" />
          </FormItemHorizontal>
        )}
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
                  list("products");
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
