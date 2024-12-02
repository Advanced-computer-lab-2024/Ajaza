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
  Empty,
} from "antd";
import { SearchOutlined, BarsOutlined } from "@ant-design/icons";
import { apiUrl } from "../Common/Constants";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../Common/LoadingSpinner";
import Search from "../Common/Search";
const { Title } = Typography;

const ExamineAccounts = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [allAccounts, setAllAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [searchUsername, setSearchUsername] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null); // State for the selected account
  const [selectedImageId, setSelectedImageId] = useState("");
  const [imageTax, setImageTax] = useState("");

  const [imageCert1, setImageCert1] = useState("");
  const [imageCert2, setImageCert2] = useState("");
  const [imageCert3, setImageCert3] = useState("");

  // Fetch accounts from the API
  const fetchAccounts = async () => {
    try {
      let guides = await axios.get(apiUrl + "guide/pending");
      guides = guides.data.map((guide) => ({ ...guide, type: "guide" }));

      let advertisers = await axios.get(apiUrl + "advertiser/pending");
      advertisers = advertisers.data.map((advertiser) => ({
        ...advertiser,
        type: "advertiser",
      }));
      // let sellerID = await axios.get(apiUrl + "");
      let sellers = await axios.get(apiUrl + "seller/pending");
      console.log(sellers);
      sellers = sellers.data.map((seller) => ({ ...seller, type: "seller" }));

      const combinedArray = [...sellers, ...guides, ...advertisers];
      setAccounts(combinedArray);
      setAllAccounts(combinedArray);
    } catch (error) {
      console.error("Error fetching accounts", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle the view details button click
  const handleDetailsView = async (account) => {
    console.log(account.type);
    // navigate(`/Admin/examine-Accounts/${account._id}`);
    navigate(`/admin/examine-Accounts/${account._id}/${account.type}`);

    if (account.type === "guide") {
      setSelectedAccount(account); // Set the selected account
      let wholeAccountID = account._id;
      let response = await axios.get(
        apiUrl + "guide/details/" + wholeAccountID
      );
      let wholeAccount = response.data;

      // Get the document (taxationRegCard)
      let hisDocument = wholeAccount.certificates;
      for (let i = 0; i < hisDocument.length; i++) {
        switch (i) {
          case 0:
            setImageCert1(hisDocument[i]);
            break;
          case 1:
            setImageCert2(hisDocument[i]);
            break;
          case 3:
            setImageCert3(hisDocument[i]);
            break;
          default:
            setImageCert1(hisDocument[i]);
        }
      }

      let hisID = "http://localhost:3000/" + wholeAccount.id;
      setSelectedImageId(hisID);
    }
    if (account.type === "seller") {
      setSelectedAccount(account); // Set the selected account
      let wholeAccountID = account._id;
      let response = await axios.get(
        apiUrl + "seller/details/" + wholeAccountID
      );
      let wholeAccount = response.data;

      // Get the document (taxationRegCard)
      let hisDocument = "http://localhost:3000/" + wholeAccount.taxationRegCard;
      let hisID = "http://localhost:3000/" + wholeAccount.id;
      setSelectedImageId(hisID);
      setImageTax(hisDocument);
      console.log(wholeAccount.id);
    }

    if (account.type === "advertiser") {
      setSelectedAccount(account); // Set the selected account
      let wholeAccountID = account._id;
      let response = await axios.get(
        apiUrl + "advertiser/details/" + wholeAccountID
      );
      let wholeAccount = response.data;

      // Get the document (taxationRegCard)
      let hisDocument = "http://localhost:3000/" + wholeAccount.taxationRegCard;
      let hisID = "http://localhost:3000/" + wholeAccount.id;
      setSelectedImageId(hisID);
      setImageTax(hisDocument);
      console.log(wholeAccount.id);
    }
  };

  // Handle accept user
  const handleAccept = async () => {
    let accountID = selectedAccount._id;
    if (selectedAccount.type === "seller") {
      await axios.put(apiUrl + `seller/accept/${accountID}`);
    } else if (selectedAccount.type === "guide") {
      await axios.put(apiUrl + `guide/accept/${accountID}`);
    } else if (selectedAccount.type === "advertiser") {
      await axios.put(apiUrl + `advertiser/accept/${accountID}`);
    }

    console.log(accountID);
    message.success("User accepted.");
    fetchAccounts();
    // Add your logic for accepting the user here (e.g., updating user status)
    setSelectedAccount(null); // Reset selection
  };

  // Handle reject user
  const handleReject = async () => {
    let accountID = selectedAccount._id;
    if (selectedAccount.type === "seller") {
      await axios.delete(apiUrl + `seller/reject/${accountID}`);
    } else if (selectedAccount.type === "guide") {
      await axios.delete(apiUrl + `guide/reject/${accountID}`);
    } else if (selectedAccount.type === "advertiser") {
      await axios.delete(apiUrl + `advertiser/reject/${accountID}`);
    }

    console.log(accountID);
    message.success("User rejected.");
    fetchAccounts();
    // Add your logic for accepting the user here (e.g., updating user status)
    setSelectedAccount(null); // Reset selection
  };

  // Handle the "View Documents" button click
  const handleViewDocuments = async () => {
    try {
      // Fetch account details based on the selected account ID
      let wholeAccountID = selectedAccount._id;
      let response = await axios.get(
        apiUrl + "advertiser/details/" + wholeAccountID
      );
      let wholeAccount = response.data;

      // Get the document (taxationRegCard)
      let hisDocument = wholeAccount.taxationRegCard;

      console.log("ali");
      console.log(wholeAccountID);
      console.log(wholeAccount.username);
      console.log(hisDocument);

      // Assuming 'hisDocument' contains the relative file path (e.g., 'uploads/filename.jpg')
      if (hisDocument) {
        const documentUrl = `${apiUrl}${hisDocument}`; // Construct full URL for the document
        console.log("Document URL: ", documentUrl);

        // Trigger file download
        const link = document.createElement("a");
        link.href = documentUrl;
        link.download = hisDocument.split("/").pop(); // Extract the filename (e.g., '672aaa0423d7c7fd08fefb83.jpg')
        link.click(); // Programmatically click the link to download the file
      } else {
        message.warning("No document available for this account.");
      }
    } catch (error) {
      // Handle errors (e.g., failed API call, missing data)
      console.error(
        "Error fetching account details or downloading document:",
        error
      );
      message.error("Failed to fetch account details or document.");
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
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "20px",
      }}
    >
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
        Accepting and Rejecting User Accounts
      </Title>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
         <Search
            activateHover={false}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            style={{ width: "600px" }}
            inputStyleParam={{ paddingLeft: "40px" }}
          />
          </div>

      {loading ? (
        <LoadingSpinner />
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

              <h3>ID:</h3>
              <img
                src={selectedImageId}
                alt={selectedImageId}
                width="500px"
                height="500px"
              />
              <hr />
              <h3>Taxation Registry card:</h3>
              <img src={imageTax} alt={imageTax} width="500px" height="500px" />
              <div style={{ marginTop: 20 }}>
                <Button
                  type="primary"
                  onClick={handleAccept}
                  style={{ marginRight: 10 , backgroundColor:"#5b8b77" }}
                >
                  Accept
                </Button>
                <Button type="primary" onClick={handleReject} style={{backgroundColor:"#5b8b77"}}>
                  Reject
                </Button>
              </div>
            </Card>
          ) : (









            <Row
            gutter={[
              accounts.length <= 3 ? 120 : 16, // Adjust horizontal spacing for 3 cards
              16, // Keep vertical gutter consistent
            ]}
            justify={accounts.length === 3 ? "space-around" : "center"} // Adjust justification for 3 cards
          >
            {accounts.length > 0 ? (
              <>
                {accounts.map((account) => (
                  <Col
                    span={8}
                    key={account._id}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: accounts.length === 2 ? "40px" : "20px", // Extra bottom margin for two cards
                    }}
                    onClick={() => handleDetailsView(account)}
                  >
                    <Card
                      title={`Username: ${account.username}`}
                      bordered={false}
                      style={{
                        width: "300px",
                        minHeight: "200px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      <p>{`Account Type: ${account.type}`}</p>
                      <p
                        style={{
                          wordBreak: "break-word", // Ensures the text wraps to the next line
                          overflow: "hidden", // Prevents content from spilling
                          textOverflow: "ellipsis", // Adds "..." for long overflowed text
                          whiteSpace: "nowrap", // Keeps text on one line, combined with ellipsis
                        }}
                      >
                        {`Email: ${account.email}`}
                      </p>
                      <Button
                        type="default"
                        icon={<BarsOutlined />}
                        onClick={() => handleDetailsView(account)}
                        style={{ color: "#1b696a" }}
                      >
                        View Details
                      </Button>
                    </Card>
                  </Col>
                ))}
                {/* Add filler columns to maintain consistent spacing */}
                {accounts.length % 3 !== 0 &&
                  Array.from(
                    { length: 3 - (accounts.length % 3) },
                    (_, index) => (
                      <Col
                        span={8}
                        key={`filler-${index}`}
                        style={{ visibility: "hidden" }}
                      >
                        <Card
                          bordered={false}
                          style={{ width: "300px", minHeight: "200px" }}
                        />
                      </Col>
                    )
                  )}
              </>
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
      ></div>
    </div>
  );
};

export default ExamineAccounts;
