import { Button, DatePicker, Form, InputNumber, Select, Table } from "antd"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";

import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import { setOptionsBlock } from "../../utils/setOptionsList";
import { setColumnsList } from "../../utils/setColumnsList";
import { deleteReturns, getProductsConcat, getReturns } from "../../../controllers/products";
import { removeRow } from "../../utils/rows";


export const Ldevolutions = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();


  const [form] = Form.useForm();

  const { token } = useSelector((state) => state.auth);


  useEffect(() => {
    dispatch(getProductsConcat("", token)).then((pr) => {
      const data = [];
      pr.map(({ id, nombre }) => {
        data.push({ value: id, label: nombre });
      });
      setProducts(data);
    });
  }, []);


  let defaultColumns = [
    {
      label: "Id",
      name: "id",
      width: "wp-50",
    },
    {
      label: "Fecha",
      name: "fecha",
      filter: "search",
      width: "wp-150",
    },
    {
      label: "Tipo",
      name: "tipo_devolucion",
      filter: "search",
      width: "wp-150",
    },
    {
      label: "Id Zona",
      name: "id_zona",
      width: "wp-50",
      visible: false
    },
    {
      label: "Estado",
      name: "estado",
      filter: "search",
      width: "wp-100",
    },
    {
      label: "Zona",
      name: "zona_text",
      filter: "search",
      width: "wp-200",
    },
    {
      label: "Id prodducto",
      name: "id_producto",
      filter: "search",
      width: "wp-50",
      visible: false
    },
    {
      label: "Producto",
      name: "producto_text",
      filter: "search",
      width: "wp-200",
    },
    {
      label: "Cantidad",
      name: "cantidad",
      width: "wp-100",
      filter: "order",
    },
    {
      label: "No Fact",
      name: "num_factura",
      width: "wp-100",
      filter: "order",
    },
  ];

  const contextMenu = (record) => {
    return (
      <div className="options">
        {record.estado !== 'APLICADA' ?
          <div>
            <a onClick={() => handleDelete(record)}>
              <DeleteOutlined />
              Eliminar
            </a>
          </div>
          : ""}
      </div>
    );
  };
  const block = setOptionsBlock(contextMenu);

  defaultColumns = setColumnsList(defaultColumns, returns);
  defaultColumns = block.concat(defaultColumns);


  const onSearch = (record) => {
    // setLoading(true);

    // console.log(record);
    // dispatch(getReturns("", record, token)).then(res => {
    //   // console.log(res);
    //   setReturns(res);
    //   setLoading(false);
    // });
  }

  // const handleUpdate = (record) => {
  //   setOpen(true);
  //   setRow(record)
  // }


  const handleDelete = record => {
    // console.log(record);
    dispatch(deleteReturns(record.id, token)).then(res => {
      setReturns(removeRow(returns, record.id));
    });
  }


  const handleAddRow = (values) => {
    console.log(values);
    values.estado = 'PENDIENTE';
    values.fecha = moment(values.fecha["_d"]).format("YYYY-MM-DD");
    setReturns([...returns, values]);
  }

  setTimeout(function () {
    form.setFieldValue("fecha", moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD"));
  }, 500);

  const onChageDate = () => {

  }
  return (
    <>
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
            width: "calc(20% - 8px)",
            margin: "0px 4px 16px 4px",
          }}
          name="tipo_devolucion"
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
            width: "calc(25% - 8px)",
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
            // onChange={onChangeProduct}
            showSearch
            optionFilterProp="children"
            onSearch={onSearch}
            filterOption={(input, option) =>
              (option?.label ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            filterOption={(input, option) =>
              (option?.value.toString() ?? 0).includes(input)
            }
            options={products}
          />
        </Form.Item>
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
          name="cantidad"
          label="Cantidad"
        >
          <InputNumber />
        </Form.Item>
        <Button
          type="primary"
          onClick={() => {
            form
              .validateFields()
              .then((values) => {
                handleAddRow(values);
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
          style={{
            marginBottom: 0,
            marginTop: 31,
          }}
        >
          Agregar
        </Button>
      </Form>
      <Table
        bordered
        dataSource={returns}
        columns={defaultColumns}
        loading={loading}
        size="small"
      />
    </>
  )
}
