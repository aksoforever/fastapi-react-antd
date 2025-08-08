import { useQuery } from "@tanstack/react-query";
import {
  Table,
  Button,
  Typography,
  Space,
  Pagination,
  Spin,
  Empty,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { ItemsService } from "@/client";
import { useState } from "react";
import AddItemModal from "./AddItemModal";
import EditItemModal from "./EditItemModal";
import DeleteItemButton from "./DeleteItemButton";

const PER_PAGE = 5;

export default function ItemsPage() {
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // 获取数据
  const { data, isLoading } = useQuery({
    queryKey: ["items", page],
    queryFn: () =>
      ItemsService.readItems({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
    keepPreviousData: true,
  });

  const items = data?.data ?? [];
  const count = data?.count ?? 0;

  return (
    <div style={{ width: "100%", margin: 0, padding: 24 }}>
      <Typography.Title level={3} style={{ marginTop: 24 }}>
        Items Management
      </Typography.Title>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowAdd(true)}
        >
          Add Item
        </Button>
      </Space>
      <AddItemModal open={showAdd} onClose={() => setShowAdd(false)} />

      {isLoading ? (
        <div style={{ textAlign: "center", margin: "48px 0" }}>
          <Spin size="large" />
        </div>
      ) : items.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <>
              <SearchOutlined style={{ fontSize: 24, color: "#d9d9d9" }} />
              <div style={{ marginTop: 8 }}>
                You don't have any items yet. Add a new item to get started.
              </div>
            </>
          }
        />
      ) : (
        <>
          <Table
            dataSource={items}
            rowKey="id"
            pagination={false}
            bordered
            style={{ marginTop: 12 }}
            columns={[
              { title: "ID", dataIndex: "id" },
              { title: "Title", dataIndex: "title" },
              {
                title: "Description",
                dataIndex: "description",
                render: (desc: string) =>
                  desc || <span style={{ color: "#999" }}>N/A</span>,
              },
              {
                title: "Actions",
                key: "actions",
                render: (_, item) => (
                  <Space>
                    <Button
                      type="link"
                      onClick={() => {
                        setEditingItem(item);
                        setShowEdit(true);
                      }}
                    >
                      Edit
                    </Button>
                    <DeleteItemButton id={item.id} />
                    <EditItemModal
                      open={showEdit && editingItem?.id === item.id}
                      onClose={() => setShowEdit(false)}
                      item={editingItem}
                    />
                  </Space>
                ),
              },
            ]}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "24px 0",
            }}
          >
            <Pagination
              total={count}
              current={page}
              pageSize={PER_PAGE}
              onChange={setPage}
              showSizeChanger={false}
              showQuickJumper
            />
          </div>
        </>
      )}
    </div>
  );
}
