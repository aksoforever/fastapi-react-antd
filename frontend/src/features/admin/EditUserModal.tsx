import { Modal, Form, Input, Checkbox, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  UsersService,
  type UserPublic,
  type UserUpdate,
  type ApiError,
} from "@/client";

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: UserPublic | null;
}
type UserUpdateForm = UserUpdate & { confirm_password?: string };
export default function EditUserModal({
  open,
  onClose,
  user,
}: EditUserModalProps) {
  const [form] = Form.useForm<UserUpdateForm>();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open && user) {
      form.setFieldsValue({
        email: user.email,
        full_name: user.full_name ?? "",
        is_active: user.is_active ?? true,
        is_superuser: user.is_superuser ?? false,
        password: "", // 留空表示不修改
        confirm_password: "",
      });
    }
  }, [open, user, form]);

  const mutation = useMutation<void, ApiError, UserUpdateForm>({
    mutationFn: async (data) => {
      // 密码为空时不提交；去掉本地字段 confirm_password
      const { confirm_password, password, ...rest } = data ?? {};
      const requestBody: UserUpdate = {
        ...rest,
        ...(password ? { password } : {}), // 仅当有密码时才提交
      };
      if (!user) return;
      await UsersService.updateUser({ userId: user.id, requestBody });
    },
    onSuccess: () => {
      message.success("User updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      form.resetFields();
      onClose();
    },
    onError: (e) => {
      message.error(e?.message || "Failed to update user");
    },
  });

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (values.password && values.password !== values.confirm_password) {
          form.setFields([
            {
              name: "confirm_password",
              errors: ["The passwords do not match"],
            },
          ]);
          return;
        }
        mutation.mutate(values);
      })
      .catch(() => {});
  };

  return (
    <Modal
      title="Edit User"
      open={open}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      okText="Save"
      destroyOnHidden
      confirmLoading={mutation.isPending}
    >
      <Form<UserUpdateForm> form={form} layout="vertical">
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Invalid email format" },
          ]}
        >
          <Input placeholder="Email" type="email" />
        </Form.Item>

        <Form.Item label="Full Name" name="full_name">
          <Input placeholder="Full name" />
        </Form.Item>

        <Form.Item
          label="Set Password"
          name="password"
          rules={[
            { min: 8, message: "Password must be at least 8 characters" },
          ]}
        >
          <Input.Password placeholder="Password (leave blank to keep unchanged)" />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirm_password"
          dependencies={["password"]}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                const pwd = getFieldValue("password");
                if (!pwd || pwd === value) return Promise.resolve();
                return Promise.reject(new Error("The passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm password" />
        </Form.Item>

        <Form.Item name="is_superuser" valuePropName="checked">
          <Checkbox>Is superuser?</Checkbox>
        </Form.Item>
        <Form.Item name="is_active" valuePropName="checked">
          <Checkbox>Is active?</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
}
