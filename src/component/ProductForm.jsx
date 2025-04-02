import React, { useEffect } from "react";
import { Form, Input, InputNumber, Select, Switch } from "antd";
const { Option } = Select;

const ProductForm = ({ mode, product, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (mode !== "add" && product) {
      form.setFieldsValue(product);
    } else {
      form.resetFields();
    }
  }, [mode, product, form]);

  const handleSubmit = (values) => {
    console.log(values);

    onSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{ isAvailable: true }}
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Please input the product title!" }]}
      >
        <Input disabled={mode === "view"} />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input.TextArea disabled={mode === "view"} />
      </Form.Item>

      <Form.Item
        label="Category"
        name="category"
        rules={[{ required: true, message: "Please select a category!" }]}
      >
        <Select disabled={mode === "view"}>
          <Option value="fashion">Fashion</Option>
          <Option value="electronics">Electronics</Option>
          <Option value="home">Home</Option>
          <Option value="sports">Sports</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Price"
        name="price"
        rules={[{ required: true, message: "Please input the product price!" }]}
      >
        <InputNumber
          min={0}
          prefix="$"
          style={{ width: "100%" }}
          disabled={mode === "view"}
        />
      </Form.Item>

      <Form.Item
        label="Rating"
        name="rating"
        rules={[
          { required: true, message: "Please input the product rating!" },
        ]}
      >
        <InputNumber
          min={0}
          max={5}
          step={0.1}
          style={{ width: "100%" }}
          disabled={mode === "view"}
        />
      </Form.Item>

      <Form.Item
        label="Stock"
        name="stock"
        rules={[
          { required: true, message: "Please input the stock quantity!" },
        ]}
      >
        <InputNumber
          min={0}
          style={{ width: "100%" }}
          disabled={mode === "view"}
        />
      </Form.Item>

      <Form.Item
        label="Brand"
        name="brand"
        rules={[{ required: true, message: "Please input the product brand!" }]}
      >
        <Input disabled={mode === "view"} />
      </Form.Item>

      <Form.Item
        label="Availability"
        name="isAvailable"
        valuePropName="checked"
      >
        <Switch disabled={mode === "view"} />
      </Form.Item>

      {mode !== "view" && (
        <Form.Item>
          <button type="submit" className="button cursor-pointer">
            {mode === "add" ? "Add Product" : "Save Changes"}
          </button>
        </Form.Item>
      )}
    </Form>
  );
};

export default ProductForm;
