import { Result, Button } from "antd";
import { Link } from "@tanstack/react-router";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      data-testid="not-found"
    >
      <Result
        status="404"
        title="404"
        subTitle="The page you are looking for was not found."
        extra={
          <Link to="/">
            <Button type="primary" size="large">
              Go Back
            </Button>
          </Link>
        }
      />
    </div>
  );
}
