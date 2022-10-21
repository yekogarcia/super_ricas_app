import { Layout } from "antd";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import { Route, Routes } from "react-router-dom";
import { LeftMenu } from "./LeftMenu";

import "./Dasbohard.scss";
import { TopMenu } from "./TopMenu";
import { Products } from "../Products/Products";
import { Zones } from "../Zones/Zones";
import { Categories } from "../Categories/Categories";

export const Dasbohard = () => {
  console.log("Dasbohard");
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
              <Route exact path="/products" element={<Products />} />
              <Route exact path="/categories" element={<Categories />} />
              <Route exact path="/zones" element={<Zones />} />
            </Routes>
          </Content>
          <Footer>Footer</Footer>
        </Layout>
      </Layout>
    </>
  );
};
