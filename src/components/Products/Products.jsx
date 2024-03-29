import { Button, Table } from "antd";
import { useState, useEffect } from "react";
import { setColumnsList } from "../utils/setColumnsList";
import { FormProducts } from "./FormProducts";
import { useDispatch, useSelector } from "react-redux";
import { deleteProducts, getProducts } from "../../controllers/products";

import { Filters } from "../Filters/Filters";
import { setOptionsBlock } from "../utils/setOptionsList";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import "./Products.scss";
import "../css/style.scss";
import { removeRow } from "../utils/rows";
import { formatArrayMoney } from "../utils/utils";

export const Products = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [row, setRow] = useState(false);
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    onSearch();
  }, []);

  const confColumns = [
    {
      label: "ID",
      name: "id",
      filter: "order",
      width: "wp-50",
    },
    {
      label: "Nombre producto",
      name: "nombre",
      filter: "search",
      width: "wp-200",
    },
    {
      label: "Código",
      name: "codigo",
      width: "wp-100",
      filter: "search",
    },
    {
      label: "Estado",
      name: "estado",
      filter: "order",
      width: "wp-100",
    },
    {
      label: "Id categoria",
      name: "id_categoria",
      width: "wp-100",
      filter: "order",
      visible: false,
    },
    {
      label: "Categoría",
      name: "categoria_text",
      width: "wp-150",
      filter: "order",
    },
    {
      label: "Precio",
      name: "precio",
      width: "wp-100",
      filter: "order",
      format: "money"
    },
    {
      label: "% Comisión",
      name: "porcen_comision",
      width: "wp-100",
      filter: "order",
    },
    {
      label: "IVA %",
      name: "iva",
      width: "wp-100",
      filter: "order",
    },
    {
      label: "Descripción",
      name: "descripcion",
      width: "wp-200",
      filter: "search",
    },
    {
      label: "Unidad de medida",
      name: "unidad_medida",
      width: "wp-200",
      filter: "search",
    },
    {
      label: "Factor",
      name: "factor",
      width: "wp-100",
      filter: "order",
    },
    {
      label: "Código de barras",
      name: "codigo_barras",
      width: "wp-200",
      filter: "search",
    },
    {
      label: "Fecha creación",
      name: "fecha_creacion",
      width: "wp-200",
      filter: "search",
    },
    {
      label: "Fecha modificación",
      name: "fecha_modificacion",
      width: "wp-200",
      filter: "search",
    },
  ];

  const { token } = useSelector((state) => state.auth);

  const handleUpdate = (values) => {
    setOpen(true);
    setRow(values);
  };

  const handleDelete = (values) => {
    setLoading(true);
    dispatch(deleteProducts(values.id, token)).then((pr) => {
      setProducts(removeRow(products, values.id));
      setLoading(false);
    });
  };

  const contextMenu = (record) => {
    return (
      <div className="options">
        <div>
          <a onClick={() => handleUpdate(record)}>
            <EditOutlined />
            Editar
          </a>
          <a onClick={() => handleDelete(record)}>
            <DeleteOutlined />
            Eliminar
          </a>
        </div>
      </div>
    );
  };
  const block = setOptionsBlock(contextMenu);
  let columns = setColumnsList(confColumns, products);
  columns = block.concat(columns);

  const pagination = [];

  const handleTableChange = () => {};

  const onSearch = (values = "") => {
    setLoading(true);
    dispatch(getProducts(values, token)).then((pr) => {
      setProducts(formatArrayMoney(pr, confColumns));
      setLoading(false);
    });
  };

  const prmsForm = {
    open,
    setOpen,
    setRow,
    row,
    products,
    setProducts,
    token,
  };

  const prmsFilters = {
    onSearch,
    loading,
    filters: [],
  };
  const onChangePagination = (current, pageSize) => {
    console.log(current);
    console.log(pageSize);
  }

  return (
    <>
      <section className="contain-table">
        <aside className="head-table">
          <Button
            type="primary"
            onClick={() => {
              setOpen(true);
            }}
          >
            Nuevo
          </Button>
          <Filters {...prmsFilters} />
        </aside>
        <FormProducts {...prmsForm} />
        <Table
          columns={columns}
          dataSource={products}
          // pagination={pagination}
          // pagination={{ simple: "simple", defaultCurrent: 1, total: products.length }}
          pagination={{ size: "small", total: products.length, showSizeChanger: "showSizeChanger", showQuickJumper: "showQuickJumper", onShowSizeChange: onChangePagination  }}
          loading={loading}
          onChange={handleTableChange}
          size="small"
          bordered
        />
      </section>
    </>
  );
};
