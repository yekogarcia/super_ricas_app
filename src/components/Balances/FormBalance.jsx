import { Button, DatePicker, Form, InputNumber, message, Modal, Select } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getZones } from "../../controllers/fetchDynamics";
import { addRow, updateRow } from "../utils/rows";
import moment from "moment";
import { getBalanceProducts, getProductsConcat, saveBalance, updateBalance, } from "../../controllers/products";
import { ListForm } from "./ListForm";
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
  const [dataSource, setDataSource] = useState([]);
  const [fecha, setFecha] = useState(moment().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);

  const { user_login } = useSelector((state) => state.auth);



  useEffect(() => {
    if (row) {
      setLoading(true);
      form.setFieldsValue(row);
      dispatch(getBalanceProducts("", { id: row.id }, token)).then(res => {
        console.log(res);
        setDataSource(res);
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

    values.usuario = user_login;
    values.productos = dataSource;
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
      title="Agregar productos Saldos"
      okText="Guardar"
      cancelText="Cancelar"
      width="600px"
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
            width: "calc(50% - 8px)",
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
            width: "calc(43% - 8px)",
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
          <InputNumber />
        </Form.Item>
      </Form>
      <ListForm
        dataSource={dataSource}
        setDataSource={setDataSource}
        loading={loading}
      />
    </Modal>
  );
};

