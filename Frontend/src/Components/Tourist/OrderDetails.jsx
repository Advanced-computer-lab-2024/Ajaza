import React, { useEffect, useState } from "react";
import { Table, Card, Typography, Tag, Divider, Button, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../Common/Constants";

const { Title, Text } = Typography;

const OrderDetails = () => {
  const navigate = useNavigate();
  const { touristId, date } = useParams();
  const [orderr, setOrder] = useState();
  const [loading, setLoading] = useState(true);




const order = {
    "_id": "67451b7b43fd2ca56d15d6a0",
    "products": [
        {
            "_id": "67451b7b43fd2ca56d15d6a1",
            "productId": {
                "_id": "6703bd8d0ece860fb3c89608",
                "name": "choco chip",
                "photo": null,
                "price": 800,
                "desc": "soft cookie",
                "sellerId": "66f6aeca0f0094718a1fd160",
                "sellerName": "seller1",
                "quantity": 0,
                "sales": 0,
                "hidden": false,
                "archived": false,
                "feedback": [],
                "__v": 0
            },
            "quantity": 3
        },
        {
            "_id": "67451b7b43fd2ca56d15d6a2",
            "productId": {
                "_id": "6702f05094e9968d247a473b",
                "name": "adam adham",
                "photo": null,
                "price": 1,
                "desc": "23",
                "adminId": "66f595329d159c1c903c84b0",
                "sellerName": "Ajaza",
                "quantity": 232,
                "sales": 0,
                "hidden": false,
                "archived": false,
                "feedback": [
                    {
                        "touristName": "tourist1",
                        "rating": 5,
                        "comments": "1",
                        "_id": "6730dbbcdddc611c7aa51616"
                    }
                ],
                "__v": 0
            },
            "quantity": 7
        },
        {
            "_id": "67451b7b43fd2ca56d15d6a3",
            "productId": {
                "_id": "6702f03694e9968d247a4737",
                "name": "YOYO",
                "photo": null,
                "price": 123,
                "desc": "YOYO betlef",
                "adminId": "66f595329d159c1c903c84b0",
                "sellerName": "Ajaza",
                "quantity": 2,
                "sales": 0,
                "hidden": false,
                "archived": false,
                "feedback": [
                    {
                        "touristName": "tourist1",
                        "rating": 5,
                        "comments": "ok",
                        "_id": "6730dc18dddc611c7aa516e4"
                    }
                ],
                "__v": 0
            },
            "quantity": 9
        }
    ],
    "date": "2023-11-11T00:00:00.000Z",
    "cod": false,
    "total": 100,
    "status": "Processing"
};






  const fetch = async () => {
    try {
      console.log("hi");
      console.log(date);

     



      let ordersData = await axios.get(`${apiUrl}tourist/orders/${touristId}`);
      let orderss = ordersData.data;
      console.log("3lewa");
      console.log(orderss);
     let matchedOrder = orderss.find((order) => order.date === date);
      console.log(matchedOrder);
      setOrder(matchedOrder);
     
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []); // Fetch new complaint data whenever the ID changes




  const cancelOrder = async () => {
    try {
      await axios.post(`${apiUrl}tourist/orders/cancel/${touristId}`, {
        date: date,
      }); // Assuming this is the API endpoint for canceling the order
      message.success("Order has been canceled successfully.");
      navigate(`/tourist/orders/${touristId}`);
      setOrder({ ...order, status: "Cancelled" });
    } catch (error) {
      console.error("Error canceling order", error);
      message.error("Failed to cancel the order.");
    }
  };

  // Define columns for the products table
  const columns = [
    {
      title: "Product Name",
      dataIndex: ["productId", "name"],
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price (per unit)",
      dataIndex: ["productId", "price"],
      key: "price",
      render: (price) => `$${price}`,
    },
    {
      title: "Total Price",
      key: "totalPrice",
      render: (_, record) => `$${record.quantity * record.productId.price}`,
    },
  ];

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while fetching data
  }

  if (!order) {
    return <div>Order not found</div>; // Show a message if the order is not found
  }

  return (
    <Card style={{ margin: "20px", borderRadius: "8px" }}>
      <Title level={3} style={{ textAlign: "center" }}>
        Order Details
      </Title>
      <Divider />
      <div style={{ marginBottom: "20px" }}>
        <Text strong>Order ID:</Text> {orderr._id}
        <br />
        <Text strong>Order Date:</Text> {new Date(orderr.date).toLocaleDateString()}
        <br />
        <Text strong>Order Status:</Text>{" "}
        <Tag color={orderr.status === "Delivered" ? "green" : orderr.status === "Cancelled" ? "red" : "orange"}>
          {orderr.status}
        </Tag>
        <br />
        <Text strong>Total Amount:</Text> <Text type="success">${orderr.total}</Text>
      </div>



      {orderr.status === "Processing" && (
        <Button type="primary" danger onClick={cancelOrder}>
          Cancel Order
        </Button>
      )}
      <Divider />
      <Title level={4}>Products</Title>
      <Table
        columns={columns}
        dataSource={orderr.products}
        rowKey="_id"
        pagination={false}
      />
    </Card>
  );
};

export default OrderDetails;


