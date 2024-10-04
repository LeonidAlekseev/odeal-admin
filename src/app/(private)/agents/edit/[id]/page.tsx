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

import type { ICourier } from "@/interfaces";
import {
  AgentWhiteIcon,
  CourierFormItemAvatar,
  CourierStatus,
  FormItemEditable,
  FormItemHorizontal,
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

const CourierEdit = () => {
  const titleInputRef = useRef<InputRef>(null);

  const [isFormDisabled, setIsFormDisabled] = useState(true);

  const t = useTranslate();
  const { list } = useNavigation();
  const {
    formProps,
    query: queryResult,
    saveButtonProps,
  } = useForm<ICourier>({
    meta: {
      populate: {
        user: {
          populate: ["avatar", "gsm", "email"],
        },
        store: {
          populate: ["id"],
        },
        status: {
          populate: ["text"],
        },
      },
    },
  });
  const courier = queryResult?.data?.data;

  const { selectProps: storeSelectProps } = useSelect({
    resource: "stores",
    defaultValue: courier?.store?.id,
    queryOptions: {
      enabled: !!courier,
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
          {t("couriers.couriers")}
        </ListButton>
      </Flex>
      <Divider />

      <Row gutter={16}>
        <Col span={16}>
          <Form {...formProps} layout="horizontal" disabled={isFormDisabled}>
            <Flex align="center" gap={24}>
              <CourierFormItemAvatar formProps={formProps} disabled={true} />
              <FormItemEditable
                formItemProps={{
                  name: ["user", "fullName"],
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
                  placeholder={t("couriers.fields.name.placeholder")}
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
                isInput={false}
                // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                icon={<RightCircleOutlined />}
                label={t("couriers.fields.status.label")}
                flexProps={{
                  style: { padding: "24px 16px 24px 16px" },
                }}
              >
                <CourierStatus
                  isLoading={queryResult?.isLoading}
                  value={courier?.status?.text}
                />
              </FormItemHorizontal>
              <Divider
                style={{
                  margin: "0",
                }}
              />
              <FormItemHorizontal
                name={["user", "gsm"]}
                // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                icon={<PhoneOutlined />}
                label={t("couriers.fields.gsm.label")}
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
              <Divider
                style={{
                  margin: "0",
                }}
              />
              <FormItemHorizontal
                // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                icon={<MailOutlined />}
                label={t("couriers.fields.email.label")}
                name={["user", "email"]}
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
                  margin: "0",
                }}
              />
              <FormItemHorizontal
                // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                icon={<ShopOutlined />}
                label={t("couriers.fields.store.label")}
                name={["store", "id"]}
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
                label={t("couriers.fields.licensePlate.label")}
                name="licensePlate"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
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
                      list("couriers");
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

export default CourierEdit;
