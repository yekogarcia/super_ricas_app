import { Button, Table } from "antd"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { deleteReturns, getReturns } from "../../controllers/products";
import { Filters } from "../Filters/Filters";
import { setColumnsList } from "../utils/setColumnsList";
import { setOptionsBlock } from "../utils/setOptionsList";
import { FormReturns } from "./FormReturns";

import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { removeRow } from "../utils/rows";


export const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [row, setRow] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    onSearch()
  }, [])


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
      width: "wp-200",
    },
    {
      label: "Id Zona",
      name: "id_zona",
      filter: "search",
      width: "wp-150",
      visible: false
    },
    {
      label: "Zona",
      name: "zona_text",
      filter: "search",
      width: "wp-250",
    },
    {
      label: "Id prodducto",
      name: "id_producto",
      filter: "search",
      width: "wp-150",
      visible: false
    },
    {
      label: "Producto",
      name: "producto_text",
      filter: "search",
      width: "wp-250",
    },
    {
      label: "Cantidad",
      name: "cantidad",
      width: "wp-150",
      filter: "order",
    }
  ];

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

  defaultColumns = setColumnsList(defaultColumns, returns);
  defaultColumns = block.concat(defaultColumns);


  const onSearch = () => {
    setLoading(true);
    dispatch(getReturns("", token)).then(res => {
      setReturns(res);
      setLoading(false);
    });
  }

  const handleUpdate = (record) => {
    setOpen(true);
    setRow(record)
  }
  
  const handleDelete = record => {
    console.log(record);
    dispatch(deleteReturns(record.id, token)).then(res => {
      setReturns(removeRow(returns, record.id));
    });
  }
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
          <FormReturns
            open={open} setOpen={setOpen} token={token} row={row} setRow={setRow}
            onSearch={onSearch} />
        </aside>
        <Table
          bordered
          dataSource={returns}
          columns={defaultColumns}
          loading={loading}
          size="small"
        />
      </section>
    </>
  )
}
