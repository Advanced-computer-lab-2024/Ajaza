

import React from 'react';
import { Button, Form, Input, Typography, message, Card } from 'antd';
import { Box } from '@mui/material';


const UserLogin = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const info = (e) => {
    e.preventDefault(); 
    messageApi.info('Check your email or OTP sent!');
  };

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      {contextHolder}
      <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="100vh" 
    
  >
      <Card
        title="User Login"
        bordered={false}
        style={{
          maxWidth: 400,
          margin: 'auto',
        }}
      >
        <Form
          name="basic"
          layout="vertical"  
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Typography.Link href="/forgot-password" onClick={info}>
              Forgot password?
            </Typography.Link>
          </Form.Item>


          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
      </Box>
    </>
  );
};

export default UserLogin;

