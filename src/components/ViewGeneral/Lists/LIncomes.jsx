
import {
  Button,
  DatePicker,
  Form,
  InputNumber,
  message,
  Popconfirm,
  Select,
  Table,
} from "antd";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deletePayments } from "../../../controllers/inventory";
import { setDataEdit } from "../../../controllers/redux";
import { setColumnsList } from "../../utils/setColumnsList";
import { formatMoney, unformatArrayMoney, unformatMoney } from "../../utils/utils";
import { saveMenu } from "../../../controllers/products";
//   import { deletePayments } from "../../controllers/inventory";
//   import { setColumnsList } from "../utils/setColumnsList";
//   import { formatMoney, unformatMoney } from "../utils/utils";

export const LIncomes = ({formEnc}) => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [valor, setValor] = useState(0);
  const [pays, setPays] = useState([]);
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const { eventEdit } = useSelector((state) => state.edit);
  let dta = eventEdit;

  let defaultColumns = [
    {
      label: "Id",
      name: "id",
      width: "wp-50",
      visible: false,
    },
    {
      label: "Concepto",
      name: "concepto",
      filter: "search",
      width: "wp-200",
    },
    {
      label: "Fecha",
      name: "fecha",
      filter: "search",
      width: "wp-200",
    },
    {
      label: "Valor",
      name: "valor",
      width: "wp-200",
      filter: "order.search",
      format: "money",
    },
    {
      label: "Estado",
      name: "estado",
      width: "wp-150",
      filter: "order"
    }
  ];

  // useEffect(() => { }, []);

  const calcValIncomes = (record) => {
    if (record.concepto === 'INGRESO') {
      dta.valor_ingresos -= unformatMoney(record.valor);
    }
    if (record.concepto === 'DESCUENTO') {
      dta.valor_descuento -= unformatMoney(record.valor);
    }
    if (record.concepto === 'FIADO') {
      dta.valor_fiado -= unformatMoney(record.valor);
    }
    dispatch(setDataEdit(dta));
  }

  const handleDelete = (record) => {
    console.log(record);
    if (typeof record.id !== "undefined") {
      dispatch(deletePayments(token, record.id)).then((res) => {
        const newData = pays.filter((item) => item.key !== record.key);
        setPays(newData);
        setCount(count - 1);
        calcValIncomes(record);
      });
    } else {
      const newData = pays.filter((item) => item.key !== record.key);
      setPays(newData);
      setCount(count - 1);
      calcValIncomes(record);
    }
  };

  let columns = setColumnsList(defaultColumns, pays);

  columns.push({
    title: "Action",
    dataIndex: "action",
    className: "wp-150",
    render: (_, record) =>
      pays.length >= 1 ? (
        <Popconfirm
          title="Esta seguro de eliminar este ingreso?"
          onConfirm={() => handleDelete(record)}
        >
          <a>Eliminar</a>
        </Popconfirm>
      ) : null,
  });

  const handleAdd = (value) => {
    console.log(value);
    if (value.valor > 0) {
      setCount(count + 1);
      if (dta.valor_pendiente <= value.valor) {
        message.warning("El valor no puede ser mayor al valor pendiente!");
        return;
      }
      if (value.concepto === 'INGRESO') {
        dta.valor_ingresos += value.valor;
      }
      if (value.concepto === 'DESCUENTO') {
        dta.valor_descuento += value.valor;
      }
      if (value.concepto === 'FIADO') {
        dta.valor_fiado += value.valor;
      }
      const newData = {
        concepto: value.concepto,
        fecha: moment(value.fecha["_d"]).format("YYYY-MM-DD"),
        valor: formatMoney(value.valor),
        estado: 'ACTIVO',
        key: count,
      };
      setPays([...pays, newData]);
      dispatch(setDataEdit(dta));
    } else {
      message.warning("El valor tiene que ser mayor a 0!");
    }
    selectRef.current.focus();
    form.resetFields();
  };

  //   const handleSave = (row) => {
  //     const newData = [...pays];
  //     const index = newData.findIndex((item) => row.key === item.key);
  //     const item = newData[index];
  //     newData.splice(index, 1, {
  //       ...item,
  //       ...row,
  //     });
  //     setPays(newData);
  //   };

  const handleSaveIncome = () => {
    let data = dta;
    data.ingresos = pays;
    console.log(data);
    dispatch(saveMenu(data, token)).then(res => {
      if (res) {
        dta.id = res;
        dispatch(setDataEdit(dta));
        formEnc.setFieldValue("id", res);
      }
    });
  }

  const selectRef = useRef(null);
  setTimeout(function () {
    form.setFieldValue("concepto", "INGRESO");
    form.setFieldValue("fecha", moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD"));
  }, 200);

  return (
    <div className="pays">
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
          name="concepto"
          label="Concepto"
          rules={[
            {
              required: true,
              message: "Por favor ingrese un valor!",
            },
          ]}
        >
          <Select
            placeholder="Seleccione"
            options={[
              {
                key: "INGRESO",
                value: "INGRESO",
                label: "INGRESO",
              },
              {
                key: "DESCUENTO",
                value: "DESCUENTO",
                label: "DESCUENTO",
              },
              {
                key: "FIADO",
                value: "FIADO",
                label: "FIADO",
              },
            ]}
          />
        </Form.Item>
        <Form.Item
          style={{
            display: "inline-block",
            width: "calc(20% - 8px)",
            margin: "0px 4px 16px 4px",
          }}
          name="fecha"
          label="Fecha"
          rules={[
            {
              required: true,
              message: "Por favor ingrese un valor!",
            },
          ]}
        >
          <DatePicker ref={selectRef} />
        </Form.Item>
        <Form.Item
          style={{
            display: "inline-block",
            width: "calc(20% - 8px)",
            margin: "0px 4px 16px 4px",
          }}
          name="valor"
          label="Valor"
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
        <Button
          onClick={() => {
            form
              .validateFields()
              .then((values) => {
                handleAdd(values);
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
          type="primary"
          style={{
            marginBottom: 0,
            marginTop: 31,
          }}
        >
          Agregar
        </Button>
      </Form>
      <Table
        rowClassName={() => "editable-row"}
        bordered
        dataSource={pays}
        columns={columns}
        loading={loading}
        size="small"
        // title={() => 'Header'}
        footer={() => (
          <>
            <div className="total">Total: {formatMoney(dta.valor_venta)}</div>
            <div className="income">Ingresos: {formatMoney(dta.valor_ingresos)}</div>
            <div className="missing">Faltante: {formatMoney(dta.valor_pendiente)}</div>
          </>
        )}
      />
      <Button type="primary" onClick={handleSaveIncome}>Guardar Ingresos</Button>
    </div>
  );
};

