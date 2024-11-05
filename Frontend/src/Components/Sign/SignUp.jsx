import React, { createContext, useContext, useState } from "react";
import CustomButton from "../Common/CustomButton";
import CreateTourist from "./CreateTourist";
import CreateTourGuide from "./CreateTourGuide";
import CreateSeller from "./CreateSeller";
import CreateAdvertiser from "./CreateAdvertiser";

import { Route, Routes, useNavigate } from "react-router-dom";

// Function to determine the correct article ("a" or "an")
const getArticle = (role) => {
  if (role === "advertiser") {
    return "an";
  }
  return "a";
};

const SignUp = () => {
  const [role, setRole] = useState("tourist");
  const navigate = useNavigate();
  return (
    <>
      <div
        style={{ textAlign: "center", alignItems: "center", marginTop: "20px" }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
          Register as {getArticle(role)} {role} {/* Display the current role */}
        </h1>
      </div>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <CustomButton
          onClick={() => {
            navigate("/auth/signup");
            setRole("tourist");
          }}
          value="Tourist"
          size="m"
          style={{ margin: "10px" }}
        ></CustomButton>
        <CustomButton
          onClick={() => {
            navigate("guide");
            setRole("guide");
          }}
          value="Tour Guide"
          size="m"
          style={{ margin: "10px" }}
        ></CustomButton>
        <CustomButton
          onClick={() => {
            navigate("seller");
            setRole("seller");
          }}
          value="Seller"
          size="m"
          style={{ margin: "10px" }}
        ></CustomButton>
        <CustomButton
          onClick={() => {
            navigate("advertiser");
            setRole("advertiser");
          }}
          value="Advertiser"
          size="m"
          style={{ margin: "10px" }}
        ></CustomButton>
      </div>
      <Routes>
        <Route path="/" element={<CreateTourist />} />
        <Route path="/guide" element={<CreateTourGuide />} />
        <Route path="/seller" element={<CreateSeller />} />
        <Route path="/advertiser" element={<CreateAdvertiser />} />
      </Routes>
    </>
  );
};

export default SignUp;
