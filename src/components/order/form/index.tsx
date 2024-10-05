import { Col, Row, Spin } from "antd";
import { useOrderForm, useOrderMetaForm } from "./useOrderForm";
import { OrderFormFields } from "./fields";
import type { UseFormProps } from "@refinedev/antd";
import { MetaOrderForm } from "../meta-order";

type Props = {
  action: UseFormProps["action"];
};

export const OrderForm = (props: Props) => {
  const {
    order,
    formProps,
    saveButtonProps,
    formLoading,
    isFormDisabled,
    setIsFormDisabled,
  } = useOrderForm({
    action: props.action,
  });

  const metaProps = useOrderMetaForm({
    action: props.action,
  });

  return (
    <Spin spinning={formLoading}>
      <Row gutter={16} wrap>
        <Col xs={24} md={12} lg={9}>
          <OrderFormFields
            order={order}
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
            marginTop: "40px",
          }}
        >
          <MetaOrderForm
            order={metaProps.order}
            formProps={metaProps.formProps}
            saveButtonProps={metaProps.saveButtonProps}
            action={props.action}
            isFormDisabled={metaProps.isFormDisabled}
            setIsFormDisabled={metaProps.setIsFormDisabled}
          />
        </Col>
      </Row>
    </Spin>
  );
};
