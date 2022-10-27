import { Layout } from "antd";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import { Route, Routes } from "react-router-dom";
import { LeftMenu } from "./LeftMenu";

import { TopMenu } from "./TopMenu";
import { Products } from "../Products/Products";
import { Zones } from "../Zones/Zones";
import { Categories } from "../Categories/Categories";

import "./Dasbohard.scss";
import "../css/style.scss";

export const Dasbohard = () => {
  return (
    <>
      <Layout className="dasbohard">
        <Sider>
          <LeftMenu />
        </Sider>
        <Layout className="contain">
          <Header>
            <TopMenu />
          </Header>
          <Content>
            <Routes>
              <Route exact path="/zones" element={<Zones />} />
              <Route exact path="/categories" element={<Categories />} />
              <Route exact path="/products" element={<Products />} />
            </Routes>
          </Content>
          <Footer>Footer</Footer>
        </Layout>
      </Layout>
    </>
  );
};
