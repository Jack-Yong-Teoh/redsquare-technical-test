import React, { useState } from 'react';
import { FileOutlined, PieChartOutlined, TeamOutlined, UserOutlined, RightOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, Result, Tooltip, Button } from 'antd';
import Logo from '../../Images/redsquare-logo.png';
import TaskList from '../taskList/taskList';
import AddTaskModal from '../taskModal/taskModal';
import './homePage.scss';

const { Header, Content, Footer, Sider } = Layout;

const SideBarItems = [
  {
    label: 'Task Manage',
    key: '1',
    icon: <PieChartOutlined />,
  },
  {
    label: 'User',
    key: 'sub1',
    icon: <UserOutlined />,
    children: [
      {
        label: 'Jack',
        key: '2',
        icon: null,
      },
      {
        label: 'Adam',
        key: '3',
        icon: null,
      },
      {
        label: 'Alex',
        key: '4',
        icon: null,
      },
    ],
  },
  {
    label: 'Team',
    key: 'sub2',
    icon: <TeamOutlined />,
    children: [
      {
        label: 'Backend Team',
        key: '5',
        icon: null,
      },
      {
        label: 'Frontend Team',
        key: '6',
        icon: null,
      },
    ],
  },
  {
    label: 'Files',
    key: '7',
    icon: <FileOutlined />,
  },
];

const HomePage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key);
  };

  const handleAddClick = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleRefresh = () => {
    setIsRefresh(!isRefresh);
  }

  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return <TaskList isRefresh={isRefresh}/>;
      default:
        return (
          <Result
            status="403"
            title="Content Unavailable Now"
            subTitle="This is for display purposes only :)"
          />
        );
    }
  };

  const getParentLabel = (key) => {
    for (const item of SideBarItems) {
      if (item.children) {
        const child = item.children.find((childItem) => childItem.key === key);
        if (child) {
          return item.label;
        }
      }
    }
    return '';
  };

  const parentLabel = getParentLabel(selectedKey);

  return (
    <Layout style={{ minHeight: '100vh', width: '100%' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} breakpoint='md'>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={SideBarItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header className="header-container">
          <div className="logo-container">
            <img src={Logo} alt="Logo" className="logo" />
          </div>
          <Tooltip title="Display Only :)" placement='left'>
            <UserOutlined type="message" className='user-outline' />
          </Tooltip>
        </Header>

        <Content className="content-container">
          <Breadcrumb className="breadcrumb-container" separator={<RightOutlined />} items={[
            { title: parentLabel, className: 'breadcrumb-text' },
            { title: SideBarItems.flatMap((node) => (node.children ? node.children : node)).find((node) => node.key === selectedKey)?.label, className: 'breadcrumb-text' }
          ]}>
          </Breadcrumb>
          {selectedKey === '1' && (
            <div className='add-container'>
              <Button type="primary" onClick={handleAddClick}>Add</Button>
            </div>
          )}
          <div className="inner-content">
            {renderContent()}
          </div>
        </Content>

        <Footer className="footer-container">
          Jack ©{new Date().getFullYear()} For Technical Test Purpose Only
        </Footer>
      </Layout>
      <AddTaskModal visible={isModalVisible} onClose={handleModalClose} onRefresh={handleRefresh}/>
    </Layout>
  );
};

export default HomePage;
