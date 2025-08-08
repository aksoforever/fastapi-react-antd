import { Modal, Form, Input, Checkbox, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { UsersService } from "@/client";

export default function EditUserModal({ open, onClose, user }) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open && user) {
      form.setFieldsValue({
        ...user,
        password: "",
        confirm_password: "",
      });
    }
  }, [open, user, form]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      // 密码字段如果为空不提交
      const requestBody = { ...data };
      if (!data.password) delete requestBody.password;
      if (requestBody.confirm_password) delete requestBody.confirm_password;
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

  // useEffect(() => {
  //   if (!open) form.resetFields();
  // }, [open, form]);

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
      <Form form={form} layout="vertical">
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
                if (
                  !getFieldValue("password") ||
                  getFieldValue("password") === value
                ) {
                  return Promise.resolve();
                }
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
