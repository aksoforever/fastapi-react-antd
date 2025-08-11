import { Modal, Form, Input, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ItemsService,
  type ItemCreate,
  type ItemPublic,
  type ApiError,
} from "@/client";

interface AddItemModalProps {
  open: boolean;
  onClose: () => void;
}
export default function AddItemModal({ open, onClose }: AddItemModalProps) {
  const [form] = Form.useForm<ItemCreate>();
  const queryClient = useQueryClient();

  const mutation = useMutation<ItemPublic, ApiError, ItemCreate>({
    mutationFn: (data) => ItemsService.createItem({ requestBody: data }),
    onSuccess: () => {
      message.success("Item created successfully.");
      queryClient.invalidateQueries({ queryKey: ["items"] });
      form.resetFields();
      onClose();
    },
    onError: (e) => {
      message.error(e?.message || "Failed to create item");
    },
  });

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        mutation.mutate(values);
      })
      .catch(() => {});
  };

  return (
    <Modal
      title="Add Item"
      open={open}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      okText="Save"
      confirmLoading={mutation.isPending}
      destroyOnHidden
    >
      <Form<ItemCreate> form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input placeholder="Title" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} placeholder="Description" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
