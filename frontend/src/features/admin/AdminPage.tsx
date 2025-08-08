import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Button,
  Badge,
  Typography,
  Space,
  Pagination,
  Spin,
  Empty,
} from "antd";
import { UserAddOutlined, SearchOutlined } from "@ant-design/icons";
import { UsersService } from "@/client";
import { useState } from "react";
import AddUserModal from "./AddUserModal"; // 你下次提供代码后我帮你完善
import EditUserModal from "./EditUserModal";
import DeleteUserButton from "./DeleteUserButton";

const PER_PAGE = 5;

export default function AdminPage() {
  const queryClient = useQueryClient();
  // 获取当前登录用户（用于"YOU"标识、禁止自操作等）
  const currentUser = queryClient.getQueryData(["currentUser"]);
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // 获取数据
  const { data, isLoading } = useQuery({
    queryKey: ["users", page],
    queryFn: () =>
      UsersService.readUsers({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
    keepPreviousData: true,
  });

  const users = data?.data ?? [];
  const count = data?.count ?? 0;

  return (
    <div style={{ width: "100%", margin: 0, padding: 24 }}>
      <Typography.Title level={3} style={{ marginTop: 24 }}>
        Users Management
      </Typography.Title>
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

      {isLoading ? (
        <div style={{ textAlign: "center", margin: "48px 0" }}>
          <Spin size="large" />
        </div>
      ) : users.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <>
              <SearchOutlined style={{ fontSize: 24, color: "#d9d9d9" }} />
              <div style={{ marginTop: 8 }}>No users found.</div>
            </>
          }
        />
      ) : (
        <>
          <Table
            dataSource={users}
            rowKey="id"
            pagination={false}
            bordered
            style={{ marginTop: 12 }}
            columns={[
              {
                title: "Full Name",
                dataIndex: "full_name",
                render: (name: string, user) => (
                  <>
                    {name || <span style={{ color: "#999" }}>N/A</span>}
                    {currentUser?.id === user.id && (
                      <Badge
                        style={{
                          marginLeft: 8,
                          background: "#52c41a",
                          color: "#fff",
                          borderRadius: 4,
                          padding: "0 6px",
                        }}
                        count="YOU"
                      />
                    )}
                  </>
                ),
              },
              { title: "Email", dataIndex: "email" },
              {
                title: "Role",
                dataIndex: "is_superuser",
                render: (val: boolean) => (val ? "Superuser" : "User"),
              },
              {
                title: "Status",
                dataIndex: "is_active",
                render: (val: boolean) =>
                  val ? (
                    <Badge color="green" text="Active" />
                  ) : (
                    <Badge color="red" text="Inactive" />
                  ),
              },
              {
                title: "Actions",
                key: "actions",
                render: (_, user) => (
                  <Space>
                    <Button
                      type="link"
                      disabled={currentUser?.id === user.id}
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
                    <EditUserModal
                      open={showEdit && editingUser?.id === user.id}
                      onClose={() => setShowEdit(false)}
                      user={editingUser}
                    />
                  </Space>
                ),
              },
            ]}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Pagination
              total={count}
              current={page}
              pageSize={PER_PAGE}
              onChange={setPage}
              showSizeChanger={false}
              showQuickJumper
            />
          </div>
        </>
      )}
    </div>
  );
}
