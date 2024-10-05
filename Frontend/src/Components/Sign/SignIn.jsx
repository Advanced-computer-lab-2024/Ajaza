import { Flex, Input } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../Common/CustomButton";
import axios from "axios";
import { apiUrl } from "../Common/Constants";
import { jwtDecode } from "jwt-decode";

const SignIn = () => {
  const [response, setResponse] = useState(null);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("tourist1");
  const [password, setPassword] = useState("hashed_password_1");

  const navigate = useNavigate();

  const signIn = async () => {
    const token = "authToken";
    const urlExtension = "api/auth/login";
    const fetchData = async () => {
      const body = {
        username: username,
        password: password,
        // Add more key-value pairs as needed
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Example header, adjust as needed
        },
      };
      try {
        const apiResponse = await axios.post(
          "http://localhost:5000/api/auth/login",
          body
        );

        if (apiResponse.status === 200) {
          setResponse(apiResponse.data);
          localStorage.setItem("token", apiResponse.data.token);

          const decodedToken = jwtDecode(apiResponse.data.token);
          navigate(`/${decodedToken.role}`);
        }

        if (apiResponse?.data?.message) {
          setMessage(apiResponse.data.message);
        }
      } catch (error) {
        if (error?.response?.data?.message) {
          setMessage(error?.response?.data?.message);
        }
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  };
  return (
    <Flex vertical align="center" style={{ padding: "100px 200px" }}>
      <Input
        value={username}
        style={{ marginBottom: "30px" }}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="username"
      />
      <Input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
      />
      <CustomButton size="m" value={"Sign in"} onClick={() => signIn()} />
      {message}
    </Flex>
  );
};

export default SignIn;
