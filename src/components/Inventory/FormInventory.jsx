import { Form, Input, InputNumber, Modal, Select } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getZones } from "../../controllers/fetchDynamics";
import { saveInventory, updateInventory } from "../../controllers/inventory";
import { getProducts, getProductsId } from "../../controllers/products";
import { addRow, updateRow } from "../utils/rows";
const { Option } = Select;

export const FormInventory = ({
  open,
  setOpen,
  setRow,
  row,
  invent,
  setInvent,
  token,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [zones, setZones] = useState([]);
  const [products, setProducts] = useState([]);

  if (row) {
    form.setFieldsValue(row);
  } else {
    form.resetFields();
  }

  useEffect(() => {
    dispatch(getZones("", token)).then((pr) => {
      setZones(pr);
    });
    dispatch(getProducts("", token)).then((pr) => {
      setProducts(pr);
    });
  }, []);

  const onCreate = (values) => {
    console.log(values);
    if (!row) {
      dispatch(saveInventory(values, token)).then((res) => {
        setInvent(addRow(invent, res[0]));
        setOpen(false);
        form.resetFields();
      });
    } else {
      dispatch(updateInventory(values, row.id, token)).then((res) => {
        console.log(res);
        setInvent(updateRow(invent, res, row.id));
        setOpen(false);
        form.resetFields();
      });
    }
  };

  const onChange = (values) => {
    console.log(values);
    dispatch(getProductsId(values, token)).then((pr) => {
      form.setFieldsValue({
        codigo_producto: pr[0].codigo,
        precio_unidad: pr[0].precio,
      });
    });
  };

  const onCalValTotal = (val) => {
    const precio_unidad = form.getFieldValue("precio_unidad");
    const cantidad = form.getFieldValue("cantidad");
    const val_total = cantidad * precio_unidad;
    form.setFieldsValue({ precio_total: val_total });
  };

  return (
    <Modal
      open={open}
      title="Agregar producto por zona"
      okText="Crear"
      cancelText="Cancelar"
      width="800px"
      onCancel={() => {
        setOpen(false);
        form.resetFields();
        setRow(false);
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
          name="id_zona"
          label="Zona"
          rules={[
            {
              required: true,
              message: "Por favor ingrese un valor!",
            },
          ]}
        >
          <Select>
            {zones.map(({ id, nombre }) => (
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
          name="id_producto"
          label="Producto"
          rules={[
            {
              required: true,
              message: "Por favor ingrese un valor!",
            },
          ]}
        >
          <Select onChange={onChange}>
            {products.map(({ id, nombre }) => (
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
          name="codigo_producto"
          label="Código"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          style={{
            display: "inline-block",
            width: "calc(30% - 8px)",
            margin: "4px 4px",
          }}
          name="precio_unidad"
          label="Valor unitario"
        >
          <InputNumber
            disabled
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
          name="cantidad"
          label="Cantidad"
        >
          <InputNumber
            onBlur={onCalValTotal}
            onKeyPress={onCalValTotal}
            min={1}
            max={1000000}
          />
        </Form.Item>
        <Form.Item
          style={{
            display: "inline-block",
            width: "calc(30% - 8px)",
            margin: "4px 4px",
          }}
          name="precio_total"
          label="Valor total"
        >
          <InputNumber
            disabled
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
