"use client";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { rarityColor } from "../constants/colors";
import { tiers } from "../lib/ProfileFunctions";
import styles from "../styles/SearchBox.module.scss";


const dropdownMaxHeight = 280;

const formatItemName = (item) => {
  const name = item.name || item;
  return name.replaceAll("_", " ").toLowerCase();
};
const SearchBox = ({ itemList, selectedItem, onItemChange, recombob, placeholder, inputFontSize, maxWidth }) => {
  const dropdownHeight = Math.min(itemList.length * 25,dropdownMaxHeight);
  const item = selectedItem || itemList[0];
  const [dropDownVisible, setDropdownVisible] = useState(false);
  const [displayItems, setDisplayItems] = useState(itemList);
  const [displayItemName, setDisplayItemName] = useState(item.name || item);
  const [activeIndex, setActiveIndex] = useState(0);
  const [tier, setTier] = useState(recombob ? tiers[tiers.indexOf(item.tier) + 1 != -1 || tiers.indexOf(item.tier)] : item.tier ?? "COMMON");
  const [openDirection, setOpenDirection] = useState("down");
  const completeList = useRef(itemList);
  const actualItem = useRef(item);
  const inputFocusedRef = useRef(false);
  const dropdownFocusedRef = useRef(false);
  const indicatorFocusedRef = useRef(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const searchBoxRef = useRef(null);
  const actualIndex = useRef(0);

  useEffect(() => {
    getItemTier(actualItem.current.tier);
  }, [recombob]);

  useEffect(() => {
    if (selectedItem !== undefined) {
      const item = selectedItem;
      const displayName = item?.name || item;
      setDisplayItemName(displayName);
      actualItem.current = item;
      getItemTier(item.tier);
      const index = itemList.findIndex((item) => (item.name || item) === displayName);
      actualIndex.current = index;
      setActiveIndex(index);
      if (dropdownRef.current) {
        dropdownRef.current.scrollTop = index * 25;
      }
    }
  }, [JSON.stringify(selectedItem)]);

  useEffect(() => {
    if (itemList !== undefined) {
      setDisplayItems(itemList);
      completeList.current = itemList;
    }
  }, [JSON.stringify(itemList)]);

  const getItemTier = (tier) => {
    const tierIndex = tiers.indexOf(tier);
    if (tiers[tierIndex + 1]) {
      setTier(recombob ? tiers[tierIndex + 1] : tier);
    } else {
      setTier(tier);
    }
  };

  const handleInputChange = (event) => {
    const input = event.target.value.toLowerCase();
    setDisplayItemName(input);
    setActiveIndex(0);
    const matchedItems = completeList.current.filter((item) => {
      return (item.name ?? item).toLowerCase().includes(input);
    });

    setDisplayItems(matchedItems);
  };

  const handleItemSelect = (index) => {
    const item = displayItems[index];
    actualIndex.current = index;
    setDropdownVisible(false);
    dropdownFocusedRef.current = false;
    actualItem.current = item.name || item;
    setDisplayItems(completeList.current);
    setDisplayItemName(item.name || item);
    onItemChange && onItemChange(item.id || item);
    if (searchBoxRef.current) {
      searchBoxRef.current.focus();
    }
  };

  const resetDisplay = () => {
    setActiveIndex(actualIndex.current);
    setDropdownVisible(false);
    setDisplayItemName(actualItem.current.name || actualItem.current);
    setDisplayItems(completeList.current);
  };

  const handleFocusLost = (focusRef) => {
    focusRef.current = false;
    if (dropdownFocusedRef.current === false && inputFocusedRef.current === false && indicatorFocusedRef.current === false) {
      resetDisplay();
    }
  };

  const openSearchBox = () => {
    setTimeout(() => {
      if (dropdownRef.current) {
        dropdownRef.current.scrollTop = activeIndex * 25;
      }
    }, 1);
    setDropdownVisible(true);
    setDisplayItemName("");
    setOpenDirection(getOpenDirection());
  };

  const handleSearchBoxClick = () => {
    if (!inputFocusedRef.current) {
      openSearchBox();
      inputFocusedRef.current = true;
    }
  };

  const handleIndicatorClick = () => {
    if (dropDownVisible) {
      resetDisplay();
      dropdownFocusedRef.current = false;
      inputFocusedRef.current = false;
    } else {
      openSearchBox();
      indicatorFocusedRef.current = true;
    }
  };

  const handleInputKeyDown = (event) => {
    if ((event.key === "Tab" || event.key === "Enter") && displayItems[0]) {
      inputFocusedRef.current = false;
      handleItemSelect(activeIndex);
    } else if (event.key === "Escape") {
      resetDisplay();
      dropdownFocusedRef.current = false;
      inputFocusedRef.current = false;
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
    }
  };

  const handleKeyNavigation = (event) => {
    if (event.target.tagName !== 'INPUT' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
    }
    setActiveIndex((cur) => {
      let nextIndex = cur;
      if (event.key === "ArrowUp") {
        nextIndex = Math.max(0, cur - 1);
      } else if (event.key === "ArrowDown") {
        nextIndex = Math.min(cur + 1, displayItems.length - 1);
      }
      const scrollOffset = 25 * nextIndex;
      // 300 is height of dropdown and 25 is the height if each dropdown item
      if (dropdownRef.current) {
        // scroll up to the next item
        if (scrollOffset < dropdownRef.current.scrollTop) {
          dropdownRef.current.scrollTop = scrollOffset;
        }
        // scroll down to the next item
        else if (scrollOffset >= dropdownRef.current.scrollTop + dropdownHeight) {
          dropdownRef.current.scrollTop = scrollOffset + 25 - dropdownHeight;
        }
      }
      if (!dropDownVisible) {
        handleItemSelect(Math.min(nextIndex, displayItems.length - 1));
      }
      return nextIndex;
    });
  };

  const getOpenDirection = () => {
    const rect = inputRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalElementHeight = rect.y + dropdownHeight + rect.height;
    return totalElementHeight >= windowHeight ? "up" : "down";
  };

  return (
    <div
      className={styles["SearchBox"]}
      style={{ maxWidth: maxWidth && maxWidth }}
      tabIndex={-1}
      ref={searchBoxRef}
      onKeyDown={(e) => {
        handleKeyNavigation(e);
      }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type='text'
          ref={inputRef}
          className={`${styles["SearchBox-Input"]}`}
          onMouseDown={handleSearchBoxClick}
          onKeyDown={handleInputKeyDown}
          readOnly={!inputFocusedRef.current}
          onBlur={() => handleFocusLost(inputFocusedRef)}
          style={{
            fontSize: inputFontSize && inputFontSize,
            color: !inputFocusedRef.current && rarityColor[tier],
            cursor: dropDownVisible ? "text" : "pointer",
          }}
          placeholder={placeholder || "Type to search"}
          value={`${displayItemName.replaceAll("_", " ").toLowerCase()}`}
          onChange={handleInputChange}
        />
        <span
          tabIndex={0}
          onMouseDown={handleIndicatorClick}
          onBlur={() => handleFocusLost(indicatorFocusedRef)}
          className={styles["SearchBox-Dropdown-Indicator"]}>
          {dropDownVisible ? "-" : "+"}
        </span>
      </div>
      {dropDownVisible && (
        <ul
          onMouseDown={() => {
            dropdownFocusedRef.current = true;
          }}
          onBlur={() => {
            handleFocusLost(dropdownFocusedRef);
          }}
          tabIndex={0}
          className={`${styles["SearchBox-Dropdown"]} ${styles[openDirection]}`}
          ref={dropdownRef}>
          {displayItems.map((item, index) => (
            <li
              onClick={() => handleItemSelect(index)}
              className={styles["SearchBox-Dropdown-item"]}
              onMouseMoveCapture={() => setActiveIndex(index)}
              style={{ color: rarityColor[item.tier] ?? "white", backgroundColor: index === activeIndex && "rgb(32, 113, 124)" }}
              key={index}>
              {formatItemName(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
