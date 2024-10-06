import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import CustomButton from "../Common/CustomButton";
import {jwtDecode} from "jwt-decode";

export const RedeemPoints = () => {
  const [points, setPoints] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); 
    if (token) {
      const decodedToken = jwtDecode(token);
      setId(decodedToken.userId);
      console.log(decodedToken);
    } else {
      message.error("User not authenticated");
    }
  }, []);

  useEffect(() => {
    if (id) {
      const fetchTouristData = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/tourist/touristReadProfile/${id}`);
          const { points, wallet } = response.data;
          setPoints(points);
          setWallet(wallet);
        } catch (error) {
          message.error("Failed to fetch tourist data.");
        }
      };

      fetchTouristData();
    }

  }, [id]);

  const redeemPoints = async () => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `http://localhost:5000/tourist/redeemPoints/${id}`
      );
      const { wallet, points } = response.data;
      setWallet(wallet);
      setPoints(points);
      message.success("Points redeemed successfully!");
    } catch (error) {
      message.error(
        error.response?.data?.message || "Error redeeming points."
      );
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Redeem Points</h2>
      <p>Your current points: {points}</p>
      <p>Your wallet balance: EGP {wallet}</p>
      <CustomButton
        size="m"
        value={"Redeem Points"}
        onClick={redeemPoints}
        disabled={points < 10000}
        loading={loading}
      />
    </div>
  );
};

export default RedeemPoints;
