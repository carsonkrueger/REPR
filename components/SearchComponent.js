import React, { useEffect, useState, useRef } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
  // AppState,
} from "react-native";

// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
//   interpolate,
//   Extrapolate,
// } from "react-native-reanimated";

import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("GymTracker");

const SearchComponent = ({
  exercise,
  setExercise,
  doSearch,
  setDoSearch,
  numExercise,
  titleHeight,
}) => {
  //   console.log(exercise);
  const [searchList, setSearchList] = useState([]);

  const SEARCH_LIMIT = 5;
  const TWENTHYTH_SECOND = 50;

  // const searchBoxHeight = useRef(0);
  // const animHeight = useSharedValue(0);

  const onSearchItemPress = (item) => {
    Vibration.vibrate(TWENTHYTH_SECOND);
    setExercise(item, numExercise);
    setDoSearch(false);
  };

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
          // console.log(tempSearchList);
        },
        (tx, err) => console.log("ERROR LOADING SEARCH LIST", err)
      )
    );
  };

  // const handleHeightAnim = () => {
  //   "worklet";
  //   animHeight.value = withTiming(searchBoxHeight.current);
  // };

  // const heightAnimStyle = useAnimatedStyle(() => {
  //   return {
  //     height: withTiming(searchBoxHeight.current, {
  //       duration: 300,
  //     }),
  //   };
  // });

  useEffect(() => {
    // assign search list
    if (doSearch) loadSearchList();
    // clear search list
    else setSearchList([]);
  }, [exercise, doSearch]);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: "white",
      position: "absolute",
      zIndex: 2,
      marginTop: titleHeight + 3,
      marginLeft: 12,
      padding: 3,
      borderRadius: 5,
      borderWidth: searchList.length <= 0 ? 0 : 1,
      borderColor: "#bdbdbd",
    },
    searchItemContainer: {
      paddingVertical: 2,
    },
    searchItemText: {
      color: "#2494f0",
      fontFamily: "RobotoCondensedRegular",
      fontSize: 16,
    },
  });

  return (
    <View
      style={[styles.container]}
      // onLayout={(event) => {
      //   searchBoxHeight.current = event.nativeEvent.layout.height;
      //   console.log(event.nativeEvent.layout.height);
      // }}
    >
      {searchList.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.searchItemContainer}
          onPress={() => onSearchItemPress(item)}
        >
          <Text style={styles.searchItemText}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SearchComponent;
