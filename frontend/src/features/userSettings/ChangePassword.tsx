import { Card, Form, Input, Button, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { UsersService, type UpdatePassword } from "@/client";
export default function ChangePassword() {
  const [form] = Form.useForm();

  const mutation = useMutation({
    mutationFn: async (data: UpdatePassword) => {
      await UsersService.updatePasswordMe({ requestBody: data });
    },
    onSuccess: () => {
      message.success("Password updated successfully.");
      form.resetFields();
    },
    onError: (e: any) => {
      message.error(e?.message || "Change failed");
    },
  });

  const onFinish = (data: UpdatePassword) => {
    mutation.mutate(data);
  };

  return (
    <Card title="Change Password" variant="outlined">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Current Password"
          name="current_password"
          rules={[{ required: true, message: "Please enter current password" }]}
        >
          <Input.Password placeholder="Current Password" />
        </Form.Item>
        <Form.Item
          label="New Password"
          name="new_password"
          rules={[
            { required: true, message: "Please enter new password" },
            { min: 8, message: "At least 8 characters" },
          ]}
        >
          <Input.Password placeholder="New Password" />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirm_password"
          dependencies={["new_password"]}
          rules={[
            { required: true, message: "Please confirm password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("new_password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("The passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
