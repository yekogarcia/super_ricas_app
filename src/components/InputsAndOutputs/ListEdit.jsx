import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Select,
  Table,
} from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteRowInventoryDetId } from "../../controllers/inventory";
import { getBalanceProducts, getProductsConcat, getProductsId } from "../../controllers/products";
import { setColumnsList } from "../utils/setColumnsList";
import { formatArrayMoney, formatMoney, unformatMoney } from "../utils/utils";
const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = (props) => {
  const {
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    typeInput,
    ...restProps
  } = props;

  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      if (typeof values.cantidad !== "undefined") {
        console.log(record);
        record.precio_total = Math.round(
          unformatMoney(record.precio_unidad) * values.cantidad
        );
        record.valor_iva = Math.round((record.precio_total * record.iva) / 100);
        record.valor_comision = Math.round(
          (record.precio_total * record.porcen_comision) / 100
        );
        record.valor_venta = Math.round(record.precio_total + record.valor_iva);

        record.precio_total = formatMoney(record.precio_total);
        record.valor_iva = formatMoney(record.valor_iva);
        record.valor_comision = formatMoney(record.valor_comision);
        record.valor_venta = formatMoney(record.valor_venta);
      }

      handleSave({
        ...record,
        ...values,
      });

    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} es requerido.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 0,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

export const ListEdit = ({
  dataSource,
  setDataSource,
  update,
  visible,
  loading,
  defaultColumns,
  zona
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const cols = defaultColumns;

  const [products, setProducts] = useState([]);
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

  const handleDelete = (record) => {
    console.log(record);
    if (typeof record.id !== "undefined") {
      dispatch(deleteRowInventoryDetId(record.id, token)).then((res) => {
        const newData = dataSource.filter((item) => item.key !== record.key);
        setDataSource(newData);
      });
    } else {
      const newData = dataSource.filter((item) => item.key !== record.key);
      setDataSource(newData);
    }
  };

  defaultColumns = setColumnsList(defaultColumns, dataSource);
  if (update) {
    defaultColumns.push({
      title: "Action",
      dataIndex: "action",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Esta seguro de eliminar este item?"
            onConfirm={() => handleDelete(record)}
          >
            <a>Eliminar</a>
          </Popconfirm>
        ) : null,
    });
  }

  const handleAdd = (value) => {
    dispatch(getProductsId(value.id_producto, token)).then((res) => {
      //   console.log(res);
      //   console.log(value);
      const findDt = dataSource.filter(
        (dt) => dt.id_producto == value.id_producto
      );
      if (findDt.length > 0) {
        message.error(
          "Ya existe un producto agregado, no puede agregar el mismo producto!"
        );
      } else {
        if (value.cantidad > 0) {
          let precio_total = Math.round(res[0].precio * value.cantidad);
          let valor_iva = Math.round(
            (res[0].precio * value.cantidad * res[0].iva) / 100
          );
          let valor_comision = Math.round(
            (res[0].precio * value.cantidad * res[0].porcen_comision) / 100
          );
          let valor_venta = Math.round(precio_total + valor_iva);

          const newData = {
            key: res[0].id,
            id_producto: res[0].id,
            nomb_producto: res[0].nombre,
            cantidad: value.cantidad,
            codigo_producto: res[0].codigo,
            precio_unidad: formatMoney(res[0].precio),
            precio_total: formatMoney(precio_total),
            iva: res[0].iva,
            porcen_comision: res[0].porcen_comision,
            valor_iva: formatMoney(valor_iva),
            valor_comision: formatMoney(valor_comision),
            valor_venta: formatMoney(valor_venta),
          };

          setDataSource([...dataSource, newData]);
        } else {
          message.warning("La cantidad tiene que ser mayor a 0!");
        }
      }
      selectRef.current.focus();
      //   form.setFieldValue("cantidad", '');
      form.resetFields();
    });
  };

  const handleApplySaldos = () => {
    if (zona !== 0) {
      dispatch(getBalanceProducts("", { id_zona: zona }, token)).then(res => {
        console.log(res);
        setDataSource(formatArrayMoney(res, cols));
      });
    }else{
      message.error("Debe seleccionar una zona");
    }
  }

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        typeInput: col.typeInput,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const selectRef = useRef(null);

  const onChange = (value) => {
    console.log(value);
  };
  const onSearch = (value) => { };
  return (
    <div>
      {update ? (
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
              ref={selectRef}
              onChange={onChange}
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
              width: "calc(30% - 8px)",
              margin: "0px 4px 16px 4px",
            }}
            name="cantidad"
            label="Cantidad"
            rules={[
              {
                required: true,
                message: "Por favor ingrese un valor!",
              },
            ]}
          >
            <InputNumber parser={(value) => value.replace(/\$\s?|(,*)/g, "")} />
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
            Agregar producto
          </Button>
          <Button
            onClick={handleApplySaldos}
            type="primary"
            style={{
              marginBottom: 0,
              marginTop: 31,
              marginLeft: 10,
            }}
          >
            Aplicar saldos
          </Button>
        </Form>
      ) : (
        ""
      )}
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        size="small"
      />
    </div>
  );
};
