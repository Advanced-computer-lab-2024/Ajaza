import logo from "./logo.svg";
import "./App.css";
import { Button, Search, CircularButton, CustomLayout } from "./Components";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { BellFilled, UserOutlined } from "@ant-design/icons";
import { IconButton, SideBar } from "./Components";
import { Colors } from "./Components/Constants";
import Profile from "./Components/Profile";
import Itineraries from "./Components/Itineraries";
import Activities from "./Components/Activities";

function App() {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate(); // Use navigate for routing

  const testFunction = (param1, param2) => {
    console.log(param1, param2);
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/itineraries" element={<Itineraries />} />
        <Route path="/activities" element={<Activities />} />
        <Route
          path="/"
          element={
            <CustomLayout>
              <div>
                <Button size={"s"} value={"Button"} rounded={false} />
                <Button
                  size={"s"}
                  value={"Button"}
                  rounded={true}
                  onClick={() => testFunction(1, 2)}
                  style={{ marginLeft: "40px" }}
                />

                <Button size={"m"} value={"Button"} rounded={false} />
                <Button size={"m"} value={"Button"} rounded={true} />

                <Button size={"l"} value={"Button"} rounded={false} />
                <Button size={"l"} value={"Button"} rounded={true} />

                <Search
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  size={"l"}
                  style={{ marginLeft: "40px" }}
                />

                <Search
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  size={"s"}
                  activateHover={false}
                  style={{ marginLeft: "40px" }}
                />

                <Search
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  size={"m"}
                  activateHover={false}
                  style={{ marginLeft: "40px" }}
                />

                <Search
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  size={"l"}
                  activateHover={false}
                  style={{ marginLeft: "40px" }}
                />
              </div>
            </CustomLayout>
          }
        />
      </Routes>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
