import {
  type BaseKey,
  type HttpError,
  useBack,
  useGo,
  useNavigation,
  useOne,
  useShow,
  useTranslate,
} from "@refinedev/core";
import {
  Avatar,
  Button,
  Divider,
  Flex,
  Grid,
  List,
  Typography,
  theme,
} from "antd";
import { Drawer } from "../../drawer";
import type { ICategory, IProduct } from "@/interfaces";
import { DeleteButton, NumberField } from "@refinedev/antd";
import { ProductStatus } from "../status";
import { EditOutlined } from "@ant-design/icons";
import { MEDIA_API_URL } from "@/utils/constants";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
  onEdit?: () => void;
};

export const ProductDrawerShow = (props: Props) => {
  const go = useGo();
  const back = useBack();
  const { editUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const { query: queryResult } = useShow<IProduct, HttpError>({
    resource: "products",
    id: props?.id, // when undefined, id will be read from the URL.
    meta: {
      populate: ["image"],
    },
  });
  const product = queryResult.data?.data;

  const { data: categoryData } = useOne<ICategory, HttpError>({
    resource: "categories",
    id: product?.category?.id,
    queryOptions: {
      enabled: !!product?.category?.id,
    },
  });
  const category = categoryData?.data;

  const handleDrawerClose = () => {
    if (props?.onClose) {
      props.onClose();
      return;
    }

    back();
  };

  return (
    <Drawer
      open={true}
      width={breakpoint.sm ? "378px" : "100%"}
      zIndex={1001}
      onClose={handleDrawerClose}
    >
      <Flex vertical align="center" justify="center">
        <Avatar
          shape="square"
          style={{
            aspectRatio: 1,
            objectFit: "contain",
            width: "240px",
            height: "240px",
            margin: "16px auto",
            borderRadius: "8px",
          }}
          src={`${MEDIA_API_URL}${product?.image?.url}`}
          alt={product?.image?.name}
        />
      </Flex>
      <Flex
        vertical
        style={{
          backgroundColor: token.colorBgContainer,
        }}
      >
        <Flex
          vertical
          style={{
            padding: "16px",
          }}
        >
          <Typography.Title level={5}>{product?.name}</Typography.Title>
          <Typography.Text type="secondary">
            {product?.description}
          </Typography.Text>
        </Flex>
        <Divider
          style={{
            margin: 0,
            padding: 0,
          }}
        />
        <List
          dataSource={[
            {
              label: (
                <Typography.Text type="secondary">
                  {t("products.fields.price")}
                </Typography.Text>
              ),
              value: (
                <NumberField
                  value={product?.price || 0}
                  options={{
                    style: "currency",
                    currency: "RUB",
                  }}
                />
              ),
            },
            {
              label: (
                <Typography.Text type="secondary">
                  {t("products.fields.category")}
                </Typography.Text>
              ),
              value: <Typography.Text>{category?.title}</Typography.Text>,
            },
            {
              label: (
                <Typography.Text type="secondary">
                  {t("products.fields.isActive.label")}
                </Typography.Text>
              ),
              value: <ProductStatus value={!!product?.isActive} />,
            },
          ]}
          renderItem={(item) => {
            return (
              <List.Item>
                <List.Item.Meta
                  style={{
                    padding: "0 16px",
                  }}
                  avatar={item.label}
                  title={item.value}
                />
              </List.Item>
            );
          }}
        />
      </Flex>
      <Flex
        align="center"
        justify="space-between"
        style={{
          padding: "16px 16px 16px 0",
        }}
      >
        <DeleteButton
          type="text"
          recordItemId={product?.id}
          resource="products"
          onSuccess={() => {
            handleDrawerClose();
          }}
        />
        <Button
          // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
          icon={<EditOutlined />}
          onClick={() => {
            if (props?.onEdit) {
              return props.onEdit();
            }

            return go({
              to: `${editUrl("products", product?.id || "")}`,
              query: {
                to: "/products",
              },
              options: {
                keepQuery: true,
              },
              type: "push",
            });
          }}
        >
          {t("actions.edit")}
        </Button>
      </Flex>
    </Drawer>
  );
};
