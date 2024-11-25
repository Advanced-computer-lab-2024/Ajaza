import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../Common/Constants';
import { useNavigate } from "react-router-dom";
import {
    Card,
    Col,
    Row,
    Typography,
    message,
    Button,
} from "antd"; 

const ExamineAccountDetails = () => {
    const navigate = useNavigate();
    const { accountId, accountType } = useParams();
    const [account, setSelectedAccount] = useState(null);
    const [loading, setLoading] = useState(true);

    const [selectedImageId, setSelectedImageId] = useState("");
    const [imageTax, setImageTax] = useState("");
    const [imageCert1, setImageCert1] = useState("");
    const [imageCert2, setImageCert2] = useState("");
    const [imageCert3, setImageCert3] = useState("");
    const [imageCert4, setImageCert4] = useState("");
    const [imageCert5, setImageCert5] = useState("");
    const [imageCert6, setImageCert6] = useState("");
    const [imageCert7, setImageCert7] = useState("");
    const [imageCert8, setImageCert8] = useState("");
    const [imageCert9, setImageCert9] = useState("");
    const [imageCert10, setImageCert10] = useState("");
    

    useEffect(() => {
        const fetchAccountDetails = async () => {
            try {
                if(accountType === "guide") {
                    const response = await axios.get(`${apiUrl}guide/details/${accountId}`);
                    const wholeAccount = response.data;
                    setSelectedAccount(wholeAccount);

                    // Get the ID image
                    setSelectedImageId(`http://localhost:3000/${wholeAccount.id}`);
                    
                    // Get the certificates (up to 3)
                    let hisCertificates = wholeAccount.certificates;
                    setImageCert1(hisCertificates[0] ? `http://localhost:3000/${hisCertificates[0]}` : "");
                    setImageCert2(hisCertificates[1] ? `http://localhost:3000/${hisCertificates[1]}` : "");
                    setImageCert3(hisCertificates[2] ? `http://localhost:3000/${hisCertificates[2]}` : "");
                    setImageCert4(hisCertificates[3] ? `http://localhost:3000/${hisCertificates[3]}` : "");
                    setImageCert5(hisCertificates[4] ? `http://localhost:3000/${hisCertificates[4]}` : "");
                    setImageCert6(hisCertificates[5] ? `http://localhost:3000/${hisCertificates[5]}` : "");
                    setImageCert7(hisCertificates[6] ? `http://localhost:3000/${hisCertificates[6]}` : "");
                    setImageCert8(hisCertificates[7] ? `http://localhost:3000/${hisCertificates[7]}` : "");
                    setImageCert9(hisCertificates[8] ? `http://localhost:3000/${hisCertificates[8]}` : "");
                    setImageCert10(hisCertificates[9] ? `http://localhost:3000/${hisCertificates[9]}` : "");

                    setLoading(false);
                } else if (accountType === "seller" || accountType === "advertiser") {
                    const response = await axios.get(`${apiUrl}${accountType}/details/${accountId}`);
                    const wholeAccount = response.data;
                    setSelectedAccount(wholeAccount);

                    // Get the ID image
                    setSelectedImageId(`http://localhost:3000/${wholeAccount.id}`);

                    // Get the taxation registry card for sellers and advertisers
                    setImageTax(`http://localhost:3000/${wholeAccount.taxationRegCard}`);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching account details", error);
                message.error("Failed to fetch account details.");
            }
        };

        fetchAccountDetails();
    }, [accountId, accountType]);

    const handleAccept = async () => {
        try {
            await axios.put(`${apiUrl}${accountType}/accept/${accountId}`);
            message.success("User accepted.");
            setSelectedAccount(null);
            navigate(`/Admin/examine-Accounts`);
        } catch (error) {
            message.error("Failed to accept user.");
        }
    };

    const handleReject = async () => {
        try {
            await axios.delete(`${apiUrl}${accountType}/reject/${accountId}`);
            message.success("User rejected.");
            setSelectedAccount(null);
            navigate(`/admin/examine-Accounts`);
        } catch (error) {
            message.error("Failed to reject user.");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h3>Pending Account Details</h3>
            <Card
    title={`Username: ${account.username}`}
    bordered={false}
    style={{
        width: "60%",
        textAlign: "center",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        marginLeft: "250px" // Adjust this value as needed to move it slightly to the right
    }}
>
    <p>Account Type: {accountType}</p>
    <p>Email: {account.email}</p>

    <h3>ID:</h3>
    <img src={selectedImageId} alt="ID Image" width="500px" height="500px" />
    <hr />

    {accountType === "guide" && (
        <>
            <h3>Certificates:</h3>
            {imageCert1 && <img src={imageCert1} alt="Certificate 1" width="500px" height="500px" />}
            <br/>
            {imageCert2 && <img src={imageCert2} alt="Certificate 2" width="500px" height="500px" />}
            <br/>
            {imageCert3 && <img src={imageCert3} alt="Certificate 3" width="500px" height="500px" />}
            <br/>
            {imageCert4 && <img src={imageCert4} alt="Certificate 4" width="500px" height="500px" />}
            <br/>
            {imageCert5 && <img src={imageCert5} alt="Certificate 5" width="500px" height="500px" />}
            <br/>
            {imageCert6 && <img src={imageCert6} alt="Certificate 6" width="500px" height="500px" />}
            <br/>
            {imageCert7 && <img src={imageCert7} alt="Certificate 7" width="500px" height="500px" />}
            <br/>
            {imageCert8 && <img src={imageCert8} alt="Certificate 8" width="500px" height="500px" />}
            <br/>
            {imageCert9 && <img src={imageCert9} alt="Certificate 9" width="500px" height="500px" />}
            <br/>
            {imageCert10 && <img src={imageCert10} alt="Certificate 10" width="500px" height="500px" />}
        </>
    )}

    {(accountType === "seller" || accountType === "advertiser") && (
        <>
            <h3>Taxation Registry Card:</h3>
            <img src={imageTax} alt="Taxation Registry Card" width="500px" height="500px" />
        </>
    )}

    <div style={{ marginTop: 20 }}>
        <Button type="primary" onClick={handleAccept} style={{ marginRight: 10 }}>
            Accept
        </Button>
        <Button type="default" onClick={handleReject}>
            Reject
        </Button>
    </div>
</Card>

        </div>
    );
};

export default ExamineAccountDetails;
