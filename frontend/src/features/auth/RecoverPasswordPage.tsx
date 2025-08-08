import { Form, Input, Button, Typography, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { LoginService } from "@/client";

export default function RecoverPasswordPage() {
  const [form] = Form.useForm();

  const mutation = useMutation({
    mutationFn: async (values: { email: string }) => {
      await LoginService.recoverPassword({
        email: values.email,
      });
    },
    onSuccess: () => {
      message.success("Password recovery email sent successfully.");
      form.resetFields();
    },
    onError: (err: any) => {
      message.error(err?.message || "Failed to send recovery email.");
    },
  });

  const onFinish = (values: { email: string }) => {
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
          Password Recovery
        </Typography.Title>
        <Typography.Text
          style={{ display: "block", textAlign: "center", marginBottom: 24 }}
        >
          A password recovery email will be sent to the registered account.
        </Typography.Text>
        <Form
          form={form}
          name="recover-password"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
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
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={mutation.isPending}
              block
            >
              Continue
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
