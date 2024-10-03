"use client";

import { useEffect, useRef, useState } from "react";
import { useNavigation, useTranslate } from "@refinedev/core";
import {
  DeleteButton,
  ListButton,
  SaveButton,
  useForm,
  useSelect,
} from "@refinedev/antd";
import {
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  type InputRef,
  Row,
  Select,
} from "antd";
import InputMask from "react-input-mask";

import type { IProduct } from "@/interfaces";
import {
  AgentWhiteIcon,
  CourierFormItemAvatar,
  CourierStatus,
  FormItemEditable,
  FormItemHorizontal,
  ProductFormItemAvatar,
} from "@/components";
import {
  BankOutlined,
  EditOutlined,
  LeftOutlined,
  MailOutlined,
  PhoneOutlined,
  RightCircleOutlined,
  ScanOutlined,
  ShopOutlined,
} from "@ant-design/icons";

const ProductEdit = () => {
  const titleInputRef = useRef<InputRef>(null);

  const [isFormDisabled, setIsFormDisabled] = useState(true);

  const t = useTranslate();
  const { list } = useNavigation();
  const {
    formProps,
    query: queryResult,
    saveButtonProps,
  } = useForm<IProduct>({
    meta: {
      populate: ["category", "images"],
    },
  });
  const product = queryResult?.data?.data;

  const { selectProps: storeSelectProps } = useSelect({
    resource: "categories",
    defaultValue: product?.category?.id,
    queryOptions: {
      enabled: !!product,
    },
  });

  useEffect(() => {
    if (!isFormDisabled) {
      titleInputRef.current?.focus();
    }
  }, [isFormDisabled]);

  return (
    <>
      <Flex>
        {/* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */}
        <ListButton icon={<LeftOutlined />}>
          {t("products.products")}
        </ListButton>
      </Flex>
      <Divider />

      <Row gutter={16}>
        <Col span={16}>
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
                name="description"
                // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                icon={<ShopOutlined />}
                label={t("products.fields.description")}
                rules={[
                  {
                    required: true,
                  },
                ]}
                style={{
                  alignSelf: "flex-start",
                }}
              >
                <Input.TextArea />
              </FormItemHorizontal>
              <Divider
                style={{
                  margin: "0",
                }}
              />
              <FormItemHorizontal
                // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                icon={<ShopOutlined />}
                label={`${t("products.fields.price")} ₽`}
                name="price"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </FormItemHorizontal>
              <Divider
                style={{
                  margin: "0",
                }}
              />
              <FormItemHorizontal
                // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                icon={<ShopOutlined />}
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
                  margin: "0",
                }}
              />
              <FormItemHorizontal
                // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                icon={<ScanOutlined />}
                label={t("products.fields.isActive.label")}
                name="isActive"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  defaultValue={product?.isActive}
                  options={[
                    { value: true, label: t("products.fields.isActive.true") },
                    {
                      value: false,
                      label: t("products.fields.isActive.false"),
                    },
                  ]}
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
              {isFormDisabled ? (
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
                    disabled={isFormDisabled}
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
            </Flex>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default ProductEdit;
