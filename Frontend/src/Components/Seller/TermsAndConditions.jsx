// // src/Components/TermsAndConditions.js
// import React from 'react';
// import { Button, Card, Typography, message } from 'antd';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { apiUrl } from '../Common/Constants'; // Ensure this path is correct
// import { jwtDecode } from 'jwt-decode';

// const TermsAndConditions = () => {
//     const navigate = useNavigate();
//     const token = localStorage.getItem("token");
//     const decodedToken = jwtDecode(token);
//     const userId = decodedToken.userDetails["_id"];

//     const acceptTerms = async () => {
//         try {
//             await axios.patch(`${apiUrl}/user/${userId}/acceptTerms`, {
//                 acceptedTerms: true,
//             });
//             message.success("Terms accepted. Redirecting to seller dashboard...");
//             navigate('/seller');
//         } catch (error) {
//             message.error(`Error accepting terms: ${error.response?.data?.message || error.message}`);
//         }
//     };

//     const denyTerms = () => {
//         message.error("Access denied. You cannot proceed without accepting the terms.");
//         // Optionally, redirect to a login or error page
//         navigate('/login'); // Adjust according to your routing
//     };

//     return (
//         <Card title="Terms and Conditions" style={{ maxWidth: 600, margin: 'auto', marginTop: 50 }}>
//             <Typography.Paragraph>
//                 {/* Replace this with your actual terms and conditions text */}
//                 <strong>Terms and Conditions</strong>
//                 <br />
//                 Please read and accept the terms and conditions to proceed.
//             </Typography.Paragraph>
//             <Button type="primary" onClick={acceptTerms}>Accept</Button>
//             <Button type="default" onClick={denyTerms} style={{ marginLeft: 10 }}>Deny</Button>
//         </Card>
//     );
// };

// export default TermsAndConditions;

// src/Components/TermsAndConditions.js
import React from 'react';
import { Button, Card, Typography, message } from 'antd';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiUrl } from '../Common/Constants'; // Ensure this path is correct
import { jwtDecode } from 'jwt-decode';

const TermsAndConditions = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const location = useLocation();

    if (!token) {
        // Handle case where there is no token
        message.error("You need to log in first.");
        navigate('/login');
        return null;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userDetails["_id"];

    const params = new URLSearchParams(location.search);
    const role = params.get('role');

    const acceptTerms = async () => {
        try {
            ///acceptTerms/:id
            await axios.patch(`${apiUrl}${role}/acceptTerms/${userId}`, {
                acceptedTerms: true,
            });
            if (role === 'advertiser') {
                message.success("Terms accepted. Redirecting to Advertiser dashboard...");
            } else if (role === 'seller') {
                message.success("Terms accepted. Redirecting to Seller dashboard...");
            } else {
                message.success("Terms accepted. Redirecting to Guide dashboard...");
            }
            setTimeout(() => {
                navigate(`/${role}`);
            }, 500); // Wait for 0.5 second before navigating
        } catch (error) {
            message.error(`Error accepting terms: ${error.response?.data?.message || error.message}`);
        }
    };

    const denyTerms = () => {
        message.error("Access denied. You cannot proceed without accepting the terms.");
        // navigate('/login'); 
    };

    return (
        <Card title="Terms and Conditions" style={{ maxWidth: 600, margin: 'auto', marginTop: 50 }}>
            <Typography.Paragraph>
                <strong>Terms and Conditions</strong>
                <br />
                Please read and accept the terms and conditions to proceed.
            </Typography.Paragraph>
            <Button type="primary" onClick={acceptTerms}>Accept</Button>
            <Button type="default" onClick={denyTerms} style={{ marginLeft: 10 }}>Deny</Button>
        </Card>
    );
};

export default TermsAndConditions;