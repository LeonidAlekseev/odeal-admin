"use client";

import { useEffect, useState } from "react";
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
  Card,
  Flex,
  Button,
  Space,
  Typography,
  theme,
} from "antd";
import _debounce from "lodash/debounce";
import {
  EditOutlined,
  FunctionOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { type Context, evaluateMetadata } from "@/utils/eval-metadata";
import type { IMetadata, IProduct } from "@/interfaces";
import { useStyles } from "./styled";

type Props = {
  product?: IProduct;
  formProps: UseFormReturnType<IProduct>["formProps"];
  saveButtonProps: UseFormReturnType<IProduct>["saveButtonProps"];
  action: UseFormProps["action"];
  isFormDisabled: boolean;
  setIsFormDisabled: (value: boolean) => void;
};

export const MetaProductForm = ({
  product,
  formProps,
  saveButtonProps,
  action,
  isFormDisabled,
  setIsFormDisabled,
}: Props) => {
  const t = useTranslate();
  const { styles } = useStyles();
  const { list } = useNavigation();
  const { token } = theme.useToken();

  const initialMetadata = [
    { key: "$productCost", formula: "0", value: "0" },
    {
      key: "$contractCost",
      formula: "0",
      value: "0",
    },
  ];
  const initialValues: { metadata: IMetadata[] } = {
    metadata: formProps.initialValues?.metadata || initialMetadata,
  };

  const metadata = Form.useWatch("metadata", formProps.form);
  const [evaluated, setEvaluated] = useState<Context>({});
  useEffect(() => {
    if (!metadata) return;
    setEvaluated(evaluateMetadata(metadata));
  }, [metadata]);

  return (
    <Form
      {...formProps}
      initialValues={initialValues}
      name="meta"
      layout="horizontal"
      disabled={isFormDisabled}
      autoComplete="off"
    >
      <Card
        style={{
          marginTop: "16px",
          padding: "16px 16px 0px 16px",
        }}
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <Flex
          gap={8}
          style={{
            minWidth: "120px",
            marginBottom: "16px",
          }}
        >
          <span
            style={{
              color: token.colorPrimary,
            }}
          >
            {/* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */}
            <FunctionOutlined />
          </span>
          <Typography.Text>
            {t("products.fields.metadata.label")}
          </Typography.Text>
        </Flex>
        <Space
          style={{
            display: "grid",
            width: "100%",
            marginBottom: "12px",
            gap: "12px",
            gridTemplateColumns: "1fr 1fr 1fr auto",
          }}
          align="baseline"
        >
          <Typography.Text>{t("products.fields.metadata.key")}</Typography.Text>
          <Typography.Text>
            {t("products.fields.metadata.formula")}
          </Typography.Text>
          <Typography.Text>
            {t("products.fields.metadata.value")}
          </Typography.Text>
          <div style={{ paddingRight: "14px" }}></div>
        </Space>
        <Form.List name="metadata">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{
                    display: "grid",
                    width: "100%",
                    marginBottom: "12px",
                    gap: "12px",
                    gridTemplateColumns: "1fr 1fr 1fr auto",
                  }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "key"]}
                    rules={[{ required: true }]}
                    style={{ marginBottom: "0" }}
                    className={styles.formItem}
                    initialValue={"$key"}
                  >
                    <Input placeholder="Ключ" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "formula"]}
                    dependencies={[name, "key"]}
                    rules={[{ required: true }]}
                    style={{ marginBottom: "0" }}
                    className={styles.formItem}
                    initialValue={0}
                  >
                    <Input placeholder="Формула" />
                  </Form.Item>
                  <Form.Item
                    rules={[{ required: false }]}
                    style={{ marginBottom: "0" }}
                    className={styles.formItem}
                    initialValue={"0"}
                    shouldUpdate
                  >
                    <Typography.Text>
                      {metadata &&
                      name !== undefined &&
                      metadata[name] !== undefined
                        ? evaluated[metadata[name].key.replace(/^\$/, "")]
                        : ""}
                    </Typography.Text>
                  </Form.Item>
                  {/* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */}
                  <MinusCircleOutlined
                    onClick={() => remove(name)}
                    style={{
                      opacity: isFormDisabled ? 0 : 1,
                      pointerEvents: isFormDisabled ? "none" : "auto",
                    }}
                  />
                </Space>
              ))}
              <Form.Item>
                <Button
                  icon={
                    /* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */
                    <PlusOutlined />
                  }
                  type="dashed"
                  onClick={() => add()}
                  block
                >
                  {t("products.fields.metadata.addMetaField")}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
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
