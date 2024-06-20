import React, { useState, useEffect} from 'react';
import { Space, Table, Tag, Tooltip, Modal, Button, Form, Input, Select, DatePicker } from 'antd';
import { PauseOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { fetchData, deleteItem, updateItem } from '../../Routes/router';
// import { fetchData, addItem, updateItem, deleteItem } from '../../Routes/router';

import './taskList.scss';

const { Option } = Select;

const TaskList = ({isRefresh}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
//   const [taskToDelete, setTaskToDelete] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loadingStatus, setLoading] = useState(true);
  const [selectedID, setSelectedID] = useState('');

  const [form] = Form.useForm();

  useEffect(() => {
    loadTasks();
}, [isRefresh]);

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
        console.log(updateValue.key, updateValue)
        await updateItem(updateValue.key, updateValue);
        loadTasks();
    } catch (error) {
        console.error('Error updating task', error);
    }
};

  const handleSubmitForm = () => {
    form.validateFields().then(values => {
      const formattedValues = {
        ...values,
        key: selectedTask.key,
        dateCreated: selectedTask.dateCreated,
        dateDue: values.dateDue.format('YYYY-MM-DD'),
      };
      handleUpdateTask(formattedValues);
      loadTasks();
      setModalVisible(false);
      setIsEdit(false);
    }).catch(info => {
    //   console.log('Validation Failed:', info);
    });
  };

  const columns = [
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 10,
      align: 'center',
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
      title: 'Date Created',
      dataIndex: 'dateCreated',
      key: 'dateCreated',
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
          <Button onClick={(e) => {
            setSelectedID(record.key)
            e.stopPropagation();
            handleDeleteClick(record)
            }}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }} onRow={(record) => ({ onClick: () => handleRowClick(record) })} loading={loadingStatus}/>
      <Modal
        title="Task Details"
        open={modalVisible}
        onCancel={() => {
            setModalVisible(false)
            setIsEdit(false)
        }}
        footer={[
            <div key="1">
              <Button key="close" onClick={() => {
                setModalVisible(false)
                setIsEdit(false)
              }} style = {{marginRight: "10px"}}>
                Close
              </Button>
            {!isEdit ?(<Button type="primary" key="edit" onClick={() => {setIsEdit(true)}}>
                Edit
              </Button>):
              (<Button type="primary" key="edit" onClick={() => {handleSubmitForm()}}>
                Save
              </Button>)}
            </div>
        ]}
      >
        {selectedTask && !isEdit ? (
          <div style={{marginTop: "20px"}}>
            <p><strong>Title:</strong> {selectedTask.title}</p>
            <p><strong>Status:</strong> {selectedTask.status}</p>
            <p><strong>Priority:</strong> {selectedTask.priority}</p>
            <p><strong>Date Created:</strong> {selectedTask.dateCreated}</p>
            <p><strong>Date Due:</strong> {selectedTask.dateDue}</p>
            <p><strong>Description:</strong> {selectedTask.description}</p>
          </div>
        ): (
            <Form form={form} layout="vertical" name="edit_task_form">
            <Form.Item
              name="title"
              label="Task Title"
              initialValue={selectedTask && selectedTask.title}
              rules={[{ required: true, message: 'Please input the task title!' }]}
            >
              <Input placeholder="Enter task title" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Task Description"
              initialValue={selectedTask &&  selectedTask.description}
              rules={[{ required: true, message: 'Please input the task description!' }]}
            >
              <Input.TextArea placeholder="Enter task description" />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              initialValue={selectedTask && selectedTask.status}
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
              initialValue={selectedTask && selectedTask.priority}
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
      <Modal
        title="Delete Task"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      >
        <p>Are you sure you want to delete this task? {selectedID}</p>
      </Modal>
    </>
  );
};

export default TaskList;