import React, { useState } from 'react';
import { Breadcrumb, Layout, Menu, theme, Button, Input, Form, message } from 'antd';
//import CustomLayout from './tempCustomLayout';
import CustomLayout from './Components/CustomLayout';
const { Header, Content, Footer } = Layout;

const items = [
  { key: '1', label: 'Add Admin' },
  { key: '2', label: 'Add Tourism Governor' },
];

const AddAccounts = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [selectedKey, setSelectedKey] = useState('1');
  const [form] = Form.useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
    setIsSubmitted(false);
    setErrorMessage('');
    form.resetFields();
  };

  const handleFirstFormSubmit = async (values) => {
    console.log('Form submitted:', values);
    try {
      const response = await fetch('https://api.example.com/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        form.resetFields();
        setIsSubmitted(true);
        setErrorMessage('');
        message.success('Admin Account Added successfully!');
      } else {

       

        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Something went wrong');
        message.error(errorData.message || 'Submission failed');
      }
    } catch (error) {
    

      setErrorMessage('Network error, please try again later');
      message.error('Network error, please try again later');
    }
  };




  const handleSecondFormSubmit = async (values) => {
    console.log('Form submitted:', values);
    try {
      const response = await fetch('https://api.example.com/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        form.resetFields();
        setIsSubmitted(true);
        setErrorMessage('');
        message.success('Tourism Governor Account Added successfully!');
      } else {

       

        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Something went wrong');
        message.error(errorData.message || 'Submission failed');
      }
    } catch (error) {
    

      setErrorMessage('Network error, please try again later');
      message.error('Network error, please try again later');
    }
  };







  

  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return (
          <div>
            <Form form={form} layout="vertical" onFinish={handleFirstFormSubmit}>
              <Form.Item
                name="username"
                label="Admin Username"
                rules={[{ required: true, message: 'Please input Admin Username!' }]}
              >
                <Input placeholder="Enter Admin Username" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Admin Password"
                rules={[{ required: true, message: 'Please input Admin Password!' }]}
              >
                <Input placeholder="Enter Admin Password" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Add Admin Account
                </Button>
              </Form.Item>
            </Form>
            {isSubmitted && (
              <div style={{ marginTop: '20px', color: 'green' }}>Admin Account Added successfully!</div>
            )}
            {errorMessage && (
              <div style={{ marginTop: '20px', color: 'red' }}>{errorMessage}</div>
            )}
          </div>
        );
      case '2':
        return (
            <div>
              <Form form={form} layout="vertical" onFinish={handleSecondFormSubmit}>
                <Form.Item
                 name="username"
                 label="Tourism Governor Username"
                 rules={[{ required: true, message: 'Please input Tourism Governor Username!' }]}
                >
                   <Input placeholder="Enter Toursim Governor Username" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Tourism Governor Password"
                  rules={[{ required: true, message: 'Please input Tourism Governor Password!' }]}
                >
                 <Input placeholder="Enter Toursim Governor Password" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Add Tourism Governor Account
                  </Button>
                </Form.Item>
              </Form>
              {isSubmitted && (
                <div style={{ marginTop: '20px', color: 'green' }}>Tourism Govenor Account Added successfully!</div>
              )}
              {errorMessage && (
                <div style={{ marginTop: '20px', color: 'red' }}>{errorMessage}</div>
              )}
            </div>
          );
      default:
        return <div>Default Content</div>;
    }
  };

  return (
    <CustomLayout>
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={items}
          onClick={handleMenuClick}
          style={{
            flex: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: '50px', // Add spacing between menu items
          }}
        />
      </Header>
      <Content
        style={{
          padding: '0 48px',
        }}
      >
        
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {renderContent()}
        </div>
      </Content>
      
    </Layout>
 </CustomLayout> );
};

export default AddAccounts;
