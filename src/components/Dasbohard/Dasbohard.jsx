import { Layout, Menu } from "antd";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import { Route, Routes } from "react-router-dom";
import { LeftMenu } from "./LeftMenu";

import "./Dasbohard.scss";
import { TopMenu } from "./TopMenu";

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
              <Route exact path="/products" element={<LeftMenu />} />
            </Routes>
          </Content>
          <Footer>Footer</Footer>
        </Layout>
      </Layout>
    </>
  );
};
