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
import type { IOrderMetadata, IOrder } from "@/interfaces";
import { useStyles } from "./styled";

type Props = {
  order?: IOrder;
  formProps: UseFormReturnType<IOrder>["formProps"];
  saveButtonProps: UseFormReturnType<IOrder>["saveButtonProps"];
  action: UseFormProps["action"];
  isFormDisabled: boolean;
  setIsFormDisabled: (value: boolean) => void;
};

export const MetaOrderForm = ({
  order,
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
  const initialValues: IOrderMetadata = {
    product: {
      metadata: formProps.initialValues?.product?.metadata || initialMetadata,
    },
  };

  const product = Form.useWatch("product", formProps.form);
  const [evaluated, setEvaluated] = useState<Context>({});
  useEffect(() => {
    if (!product || !product.metadata) return;
    setEvaluated(evaluateMetadata(product.metadata));
  }, [product]);

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
        <Form.List name={["product", "metadata"]}>
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
                      {product &&
                      product.metadata &&
                      name !== undefined &&
                      product.metadata[name] !== undefined
                        ? evaluated[
                            product.metadata[name].key.replace(/^\$/, "")
                          ]
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
              {action !== "clone" && (
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
              )}
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
