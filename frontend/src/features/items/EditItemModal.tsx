import { Modal, Form, Input, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { ItemsService } from "@/client";

export default function EditItemModal({ open, onClose, item }) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open && item) {
      form.setFieldsValue({
        title: item.title,
        description: item.description,
      });
    }
  }, [open, item, form]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      await ItemsService.updateItem({ id: item.id, requestBody: data });
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
