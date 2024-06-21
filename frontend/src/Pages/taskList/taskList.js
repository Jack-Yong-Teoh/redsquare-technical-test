import React, { useState, useEffect } from 'react';
import { Space, Table, Tag, Tooltip, Modal, Button, Form, Input, Select, DatePicker, Menu, Dropdown } from 'antd';
import { PauseOutlined, DoubleRightOutlined, DownOutlined } from '@ant-design/icons';
import { fetchData, deleteItem, updateItem } from '../../Routes/router';

import './taskList.scss';

const { Option } = Select;

const TaskList = ({ isRefresh }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loadingStatus, setLoading] = useState(true);
  const [selectedID, setSelectedID] = useState('');
  const [form] = Form.useForm();
  const [prioritySortOrder, setPrioritySortOrder] = useState('asc');

  useEffect(() => {
    loadTasks();
  }, [isRefresh]);

  useEffect(() => {
    if (selectedTask) {
      form.setFieldsValue({
        title: selectedTask.title,
        description: selectedTask.description,
        status: selectedTask.status,
        priority: selectedTask.priority,
        // dateDue: selectedTask.dateDue,
      });
    }
  }, [selectedTask, form]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchData();
      setTableData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading tasks', error);
    }
  };

  const handleRowClick = (record) => {
    setSelectedTask(record);
    setModalVisible(true);
  };

  const handleDeleteClick = () => {
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    await deleteItem(selectedID);
    loadTasks();
    setDeleteModalVisible(false);
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
  };

  const handleUpdateTask = async (updateValue) => {
    try {
      await updateItem(updateValue.key, updateValue);
      loadTasks();
      form.resetFields();
      setSelectedTask(null);
    } catch (error) {
      console.error('Error updating task', error);
    }
  };

  const handleSubmitForm = () => {
    form
      .validateFields()
      .then((values) => {
        const formattedValues = {
          ...values,
          key: selectedTask.key,
          dateCreated: selectedTask.dateCreated,
          dateDue: values.dateDue.format('YYYY-MM-DD'),
        };
        handleUpdateTask(formattedValues);
        loadTasks();
        form.resetFields();
        setSelectedTask(null);
        setModalVisible(false);
        setIsEdit(false);
      })
      .catch((info) => {});
  };

  const PriorityColumnHeader = () => {
    const menu = (
      <Menu onClick={({ key }) => setPrioritySortOrder(key)}>
        <Menu.Item key="desc">Low to High</Menu.Item>
        <Menu.Item key="asc">High to Low</Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu}>
        <span>
          Priority <DownOutlined />
        </span>
      </Dropdown>
    );
  };

  const columns = [
    {
      title: <PriorityColumnHeader />,
      dataIndex: 'priority',
      key: 'priority',
      width: 10,
      align: 'center',
      sorter: (a, b) => {
        const priorityOrder = { low: 1, medium: 2, high: 3 };
        const sortOrder = prioritySortOrder === 'asc' ? 1 : -1;
        return sortOrder * (priorityOrder[a.priority] - priorityOrder[b.priority]);
      },
      sortOrder: prioritySortOrder,
      render: (priority) => {
        let icon;
        switch (priority) {
          case 'low':
            icon = (
              <Tooltip title="Low">
                <DoubleRightOutlined type="message" className="low-priority" />
              </Tooltip>
            );
            break;
          case 'medium':
            icon = (
              <Tooltip title="Medium">
                <PauseOutlined type="message" className="medium-priority" />
              </Tooltip>
            );
            break;
          case 'high':
            icon = (
              <Tooltip title="High">
                <DoubleRightOutlined type="message" className="high-priority" />
              </Tooltip>
            );
            break;
          default:
            icon = null;
        }
        return icon;
      },
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      width: 20,
      align: 'center',
      filters: [
        { text: 'Done', value: 'done' },
        { text: 'Undone', value: 'undone' },
        { text: 'In-progress', value: 'in-progress' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (_, { status }) => (
        <>
          <Tag className="custom-tag" color={status === 'undone' ? 'red' : status === 'in-progress' ? 'blue' : 'green'} key={status}>
            {status.toUpperCase()}
          </Tag>
        </>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 250,
    },
    {
      title: 'Date Due',
      dataIndex: 'dateDue',
      key: 'dateDue',
      width: 50,
      align: 'center',
    },
    {
      title: 'Action',
      key: 'action',
      width: 10,
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={(e) => {setSelectedID(record.key); e.stopPropagation(); handleDeleteClick(record);}}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={tableData}
        scroll={{ x: 800 }}
        onRow={(record) => ({ onClick: () => handleRowClick(record) })}
        loading={loadingStatus}
        showSorterTooltip={false}
      />
      <Modal
        title="Task Details"
        open={modalVisible}
        onCancel={() => {
          form.resetFields();
          setSelectedTask(null);
          setModalVisible(false);
          setIsEdit(false);
        }}
        footer={[
          <div key="1">
            <Button key="close" onClick={() => {setModalVisible(false); setIsEdit(false);}} style={{ marginRight: '10px' }}>
              Close
            </Button>
            {!isEdit ? (
              <Button type="primary" key="edit" onClick={() => {
                setIsEdit(true)
              }}>
                Edit
              </Button>
            ) : (
              <Button type="primary" key="edit" onClick={() => handleSubmitForm()}>
                Save
              </Button>
            )}
          </div>,
        ]}
      >
        {selectedTask && !isEdit ? (
          <div style={{ marginTop: '20px' }}>
            <p>
              <strong>Title:</strong> {selectedTask.title}
            </p>
            <p>
              <strong>Status:</strong> {selectedTask.status}
            </p>
            <p>
              <strong>Priority:</strong> {selectedTask.priority}
            </p>
            <p>
              <strong>Date Created:</strong> {selectedTask.dateCreated}
            </p>
            <p>
              <strong>Date Due:</strong> {selectedTask.dateDue}
            </p>
            <p>
              <strong>Description:</strong> {selectedTask.description}
            </p>
          </div>
        ) : (
          <Form form={form} layout="vertical" name="edit_task_form">
            <Form.Item
              name="title"
              label="Task Title"
              rules={[{ required: true, message: 'Please input the task title!' }]}
            >
              <Input placeholder="Enter task title" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Task Description"
              rules={[{ required: true, message: 'Please input the task description!' }]}
            >
              <Input.TextArea placeholder="Enter task description" />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select the task status!' }]}
            >
              <Select placeholder="Select status">
                <Option value="done">Done</Option>
                <Option value="in-progress">In Progress</Option>
                <Option value="undone">Undone</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="priority"
              label="Priority"
              rules={[{ required: true, message: 'Please select the task priority!' }]}
            >
              <Select placeholder="Select priority">
                <Option value="low">Low</Option>
                <Option value="medium">Medium</Option>
                <Option value="high">High</Option>
              </Select>
            </Form.Item>
            {selectedTask && <p><strong>Date Created:</strong> {selectedTask.dateCreated}</p>}
            <Form.Item
              name="dateDue"
              label="Date Due"
              rules={[{ required: true, message: 'Please select the due date!' }]}
            >
              <DatePicker placeholder="Select due date" />
            </Form.Item>
          </Form>
        )}
      </Modal>
      <Modal title="Delete Task" open={deleteModalVisible} onOk={handleDeleteConfirm} onCancel={handleDeleteCancel}>
        <p>Are you sure you want to delete this task?</p>
      </Modal>
    </>
  );
};

export default TaskList;
