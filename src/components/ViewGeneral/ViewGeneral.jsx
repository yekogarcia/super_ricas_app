import { Form, Modal, Tabs, message } from 'antd'
import React from 'react'
import { FormHead } from './FormHead';
import { TabBalances } from './TabBalances';
import { TabDevolutions } from './TabDevolutions';
import { TabIncomes } from './TabIncomes';
import { TabProducts } from './TabProducts';
import { useDispatch, useSelector } from 'react-redux';


export const ViewGeneral = ({ openView, setOpenView, onSearch }) => {
    const [form] = Form.useForm();
    const { details } = useSelector((state) => state.empty);
    const dispatch = useDispatch();

    const onChange = (key) => {
        console.log(key);
    };

    const validateDetails = () => {
        if (details.products) {
            message.warning("Tiene productos sin guardar verifica por favor!");
            return;
        }
        if (details.incomes) {
            message.warning("Tiene Ingresos sin guardar verifica por favor!");
            return;
        }
        if (details.balances) {
            message.warning("Tiene saldos sin guardar verifica por favor!");
            return;
        }
        if (details.devolutions) {
            message.warning("Tiene devoluciones sin guardar verifica por favor!");
            return;
        }

        setOpenView(false);
        onSearch();
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
                validateDetails();
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
