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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const { username, password, accountType } = values;

    try {
      if (accountType === "admin") {
        const response = await axios.post(apiUrl + "admin/addAdmin", {
          username: username,
          pass: password,
        });
      }
      if (accountType === "tourismGovernor") {
        const response = await axios.post(apiUrl + "governor/addGovernor", {
          // Update URL here
          username: values.username,
          pass: values.password, // Ensure the password field matches your API
        });
      }
      await fetchAccounts();

      //form.setFieldsValue({ username: "", password: "" });
      form.resetFields();
      setIsModalOpen(false);
      // message.success(response.data.message);
      localStorage.setItem("selectedMenuKey", 8);

      //navigate("../Complaints");
    } catch (error) {
      message.error("Failed to add account");
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
            justifyContent: "end",
            marginBottom: "15px",
          }}
        >
          <Button
            style={{
              backgroundColor: Colors.primary.default,
              border: "none",
              width: "30px",
              height: "30px",
              marginLeft: "auto",
            }}
            icon={<PlusOutlined style={{ color: "white" }} />}
            rounded={true}
            onClick={showModal}
          />
        </div>
        <Modal open={isModalOpen} footer={null} onCancel={handleCancel}>
          <div
            style={{
              background: "#ffffff",
              textAlign: "center",
              padding: "0 20px",
            }}
          >
            <h2 style={{ fontSize: "20px", textAlign: "center" }}>
              Add Account
            </h2>
            <p style={{ textAlign: "center" }}></p>
            <Form form={form} onFinish={handleSubmit} layout="vertical">
              {/* Account Type Selector */}
              <Form.Item
                name="accountType"
                rules={[
                  { required: true, message: "Account type is required." },
                ]}
              >
                <Select placeholder="Select Account Type">
                  <Select.Option value="admin">Admin</Select.Option>
                  <Select.Option value="tourismGovernor">
                    Tourism Governor
                  </Select.Option>
                </Select>
              </Form.Item>

              {/* Username Input */}
              <Form.Item
                name="username"
                rules={[{ required: true, message: "Username is required." }]}
              >
                <Input placeholder="Username" />
              </Form.Item>

              {/* Password Input */}
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Password is required." }]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>

              {/* Submit Button */}
              <Form.Item style={{ marginBottom: "0" }}>
                <CustomButton
                  size="s"
                  value="Add Account"
                  style={{ width: "120px" }}
                  htmlType="submit"
                />
              </Form.Item>
            </Form>
          </div>
        </Modal>
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
        ) : accounts.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "22% 22% 22% 22%",
              gridGap: "4%",
            }}
          >
            {accounts.map((account) => (
              <Col key={account._id} style={{ marginBottom: "16px" }}>
                <Card title={account.username}>
                  <p>
                    <strong>Account Type:</strong> {account.type}
                  </p>
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
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <Empty />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAccounts;
