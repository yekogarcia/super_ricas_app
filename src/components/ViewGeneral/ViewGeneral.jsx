import { Button, Form, Input, Modal, Tabs } from 'antd'
import React from 'react'
import { FormHead } from './FormHead';
import { TabBalances } from './TabBalances';
import { TabDevolutions } from './TabDevolutions';
import { TabIncomes } from './TabIncomes';
import { TabPays } from './TabPays';
import { TabProducts } from './TabProducts';


export const ViewGeneral = ({ openView, setOpenView }) => {

    const onChange = (key) => {
        console.log(key);
    };


    const items = [
        {
            key: 'Productos',
            label: `Productos`,
            children: <TabProducts />,
        },
        {
            key: 'Ingresos',
            label: `Ingresos`,
            children: <TabIncomes />,
        },
        {
            key: 'Pagos',
            label: `Pago comisión`,
            children: <TabPays />,
        },
        {
            key: 'Saldos',
            label: `Saldos`,
            children: <TabBalances />,
        },
        {
            key: 'Devoluciones',
            label: `Devoluciones`,
            children: <TabDevolutions />,
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
                // form.resetFields();
                // setDataSource([]);
                // setRow(false);
                // setSaldoBase(0)
            }}
            // onOk={false}
            // onOk={() => {
                // update || visible
                //   ? form
                //     .validateFields()
                //     .then((values) => {
                //       onCreate(values);
                //     })
                //     .catch((info) => {
                //       console.log("Validate Failed:", info);
                //     })
                //   : message.error("No puede editar, verifique por favor!");
            // }}
        >
            <FormHead />
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </Modal>
    </>
}
