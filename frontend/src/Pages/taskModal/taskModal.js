import React from 'react';
import { Modal, Form, Input, Button, Select, DatePicker } from 'antd';
import { addItem } from '../../Routes/router';

const { Option } = Select;

const TaskModal = ({ visible, onClose, onRefresh }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then(values => {
      const formattedValues = {
        ...values,
        key: Math.random().toString(36).substr(2, 9),
        dateCreated: values.dateCreated.format('YYYY-MM-DD'),
        dateDue: values.dateDue.format('YYYY-MM-DD'),
      };
      handleAddTask(formattedValues);
      onRefresh();
      form.resetFields();
      onClose();
    }).catch(info => {
      // console.log('Validation Failed:', info);
    });
  };

  const handleAddTask = async (newTask) => {
    try {
        await addItem(newTask);
    } catch (error) {
        console.error('Error adding task', error);
    }
};

  return (
    <Modal
      open={visible}
      title="Add New Task"
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Add Task
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" name="add_task_form">
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
        <Form.Item
          name="dateCreated"
          label="Date Created"
          rules={[{ required: true, message: 'Please select the date created!' }]}
        >
              <DatePicker picker="date" placeholder="Select a date" format="YYYY-MM-DD"/>
        </Form.Item>
        <Form.Item
          name="dateDue"
          label="Date Due"
          rules={[{ required: true, message: 'Please select the due date!' }]}
        >
          <DatePicker placeholder="Select due date" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskModal;
