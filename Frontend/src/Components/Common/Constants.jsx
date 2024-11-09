import axios from "axios";
import { message } from "antd";

export const Colors = {
  grey: {
    900: "#1a1a1a",
    800: "#333333",
    700: "#4d4d4d",
    600: "#666666",
    500: "#808080",
    400: "#999999",
    300: "#b3b3b3",
    200: "#cccccc",
    100: "#f2f2f2",
    50: "#f7f7f7",
  },
  primary: {
    default: "#1b696a",
    light: "#5b8b77",
    lighter: "#a9f1d3",
  },
  warning: "#ff4545",
  warningDark: "#cc0b38",
  positive: "#1a843a",
};

export const apiUrl = "http://localhost:5000/";

export const calculateYourPrice = (venue, userNationality, userOccupation) => {
  const { foreigner, native, student } = venue.price;

  let yourPrice = foreigner; // Default to foreigner price

  // Set price based on nationality and occupation
  if (userNationality?.toLowerCase() === "egypt") {
    yourPrice = Math.min(yourPrice, native);
  }
  if (userOccupation?.toLowerCase() === "student") {
    yourPrice = Math.min(yourPrice, student);
  }

  venue.priceOptions = venue.price;
  venue.price = yourPrice; // Add `yourPrice` key to the venue
  return venue;
};

export const calculateYourPriceRet = (
  venue,
  userNationality,
  userOccupation
) => {
  const { foreigner, native, student } = venue.price;

  let yourPrice = foreigner; // Default to foreigner price

  // Set price based on nationality and occupation
  if (userNationality?.toLowerCase() === "egypt") {
    yourPrice = Math.min(yourPrice, native);
  }
  if (userOccupation?.toLowerCase() === "student") {
    yourPrice = Math.min(yourPrice, student);
  }

  return yourPrice;
};

export const getAvgRating = (feedback) => {
  let sum = 0;

  let count = feedback?.length;
  feedback?.map((element) => {
    sum += element.rating;
  });

  return sum / count;
};

export const getUniqueTags = (data) => {
  // Flatten all tags from each element and create a set to ensure uniqueness
  const uniqueTags = new Set(data.flatMap((item) => item.tags));
  // Convert the set back to an array
  return Array.from(uniqueTags);
};

export const comparePriceRange = (filterCriteria, element) => {
  if (!element.price) {
    return false;
  }

  // filterCriteria is one of the values that we can filter with
  const [num1, num2] = filterCriteria;
  const min = Math.min(num1, num2);
  const max = Math.max(num1, num2);

  if (element["price"].length != null) {
    if (element.upper <= max && element.lower >= min) {
      return true;
    }
    return false;
  }
  console.log("barra");

  return element?.price >= min && element.price <= max; // inclusive range
};

export const camelCaseToNormalText = (camelCaseStr) => {
  // Add spaces before each capital letter and convert the whole string to lowercase
  const spacedText = camelCaseStr.replace(/([A-Z])/g, " $1").toLowerCase();

  // Capitalize the first letter of each word
  const normalText = spacedText.replace(/\b\w/g, (char) => char.toUpperCase());

  return normalText;
};

export const convertDateToString = (datetimeString) => {
  // The input datetime string

  // Create a Date object from the string
  const date = new Date(datetimeString);

  // Format the date into a readable format
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  };

  // Convert to a readable string
  const readableDate = date.toLocaleString("en-US", options);

  return readableDate;
};

export const getSetNewToken = async (userId, role) => {
  console.log(role);
  console.log(userId);

  try {
    const response = await axios.post(`${apiUrl}api/auth/generate-token`, {
      id: userId,
      role: role,
    });

    const { token: newToken } = response.data;

    if (newToken) {
      localStorage.setItem("token", newToken); // Store the new token
    }
  } catch (error) {}
};
