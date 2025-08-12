import { Layout } from "antd";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import Navbar from "@/layout/Navbar";
import Sidebar from "@/layout/Sidebar";
import { isLoggedIn } from "@/hooks/useAuth";

const { Content } = Layout;

export const Route = createFileRoute("/_layout")({
  component: AppLayout,
  beforeLoad: async () => {
    if (!isLoggedIn()) {
      throw redirect({ to: "/auth/login" });
    }
  },
});

function AppLayout() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />
      <Layout>
        <Sidebar />
        <Content style={{ padding: 24, overflowY: "auto" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
