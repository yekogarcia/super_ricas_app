import { DatePicker, Form, InputNumber, message, Modal, Select } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getZones } from "../../controllers/fetchDynamics";
import { addRow, updateRow } from "../utils/rows";
import moment from "moment";
import { getProductsConcat, getProductsId, saveReturns, updateReturns } from "../../controllers/products";
const { Option } = Select;

export const FormReturns = ({
  open,
  setOpen,
  setRow,
  row,
  token,
  onSearch,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [zones, setZones] = useState([]);
  const [products, setProducts] = useState([]);
  const [fecha, setFecha] = useState(moment().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (row) {
      setLoading(true);
      row.fecha = moment(row.fecha, "YYYY-MM-DD");
      setFecha(row.fecha);
      form.setFieldsValue(row);
    } else {
      setFecha(moment().format("YYYY-MM-DD"));
      // form.resetFields();
    }
  }, [row]);

  useEffect(() => {
    setLoading(true);
    dispatch(getZones("", token)).then((zone) => {
      setZones(zone);
    });
    dispatch(getProductsConcat("", token)).then((produ) => {
      const data = [];
      produ.map(({ id, nombre }) => {
        data.push({ value: id, label: nombre });
      });
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const onCreate = (values) => {
    setLoading(true);
    // dispatch(getProductsId(values.id_producto, token)).then(prod => {
    //   console.log(prod);
    // })
    // values.producto_text = 'prueba';
    // values.zona_text = 'prueba';
    values.fecha = moment(values.fecha["_d"]).format("YYYY-MM-DD");
    console.log(values);
    if (!row) {
      dispatch(saveReturns(values, token)).then((res) => {
        onSearch();
        setOpen(false);
        form.resetFields();
        setLoading(false);
      });
    } else {
      console.log(values);
      values.id = row.id;
      dispatch(updateReturns(values, row.id, token)).then((res) => {
        console.log(res);
        onSearch();
        setOpen(false);
        setRow(false);
        form.resetFields();
        setLoading(false);
      });
    }
  };

  const onChageDate = (value) => {
    // setFecha(moment(value["_d"]).format("YYYY-MM-DD"));
  };
  const onChangeProduct = (value) => {
    console.log(value);
  };

  setTimeout(function () {
    if (!row) {
      form.setFieldValue("fecha", moment(fecha, "YYYY-MM-DD"));
    }
  }, 500);

  return (
    <Modal
      open={open}
      title="Agregar producto por zona para devolución"
      okText="Guardar"
      cancelText="Cancelar"
      width="700px"
      loading={loading}
      maskClosable={false}
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
          })
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
            margin: "0px 4px 16px 4px",
          }}
          name="fecha"
          label="Fecha devolución"
          rules={[
            {
              required: true,
              message: "Por favor ingrese un valor!",
            },
          ]}
        >
          <DatePicker onChange={onChageDate} />
        </Form.Item>
        <Form.Item
          style={{
            display: "inline-block",
            width: "calc(30% - 8px)",
            margin: "0px 4px 16px 4px",
          }}
          name="tipo"
          label="Tipo devolución"
          rules={[
            {
              required: true,
              message: "Por favor ingrese un valor!",
            },
          ]}
        >
          <Select
            className="select_produ"
            // onChange={onChangeProduct}
            // showSearch
            optionFilterProp="children"
            // onSearch={onSearch}
            options={[
              {
                label: "PNC",
                value: "PNC",
                key: "PNC",
              },
              {
                label: "OBSEQUIOS",
                value: "OBSEQUIOS",
                key: "OBSEQUIOS",
              },
              {
                label: "DEVOLUCIÓN",
                value: "DEVOLUCIÓN",
                key: "DEVOLUCIÓN",
              },
            ]}
          />
        </Form.Item>
        <Form.Item
          style={{
            display: "inline-block",
            width: "calc(40% - 8px)",
            margin: "0px 4px 16px 4px",
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
            width: "calc(50% - 8px)",
            margin: "0px 4px 16px 4px",
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
          <Select
            className="select_produ"
            onChange={onChangeProduct}
            showSearch
            optionFilterProp="children"
            onSearch={onSearch}
            filterOption={(input, option) =>
              (option?.label ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            // filterOption={(input, option) =>
            //   (option?.value.toString() ?? 0).includes(input)
            // }
            options={products}
          />
        </Form.Item>
        <Form.Item
          style={{
            display: "inline-block",
            width: "calc(50% - 8px)",
            margin: "0px 4px 16px 4px",
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
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  );
};
