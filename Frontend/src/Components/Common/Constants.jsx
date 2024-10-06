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
    100: "#e6e6e6",
    50: "#f2f2f2",
  },
  primary: {
    default: "#1b696a",
    light: "#9fcfbb",
  },
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

export const getAvgRating = (feedback) => {
  let sum = 0;

  let count = feedback?.length;
  feedback?.map((element) => {
    sum += element.rating;
  });

  return sum / count;
};
