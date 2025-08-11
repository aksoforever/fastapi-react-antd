import { Modal, Form, Input, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  ItemsService,
  type ItemUpdate,
  type ItemPublic,
  type ApiError,
} from "@/client";
interface EditItemModalProps {
  open: boolean;
  onClose: () => void;
  item: ItemPublic | null;
}
export default function EditItemModal({
  open,
  onClose,
  item,
}: EditItemModalProps) {
  const [form] = Form.useForm<ItemUpdate>();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open && item) {
      form.setFieldsValue({
        title: item.title,
        description: item.description,
      });
    }
  }, [open, item, form]);

  const mutation = useMutation<ItemPublic, ApiError, ItemUpdate>({
    mutationFn: async (data) => {
      if (!item) throw new Error("No item to update");
      return ItemsService.updateItem({ id: item.id, requestBody: data });
    },
    onSuccess: () => {
      message.success("Item updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["items"] });
      form.resetFields();
      onClose();
    },
    onError: (e) => {
      message.error(e?.message || "Failed to update item");
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
      title="Edit Item"
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
      <Form<ItemUpdate> form={form} layout="vertical">
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
