import { Form, Input } from "antd";

export const Profile = () => {
  const [form] = Form.useForm();

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: "public",
        }}
      >
        <Form.Item
          style={{
            display: "inline-block",
            width: "calc(30% - 8px)",
            margin: "4px 4px",
          }}
          name="nombre"
          label="Nombre"
          rules={[
            {
              required: true,
              message: "Por favor ingrese un valor!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          style={{
            display: "inline-block",
            width: "calc(30% - 8px)",
            margin: "4px 4px",
          }}
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: "Por favor ingrese un valor!",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </>
  );
};
