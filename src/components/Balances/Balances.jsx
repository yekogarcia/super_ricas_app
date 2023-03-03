import { Button, Form, Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getZones } from "../../controllers/fetchDynamics";
import { Filters } from "../Filters/Filters";
import { setColumnsList } from "../utils/setColumnsList";
import { setOptionsBlock } from "../utils/setOptionsList";


import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { FormBalance } from "./FormBalance";
import { deleBalanceId, getBalance } from "../../controllers/products";
import { removeRow } from "../utils/rows";

export const Balances = () => {
    const [returns, setReturns] = useState([]);
    const [row, setRow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [zones, setZones] = useState([]);
    const dispatch = useDispatch();
    const [fechaEnd, setFechaEnd] = useState(moment().format("YYYY-MM-DD"));
    const [fechaInit, setFechaInit] = useState(moment().add(-30, 'days').format("YYYY-MM-DD"));


    const [form] = Form.useForm();

    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        onSearch()
        dispatch(getZones("", token)).then((pr) => {
            let options = [{
                key: "TODOS",
                value: "",
                label: "TODOS"
            }];
            for (let i = 0; i < pr.length; i++) {
                options.push(
                    {
                        key: pr[i].id,
                        value: pr[i].id,
                        label: pr[i].nombre
                    })
            }
            setZones(options);
        });
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
            width: "wp-250",
        },
        {
            label: "zona",
            name: "zona",
            filter: "search",
            width: "wp-50",
            visible: false
        },
        {
            label: "Zona",
            name: "zona_text",
            filter: "search",
            width: "wp-250",
        },
        {
            label: "Estado",
            name: "estado",
            filter: "search",
            width: "wp-150",
        },
        {
            label: "Cod Factura",
            name: "cod_factura",
            width: "wp-150",
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
        // console.log(record);
        dispatch(getBalance("", record, token)).then(res => {
            console.log(res);
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
        dispatch(deleBalanceId(record.id, token)).then(res => {
            setReturns(removeRow(returns, record.id));
        });
    }

    const onChangeDates = (record) => {
        if (record) {
            setFechaInit(moment(record[0]["_d"]).format("YYYY-MM-DD"));
            setFechaEnd(moment(record[1]["_d"]).format("YYYY-MM-DD"));
        }
    }

    const prmsFilters = {
        onSearch,
        loading,
        form,
        filters: [
            {
                label: "Buscar",
                name: "buscar",
                type: "search"
            },
            {
                label: "Zonas",
                name: "zona",
                type: "select",
                options: zones
            },
            {
                label: "Estado",
                name: "estado",
                type: "select",
                defaultValue: '',
                options: [
                    {
                        key: 'TODOS',
                        value: '',
                        label: 'TODOS',
                    },
                    {
                        key: 'PENDIENTE',
                        value: 'PENDIENTE',
                        label: 'PENDIENTE',
                    },
                    {
                        key: 'APLICADA',
                        value: 'APLICADA',
                        label: 'APLICADA',
                    }
                ]
            },
            {
                label: "Fechas",
                name: "fechas",
                type: "range_date",
                func: onChangeDates
            }
        ],
    };

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
                        Nuevo
                    </Button>
                    <Filters {...prmsFilters} />
                    <FormBalance
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
