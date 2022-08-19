import React, { useEffect, useState, useRef } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";

import WorkoutComponent from "../components/WorkoutComponent";
import TemplateComponent from "../components/templateComponent";

import * as SQLite from "expo-sqlite";
import { useIsFocused } from "@react-navigation/native";
import { useFonts } from "expo-font";

import { AdMobBanner, setTestDeviceIDAsync } from "expo-ads-admob";

// setTestDeviceIDAsync("device");

const db = SQLite.openDatabase("GymTracker");

const HomeScreen = ({ navigation }) => {
  const [workoutList, setWorkoutList] = useState([]);

  const [forceUpdate, setForceUpdate] = useState(0);
  const isFocused = useIsFocused();

  const windowWidth = useRef(Dimensions.get("window").width);
  const windowHeight = useRef(Dimensions.get("window").height);

  const templateWorkouts = useRef([
    {
      workoutName: "PUSH",
      workoutInfo: [
        {
          exercise: "BENCH PRESS",
          weights: ["", "", ""],
          reps: ["8", "8", "8"],
          restTimer: "150",
        },
        {
          exercise: "DB. SH. PRESS",
          weights: ["", "", ""],
          reps: ["10", "10", "10"],
          restTimer: "120",
        },
        {
          exercise: "CHEST FLYS",
          weights: ["", "", ""],
          reps: ["12", "12", "12"],
          restTimer: "120",
        },
        {
          exercise: "DB. LATERAL RAISES",
          weights: ["", "", ""],
          reps: ["15", "15", "15"],
          restTimer: "90",
        },
        {
          exercise: "TRICEP KICKBACKS",
          weights: ["", "", ""],
          reps: ["15", "15", "15"],
          restTimer: "90",
        },
      ],
    },
    {
      workoutName: "PULL",
      workoutInfo: [
        {
          exercise: "LAT PULL DOWN",
          weights: ["", "", ""],
          reps: ["12", "12", "12"],
          restTimer: "120",
        },
        {
          exercise: "BARBELL ROWS",
          weights: ["", "", ""],
          reps: ["10", "10", "10"],
          restTimer: "120",
        },
        {
          exercise: "EZ BAR CURLS",
          weights: ["", "", ""],
          reps: ["12", "12", "12"],
          restTimer: "120",
        },
        {
          exercise: "PREACHER CURLS",
          weights: ["", "", ""],
          reps: ["15", "15", "15"],
          restTimer: "120",
        },
        {
          exercise: "CABLE FACE PULL",
          weights: ["", "", ""],
          reps: ["15", "15", "15"],
          restTimer: "30",
        },
      ],
    },
    {
      workoutName: "LEGS",
      workoutInfo: [
        {
          exercise: "HACK SQUAT",
          weights: ["", "", "", ""],
          reps: ["8", "8", "8", "8"],
          restTimer: "180",
        },
        {
          exercise: "DEADLIFT",
          weights: ["", ""],
          reps: ["10", "10"],
          restTimer: "150",
        },
        {
          exercise: "LEG EXTENSIONS",
          weights: ["", "", ""],
          reps: ["12", "12", "12"],
          restTimer: "90",
        },
        {
          exercise: "BARBELL THRUSTS",
          weights: ["", "", ""],
          reps: ["12", "12", "12"],
          restTimer: "90",
        },
        {
          exercise: "CALF RAISES",
          weights: ["", "", ""],
          reps: ["15", "15", "15"],
          restTimer: "75",
        },
      ],
    },
  ]);

  const createWorkoutsTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS Workouts (ID INTEGER PRIMARY KEY AUTOINCREMENT, Name STRING NOT NULL, WorkoutInfo STRING, IsLocked BOOL, LastPerformed DATE);",
        null,
        null,
        (tx, error) => console.log("ERROR")
      );
    });
  };

  const createTemplateTable = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS Templates (ID INTEGER PRIMARY KEY AUTOINCREMENT, Name STRING NOT NULL UNIQUE, WorkoutInfo STRING, IsLocked BOOL);"
        );
      },
      (tx, error) => console.log("ERROR")
    );
  };

  const createPrevsTable = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS Prevs (ID INTEGER, Name STRING NOT NULL, Weights STRING, Reps STRING, LastPerformed DATE);",
          null,
          null,
          (tx, error) => console.log("Could not make table Prevs", error)
        );
      },
      (tx, error) => console.log("ERROR")
    );
  };

  const resetTables = () => {
    db.transaction((tx) => tx.executeSql("DROP TABLE Workouts"));
    db.transaction((tx) => tx.executeSql("DROP TABLE Templates"));
    db.transaction((tx) => tx.executeSql("DROP TABLE Prevs"));
  };

  const fillTemplateTable = () => {
    for (let i = 0; i < templateWorkouts.current.length; i++) {
      db.transaction((tx) =>
        tx.executeSql(
          "INSERT OR IGNORE INTO Templates (Name, WorkoutInfo, IsLocked) VALUES (?,?,?);", //WHERE NOT EXISTS ( SELECT 1 FROM Templates WHERE Name = ? )",
          [
            templateWorkouts.current[i].workoutName,
            JSON.stringify(templateWorkouts.current[i].workoutInfo),
            false, // IsLocked
          ],
          null,
          (tx, error) => console.log("ERROR CREATING TEMPLATE DATA", error)
        )
      );
    }
  };

  const loadWorkoutData = () => {
    // workoutList data loading
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT ID, Name, WorkoutInfo, LastPerformed FROM Workouts ORDER BY LastPerformed DESC",
          null,
          (tx, result) => {
            let tempExer = [];
            result.rows._array.forEach((workout) => tempExer.push(workout));
            setWorkoutList(tempExer);
          },
          (tx, error) =>
            console.log("ERROR loading homescreen WorkoutList data") // error cb
        );
      });
    } catch (error) {
      console.log("ERROR LOADING HOMESCREEN WorkoutList DATA");
    }
  };

  // const loadTemplateData = () => {
  //   // templateList data loading
  //   try {
  //     db.transaction((tx) => {
  //       tx.executeSql(
  //         "SELECT ID, Name, Exercises FROM Templates", // ORDER BY LastPerformed
  //         null,
  //         (tx, result) => {
  //           setTemplateList(result.rows._array);
  //           // console.log(result.rows._array);
  //         },
  //         (tx, error) =>
  //           console.log("ERROR loading homescreen TemplateList data") // error cb
  //       );
  //     });
  //   } catch (error) {
  //     console.log("ERROR LOADING HOMESCREEN TemplateList DATA");
  //   }
  // };

  useEffect(() => {
    // resetTables();
    createWorkoutsTable();
    createTemplateTable();

    fillTemplateTable();
    createPrevsTable();
    // printPrevData();
  }, []);

  useEffect(() => {
    isFocused && loadWorkoutData();
  }, [isFocused, forceUpdate]);

  const [fontLoaded] = useFonts({
    RobotoCondensedRegular: require("../assets/fonts/RobotoCondensed-Regular.ttf"),
    RobotoCondensedLight: require("../assets/fonts/RobotoCondensed-Light.ttf"),
  });
  if (!fontLoaded) return null;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: "white",
    },
    scrollContainer: {
      paddingBottom: "60%",
    },
    screenHeader: {
      paddingTop: 25,
      // backgroundColor: "#2494f0", //"white",
      paddingBottom: 10,
      borderRadius: 20,
      alignItems: "center",
    },
    screenHeaderText: {
      fontFamily: "RobotoCondensedLight",
      fontSize: 25,
      color: "#2494f0", //"#2494f0",
    },
    subHeaderContainer: {
      width: "100%",
      paddingLeft: "2%",
      paddingVertical: "2%",
    },
    subHeaderText: {
      fontFamily: "RobotoCondensedLight",
      paddingTop: "3%",
      paddingLeft: "5%",
      fontSize: 15,
      color: "#9c9c9c",
    },
    newCreateWorkoutContainer: {
      width: "90%",
      marginVertical: "4%",
      marginHorizontal: "5%",
      justifyContent: "center",
      alignItems: "center",
      // borderWidth: 1,
      // borderColor: "#c9c9c9",
      borderRadius: 10,
      paddingVertical: "2%",
      backgroundColor: "#2494f0",
    },
    createWorkoutButton: {
      position: "absolute",
      marginTop: windowHeight.current - 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 40,
      backgroundColor: "#2494f0",
      width: 170,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: windowWidth.current / 2 - 85,
    },
    createWorkoutText: {
      fontFamily: "RobotoCondensedLight",
      color: "white",
      fontSize: 20,
    },
    bottomBanner: {
      position: "absolute",
      bottom: 0,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />

      <ScrollView
        stickyHeaderIndices={[0, 2]}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.screenHeader}>
          <Text style={styles.screenHeaderText}>REPR</Text>
        </View>

        <View style={styles.subHeaderContainer}>
          <Text style={styles.subHeaderText}>My Workouts</Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("WorkoutScreen", {
              id: null,
              name: "",
              isTemplate: false,
            })
          }
        >
          <View style={styles.newCreateWorkoutContainer}>
            {/* <Feather name="plus" color="white" size={30} /> */}
            <Text style={styles.createWorkoutText}>CREATE WORKOUT</Text>
          </View>
        </TouchableOpacity>
        {/* {console.log(workoutList[0])} */}
        {workoutList.map((workout, i) => {
          return (
            <WorkoutComponent
              key={workout.ID}
              navigation={navigation}
              id={workout.ID}
              name={workout.Name}
              lastPerformed={workout.LastPerformed}
              workoutInfo={JSON.parse(workout.WorkoutInfo)}
              setForceUpdate={setForceUpdate}
            />
          );
        })}

        <View style={styles.subHeaderContainer}>
          <Text style={styles.subHeaderText}>Templates</Text>
        </View>

        {templateWorkouts.current.map((workout, i) => (
          <TemplateComponent
            key={i}
            name={workout.workoutName}
            workoutInfo={workout.workoutInfo}
            navigation={navigation}
          />
        ))}
      </ScrollView>

      <AdMobBanner
        style={styles.bottomBanner}
        bannerSize="smartBannerPortrait"
        adUnitID="ca-app-pub-3940256099942544/6300978111" //"ca-app-pub-8357822625939612/6897489102" // Test ID, Replace with your-admob-unit-id
        servePersonalizedAds={true} // true or false
        // testID={"device"}
        onDidFailToReceiveAdWithError={(e) =>
          console.log("AD RECIEVED W/ ERROR", e)
        }
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
