import { Popconfirm, Button, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteOutlined } from "@ant-design/icons";
import { UsersService } from "@/client";

interface DeleteUserButtonProps {
  id: string;
  disabled?: boolean;
}
export default function DeleteUserButton({
  id,
  disabled,
}: DeleteUserButtonProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      await UsersService.deleteUser({ userId: id });
    },
    onSuccess: () => {
      message.success("The user was deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      message.error("An error occurred while deleting the user");
    },
  });

  return (
    <Popconfirm
      placement="top"
      title="Delete User"
      description="All items associated with this user will also be permanently deleted. Are you sure?"
      onConfirm={() => mutation.mutate()}
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{ danger: true, loading: mutation.isPending }}
      disabled={disabled}
    >
      <Button
        type="text"
        danger
        icon={<DeleteOutlined />}
        size="small"
        disabled={disabled}
      >
        Delete
      </Button>
    </Popconfirm>
  );
}
