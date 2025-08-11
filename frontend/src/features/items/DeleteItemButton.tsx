import { Popconfirm, Button, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteOutlined } from "@ant-design/icons";
import { ItemsService, type ApiError } from "@/client";

interface DeleteItemButtonProps {
  id: string;
  disabled?: boolean;
}

export default function DeleteItemButton({
  id,
  disabled,
}: DeleteItemButtonProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, ApiError>({
    mutationFn: async () => {
      await ItemsService.deleteItem({ id });
    },
    onSuccess: () => {
      message.success("The item was deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
    onError: (e) => {
      message.error(e?.message || "An error occurred while deleting the item");
    },
  });

  return (
    <Popconfirm
      placement="topLeft" // 或者 "topLeft"
      title="Delete Item"
      description="This item will be permanently deleted. Are you sure?"
      onConfirm={() => mutation.mutate()}
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{ danger: true, loading: mutation.isPending }}
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
