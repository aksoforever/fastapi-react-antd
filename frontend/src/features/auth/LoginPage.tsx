import { Form, Input, Button, Typography, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import useAuth from "@/hooks/useAuth";
import Logo from "/assets/images/logo.svg";

export default function LoginPage() {
  const { loginMutation, resetError } = useAuth();
  const [form] = Form.useForm();

  const onFinish = async (values: { username: string; password: string }) => {
    resetError();
    try {
      await loginMutation.mutateAsync(values);
    } catch {
      message.error("Login failed");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: 300 }}>
        <img
          src={Logo}
          alt="Quectel IT logo"
          style={{ display: "block", margin: "0 auto 24px", maxWidth: 240 }}
        />
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <div style={{ marginBottom: 16, textAlign: "right" }}>
            <a href="/recover-password">Forgot Password?</a>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loginMutation.isPending}
              block
            >
              Log In
            </Button>
          </Form.Item>
        </Form>

        <Typography.Text>
          Don't have an account? <a href="/signup">Sign Up</a>
        </Typography.Text>
      </div>
    </div>
  );
}
