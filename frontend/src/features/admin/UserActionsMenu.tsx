import { Dropdown, Button } from "antd";
import { EditOutlined, DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import { useState } from "react";
import EditUserModal from "./EditUserModal"; // 路径按你的目录调整
import DeleteUserButton from "./DeleteUserButton";

export default function UserActionsMenu({ user, disabled }) {
  const [showEdit, setShowEdit] = useState(false);

  const menuItems = [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit",
      disabled,
      onClick: () => setShowEdit(true),
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: <DeleteUserButton id={user.id} disabled={disabled} />,
      danger: true,
      disabled,
    },
  ];

  return (
    <>
      <Dropdown
        menu={{
          items: menuItems,
          onClick: ({ key }) => {
            if (key === "edit") setShowEdit(true);
            // delete 逻辑在 DeleteUserButton 里
          },
        }}
        trigger={["click"]}
      >
        <Button icon={<MoreOutlined />} size="small" disabled={disabled} />
      </Dropdown>
      <EditUserModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        user={user}
      />
    </>
  );
}
