import {
  CaretDownOutlined,
  CaretUpOutlined,
  ArrowRightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../../controllers/auth";
import login from "../../assets/login.jpg";

// document.querySelector(".menu-dropdown").style = "display:  none";

export const TopMenu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {perfil_text, name, } = useSelector((state) => state.auth);

  const handleHover = (e) => {
    document.querySelector(".menu-dropdown").style = "display:  block";
  };

  const handleCloseHover = (e) => {
    document.querySelector(".menu-dropdown").style = "display:  none";
  };

  const handleViewProfile = (e) => {
    navigate("profile");
  };

  return (
    <>
      <div className="logo">
        <h1>Control de inventarios</h1>
      </div>
      {/* <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        items={[]}
      >
      </Menu> */}
      <aside
        onMouseOver={handleHover}
        onMouseLeave={handleCloseHover}
        onClick={handleViewProfile}
      >
        <ul className="profile">
          <li>
            <figure>
              <img src={login} alt="foto" />
            </figure>
            <div className="info-profile">
              <p>
                <b>{name}</b>
              </p>
              <p>{perfil_text}</p>
            </div>
            <div className="icon">
              <CaretDownOutlined />
            </div>
          </li>
          <ul className="menu-dropdown">
            <li>
              <UserOutlined />
              Perfil
            </li>
            <li onClick={() => {
              dispatch(handleLogout());
            }}>
              <ArrowRightOutlined />
              Cerrar sesión
            </li>
          </ul>
        </ul>
      </aside>
    </>
  );
};
