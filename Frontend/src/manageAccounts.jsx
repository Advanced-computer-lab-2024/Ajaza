import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Button, message, Layout, Typography } from 'antd';
import AdminCustomLayout from './Components/AdminCustomLayout';
const { Content } = Layout;
const { Title } = Typography;

const ManageAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for testing
  const mockAccounts = [
    { id: 1, username: 'admin1', type: 'Admin' },
    { id: 2, username: 'governor1', type: 'Tourism Governor' },
    { id: 3, username: 'admin2', type: 'Admin' },
    { id: 4, username: 'governor2', type: 'Tourism Governor' },
    { id: 5, username: 'admin3', type: 'Admin' },
  ];

  // Fetch accounts from the API
  const fetchAccounts = async () => {
    try {
      const response = await fetch('https://api.example.com/accounts');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error('Fetch error:', error);
      // If fetching fails, use mock data
      setAccounts(mockAccounts);
      message.warning('Failed to fetch accounts, displaying dummy data.');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete account
  const handleDelete = (accountId) => {
    setAccounts(accounts.filter(account => account.id !== accountId));
    message.success('Account deleted successfully');
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (<AdminCustomLayout> 
    <Layout>
      <Content
        style={{
          padding: '24px',
          minHeight: '280px',
        }}
      >
        <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
          All Accounts
        </Title>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Row gutter={16}>
            {accounts.map((account) => (
              <Col span={8} key={account.id} style={{ marginBottom: '16px' }}>
                <Card title={account.username} bordered={false}>
                  <p>Account Type: {account.type}</p>
                  <Button type="primary" onClick={() => handleDelete(account.id)}>
                    Delete
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Content>
    </Layout>
    </AdminCustomLayout>);
};

export default ManageAccounts;
