import { Button, Form, Popconfirm, Table } from "antd";
import { useState, useEffect } from "react";
import { setColumnsList } from "../utils/setColumnsList";
import { useDispatch, useSelector } from "react-redux";

import { Filters } from "../Filters/Filters";
import { setOptionsBlock } from "../utils/setOptionsList";
import {
  EditOutlined,
  DeleteOutlined,
  PrinterOutlined,
  CheckOutlined,
  FileAddOutlined,
  FullscreenOutlined
} from "@ant-design/icons";
import { removeRow } from "../utils/rows";
import { deleteRowInventory, getInventory } from "../../controllers/inventory";

import "./InputsAndOutputs.scss";
import "../css/style.scss";
import { FormInputsAndOutputs } from "./FormInputsAndOutputs";
import { FormPayments } from "../Paymets/FormPayments";
import { formatArrayMoney, unformatArrayMoney, unformatMoney } from "../utils/utils";
import { PaymentComission } from "../Paymets/PaymentComission";
import moment from "moment";
import { ApplyDevolution } from "../ApplyDevolution./ApplyDevolution";
import { ViewGeneral } from "../ViewGeneral/ViewGeneral";
import { setDataEdit } from "../../controllers/redux";

export const InputsAndOutputs = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openPay, setOpenPay] = useState(false);
  const [row, setRow] = useState(false);
  const [rowIn, setRowIn] = useState(false);
  const [visible, setVisible] = useState(false);
  const [update, setUpdate] = useState(true);
  const [visualize, setVisualize] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [invent, setInvent] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenApplyDev, setIsOpenApplyDev] = useState(false);
  const [fechaEnd, setFechaEnd] = useState(moment().format("YYYY-MM-DD"));
  const [fechaInit, setFechaInit] = useState(moment().add(-30, 'days').format("YYYY-MM-DD"));


  const [form] = Form.useForm();

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
      label: "Codigo factura",
      name: "codigo",
      filter: "search",
      width: "wp-100",
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
      width: "wp-180",
    },
    {
      label: "Fecha ingreso",
      name: "fecha_dia",
      filter: "search",
      width: "wp-150",
    },
    {
      label: "Estado",
      name: "estado",
      filter: "search",
      width: "wp-100",
    },
    {
      label: "Subtotal",
      name: "precio_total",
      width: "wp-120",
      format: "money",
    },
    {
      label: "Total IVA",
      name: "valor_iva",
      width: "wp-120",
      format: "money",
    },
    {
      label: "Total",
      name: "valor_venta",
      width: "wp-120",
      format: "money",
    },
    {
      label: "Total comisión",
      name: "valor_comision",
      width: "wp-150",
      format: "money",
    },
    {
      label: "Valor ingresos",
      name: "valor_ingresos",
      width: "wp-150",
      format: "money",
    },
    {
      label: "Valor pendiente",
      name: "valor_pendiente",
      width: "wp-150",
      format: "money",
    },
    {
      label: "Saldo base",
      name: "saldo_base",
      width: "wp-100",
      format: "money",
    },
    {
      label: "Total descuento",
      name: "valor_descuento",
      width: "wp-100",
      format: "money",
    },
    {
      label: "Valor Fiado",
      name: "valor_fiado",
      width: "wp-100",
      format: "money",
    },
    {
      label: "Total saldos",
      name: "total_saldos",
      width: "wp-150",
      format: "money",
    },
    {
      label: "Total devoluciones",
      name: "total_devoluciones",
      width: "wp-150",
      format: "money",
    },
  ];

  const handleUpdate = (values) => {
    // if (values.estado !== "INGRESADA") {
    //   setUpdate(false);
    // }
    console.log(values);
    setOpenView(true)
    let vals = unformatArrayMoney([values], confColumns);
    vals[0].fecha_dia = moment(vals[0].fecha_dia, "YYYY-MM-DD")
    console.log(vals);
    dispatch(setDataEdit(vals[0]));
  };

  const handleOutputs = (values) => {
    // setOpen(true);
    // setRow(values);
    // setUpdate(false);
    // setVisible(true);

  };

  const handleDelete = (values) => {
    dispatch(deleteRowInventory(values.id, token)).then((pr) => {
      setInvent(removeRow(invent, values.id));
      setShowConfirm(false);
    });
  };

  const handlePrint = (values) => {
    // setOpen(true);
    setRow(values);
  };
  const handleApply = (values) => {
    setIsOpenApplyDev(true)
    setRowIn(values);
  };
  const handleAddPay = (values) => {
    setOpenPay(true);
    values.valor_venta = unformatMoney(values.valor_venta);
    values.valor_ingresos = unformatMoney(values.valor_ingresos);
    setRowIn(values);
  };

  const showModal = (record) => {
    setIsModalOpen(true);
    record.valor_venta = unformatMoney(record.valor_venta);
    record.valor_ingresos = unformatMoney(record.valor_ingresos);
    record.valor_comision = unformatMoney(record.valor_comision);
    setRowIn(record);
  };

  const contextMenu = (record) => {
    const vp = unformatMoney(record.valor_pendiente);
    return (
      <div className="options">
        {record.estado === "INGRESADA" ? (
          <div>
            <a onClick={() => handleUpdate(record)}>
              <EditOutlined />
              Editar
            </a>
            {/* <a onClick={() => handleDelete(record)}> */}
            <Popconfirm
              title="¿Esta seguro de elimar este registro?"
              open={showConfirm}
              placement="right"
              onConfirm={() => {
                handleDelete(record);
              }}
              onCancel={() => {
                setShowConfirm(false);
              }}
            >
              <a
                onClick={() => {
                  setShowConfirm(true);
                }}
              >
                <DeleteOutlined />
                Eliminar
              </a>
            </Popconfirm>
            {/* <a onClick={() => handleAddPay(record)}>
              <FileAddOutlined />
              Agregar ingresos
            </a>
            <a onClick={() => handleApply(record)}>
              <FileAddOutlined />
              Aplicar devoluciones
            </a>
            <a onClick={() => showModal(record)}>
              <FileAddOutlined />
              Pagar comisión diaria
            </a>
            {vp <= 0 ?
              <a onClick={() => handlePrint(record)}>
                <CheckOutlined />
                Finalizar
              </a> */}
              {/* : ""} */}
          </div>
        ) : (
          <div>
            {/* <a onClick={() => handlePrint(record)}>
              <FullscreenOutlined />
              Ver Ingresos
            </a>
            <a onClick={() => handlePrint(record)}>
              <FullscreenOutlined />
              Ver Detalles
            </a> */}
          </div>
        )}
        {/* <div>
          <a onClick={() => handlePrint(record)}>
            <PrinterOutlined />
            Imprimir
          </a>
        </div>
        <div>
          <a onClick={() => handlePrint(record)}>
            <PrinterOutlined />
            Vista general
          </a>
        </div> */}
      </div>
    );
  };

  const block = setOptionsBlock(contextMenu);
  let columns = setColumnsList(confColumns, invent);
  columns = block.concat(columns);


  // columns.push({
  //   title: "Imprimir",
  //   dataIndex: "imprimir",
  //   className: "wp-100",
  //   render: (_, record) =>
  //     invent.length >= 1 ? (
  //       <a onClick={() => handlePrint(record)}>Imprimir</a>
  //     ) : null,
  // });

  const pagination = [];

  const handleTableChange = () => { };

  const onSearch = (values = "") => {
    // console.log(values);
    setLoading(true);
    dispatch(getInventory(values, token)).then((res) => {
      setInvent(formatArrayMoney(res, confColumns));
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
    onSearch,
  };

  const prmsPays = {
    openPay,
    setOpenPay,
    setRowIn,
    rowIn,
    invent,
    setInvent,
    visualize,
    onSearch,
  };


  const onChangeDates = (record) => {
    if (record) {
      setFechaInit(moment(record[0]["_d"]).format("YYYY-MM-DD"));
      setFechaEnd(moment(record[1]["_d"]).format("YYYY-MM-DD"));
    }
  }

  const prmsFilters = {
    onSearch,
    form,
    loading,
    filters: [
      {
        label: "Buscar",
        name: "buscar",
        type: "search"
      },
      {
        label: "Fechas",
        name: "fechas",
        type: "range_date",
        func: onChangeDates
      }
    ],
  };

  const openFormViewGeneral = () => {
    dispatch(setDataEdit({
      id: '',
      fecha: moment().format("YYYY-MM-DD"),
      id_zona: '',
      codigo: '',
      saldo_base: 0,
      precio_total: 0,
      valor_iva: 0,
      valor_venta: 0,
      valor_comision: 0,
      valor_pendiente: 0,
      valor_ingresos: 0,
      valor_descuento: 0,
      valor_fiado: 0,
      total_saldos: 0,
      total_devoluciones: 0
    }));
    setOpenView(true)
    // setOpen(true);
    setUpdate(true);
    setVisible(false);
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
              openFormViewGeneral()
            }}
          >
            Nuevo
          </Button>
          <Filters {...prmsFilters} />
        </aside>
        <FormInputsAndOutputs {...prmsForm} />
        <FormPayments {...prmsPays} />
        <PaymentComission
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setRowIn={setRowIn}
          rowIn={rowIn} />
        <ApplyDevolution
          isOpenApplyDev={isOpenApplyDev}
          setIsOpenApplyDev={setIsOpenApplyDev}
          token={token}
          setRowIn={setRowIn}
          rowIn={rowIn}
        />
        <ViewGeneral
          openView={openView}
          setOpenView={setOpenView}
          onSearch={onSearch}
        />
        <Table
          columns={columns}
          dataSource={invent}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          size="small"
          bordered
        />
      </section>
    </>
  );
};
