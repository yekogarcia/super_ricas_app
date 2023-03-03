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
    dataSource,
    setDataSource,
    loading,
    update,
    visible,
}) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const [products, setProducts] = useState([]);
    const { token } = useSelector((state) => state.auth);

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
            label: "Producto",
            name: "producto_text",
            filter: "search",
            width: "wp-300",
        },
        {
            label: "Cantidad",
            name: "cantidad",
            width: "wp-150",
            filter: "order",
        },
    ]

    useEffect(() => {
        dispatch(getProductsConcat("", token)).then((pr) => {
            const data = [];
            pr.map(({ id, nombre }) => {
                data.push({ value: id, label: nombre });
            });
            setProducts(data);
        });
    }, []);

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
        dispatch(getProductsId(value.id_producto, token)).then((res) => {
            //   console.log(res);
            const findDt = dataSource.filter(
                (dt) => dt.id_producto === value.id_producto
            );
            if (findDt.length > 0) {
                message.error(
                    "Ya existe un producto agregado, no puede agregar el mismo producto!"
                );
            } else {
                if (value.cantidad > 0) {
                    const newData = {
                        key: res[0].id,
                        id_producto: res[0].id,
                        producto_text: res[0].nombre,
                        cantidad: value.cantidad
                    };

                    setDataSource([...dataSource, newData]);
                } else {
                    message.warning("La cantidad tiene que ser mayor a 0!");
                }
            }
            selectRef.current.focus();
            //   form.setFieldValue("cantidad", '');
            form.resetFields();
        });
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
                        width: "calc(50% - 8px)",
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
                        options={products}
                    />
                </Form.Item>
                <Form.Item
                    style={{
                        display: "inline-block",
                        width: "calc(27% - 8px)",
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
