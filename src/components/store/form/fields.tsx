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
import type { IStore } from "@/interfaces";
import {
  EditOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  RightCircleOutlined,
} from "@ant-design/icons";
import { FormItemEditable, FormItemHorizontal } from "../../form";
import { StoreStatus } from "../status";

type Props = {
  formProps: UseFormReturnType<IStore>["formProps"];
  saveButtonProps: UseFormReturnType<IStore>["saveButtonProps"];
  action: UseFormProps["action"];
  isFormDisabled: boolean;
  setIsFormDisabled: (value: boolean) => void;
};

export const StoreFormFields = ({
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
          placeholder={t("stores.fields.title")}
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
          label={t("stores.fields.isActive.label")}
        >
          {isFormDisabled ? (
            <StoreStatus value={statusField} />
          ) : (
            <Segmented
              options={[
                {
                  label: t("stores.fields.isActive.true"),
                  value: true,
                },
                {
                  label: t("stores.fields.isActive.false"),
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
          icon={<MailOutlined />}
          label={t("stores.fields.email")}
          name="email"
          rules={[
            {
              required: true,
              type: "email",
            },
          ]}
        >
          <Input />
        </FormItemHorizontal>
        <Divider
          style={{
            margin: 0,
          }}
        />
        <FormItemHorizontal
          name="gsm"
          // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
          icon={<PhoneOutlined />}
          label={t("stores.fields.gsm")}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputMask mask="(999) 999 99 99">
            {/* 
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore */}
            {(props: InputProps) => <Input {...props} />}
          </InputMask>
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
                  list("stores");
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
