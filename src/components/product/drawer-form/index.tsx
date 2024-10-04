import { SaveButton, useDrawerForm } from "@refinedev/antd";
import {
  type BaseKey,
  useApiUrl,
  useBack,
  useTranslate,
} from "@refinedev/core";
import { getValueFromEvent, useSelect } from "@refinedev/antd";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Grid,
  Button,
  Flex,
  Avatar,
  Segmented,
  Spin,
} from "antd";
import type { IProduct, ICategory } from "../../../interfaces";
import { Drawer } from "../../drawer";
import { UploadOutlined } from "@ant-design/icons";
import { useStyles } from "./styled";
import { AUTH_TOKEN_KEY, MEDIA_API_URL } from "@/utils/constants";

type Props = {
  id?: BaseKey;
  action: "create" | "edit";
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const ProductDrawerForm = (props: Props) => {
  const back = useBack();
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const breakpoint = Grid.useBreakpoint();
  const { styles, theme } = useStyles();

  const { drawerProps, formProps, close, saveButtonProps, formLoading } =
    useDrawerForm<IProduct>({
      resource: "products",
      id: props?.id, // when undefined, id will be read from the URL.
      action: props.action,
      redirect: false,
      onMutationSuccess: () => {
        props.onMutationSuccess?.();
      },
      meta: {
        populate: ["category", "image"],
      },
    });

  const { selectProps: categorySelectProps } = useSelect<ICategory>({
    resource: "categories",
  });

  const onDrawerCLose = () => {
    close();

    if (props?.onClose) {
      props.onClose();
      return;
    }

    back();
  };

  const image = Form.useWatch("image", formProps.form);
  const previewImageURL = `${MEDIA_API_URL}${image?.thumbnail.url || image?.url}`;
  const title = props.action === "edit" ? null : t("products.actions.add");

  return (
    <Drawer
      {...drawerProps}
      open={true}
      title={title}
      width={breakpoint.sm ? "378px" : "100%"}
      zIndex={1001}
      onClose={onDrawerCLose}
    >
      <Spin spinning={formLoading}>
        <Form {...formProps} layout="vertical">
          <Form.Item
            name="image"
            valuePropName="file"
            getValueFromEvent={getValueFromEvent}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Upload.Dragger
              name="file"
              action={`${apiUrl}/upload`}
              headers={{
                AccessControlAllowHeaders:
                  "Origin, X-Requested-With, Content-Type, Accept",
                Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`,
              }}
              accept=".png,.jpg,.jpeg"
              maxCount={1}
              showUploadList={false}
              className={styles.uploadDragger}
            >
              <Flex
                vertical
                align="center"
                justify="center"
                style={{
                  position: "relative",
                  height: "100%",
                }}
              >
                <Avatar
                  shape="square"
                  style={{
                    aspectRatio: 1,
                    objectFit: "contain",
                    width: previewImageURL ? "100%" : "48px",
                    height: previewImageURL ? "100%" : "48px",
                    marginTop: previewImageURL ? undefined : "auto",
                    transform: previewImageURL ? undefined : "translateY(50%)",
                  }}
                  src={previewImageURL || "/images/product-default-img.png"}
                  alt="Product Image"
                />
                <Button
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  icon={<UploadOutlined />}
                  style={{
                    marginTop: "auto",
                    marginBottom: "16px",
                    backgroundColor: theme.colorBgContainer,
                    ...(!!previewImageURL && {
                      position: "absolute",
                      bottom: 0,
                    }),
                  }}
                >
                  {t("products.fields.image.description")}
                </Button>
              </Flex>
            </Upload.Dragger>
          </Form.Item>
          <Flex vertical>
            <Form.Item
              label={t("products.fields.name")}
              name="name"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={t("products.fields.description")}
              name="description"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.TextArea rows={6} />
            </Form.Item>
            <Form.Item
              label={t("products.fields.price")}
              name="price"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber prefix={"$"} style={{ width: "150px" }} />
            </Form.Item>
            <Form.Item
              label={t("products.fields.category")}
              name={["category", "id"]}
              className={styles.formItem}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select {...categorySelectProps} />
            </Form.Item>
            <Form.Item
              label={t("products.fields.isActive.label")}
              name="isActive"
              className={styles.formItem}
              initialValue={true}
            >
              <Segmented
                block
                size="large"
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
            </Form.Item>
            <Flex
              align="center"
              justify="space-between"
              style={{
                padding: "16px 16px 0px 16px",
              }}
            >
              <Button onClick={onDrawerCLose}>Cancel</Button>
              <SaveButton
                {...saveButtonProps}
                htmlType="submit"
                type="primary"
                icon={null}
              >
                {t("buttons.save")}
              </SaveButton>
            </Flex>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};
