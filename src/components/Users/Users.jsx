import { Button, Table } from "antd";
import { useState, useEffect } from "react";
import { setColumnsList } from "../utils/setColumnsList";
import { useDispatch, useSelector } from "react-redux";

import { Filters } from "../Filters/Filters";
import { setOptionsBlock } from "../utils/setOptionsList";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { removeRow } from "../utils/rows";
import { FormUser } from "./FormUser";
import { getUsers } from "../../controllers/fetchDynamics";

// import "../css/style.scss";

export const Users = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [row, setRow] = useState(false);
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();

  const { token, user_login } = useSelector((state) => state.auth);

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
      name: "name",
      filter: "search",
      width: "wp-150"
    },
    {
      label: "Usuario",
      name: "user_login",
      filter: "search",
      width: "wp-100",
    },
    {
      label: "Email",
      name: "email",
      filter: "search",
      width: "wp-150",
    },
    {
      label: "Perfil",
      name: "perfil",
      width: "wp-100",
      filter: "search",
    },
    {
      label: "Celuar",
      name: "cell_phone",
      filter: "order",
      width: "wp-100",
    },
    {
      label: "Estado",
      name: "state",
      width: "wp-100",
      filter: "order",
    },
    {
      label: "Photo",
      name: "photo",
      width: "wp-150",
    },
    {
      label: "Fecha creación",
      name: "create_datetime",
      width: "wp-200",
      filter: "order",
    },
  ];

  const handleUpdate = (values) => {
    setOpen(true);
    setRow(values);
  };

  const handleDelete = (values) => {
    // dispatch(deleteProducts(values.id)).then((pr) => {
    //   setProducts(removeRow(products, values.id));
    // });
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
    dispatch(getUsers(values, token)).then((pr) => {
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
