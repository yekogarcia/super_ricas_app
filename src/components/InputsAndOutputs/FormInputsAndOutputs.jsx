import { DatePicker, Form, Input, InputNumber, message, Modal, Select } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getZones } from "../../controllers/fetchDynamics";
import {
  getInventoryDet,
  saveInventory,
  updateInventory,
} from "../../controllers/inventory";
import { addRow, updateRow } from "../utils/rows";
import { ListEdit } from "./ListEdit";
import moment from "moment";
import { formatArrayMoney, unformatArrayMoney, unformatMoney } from "../utils/utils";
const { Option } = Select;

export const FormInputsAndOutputs = ({
  open,
  setOpen,
  setRow,
  row,
  invent,
  setInvent,
  token,
  update,
  visible,
  onSearch,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [zones, setZones] = useState([]);
  const [fecha, setFecha] = useState(moment().format("YYYY-MM-DD"));
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saldoBase, setSaldoBase] = useState(0);

  let defaultColumns = [
    {
      label: "Id",
      name: "id",
      width: "wp-50",
      visible: false,
    },
    {
      label: "Producto",
      name: "id_producto",
      width: "wp-100",
      visible: false,
    },
    {
      label: "Producto",
      name: "nomb_producto",
      filter: "search",
      width: "wp-200",
    },
    {
      label: "Cant",
      name: "cantidad",
      width: "wp-50",
      filter: "order",
      editable: true,
    },
    {
      label: "Codigo",
      filter: "search",
      width: "wp-90",
      name: "codigo_producto",
    },
    {
      label: "Valor unitario",
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
      label: "IVA",
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
      label: "Comisión",
      width: "wp-100",
      name: "porcen_comision",
    },
    {
      label: "Valor comisión",
      name: "valor_comision",
      width: "wp-100",
      filter: "order",
      format: "money",
    },
    {
      label: "Cantidad salida",
      name: "cantidad_salida",
      width: "wp-100",
      filter: "order",
      visible: visible,
      editable: true,
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
      dispatch(getInventoryDet("", token, row.id)).then(function (res) {
        setDataSource(formatArrayMoney(res, defaultColumns));
        setLoading(false);
      });
      row.fecha_dia = moment(row.fecha_dia, "YYYY-MM-DD");
      setFecha(row.fecha_dia);
      row.saldo_base = unformatMoney(row.saldo_base);
      form.setFieldsValue(row);
    } else {
      setFecha(moment().format("YYYY-MM-DD"));
      // form.resetFields();
    }
  }, [row]);

  useEffect(() => {
    dispatch(getZones("", token)).then((pr) => {
      setZones(pr);
    });
  }, []);

  const onCreate = (values) => {
    // console.log(values);
    setLoading(true);
    values.fecha_dia = moment(values.fecha_dia["_d"]).format("YYYY-MM-DD");
    const dataFormat = unformatArrayMoney(dataSource, defaultColumns);
    values.detalles = dataFormat;

    if (dataFormat.length === 0) {
      message.warning("No puedes guardar, sin agregar almenos un producto");
      return;
    }
    console.log(dataFormat);
    if (!row) {
      const exist = invent.filter(
        (dt) =>
          dt.id_zona == values.id_zona && dt.fecha_dia["_i"] == values.fecha_dia
      );
      if (exist.length > 0) {
        message.warning("Ya tienes agregada la misma zona, en la misma fecha!");
        return;
      }
      dispatch(saveInventory(values, token)).then((res) => {
        res[0].key = res[0].id;
        // setInvent(addRow(invent, res[0]));
        onSearch();
        setOpen(false);
        form.resetFields();
        setDataSource([]);
        setLoading(false);
      });
    } else {
      console.log(values);
      values.id = row.id;
      dispatch(updateInventory(values, row.id, token)).then((res) => {
        console.log(res);
        // setInvent(updateRow(invent, res[0], row.id));
        onSearch();
        setOpen(false);
        setRow(false);
        form.resetFields();
        setDataSource([]);
        setLoading(false);
      });
    }
  };

  const onChageDate = (value) => {
    setFecha(moment(value["_d"]).format("YYYY-MM-DD"));
  };

  setTimeout(function () {
    if (!row) {
      form.setFieldValue("fecha_dia", moment(fecha, "YYYY-MM-DD"));
      form.setFieldValue("saldo_base", saldoBase);
    }
  }, 500);

  return (
    <Modal
      open={open}
      title="Agregar producto por zona"
      okText="Guardar"
      cancelText="Cancelar"
      width="1200px"
      maskClosable={false}
      onCancel={() => {
        setOpen(false);
        form.resetFields();
        setDataSource([]);
        setRow(false);
        setSaldoBase(0)
      }}
      onOk={() => {
        update || visible
          ? form
            .validateFields()
            .then((values) => {
              onCreate(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            })
          : message.error("No puede editar, verifique por favor!");
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
          name="fecha_dia"
          label="Fecha / Día"
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
            width: "calc(25% - 8px)",
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
            width: "calc(20% - 8px)",
            margin: "0px 4px 16px 4px",
          }}
          name="codigo"
          label="Codigo factura"
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
            width: "calc(25% - 8px)",
            margin: "0px 4px 16px 4px",
          }}
          name="saldo_base"
          label="Saldo base"
        >
          <InputNumber onBlur={(e) => { setSaldoBase(form.getFieldValue('saldo_base')) }}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>
      </Form>
      <ListEdit
        defaultColumns={defaultColumns}
        dataSource={dataSource}
        setDataSource={setDataSource}
        update={update}
        visible={visible}
        loading={loading}
      />
    </Modal>
  );
};
