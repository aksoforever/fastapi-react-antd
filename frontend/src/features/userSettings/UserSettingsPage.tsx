import { Card, Typography, Tabs } from "antd";
import useAuth from "@/hooks/useAuth";
import UserInformation from "./UserInformation";
import ChangePassword from "./ChangePassword";
import DeleteAccount from "./DeleteAccount";

export default function UserSettingsPage() {
  const { user: currentUser } = useAuth();
  if (!currentUser) return null;

  const tabs = [
    { key: "my-profile", label: "My Profile", children: <UserInformation /> },
    { key: "password", label: "Password", children: <ChangePassword /> },
    { key: "danger-zone", label: "Danger Zone", children: <DeleteAccount /> },
  ];
  const finalTabs = currentUser.is_superuser ? tabs.slice(0, 3) : tabs;

  return (
    <div style={{ width: "100%", padding: "24px 0 0 24px" }}>
      <Typography.Title
        level={3}
        style={{ textAlign: "left", marginBottom: 32 }}
      >
        User Settings
      </Typography.Title>
      <Card style={{ width: "100%" }}>
        <Tabs
          defaultActiveKey="my-profile"
          items={finalTabs}
          tabPosition="top"
          size="large"
          style={{ width: "100%" }}
        />
      </Card>
    </div>
  );
}
