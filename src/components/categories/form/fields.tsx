"use client";

import { useEffect, useRef } from "react";
import {
  type UseFormProps,
  useNavigation,
  useTranslate,
} from "@refinedev/core";
import {
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
} from "antd";
import InputMask from "react-input-mask";
import _debounce from "lodash/debounce";
import type { ICategory } from "../../../interfaces";
import {
  EditOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  RightCircleOutlined,
} from "@ant-design/icons";
import { FormItemEditable, FormItemHorizontal } from "../../form";
import { CategoryStatus } from "../status";

type Props = {
  formProps: UseFormReturnType<ICategory>["formProps"];
  saveButtonProps: UseFormReturnType<ICategory>["saveButtonProps"];
  action: UseFormProps["action"];
  isFormDisabled: boolean;
  setIsFormDisabled: (value: boolean) => void;
  handleAddressChange: (address: string) => void;
};

export const CategoryFormFields = ({
  formProps,
  saveButtonProps,
  action,
  isFormDisabled,
  setIsFormDisabled,
  handleAddressChange,
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

  return (
    <Form {...formProps} layout="horizontal" disabled={isFormDisabled}>
      <FormItemEditable
        formItemProps={{
          name: "title",
          style: {
            marginBottom: "32px",
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
          placeholder={t("categories.fields.title")}
        />
      </FormItemEditable>
      <Card
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
          label={t("categories.fields.isActive.label")}
        >
          {isFormDisabled ? (
            <CategoryStatus value={statusField} />
          ) : (
            <Segmented
              options={[
                {
                  label: t("categories.fields.isActive.true"),
                  value: true,
                },
                {
                  label: t("categories.fields.isActive.false"),
                  value: false,
                },
              ]}
            />
          )}
        </FormItemHorizontal>
      </Card>
      <Flex
        align="center"
        justify="space-between"
        style={{
          padding: "16px 16px 0px 16px",
        }}
      >
        {action === "create" && (
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
                  list("categories");
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
