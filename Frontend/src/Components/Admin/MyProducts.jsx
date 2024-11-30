import React, { useEffect, useState } from "react";
import SearchFilterSortContainer from "../Common/SearchFilterSortContainer";
import SearchFilterSortContainerEditCreate from "../Common/SearchFilterSortContainerEditCreate";
import {
  apiUrl,
  Colors,
  comparePriceRange,
  getAvgRating,
} from "../Common/Constants";
import axios from "axios";
import BasicCard from "../Common/BasicCard";
import {
  EditOutlined,
  PlusOutlined,
  TranslationOutlined,
} from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import CustomButton from "../Common/CustomButton";
import {
  Card,
  Modal,
  message,
  Form,
  Input,
  Button as AntButton,
  Select,
  Button,
  Flex,
} from "antd";
import SelectCurrency from "../Tourist/SelectCurrency";
import { useCurrency } from "../Tourist/CurrencyContext";

const convertCategoriesToValues = (categoriesArray) => {
  return categoriesArray.map((categoryObj) => {
    return {
      displayName: categoryObj.category,
      filterCriteria: categoryObj.category,
    };
  });
};

const convertTagsToValues = (tagsArray) => {
  return tagsArray.map((tagObj) => {
    return {
      displayName: tagObj.tag,
      filterCriteria: tagObj.tag,
    };
  });
};

const currencyRates = {
  AED: 3.6725,
  ARS: 1004.0114,
  AUD: 1.5348,
  BDT: 110.5,
  BHD: 0.376,
  BND: 1.3456,
  BRL: 5.8149,
  CAD: 1.3971,
  CHF: 0.8865,
  CLP: 973.6481,
  CNY: 7.2462,
  COP: 4389.3228,
  CZK: 24.2096,
  DKK: 7.1221,
  EGP: 48.58,
  EUR: 0.9549,
  GBP: 0.7943,
  HKD: 7.7825,
  HUF: 392.6272,
  IDR: 15911.807,
  ILS: 3.7184,
  INR: 84.5059,
  JPY: 154.4605,
  KRW: 1399.323,
  KWD: 0.3077,
  LKR: 291.0263,
  MAD: 10.5,
  MXN: 20.4394,
  MYR: 4.4704,
  NOK: 11.0668,
  NZD: 1.7107,
  OMR: 0.385,
  PHP: 58.9091,
  PKR: 279.0076,
  PLN: 4.1476,
  QAR: 3.64,
  RUB: 101.2963,
  SAR: 3.75,
  SEK: 11.063,
  SGD: 1.3456,
  THB: 34.7565,
  TRY: 34.5345,
  TWD: 32.5602,
  UAH: 36.9,
  USD: 1,
  VND: 24000.0,
  ZAR: 18.0887,
};

const MyProducts = () => {
  const [combinedElements, setCombinedElements] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [archivingProductId, setArchivingProductId] = useState(null);
  const [archivedProducts, setArchivedProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [refreshElements, setRefreshElements] = useState(false);
  const [isArchiveModalVisible, setIsArchiveModalVisible] = useState(false);
  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
  };

  const propMapping = {
    title: "name",
    extra: "price",
    rating: "avgRating",
    photo: "photo",
  };
  const fields = {
    Description: "desc",
    Seller: "sellerName",
    Sales: "sales",
    "Quantity Available": "quantity",
  };
  const searchFields = ["name"];
  const constProps = { rateDisplay: true, currency, currencyRates };

  const sortFields = ["avgRating", "price"];
  const [filterFields, setfilterFields] = useState({
    price: {
      displayName: "Price",
      values: [
        { displayName: "0-20", filterCriteria: [0, 20] },
        { displayName: "21-60", filterCriteria: [21, 60] },
        { displayName: "61-100", filterCriteria: [61, 100] },
        { displayName: "101+", filterCriteria: [101, 9999999999] },
      ],
      compareFn: (filterCriteria, element) =>
        comparePriceRange(filterCriteria, element),
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      let decodedToken = null;
      if (token) {
        decodedToken = jwtDecode(token);
      }
      const userId = decodedToken.userDetails["_id"];
      setUserId(userId);

      try {
        const productResponse = await axios.get(
          `${apiUrl}product/viewMyProducts/${userId}`
        );
        let products = productResponse.data;

        // Filter out archived products
        let nonArchivedProducts = products.filter(
          (product) => !product.archived
        );
        let combinedArray = nonArchivedProducts;
        combinedArray = combinedArray.map((element) => {
          return {
            ...element,
            avgRating: getAvgRating(element.feedback),
            sales: element.sales || 0, // Ensure sales is set to 0 if not present
          };
        });

        console.log(combinedArray);

        setCombinedElements(combinedArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [refreshElements]);

  const archiveProduct = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userDetails["_id"];

      const response = await axios.patch(
        `${apiUrl}product/${userId}/product/${productId}/adminSellerArchiveProduct`,
        {
          archived: true,
        }
      );
      console.log("API Response:", response.data);
      console.log("inside prodID", productId);
      console.log("inside userID", userId);

      setRefreshElements((prev) => !prev); // Refresh elements
    } catch (error) {
      message.error(
        `Failed to archive product: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const createOnclick2 = (product) => {
    if (product && product._id) {
      archiveProduct(product._id); // Directly archive the product without showing a modal
    } else {
      console.error("No product or product ID provided");
    }
  };

  const createOnclick = () => {
    setEditingProductId(null);
    setIsModalVisible(true);
  };

  useEffect(() => {
    console.log("NOURSALAH arch", archivingProductId);
    console.log("NOURSALAH user", userId);
  }, [archivingProductId, userId]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          position: "relative",
          top: "40px",
        }}
      >
        <Button
          icon={<PlusOutlined style={{ color: "white" }} />}
          onClick={createOnclick}
          style={{
            backgroundColor: Colors.primary.default,
            border: "none",
            width: "30px",
            height: "30px",
            marginRight: "60px",
          }}
        />
        <SelectCurrency
          basePrice={null}
          currency={currency}
          onCurrencyChange={handleCurrencyChange}
          style={{}}
        />
      </div>
      <SearchFilterSortContainerEditCreate
        cardComponent={BasicCard}
        elements={combinedElements}
        propMapping={propMapping}
        searchFields={searchFields}
        constProps={constProps}
        fields={fields}
        sortFields={sortFields}
        filterFields={filterFields}
        editingProductId={editingProductId}
        setEditingProductId={setEditingProductId}
        setArchivingProductId={setArchivingProductId}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        userId={userId}
        setRefreshElements={setRefreshElements}
        archivingProductId={archivingProductId}
        setArchiveProductId={setArchivingProductId}
        setIsArchiveModalVisible={setIsArchiveModalVisible} // Pass this as a prop
        onArchive={archiveProduct}
      />
      <Modal
        title="Confirm Archive"
        open={isArchiveModalVisible}
        onOk={() => {
          if (archivingProductId) {
            archiveProduct(archivingProductId); // Pass the archiving product ID to the archive function
          } else {
            message.error("No product selected for archiving.");
          }
        }}
        onCancel={() => setIsArchiveModalVisible(false)}
      >
        <p>Are you sure you want to archive this product?</p>
      </Modal>
    </>
  );
};

export default MyProducts;
