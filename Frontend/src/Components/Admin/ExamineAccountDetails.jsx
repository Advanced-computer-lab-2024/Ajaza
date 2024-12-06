import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl, Colors } from "../Common/Constants";
import { Card, Typography, message, Button, Modal } from "antd";

const ExamineAccountDetails = () => {
  const navigate = useNavigate();
  const { accountId, accountType } = useParams();
  const [account, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        if (accountType === "guide") {
          const response = await axios.get(
            `${apiUrl}guide/details/${accountId}`
          );
          const wholeAccount = response.data;
          setSelectedAccount(wholeAccount);

          setCertificates(
            wholeAccount.certificates.map(
              (cert) => `http://localhost:3000/${cert}`
            )
          );
        } else if (accountType === "seller" || accountType === "advertiser") {
          const response = await axios.get(
            `${apiUrl}${accountType}/details/${accountId}`
          );
          const wholeAccount = response.data;
          setSelectedAccount(wholeAccount);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching account details", error);
        message.error("Failed to fetch account details.");
      }
    };

    fetchAccountDetails();
  }, [accountId, accountType]);

  const handleAccept = async () => {
    try {
      await axios.put(`${apiUrl}${accountType}/accept/${accountId}`);
      message.success("User accepted.");
      navigate(`/Admin/examine-Accounts`);
    } catch (error) {
      message.error("Failed to accept user.");
    }
  };

  const handleReject = async () => {
    try {
      await axios.delete(`${apiUrl}${accountType}/reject/${accountId}`);
      message.success("User rejected.");
      navigate(`/admin/examine-Accounts`);
    } catch (error) {
      message.error("Failed to reject user.");
    }
  };

  const openModal = (images) => {
    setModalImages(images);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalImages([]);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h3>Pending Account Details</h3>
      <Card
        title={`Username: ${account.username}`}
        bordered={false}
        style={{
          width: "60%",
          textAlign: "center",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          marginLeft: "250px",
        }}
      >
        <p>Account Type: {accountType}</p>
        <p>Email: {account.email}</p>

        <h3>ID:</h3>
        <Typography.Link onClick={() => openModal([`http://localhost:3000/${account.id}`])}>
          View ID Image
        </Typography.Link>
        <hr />

        {accountType === "guide" && (
          <>
            <h3>Certificates:</h3>
            <Typography.Link onClick={() => openModal(certificates)}>
              View Certificates
            </Typography.Link>
          </>
        )}

        {(accountType === "seller" || accountType === "advertiser") && (
          <>
            <h3>Taxation Registry Card:</h3>
            <Typography.Link onClick={() => openModal([`http://localhost:3000/${account.taxationRegCard}`])}>
              View Taxation Registry Card
            </Typography.Link>
          </>
        )}

        <div style={{ marginTop: 20 }}>
          <Button
            type="primary"
            onClick={handleAccept}
            style={{ marginRight: 10, backgroundColor: Colors.primary.default }}
          >
            Accept
          </Button>
          <Button
            type="default"
            onClick={handleReject}
            style={{ color: "red" }}
          >
            Reject
          </Button>
        </div>
      </Card>

      <Modal
        visible={modalVisible}
        footer={null}
        onCancel={closeModal}
        centered
        bodyStyle={{ textAlign: "center" }}
      >
        {modalImages.map((image, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <img src={image} alt={`Certificate ${index + 1}`} style={{ width: "100%" }} />
          </div>
        ))}
      </Modal>
    </div>
  );
};

export default ExamineAccountDetails;
