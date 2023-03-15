import { Button, Form, Table } from "antd"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
// import { deleteReturns, getReturns } from "../../controllers/products";
// import { setColumnsList } from "../utils/setColumnsList";
// import { setOptionsBlock } from "../utils/setOptionsList";
// import { FormReturns } from "./FormReturns";

import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import { removeRow } from "../utils/rows";
import moment from "moment";
import { setOptionsBlock } from "../../utils/setOptionsList";
import { setColumnsList } from "../../utils/setColumnsList";
import { deleteReturns, getReturns } from "../../../controllers/products";
import { removeRow } from "../../utils/rows";
import { FormReturns } from "../../Returns/FormReturns";
// import { getZones } from "../../controllers/fetchDynamics";


export const Ldevolutions = () => {
  const [returns, setReturns] = useState([]);
  const [row, setRow] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [zones, setZones] = useState([]);
  const dispatch = useDispatch();
  const [fechaEnd, setFechaEnd] = useState(moment().format("YYYY-MM-DD"));
  const [fechaInit, setFechaInit] = useState(moment().add(-30, 'days').format("YYYY-MM-DD"));


  const [form] = Form.useForm();

  const { token } = useSelector((state) => state.auth);

//   useEffect(() => {
//     onSearch()
//     dispatch(getZones("", token)).then((pr) => {
//       let options = [{
//         key: "TODOS",
//         value: "",
//         label: "TODOS"
//       }];
//       for (let i = 0; i < pr.length; i++) {
//         options.push(
//           {
//             key: pr[i].id,
//             value: pr[i].id,
//             label: pr[i].nombre
//           })
//       }
//       setZones(options);
//     });
//   }, [])


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
      width: "wp-150",
    },
    {
      label: "Tipo",
      name: "tipo_devolucion",
      filter: "search",
      width: "wp-150",
    },
    {
      label: "Id Zona",
      name: "id_zona",
      width: "wp-50",
      visible: false
    },
    {
      label: "Estado",
      name: "estado",
      filter: "search",
      width: "wp-100",
    },
    {
      label: "Zona",
      name: "zona_text",
      filter: "search",
      width: "wp-200",
    },
    {
      label: "Id prodducto",
      name: "id_producto",
      filter: "search",
      width: "wp-50",
      visible: false
    },
    {
      label: "Producto",
      name: "producto_text",
      filter: "search",
      width: "wp-200",
    },
    {
      label: "Cantidad",
      name: "cantidad",
      width: "wp-100",
      filter: "order",
    },
    {
      label: "No Fact",
      name: "num_factura",
      width: "wp-100",
      filter: "order",
    },
  ];

  const contextMenu = (record) => {
    return (
      <div className="options">
        {record.estado !== 'APLICADA' ?
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
          : ""}
      </div>
    );
  };
  const block = setOptionsBlock(contextMenu);

  defaultColumns = setColumnsList(defaultColumns, returns);
  defaultColumns = block.concat(defaultColumns);


  const onSearch = (record) => {
    setLoading(true);

    console.log(record);
    dispatch(getReturns("", record, token)).then(res => {
      // console.log(res);
      setReturns(res);
      setLoading(false);
    });
  }

  const handleUpdate = (record) => {
    setOpen(true);
    setRow(record)
  }


  const handleDelete = record => {
    // console.log(record);
    dispatch(deleteReturns(record.id, token)).then(res => {
      setReturns(removeRow(returns, record.id));
    });
  }

  const onChangeDates = (record) => {
    if (record) {
      setFechaInit(moment(record[0]["_d"]).format("YYYY-MM-DD"));
      setFechaEnd(moment(record[1]["_d"]).format("YYYY-MM-DD"));
    }
  }

 
  setTimeout(function () {
    form.setFieldValue("fechas", [moment(fechaInit, "YYYY-MM-DD"), moment(fechaEnd, "YYYY-MM-DD")]);
  }, 500);

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
            Agregar devolución
          </Button>
          {/* <FormReturns
            open={open} setOpen={setOpen} token={token} row={row} setRow={setRow}
            onSearch={onSearch} /> */}
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
