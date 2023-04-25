import { Button, DatePicker, Form, InputNumber, Select, Table } from "antd"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";

import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import { setOptionsBlock } from "../../utils/setOptionsList";
import { setColumnsList } from "../../utils/setColumnsList";
import { deleteReturns, getProductsAll, getProductsConcat, getReturns, saveMenu } from "../../../controllers/products";
import { removeRow } from "../../utils/rows";
import { setDataEdit } from "../../../controllers/redux";
import { formatArrayMoney, formatMoney, unformatArrayMoney } from "../../utils/utils";


export const Ldevolutions = ({ formEnc }) => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState([]);
  const dispatch = useDispatch();


  const [form] = Form.useForm();

  const { token } = useSelector((state) => state.auth);
  const { products } = useSelector((state) => state.products);
  const { eventEdit } = useSelector((state) => state.edit);
  let dta = eventEdit;


  useEffect(() => {
    if (typeof products !== 'undefined') {
      const data = [];
      products.map(({ id, nombre, codigo }) => {
        const nom = codigo + "-" + nombre;
        data.push({ value: id, label: nom });
      });
      setProduct(data);
    }
  }, [products]);

  useEffect(() => {
    setReturns([]);
    if (dta.id !== "") {
      dispatch(getReturns("", { zona: dta.id_zona }, token)).then(res => {
        // console.log(res);
        setReturns(formatArrayMoney(res, defaultColumns));
        setLoading(false);
      });
    }
  }, [dta])



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
      visible: false
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
      width: "wp-70",
      filter: "order",
    },
    {
      label: "Valor unidad",
      name: "valor_unidad",
      width: "wp-150",
      format: "money",
      filter: "order",
    },
    {
      label: "Total",
      name: "total",
      width: "wp-150",
      format: "money",
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

  let columns = setColumnsList(defaultColumns, returns);
  columns = block.concat(columns);


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
    const { nombre, precio } = products.find(({ id }) => id === values.id_producto);
    values.key = values.id_producto;
    values.producto_text = nombre;
    values.zona_text = dta.zona_text;
    values.estado = 'PENDIENTE';
    values.fecha = moment(values.fecha["_d"]).format("YYYY-MM-DD");
    values.valor_unidad = formatMoney(precio);
    values.total = formatMoney(values.cantidad * precio);
    dta.total_devoluciones += values.cantidad * precio;
    console.log(dta);
    setReturns([...returns, values]);
    dispatch(setDataEdit(dta));
    form.resetFields();
  }

  setTimeout(function () {
    form.setFieldValue("fecha", moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD"));
  }, 500);

  const onChageDate = () => {

  }
  const handleSaveDevolutions = () => {
    let data = {...dta};
    data.devoluciones = unformatArrayMoney(returns, defaultColumns);
    console.log(data);
    dispatch(saveMenu(data, token)).then(res => {
      if (res) {
        dta.id = res;
        dispatch(setDataEdit(dta));
        dispatch(getReturns("", { zona: dta.id_zona }, token)).then(res => {
          // console.log(res);
          setReturns(formatArrayMoney(res, defaultColumns));
          setLoading(false);
        });
        formEnc.setFieldValue("id", res);
      }
    });
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
            options={product}
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
        columns={columns}
        loading={loading}
        size="small"
      />
      <Button type="primary" onClick={handleSaveDevolutions}>Guardar Devoluciones</Button>
    </>
  )
}
