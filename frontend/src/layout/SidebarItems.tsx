import { useQuery } from "@tanstack/react-query";
import { Menu } from "antd";
import {
  HomeOutlined,
  AppstoreOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "@tanstack/react-router";
import type { UserPublic } from "@/client";

const menuData = [
  { key: "/", icon: <HomeOutlined />, label: "Dashboard" },
  { key: "/items", icon: <AppstoreOutlined />, label: "Items" },
  { key: "/settings", icon: <SettingOutlined />, label: "User Settings" },
];

export default function SidebarItems({ onSelect }) {
  const { data: currentUser, isLoading } = useQuery<UserPublic>({
    queryKey: ["currentUser"],
  });
  const navigate = useNavigate();
  const location = useLocation();

  if (isLoading) return null; // 或者 loading skeleton

  const finalMenu = currentUser?.is_superuser
    ? [...menuData, { key: "/admin", icon: <TeamOutlined />, label: "Admin" }]
    : menuData;

  return (
    <Menu
      mode="inline"
      items={finalMenu}
      selectedKeys={[location.pathname]}
      onClick={({ key }) => {
        navigate({ to: key });
        if (onSelect) onSelect();
      }}
      style={{ borderRight: 0 }}
    />
  );
}
