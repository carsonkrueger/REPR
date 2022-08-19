import React, { useRef } from "react";
import { StyleSheet, View, Text } from "react-native";

const PrevComponent = ({ info, date, index }) => {
  const isIndexEven = useRef(index % 2 === 0 ? true : false);

  const dayTh = useRef(["st", "nd", "rd", "th"]);

  function getDayTh() {
    if (parseInt(date.day) >= 11 && parseInt(date.day) <= 13)
      return dayTh.current[3];
    switch (parseInt(date.day) % 10) {
      case 1:
        return dayTh.current[0];
      case 2:
        return dayTh.current[1];
      case 3:
        return dayTh.current[2];
      default:
        return dayTh.current[3];
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    dateText: {
      fontSize: 25,
      // color: isIndexEven.current ? "black" : "#2494f0",
      paddingVertical: date.month === "" ? "0%" : "3%",
      color: "#2494f0",
      fontFamily: "RobotoCondensedLight",
      paddingLeft: "3%",
      textAlign: "center",
    },
    headerContainer: {
      flexDirection: "row",
      flex: 0.8,
      marginRight: "5%",
    },
    headerText: {
      fontSize: 14,
      color: "black",
      fontFamily: "RobotoCondensedLight",
      textAlign: "center",
    },
    dayIntAndSetsContainer: {
      flexDirection: "row",
      alignItems: "center",
      // borderWidth: 1,
      // paddingVertical: "3%",
      // marginHorizontal: "3%",
      // borderRadius: 5,
    },
    dayIntContainer: {
      flex: 0.2,
      flexDirection: "row",
      // alignItems: "center",
    },
    dayIntText: {
      flex: date.day.length > 1 ? 0.7 : 0.55,
      color: "#2494f0",
      textAlign: "right",
      fontSize: 40,
      fontFamily: "RobotoCondensedLight",
    },
    dayThText: {
      paddingTop: "12%",
      flex: date.day.length > 1 ? 0.3 : 0.45,
      textAlign: "left",
      color: "#2494f0",
      fontFamily: "RobotoCondensedLight",
    },
    allSetsContainer: {
      flex: 0.8,
      backgroundColor: isIndexEven.current ? "#ededed" : "white",
      borderRadius: 5,
      marginRight: "5%",
    },
    setsRow: {
      flexDirection: "row",
      margin: ".5%",
    },
    setsText: {
      fontSize: 14,
      color: "black",
      fontFamily: "RobotoCondensedLight",
      textAlign: "center",
    },
    set: {
      flex: 1,
    },
    weightReps: {
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{date.month}</Text>
      <View style={styles.setsRow}>
        {/*empty view for day int space*/}
        <View style={styles.dayIntContainer}></View>

        <View style={styles.headerContainer}>
          <Text style={[styles.headerText, styles.set]}>SET</Text>
          <Text style={[styles.headerText, styles.weightReps]}>WEIGHT</Text>
          <Text style={[styles.headerText, styles.weightReps]}>REPS</Text>
        </View>
      </View>

      <View style={styles.dayIntAndSetsContainer}>
        <View style={styles.dayIntContainer}>
          <Text style={styles.dayIntText}>{date.day}</Text>
          <Text style={styles.dayThText}>{getDayTh()}</Text>
        </View>

        <View style={styles.allSetsContainer}>
          {info.reps.map((rep, idx) => (
            <View key={idx} style={styles.setsRow}>
              <Text style={[styles.setsText, styles.set]}>{idx + 1}</Text>
              <Text style={[styles.setsText, styles.weightReps]}>
                {info.weights[idx] !== "" ? info.weights[idx] : "-----"}
              </Text>
              <Text style={[styles.setsText, styles.weightReps]}>
                {rep !== "" ? rep : "-----"}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default PrevComponent;
