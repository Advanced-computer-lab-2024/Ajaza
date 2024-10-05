// import { Button, Col, Row, Flex, Grid } from "antd";
// import React from "react";
// import CustomButton from "./Common/CustomButton";
// import image from "../Assets/landingPage.png";
// import { Colors } from "./Common/Constants";
// import { useNavigate } from "react-router-dom";

// const Landing = () => {
//   const navigate = useNavigate();
//   return (
//     <div
//       style={{
//         marginTop: "30px",
//         display: "grid",
//         gridTemplateColumns: "40% 65%",
//       }}
//     >
//       <Flex
//         style={{ paddingLeft: "40px", textAlign: "left" }}
//         vertical
//         justify="center"
//       >
//         {/* <h1 style={{ marginBottom: "3px", fontWeight: "900" }}>
//           Welcome to{" "}
//           <span style={{ color: Colors.primary.default }}>Aچaza</span>
//         </h1> */}
//         <h2 style={{ marginBottom: "15px", fontWeight: "bold" }}>
//           Your Ultimate Tourism Experience{" "}
//         </h2>
//         <h5 style={{ color: Colors.grey[700] }}>
//           Aچaza is a comprehensive tourism platform designed for tourists, tour
//           guides, advertisers, sellers, and tourism administrators. Whether
//           you're planning your next vacation, promoting an event, or selling
//           products related to tourism, Aچaza has you covered.
//         </h5>
//         <Flex align="center" style={{ marginTop: "20px" }}>
//           <CustomButton
//             size="m"
//             value={"Sign up"}
//             onClick={() => navigate("/adminCustom")}
//           />
//           <CustomButton
//             size="m"
//             value={"Sign in"}
//             onClick={() => navigate("/auth/signin")}
//           />
//           <a
//             style={{ textDecoration: "underline", marginLeft: "35px" }}
//             onClick={() => navigate("TODO/")}
//           >
//             Try as Guest
//           </a>
//         </Flex>
//       </Flex>

//       <Flex justify="center">
//         <img
//           style={{
//             width: "auto",
//             height: "auto",
//             maxWidth: "100%",
//             maxHeight: "100%",
//             position: "relative",
//             left: 40,
//           }}
//           src={image}
//           alt=""
//         />
//       </Flex>
//     </div>
//   );
// };

// export default Landing;

import { Button, Col, Row } from "antd";
import React from "react";
import CustomButton from "./Common/CustomButton";
import image from "../Assets/landingPage.svg";
import { Colors } from "./Common/Constants";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        paddingLeft: "50px",
        paddingTop: "290px",
      }}
    >
      <div
        style={{
          padding: "30px",
          borderRadius: "10px",
          maxWidth: "600px",
          textAlign: "left",

        }}
      >
        <div>
          <CustomButton
            size="m"
            value={"Sign up"}
            onClick={() => navigate("/adminCustom")}
            style={{ marginRight: "10px" }}
          />
          <CustomButton
            size="m"
            value={"Sign in"}
            onClick={() => navigate("/auth/signin")}
            style={{ marginRight: "10px" }}
          />
        </div>
        <div style={{ marginTop: "10px", marginLeft: "110px" }}>
          <a
            style={{ textDecoration: "underline", cursor: "pointer", color: "white" }}
            onClick={() => navigate("/guest")}
          >
            Continue as Guest
          </a>
        </div>
      </div>
    </div>
  );
};

export default Landing;
