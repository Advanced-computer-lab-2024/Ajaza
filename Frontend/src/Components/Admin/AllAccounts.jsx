import React, { useEffect, useState } from "react";  
import { Card, Col, Row, Typography, message, Input, Button, Tooltip } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";  // Import the Delete icon
import './AllAccounts.css'; // Import your CSS file for custom styles

const { Title } = Typography;

const AllAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUsername, setSearchUsername] = useState('');
  const [isHovered, setIsHovered] = useState(false); // State to manage hover effect

  // Fetch accounts from the API
  const fetchAccounts = async () => {
    try {
      const response = await fetch("https://api.example.com/accounts");
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error("Fetch error:", error);
      // Display a dummy user if fetching fails
      const dummyUser = [{ id: 0, username: "dummyUser", type: "Admin" }];
      setAccounts(dummyUser);
      message.warning("Failed to fetch accounts. Displaying dummy user.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search for a specific username
  const handleSearch = async () => {
    if (!searchUsername) {
      message.warning('Please enter a username to search.');
      return;
    }
    
    setLoading(true); // Set loading state while fetching

    try {
      const response = await fetch(`https://api.example.com/accounts?username=${searchUsername}`);
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setAccounts(data); // Update state with fetched accounts
      message.success('Account(s) fetched successfully');
    } catch (error) {
      console.error("Fetch error:", error);
      // Display a dummy user if the search fails
      const dummyUser = [{ id: 0, username: "dummyUser", type: "Admin" }];
      setAccounts(dummyUser);
      message.error("Failed to fetch accounts. Displaying dummy user.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press for searching
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle delete account
  const handleDelete = async (accountId) => {
    try {
      // Add your delete API call here if needed
      // For example: await fetch(`https://api.example.com/accounts/${accountId}`, { method: 'DELETE' });
      
      // For now, just remove it from the UI state
      setAccounts(accounts.filter((account) => account.id !== accountId));
      message.success("Account deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      message.error("Failed to delete the account");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
      <div style={{ flex: 1 }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
          Managing User Accounts
        </Title>
        
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Row gutter={16}>
            {accounts.length > 0 ? accounts.map((account) => (
              <Col span={8} key={account.id} style={{ marginBottom: "16px" }}>
                <Card title={account.username} bordered={false}>
                  <p>Account Type: {account.type}</p>
                  <Button 
                    type="default" 
                    icon={<DeleteOutlined />} // Use the delete icon here
                    onClick={() => handleDelete(account.id)}
                    style={{ color: 'red' }} // Optional: Change color to red
                  >
                    Delete
                  </Button>
                </Card>
              </Col>
            )) : (
              <Col span={24} style={{ textAlign: 'center' }}>
                <p>No accounts found.</p>
              </Col>
            )}
          </Row>
        )}
      </div>

      {/* Hover-Expandable Search Component */}
      <div 
        style={{ 
          position: 'relative', 
          width: isHovered ? '350px' : '40px', // Width changes on hover
          transition: 'width 0.3s ease' 
        }} 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
      >
        <Tooltip title="Click to search for a username" placement="left" arrowPointAtCenter>
          <SearchOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />
        </Tooltip>
        {isHovered && (
          <div style={{ marginTop: '10px' }}>
            <p style={{ marginBottom: '5px' }}>Search for a username:</p>
            <Input
              placeholder="Enter username"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              onKeyPress={handleKeyPress} // Trigger search on Enter key
              style={{
                borderRadius: '10px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                width: '100%',
              }} 
            />
            <Button 
              type="primary" 
              onClick={handleSearch} 
              style={{ marginTop: '10px', width: '100%', borderRadius: '10px' }} // Full width for button
            >
              Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAccounts;
