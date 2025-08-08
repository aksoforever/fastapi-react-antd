import { Button, Modal, Typography, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { UsersService } from "@/client";
import useAuth from "@/hooks/useAuth";

export default function DeleteConfirmation() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  const mutation = useMutation({
    mutationFn: async () => {
      await UsersService.deleteUserMe();
    },
    onSuccess: () => {
      message.success("Your account has been successfully deleted");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      logout();
    },
    onError: (e) => {
      message.error(e?.message || "Delete failed");
    },
  });

  const handleDelete = () => {
    mutation.mutate();
  };

  return (
    <>
      <Button
        danger
        type="primary"
        onClick={() => setOpen(true)}
        style={{ marginTop: 16 }}
      >
        Delete
      </Button>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleDelete}
        okText="Confirm"
        cancelText="Cancel"
        confirmLoading={mutation.isPending}
        okButtonProps={{ danger: true }}
        destroyOnHidden
        title="Confirmation Required"
      >
        <Typography.Text>
          All your account data will be <strong>permanently deleted.</strong> If
          you are sure, please click <strong>"Confirm"</strong> to proceed. This
          action cannot be undone.
        </Typography.Text>
      </Modal>
    </>
  );
}
