import { Popconfirm, Button, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteOutlined } from "@ant-design/icons";
import { ItemsService } from "@/client";

export default function DeleteItemButton({ id }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      await ItemsService.deleteItem({ id });
    },
    onSuccess: () => {
      message.success("The item was deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
    onError: () => {
      message.error("An error occurred while deleting the item");
    },
  });

  return (
    <Popconfirm
      title="Delete Item"
      description="This item will be permanently deleted. Are you sure?"
      onConfirm={() => mutation.mutate()}
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{ danger: true, loading: mutation.isPending }}
    >
      <Button type="text" danger icon={<DeleteOutlined />} size="small">
        Delete
      </Button>
    </Popconfirm>
  );
}
