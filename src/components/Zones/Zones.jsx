import { Button, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteZones,
  getZones,
  saveZones,
  updateZones,
} from "../../controllers/fetchDynamics";
import { Filters } from "../Filters/Filters";
import { Forms } from "../Forms/Forms";
import { setColumnsList } from "../utils/setColumnsList";

import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { setOptionsBlock } from "../utils/setOptionsList";
import { addRow, removeRow, updateRow } from "../utils/rows";

export const Zones = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [row, setRow] = useState(false);
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
      label: "Zona",
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
      dispatch(saveZones(values)).then((pr) => {
        setZones(addRow(zones, pr[0]));
        setLoading(false);
        setOpen(false);
      });
    } else {
      dispatch(updateZones(values, row.id)).then((pr) => {
        setZones(updateRow(zones, pr, row.id));
        setLoading(false);
        setOpen(false);
      });
    }
  };

  const { token } = useSelector((state) => state.auth);

  const onSearch = (values = "") => {
    setLoading(true);
    dispatch(getZones(values, token)).then((pr) => {
      setZones(pr);
      setLoading(false);
    });
  };

  const handleUpdate = (pr) => {
    setOpen(true);
    setRow(pr);
  };

  const handleDelete = (values) => {
    dispatch(deleteZones(values.id)).then((id) => {
      setZones(removeRow(zones, values.id));
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
  let columns = setColumnsList(confColumns, zones);
  columns = block.concat(columns);

  const inputs = [
    {
      label: "Nombre Zona",
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
    title: "Crear zonas",
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
          dataSource={zones}
          // pagination={pagination}
          loading={loading}
          // onChange={handleTableChange}
          size="middle"
        />
      </section>
    </>
  );
};
