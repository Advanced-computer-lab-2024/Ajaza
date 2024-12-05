import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  Button,
  Dropdown,
  message,
  Input,
  Menu,
} from "antd";
import { BarsOutlined } from "@ant-design/icons";
import { apiUrl } from "../Common/Constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ComplaintDetails from "./ComplaintDetails";

const { Title } = Typography;

const TouristsComplaints = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null); // State for the selected account

  const [isDescending, setIsDescending] = useState(true); // Initial state for sorting order

  const [reply, setReply] = useState("");

  // Function to toggle sort order
  const toggleSortOrder = (order) => {
    setIsDescending(order === "desc");
    const sortedComplaints = [...complaints].sort((a, b) =>
      order === "desc"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date)
    );
    setComplaints(sortedComplaints);
  };

  // Fetch complaints from the API
  const fetchComplaints = async () => {
    try {
      let response = await axios.get(apiUrl + "complaint");
      let complaintsData = response.data.map((complaint) => {
        let updatedComplaint = { ...complaint };
        updatedComplaint.status = updatedComplaint.pending
          ? "pending"
          : "resolved";
        return updatedComplaint;
      });
      //.filter((complaint) => complaint.status === "pending");

      // Sort complaints by default (descending)
      complaintsData = complaintsData.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setComplaints(complaintsData);
    } catch (error) {
      console.error("Error fetching complaints", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle the view details button click
  const handleDetailsView = async (complaint) => {
    navigate(`/Admin/tourists-Complaints/${complaint._id}`);
    setSelectedComplaint(complaint); // Set the selected complaint
  };

  // Handle accept complaint
  const handleAccept = async () => {
    let complaintID = selectedComplaint._id;
    await axios.put(apiUrl + `complaint/resolve/${complaintID}`);
    fetchComplaints();
    setSelectedComplaint(null); // Reset selection
  };

  // Handle reject complaint
  const handleReject = async () => {
    fetchComplaints();
    setSelectedComplaint(null); // Reset selection
  };

  const handleSendReply = async () => {
    if (!reply) {
      message.error("Please enter a reply.");
      return;
    }

    // Assuming the API expects a POST request to add a reply to a complaint
    try {
      const response = await axios.post(
        apiUrl + `complaint/reply/${selectedComplaint._id}`,
        { body: reply }
      );
      setReply(""); // Clear the input field after sending
      message.success("Reply sent successfully!");
      fetchComplaints(); // Re-fetch complaints to update the view
    } catch (error) {
      console.error("Error sending reply", error);
      message.error("Failed to send reply.");
    }
  };

  const handleOptionOne = async () => {
    let response = await axios.get(apiUrl + "complaint");
    let complaintsData = response.data.map((complaint) => {
      let updatedComplaint = { ...complaint };
      updatedComplaint.status = updatedComplaint.pending
        ? "pending"
        : "resolved";
      return updatedComplaint;
    });
    //.filter((complaint) => complaint.status === "pending");

    // Sort complaints by default (descending)
    complaintsData = complaintsData.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    //setComplaints(complaintsData);

    //  fetchComplaints();
    const filteredComplaints = complaintsData.filter(
      (complaint) => complaint.status === "pending"
    );
    setComplaints(filteredComplaints);
    message.info("Pending complaints selected");
  };

  const handleOptionTwo = async () => {
    let response = await axios.get(apiUrl + "complaint");
    let complaintsData = response.data.map((complaint) => {
      let updatedComplaint = { ...complaint };
      updatedComplaint.status = updatedComplaint.pending
        ? "pending"
        : "resolved";
      return updatedComplaint;
    });
    //.filter((complaint) => complaint.status === "pending");

    // Sort complaints by default (descending)
    complaintsData = complaintsData.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // setComplaints(complaintsData);

    //  fetchComplaints();
    const filteredComplaints = complaintsData.filter(
      (complaint) => complaint.status === "resolved"
    );
    setComplaints(filteredComplaints);
    message.info("Resolved complaints selected");
  };

  const handleOptionThree = () => {
    // Show all complaints
    fetchComplaints(); // Re-fetch all complaints to reset to the full list
    message.info("All complaints selected");
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Dropdown menu for sorting
  const sortMenu = (
    <Menu>
      <Menu.Item onClick={() => toggleSortOrder("desc")}>
        Newest First
      </Menu.Item>
      <Menu.Item onClick={() => toggleSortOrder("asc")}>Oldest First</Menu.Item>
    </Menu>
  );
  const menu = (
    <Menu>
      <Menu.Item onClick={handleOptionOne}>Pending</Menu.Item>
      <Menu.Item onClick={handleOptionTwo}>Resolved</Menu.Item>
      <Menu.Item onClick={handleOptionThree}>All</Menu.Item>
    </Menu>
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "20px",
        position: "relative", // Make the parent container relative
        width: "100%", // Ensure the div takes the full width
      }}
    >
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
        Complaints
      </Title>

      <Dropdown overlay={menu} trigger={["click"]}>
        <Button
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: "#1b696a", // Blue color
            color: "white", // White text
            marginTop: "20px", // Push it down a bit from the top
            marginRight: "300px", // Add some space from the right edge
          }}
        >
          Filter
        </Button>
      </Dropdown>

      {/* Dropdown Button for Sorting - Positioned at the top right of the component */}
      <Dropdown overlay={sortMenu} trigger={["click"]}>
        <Button
          type="primary"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            marginTop: "20px", // Push it down a bit from the top
            marginRight: "20px", // Add some space from the right edge
            backgroundColor: "#1b696a",
          }}
        >
          Sort by Date ({isDescending ? "Newest First" : "Oldest First"})
        </Button>
      </Dropdown>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* If a complaint is selected, show it in a large card */}
          {selectedComplaint ? (
            <div>
              <Card
                title={`${selectedComplaint.title}`}
                bordered={false}
                style={{
                  width: "100%",
                  textAlign: "center",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                }}
              >
                <p>
                  <strong>Body:</strong> {selectedComplaint.body}
                </p>
                <p>
                  <strong>Date: </strong>
                  {new Date(selectedComplaint.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Status:</strong> {selectedComplaint.status}
                </p>

                <div style={{ marginTop: 20 }}>
                  <Button
                    type="primary"
                    onClick={handleAccept}
                    style={{ marginRight: 10 }}
                  >
                    Resolve
                  </Button>
                  <Button type="default" onClick={handleReject}>
                    Reply
                  </Button>
                </div>
              </Card>
              <p>
                <h3>Replies: </h3>
              </p>

              {/* Display each word as a separate card */}
              {selectedComplaint.body.split(" ").map((word, index) => (
                <Card key={index} style={{ marginBottom: "10px" }}>
                  <p>{word}</p>
                </Card>
              ))}

              {/* Text Box and Send Button for reply */}
              <div style={{ marginTop: "20px" }}>
                <Input.TextArea
                  rows={4}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write a reply..."
                />
                <Button
                  type="primary"
                  onClick={handleSendReply}
                  style={{ marginTop: "10px" , backgroundColor: "#1b696a" }}
                >
                  Send Reply
                </Button>
              </div>
            </div>
          ) : (
            <Row
            gutter={[
              complaints.length <= 3 ? 120 : 16, // Adjust horizontal spacing for 3 cards
              16, // Keep vertical gutter consistent
            ]}
            justify={complaints.length === 3 ? "space-around" : "center"} // Adjust justification for 3 cards
          >
            {complaints.length > 0 ? (
              <>
                {complaints.map((complaint) => (
                  <Col
                    span={8}
                    key={complaint._id}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: complaints.length === 2 ? "40px" : "20px", // Extra bottom margin for two cards
                    }}
                    onClick={() => handleDetailsView(complaint)}
                  >
                    <Card
                      title={`Title: ${complaint.title}`}
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
                      <p>
                        <strong>Status: </strong> {complaint.status}
                      </p>
                      <p>
                        <strong>Date: </strong>{" "}
                        {new Date(complaint.date).toLocaleDateString()}
                      </p>
                      <Button
                        type="default"
                        icon={<BarsOutlined />}
                        onClick={() => handleDetailsView(complaint)}
                        style={{ color: "#1b696a" }}
                      >
                        View Details
                      </Button>
                    </Card>
                  </Col>
                ))}
                {/* Add filler columns to maintain consistent spacing */}
                {complaints.length % 3 !== 0 &&
                  Array.from(
                    { length: 3 - (complaints.length % 3) },
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
                <p>No complaints found.</p>
              </Col>
            )}
          </Row>
          
          
          )}
        </>
      )}
    </div>
  );
};

export default TouristsComplaints;
