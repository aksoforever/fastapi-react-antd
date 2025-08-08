import { Dropdown, Button } from "antd";
import { EditOutlined, DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import { useState } from "react";
import EditItemModal from "@/features/items/EditItemModal";
import DeleteItemButton from "@/features/items/DeleteItemButton";

export default function ItemActionsMenu({ item }) {
  const [showEdit, setShowEdit] = useState(false);

  const menuItems = [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit",
      onClick: () => setShowEdit(true),
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: <DeleteItemButton id={item.id} />,
      danger: true,
    },
  ];

  return (
    <>
      <Dropdown
        menu={{
          items: menuItems,
          onClick: ({ key }) => {
            if (key === "edit") setShowEdit(true);
            // DeleteItemButton 内已经有 onClick 逻辑
          },
        }}
        trigger={["click"]}
      >
        <Button icon={<MoreOutlined />} size="small" />
      </Dropdown>
      <EditItemModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        item={item}
      />
    </>
  );
}
