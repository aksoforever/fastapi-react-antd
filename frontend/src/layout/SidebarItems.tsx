import { useQuery } from "@tanstack/react-query";
import { Menu, type MenuProps } from "antd";
import {
  HomeOutlined,
  AppstoreOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { UsersService, type UserPublic } from "@/client";

// ✅ 明确 props，onSelect 设为可选
interface SidebarItemsProps {
  onSelect?: () => void;
}
// ✅ 类型检查 props
export default function SidebarItems({ onSelect }: SidebarItemsProps) {
  const { data: currentUser } = useQuery<UserPublic>({
    queryKey: ["currentUser"],
    queryFn: () => UsersService.readUserMe(),
  });

  const navigate = useNavigate();
  const location = useLocation();

  // 基础菜单（普通项 + 一个带 children 的 SubMenu）
  const baseItems: MenuProps["items"] = [
    { key: "/", icon: <HomeOutlined />, label: "Dashboard" },
    {
      key: "content", // ← SubMenu 的 key
      icon: <AppstoreOutlined />,
      label: "Content",
      children: [
        { key: "/items", label: "Items" },
        // { key: "/items/new", label: "Create Item" },
      ],
    },
    { key: "/settings", icon: <SettingOutlined />, label: "User Settings" },
  ];

  // 管理员专属：再加一个 SubMenu
  const adminItems: MenuProps["items"] = currentUser?.is_superuser
    ? [
        {
          key: "admin",
          icon: <TeamOutlined />,
          label: "Admin",
          children: [
            { key: "/admin", icon: <UserOutlined />, label: "Users" },
            // { key: "/admin/system", label: "System" },
          ],
        },
      ]
    : [];

  const items = [...baseItems, ...adminItems];

  // 让 SubMenu 默认打开：可按需控制
  const defaultOpenKeys = [
    "content",
    ...(currentUser?.is_superuser ? ["admin"] : []),
  ];

  return (
    <Menu
      mode="inline"
      items={items}
      selectedKeys={[location.pathname]}
      defaultOpenKeys={defaultOpenKeys}
      onClick={({ key }) => {
        // 子项点击会拿到其 key（我们用路由路径做 key）
        if (typeof key === "string" && key.startsWith("/")) {
          navigate({ to: key });
          onSelect?.();
        }
      }}
      style={{ borderRight: 0 }}
    />
  );
}
