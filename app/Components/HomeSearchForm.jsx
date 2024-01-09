"use client";

import React from "react";
import { useState } from "react";
import styles from "../styles/homePage.module.scss";
import { redirectDefault,redirectPlayer } from "../actions";
const HomeSearchForm = () => {
  const [playerName, setPlayerName] = useState("");
  return (
    <form className={styles.profileSearch} action={() => redirectPlayer(playerName)}>
      <input onChange={(e) => setPlayerName(e.target.value)} placeholder='Player Name' type='text' />
      <button>Load</button>
      <button action={() => redirectDefault(playerName)}>No Profile</button>
    </form>
  );
};

export default HomeSearchForm;
