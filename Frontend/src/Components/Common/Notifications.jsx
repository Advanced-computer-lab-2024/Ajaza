import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import { jwtDecode } from "jwt-decode";
import CustomLayout from "./CustomLayout";
import "./Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken.userDetails);
      setNotifications(decodedToken.userDetails.notifications || []);
    }
  }, []);

    return (
      <CustomLayout>
    <div className="notification-container">
      <Row className="notification-row">
        {notifications.map((notification) => (
          <Col key={notification._id} span={24} className="notification-item">
            <div
              className={`notification-message ${notification.seen ? 'seen' : 'unseen'}`}
            >
              {notification.text}
            </div>
          </Col>
        ))}
      </Row>
    </div>
    </CustomLayout>
  );
};

export default Notifications;
