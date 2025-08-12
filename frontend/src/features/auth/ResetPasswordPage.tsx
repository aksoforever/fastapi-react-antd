import { Form, Input, Button, Typography, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { LoginService } from "@/client";

export default function ResetPasswordPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (values: {
      new_password: string;
      confirm_password: string;
    }) => {
      const token = new URLSearchParams(window.location.search).get("token");
      if (!token) throw new Error("No token found in URL");
      await LoginService.resetPassword({
        requestBody: { new_password: values.new_password, token },
      });
    },
    onSuccess: () => {
      message.success("Password updated successfully.");
      form.resetFields();
      navigate({ to: "/auth/login" });
    },
    onError: (err: any) => {
      message.error(err?.message || "Reset failed");
    },
  });

  const onFinish = (values: any) => {
    mutation.mutate(values);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: 340 }}>
        <Typography.Title
          level={2}
          style={{ textAlign: "center", marginBottom: 8 }}
        >
          Reset Password
        </Typography.Title>
        <Typography.Text
          style={{ display: "block", textAlign: "center", marginBottom: 24 }}
        >
          Please enter your new password and confirm it to reset your password.
        </Typography.Text>
        <Form
          form={form}
          name="reset-password"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="new_password"
            label="New Password"
            rules={[
              { required: true, message: "Please enter new password" },
              { min: 6, message: "At least 6 characters" },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="New Password"
            />
          </Form.Item>
          <Form.Item
            name="confirm_password"
            label="Confirm Password"
            dependencies={["new_password"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={mutation.isPending}
              block
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
