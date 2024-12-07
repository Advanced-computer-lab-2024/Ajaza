import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import Cookies from "js-cookie";
import * as Frigade from "@frigade/react";

const FrigadeProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
      const existingUserId = Cookies.get("userId");
      if (existingUserId) {
        console.log("Cookie User ID:", existingUserId);
        setUserId(existingUserId);
      } else {
        const newUserId = uuid();
        console.log("Generated User ID:", newUserId);
        Cookies.set("userId", newUserId, { expires: 365 }); // Expires in 1 year
        setUserId(newUserId);
      }
    }, []);
    
    if (!userId) {
      // Optionally render a loader or nothing until `userId` is initialized.
      return null;
    }
    

    return (
        <Frigade.Provider
            apiKey="api_public_qO3GMS6zamh9JNuyKBJlI8IsQcnxTuSVWJLu3WUUTUyc8VQrjqvFeNsqTonlB3Ik"
            userId={userId}
            onError={(error) => console.error("Frigade Error:", error)}

        >
           {userId && <Frigade.Tour flowId="flow_CHZzYUZG"/>}
    {children}
  </Frigade.Provider>
    );
};

export default FrigadeProvider;
