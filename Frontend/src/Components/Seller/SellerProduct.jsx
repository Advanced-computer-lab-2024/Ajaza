import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import CustomButton from "../Common/CustomButton";
import { CustomLayout } from "../Common";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Product = () => {
  const [productData, setProductData] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [newSellerId, setNewSellerId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoddedToken = jwtDecode(token);
    setNewSellerId(decoddedToken.userDetails["_id"]);
  }, []);

  // Function to handle form submission
  const onFinish = async (values) => {
    const { quantity, desc, price, name } = values;
    try {
      const response = await axios.post(
        `http://localhost:5000/product/${newSellerId}/product/adminSellerAddProduct`,
        {
          name: values.name,
          price: values.price,
          desc: values.desc,
          quantity: values.quantity,
        }
      );
      const prodId = response.data._id;
      console.log("prod ID:", prodId);

      setProductData(response.data);
      message.success("Product added successfully!");

      navigate("/display", {
        state: {
          name,
          desc,
          price,
          quantity,
          newSellerId,
          prodId,
        },
      });
    } catch (error) {
      message.error(
        "Failed to add product. Please try again." + error.response.data.error
      );
      console.log(error);

      console.error("Fetch error:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <CustomLayout>
      <div
        style={{ textAlign: "center", alignItems: "center", marginTop: "20px" }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Add Product</h1>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600, width: "100%" }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input.TextArea
              value={name}
              onChange={(e) => setName(e.target.value)}
              rows={2}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="desc"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input.TextArea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={2}
            />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <Input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
            />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Please input the quantity!" }]}
          >
            <Input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              type="number"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <CustomButton
              type="default"
              htmlType="submit"
              value="Save"
              size={"m"}
            />
          </Form.Item>
        </Form>
      </div>
    </CustomLayout>
  );
};

export default Product;
