import logo from "./logo.svg";
import "./App.css";
import { Button, Search, CircularButton } from "./Components";

import { useState } from "react";
import { BellFilled } from "@ant-design/icons";
import { IconButton, SideBar } from "./Components";
import { Colors } from "./Components/Constants";

function App() {
  const [searchValue, setSearchValue] = useState("");

  const testFunction = (param1, param2) => {
    console.log(param1, param2);
  };

  return (
    <div className="App">
      {/* <NavBar/> */}
      <header className="App-header">
        <div>
          <Button size={"s"} value={"Button"} rounded={false} />
          <Button
            size={"s"}
            value={"Button"}
            rounded={true}
            onClick={() => testFunction(1, 2)}
          />

          <Button size={"m"} value={"Button"} rounded={false} />
          <Button size={"m"} value={"Button"} rounded={true} />

          <Button size={"l"} value={"Button"} rounded={false} />
          <Button size={"l"} value={"Button"} rounded={true} />

          <Search
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            size={"l"}
          />

          <Search
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            size={"s"}
            initialHover={true}
          />

          <Search
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            size={"m"}
            initialHover={true}
          />

          <Search
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            size={"l"}
            initialHover={true}
          />

          <IconButton
            icon={BellFilled}
            backgroundColor={Colors.primary.default}
            badge={{ count: "5" }}
            onClick={() => testFunction(1, 2)}
          />
        </div>
      </header>
      <SideBar />
    </div>
  );
}

export default App;
