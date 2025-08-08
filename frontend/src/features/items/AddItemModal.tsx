import { Modal, Form, Input, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ItemsService } from "@/client";

export default function AddItemModal({ open, onClose }) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data) => {
      await ItemsService.createItem({ requestBody: data });
    },
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
      <Form form={form} layout="vertical">
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
