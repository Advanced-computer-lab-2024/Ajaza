import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  message,
  Input,
  Button,
  Tooltip,
} from "antd";
import { SearchOutlined, BarsOutlined } from "@ant-design/icons";
import { apiUrl } from "../Common/Constants";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const { Title } = Typography;

const ExamineAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUsername, setSearchUsername] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null); // State for the selected account

  // Fetch accounts from the API
  const fetchAccounts = async () => {
    try {
      let guides = await axios.get(apiUrl + "guide");
      guides = guides.data.map((guide) => ({ ...guide, type: "guide" }));

      let advertisers = await axios.get(apiUrl + "advertiser");
      advertisers = advertisers.data.map((advertiser) => ({
        ...advertiser,
        type: "advertiser",
      }));

      let sellers = await axios.get(apiUrl + "seller");
      sellers = sellers.data.map((seller) => ({ ...seller, type: "seller" }));

      const combinedArray = [...sellers, ...guides, ...advertisers];
      setAccounts(combinedArray);
    } catch (error) {
      console.error("Error fetching accounts", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle the view details button click
  const handleDetailsView = (account) => {
    setSelectedAccount(account); // Set the selected account
  };

  // Handle accept user
  const handleAccept = () => {
    message.success("User accepted.");
    // Add your logic for accepting the user here (e.g., updating user status)
    setSelectedAccount(null); // Reset selection
  };

  // Handle reject user
  const handleReject = () => {
    message.error("User rejected.");
    // Add your logic for rejecting the user here (e.g., updating user status)
    setSelectedAccount(null); // Reset selection
  };

  // Handle the "View Documents" button click
  const handleViewDocuments = () => {
    if (selectedAccount.documentUrl) {
      window.open(selectedAccount.documentUrl, "_blank"); // Opens the document in a new tab
    } else {
      message.warning("No document available for this account.");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "20px",
      }}
    >
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
        Accepting and Rejecting User Accounts
      </Title>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* If an account is selected, show it in a large card */}
          {selectedAccount ? (
            <Card
              title={`Username: ${selectedAccount.username}`}
              bordered={false}
              style={{
                width: "60%",
                textAlign: "center",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              <p>Account Type: {selectedAccount.type}</p>
              <p>Email: {selectedAccount.email}</p>

              {/* Replace "Additional Information" with "View uploaded document" */}
              <p>
                View uploaded documents:{" "}
                {selectedAccount.documentUrl ? (
                  <Button
                    type="primary" // Same style as "Accept" button
                    size="small"  // Make the View Documents button smaller
                    onClick={handleViewDocuments}
                  >
                    View Documents
                  </Button>
                ) : (
                  <Button
                    type="primary" // Same style as "Accept" button
                    size="small"  // Make the View Documents button smaller
                    onClick={handleViewDocuments}
                  >
                    View Documents
                  </Button>
                )}
              </p>
              <p>
                View uploaded ID:{" "}
                {selectedAccount.documentUrl ? (
                  <Button
                    type="primary" // Same style as "Accept" button
                    size="small"  // Make the View Documents button smaller
                    onClick={handleViewDocuments}
                  >
                    View ID
                  </Button>
                ) : (
                  <Button
                    type="primary" // Same style as "Accept" button
                    size="small"  // Make the View Documents button smaller
                    onClick={handleViewDocuments}
                  >
                    View ID
                  </Button>
                )}
              </p>

              <div style={{ marginTop: 20 }}>
                <Button
                  type="primary"
                  onClick={handleAccept}
                  style={{ marginRight: 10 }}
                >
                  Accept
                </Button>
                <Button
                  type="default"
                  onClick={handleReject}
                >
                  Reject
                </Button>
              </div>
            </Card>
          ) : (
            <Row gutter={16}>
              {accounts.length > 0 ? (
                accounts.map((account) => (
                  <Col
                    span={8}
                    key={account._id}
                    style={{ marginBottom: "16px" }}
                    onClick={() => handleDetailsView(account)} // On click, show the account details
                  >
                    <Card title={`Username: ${account.username}`} bordered={false}>
                      <p>Account Type: {account.type}</p>
                      <p>Email: {account.email}</p>
                      <Button
                        type="default"
                        icon={<BarsOutlined />}
                        onClick={() => handleDetailsView(account)} // Pass the whole account object
                        style={{ color: "blue" }}
                      >
                        View Details
                      </Button>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col span={24} style={{ textAlign: "center" }}>
                  <p>No accounts found.</p>
                </Col>
              )}
            </Row>
          )}
        </>
      )}

      {/* Hover-Expandable Search Component */}
      <div
        style={{
          position: "relative",
          width: "40px",
          transition: "width 0.3s ease",
        }}
      >
       
      
      </div>
    </div>
  );
};

export default ExamineAccounts;
