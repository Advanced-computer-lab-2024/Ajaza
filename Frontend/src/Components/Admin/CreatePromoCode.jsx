import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Typography,
  Modal,
  Input,
  message,
  Form,
  InputNumber,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  MinusOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { apiUrl } from "../Common/Constants";

const { Title } = Typography;

const CreatePromoCode = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPromoCode, setCurrentPromoCode] = useState(null);
  const [updatedValue, setUpdatedValue] = useState("");
  const [newPromoCode, setNewPromoCode] = useState({ code: "", value: null });
  const [addingPromoCode, setAddingPromoCode] = useState(false);

  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        const response = await axios.get(apiUrl + "Promocode");
        setPromoCodes(response.data);
      } catch (error) {
        console.error(error);
        message.error("Failed to load promo codes.");
      }
    };

    fetchPromoCodes();
  }, []);

  //const showUpdateModal = (promoCode) => {
  //setCurrentPromoCode(promoCode);
  //setUpdatedValue(promoCode.value * 100);
  //setIsModalVisible(true);
  //};

  // const handleUpdate = async () => {
  // if (!updatedValue) {
  // message.error("Please provide a value for the promo code.");
  // return;
  //}

  //try {
  // await axios.patch(apiUrl + `Promocode/${currentPromoCode._id}`, {
  // value: updatedValue / 100,
  //});

  //const updatedPromoCodes = promoCodes.map((promo) =>
  //promo._id === currentPromoCode._id
  // ? { ...promo, value: updatedValue / 100 }
  //: promo
  //);
  //setPromoCodes(updatedPromoCodes);
  //setIsModalVisible(false);
  //message.success("Promo code updated successfully!");
  //} catch (error) {
  // console.error(error);
  // message.error("Failed to update promo code.");
  //}
  //};

  const handleDelete = async (promoCodeId) => {
    try {
      await axios.delete(apiUrl + `Promocode/${promoCodeId}`);
      const updatedPromoCodes = promoCodes.filter(
        (promo) => promo._id !== promoCodeId
      );
      setPromoCodes(updatedPromoCodes);
      message.success("Promo code deleted successfully!");
    } catch (error) {
      console.error(error);
      message.error("Failed to delete promo code.");
    }
  };

  const handleAddPromoCode = async () => {
    if (!newPromoCode.code) {
      message.error("Please provide both a promocode.");
      return;
    }
    if (!newPromoCode.value) {
      message.error("Please provide a value for the promocode.");
      return;
    }

    try {
      const response = await axios.post(apiUrl + "Promocode/createPromoCode", {
        code: newPromoCode.code,
        value: newPromoCode.value / 100,
      });

      if (response.status === 201) {
        setPromoCodes([...promoCodes, response.data]);
        setNewPromoCode({ code: "", value: null });
        setAddingPromoCode(false);
        message.success("Promo code added successfully!");
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to add promo code.");
    }
  };

  return (
    <div>
      <Title level={2} style={{ display: "inline-block" }}>
        Promo Codes
      </Title>

      <div
        style={{
          marginTop: "16px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
        }}
      >
        {addingPromoCode && (
          <div
            style={{
              marginRight: "8px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Input
              value={newPromoCode.code}
              onChange={(e) =>
                setNewPromoCode({ ...newPromoCode, code: e.target.value })
              }
              placeholder="Enter promo code"
              style={{ width: "150px", marginRight: "8px" }}
            />
            <InputNumber
              value={newPromoCode.value}
              onChange={(value) => setNewPromoCode({ ...newPromoCode, value })}
              placeholder="Value (%)"
              min={1}
              max={100}
              style={{ width: "100px", marginRight: "8px" }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddPromoCode}
              style={{ backgroundColor: "#1b696a" }}
            ></Button>
          </div>
        )}

        <Button
          type="primary"
          style={{ backgroundColor: "#1b696a" }}
          icon={addingPromoCode ? <CloseOutlined /> : <PlusOutlined />}
          onClick={() => setAddingPromoCode(!addingPromoCode)}
        ></Button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "15% 15% 15% 15% 15% 15%",
          gridGap: "2%",
          gridRowGap: "15px",
        }}
      >
        {promoCodes.map((promo) => (
          <Card
            key={promo._id}
            title={promo.code}
            extra={`${100 - promo.value * 100}%`}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(promo._id)}
              style={{
                marginLeft: "8px",
                color: "red",
              }}
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CreatePromoCode;
