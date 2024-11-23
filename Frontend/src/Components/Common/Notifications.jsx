import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Button } from "antd";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./Notifications.css";
import CustomButton from "./CustomButton";

const { Title } = Typography;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken.userDetails);
      setRole(decodedToken.role);
      setNotifications(decodedToken.userDetails.notifications || []);
    }
  }, []);

  const Viewactivity = (activityId) => {
    if (role === "tourist") {
      navigate(`/tourist/activities/${activityId}`);
    }
  };

  const Viewiten = (itineraryId) => {
    if (role === "tourist") {
      navigate(`/tourist/itineraries/${itineraryId}`);
    }
  }; 

  
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
                <div className="notification-text">{notification.text}</div>
                {/* Show button only if either activityId or itineraryId exists */}
                {(notification.activityId || notification.itineraryId) && (
                  <>
                    {notification.activityId && !notification.itineraryId && (
                      <CustomButton
                        size="s"
                        rounded={true}
                        style={{
                          backgroundColor: "#1b696a",
                          color: "#fff",
                          border: "1px solid #4caf50",
                        }}
                        value="View Activity"
                        onClick={() => Viewactivity(notification.activityId)}
                      />
                    )}
                    {notification.itineraryId && !notification.activityId && (
                      <CustomButton
                        size="s"
                        rounded={true}
                        style={{
                          backgroundColor: "#1b696a",
                          color: "#fff",
                          border: "1px solid #4caf50",
                        }}
                        value="View Itinerary"
                        onClick={() => Viewiten(notification.itineraryId)}
                      />
                    )}
                  </>
                )}
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
