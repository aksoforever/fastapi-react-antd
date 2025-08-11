import { Layout, Space } from "antd";
import { Link } from "@tanstack/react-router";
import Logo from "/assets/images/logo.svg";
import UserMenu from "./UserMenu"; // 按你现在项目结构调整

export default function Navbar() {
  return (
    <Layout.Header
      style={{
        width: "100%",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        borderBottom: "1px solid #eee",
        position: "sticky",
        top: 0,
        zIndex: 100,
        height: 64,
      }}
    >
      <Link to="/">
        <img src={Logo} alt="Logo" style={{ height: 27, display: "block" }} />
      </Link>
      <Space align="center" size="large">
        {/* 这里放用户菜单/头像/下拉 */}
        <UserMenu />
      </Space>
    </Layout.Header>
  );
}
