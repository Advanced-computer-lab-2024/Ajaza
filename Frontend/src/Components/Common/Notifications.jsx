import React, { useEffect, useState } from "react";
import { Row, Col, Typography } from "antd";
import { jwtDecode } from "jwt-decode";
import "./Notifications.css";

const { Title } = Typography;

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
    <div className="notification-container">
      <div className="notification-header">
        <Title level={2}>Notifications</Title>
        <p>Keep track of all your updates and messages here.</p>
      </div>
      <Row className="notification-row">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Col key={notification._id} span={24} className="notification-item">
              <div
                className={`notification-message ${
                  notification.seen ? "seen" : "unseen"
                }`}
              >
                {notification.text}
              </div>
            </Col>
          ))
        ) : (
          <div className="no-notifications">
            <p>No notifications available at the moment.</p>
          </div>
        )}
      </Row>
    </div>
  );
};

export default Notifications;
