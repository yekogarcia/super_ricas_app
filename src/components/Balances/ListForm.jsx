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
import { deleteRowInventoryDetId } from "../../controllers/inventory";
import { deleBalanceDetId, deleBalanceId, getProductsConcat, getProductsId } from "../../controllers/products";
import { setColumnsList } from "../utils/setColumnsList";
import { formatMoney, unformatMoney } from "../utils/utils";

export const ListForm = ({
    defaultColumns,
    dataSource,
    setDataSource,
    loading,
    products,
    datProd,
    update,
    visible,
}) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const { token } = useSelector((state) => state.auth);

   

    const handleDelete = (record) => {
        console.log(record);
        if (typeof record.id !== "undefined") {
            dispatch(deleBalanceDetId(record.id, token)).then((res) => {
                const newData = dataSource.filter((item) => item.key !== record.key);
                setDataSource(newData);
            });
        } else {
            const newData = dataSource.filter((item) => item.key !== record.key);
            setDataSource(newData);
        }
    };

    defaultColumns = setColumnsList(defaultColumns, dataSource);
    // if (update) {
    defaultColumns.push({
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
        console.log(datProd);
        const findDt = dataSource.filter(
            (dt) => dt.id_producto === value.id_producto
        );
        if (findDt.length > 0) {
            message.error(
                "Ya existe un producto agregado, no puede agregar el mismo producto!"
            );
        } else {
            if (value.cantidad > 0) {
                const res = datProd.find(({ id_producto }) => id_producto == value.id_producto)
                console.log(res);

                let precio_total = Math.round(res.precio_unidad * value.cantidad);
                let valor_iva = Math.round(
                    (res.precio_unidad * value.cantidad * res.iva) / 100
                );
                let valor_comision = Math.round(
                    (res.precio_unidad * value.cantidad * res.porcen_comision) / 100
                );
                let valor_venta = Math.round(precio_total + valor_iva);
                const newData = {
                    key: res.id_producto,
                    id_producto: res.id_producto,
                    nomb_producto: res.producto_text,
                    producto_text: res.producto_text,
                    cantidad: value.cantidad,
                    codigo_producto: res.codigo_producto,
                    precio_unidad: formatMoney(res.precio_unidad),
                    precio_total: formatMoney(precio_total),
                    iva: res.iva,
                    porcen_comision: res.porcen_comision,
                    valor_iva: formatMoney(valor_iva),
                    valor_comision: formatMoney(valor_comision),
                    valor_venta: formatMoney(valor_venta),
                }
                setDataSource([...dataSource, newData]);
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

    const columns = defaultColumns.map((col) => {
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
                        options={products}
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
        </div>
    );
};
