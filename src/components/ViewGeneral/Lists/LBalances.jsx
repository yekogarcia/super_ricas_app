import {
    Button,
    Form,
    Input,
    InputNumber,
    message,
    Popconfirm,
    Select,
    Table,
} from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleBalanceDetId, getBalanceProducts, getProductFactBalance, getProductsConcat, getSaldosFact, saveMenu } from "../../../controllers/products";
import { setDataEdit, setEmptyDetails } from "../../../controllers/redux";
import { setColumnsList } from "../../utils/setColumnsList";
import { formatArrayMoney, formatMoney, unformatArrayMoney, unformatMoney } from "../../utils/utils";

export const LBalances = ({ formEnc }) => {
    const [product, setProduct] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const { token } = useSelector((state) => state.auth);
    const { products } = useSelector((state) => state.products);
    const { details } = useSelector((state) => state.empty);
    const { eventEdit } = useSelector((state) => state.edit);
    let dta = eventEdit;

    const { user_login } = useSelector((state) => state.auth);

    let defaultColumns = [
        {
            label: "id",
            name: "id",
            width: "wp-50",
            visible: false
        },
        {
            label: "id_producto",
            name: "producto",
            width: "wp-50",
            visible: false
        },
        {
            label: "Codigo",
            filter: "search",
            width: "wp-90",
            name: "codigo_producto",
        },
        {
            label: "Producto",
            name: "producto_text",
            filter: "search",
            width: "wp-200",
        },
        {
            label: "Cant",
            name: "cantidad",
            width: "wp-50",
            filter: "order",
        },
        {
            label: "Valor",
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
            label: "% IVA",
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
            label: "% Com",
            width: "wp-70",
            name: "porcen_comision",
        },
        {
            label: "comisión",
            name: "valor_comision",
            width: "wp-100",
            filter: "order",
            format: "money",
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
        if (typeof products !== 'undefined') {
            const data = [];
            products.map(({ id, nombre, codigo }) => {
                const nom = codigo + "-" + nombre;
                data.push({ value: id, label: nom });
            });
            setProduct(data);
        }
    }, [products]);

    useEffect(() => {
        setDataSource([]);
        if (dta.id !== "") {
            dispatch(getSaldosFact(dta.codigo, token)).then(res => {
                console.log(res);
                setDataSource(formatArrayMoney(res, defaultColumns));
                setLoading(false);
            });
        }
    }, [dta])

    const calculateValuesHead = (record) => {
        dta.precio_total += unformatMoney(record.precio_total);
        dta.valor_iva += unformatMoney(record.valor_iva);
        dta.valor_venta = dta.valor_iva + dta.precio_total;
        dta.valor_comision += unformatMoney(record.valor_comision);
        dta.total_saldos -= unformatMoney(record.valor_venta);
        dispatch(setDataEdit(dta));
    }

    const handleDelete = (record) => {
        console.log(record);
        if (typeof record.id !== "undefined") {
            dispatch(deleBalanceDetId(record.id, token)).then((res) => {
                const newData = dataSource.filter((item) => item.key !== record.key);
                setDataSource(newData);
                calculateValuesHead(record);
            });
        } else {
            const newData = dataSource.filter((item) => item.key !== record.key);
            setDataSource(newData);
            calculateValuesHead(record);
        }
    };

    let columns = setColumnsList(defaultColumns, dataSource);
    // if (update) {
    columns.push({
        title: "Action",
        dataIndex: "action",
        render: (_, record) =>
            dataSource.length >= 1 ? (
                <Popconfirm
                    title="Esta seguro de eliminar este item?"
                    onConfirm={() => handleDelete(record)}
                >
                    <a>Eliminar</a>
                </Popconfirm>
            ) : null,
    });
    // }


    const handleAdd = (value) => {
        console.log(value);
        console.log(dta);
        if (dta.valor_pendiente <= value.valor_venta) {
            message.warning("El valor total no puede ser mayor al valor pendiente!");
            return;
        }
        const findDt = dataSource.filter(
            (dt) => dt.id_producto === value.id_producto
        );
        if (findDt.length > 0) {
            message.error(
                "Ya existe un producto agregado, no puede agregar el mismo producto!"
            );
        } else {
            if (value.cantidad > 0) {
                const res = products.find(({ id }) => id === value.id_producto)
                console.log(res);

                let precio_total = Math.round(res.precio * value.cantidad);
                let valor_iva = Math.round(
                    (res.precio * value.cantidad * res.iva) / 100
                );
                let valor_comision = Math.round(
                    (res.precio * value.cantidad * res.porcen_comision) / 100
                );
                let valor_venta = Math.round(precio_total + valor_iva);
                dta.total_saldos += valor_venta;
                const newData = {
                    key: res.id,
                    id_producto: res.id,
                    nomb_producto: res.nombre,
                    producto_text: res.nombre,
                    cantidad: value.cantidad,
                    codigo_producto: res.codigo,
                    precio_unidad: formatMoney(res.precio),
                    precio_total: formatMoney(precio_total),
                    iva: res.iva,
                    porcen_comision: res.porcen_comision,
                    valor_iva: formatMoney(valor_iva),
                    valor_comision: formatMoney(valor_comision),
                    valor_venta: formatMoney(valor_venta),
                }
                setDataSource([...dataSource, newData]);
                dta.precio_total -= precio_total;
                dta.valor_iva -= valor_iva;
                dta.valor_pendiente -= valor_iva + precio_total;
                dta.valor_venta = dta.valor_iva + dta.precio_total;
                dta.valor_comision -= valor_comision;
                dispatch(setDataEdit(dta));
                details.balances = true
                dispatch(setEmptyDetails(details));
            } else {
                message.warning("La cantidad tiene que ser mayor a 0!");
            }
        }
        selectRef.current.focus();
        //   form.setFieldValue("cantidad", '');
        form.resetFields();

    };

    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource(newData);
    };

    columns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                typeInput: col.typeInput,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    const selectRef = useRef(null);

    const onChange = (value) => {
        console.log(value);
    };
    const onSearch = (value) => { };

    const handleSaveBalances = () => {
        // console.log(defaultColumns);
        let data = { ...dta };
        data.saldos = unformatArrayMoney(dataSource, defaultColumns);
        console.log(data);
        dispatch(saveMenu(data, token)).then(res => {
            if (res) {
                dta.id = res;
                dispatch(setDataEdit(dta));
                formEnc.setFieldValue("id", res);
                details.balances = false;
                dispatch(setEmptyDetails(details));
            }
        });
    }
    return (
        <div>
            {/* {update ? ( */}
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
                        display: "inline-block",
                        width: "calc(30% - 8px)",
                        margin: "0px 4px 16px 4px",
                    }}
                    name="id_producto"
                    label="Producto"
                    rules={[
                        {
                            required: true,
                            message: "Por favor ingrese un valor!",
                        },
                    ]}
                >
                    <Select
                        loading={loading}
                        disabled={loading}
                        className="select_produ"
                        ref={selectRef}
                        onChange={onChange}
                        showSearch
                        optionFilterProp="children"
                        onSearch={onSearch}
                        filterOption={(input, option) =>
                            (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        }
                        // filterOption={(input, option) =>
                        //   (option?.value.toString() ?? 0).includes(input)
                        // }
                        options={product}
                    />
                </Form.Item>
                <Form.Item
                    style={{
                        display: "inline-block",
                        width: "calc(20% - 8px)",
                        margin: "0px 4px 16px 4px",
                    }}
                    name="cantidad"
                    label="Cantidad"
                    rules={[
                        {
                            required: true,
                            message: "Por favor ingrese un valor!",
                        },
                    ]}
                >
                    <InputNumber parser={(value) => value.replace(/\$\s?|(,*)/g, "")} />
                </Form.Item>
                <Button
                    onClick={() => {
                        form
                            .validateFields()
                            .then((values) => {
                                handleAdd(values);
                            })
                            .catch((info) => {
                                console.log("Validate Failed:", info);
                            });
                    }}
                    type="primary"
                    style={{
                        marginBottom: 0,
                        marginTop: 31,
                    }}
                >
                    Agregar
                </Button>
            </Form>
            {/* ) : (
                ""
            ) */}
            {/* } */}
            <Table
                bordered
                dataSource={dataSource}
                columns={columns}
                loading={loading}
                size="small"
            />
            <Button type="primary" onClick={handleSaveBalances}>Guardar Saldos</Button>
        </div>
    );
};
