

import React, { useEffect, useState } from "react";
import { message , Card, Button} from "antd";
import axios from "axios";
import { apiUrl } from "../Common/Constants"; 
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { BarsOutlined } from "@ant-design/icons";

const Complaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [touristId, setTouristId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userDetails = decodedToken.userDetails;
      setTouristId(userDetails._id);
    }
  }, []);

  useEffect(() => {
    const fetchComplaints = async () => {
      if (touristId) {
        try {
          const response = await axios.get(`${apiUrl}complaint/myComplaints/${touristId}`);
          console.log( response); 
          console.log(response.data);
          setComplaints(response.data);
  
        } catch (error) {
          message.error(error.response?.data?.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchComplaints();
  }, [touristId]);

  const handleDetailsView = async (complaint) => {
    navigate(`/tourist/complaints/${complaint._id}`);
   // setSelectedComplaint(complaint); // Set the selected complaint
  };

  return (
    <div>
      <h2>My Complaints</h2>
      {loading ? (
        <p>Loading complaints...</p>
      ) : complaints.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",       
            gap: "16px",             
            justifyContent: "flex-start" 
          }}
        >
          {complaints.map((complaint) => (
            <Card
              key={complaint._id}
              title={complaint.title}
              bordered={false} 
              style={{
                width: "100%",
                maxWidth: "300px",     
                marginBottom: "16px",  
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                padding: "16px"
              }}
            >
              
              <p><strong>Status:</strong> {complaint.pending ? "Pending" : "Resolved"}</p>
              <p><strong>Date:</strong> {new Date(complaint.date).toLocaleDateString()}</p>
              <Button
                      type="default"
                      icon={<BarsOutlined />}
                      onClick={() => handleDetailsView(complaint)}
                      style={{ color: "#1b696a" }}
                    >
                      View Details
                    </Button>
              
            </Card>
          ))}
        </div>
      ) : (
        <p>No complaints filed.</p>
      )}
    </div>
  );
  };
export default Complaints;  