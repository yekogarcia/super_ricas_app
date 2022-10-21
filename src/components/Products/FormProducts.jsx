import { Form, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
const { Option } = Select;

export const FormProducts = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [categorie, setCategorie] = useState([]);

  // useEffect(() => {
  //   fetch(`${process.env.REACT_APP_API_URL}/category`)
  //     .then((response) => {
  //       console.log(response);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  const onCreate = (values) => {
    console.log(values);
  };

  return (
    <Modal
      open={open}
      title="Nuevo producto"
      okText="Crear"
      cancelText="Cancelar"
      width="800px"
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
          name="categoria"
          label="Categoria"
          rules={[
            {
              required: true,
              message: "Por favor ingrese un valor!",
            },
          ]}
        >
          <Select>
            <Option value="ACTIVO">ACTIVO</Option>
            <Option value="INACTIVO">INACTIVO</Option>
          </Select>
        </Form.Item>
        <Form.Item
          style={{
            display: "inline-block",
            width: "calc(30% - 8px)",
            margin: "4px 4px",
          }}
          name="codigo_barras"
          label="Código de barras"
        >
          <Input />
        </Form.Item>
        <Form.Item
          style={{
            display: "inline-block",
            width: "calc(30% - 8px)",
            margin: "4px 4px",
          }}
          name="precio"
          label="Precio"
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
          name="porcen_comision"
          label="% Comisión"
        >
          <Input />
        </Form.Item>
        <Form.Item
          style={{
            display: "inline-block",
            width: "calc(30% - 8px)",
            margin: "4px 4px",
          }}
          name="iva"
          label="IVA"
        >
          <Input />
        </Form.Item>
        <Form.Item
          style={{
            display: "inline-block",
            width: "calc(30% - 8px)",
            margin: "4px 4px",
          }}
          name="factor"
          label="Factor"
        >
          <Input />
        </Form.Item>
        <Form.Item
          style={{
            display: "inline-block",
            width: "calc(30% - 8px)",
            margin: "4px 4px",
          }}
          name="unidad_medida"
          label="Unidad de medida"
        >
          <Input />
        </Form.Item>
        <Form.Item
          style={{
            display: "inline-block",
            width: "calc(30% - 8px)",
            margin: "4px 4px",
          }}
          name="estado"
          label="Estado"
        >
          <Select defaultValue="ACTIVO">
            <Option value="ACTIVO">ACTIVO</Option>
            <Option value="INACTIVO">INACTIVO</Option>
          </Select>
        </Form.Item>
        <Form.Item name="descripcion" label="Descripción">
          <Input type="textarea" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
