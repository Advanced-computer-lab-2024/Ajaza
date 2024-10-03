import { Button, Search, CircularButton, CustomLayout } from "./Components";

import { useState } from "react";
import { BellFilled, UserOutlined } from "@ant-design/icons";
import { IconButton, SideBar } from "./Components";
import { Colors } from "./";

function TestingComponents() {
  const [searchValue, setSearchValue] = useState("");

  const testFunction = (param1, param2) => {
    console.log(param1, param2);
  };

  return (
    <div>
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

          <IconButton
            icon={BellFilled}
            backgroundColor={Colors.primary.default}
            badge={{ count: "5" }}
            onClick={() => testFunction(1, 2)}
            style={{ margin: "50px" }}
          />

          <IconButton
            icon={UserOutlined}
            backgroundColor={Colors.primary.default}
            onClick={() => testFunction(1, 2)}
            style={{ marginLeft: "50px" }}
          />
        </div>
      </CustomLayout>
    </div>
  );
}

export default TestingComponents;
