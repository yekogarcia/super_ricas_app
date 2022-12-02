import { Button, Form, Input, message, Upload } from "antd";
import Dragger from "antd/lib/upload/Dragger";
import login from "../../assets/login.jpg";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";

import "./Profile.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUser } from "../../controllers/auth";
import { useState } from "react";
import {
  updateProfile,
  validatePassword,
} from "../../controllers/fetchDynamics";

export const Profile = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [user, setUser] = useState([]);
  const [enable, setEnable] = useState(true);

  const { token, key } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUser("", token, key)).then((res) => {
      delete res[0].password;
      setUser(res);
    });
  }, []);

  console.log(user[0]);
  user.length > 0 ? form.setFieldsValue(user[0]) : form.setFieldsValue({});

  const fileList = [
    {
      uid: "-1",
      name: "yyy.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      thumbUrl:
        "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
  ];

  const props = {
    name: "file",
    multiple: true,
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleSave = (values) => {
    console.log(values);
    console.log(key);
    dispatch(updateProfile(values, key, token)).then((res) => {
      console.log(res);
    });
  };

  const handleValidatePassword = () => {
    const value = form.getFieldValue("current_password");
    const dat = {
      id: key,
      password: value,
    };
    console.log(value);
    if (typeof value !== 'undefined') {
      dispatch(validatePassword(dat, token)).then((res) => {
        setEnable(!res);
      });
    }
  };

  const handleEqualsPasswords = () => {
    const password = form.getFieldValue("password");
    const confirm = form.getFieldValue("confirm_paswword");
    console.log(password);
    if (password !== confirm) {
      message.error('La confirmación de contraseña es incorrecta!');
      form.setFieldValue('password', '');
      form.setFieldValue('confirm_paswword', '');
    }
  };

  return (
    <>
      <section className="profile">
        <div className=" head">
          <figure>
            <img src={login} alt="img profile" />
          </figure>
          <div>
            <h1>Ender Garcia</h1>
            <h4>Super Administrador</h4>
          </div>
        </div>
        <div className="form">
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
                width: "calc(100% - 8px)",
                margin: "0px 4px 16px 4px",
              }}
              name="photo"
              label="Foto de perfil"
            >
              {/* <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture"
                defaultFileList={[...fileList]}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Subir foto de perfil</Button>
              </Upload> */}
              <Input />
            </Form.Item>
            <Form.Item
              style={{
                display: "inline-block",
                width: "calc(50% - 8px)",
                margin: "0px 4px 16px 4px",
              }}
              name="name"
              label="Nombres"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese un valor!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              style={{
                display: "inline-block",
                width: "calc(50% - 8px)",
                margin: "0px 4px 16px 4px",
              }}
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese un valor!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              style={{
                display: "inline-block",
                width: "calc(50% - 8px)",
                margin: "0px 4px 16px 4px",
              }}
              name="cell_phone"
              label="No Celular"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese un valor!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              style={{
                display: "inline-block",
                width: "calc(50% - 8px)",
                margin: "0px 4px 16px 4px",
              }}
              name="user_login"
              label="Usuario"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese un valor!",
                },
              ]}
            >
              <Input disabled />
            </Form.Item>
            <div className="update-password">
              <a>Cambiar contraseña</a>
            </div>
            <Form.Item
              style={{
                display: "inline-block",
                width: "calc(100% - 8px)",
                margin: "0px 4px 16px 4px",
              }}
              name="current_password"
              label="Contraseña actual"
            >
              <Input.Password onBlur={handleValidatePassword} />
            </Form.Item>
            <Form.Item
              style={{
                display: "inline-block",
                width: "calc(50% - 8px)",
                margin: "0px 4px 16px 4px",
              }}
              name="password"
              label="Contraseña nueva"
            >
              <Input.Password disabled={enable} />
            </Form.Item>
            <Form.Item
              style={{
                display: "inline-block",
                width: "calc(50% - 8px)",
                margin: "0px 4px 16px 4px",
              }}
              name="confirm_paswword"
              label="Confirmar contraseña"
            >
              <Input.Password onBlur={handleEqualsPasswords} disabled={enable} />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                form
                  .validateFields()
                  .then((values) => {
                    handleSave(values);
                  })
                  .catch((info) => {
                    console.log("Validate Failed:", info);
                  });
              }}
            >
              Actualizar Datos
            </Button>
          </Form>
        </div>
      </section>
    </>
  );
};
