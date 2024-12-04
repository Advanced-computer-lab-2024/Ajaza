

import React, { useEffect, useState } from "react";
import { message , Card, Button , Form, Modal , Input} from "antd";
import axios from "axios";
import { apiUrl } from "../Common/Constants"; 
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { BarsOutlined } from "@ant-design/icons";
import LoadingSpinner from "../Common/LoadingSpinner";
import CustomButton from "../Common/CustomButton";


const Complaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [touristId, setTouristId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


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

  const currentDate = new Date().toLocaleDateString();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();


  const handleSubmit = async (values) => {
    const { title, body } = values;

    try {
      const response = await axios.post(
        `${apiUrl}complaint/fileComplaint/${touristId}`,
        {
          title,
          body,
        }
      );
      form.setFieldsValue({ title: "", body: "" });
      form.resetFields();
      setIsModalOpen(false);
      message.success(response.data.message);
      localStorage.setItem("selectedMenuKey", 8);

      //navigate("../Complaints");
    } catch (error) {
      message.error("Failed to file complaint.");
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h2>My Complaints</h2>
      <CustomButton
      value={"File Complaint"}
      size={"s"}
      onClick={showModal}
      />
        <Modal  open={isModalOpen} footer={null} onCancel={handleCancel}>
        <div
      style={{
        padding: "20px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        style={{
          background: "#fff",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          width: "400px",
        }}
      >
        <h2 style={{ fontSize: "20px", textAlign: "center" }}>
          File a Complaint
        </h2>
        <p style={{ textAlign: "center" }}>Date: {currentDate}</p>
        <Form onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="title"
            rules={[{ required: true, message: "Title is required." }]}
          >
            <Input placeholder="Title" />
          </Form.Item>
          <Form.Item
            name="body"
            rules={[
              { required: true, message: "Problem description is required." },
            ]}
          >
            <Input.TextArea
              autoSize={{ minRows: 3, maxRows: 6 }}
              placeholder="Problem"
            />
          </Form.Item>
          <Form.Item>
            <CustomButton size="s" value="File Complaint" htmlType="submit" style={{left:90}}/>
          </Form.Item>
        </Form>
      </Card>
    </div>
    </Modal>

    
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