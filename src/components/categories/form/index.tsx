import { Col, Row, Spin } from "antd";
import { useCategoryForm } from "./useCategoryForm";
import { CategoryFormFields } from "./fields";
import type { UseFormProps } from "@refinedev/antd";
import { CategoryProductTable } from "../product-table";

type Props = {
  action: UseFormProps["action"];
};

export const CategoryForm = (props: Props) => {
  const {
    category,
    formProps,
    saveButtonProps,
    formLoading,
    isFormDisabled,
    setIsFormDisabled,
  } = useCategoryForm({
    action: props.action,
  });

  return (
    <Spin spinning={formLoading}>
      <Row gutter={16} wrap>
        <Col xs={24} md={12} lg={9}>
          <CategoryFormFields
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
        >
          {props.action === "edit" && (
            <CategoryProductTable category={category} />
          )}
        </Col>
      </Row>
    </Spin>
  );
};
