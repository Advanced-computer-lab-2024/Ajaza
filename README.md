# AJAZA

This all-in-one travel platform simplifies vacation planning, offering seamless tools for travelers to create unforgettable journeys. Whether you're exploring historic landmarks, relaxing on sunny beaches, or seeking family-friendly adventures, this app brings everything you need into one place. Designed for convenience and personalization, it ensures your trip planning is effortless and enjoyable.

## Motivation

Travel planning can often be overwhelming and time-consuming, requiring travelers to juggle multiple platforms for booking flights, accommodations, transportation, and activities. This project aims to address these challenges by creating a seamless, user-friendly travel platform that consolidates all these needs into a single app.

By providing personalized recommendations, real-time updates, and tools to manage budgets and itineraries, the platform empowers users to plan their dream vacations effortlessly. Whether catering to solo travelers, families, or adventurers, this app ensures that every journey is stress-free, well-organized, and enjoyable.

## Build Status

- **Status**: The project is fully implemented and tested locally.
- **Frontend**: All features are functional and accessible via the development server (`npm start`).
- **Backend**: Fully functional, with all API endpoints tested using Postman.
- **Testing**:
  - Postman API tests: ✅ Passed.
- **Deployment**:
  - This project is a university assignment and is not intended for deployment.
  - All functionalities can be tested locally as outlined in the **How to Use** section.

## Code Style

### Backend Folder

- **File Names**: Use camelCase for all file names.
  - Example: `activityController.js`, `adminController.js`
- **Method and Variable Names**: Use camelCase for all method and variable names.
  - Example:
    ```javascript
    const getActivityById = (id) => {
      // Function implementation
    };
    const activityName = "Hiking";
    ```

### Frontend Folder

- **File Names**: Capitalize the first letter of each word in file names (PascalCase).
  - Example: `ActivityCard.js`, `UserProfile.js`
- **Method and Variable Names**: Use camelCase for all method and variable names.
  - Example:
    ```javascript
    const fetchUserData = async () => {
      // Function implementation
    };
    const userAge = 25;
    ```

## Screenshots

You can find all the screenshots of the website [here](https://drive.google.com/drive/folders/17t54xB0nUWScC-RDuxQncNrR1gPversl?usp=sharing).

The folder includes:

- Screenshots of key pages such as the homepage, dashboard, and login page.
- Features like trip planning, booking, and the admin panel.

## Tech/Framework Used

This project leverages the MERN stack alongside various other libraries and tools to deliver a seamless, feature-rich web application:

### Core Technologies:

- **MongoDB:** A NoSQL database for efficient and flexible data storage.
- **Express.js:** A web application framework for building robust APIs and managing server-side logic.
- **React.js:** A JavaScript library for building dynamic and responsive user interfaces.
- **Node.js:** A runtime environment for executing JavaScript code on the server.

### Additional Tools and Libraries:

- **Axios:** For making HTTP requests to communicate between the client and server.
- **JWT Decode:** For managing and decoding JSON Web Tokens in authentication.
- **bcrypt:** For securely hashing passwords and handling sensitive data.
- **Moment.js:** For managing and formatting dates and times.
- **qs:** For parsing and stringifying query strings.
- **Stripe:** For handling secure payment processing.
- **Nodemailer:** For sending emails, such as account notifications or confirmations.
- **dotenv:** For managing and securing environment variables.
- **Multer:** Middleware for handling file uploads.

### UI Frameworks and Design:

- **Material-UI (MUI):** A modern design framework for building intuitive interfaces.
- **React Google Maps API:** For embedding and interacting with Google Maps.

### Development Tools:

- **React Scripts**: Simplifies development workflows, including building, testing, and running the app.
- **ESLint**: Ensures consistent coding standards by identifying syntax and style issues.
- **Jest**: Used for unit and integration testing.
- **Postman**: Used for testing and debugging API endpoints.

## Features

### User Authentication

- Secure login using a username and password.
- Ability to reset the password using an OTP sent to the registered email.
- Role-based registration and login for different user types:
  - **Tourists**: Personal trip planning and activity management.
  - **Tour Guides**: Guided tour creation and booking management.
  - **Advertisers**: Ad creation for activities and events.
  - **Sellers**: Managing in-app gift shop items.
  - **Admins**: User management and complaint resolution.

### Personalized Dashboards

- Custom dashboards tailored to each user type:
  - **Tourists**: Manage itineraries, budgets, and bookings.
  - **Advertisers**: Track and manage ads.
  - **Tour Guides**: View and manage bookings for guided tours.
  - **Sellers**: Manage products and sales.
  - **Admins**: Oversee platform activity and manage user complaints.

### Trip Planning

- Create personalized travel plans with:
  - Destination selection.
  - Budget setting and tracking.
  - Date-specific itineraries.

### Booking Integration

- Seamless booking for:
  - Flights.
  - Hotels.
  - Transportation options via third-party integrations.

### Activity Discovery

- Browse and filter activities by:
  - Categories.
  - Dates.
  - Locations.

### Real-Time Notifications

- Get instant updates on:
  - Booking confirmations.
  - Itinerary changes.
  - Exclusive offers.

### Feedback and Complaints Management

- Submit feedback and complaints.
- Track the status of complaints in the user dashboard.

### Smart Budgeting

- Real-time budget tracking.
- Activity recommendations based on remaining budget.

### In-App Gift Shop

- **For Sellers**:
  - Add, edit, and remove items.
  - Manage orders and inquiries.
- **For Tourists**:
  - Purchase souvenirs and local items.

### Admin Tools

- Comprehensive admin panel for:
  - User account management.
  - Monitoring user activity.
  - Resolving complaints.
  - Managing the “Employee of the Month” selection process.

## Code Examples

### 1. Authentication

```javascript
const signIn = async () => {
  const fetchData = async () => {
    const body = {
      username: form.getFieldValue("username"),
      password: form.getFieldValue("password"),
    };
    try {
      const apiResponse = await axios.post(
        "http://localhost:5000/api/auth/login",
        body
      );
      if (apiResponse.status === 200) {
        console.log(apiResponse.data);

        const token = apiResponse.data.token;
        console.log(token);

        const decodedToken = jwtDecode(token);
        const role = decodedToken.role;
        console.log("role:", role);
        console.log(
          "requesting deletion:",
          decodedToken?.userDetails?.requestingDeletion
        );
        console.log(
          "accepted terms:",
          decodedToken?.userDetails?.acceptedTerms
        );
        console.log("pending:", decodedToken?.userDetails?.pending);
        if (decodedToken?.userDetails?.requestingDeletion) {
          message.error(<>You have requested to delete your account</>);
          return;
        }

        if (
          // condition 0,0 --not pending and did not accept terms
          decodedToken?.userDetails?.pending === false &&
          decodedToken?.userDetails?.acceptedTerms === false
        ) {
          // Redirect to Terms and Conditions page
          if (role === "guide" || role === "advertiser" || role === "seller") {
            console.log("is pending:", decodedToken.userDetails.pending);
            navigate(`/auth/terms-and-conditions?role=${decodedToken.role}`); // Redirect to terms and conditions page
            localStorage.setItem("token", apiResponse.data.token);
            return;
          } else {
            // Redirect to the user's respective page
            navigate(`/${decodedToken.role}`);
            localStorage.setItem("token", apiResponse.data.token);
          }
        } else if (decodedToken?.userDetails?.pending === true) {
          // conditions 1,0 and 1,1 --pending
          message.error("Account is still pending");
          return;
        } else {
          navigate(`/${decodedToken.role}`);
          localStorage.setItem("token", apiResponse.data.token);
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        setFeedbackMessage(error?.response?.data?.message);
        message.error(error?.response?.data?.message);
      }
      console.error("Error fetching data:", error);
    }
  };
  fetchData();
};
```

### 2. API Integration

```javascript
// Fetching activities based on the user's id
const fetchActivities = async () => {
  try {
    const response = await apiClient.get(`activity/readActivities/${userid}`);
    setActivitiesData(response.data);
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Please try again.";
    message.error(`Failed to fetch activities: ${errorMessage}`);
  } finally {
    setLoading(false);
  }
};
```

### 3. Frontend Component

```javascript
setVenuesData((prevVenues) =>
  prevVenues.map((venue) => {
    if (venue._id === venueId) {
      return { ...venue, tags: [...venue.tags, ...newTag] };
    }
    return venue;
  })
);
```

### 4. Backend Controller

```javascript
exports.getGovernorVenues = async (req, res) => {
  try {
    const { governorId } = req.params;

    const venues = await Venue.find({ governorId, isVisible: true });

    if (!venues || venues.length === 0) {
      return res
        .status(404)
        .json({ message: "No venues found for this governor" });
    }

    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### 5. Key Utility Function

```javascript
// Helper function to generate a unique 6-character promo code
const generateUniqueCode = async () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code;
  let existingCode;

  do {
    // Generate a random 6-letter code
    code = Array.from({ length: 6 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");

    // Check if this code already exists in the database
    existingCode = await PromoCode.findOne({ code });
  } while (existingCode);

  return code;
};
```

## Installation

Follow these steps to set up and run the project on your local machine:

### Prerequisites

Ensure the following are installed on your system:

- **Node.js**: [Download and install Node.js](https://nodejs.org/)
- **Git**: For cloning the repository, install [Git](https://git-scm.com/).

### Steps to Install

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Advanced-computer-lab-2024/Ajaza.git

   ```

2. **Install Dependencies**:

   - Install all dependencies for the project:
     ```bash
     npm install
     ```
   - Then, navigate to the `Backend` directory and install its dependencies:
     ```bash
     cd Backend
     npm install
     ```
   - Finally, navigate to the `Frontend` directory and install its dependencies:
     ```bash
     cd ../Frontend
     npm install
     ```

3. **Set Up Environment Variables**:

   - Create a `.env` file in the root directory and add the following variables:

     ```env
     PORT=5000
     NODE_ENV=development
     MONGO_URI=your_mongodb_atlas_connection_string
     ATLAS_URI=your_mongodb_atlas_connection_string

     NODE_MAILER_USER=your_email@example.com
     NODE_MAILER_PASS=your_email_password

     AMADEUS_API_KEY_1=your_amadeus_api_key_1
     AMADEUS_API_SECRET_1=your_amadeus_api_secret_1
     AMADEUS_API_KEY_2=your_amadeus_api_key_2
     AMADEUS_API_SECRET_2=your_amadeus_api_secret_2
     AMADEUS_API_KEY=your_amadeus_api_key
     AMADEUS_API_SECRET=your_amadeus_api_secret

     RAPID_API_KEY_1=your_rapid_api_key_1
     RAPID_API_KEY_2=your_rapid_api_key_2
     RAPID_API_KEY_3=your_rapid_api_key_3
     RAPID_API_KEY=your_rapid_api_key

     GOOGLE_API_KEY_1=your_google_api_key_1
     GOOGLE_API_KEY=your_google_api_key
     CX_1=your_custom_search_engine_id_1
     CX=your_custom_search_engine_id

     STRIPE_SECRET_KEY=your_stripe_secret_key

     JWT_SECRET=your_jwt_secret_key

     BIRTHDAYS=false
     ```

   - **MongoDB Atlas**: Replace `your_mongodb_atlas_connection_string` with your **MongoDB Atlas connection string**:

     - Log in to [MongoDB Atlas](https://www.mongodb.com/atlas).
     - Create or access your cluster.
     - Under **"Connect"**, choose **"Connect your application"**.
     - Copy the connection string and replace `<username>`, `<password>`, and `<database>` with your credentials and database name.

   - **NodeMailer**: Replace `your_email@example.com` and `your_email_password` with your email credentials.

     - If you're using Gmail, generate an **app-specific password** for added security ([How to generate app passwords](https://support.google.com/accounts/answer/185833?hl=en)).

   - **Amadeus API**: Replace `your_amadeus_api_key` and `your_amadeus_api_secret` with your Amadeus API credentials.

   - **Google API Keys**: Replace `your_google_api_key_1` and `your_google_api_key` with your valid Google API keys.

   - **Stripe Secret Key**: Replace `your_stripe_secret_key` with the secret key from your [Stripe Dashboard](https://dashboard.stripe.com/apikeys).

   - **Other Variables**: Replace placeholders like `your_rapid_api_key` and `your_custom_search_engine_id` with their respective values from your API provider or service.

### Security Notes:

- **Do not share your `.env` file** in public repositories or with unauthorized users.
- Add `.env` to your `.gitignore` file to prevent it from being committed to version control.

## API Refrences

You can find the full API documentation [here](https://orensa64.postman.co/workspace/Team-Workspace~f6164667-2aff-4c53-834b-a1c73032dee9/documentation/40153074-40d2618f-4e8c-47aa-9a6c-683771da9b7c)

## Tests

### Overview

The API endpoints were tested using **Postman** to ensure correct functionality and expected responses. A Postman collection is included for easy replication of the tests.

### Postman Collection

The API endpoints used in this project have been tested with Postman. A Postman collection file containing all the API requests is included in the repository.

### How to Use

- Download the Postman collection file: [AJAZA FINAL.postman_collection.json](https://github.com/Advanced-computer-lab-2024/Ajaza/blob/main/Postman/AJAZA%20FINAL.postman_collection.json)
- Open Postman.
- Click on **Import**.
- Upload the downloaded file.
- Use the pre-configured requests to test the API.

### Sample Endpoint

For example, the login endpoint can be tested with the following configuration:

- **URL**: `POST /api/auth/login`
- **Body**:
  ```json
  {
    "username": "testuser",
    "password": "password123"
  }
  ```

### Note

Ensure your backend server is running locally at `http://localhost:5000` before testing the APIs.

## How to Use

### Starting the Development Servers

### Backend Server

- Open your terminal.
- Navigate to the backend folder:
  > ```bash
  > cd Backend
  > ```
- Start the backend development server:
  > ```bash
  > npm run dev
  > ```

### Frontend Server

- Open a new terminal window or tab.
- Navigate to the frontend folder:
  > ```bash
  > cd Frontend
  > ```
- Start the frontend development server:
  > ```bash
  > npm start
  > ```

Both servers should now be running. The backend typically runs on `http://localhost:5000`, and the frontend on `http://localhost:3000` .

### Registration

- **For Tourists:**
  - Click on the "Sign Up" button.
  - Provide your email, username, password, and date of birth (only users over 18 can register).
  - Submit the form to create your account.
- **For Tour Guides, Advertisers, or Sellers:**
  - Select the appropriate role during registration.
  - Fill in your details and any additional role-specific information (e.g., business name for Sellers).
  - Complete the sign-up process.

### Login

- Enter your registered username and password on the login page.
- If you forget your password:
  - Click on "Forgot Password."
  - Enter your registered email to receive a One-Time Password (OTP).
  - Use the OTP to reset your password and regain access.

### User Dashboard

- Once logged in, you will be directed to your personalized dashboard:
  - **Tourists:** Plan trips, book activities, and manage itineraries.
  - **Advertisers:** Create and manage ads for activities or events.
  - **Tour Guides:** Offer guided tours and manage bookings.
  - **Sellers:** Manage the in-app gift shop and product listings.
  - **Admins:** Oversee user accounts, manage complaints, and monitor platform activity.

### Password Management

- To change your password:
  - Navigate to the "Account Settings" section.
  - Enter your current password and the new password.
  - Save changes to update your password.

### Planning a Trip (For Tourists)

- Use the "Trip Planner" feature to create a new trip.
- Set your budget, destination, and travel dates.
- Explore suggested activities and accommodations.
- Add selected items to your itinerary.

### Booking Services

- Find flights, hotels, and transportation options through third-party integrations.
- Complete bookings seamlessly within the platform.

### Discovering Activities

- Browse the "Explore" section to discover local attractions and activities.
- Use filters for categories, dates, or locations to narrow your search.

### Smart Budgeting

- Monitor your remaining budget using the budget tracker.
- Adjust activities or bookings to stay within your limit.

### Managing Feedback and Complaints

- Submit feedback or complaints about services or activities:
  - Use the "Feedback" section to provide ratings and comments.
  - Track the status of your complaint from your dashboard.

### Real-Time Notifications

- Enable notifications to receive updates about bookings, itinerary changes, or exclusive offers.

### Gift Shop (For Sellers)

- Add, edit, or remove items from the in-app shop.
- Manage orders and customer inquiries.

### Admin Features

- View and manage all user accounts.
- Oversee the nomination and selection process for the Employee of the Month.
- Review and resolve user complaints.

## Contribute

We welcome contributions to improve the project! Whether it’s reporting a bug, suggesting a new feature, or improving documentation, your input is valuable.

### How to Contribute

1.**Clone the Repository**:

- Clone the repository directly to your local machine:

  ```bash
  git clone https://github.com/Advanced-computer-lab-2024/Ajaza.git
  ```

  2.**Create a Branch**:

- Create a new branch for your changes:

  ```bash
  git checkout -b feature/your-feature-name
  ```

  3.**Make Changes**:

- Implement your feature or fix and commit the changes:

  ```bash
  git add .
  git commit -m "Description of your changes"
  ```

  4.**Push Changes**:

- Push your changes to the remote repository:

  ```bash
  git push origin feature/your-feature-name
  ```

  5.**Submit a Pull Request**:

- Go to the repository on GitHub and create a Pull Request from your branch.

### Contribution Guidelines

- Ensure your code follows the project’s style guide and conventions.
- Include descriptive commit messages for clarity.
- Test your changes thoroughly before submitting a Pull Request.
- For larger changes, open an issue first to discuss the idea with maintainers.

### Reporting Issues

If you encounter a bug or have a feature request, please open an issue in the repository with the following details:

- Description of the issue or feature.
- Steps to reproduce the issue (if applicable).
- Screenshots or error logs (if relevant).

We appreciate your contributions and look forward to collaborating with you!

## Credits

This project was made possible with the help of the following resources:

- **Documentation and Tutorials**:

  - [MongoDB Documentation](https://www.mongodb.com/docs/manual/) – For setting up and managing the database.
  - [Node.js Documentation](https://nodejs.org/en/docs/) – For server-side development guidance.
  - [React.js Documentation](https://reactjs.org/docs/) – For building the frontend components.

- **YouTube Tutorials**:

  - [FreeCodeCamp MERN Stack Tutorial](https://www.youtube.com/watch?v=7CqJlxBYj-M) – For insights on setting up the MERN stack.
  - [Traversy Media: Node.js API Authentication](https://www.youtube.com/watch?v=Z1ktxiqyiLA) – For implementing authentication with JWT.

- **Libraries and APIs**:

  - [Amadeus API](https://developers.amadeus.com/) – For travel-related data and services.
  - [Stripe Documentation](https://stripe.com/docs) – For payment integration.

- **Community Support**:
  - [Stack Overflow](https://stackoverflow.com/) – For resolving coding challenges.
  - [GitHub Discussions](https://github.com/) – For collaboration and troubleshooting.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

### Third-Party Licenses

This project uses third-party libraries and services that are subject to their own licenses:

- **Stripe**: Licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0).
- **React.js**: Licensed under the [MIT License](https://github.com/facebook/react/blob/main/LICENSE).
- **MongoDB**: Subject to the [MongoDB Server Side Public License](https://www.mongodb.com/licensing/server-side-public-license).
- **Amadeus API**: Refer to the [Amadeus API Terms of Service](https://developers.amadeus.com/support).
