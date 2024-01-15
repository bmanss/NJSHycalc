"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";
import styles from "../styles/InputCounter.module.scss";

export const InputCounter = ({ value, onChange, min, max, inputWidth, floating, precision, step, isStatic }) => {
  const [counterValue, setCounterValue] = useState(() => {
    const val = value ?? 0;
    return Number(val).toFixed(precision ?? 0);
  });

  // if value manually changed update it
  useEffect(() => {
    if (value !== counterValue) {
      setCounterValue(Number(value).toFixed(precision ?? 0));
    }
  }, [value]);

  function updateValue(newVal) {
    let val = Math.max(min ?? 0, Math.min(max ?? 0, newVal));
    val = floating ? val : Math.floor(val);
    val = precision ? val.toFixed(precision) : val;
    setCounterValue(val);
    onChange && onChange(Number(val));
  }

  function handleSetCounter(value) {
    if (/^\d+(\.\d*)?$/.test(value)) {
      setCounterValue(value);
    } else {
      setCounterValue(counterValue);
    }
  }

  return (
    <span className={styles["inputCounter"]}>
      <input
        style={{ width: inputWidth && inputWidth }}
        readOnly={isStatic ? true : false}
        value={counterValue}
        onChange={(e) => handleSetCounter(e.target.value)}
        onBlur={(e) => updateValue(e.target.value)}></input>
      {!isStatic && (
        <div className={styles['inputCounter-Arrows']}>
          <button onClick={() => updateValue(parseFloat(counterValue) + (step || 1))}>
            <div className='arrow up' />
          </button>
          <button onClick={() => updateValue(parseFloat(counterValue) - (step || 1))}>
            <div className='arrow down' />
          </button>
        </div>
      )}
    </span>
  );
};

export default InputCounter;
