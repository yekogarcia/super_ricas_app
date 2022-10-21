import { Button, Table } from "antd";
import { useState } from "react";
import { Forms } from "../Forms/Forms";
import { setColumnsList } from "../utils/setColumnsList";

export const Zones = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

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
      filter: "order.search",
      width: "wp-300",
    },
    {
      label: "Fecha creación",
      name: "create_datetime",
      filter: "order",
      width: "wp-200",
    },
    {
      label: "Usuario",
      name: "user",
      filter: "order",
      width: "wp-200",
    },
  ];
  let columns = setColumnsList(confColumns, zones);

  const onCreate = (values) => {
    console.log(values);
  };

  const inputs = [
    {
      label: "Nombre Zona",
      name: "nombre",
      width: "100%",
      required: true,
      type: "input",
    }
  ];

  const propsForm = {
    title: "Crear zonas",
    width: "400px",
    open,
    setOpen,
    onCreate,
    inputs
  };


  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
        }}
      >
        Nuevo
      </Button>
      <Forms {...propsForm} />
      <Table
        columns={columns}
        dataSource={zones}
        // pagination={pagination}
        loading={loading}
        // onChange={handleTableChange}
        size="middle"
      />
    </>
  );
};
