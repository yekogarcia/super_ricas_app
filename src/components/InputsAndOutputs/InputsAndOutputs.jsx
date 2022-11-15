import { Button, Popconfirm, Table } from "antd";
import { useState, useEffect } from "react";
import { setColumnsList } from "../utils/setColumnsList";
import { useDispatch, useSelector } from "react-redux";

import { Filters } from "../Filters/Filters";
import { setOptionsBlock } from "../utils/setOptionsList";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { removeRow } from "../utils/rows";
import { deleteRowInventory, getInventory } from "../../controllers/inventory";

import "./InputsAndOutputs.scss";
import "../css/style.scss";
import { FormInputsAndOutputs } from "./FormInputsAndOutputs";

export const InputsAndOutputs = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [row, setRow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [update, setUpdate] = useState(true);
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
      visible: false,
    },
    {
      label: "Zona",
      name: "zona_text",
      filter: "search",
      width: "wp-200",
    },
    {
      label: "Fecha ingreso",
      name: "fecha_dia",
      filter: "search",
      width: "wp-200",
    },
    {
      label: "Estado",
      name: "estado",
      width: "wp-100",
    },
  ];

  const handleUpdate = (values) => {
    setOpen(true);
    setRow(values);
    setUpdate(true);
    setVisible(false);
    if (values.estado !== "INGRESADA") {
      setUpdate(false);
    }
  };

  const handleOutputs = (values) => {
    setOpen(true);
    setRow(values);
    setUpdate(false);
    setVisible(true);
  };

  const handleImprimir = (values) => {
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
        {record.estado == "INGRESADA" ? (
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
        ) : (
          ""
        )}
      </div>
    );
  };

  const block = setOptionsBlock(contextMenu);
  let columns = setColumnsList(confColumns, invent);
  columns = block.concat(columns);

  columns.push({
    title: "Ver / Editar",
    dataIndex: "ver",
    className: "wp-150",
    render: (_, record) =>
      invent.length >= 1 ? (
        <a onClick={() => handleUpdate(record)}>Ver / Editar</a>
      ) : null,
  });
  columns.push({
    title: "Imprimir",
    dataIndex: "imprimir",
    className: "wp-100",
    render: (_, record) =>
      invent.length >= 1 ? (
        <a onClick={() => handleImprimir(record)}>Imprimir</a>
      ) : null,
  });
  columns.push({
    title: "Salida",
    dataIndex: "salida",
    className: "wp-100",
    render: (_, record) =>
      invent.length >= 1 ? (
        <a onClick={() => handleOutputs(record)}>Dar salida</a>
      ) : null,
  });

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
    token,
    update,
    visible,
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
              setUpdate(true);
              setVisible(false);
            }}
          >
            Nuevo
          </Button>
          <Filters {...prmsFilters} />
        </aside>
        <FormInputsAndOutputs {...prmsForm} />
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
