import { Divider, Form, Modal, Radio, Table } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getReturns } from "../../controllers/products";
import { setColumnsList } from "../utils/setColumnsList";

export const ApplyDevolution = ({ isOpenApplyDev, setIsOpenApplyDev, token, setRowIn, rowIn }) => {
    const [selectionType, setSelectionType] = useState('checkbox');
    const [data, setData] = useState([]);
    const [rowSelect, setRowSelect] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const cols = [
        {
            label: "Id",
            name: "id",
            key: "id",
            filter: "search",
            width: "wp-50",
            visible: false
        },
        {
            label: "Id prodducto",
            name: "id_producto",
            filter: "search",
            width: "wp-150",
            visible: false
        },
        {
            label: "Producto",
            name: "producto_text",
            filter: "search",
            width: "wp-300",
        },
        {
            label: "Cant",
            name: "cantidad",
            width: "wp-70",
        },
        {
            label: "Valor unidad",
            name: "precio",
            width: "wp-100",
        },
        {
            label: "iva",
            name: "iva",
            width: "wp-70",
        },
        {
            label: "Valor iva",
            name: "valor_iva",
            width: "wp-100",
        },
        {
            label: "Valor iva",
            name: "valor_iva",
            width: "wp-100",
        },
        {
            label: "Comisión",
            name: "porcen_comision",
            width: "wp-70",
        },
        {
            label: "Valor comisión",
            name: "valor_comision",
            width: "wp-100",
        },
        {
            label: "Valor total",
            name: "valor_total",
            width: "wp-150",
        }
    ];
    let columns = setColumnsList(cols, data);

    useEffect(() => {
        setLoading(true);
        console.log(rowIn)
        let record = {
            zona: rowIn.id_zona,
            estado: 'PENDIENTE',
            tipo_devolucion: 'DEVOLUCIÓN'
        }
        dispatch(getReturns("", record, token)).then(res => {
            console.log(res);
            let val = 0;
            for (let i = 0; i < res.length; i++) {
                val = res[i].cantidad * res[i].precio;
                console.log(val);
                res[i].valor_iva = Math.round(val * res[i].iva / 100);
                res[i].valor_total = val + res[i].valor_iva;
                res[i].iva = `% ${res[i].iva}`;
                res[i].valor_comision = Math.round(val * res[i].porcen_comision / 100);
                res[i].porcen_comision = `% ${res[i].porcen_comision}`;
            }
            setData(res);
            setLoading(false);
        });
    }, [rowIn])


    // rowSelection object indicates the need for row selection
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelect(selectedRows);
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };

    const onCreate = () => {
        console.log(rowSelect)
        console.log(rowIn)
        let dat = {};
        dat.total_iva = 0;
        dat.subtotal = 0;
        dat.valor_total = 0;
        dat.valor_comision = 0;
        rowSelect.forEach(d => {
            dat.total_iva += parseFloat(d.valor_iva);
            dat.subtotal += parseFloat(d.cantidad) * parseFloat(d.precio);
            dat.valor_total += parseFloat(d.valor_total);
            dat.valor_comision += parseFloat(d.valor_comision);
        });
        dat.id_factura = rowIn.id;
        dat.cod_factura = rowIn.codigo;
        dat.devolutions = rowSelect;
        console.log(dat)
    }
    return (
        <Modal
            open={isOpenApplyDev}
            title="Aplicar devoluciones a facturas"
            okText="Aplicar"
            cancelText="Cancelar"
            width="1100px"
            // loading={loading}
            maskClosable={false}
            onCancel={() => {
                setIsOpenApplyDev(false);
                form.resetFields();
            }}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.log("Validate Failed:", info);
                    })
            }}
        >
            <div>
                <Table
                    rowSelection={{
                        type: selectionType,
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={data}
                    size="small"
                />
            </div>
        </Modal>
    );
}
