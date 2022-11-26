import { Button, Form, message, Modal } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPayments, savePayments } from "../../controllers/inventory";
import { ListFormPays } from "./ListFormPays";
import "./Payments.scss";

const { confirm } = Modal;

export const FormPayments = ({
  openPay,
  setOpenPay,
  setRowIn,
  rowIn,
  visualize,
  invent,
  setInvent,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [pays, setPays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [valor, setValor] = useState(0);

  const { token, user_login } = useSelector((state) => state.auth);

  useEffect(() => {
    setLoading(false);
    dispatch(getPayments(token, rowIn.id)).then((res) => {
      console.log(res);
      setPays(res);
      setValor(rowIn.valor_ingresos);
    });
  }, [rowIn]);

  const onCreate = (values = []) => {
    for (let i = 0; i < pays.length; i++) {
      pays[i].id_iventario = rowIn.id;
      pays[i].id_zona = rowIn.id_zona;
      pays[i].usuario = user_login;
    }
    console.log(pays);
    values.pays = pays;
    setLoading(true);
    dispatch(savePayments(values, token)).then((res) => {
      console.log(res);
      setLoading(false);
      setPays([]);
      setValor(0);
      setOpenPay(false);
    });
  };

  return (
    <Modal
      open={openPay}
      title="Agregar ingresos por zona"
      okText="Guardar"
      cancelText="Cancelar"
      width="600px"
      maskClosable={false}
      onCancel={() => {
        setOpenPay(false);
        form.resetFields();
        setPays([]);
        setRowIn(false);
      }}
      onOk={() => {
        onCreate();
      }}
    >
      <ListFormPays
        pays={pays}
        setPays={setPays}
        visualize={visualize}
        loading={loading}
        rowIn={rowIn}
        setValor={setValor}
        valor={valor}
      />
    </Modal>
  );
};
