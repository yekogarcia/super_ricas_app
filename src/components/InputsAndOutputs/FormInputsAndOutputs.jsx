import { DatePicker, Form, message, Modal, Select } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getZones } from "../../controllers/fetchDynamics";
import {
  getInventoryDet,
  saveInventory,
  updateInventory,
} from "../../controllers/inventory";
import { addRow, updateRow } from "../utils/rows";
import { ListEdit } from "./ListEdit";
import moment from "moment";
const { Option } = Select;

export const FormInputsAndOutputs = ({
  open,
  setOpen,
  setRow,
  row,
  invent,
  setInvent,
  token,
  update,
  visible,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [zones, setZones] = useState([]);
  const [fecha, setFecha] = useState(moment().format("YYYY-MM-DD"));
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (row) {
      dispatch(getInventoryDet("", token, row.id)).then(function (res) {
        setDataSource(res);
      });
      row.fecha_dia = moment(row.fecha_dia, "YYYY-MM-DD");
      setFecha(row.fecha_dia);
      form.setFieldsValue(row);
    } else {
      setFecha(moment().format("YYYY-MM-DD"));
      // form.resetFields();
    }
  }, [row]);

  
  useEffect(() => {
    dispatch(getZones("", token)).then((pr) => {
      setZones(pr);
    });
  }, []);

  const onCreate = (values) => {
    // console.log(values);
    // console.log(invent);
    values.fecha_dia = moment(values.fecha_dia["_d"]).format("YYYY-MM-DD");
    values.detalles = dataSource;

    if (dataSource.length === 0) {
      message.warning("No puedes guardar, sin agregar almenos un producto");
      return;
    }
    if (!row) {
      const exist = invent.filter(
        (dt) =>
          dt.id_zona == values.id_zona && dt.fecha_dia["_i"] == values.fecha_dia
      );
      if (exist.length > 0) {
        message.warning("Ya tienes agregada la misma zona, en la misma fecha!");
        return;
      }
      dispatch(saveInventory(values, token)).then((res) => {
        res[0].key = res[0].id;
        setInvent(addRow(invent, res[0]));
        setOpen(false);
        form.resetFields();
        setDataSource([]);
      });
    } else {
      console.log(values);
      values.id = row.id;
      dispatch(updateInventory(values, row.id, token)).then((res) => {
        console.log(res);
        setInvent(updateRow(invent, res[0], row.id));
        setOpen(false);
        setRow(false);
        form.resetFields();
        setDataSource([]);
      });
    }
  };

  const onChageDate = (value) => {
    setFecha(moment(value["_d"]).format("YYYY-MM-DD"));
  };

  setTimeout(function () {
    form.setFieldValue("fecha_dia", moment(fecha, "YYYY-MM-DD"));
  }, 500);

  return (
    <Modal
      open={open}
      title="Agregar producto por zona"
      okText="Guardar"
      cancelText="Cancelar"
      width="1200px"
      onCancel={() => {
        setOpen(false);
        form.resetFields();
        setDataSource([]);
        setRow(false);
      }}
      onOk={() => {
        update || visible
          ? form
              .validateFields()
              .then((values) => {
                onCreate(values);
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              })
          : message.error("No puede editar, verifique por favor!");
      }}
    >
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
          name="fecha_dia"
          label="Fecha / Día"
          rules={[
            {
              required: true,
              message: "Por favor ingrese un valor!",
            },
          ]}
        >
          <DatePicker onChange={onChageDate} />
        </Form.Item>
        <Form.Item
          style={{
            display: "inline-block",
            width: "calc(30% - 8px)",
            margin: "0px 4px 16px 4px",
          }}
          name="id_zona"
          label="Zona"
          rules={[
            {
              required: true,
              message: "Por favor ingrese un valor!",
            },
          ]}
        >
          <Select>
            {zones.map(({ id, nombre }) => (
              <Option value={id} key={id}>
                {nombre}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
      <ListEdit
        dataSource={dataSource}
        setDataSource={setDataSource}
        update={update}
        visible={visible}
      />
    </Modal>
  );
};
