import React from "react";
import styles from "./Input.module.css";

const Input = () => {
  return (
    <div className={styles.input}>
      <input type="text" required spellcheck="false" />
      <label>Last Name</label>
    </div>
  );
};

export default Input;
