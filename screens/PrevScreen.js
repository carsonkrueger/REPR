import React, { useEffect, useState, useRef } from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

import * as SQLite from "expo-sqlite";

import PrevComponent from "../components/PrevComponent";
import { Feather } from "@expo/vector-icons";

import { AdMobBanner, setTestDeviceIDAsync } from "expo-ads-admob";

setTestDeviceIDAsync("EMULATOR");

const db = SQLite.openDatabase("GymTracker");

const PrevScreen = ({ navigation, route }) => {
  const initialState = useRef({
    weights: [""],
    reps: [""],
    lastPerformed: "",
  });

  const [prevList, setPrevList] = useState([]);
  const limit = useRef(10);
  const curOffset = useRef(0);

  const dateList = useRef([]);
  const curMonth = useRef("null");
  const curYear = useRef(null);
  const months = useRef([
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ]);

  const getDates = (lastPerformed, yearInt) => {
    let [monthInt, dayInt] = lastPerformed.split("-");

    // check month
    if (curMonth.current !== months.current[monthInt]) {
      curMonth.current = months.current[monthInt];
      monthInt = months.current[monthInt];
    } else {
      monthInt = "";
    }

    // check year
    if (curYear.current !== yearInt) curYear.current = yearInt;
    // else if (curYear.current == null) {
    //   yearInt = 2022;
    //   curYear.current = yearInt;
    // }
    else yearInt = "";

    return { month: monthInt, day: dayInt, year: yearInt };
  };

  const loadData = () => {
    if (
      route.params.originalExercise === "" ||
      route.params.originalExercise == undefined
    )
      return;

    try {
      db.transaction((tx) =>
        tx.executeSql(
          // (ID, Name, Weights, Reps, LastPerformed)
          // "SELECT * FROM Prevs WHERE Name = ? AND ID = ? ORDER BY Year DESC, LastPerformed DESC LIMIT ? OFFSET ?", //
          "SELECT *, TRIM(substr(LastPerformed, instr(LastPerformed,'-')+1)) AS month, TRIM(substr(LastPerformed, 1, instr(LastPerformed,'-')-1)) AS day from Prevs WHERE Name = ? AND ID = ? ORDER BY Year DESC, month DESC, day DESC LIMIT ? OFFSET ?;",
          [
            route.params.originalExercise,
            route.params.WORKOUT_ID,
            limit.current,
            curOffset.current,
          ],
          (tx, result) => {
            // console.log(result.rows._array);
            curOffset.current += 10;
            let tempPrevList = [];
            let tempDateList = [];
            for (let i = 0; i < result.rows.length; i++) {
              tempPrevList.push({
                // name: result.rows.item(i).Name,
                weights: JSON.parse(result.rows.item(i).Weights),
                reps: JSON.parse(result.rows.item(i).Reps),
                // lastPerformed: result.rows.item(i).LastPerformed,
              });

              tempDateList.push(
                getDates(
                  result.rows.item(i).LastPerformed,
                  result.rows.item(i).Year
                )
              );
            }

            if (dateList.current.length === 0) {
              dateList.current = tempDateList;
            }

            if (prevList.length === 0) {
              // replaces state directly
              setPrevList(tempPrevList);
            } else {
              // adds to current state
              dateList.current = dateList.current.concat(tempDateList);
              let temp = [...prevList].concat(tempPrevList);
              setPrevList(temp);
            }
            // console.log(dateList.current);
          },
          (tx, error) => console.log("Could not load prev data", error)
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFFFFF",
    },
    scrollContainer: {
      paddingBottom: "20%",
    },
    titleContainer: {
      marginTop: "4%",
      marginHorizontal: "5%",
      padding: "2.5%",
      backgroundColor: "#2494f0",
      borderRadius: 7,
      flexDirection: "row",
      alignItems: "center",
    },
    backArrow: {
      flex: 0.08,
    },
    titleText: {
      flex: 0.92,
      textAlign: "center",
      color: "white",
      fontSize: 18,
      fontFamily: "RobotoCondensedRegular",
    },
    noHistoryContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    noHistoryText: {
      padding: "10%",
      fontSize: 18,
      textAlign: "center",
      justifyContent: "center",
      color: "#2494f0",
      fontFamily: "RobotoCondensedLight",
    },
  });

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.scrollContainer}
        data={prevList}
        onEndReached={loadData}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <View style={styles.titleContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" color={"white"} size={26} />
            </TouchableOpacity>

            <Text style={styles.titleText}>
              {route.params.exercise} HISTORY
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <PrevComponent
            key={index}
            info={item}
            date={dateList.current[index]}
            index={index}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.noHistoryContainer}>
            <Text style={styles.noHistoryText}>NO HISTORY</Text>
          </View>
        )}
      />

      <AdMobBanner
        // style={styles.bottomBanner}
        bannerSize="smartBannerPortrait"
        // real ad: ca-app-pub-8357822625939612/1402507891
        adUnitID="ca-app-pub-8357822625939612/1402507891" //"ca-app-pub-3940256099942544/6300978111" // Test ID, Replace with your-admob-unit-id
        servePersonalizedAds={true} // true or false
        // testID={"device"}
        onDidFailToReceiveAdWithError={(e) =>
          console.log("AD RECIEVED W/ ERROR", e)
        }
      />
    </View>
  );
};

export default PrevScreen;
