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
import { useParams, useNavigate } from "react-router-dom";

const { Title } = Typography;

const Orders = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); // State for the selected account
  const { id } = useParams();

  const [isDescending, setIsDescending] = useState(true); // Initial state for sorting order

  // Function to toggle sort order

  // Fetch complaints from the API
  const fetchOrders = async () => {
    try {
      let ordersData = await axios.get(`${apiUrl}tourist/orders/${id}`);
      const filteredOrders = ordersData.data.filter(
        (order) => order.status === "Processing"
      );

      //  let ordersData = await axios.get(apiUrl + "tourist/orders/66f6afa80f0094718a203f1d");

      //.filter((complaint) => complaint.status === "pending");

      // Sort complaints by default (descending)

      //setOrders(ordersData.data);
      setOrders(filteredOrders);
      console.log("ali");
      console.log(ordersData);
    } catch (error) {
      console.error("Error fetching orders", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle the view details button click
  const handleDetailsView = async (order) => {
    //  `/tourist/orders/${order._id}/${id}`
    navigate(`/tourist/orders/${id}/${order.date}`);
    // setSelectedOrder(order); // Set the selected complaint
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Dropdown menu for sorting

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
        Current Orders
      </Title>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* If a complaint is selected, show it in a large card */}
          {selectedOrder ? (
            <div></div>
          ) : (
            <Row
              gutter={[
                orders.length <= 3 ? 120 : 16, // Adjust horizontal spacing for 3 cards
                16, // Keep vertical gutter consistent
              ]}
              justify={orders.length === 3 ? "space-around" : "center"} // Adjust justification for 3 cards
            >
              {orders.length > 0 ? (
                <>
                  {orders.map((order) => (
                    <Col
                      span={8}
                      key={order._id}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: orders.length === 2 ? "40px" : "20px", // Extra bottom margin for two cards
                      }}
                      onClick={() => handleDetailsView(order)}
                    >
                      <Card
                        title={`Date: ${new Date(
                          order.date
                        ).toLocaleDateString()}`}
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
                          <strong>Status: </strong> {order.status}
                        </p>
                        <p>
                          <strong>Total Amount: </strong> {`${order.total}`}
                        </p>
                        <Button
                          type="default"
                          icon={<BarsOutlined />}
                          onClick={() => handleDetailsView(order)}
                          style={{ color: "#1b696a" }}
                        >
                          View Details
                        </Button>
                      </Card>
                    </Col>
                  ))}
                  {/* Add filler columns to maintain consistent spacing */}
                  {orders.length % 3 !== 0 &&
                    Array.from(
                      { length: 3 - (orders.length % 3) },
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
                  <p>No orders found.</p>
                </Col>
              )}
            </Row>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
