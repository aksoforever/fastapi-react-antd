import { Form, Input, Button, Typography, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import useAuth from "@/hooks/useAuth";
import Logo from "/assets/images/logo.svg";
import { useNavigate } from "@tanstack/react-router";

export default function SignupPage() {
  const { signUpMutation } = useAuth();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      await signUpMutation.mutateAsync(values);
      message.success("Sign up successful! Please login.");
      navigate({ to: "/login" });
    } catch (e: any) {
      message.error(e?.message || "Sign up failed");
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
      <div style={{ width: 340 }}>
        <img
          src={Logo}
          alt="FastAPI logo"
          style={{ display: "block", margin: "0 auto 24px", maxWidth: 160 }}
        />
        <Form
          form={form}
          name="signup"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="full_name"
            label="Full Name"
            rules={[
              { required: true, message: "Full Name is required" },
              { min: 3, message: "At least 3 characters" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Full Name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 6, message: "At least 6 characters" },
            ]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
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
              loading={signUpMutation.isPending}
              block
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>
        <Typography.Text>
          Already have an account? <a href="/login">Log In</a>
        </Typography.Text>
      </div>
    </div>
  );
}
