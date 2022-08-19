import React, { useState, useRef, useEffect } from "react";

import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  TextInput,
  Vibration,
} from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  withSpring,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

import { MaterialIcons, SimpleLineIcons, Feather } from "@expo/vector-icons";

import SetComponent from "./SetComponent";
import NotesComponent from "../components/NotesComponent";

import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("GymTracker");

const ExerciseComponent = ({
  navigation,
  WORKOUT_ID,
  addSet,
  deleteSet,
  numExercise,
  workoutInfo,
  setRestTimer,
  delExercise,
  setExercise,
  setNotes,
  prevWeights,
  setWeights,
  prevReps,
  setReps,
  isLocked,
  originalExercise,
}) => {
  const [doTimer, setDoTimer] = useState(false);
  const [doNotes, setDoNotes] = useState(false);

  const countdownTime = useRef(new Date().getTime());
  const originalName = useRef();

  const [sec, setSec] = useState(new Date().getTime());
  const intervalId = useRef();

  const height = useSharedValue(0);

  const flipDoTimer = () => {
    // console.log("FLIP! doTimer:", doTimer);
    setDoTimer(!doTimer);

    if (!doTimer) countdownTime.current = new Date().getTime();
  };

  const flipDoNotes = () => {
    setDoNotes(!doNotes);
  };

  const calcTime = () => {
    const time = Math.trunc(
      workoutInfo.restTimer - (sec - countdownTime.current) / 1000 + 1
    );
    if (time < -999) flipDoTimer();
    return time;
  };

  const updatePrevName = async () => {
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          "UPDATE Prevs SET Name = ? WHERE Name = ? AND ID = ?",
          [workoutInfo.exercise, originalExercise, WORKOUT_ID],
          null,
          (tx, error) => console.log("COULD NOT UPDATE EXERCISE NAME", error)
        );
      });
    } catch (error) {
      console.log("COULD NOT UPDATE EXERCISE NAME", error);
    }
  };

  const handleHeightAnim = () => {
    "worklet";
    const toValue = isLocked ? 0 : 100;
    height.value = withTiming(toValue);
  };

  const heightAnimStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(height.value, [0, 100], [0, 40], Extrapolate.CLAMP),
    };
  });

  const trashWidthAnimStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(height.value, [0, 100], [0, 50], Extrapolate.CLAMP),
    };
  });

  useEffect(() => {
    handleHeightAnim();
  }, [isLocked]);

  useEffect(() => {
    if (doTimer) {
      setSec(new Date().getTime());

      intervalId.current = setInterval(() => {
        setSec(new Date().getTime());
        // if (sec <= -999) flipDoTimer();
      }, 1000);
    } else {
      clearInterval(intervalId.current);
    }

    return () => clearInterval(intervalId.current);
  }, [doTimer]);

  useEffect(() => {
    originalName.current = workoutInfo.exercise;

    return () =>
      workoutInfo.exercise !== originalName.current ? updatePrevName() : null;
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: "2%",
      borderColor: "#bdbdbd",
      borderWidth: 1,
      borderRadius: 15,
      paddingTop: "5%",
      backgroundColor: "white",
      // paddingBottom: isLocked ? "4%" : "0%",
    },
    titleContainer: {
      flex: 1,
      flexDirection: "row",
      paddingBottom: 10,
    },
    titleText: {
      fontFamily: "RobotoCondensedRegular",
      flex: 22,
      fontSize: 16,
      // fontFamily: "Bebas Neue",
      color: "#2494f0",
      paddingLeft: 16,
      textAlign: "left",
    },
    timerContainer: {
      marginVertical: ".7%",
      paddingVertical: ".3%",
      flex: isLocked ? 7 : 9,
      marginRight: isLocked ? "4%" : 0,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      backgroundColor: doTimer ? "#2494f0" : "white",
      borderColor: "#2494f0",
      borderWidth: 1.2,
      borderRadius: 15,
    },
    timerIconContainer: {
      paddingRight: "5%",
    },
    timerTimeContainer: {},
    timerText: {
      fontFamily: "RobotoCondensedRegular",
      color: doTimer ? "white" : isLocked ? "#2494f0" : "black",
      fontSize: 16,
      textAlign: "center",
      backgroundColor: doTimer || isLocked ? null : "#dedede",
      borderRadius: 8,
      paddingHorizontal: 3,
    },
    trashContainer: {
      flex: 5,
      justifyContent: "center",
      paddingLeft: "3%",
    },
    headers: {
      flexDirection: "row",
      color: "white",
      padding: 5,
      width: "100%",
      alignItems: "center",
    },
    setHead: {
      fontFamily: "RobotoCondensedRegular",
      fontSize: 10,
      flex: 0.6,
      alignItems: "center",
    },
    prevHead: {
      fontFamily: "RobotoCondensedRegular",
      flex: 1,
      alignItems: "center",
    },
    prevText: {
      fontFamily: "RobotoCondensedRegular",
      fontSize: 14,
      color: "white",
      backgroundColor: "#2494f0",
      borderRadius: 12,
      paddingVertical: 3,
      paddingHorizontal: 13,
    },
    weightHead: {
      fontFamily: "RobotoCondensedRegular",
      flex: 1,
      alignItems: "center",
    },
    repHead: {
      fontFamily: "RobotoCondensedRegular",
      flex: 1,
      alignItems: "center",
    },
    notesHead: {
      flex: 0.6,
      alignItems: "center",
    },
    notesButton: {
      // backgroundColor: "#2494f0", //"#b56be3",
      justifyContent: "center",
      borderRadius: 3,
      paddingRight: "3%",
    },
    blackText: {
      fontFamily: "RobotoCondensedRegular",
      fontSize: 14,
      color: "black",
    },
    addDelSetContainer: {
      flexDirection: "row",
      paddingVertical: "2%",
      alignItems: "center",
      justifyContent: "space-evenly",
    },
  });

  return (
    <View style={styles.container}>
      <NotesComponent
        doNotes={doNotes}
        flipDoNotes={flipDoNotes}
        notes={workoutInfo.notes}
        setNotes={setNotes}
        numExercise={numExercise}
      />

      <View style={styles.titleContainer}>
        <TextInput
          style={styles.titleText}
          placeholder="EXERCISE NAME"
          placeholderTextColor="#90c6f5"
          value={workoutInfo.exercise}
          multiline={true}
          numberOfLines={2}
          editable={!isLocked}
          autoCapitalize="characters"
          onChangeText={(newText) => {
            setExercise(newText, numExercise);
          }}
          maxLength={35}
          // onEndEditing={updatePrevName}
        />

        <TouchableOpacity style={styles.notesButton} onPress={flipDoNotes}>
          <SimpleLineIcons name="notebook" size={20} color={"#2494f0"} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.timerContainer} onPress={flipDoTimer}>
          <View style={styles.timerIconContainer}>
            <MaterialIcons
              name="timer"
              size={20}
              color={doTimer ? "white" : "#2494f0"}
            />
          </View>

          <View style={styles.timerTimeContainer}>
            <TextInput
              style={styles.timerText}
              placeholder="0s"
              value={doTimer ? calcTime().toString() : workoutInfo.restTimer}
              maxLength={4}
              keyboardType="numeric"
              editable={!doTimer && !isLocked}
              onChangeText={(newNum) => {
                setRestTimer(newNum, numExercise);
              }}
              multiline={true}
              numberOfLines={1}
            />
          </View>
        </TouchableOpacity>

        {!isLocked && (
          <View style={[styles.trashContainer]}>
            <TouchableOpacity
              onPress={() => {
                setDoTimer(false);
                delExercise(numExercise);
              }}
            >
              <Feather name="trash" color="#de3e3e" size={18} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.headers}>
        <View style={styles.setHead}>
          <Text style={styles.blackText}>SET</Text>
        </View>
        {/* PREV HEAD */}
        <TouchableOpacity
          style={styles.prevHead}
          onPress={() =>
            navigation.navigate("PrevScreen", {
              exercise: workoutInfo.exercise,
              WORKOUT_ID: WORKOUT_ID,
              originalExercise: originalExercise,
            })
          }
        >
          <Text style={styles.prevText}>PREV</Text>
        </TouchableOpacity>
        <View style={styles.weightHead}>
          <Text style={styles.blackText}>WEIGHT</Text>
        </View>
        <View style={styles.repHead}>
          <Text style={styles.blackText}>REPS</Text>
        </View>
        <View style={styles.notesHead}></View>
      </View>
      {workoutInfo.weights.map((weight, i) => {
        return (
          <SetComponent
            key={i}
            navigation={navigation}
            weights={workoutInfo.weights}
            reps={workoutInfo.reps}
            numSet={i}
            numExercise={numExercise}
            prevWeight={i < prevWeights.length ? prevWeights[i] : ""}
            setWeights={setWeights}
            prevRep={i < prevReps.length ? prevReps[i] : ""}
            setReps={setReps}
          />
        );
      })}

      <Animated.View style={[styles.addDelSetContainer, heightAnimStyle]}>
        <TouchableOpacity onPress={() => deleteSet(numExercise)}>
          <Feather name="minus" color="#2494f0" size={22} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => addSet(numExercise)}>
          <Feather name="plus" color="#2494f0" size={22} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default ExerciseComponent;
