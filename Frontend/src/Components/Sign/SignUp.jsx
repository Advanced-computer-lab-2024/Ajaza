import React, { createContext, useContext, useState } from "react";
import CustomButton from "../Common/CustomButton";
import Tourist from "../Tourist/Tourist";
import TourGuide from "../TourGuide/TourGuide";
import Advertiser from "../Advertiser/Advertiser";
import Seller from "../Seller/Seller";

// Create a RoleContext
const RoleContext = createContext();

// Custom hook to use the RoleContext
export const useRole = () => {
  return useContext(RoleContext);
};

const SignUp = () => {
  const [role, setRole] = useState("Tourist"); // Default role

  const renderForm = () => {
    switch (role) {
      case "Tourist":
        return <Tourist />;
      case "Tour Guide":
        return <TourGuide />;
      case "Seller":
        return <Seller />;
      case "Advertiser":
        return <Advertiser />;
      default:
        return <Tourist />; // Default to Tourist if no role is selected
    }
  };

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {/* Render the selected role's form */}
      <div style={{ marginTop: "20px" }}>{renderForm()}</div>
    </RoleContext.Provider>
  );
};

export default SignUp;