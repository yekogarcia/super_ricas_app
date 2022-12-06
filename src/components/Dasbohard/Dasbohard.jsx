import { Layout } from "antd";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import { Route, Routes } from "react-router-dom";
import { LeftMenu } from "./LeftMenu";

import { TopMenu } from "./TopMenu";
import { Products } from "../Products/Products";
import { Zones } from "../Zones/Zones";
import { Categories } from "../Categories/Categories";
import { Profile } from "../Profile/Profile";
import { Inventory } from "../Inventory/Inventory";
import { InputsAndOutputs } from "../InputsAndOutputs/InputsAndOutputs";

import "./Dasbohard.scss";
import "../css/style.scss";
import { Users } from "../Users/Users";

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
              <Route exact path="/" element={<InputsAndOutputs />} />
              <Route exact path="/profile" element={<Profile />} />
              <Route exact path="/zones" element={<Zones />} />
              <Route exact path="/categories" element={<Categories />} />
              <Route exact path="/products" element={<Products />} />
              <Route exact path="/inventory" element={<Inventory />} />
              <Route exact path="/inputs" element={<InputsAndOutputs />} />
              <Route exact path="/users" element={<Users />} />
              <Route exact path="/profiles" element={<InputsAndOutputs />} />
              <Route exact path="/company" element={<InputsAndOutputs />} />
            </Routes>
          </Content>
          <Footer>Footer</Footer>
        </Layout>
      </Layout>
    </>
  );
};
