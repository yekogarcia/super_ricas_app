import { Spin } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import login from "../../assets/login.jpg";
import { initLogIn } from "../../controllers/auth";
import { useForm } from "../../hooks/useForm";
import "./Login.scss";

export const Login = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [formValues, handleInputChange] = useForm({
    username: "",
    password: "",
  });

  const { username, password } = formValues;

  const handleLogIn = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(initLogIn({ username, password })).then((res) => {
      setLoading(false);
    });
  };

  // const handleConfirmEmail = (e) => {
  //   e.preventDefault();
  //   // <Navigate to="" />
  // }

  return (
    <>

      <form onSubmit={handleLogIn}>
        <Spin spinning={loading}>
          <h1>Ingresar</h1>
          <label htmlFor="user">
            {/* <span>Usuario</span> */}
            <input
              type="text"
              id="user"
              name="username"
              placeholder="Ingrese su usuario"
              value={username}
              onChange={handleInputChange}
              required
            />
          </label>
          <label htmlFor="password">
            {/* <span>Contraseña</span> */}
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              placeholder="Ingrese su contraseña"
              required
            />
          </label>
          <input type="submit" value="Ingresar" />
          <a href="/recovery">¿Recuperar cuenta?</a>
        </Spin>
      </form>
      <article>
        <figure>
          <img src={login} alt="img_login" />
        </figure>
      </article>

    </>
  );
};
