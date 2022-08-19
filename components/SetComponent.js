import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  TextInput,
  Vibration,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const SetComponent = ({
  weights,
  reps,
  numSet,
  numExercise,
  prevWeight,
  setWeights,
  prevRep,
  setReps,
}) => {
  const TWENTYTH_SECOND_MS = 50;
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (isDone) {
      if (weights[numSet] == "" && prevWeight !== "")
        setWeights(prevWeight, numExercise, numSet);

      if (reps[numSet] == "" && prevRep !== "")
        setReps(prevRep, numExercise, numSet);
    }
  }, [isDone]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      paddingTop: 1,
      paddingBottom: 1,
      marginTop: 5,
      marginHorizontal: 5,
      borderRadius: 7,
      backgroundColor: isDone ? "#9effb6" : null,
    },
    setContainer: {
      flex: 0.6,
      alignItems: "center",
      justifyContent: "center",
    },
    setText: {
      fontFamily: "RobotoCondensedRegular",
      color: /*isDone[numSet] ? null :*/ "#2494f0",
      fontSize: 17,
    },
    prevContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    prevText: {
      fontFamily: "RobotoCondensedRegular",
      color: /*isDone[numSet] ? null :*/ "#2494f0",
      fontSize: 14,
    },
    weightContainer: {
      flex: 1,
      alignItems: "center",
    },
    weightText: {
      fontFamily: "RobotoCondensedLight",
      fontSize: 16,
      backgroundColor: isDone /*isDoneArr[numExercise][numSet]*/
        ? null
        : "#ededed", //"#7a7a7a",
      borderRadius: 5,
      width: "80%",
      textAlign: "center",
      color: "black",
    },
    repContainer: {
      flex: 1,
      alignItems: "center",
      fontSize: 16,
    },
    repText: {
      fontFamily: "RobotoCondensedLight",
      fontSize: 16,
      backgroundColor: isDone /*isDoneArr[numExercise][numSet]*/
        ? null
        : "#ededed", //"#7a7a7a",
      borderRadius: 5,
      width: "80%",
      textAlign: "center",
      color: "black",
    },
    checkContainer: {
      flex: 0.6,
      alignItems: "center",
      justifyContent: "center",
    },
    checkButton: {
      backgroundColor: isDone ? "#98ebad" : "#2494f0",
      borderRadius: 6,
      paddingHorizontal: "5%",
      paddingVertical: "3%",
    },
  });

  return (
    <View style={styles.container}>
      {/*SET*/}
      <View style={styles.setContainer}>
        <Text style={styles.setText}>{numSet + 1}</Text>
      </View>

      {/*PREV*/}
      <View style={styles.prevContainer}>
        <Text style={styles.prevText}>
          {prevRep !== "" && prevWeight !== ""
            ? prevWeight + " x " + prevRep
            : "---"}
        </Text>
      </View>

      {/*WEIGHT*/}
      <View style={styles.weightContainer}>
        <TextInput
          style={styles.weightText}
          keyboardType="number-pad"
          value={weights[numSet]}
          placeholder={prevWeight}
          editable={!isDone} //isDoneArr[numExercise][numSet]}
          maxLength={4}
          onChangeText={(newText) => {
            setWeights(newText, numExercise, numSet);
          }}
          multiline={true}
          numberOfLines={1}
          // editable={() => isDone ? false : true}
        ></TextInput>
      </View>

      {/*REPS*/}
      <View style={styles.repContainer}>
        <TextInput
          style={styles.repText}
          keyboardType="number-pad" /*editable={() => isDone ? false : true}*/
          value={reps[numSet]}
          placeholder={prevRep}
          editable={!isDone} //isDoneArr[numExercise][numSet]}
          maxLength={4}
          onChangeText={(newText) => {
            setReps(newText, numExercise, numSet);
          }}
          multiline={true}
          numberOfLines={1}
        ></TextInput>
      </View>

      {/*CHECK*/}
      <View style={styles.checkContainer}>
        <TouchableOpacity
          style={styles.checkButton}
          onPress={() => {
            setIsDone(!isDone);
            Vibration.vibrate(TWENTYTH_SECOND_MS);
          }}
        >
          <Feather name="check" size={25} color={"white"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SetComponent;
