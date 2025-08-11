import { Card, Typography, Form, Input, Button, Space, message } from "antd";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import {
  UsersService,
  type UserUpdateMe, // ✅ 引入类型
  type ApiError, // （可选）若你的客户端里有这个类型
} from "@/client";

export default function UserInformation() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm<UserUpdateMe>();

  useEffect(() => {
    if (currentUser && editMode) {
      form.setFieldsValue({
        full_name: currentUser.full_name || "",
        email: currentUser.email,
      });
    }
    if (!editMode) {
      form.resetFields();
    }
  }, [editMode, currentUser, form]);

  const mutation = useMutation<void, ApiError, UserUpdateMe>({
    mutationFn: async (data) => {
      await UsersService.updateUserMe({ requestBody: data }); // ✅ data 已是 UserUpdateMe
    },
    onSuccess: () => {
      message.success("User updated successfully.");
      // 更精确的刷新（你也可以根据项目实际的 queryKey 调整）
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      setEditMode(false);
    },
    onError: (e) => {
      message.error(e?.message || "Update failed");
    },
  });

  const onFinish = (data: UserUpdateMe) => {
    mutation.mutate(data);
  };

  if (!currentUser) return null;

  return (
    <Card title="User Information" variant="outlined">
      {editMode ? (
        <Form<UserUpdateMe>
          form={form}
          layout="vertical"
          initialValues={{
            full_name: currentUser.full_name || "",
            email: currentUser.email,
          }}
          onFinish={onFinish}
        >
          <Form.Item label="Full name" name="full_name">
            <Input placeholder="Full name" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={mutation.isPending}
              >
                Save
              </Button>
              <Button onClick={() => setEditMode(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      ) : (
        <>
          <Typography.Paragraph>
            <strong>Full name: </strong>
            {currentUser.full_name || (
              <span style={{ color: "#999" }}>N/A</span>
            )}
          </Typography.Paragraph>
          <Typography.Paragraph>
            <strong>Email: </strong>
            {currentUser.email}
          </Typography.Paragraph>
          <Space>
            <Button type="primary" onClick={() => setEditMode(true)}>
              Edit
            </Button>
          </Space>
          <Form form={form} style={{ display: "none" }} />
        </>
      )}
    </Card>
  );
}
