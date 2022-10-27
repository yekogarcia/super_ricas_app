import { Form, Input, Modal } from "antd";
const { TextArea } = Input;

export const Forms = (props) => {
  const [form] = Form.useForm();
  const { open, setOpen, onCreate, title, width, inputs, row } = props;

  // console.log(props);

  if (row) {
    form.setFieldsValue(row);
  } else {
    form.resetFields();
  }

  return (
    <Modal
      open={open}
      title={title}
      okText="Crear"
      cancelText="Cancelar"
      width={width}
      onCancel={() => {
        setOpen(false);
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: "public",
        }}
      >
        {inputs.map(({ label, name, required, type, width }) => {
          return (
            <Form.Item
              style={{
                display: "inline-block",
                width: `calc(${width} - 8px)`,
                margin: "4px 4px",
              }}
              key={name}
              name={name}
              label={label}
              rules={[
                {
                  required: required,
                  message: "Por favor ingrese un valor!",
                },
              ]}
            >
              {type === "textArea" ? <TextArea /> : <Input />}
            </Form.Item>
          );
        })}
      </Form>
    </Modal>
  );
};
