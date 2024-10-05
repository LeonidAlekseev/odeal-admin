import { type UseFormReturnType, getValueFromEvent } from "@refinedev/antd";
import { Avatar, Flex, Form, Upload } from "antd";
import { useApiUrl } from "@refinedev/core";
import type { IProduct } from "@/interfaces";
import { useStyles } from "./styled";
import { CloudUploadOutlined } from "@ant-design/icons";
import { AUTH_TOKEN_KEY, MEDIA_API_URL } from "@/utils/constants";

type Props = {
  formProps: UseFormReturnType<IProduct>["formProps"];
  showUploadOverlay?: boolean;
  containerStyle?: React.CSSProperties;
  disabled?: boolean;
};

export const ProductFormItemAvatar = ({
  formProps,
  containerStyle,
  showUploadOverlay = true,
  disabled,
}: Props) => {
  const apiUrl = useApiUrl();
  const { styles } = useStyles();

  const image = formProps.initialValues?.image;
  const previewImageURL = image ? `${MEDIA_API_URL}${image?.url}` : null;

  return (
    <Form.Item
      name="image"
      valuePropName="file"
      getValueFromEvent={getValueFromEvent}
      className={styles.formItem}
      style={{
        margin: 0,
        ...containerStyle,
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
          Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`,
        }}
        accept=".png,.jpg,.jpeg"
        maxCount={1}
        showUploadList={false}
        className={styles.upload}
      >
        <Flex
          vertical
          align="center"
          justify="center"
          className={styles.container}
        >
          <Avatar
            shape="circle"
            className={styles.avatar}
            src={previewImageURL || "/images/product-default-img.png"}
          />
          {showUploadOverlay && !disabled && (
            <div className={styles.overlay}>
              {/* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */}
              <CloudUploadOutlined className={styles.overlayIcon} />
            </div>
          )}
        </Flex>
      </Upload.Dragger>
    </Form.Item>
  );
};
