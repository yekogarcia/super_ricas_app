import { Button, Table } from "antd";
import { useState } from "react";
import { setColumnsList } from "../utils/setColumnsList";
import { FormProducts } from "./FormProducts";

import "./Products.scss";

export const Products = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // setLoading(false);

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
      filter: "order.search",
      width: "wp-300",
    },
    {
      label: "Estado",
      name: "estado",
      filter: "order",
      width: "wp-300",
    },
    {
      label: "Id categoria",
      name: "id_categoria",
      width: "wp-300",
      filter: "order.search",
    },
    {
      label: "Código de barras",
      name: "codigo_barras",
      width: "wp-300",
      filter: "order.search",
    },
    {
      label: "Precio",
      name: "precio",
      width: "wp-300",
      filter: "order.search",
    },
    {
      label: "% Comisión",
      name: "porcen_comision",
      width: "wp-300",
      filter: "order.search",
    },
    {
      label: "IVA",
      name: "iva",
      width: "wp-300",
      filter: "order.search",
    },
    {
      label: "Factor",
      name: "factor",
      width: "wp-300",
      filter: "order.search",
    },
    {
      label: "Unidad de medida",
      name: "unidad_medida",
      width: "wp-300",
      filter: "order.search",
    },
  ];

  const data = [];

  let columns = setColumnsList(confColumns, data);

  const pagination = [];

  const handleTableChange = () => {};

  return (
    <>
      <section className="products">
        <aside>
          <Button
            type="primary"
            onClick={() => {
              setOpen(true);
            }}
          >
            Nuevo
          </Button>
        </aside>
        <FormProducts open={open} setOpen={setOpen} />
        <Table
          columns={columns}
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          size="middle"
        />
      </section>
    </>
  );
};
