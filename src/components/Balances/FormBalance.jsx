import { Button, DatePicker, Form, InputNumber, message, Modal, Select } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getZones } from "../../controllers/fetchDynamics";
import { addRow, updateRow } from "../utils/rows";
import moment from "moment";
import { getBalanceProducts, getProductFactBalance, getProductsConcat, saveBalance, updateBalance, } from "../../controllers/products";
import { ListForm } from "./ListForm";
import { formatArrayMoney, unformatArrayMoney } from "../utils/utils";
const { Option } = Select;

export const FormBalance = ({
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
  const [datProd, setDatProd] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [fecha, setFecha] = useState(moment().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);

  const { user_login } = useSelector((state) => state.auth);

  let defaultColumns = [
    {
      label: "id",
      name: "id",
      width: "wp-50",
      visible: false
    },
    {
      label: "id_producto",
      name: "producto",
      width: "wp-50",
      visible: false
    },
    {
      label: "Codigo",
      filter: "search",
      width: "wp-90",
      name: "codigo_producto",
    },
    {
      label: "Producto",
      name: "producto_text",
      filter: "search",
      width: "wp-200",
    },
    {
      label: "Cant",
      name: "cantidad",
      width: "wp-50",
      filter: "order",
    },
    {
      label: "Valor",
      width: "wp-100",
      name: "precio_unidad",
      format: "money",
    },
    {
      label: "Subtotal",
      width: "wp-100",
      name: "precio_total",
      format: "money",
    },
    {
      label: "% IVA",
      width: "wp-70",
      name: "iva",
    },
    {
      label: "Valor IVA",
      name: "valor_iva",
      width: "wp-100",
      filter: "order",
      format: "money",
    },
    {
      label: "% Com",
      width: "wp-70",
      name: "porcen_comision",
    },
    {
      label: "comisión",
      name: "valor_comision",
      width: "wp-100",
      filter: "order",
      format: "money",
    },
    {
      label: "Total",
      name: "valor_venta",
      width: "wp-150",
      filter: "order",
      format: "money",
    },
  ];


  useEffect(() => {
    if (row) {
      setLoading(true);
      form.setFieldsValue(row);
      dispatch(getBalanceProducts("", { id: row.id }, token)).then(res => {
        console.log(res);
        setDataSource(formatArrayMoney(res, defaultColumns));
        setLoading(false);
      });
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
    // console.log(dataSource);
    const dataFormat = unformatArrayMoney(dataSource, defaultColumns);
    values.total_iva = 0;
    values.total_comision = 0;
    values.total = 0;
    dataFormat.forEach(dt => {
      values.total_iva += dt.valor_iva;
      values.total_comision += dt.valor_comision;
      values.total += dt.valor_venta;
    });
    values.usuario = user_login;
    values.productos = dataFormat;

    // console.log(dataFormat);
    console.log(values);
    if (!row) {
      dispatch(saveBalance(values, token)).then((res) => {
        onSearch();
        setOpen(false);
        form.resetFields();
        setLoading(false);
        setDataSource([]);
      });
    } else {
      // console.log(values);
      values.id = row.id;
      dispatch(updateBalance(values, row.id, token)).then((res) => {
        // console.log(res);
        onSearch();
        setOpen(false);
        setRow(false);
        setDataSource([]);
        form.resetFields();
        setLoading(false);
      });
    }
  };



  const handlefact = (e) => {
    const cod = form.getFieldValue("cod_factura");
    if (cod !== "") {
      setLoading(true);
      dispatch(getProductFactBalance(cod, token)).then(res => {
        console.log(res)
        setDatProd(res);
        form.setFieldValue("zona", res[0].id_zona);
        const data = [];
        res.map(({ id_producto, producto_text, codigo_producto }) => {
          data.push({ value: id_producto, label: codigo_producto + "-" + producto_text });
        });
        setProducts(data);
        setLoading(false);
      });

    }
  }


  return (
    <Modal
      open={open}
      title="Agregar productos Saldos"
      okText="Guardar"
      cancelText="Cancelar"
      width="1200px"
      loading={loading}
      maskClosable={false}
      onCancel={() => {
        setOpen(false);
        form.resetFields();
        setDataSource([]);
        setRow(false);
        setLoading(false);
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
            width: "calc(20% - 8px)",
            margin: "0px 4px 16px 4px",
          }}
          rules={[
            {
              required: true,
              message: "Por favor ingrese un valor!",
            },
          ]}
          name="cod_factura"
          label="Cod factura"
        >
          <InputNumber onBlur={handlefact} />
        </Form.Item>
        <Form.Item
          style={{
            display: "inline-block",
            width: "calc(20% - 8px)",
            margin: "0px 4px 16px 4px",
          }}
          name="zona"
          label="Zona"
          rules={[
            {
              required: true,
              message: "Por favor ingrese un valor!",
            },
          ]}
        >
          <Select
            loading={loading}
            disabled>
            {zones.map(({ id, nombre }) => (
              <Option value={id} key={id}>
                {nombre}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
      <ListForm
        defaultColumns={defaultColumns}
        dataSource={dataSource}
        setDataSource={setDataSource}
        loading={loading}
        products={products}
        datProd={datProd}
      />
    </Modal>
  );
};

