"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Dropdown,
  Menu,
  Layout,
  Row,
  Col,
  Typography,
  Modal,
  Input,
  Grid,
  Pagination,
} from "antd";
import { useQuery, useMutation, useSubscription, gql } from "@apollo/client";
import type { ColumnsType } from "antd/es/table";
import { DownOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import getToken from "@/utils/get-token";

const { Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;
const { useBreakpoint } = Grid;

interface Call {
  id: string;
  call_type: string;
  direction: string;
  duration: number;
  from: string;
  to: string;
  via: string;
  created_at: string;
  is_archived: boolean;
  notes: { id: string; content: string }[];
}

const GET_CALLS = gql`
  query GetCalls($offset: Float, $limit: Float) {
    paginatedCalls(offset: $offset, limit: $limit) {
      nodes {
        id
        call_type
        direction
        duration
        from
        to
        via
        created_at
        is_archived
        notes {
          id
          content
        }
      }
      totalCount
    }
  }
`;

const ADD_NOTE = gql`
  mutation AddNote($input: AddNoteInput!) {
    addNote(input: $input) {
      id
      notes {
        id
        content
      }
    }
  }
`;

const CALL_SUBSCRIPTION = gql`
  subscription OnCallUpdated {
    onCallUpdated {
      id
      call_type
      direction
      duration
      from
      to
      via
      created_at
      is_archived
      notes {
        id
        content
      }
    }
  }
`;

const CustomTable: React.FC = () => {
  const [current, setCurrent] = useState<number>(1);
  const [filter, setFilter] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [noteContent, setNoteContent] = useState<string>("");
  const router = useRouter();
  const token = getToken();
  const screens = useBreakpoint();

  const { loading, error, data, refetch } = useQuery(GET_CALLS, {
    variables: { offset: (current - 1) * 10, limit: 10 },
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
  });

  const [addNote] = useMutation(ADD_NOTE, {
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
  });

  const { data: subscriptionData } = useSubscription(CALL_SUBSCRIPTION, {
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
  });

  useEffect(() => {
    if (subscriptionData) {
      refetch();
    }
  }, [subscriptionData, refetch]);

  const columns: ColumnsType<Call> = [
    {
      title: "CALL TYPE",
      dataIndex: "call_type",
      key: "call_type",
      render: (text: string) => (
        <span
          style={{
            color:
              text === "missed"
                ? "red"
                : text === "answered"
                ? "green"
                : text === "voicemail"
                ? "blue"
                : "black",
          }}
        >
          {text}
        </span>
      ),
      responsive: ["md"],
    },
    {
      title: "DIRECTION",
      dataIndex: "direction",
      key: "direction",
      render: (text: string) => <span style={{ color: "blue" }}>{text}</span>,
      responsive: ["md"],
    },
    {
      title: "DURATION",
      dataIndex: "duration",
      key: "duration",
      render: (duration: number) => (
        <span>
          {Math.floor(duration / 60)} minutes
          <br />
          <span style={{ color: "blue" }}>({duration} seconds)</span>
        </span>
      ),
    },
    {
      title: "FROM",
      dataIndex: "from",
      key: "from",
    },
    {
      title: "TO",
      dataIndex: "to",
      key: "to",
      responsive: ["md"],
    },
    {
      title: "VIA",
      dataIndex: "via",
      key: "via",
      responsive: ["md"],
    },
    {
      title: "CREATED AT",
      dataIndex: "created_at",
      key: "created_at",
      responsive: ["md"],
    },
    {
      title: "STATUS",
      dataIndex: "is_archived",
      key: "is_archived",
      render: (is_archived: boolean) => (
        <Tag
          color={is_archived ? "green" : "#373333"}
          style={{ backgroundColor: is_archived ? "#e0ffe0" : "#e1e1e1" }}
        >
          {is_archived ? "Archived" : "Unarchive"}
        </Tag>
      ),
    },
    {
      title: "ACTIONS",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => showAddNoteModal(record)}>
            Add Note
          </Button>
        </>
      ),
    },
  ];

  const showAddNoteModal = (call: Call) => {
    setSelectedCall(call);
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    if (selectedCall) {
      await addNote({
        variables: {
          input: {
            activityId: selectedCall.id,
            content: noteContent,
          },
        },
      });
      refetch();
      setIsModalVisible(false);
      setNoteContent("");
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setNoteContent("");
  };

  const handleTableChange = (pagination: any) => {
    setCurrent(pagination.current);
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    refetch({ offset: (current - 1) * 10, limit: 10 });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="all">All</Menu.Item>
      <Menu.Item key="archived">Archived</Menu.Item>
      <Menu.Item key="missed">Missed</Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      <Content
        style={{
          padding: screens.xs ? "20px" : "50px",
          backgroundColor: "#ffffff",
        }}
      >
        <Row justify="center">
          <Col span={screens.xs ? 24 : 20}>
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <Title level={screens.xs ? 3 : 2}>
                Turing Technologies Frontend Test
              </Title>
              <Dropdown overlay={menu} trigger={["click"]}>
                <a
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  Filter by: <DownOutlined />
                </a>
              </Dropdown>
              <Table
                columns={columns}
                dataSource={data?.paginatedCalls.nodes}
                pagination={false}
                onChange={handleTableChange}
                rowKey="id"
                scroll={{ x: screens.xs ? 1000 : undefined }}
                style={{ marginTop: "20px", border: "1px solid #ebebeb" }}
              />
              <Row justify="center" style={{ marginTop: "20px" }}>
                <Pagination
                  current={current}
                  total={data?.paginatedCalls.totalCount}
                  pageSize={10}
                  onChange={handleTableChange}
                />
              </Row>
            </div>
          </Col>
        </Row>
        <Modal
          title="Add Notes"
          visible={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          okText="Save"
          footer={null}
        >
          {selectedCall && (
            <div>
              <p>
                <a href="#">Call ID {selectedCall.id}</a>
              </p>
              <p>
                <b>Call Type</b> {selectedCall.call_type}
              </p>
              <p>
                <b>Duration</b> {Math.floor(selectedCall.duration / 60)} Minutes{" "}
                {selectedCall.duration % 60} Seconds
              </p>
              <p>
                <b>From</b> {selectedCall.from}
              </p>
              <p>
                <b>To</b> {selectedCall.to}
              </p>
              <p>
                <b>Via</b> {selectedCall.via}
              </p>
              <p>
                <b>Notes</b>
              </p>
              <TextArea
                rows={4}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Add Notes"
                style={{ marginBottom: "20px" }}
              />
              <Button
                type="primary"
                onClick={handleModalOk}
                style={{
                  width: "100%",
                  backgroundColor: "#635bff",
                  borderColor: "#635bff",
                }}
              >
                Save
              </Button>
            </div>
          )}
        </Modal>
      </Content>
    </Layout>
  );
};

export default CustomTable;
