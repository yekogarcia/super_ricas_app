import { useDispatch } from "react-redux";
import login from "../../assets/login.jpg";
import { initLogIn } from "../../controllers/auth";
import "./Login.scss";

export const Login = () => {
  const dispatch = useDispatch();

  console.log("login");

  const handleLogIn = (e) => {
    e.preventDefault();
    const user = {
      id: 1,
      name: "yekogarcia",
      logged: true,
    };
    dispatch(initLogIn(user));
  };

  return (
    <>
      <div className="fondo">
        <div className="content">
          <header>
            <h1>Super Ricas</h1>
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
                    placeholder="Ingrese su usuario"
                    defaultValue="yekogarcia"
                    required
                    />
                </label>
                <label htmlFor="password">
                  {/* <span>Contraseña</span> */}
                  <input
                    type="password"
                    id="password"
                    defaultValue="yekogarcia"
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
