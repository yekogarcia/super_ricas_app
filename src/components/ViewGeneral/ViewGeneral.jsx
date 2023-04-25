import { Form,  Modal, Tabs } from 'antd'
import React from 'react'
import { FormHead } from './FormHead';
import { TabBalances } from './TabBalances';
import { TabDevolutions } from './TabDevolutions';
import { TabIncomes } from './TabIncomes';
import { TabProducts } from './TabProducts';
import { useDispatch } from 'react-redux';


export const ViewGeneral = ({ openView, setOpenView, onSearch }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
   
    const onChange = (key) => {
        console.log(key);
    };


    const items = [
        {
            key: 'Productos',
            label: `Productos`,
            children: <TabProducts {...form} />,
        },
        {
            key: 'Ingresos',
            label: `Ingresos`,
            children: <TabIncomes {...form} />,
        },
        // {
        //     key: 'Pagos',
        //     label: `Pago comisión`,
        //     children: <TabPays />,
        // },
        {
            key: 'Saldos',
            label: `Saldos`,
            children: <TabBalances {...form} />,
        },
        {
            key: 'Devoluciones',
            label: `Devoluciones`,
            children: <TabDevolutions {...form} />,
        },
    ];

    return <>
        <Modal
            open={openView}
            title="Vista general"
            // okText="Guardar"
            okText={false}
            cancelText="Cancelar"
            width="1200px"
            height="800px"
            maskClosable={false}
            okButtonProps={{
                disabled: true,
            }}
            //   cancelButtonProps={{
            //     disabled: true,
            //   }}
            onCancel={() => {
                setOpenView(false);
                onSearch();
                // dispatch(setDataEdit({id: ""}));
                // form.resetFields();
            }}
        // onOk={() => {
        // }}
        >
            <FormHead form={form} />
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </Modal>
    </>
}
