import { Button, Table } from "antd";
import { useState, useEffect } from "react";
import { setColumnsList } from "../utils/setColumnsList";
import { useDispatch, useSelector } from "react-redux";

import { Filters } from "../Filters/Filters";
import { setOptionsBlock } from "../utils/setOptionsList";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { removeRow } from "../utils/rows";
import { FormInventory } from "./FormInventory";
import { deleteRowInventory, getInventory } from "../../controllers/inventory";

import "./Inventory.scss";
import "../css/style.scss";

export const Inventory = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [row, setRow] = useState(false);
  const [invent, setInvent] = useState([]);
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);

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
      label: "Zona",
      name: "id_zona",
      filter: "order",
      width: "wp-100",
      visible: false
    },
    {
      label: "Zona",
      name: "nom_zona",
      filter: "search",
      width: "wp-100",
    },
    {
      label: "Id Producto",
      name: "id_producto",
      filter: "search",
      width: "wp-200",
      visible: false
    },
    {
      label: "Fecha ingreso",
      name: "fecha_creacion",
      filter: "search",
      width: "wp-200",
    },
    {
      label: "Producto",
      name: "nom_producto",
      filter: "search",
      width: "wp-200",
    },
    {
      label: "Código",
      name: "codigo_producto",
      width: "wp-100",
      filter: "search",
    },
    {
      label: "Valor unitario",
      name: "precio_unidad",
      width: "wp-150",
      filter: "order",
    },
    {
      label: "Cantidad",
      name: "cantidad",
      width: "wp-100",
      filter: "order",
    },
    {
      label: "Valor total",
      name: "precio_total",
      width: "wp-150",
      filter: "order",
    },
    {
      label: "Estado",
      name: "estado",
      width: "wp-150",
      filter: "order",
    },

  ];

  const handleUpdate = (values) => {
    setOpen(true);
    setRow(values);
  };

  const handleDelete = (values) => {
    dispatch(deleteRowInventory(values.id, token)).then((pr) => {
      setInvent(removeRow(invent, values.id));
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
  let columns = setColumnsList(confColumns, invent);
  columns = block.concat(columns);

  const pagination = [];

  const handleTableChange = () => {};

  const onSearch = (values = "") => {
    setLoading(true);
    dispatch(getInventory(values, token)).then((res) => {
      setInvent(res);
      setLoading(false);
    });
  };


  const prmsForm = {
    open,
    setOpen,
    setRow,
    row,
    invent,
    setInvent,
    token
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
        <FormInventory {...prmsForm} />
        <Table
          columns={columns}
          dataSource={invent}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          size="small"
        />
      </section>
    </>
  );
};
