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
import { deleteRowInventoryDetId, getInventoryDet } from "../../../controllers/inventory";
import { getBalanceProducts, getProductsConcat, getProductsId, saveMenu } from "../../../controllers/products";
import { setDataEdit, setEmptyDetails } from "../../../controllers/redux";
import { setColumnsList } from "../../utils/setColumnsList";
import { formatArrayMoney, formatMoney, unformatArrayMoney, unformatMoney } from "../../utils/utils";

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = (props) => {
    const {
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        typeInput,
        ...restProps
    } = props;

    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);

    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };
    const dispatch = useDispatch();
    const { eventEdit } = useSelector((state) => state.edit);
    const save = async () => {
        try {
            let dta = eventEdit;
            const values = await form.validateFields();
            toggleEdit();
            if (typeof values.cantidad !== "undefined") {
                // console.log(record);
                // console.log(values);
                let precio_total_ant = Math.round(unformatMoney(record.precio_unidad) * parseInt(record.cantidad));
                dta.precio_total -= precio_total_ant;
                dta.valor_iva -= Math.round((precio_total_ant * record.iva) / 100);
                dta.valor_comision -= Math.round((precio_total_ant * record.porcen_comision) / 100);
                dta.valor_venta -= Math.round(precio_total_ant + Math.round((precio_total_ant * record.iva) / 100));

                record.precio_total = Math.round(
                    unformatMoney(record.precio_unidad) * values.cantidad
                );
                record.valor_iva = Math.round((record.precio_total * record.iva) / 100);
                record.valor_comision = Math.round(
                    (record.precio_total * record.porcen_comision) / 100
                );
                record.valor_venta = Math.round(record.precio_total + record.valor_iva);

                dta.precio_total += parseFloat(record.precio_total);
                dta.valor_iva += parseFloat(record.valor_iva);
                dta.valor_comision += parseFloat(record.valor_comision);
                dta.valor_venta += parseFloat(record.valor_venta);
                dta.valor_pendiente = dta.valor_venta - dta.valor_ingresos;

                record.precio_total = formatMoney(record.precio_total);
                record.valor_iva = formatMoney(record.valor_iva);
                record.valor_comision = formatMoney(record.valor_comision);
                record.valor_venta = formatMoney(record.valor_venta);

                // console.log(dta);
                dispatch(setDataEdit(dta));
            }

            handleSave({
                ...record,
                ...values,
            });

        } catch (errInfo) {
            console.log("Save failed:", errInfo);
        }
    };

    let childNode = children;
    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} es requerido.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 0,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }
    return <td {...restProps}>{childNode}</td>;
};

export const LProducts = ({ formEnc }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.products);
    const { details } = useSelector((state) => state.empty);
    const { eventEdit } = useSelector((state) => state.edit);
    const dta = eventEdit;
    // console.log(details);

    let defaultColumns = [
        {
            label: "Id",
            name: "id",
            width: "wp-50",
            // visible: false,
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
            width: "wp-70",
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
            width: "wp-50",
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
            width: "wp-70",
            name: "porcen_comision",
        },
        {
            label: "Valor comisión",
            name: "valor_comision",
            width: "wp-100",
            filter: "order",
            format: "money",
        },
        // {
        //     label: "Cantidad salida",
        //     name: "cantidad_salida",
        //     width: "wp-100",
        //     filter: "order",
        //     visible: visible,
        //     editable: true,
        // },
        {
            label: "Total",
            name: "valor_venta",
            width: "wp-150",
            filter: "order",
            format: "money",
        },
    ];



    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const { token } = useSelector((state) => state.auth);
    const [product, setProduct] = useState([]);


    useEffect(() => {
        setDataSource([]);
        if (dta.id !== "") {
            setLoading(true);
            dispatch(getInventoryDet("", token, dta.id)).then(function (res) {
                console.log(res);
                setDataSource(formatArrayMoney(res, defaultColumns));
                setLoading(false);
            });
        }
    }, [dta])


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



    const handleDelete = (record) => {
        // console.log(record);
        dta.precio_total -= unformatMoney(record.precio_total);
        dta.valor_iva -= unformatMoney(record.valor_iva);
        dta.valor_comision -= unformatMoney(record.valor_comision);
        dta.valor_venta -= unformatMoney(record.valor_venta);
        dta.valor_pendiente = dta.valor_venta - dta.valor_ingresos;
        if (typeof record.id !== "undefined") {
            dispatch(deleteRowInventoryDetId(record.id, token)).then((res) => {
                const newData = dataSource.filter((item) => item.key !== record.key);
                setDataSource(newData);
                dispatch(setDataEdit(dta));
            });
        } else {
            const newData = dataSource.filter((item) => item.key !== record.key);
            setDataSource(newData);
            dispatch(setDataEdit(dta));
        }
    };

    let columns = setColumnsList(defaultColumns, dataSource);
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

    const handleAdd = (value) => {
        // dispatch(getProductsId(value.id_producto, token)).then((res) => {
        //   console.log(res);
        //   console.log(value);
        const res = products.filter(products => products.id === value.id_producto);
        // console.log(res)
        if (res.length > 0) {
            const findDt = dataSource.filter(
                (dt) => dt.id_producto === value.id_producto
            );
            if (findDt.length > 0) {
                message.error(
                    "Ya existe un producto agregado, no puede agregar el mismo producto!"
                );
            } else {
                if (value.cantidad > 0) {

                    let precio_total = Math.round(res[0].precio * value.cantidad);
                    let valor_iva = Math.round(
                        (res[0].precio * value.cantidad * res[0].iva) / 100
                    );
                    let valor_comision = Math.round(
                        (res[0].precio * value.cantidad * res[0].porcen_comision) / 100
                    );
                    let valor_venta = Math.round(precio_total + valor_iva);
                    dta.precio_total += precio_total;
                    dta.valor_iva += valor_iva;
                    dta.valor_comision += valor_comision;
                    dta.valor_venta += valor_venta;
                    dta.valor_pendiente += dta.valor_venta - dta.valor_ingresos;

                    const newData = {
                        key: res[0].id,
                        id_producto: res[0].id,
                        nomb_producto: res[0].nombre,
                        cantidad: value.cantidad,
                        codigo_producto: res[0].codigo,
                        precio_unidad: formatMoney(res[0].precio),
                        precio_total: formatMoney(precio_total),
                        iva: res[0].iva,
                        porcen_comision: res[0].porcen_comision,
                        valor_iva: formatMoney(valor_iva),
                        valor_comision: formatMoney(valor_comision),
                        valor_venta: formatMoney(valor_venta),
                    };
                    setDataSource([...dataSource, newData]);
                    dispatch(setDataEdit(dta));
                    details["products"] = true;
                    dispatch(setEmptyDetails(details));
                } else {
                    message.warning("La cantidad tiene que ser mayor a 0!");
                }
            }
            selectRef.current.focus();
            //   form.setFieldValue("cantidad", '');
            form.resetFields();
        }

        // });
    };


    const handleApplySaldos = () => {
        if (dta.zona !== 0) {
            dispatch(getBalanceProducts("", { id_zona: dta.zona }, token)).then(res => {
                console.log(res);
                setDataSource(formatArrayMoney(res, defaultColumns));
            });
        } else {
            message.error("Debe seleccionar una zona");
        }
    }

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
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
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

    const handleSaveProducts = () => {
        let data = { ...dta };
        const dt = unformatArrayMoney(dataSource, defaultColumns);
        data.productos = dt;
        console.log(data);
        dispatch(saveMenu(data, token)).then(res => {
            if (res) {
                console.log(res);
                dta.id = res;
                dispatch(setDataEdit(dta));
                formEnc.setFieldValue("id", res);
                dispatch(getInventoryDet("", token, dta.id)).then(function (res) {
                    setDataSource(formatArrayMoney(res, defaultColumns));
                });
                details.products = false
                dispatch(setEmptyDetails(details));
            }
        });
    }

    return (
        <div>
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
                        width: "calc(30% - 8px)",
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
                    Agregar producto
                </Button>
                {dta.id === "" ?
                    <Button
                        onClick={handleApplySaldos}
                        type="primary"
                        style={{
                            marginBottom: 0,
                            marginTop: 31,
                            marginLeft: 10,
                        }}
                    >
                        Aplicar saldos
                    </Button>
                    : ""}
            </Form>
            <Table
                components={components}
                rowClassName={() => "editable-row"}
                bordered
                dataSource={dataSource}
                columns={columns}
                loading={loading}
                size="small"
            />
            <Button type="primary" onClick={handleSaveProducts}>Guardar productos</Button>
        </div>
    );
};
