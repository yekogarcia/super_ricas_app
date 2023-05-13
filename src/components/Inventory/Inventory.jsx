import { Table, Form, Pagination } from "antd";
import { useState, useEffect } from "react";
import { setColumnsList } from "../utils/setColumnsList";
import { useDispatch, useSelector } from "react-redux";

import { Filters } from "../Filters/Filters";
import { getZoneSales } from "../../controllers/inventory";

import moment from 'moment';

import { formatArrayMoney, formatMoney } from "../utils/utils";

import "../css/style.scss";
import "./Inventory.scss";
import { getZones } from "../../controllers/fetchDynamics";

export const FooterTotSales = ({ total, comision, pendiente }) => {
  return (
    <footer className="sales">
      <b>Valor total: {formatMoney(total)}</b>
      <b>Valor total comisión:  {formatMoney(comision)}</b>
      <b>Valor total pendiente:  {formatMoney(pendiente)}</b>
    </footer>
  )
}

export const Inventory = () => {
  const [loading, setLoading] = useState(false);
  const [invent, setInvent] = useState([]);
  const [zones, setZones] = useState([]);
  const [total, setTotal] = useState(0);
  const [comision, setComision] = useState(0);
  const [pendiente, setPendiente] = useState(0);
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    onSearch();
  }, []);

  useEffect(() => {
    const newZones = [];
    dispatch(getZones("", token)).then((dataZones) => {
      dataZones.map(({ id, nombre }) => {
        newZones.push({ value: id, label: nombre });
      });
      setZones(newZones);
    });
  }, [])

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
      name: "zona_text",
      filter: "search",
      width: "wp-200",
    },
    {
      label: "Fecha ingreso",
      name: "fecha_creacion",
      filter: "search",
      width: "wp-200",
    },
    {
      label: "Valor total",
      name: "precio_total",
      width: "wp-200",
      format: "money",
    },
    {
      label: "Valor comisión",
      name: "valor_comision",
      width: "wp-200",
      format: "money",
    },
    {
      label: "Valor pendiente",
      name: "valor_pendiente",
      width: "wp-250",
      format: "money",
    },

  ];

  let columns = setColumnsList(confColumns, invent);

  const pagination = [];

  const handleTableChange = () => { };

  const onSearch = (values = "") => {
    setLoading(true);
    dispatch(getZoneSales(values, token)).then((res) => {
      let tot = 0;
      let totComi = 0;
      let totPend = 0;
      for (let i = 0; i < res.length; i++) {
        tot += parseFloat(res[i].precio_total)
        totComi += parseFloat(res[i].valor_comision === null ? 0 : res[i].valor_comision);
        totPend += parseFloat(res[i].valor_pendiente === null ? 0 : res[i].valor_pendiente);
      }
      setTotal(tot);
      setComision(totComi);
      setPendiente(totPend);
      setInvent(formatArrayMoney(res, confColumns));
      setLoading(false);
    });
  };
  const [fechaEnd, setFechaEnd] = useState(moment().format("YYYY-MM-DD"));
  const [fechaInit, setFechaInit] = useState(moment().add(-30, 'days').format("YYYY-MM-DD"));

  const onChangeDates = (record) => {
    if (record) {
      setFechaInit(moment(record[0]["_d"]).format("YYYY-MM-DD"));
      setFechaEnd(moment(record[1]["_d"]).format("YYYY-MM-DD"));
    }
  }
  const onChangePagination = (current, pageSize) => {
    console.log(current);
    console.log(pageSize);
  }

  const prmsFilters = {
    onSearch,
    form,
    loading,
    filters: [
      {
        label: "Zonas",
        name: "zonas",
        type: "select",
        options: zones
      },
      {
        label: "Fechas",
        name: "fechas",
        type: "range_date",
        func: onChangeDates
      }
    ],
  };

  return (
    <>
      <section className="contain-table">
        <aside className="head-table">
          <Filters {...prmsFilters} />
        </aside>
        <Table
          bordered
          columns={columns}
          dataSource={invent}
          // pagination={{ simple: "simple", defaultCurrent: 10, total: invent.length }}
          pagination={{
            size: "small",
            total: invent.length,
            showSizeChanger: "showSizeChanger",
            showQuickJumper: "showQuickJumper",
            onShowSizeChange: onChangePagination
          }}
          loading={loading}
          onChange={handleTableChange}
          size="small"
          // footer={() => <FooterTable />}
          footer={() => <FooterTotSales total={total} comision={comision} pendiente={pendiente} />}
        />

      </section>
    </>
  );
};
