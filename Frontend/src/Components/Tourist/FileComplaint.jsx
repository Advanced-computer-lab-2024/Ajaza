

import React, { useState, useEffect } from "react";
import { Input, message } from "antd";
import axios from "axios";
import { apiUrl } from "../Common/Constants";
import { jwtDecode } from "jwt-decode"; 
import CustomButton from "../Common/CustomButton";

const FileComplaint = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [touristId, setTouristId] = useState(null); 


  const currentDate = new Date().toLocaleDateString(); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userDetails = decodedToken.userDetails;
      console.log(userDetails);
      setTouristId(userDetails._id);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !body) {
      message.error("Title and body are required.");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}complaint/fileComplaint/${touristId}`, {
        title,
        body,
      });
      message.success(response.data.message);
      setTitle("");
      setBody("");
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to file complaint.");
    }
  };

  return (
    <div>
      <h2>File a Complaint</h2>
      <p>Date: {currentDate}</p> 
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div>
          <label>
            Title:
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Problem:
            <Input.TextArea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={4}
            />
          </label>
        </div>
        <CustomButton size="s" value="File Complaint" htmlType="submit">
          File Complaint
        </CustomButton>
      </form>
    </div>
  );
};

export default FileComplaint; 
