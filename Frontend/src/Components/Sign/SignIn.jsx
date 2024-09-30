import React from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate("/tourist/");
      }}
    >
      SignIn
    </div>
  );
};

export default SignIn;
