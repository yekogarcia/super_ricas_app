import { Button, Table } from "antd";
import { useState, useEffect } from "react";
import { setColumnsList } from "../utils/setColumnsList";
import { useDispatch } from "react-redux";
import { deleteProducts, getProducts } from "../../controllers/products";

import { Filters } from "../Filters/Filters";
import { setOptionsBlock } from "../utils/setOptionsList";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { removeRow } from "../utils/rows";
import { FormUser } from "./FormUser";

import "./Inventory.scss";
import "../css/style.scss";

export const Users = () => {
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
      label: "Nombre",
      name: "nombre",
      filter: "search",
      width: "wp-200",
      visible: false
    },
    {
      label: "Email",
      name: "email",
      filter: "search",
      width: "wp-200",
    },
    {
      label: "Perfil",
      name: "perfil",
      width: "wp-100",
      filter: "search",
    },
    {
      label: "Zona",
      name: "zona",
      filter: "order",
      width: "wp-100",
    },
    {
      label: "Cantidad",
      name: "cantidad",
      width: "wp-100",
      filter: "order",
    },
  ];

  const handleUpdate = (values) => {
    setOpen(true);
    setRow(values);
  };

  const handleDelete = (values) => {
    dispatch(deleteProducts(values.id)).then((pr) => {
      setProducts(removeRow(products, values.id));
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
    dispatch(getProducts(values)).then((pr) => {
      setProducts(pr);
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
  };

  const prmsFilters = {
    onSearch,
    loading,
    filters: [],
  };

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
        <FormUser {...prmsForm} />
        <Table
          columns={columns}
          dataSource={products}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          size="small"
        />
      </section>
    </>
  );
};
