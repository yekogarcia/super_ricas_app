import { useDispatch } from "react-redux";
import login from "../../assets/login.jpg";
import { initLogIn } from "../../controllers/auth";
import { useForm } from "../../hooks/useForm";
import "./Login.scss";

export const Login = () => {
  const dispatch = useDispatch();

  const [formValues, handleInputChange] = useForm({
    username: '',
    password: '',
  });

  const { username, password } = formValues;

  const handleLogIn = (e) => {
    e.preventDefault();
    dispatch(initLogIn({ username, password }));
  };

  return (
    <>
      <div className="fondo">
        <div className="content">
          <header>
            <h1>Control de inventarios</h1>
          </header>
          <main>
            <section>
              <form onSubmit={handleLogIn}>
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
                <a>¿Recuperar cuenta?</a>
              </form>
              <article>
                <figure>
                  <img src={login} alt="img_login" />
                </figure>
              </article>
            </section>
          </main>
          <footer></footer>
        </div>
      </div>
    </>
  );
};
