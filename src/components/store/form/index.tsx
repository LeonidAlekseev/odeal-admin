import { Col, Row, Spin } from "antd";
import { useStoreForm } from "./useStoreForm";
import { StoreFormFields } from "./fields";
import type { UseFormProps } from "@refinedev/antd";
import { StoreCourierTable } from "../courier-table";

type Props = {
  action: UseFormProps["action"];
};

export const StoreForm = (props: Props) => {
  const {
    store,
    formProps,
    saveButtonProps,
    formLoading,
    isFormDisabled,
    setIsFormDisabled,
  } = useStoreForm({
    action: props.action,
  });

  return (
    <Spin spinning={formLoading}>
      <Row gutter={16} wrap>
        <Col xs={24} md={12} lg={9}>
          <StoreFormFields
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
            marginTop: "72px",
          }}
        >
          {props.action === "edit" && <StoreCourierTable store={store} />}
        </Col>
      </Row>
    </Spin>
  );
};
