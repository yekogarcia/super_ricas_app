import {
  CaretDownOutlined,
  CaretUpOutlined,
  ArrowRightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";

// document.querySelector(".menu-dropdown").style = "display:  none";

export const TopMenu = () => {
  const navigate = useNavigate();

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
              <img src="" alt="foto" />
            </figure>
            <div className="info-profile">
              <p>
                <b>Ender Garcia</b>
              </p>
              <p>Super Administrador</p>
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
            <li>
              <ArrowRightOutlined />
              Cerrar sesión
            </li>
          </ul>
        </ul>
      </aside>
    </>
  );
};
