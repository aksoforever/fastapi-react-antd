import { Card, Typography } from "antd";
import DeleteConfirmation from "./DeleteConfirmation";

export default function DeleteAccount() {
  return (
    <Card title="Delete Account" variant="filled">
      <Typography.Text>
        Permanently delete your data and everything associated with your
        account.
      </Typography.Text>
      <DeleteConfirmation />
    </Card>
  );
}
