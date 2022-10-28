import { Button, Popconfirm, Table } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  deleteCategories,
  getCategories,
  saveCategories,
  updateCategories,
} from "../../controllers/fetchDynamics";
import { Filters } from "../Filters/Filters";
import { Forms } from "../Forms/Forms";
import { setColumnsList } from "../utils/setColumnsList";
import { setOptionsBlock } from "../utils/setOptionsList";

import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { addRow, removeRow, updateRow } from "../utils/rows";

export const Categories = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [row, setRow] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    dispatch(getCategories()).then((pr) => {
      setCategories(pr);
      setLoading(false);
    });
  }, [dispatch]);

  const confColumns = [
    {
      label: "ID",
      name: "id",
      filter: "order",
      width: "wp-50",
    },
    {
      label: "Categoria",
      name: "nombre",
      filter: "search",
      width: "wp-250",
    },
    {
      label: "Fecha creación",
      name: "fecha_creacion",
      filter: "search",
      width: "wp-250",
    },
    {
      label: "Descripción",
      name: "descripcion",
      filter: "search",
      width: "wp-300",
    },
    {
      label: "Fecha modificación",
      name: "fecha_modificacion",
      filter: "search",
      width: "wp-250",
    },
    // {
    //   label: "Usuario",
    //   name: "user",
    //   filter: "order",
    //   width: "wp-200",
    // },
  ];

  const onCreate = (values) => {
    setLoading(true);
    if (!row) {
      dispatch(saveCategories(values)).then((pr) => {
        setLoading(false);
        setOpen(false);
        setCategories(addRow(categories, pr[0]));
      });
    } else {
      dispatch(updateCategories(values, row.id)).then((pr) => {
        setLoading(false);
        setOpen(false);
        setCategories(updateRow(categories, pr, row.id));
      });
    }
  };

  const handleUpdate = (values) => {
    setOpen(true);
    setRow(values);
  };

  const handleDelete = (values) => {
    dispatch(deleteCategories(values.id)).then((pr) => {
      setCategories(removeRow(categories, values.id));
    });
  };
  const onSearch = (pr) => {
    console.log(pr);
    // setLoading(true);
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
  let columns = setColumnsList(confColumns, categories);
  columns = block.concat(columns);

  const inputs = [
    {
      label: "Nombre",
      name: "nombre",
      width: "100%",
      required: true,
      type: "input",
    },
    {
      label: "Descripción",
      name: "descripcion",
      width: "100%",
      required: false,
      type: "textArea",
    },
  ];

  const propsForm = {
    title: "Crear categoría",
    width: "400px",
    open,
    setOpen,
    onCreate,
    inputs,
    row,
  };

  const params = {
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
              setRow(false);
              setOpen(true);
            }}
          >
            Nuevo
          </Button>
          <Filters {...params} />
        </aside>
        <Forms {...propsForm} />
        <Table
          columns={columns}
          dataSource={categories}
          // pagination={pagination}
          loading={loading}
          // onChange={handleTableChange}
          size="middle"
        />
      </section>
    </>
  );
};
