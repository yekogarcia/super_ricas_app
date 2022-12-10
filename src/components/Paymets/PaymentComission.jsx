import { Modal } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIncomes, saveComission } from "../../controllers/inventory";
import { formatMoney } from "../utils/utils"
export const PaymentComission = ({ isModalOpen, setIsModalOpen, setRowIn, rowIn }) => {
    const dispatch = useDispatch();
    const [income, setIncome] = useState(0)
    const [comission, setComission] = useState(0)
    const { token, user_login } = useSelector((state) => state.auth);
   
    useEffect(() => {
        dispatch(getIncomes(token, rowIn.id)).then(res => {
            setComission(Math.round(rowIn.valor_comision * res.valor / rowIn.valor_venta));
            setIncome(res.valor);
        })
    }, [rowIn])


    const handleOk = () => {
        const values = {
            usuario: user_login,
            id_inventario: rowIn.id,
            valor_comision: comission
        }
        dispatch(saveComission(values, token)).then(res => {
            setRowIn([])
            setIsModalOpen(false);
        })
    };
    const 
    handleCancel = () => {
        setIsModalOpen(false);
        setRowIn([])
    };
    
    return (
        <>
            <Modal
                title="Pagar comisión diaria"
                open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
                okText="Pagar comisión" cancelText="Cancelar">
                <h2>Valor ingresos del día: {formatMoney(income)} </h2>
                <h2>Valor comisión del día: {formatMoney(comission)}</h2>
            </Modal>
        </>
    )
}
