import { Avatar, Dropdown, Typography } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import useAuth from "@/hooks/useAuth";
import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

export default function UserMenu() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(["currentUser"]);

  const menuItems = [
    {
      key: "profile",
      icon: <SettingOutlined />,
      label: <Link to="/settings">My Profile</Link>,
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: <span style={{ color: "red" }}>Logout</span>,
      danger: true,
    },
  ];

  return (
    <Dropdown
      menu={{
        items: menuItems,
        onClick: ({ key }) => {
          if (key === "logout") logout();
        },
      }}
      trigger={["click"]}
    >
      <span
        style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
      >
        <Avatar
          style={{ backgroundColor: "#1890ff", marginRight: 8 }}
          icon={<UserOutlined />}
        />
        <Typography.Text>
          {user?.full_name || user?.email || "User"}
        </Typography.Text>
      </span>
    </Dropdown>
  );
}
