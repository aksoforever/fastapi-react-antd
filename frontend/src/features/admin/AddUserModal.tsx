import { Modal, Form, Input, Checkbox, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UsersService } from "@/client";

export default function AddUserModal({ open, onClose }) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data) => {
      await UsersService.createUser({ requestBody: data });
    },
    onSuccess: () => {
      message.success("User created successfully.");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onClose();
    },
    onError: (e) => {
      message.error(e?.message || "Failed to create user");
    },
  });

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (values.password !== values.confirm_password) {
          form.setFields([
            {
              name: "confirm_password",
              errors: ["The passwords do not match"],
            },
          ]);
          return;
        }
        mutation.mutate(values);
        form.resetFields(); // 这里在提交后重置
      })
      .catch(() => {});
  };

  return (
    <Modal
      title="Add User"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText="Save"
      destroyOnHidden
      confirmLoading={mutation.isPending}
    >
      {open && (
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            email: "",
            full_name: "",
            password: "",
            confirm_password: "",
            is_superuser: false,
            is_active: false,
          }}
        >
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
              { required: true, message: "Password is required" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirm_password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The passwords do not match")
                  );
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
      )}
    </Modal>
  );
}
