import React, { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  // AppState,
} from "react-native";

import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("GymTracker");

const SearchComponent = ({ exercise }) => {
  //   console.log(exercise);
  const [searchList, setSearchList] = useState([]);
  const SEARCH_LIMIT = 5;

  const loadSearchList = () => {
    db.transaction((tx) =>
      tx.executeSql(
        "SELECT DISTINCT Name FROM Prevs WHERE Name LIKE ? LIMIT ?",
        [`%${exercise}%`, SEARCH_LIMIT],
        (tx, result) => {
          let tempSearchList = [];

          for (let i = 0; i < result.rows.length; i++) {
            tempSearchList.push(result.rows.item(i).Name);
          }
          setSearchList(tempSearchList);
          console.log(tempSearchList);
        },
        (tx, err) => console.log("ERROR LOADING SEARCH LIST", err)
      )
    );
  };

  useEffect(() => {
    loadSearchList();
  }, [exercise]);

  const styles = StyleSheet.create({
    container: {
      position: "absolute",
    },
    searchItemContainer: {
      backgroundColor: "white",
    },
    searchItemText: {
      color: "#2494f0",
    },
  });

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={searchList}
      renderItem={({ item, index }) => {
        <TouchableOpacity style={styles.searchItemContainer}>
          <Text style={styles.searchItemText}>{item}</Text>
        </TouchableOpacity>;
      }}
      ListEmptyComponent={<Text>EMPTY LIST</Text>}
    />
  );
};

export default SearchComponent;
