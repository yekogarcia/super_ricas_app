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
import { deletePayments } from "../../controllers/inventory";
import { setColumnsList } from "../utils/setColumnsList";
import { formatMoney, unformatMoney } from "../utils/utils";

export const ListFormPays = ({
  pays,
  setPays,
  visualize,
  loading,
  rowIn,
  setValor,
  valor,
  defaultColumns
}) => {
  const [form] = Form.useForm();
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);

  useEffect(() => { }, []);

  const handleDelete = (record) => {
    console.log(record);
    if (typeof record.id !== "undefined") {
      dispatch(deletePayments(token, record.id)).then((res) => {
        const newData = pays.filter((item) => item.key !== record.key);
        setPays(newData);
        setCount(count - 1);
        if (record.concepto !== 'FIADO') {
          setValor(valor - unformatMoney(record.valor));
        }
      });
    } else {
      const newData = pays.filter((item) => item.key !== record.key);
      setPays(newData);
      setCount(count - 1);
      if (record.concepto !== 'FIADO') {
        setValor(valor - unformatMoney(record.valor));
      }
    }
  };



  defaultColumns = setColumnsList(defaultColumns, pays);

  if (visualize) {
    defaultColumns.push({
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
  }

  const handleAdd = (value) => {
    //   console.log(res);
    console.log(value);
    // message.error(
    //   "Ya existe un producto agregado, no puede agregar el mismo producto!"
    // );
    if (value.valor > 0) {
      setCount(count + 1);
      let valPendiente = rowIn.valor_venta - valor;
      if (valPendiente <= value.valor) {
        message.warning("El valor no puede ser mayor al valor pendiente!");
        return;
      }
      if (value.concepto !== 'FIADO') {
        setValor(valor + value.valor);
      }
      const newData = {
        concepto: value.concepto,
        fecha: moment(value.fecha["_d"]).format("YYYY-MM-DD"),
        valor: formatMoney(value.valor),
        estado: 'ACTIVO',
        key: count,
      };

      setPays([...pays, newData]);
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

  const selectRef = useRef(null);
  setTimeout(function () {
    form.setFieldValue("concepto", "INGRESO");
  }, 200);

  return (
    <div className="pays">
      {visualize ? (
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
              width: "calc(25% - 8px)",
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
              width: "calc(25% - 8px)",
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
      ) : (
        ""
      )}
      <Table
        rowClassName={() => "editable-row"}
        bordered
        dataSource={pays}
        columns={defaultColumns}
        loading={loading}
        size="small"
        // title={() => 'Header'}
        footer={() => (
          <>
            <div className="total">Total: {formatMoney(rowIn.valor_venta)}</div>
            <div className="income">Ingresos: {formatMoney(valor)}</div>
            <div className="missing">Faltante: {formatMoney(rowIn.valor_venta - valor)}</div>
            {/* <div className="missing">Faltante: { formatMoney(unformatMoney(rowIn.valor_venta) - unformatMoney(valor))}</div> */}
          </>
        )}
      />
    </div>
  );
};
