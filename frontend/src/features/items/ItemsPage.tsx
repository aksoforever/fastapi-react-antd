import { useQuery } from "@tanstack/react-query";
import { Table, Button, Typography, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ItemsService } from "@/client";
import { useState } from "react";
import AddItemModal from "./AddItemModal";
import EditItemModal from "./EditItemModal";
import DeleteItemButton from "./DeleteItemButton";

export default function ItemsPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // 直接一次性取全部（默认 limit=100）
  const { data, isLoading } = useQuery({
    queryKey: ["items"],
    queryFn: () => ItemsService.readItems(),
  });

  const items = data?.data ?? [];

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (desc: string) =>
        desc || <span style={{ color: "#999" }}>N/A</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, item: any) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingItem(item);
              setShowEdit(true);
            }}
          >
            Edit
          </Button>
          <DeleteItemButton id={item.id} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ width: "100%", padding: 24 }}>
      <Typography.Title level={3}>Items Management</Typography.Title>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowAdd(true)}
        >
          Add Item
        </Button>
      </Space>

      <AddItemModal open={showAdd} onClose={() => setShowAdd(false)} />
      <EditItemModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        item={editingItem}
      />

      <Table
        rowKey="id"
        loading={isLoading}
        dataSource={items}
        columns={columns}
      />
    </div>
  );
}
