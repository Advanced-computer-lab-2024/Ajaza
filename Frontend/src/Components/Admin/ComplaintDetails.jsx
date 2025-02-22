// All imports at the top
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../Common/Constants";
import { Card, Button, Input, message, Timeline, Radio } from "antd";
import { Color } from "antd/es/color-picker";
import { Colors } from "../Common/Constants";

const token = localStorage.getItem("token");

// Define ComplaintRepliesTimeline as a separate component
const ComplaintRepliesTimeline = ({ complaint }) => {
  const [mode, setMode] = useState("left");

  const onChange = (e) => {
    setMode(e.target.value);
  };

  return (
    <>
      <Card
        bordered={false}
        style={{
          width: "100%",
          textAlign: "center",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Timeline
          mode={mode}
          items={
            complaint.replies?.map((reply) => ({
              label:
                (reply.name === "Admin" ? "You" : reply.name) +
                ":    " +
                new Date(reply.date).toLocaleDateString(),
              children: reply.text,
            })) || []
          }
        />
      </Card>
    </>
  );
};

const ComplaintDetails = () => {
  const { id } = useParams(); // Get the complaint ID from the URL
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const navigate = useNavigate();

  const fetchComplaintDetails = async () => {
    try {
      const response = await axios.get(`${apiUrl}complaint/${id}`);
      const complaint = {
        ...response.data,
        status: response.data.pending ? "pending" : "resolved", // Add the 'status' based on 'pending'
      };
      setComplaint(complaint);
    } catch (error) {
      console.error("Error fetching complaint details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaintDetails();
  }, [id]); // Fetch new complaint data whenever the ID changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!complaint) {
    return <div>Complaint not found</div>;
  }

  const handleAccept = async () => {
    let complaintID = complaint._id;
    await axios.put(apiUrl + `complaint/resolve/${complaintID}`);
    navigate(`/Admin/tourists-Complaints`);
  };

  const handleSendReply = async () => {
    if (!reply) {
      message.error("Please enter a reply.");
      return;
    }

    try {
      await axios.post(apiUrl + `complaint/replies/${complaint._id}`, {
        text: reply,
        name: "Admin",
      });
      setReply(""); // Clear the input field after sending
      message.success("Reply sent successfully!");
      fetchComplaintDetails();
    } catch (error) {
      console.error("Error sending reply", error);
      message.error("Failed to send reply.");
    }
  };

  return (
    <div>
      <h3>Complaint Details</h3>
      <Card
        title={`${complaint.title}`}
        bordered={false}
        style={{
          width: "100%",
          textAlign: "center",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <p>
          <strong>Body: </strong>
          {complaint.body}
        </p>
        <p>
          <strong>Date: </strong>{" "}
          {new Date(complaint.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Status:</strong> {complaint.status}
        </p>

        {complaint?.pending ? (
          <div style={{ marginTop: 20 }}>
            <Button
              type="primary"
              onClick={handleAccept}
              style={{
                marginRight: 10,
                backgroundColor: Colors.primary.default,
              }}
            >
              Resolve
            </Button>
          </div>
        ) : null}
      </Card>
      <br />
      <br />
      <h3>Replies:</h3>
      <ComplaintRepliesTimeline complaint={complaint} />

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
          style={{ marginTop: "10px", backgroundColor: Colors.primary.default }}
        >
          Send Reply
        </Button>
      </div>
    </div>
  );
};

export default ComplaintDetails;
