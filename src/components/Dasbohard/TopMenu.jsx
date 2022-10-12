import { Menu } from "antd";

export const TopMenu = () => {
  return (
    <>
        <div className="logo">
          <h1>Control de inventarios</h1>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={[]}
        />
    </>
  );
};
