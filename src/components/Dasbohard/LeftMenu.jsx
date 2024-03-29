import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem("Zonas", "zones", <ContainerOutlined />),
  // getItem("Categorias", "categories", <DesktopOutlined />),
  getItem("Productos", "products", <PieChartOutlined />),
  getItem("Mercancía Zonas", "inputs", <ContainerOutlined />),
  getItem("Ventas zonas", "inventory", <ContainerOutlined />),
  // getItem("Devoluciones", "devolutions", <ContainerOutlined />),
  // getItem("Saldos", "balance", <ContainerOutlined />),
  // getItem("Vista general", "view", <ContainerOutlined />),
  // getItem("Informes", "reports", <ContainerOutlined />),
  // getItem("Devs", "sub1", <MailOutlined />, [
  //   getItem("Perfiles", "profiles"),
  //   getItem("Empresas", "company"),
  //   getItem("Usuarios", "users"),
  // ]),
  
  //   getItem("Navigation Two", "sub2", <AppstoreOutlined />, [
  //     getItem("Option 9", "9"),
  //     getItem("Option 10", "10"),
  //     getItem("Submenu", "sub3", null, [
  //       getItem("Option 11", "11"),
  //       getItem("Option 12", "12"),
  //     ]),
  //   ]),
];

export const LeftMenu = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const onClick = (e) => {
    navigate(e.key);
    // console.log("click ", e);
  };

  return (
    <div
    //   style={{
    //     width: 256,
    //   }}
    >
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{
          marginBottom: 16,
        }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        onClick={onClick}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["products"]}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
      />
    </div>
  );
};
