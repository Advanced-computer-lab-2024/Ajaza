import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  message,
  Input,
  Form,
  Empty,
  Button,
  Modal,
  Select,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons"; // Import the Delete icon
import { apiUrl, Colors } from "../Common/Constants";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import SearchFilterSortContainer from "../Common/SearchFilterSortContainer";
import Search from "../Common/Search";
import LoadingSpinner from "../Common/LoadingSpinner";
import CustomButton from "../Common/CustomButton";
const { Title } = Typography;

const AllAccounts = () => {
  const [allAccounts, setAllAccounts] = useState([]); // Store all accounts
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [isHovered, setIsHovered] = useState(false); // State to manage hover effect

  // Fetch accounts from the API
  const fetchAccounts = async () => {
    const oneOfWhich = 1;
    if (oneOfWhich == 0) {
      console.log("ali");
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
    } else {
      try {
        let guides = await axios.get(apiUrl + "guide/accepted");

        guides = guides.data.map((guide) => {
          return {
            ...guide,
            type: "guide",
          };
        });

        let advertisers = await axios.get(apiUrl + "advertiser/accepted");

        advertisers = advertisers.data.map((advertiser) => {
          return {
            ...advertiser,
            type: "advertiser",
          };
        });

        let governors = await axios.get(apiUrl + "governor/getAllGov");

        governors = governors.data.map((governor) => {
          return {
            ...governor,
            type: "governor",
          };
        });

        let tourists = await axios.get(apiUrl + "tourist");

        tourists = tourists.data.map((tourist) => {
          return {
            ...tourist,
            type: "tourist",
          };
        });

        let sellers = await axios.get(apiUrl + "seller/accepted");
        sellers = sellers.data.map((seller) => ({
          ...seller,
          type: "seller",
        }));

        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const userId = decoded.userDetails._id;
        console.log(userId);

        let admins = await axios.get(apiUrl + "admin");
        admins = admins.data.map((admin) => ({
          ...admin,
          type: "admin",
        }));
        admins = admins.filter((admin) => {
          return admin._id != userId;
        });

        const combinedArray = [
          ...tourists,
          ...sellers,
          ...guides,
          ...advertisers,
          ...governors,
        ];
        setAccounts(combinedArray);
        setAllAccounts(combinedArray);
      } catch (exception) {
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle delete account
  const handleDelete = async (accountId, accountType) => {
    console.log(accountType + " ali" + accountId);

    try {
      setLoading(true);

      // Determine the correct endpoint based on the user type
      let deleteUrl;
      if (accountType === "tourist") {
        deleteUrl = `${apiUrl}tourist/deleteTouristFromSystem/${accountId}`;
      } else if (accountType === "seller") {
        deleteUrl = `${apiUrl}seller/deleteSellerFromSystem/${accountId}`;
      } else if (accountType === "guide") {
        deleteUrl = `${apiUrl}guide/deleteGuideFromSystem/${accountId}`;
      } else if (accountType === "advertiser") {
        deleteUrl = `${apiUrl}advertiser/deleteAdvertiserFromSystem/${accountId}`;
      } else if (accountType === "governor") {
        deleteUrl = `${apiUrl}governor/deleteGovernorFromSystem/${accountId}`;
      } else if (accountType === "admin") {
        deleteUrl = `${apiUrl}admin/deleteAdminFromSystem/${accountId}`;
      } else {
        throw new Error("Unknown account type");
      }

      // Make the delete request
      await axios.delete(deleteUrl);

      // Update the UI state by removing the deleted account
      setAccounts(accounts.filter((account) => account.id !== accountId));
      await fetchAccounts();

      message.success("Account deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      message.error("Failed to delete the account");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchValue) {
      const filteredAccounts = allAccounts.filter((account) =>
        account.username.toLowerCase().includes(searchValue.toLowerCase())
      );
      setAccounts(filteredAccounts);
    } else {
      setAccounts(allAccounts); // Reset to all accounts when search is empty
    }
  }, [searchValue, allAccounts]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
      }}
    >
      <div style={{ flex: 1 }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
          Accepted Accounts
        </Title>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <Search
            activateHover={false}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            style={{ width: "600px" }}
            inputStyleParam={{ paddingLeft: "40px" }}
          />
        </div>

        {loading ? (
          <div> Loading...</div>
        ) : (
          <Row gutter={16}>
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <Col
                  span={4}
                  key={account._id}
                  style={{ marginBottom: "16px" }}
                >
                  <Card title={account.username}>
                    <p>Type: {account.type}</p>
                    <Button
                      type="default"
                      icon={<DeleteOutlined />} // Use the delete icon here
                      onClick={() => handleDelete(account._id, account.type)}
                      style={{ color: "red" }} // Optional: Change color to red
                    >
                      Delete
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
      </div>
    </div>
  );
};

export default AllAccounts;
