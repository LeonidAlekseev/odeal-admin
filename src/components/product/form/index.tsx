import { Col, Row, Spin } from "antd";
import { useProductForm } from "./useProductForm";
import { ProductFormFields } from "./fields";
import type { UseFormProps } from "@refinedev/antd";

type Props = {
  action: UseFormProps["action"];
};

export const ProductForm = (props: Props) => {
  const {
    product,
    formProps,
    saveButtonProps,
    formLoading,
    isFormDisabled,
    setIsFormDisabled,
  } = useProductForm({
    action: props.action,
  });

  return (
    <Spin spinning={formLoading}>
      <Row gutter={16} wrap>
        <Col xs={24} md={12} lg={9}>
          <ProductFormFields
            product={product}
            formProps={formProps}
            saveButtonProps={saveButtonProps}
            action={props.action}
            isFormDisabled={isFormDisabled}
            setIsFormDisabled={setIsFormDisabled}
          />
        </Col>
        <Col
          xs={24}
          md={12}
          lg={15}
          style={{
            height: props.action === "create" ? "calc(100vh - 300px)" : "432px",
            marginTop: "72px",
          }}
        ></Col>
      </Row>
    </Spin>
  );
};
