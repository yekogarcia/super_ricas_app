import { Form, Input, InputNumber, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCategories } from "../../controllers/fetchDynamics";
import { saveProducts, updateProducts } from "../../controllers/products";
import { addRow, updateRow } from "../utils/rows";
import { Products } from "./Products";
const { Option } = Select;

export const FormProducts = ({ open, setOpen, row, products, setProducts }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);

  // form.setFieldsValue([]);

  useEffect(() => {
    dispatch(getCategories()).then((res) => {
      console.log(res);
      setCategories(res);
    });
  }, [dispatch]);

  if (row) {
    form.setFieldsValue(row);
  } else {
    form.resetFields();
  }

  const onCreate = (values) => {
    console.log(values);
    if (!row) {
      dispatch(saveProducts(values)).then((pr) => {
        pr[0].key = pr[0].id;
        setProducts(addRow(products, pr[0]));
        form.resetFields();
        setOpen(false);
      });
    } else {
      dispatch(updateProducts(values, row.id)).then((pr) => {
        setProducts(updateRow(products, pr, row.id));
        form.resetFields();
        setOpen(false);
      });
    }
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
        form.resetFields();
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
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
          rules={[
            {
              required: true,
              message: "Por favor seleccione un item!",
            },
          ]}
          name="codigo"
          label="Código"
        >
          <Input />
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
          <InputNumber
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>
        <Form.Item
          style={{
            display: "inline-block",
            width: "calc(30% - 8px)",
            margin: "4px 4px",
          }}
          rules={[
            {
              required: true,
              message: "Por favor ingrese un valor!",
            },
          ]}
          name="porcen_comision"
          label="% Comisión"
        >
          <InputNumber
            min={0}
            max={100}
            formatter={(value) => `${value}%`}
            parser={(value) => value.replace("%", "")}
          />
        </Form.Item>
        <Form.Item
          style={{
            display: "inline-block",
            width: "calc(30% - 8px)",
            margin: "4px 4px",
          }}
          rules={[
            {
              required: true,
              message: "Por favor ingrese un valor!",
            },
          ]}
          name="iva"
          label="IVA %"
        >
          <InputNumber min={1} max={100} />
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
          <InputNumber min={1} max={100} />
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
          name="id_categoria"
          label="Categoria"
          rules={[
            {
              required: true,
              message: "Por favor ingrese un valor!",
            },
          ]}
        >
          <Select>
            {categories.map(({ id, nombre }) => (
              <Option value={id} key={id}>
                {nombre}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          style={{
            display: "inline-block",
            width: "calc(30% - 8px)",
            margin: "4px 4px",
          }}
          name="estado"
          label="Estado"
          rules={[
            {
              required: true,
              message: "Por favor seleccione un item!",
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
            width: "calc(60% - 8px)",
            margin: "4px 4px",
          }}
          name="descripcion"
          label="Descripción"
        >
          <Input type="textarea" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
