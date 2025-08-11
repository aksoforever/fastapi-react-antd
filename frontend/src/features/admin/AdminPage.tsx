// src/features/admin/AdminPage.tsx
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Table, Button, Typography, Space } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import {
  UsersService,
  type UsersPublic,
  type UserPublic,
  type ApiError,
} from "@/client";
import type { TableProps } from "antd";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import DeleteUserButton from "./DeleteUserButton";

export default function AdminPage() {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingUser, setEditingUser] = useState<UserPublic | null>(null);

  // 直接一次性取全部（后端默认 limit=100）
  const { data, isLoading } = useQuery<UsersPublic, ApiError>({
    queryKey: ["users"],
    queryFn: () => UsersService.readUsers(),
  });

  const users: UserPublic[] = data?.data ?? [];

  const columns: TableProps<UserPublic>["columns"] = [
    {
      title: "Full Name",
      dataIndex: "full_name",
      key: "full_name",
      render: (name: string | null) =>
        name || <span style={{ color: "#999" }}>N/A</span>,
    },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      dataIndex: "is_superuser",
      key: "is_superuser",
      render: (v: boolean) => (v ? "Superuser" : "User"),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (v: boolean) => (v ? "Active" : "Inactive"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, user: UserPublic) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingUser(user);
              setShowEdit(true);
            }}
          >
            Edit
          </Button>
          <DeleteUserButton
            id={user.id}
            disabled={currentUser?.id === user.id}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ width: "100%", padding: 24 }}>
      <Typography.Title level={3}>Users Management</Typography.Title>

      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => setShowAdd(true)}
        >
          Add User
        </Button>
      </Space>

      <AddUserModal open={showAdd} onClose={() => setShowAdd(false)} />

      <EditUserModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        user={editingUser}
      />

      <Table<UserPublic>
        rowKey="id"
        loading={isLoading}
        dataSource={users}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
