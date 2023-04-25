import { DatePicker, Form, Input, InputNumber, message, Modal, Select } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getZones } from '../../controllers/fetchDynamics';
import { getProductsAll } from '../../controllers/products';
import { setDataEdit, setProductAll } from '../../controllers/redux';
const { Option } = Select;

export const FormHead = ({ form, row, visible }) => {

    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const { eventEdit, editable } = useSelector((state) => state.edit);
    let dta = eventEdit;
    // const [dataFact, setDataFact] = useState({});

    editable ? form.setFieldsValue(eventEdit) : form.setFieldsValue({});

    const [enabled, setEnabled] = useState(false);
    const [zones, setZones] = useState([]);
    const [fecha, setFecha] = useState(moment().format("YYYY-MM-DD"));
    // const [dataSource, setDataSource] = useState([]);
    // const [loading, setLoading] = useState(false);


    let defaultColumns = [
        {
            label: "Id",
            name: "id",
            width: "wp-50",
            visible: false,
        },
        {
            label: "Producto",
            name: "id_producto",
            width: "wp-100",
            visible: false,
        },
        {
            label: "Codigo",
            filter: "search",
            width: "wp-90",
            name: "codigo_producto",
        },
        {
            label: "Producto",
            name: "nomb_producto",
            filter: "search",
            width: "wp-200",
        },
        {
            label: "Cant",
            name: "cantidad",
            width: "wp-50",
            filter: "order",
            editable: true,
        },
        {
            label: "Valor unitario",
            width: "wp-100",
            name: "precio_unidad",
            format: "money",
        },
        {
            label: "Subtotal",
            width: "wp-100",
            name: "precio_total",
            format: "money",
        },
        {
            label: "IVA",
            width: "wp-70",
            name: "iva",
        },
        {
            label: "Valor IVA",
            name: "valor_iva",
            width: "wp-100",
            filter: "order",
            format: "money",
        },
        {
            label: "Comisión",
            width: "wp-100",
            name: "porcen_comision",
        },
        {
            label: "Valor comisión",
            name: "valor_comision",
            width: "wp-100",
            filter: "order",
            format: "money",
        },
        {
            label: "Cantidad salida",
            name: "cantidad_salida",
            width: "wp-100",
            filter: "order",
            visible: visible,
            editable: true,
        },
        {
            label: "Total",
            name: "valor_venta",
            width: "wp-150",
            filter: "order",
            format: "money",
        },
    ];

    useEffect(() => {
        dta.id === "" ? setEnabled(false) : setEnabled(true);
    }, [dta.id])


    useEffect(() => {
        dispatch(getZones("", token)).then((pr) => {
            setZones(pr);
        });
        dispatch(getProductsAll("", token)).then((pr) => {
            dispatch(setProductAll(pr));
        });
    }, []);

    const initData = () => {
        const valFields = form.getFieldsValue();
        const [{ nombre }] = zones.filter(({ id }) => id === valFields.id_zona);
        valFields.precio_total = 0;
        valFields.valor_iva = 0;
        valFields.valor_venta = 0;
        valFields.valor_comision = 0;
        valFields.valor_pendiente = valFields.saldo_base;
        valFields.valor_ingresos = 0;
        valFields.valor_descuento = 0;
        valFields.valor_fiado = 0;
        valFields.total_saldos = 0;
        valFields.total_devoluciones = 0;
        valFields.zona_text = nombre;
        dispatch(setDataEdit(valFields));
    }

    const onChageDate = (value) => {
        setFecha(moment(value["_d"]).format("YYYY-MM-DD"));
        initData();
    };

    const onChageSaldo = () => {
        const valFields = form.getFieldsValue();
        dta.valor_pendiente -= dta.saldo_base;
        dta.saldo_base = valFields.saldo_base;
        dta.valor_pendiente += valFields.saldo_base;
        dispatch(setDataEdit(dta));
    }

    const onChageZona = () => {
        initData();
    }

    const onChageNoFact = () => {
        initData();
    }

    setTimeout(function () {
        if (!row) {
            // form.setFieldsValue(dataFact);
            form.setFieldValue("fecha_dia", moment(fecha, "YYYY-MM-DD"));
        }
    }, 500);
    return <>
        <Form
            form={form}
            layout="vertical"
            name="form_in_modal"
            initialValues={{
                modifier: "public",
            }}
        >
            <Form.Item
                style={{
                    display: "none",
                    width: "calc(20% - 8px)",
                    margin: "0px 4px 16px 4px",
                }}
                name="id"
                label="Id"
            >
                <Input />
            </Form.Item>
            <Form.Item
                style={{
                    display: "inline-block",
                    width: "calc(20% - 8px)",
                    margin: "0px 4px 16px 4px",
                }}
                name="fecha_dia"
                label="Fecha / Día"
                rules={[
                    {
                        required: true,
                        message: "Por favor ingrese un valor!",
                    },
                ]}
            >
                <DatePicker onChange={onChageDate} />
            </Form.Item>
            <Form.Item
                style={{
                    display: "inline-block",
                    width: "calc(25% - 8px)",
                    margin: "0px 4px 16px 4px",
                }}
                name="id_zona"
                label="Zona"
                rules={[
                    {
                        required: true,
                        message: "Por favor ingrese un valor!",
                    },
                ]}
            >
                <Select disabled={enabled} onBlur={onChageZona}>
                    {zones.map(({ id, nombre }) => (
                        <Option value={id} key={id}>
                            {nombre}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                style={{
                    display: "inline-block",
                    width: "calc(20% - 8px)",
                    margin: "0px 4px 16px 4px",
                }}
                name="codigo"
                label="Codigo factura"
                rules={[
                    {
                        required: true,
                        message: "Por favor ingrese un valor!",
                    },
                ]}
            >
                <Input disabled={enabled} onBlur={onChageNoFact} />
            </Form.Item>
            <Form.Item
                style={{
                    display: "inline-block",
                    width: "calc(20% - 8px)",
                    margin: "0px 4px 16px 4px",
                }}
                name="saldo_base"
                label="Saldo base"
            >
                <InputNumber onBlur={onChageSaldo}
                    formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
            </Form.Item>
            <Form.Item
                style={{
                    display: "inline-block",
                    width: "calc(20% - 8px)",
                    margin: "0px 4px 16px 4px",
                }}
                name="precio_total"
                label="Subtotal"
            >
                <InputNumber disabled
                    formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
            </Form.Item>
            <Form.Item
                style={{
                    display: "inline-block",
                    width: "calc(20% - 8px)",
                    margin: "0px 4px 16px 4px",
                }}
                name="valor_iva"
                label="Total iva"
            >
                <InputNumber disabled
                    formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
            </Form.Item>
            <Form.Item
                style={{
                    display: "inline-block",
                    width: "calc(20% - 8px)",
                    margin: "0px 4px 16px 4px",
                }}
                name="valor_venta"
                label="Total"
            >
                <InputNumber disabled
                    formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
            </Form.Item>
            <Form.Item
                style={{
                    display: "inline-block",
                    width: "calc(20% - 8px)",
                    margin: "0px 4px 16px 4px",
                }}
                name="valor_comision"
                label="Comisión"
            >
                <InputNumber disabled
                    formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
            </Form.Item>
            <Form.Item
                style={{
                    display: "inline-block",
                    width: "calc(20% - 8px)",
                    margin: "0px 4px 16px 4px",
                }}
                name="valor_ingresos"
                label="Ingresos"
            >
                <InputNumber disabled
                    formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
            </Form.Item>
            <Form.Item
                style={{
                    display: "inline-block",
                    width: "calc(20% - 8px)",
                    margin: "0px 4px 16px 4px",
                }}
                name="valor_pendiente"
                label="Valor pendiente"
            >
                <InputNumber disabled
                    formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
            </Form.Item>
            <Form.Item
                style={{
                    display: "inline-block",
                    width: "calc(20% - 8px)",
                    margin: "0px 4px 16px 4px",
                }}
                name="valor_descuento"
                label="Descuentos"
            >
                <InputNumber disabled
                    formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
            </Form.Item>
            <Form.Item
                style={{
                    display: "inline-block",
                    width: "calc(20% - 8px)",
                    margin: "0px 4px 16px 4px",
                }}
                name="valor_fiado"
                label="Valor fiado"
            >
                <InputNumber disabled
                    formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
            </Form.Item>
            <Form.Item
                style={{
                    display: "inline-block",
                    width: "calc(20% - 8px)",
                    margin: "0px 4px 16px 4px",
                }}
                name="total_saldos"
                label="Total saldos"
            >
                <InputNumber disabled
                    formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
            </Form.Item>
            <Form.Item
                style={{
                    display: "inline-block",
                    width: "calc(20% - 8px)",
                    margin: "0px 4px 16px 4px",
                }}
                name="total_devoluciones"
                label="Total devoluciones"
            >
                <InputNumber disabled
                    formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
            </Form.Item>
        </Form>
    </>
}
