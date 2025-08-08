import { Layout } from "antd";
import SidebarItems from "./SidebarItems";
const { Sider } = Layout;

export default function Sidebar() {
  return (
    <Sider
      width={220}
      style={{
        background: "#fff",
      }}
      breakpoint="md"
      collapsedWidth="0"
      className="desktop-sidebar"
    >
      <SidebarItems />
    </Sider>
  );
}
