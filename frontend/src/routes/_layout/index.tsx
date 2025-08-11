import { Typography, Layout } from "antd";
import useAuth from "@/hooks/useAuth";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
});

const { Title, Paragraph } = Typography;

function Dashboard() {
  const { user: currentUser } = useAuth();

  return (
    <Layout style={{ padding: "32px" }}>
      <Title level={3} style={{ marginBottom: 0 }}>
        Hi, {currentUser?.full_name || currentUser?.email} 👋🏼
      </Title>
      <Paragraph>Welcome back, nice to see you again!</Paragraph>
    </Layout>
  );
}
