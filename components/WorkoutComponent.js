import React, { useRef, useState } from "react";

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Vibration,
  Dimensions,
} from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";

// import Animated, { useSharedValue } from "react-native-reanimated";
import * as SQLite from "expo-sqlite";

import { Feather } from "@expo/vector-icons";

const db = SQLite.openDatabase("GymTracker");

const WorkoutComponent = ({
  navigation,
  id,
  name,
  lastPerformed,
  workoutInfo,
  setForceUpdate,
}) => {
  const windowWidth = useRef(Dimensions.get("window").width);
  // const translation = useRef(new Animated.Value(0)).current;
  const translation = useSharedValue(0);
  const [isTranslated, setIsTranslated] = useState(false);

  const VIBRATE_TIME = 30;

  const handleLongPress = () => {
    Vibration.vibrate(VIBRATE_TIME);
    const toValue = isTranslated ? 0 : -60;
    setIsTranslated(!isTranslated);
    translation.value = withTiming(toValue, {
      duration: 300,
    });
  };

  const animStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translation.value }],
      easing: Easing.bezier(0.1, 1, 1, 0.1),
    };
  });

  const handleDeleteWorkout = async () => {
    try {
      await db.transaction(
        async (tx) =>
          await tx.executeSql(
            "DELETE FROM Workouts WHERE ID = ?",
            [id],
            () => {},
            (tx, error) => console.log("ERROR DELETING WORKOUT")
          )
      );
    } catch (error) {
      console.log(error);
    }

    setForceUpdate((prevNum) => prevNum + 1);

    try {
      await db.transaction(
        async (tx) =>
          await tx.executeSql(
            "DELETE FROM Prevs WHERE ID = ?",
            [id],
            () => {},
            (tx, error) => console.log("ERROR DELETING Prevs Data")
          )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      width: "90%",
      marginVertical: "2%",
      marginHorizontal: "5%",
    },
    topContainer: {
      flex: 1,
      backgroundColor: "white",
      borderWidth: 1,
      borderColor: "#c9c9c9",
      borderRadius: 10,
      padding: "4%",
    },
    topButton: {
      flex: 1,
      flexDirection: "row",
    },
    left: {
      flex: 4,
      paddingLeft: 10,
      justifyContent: "space-evenly",
    },
    right: {
      flex: 5,
      paddingRight: 10,
    },
    title: {
      fontSize: 16,
      fontFamily: "RobotoCondensedLight",
    },
    date: {
      color: "#9c9c9c",
      fontSize: 11,
      alignItems: "flex-end",
      fontFamily: "RobotoCondensedLight",
    },
    preview: {
      color: "#9c9c9c",
      fontSize: 11,
      textAlign: "right",
      fontFamily: "RobotoCondensedLight",
    },
    dots: {
      color: "#9c9c9c",
      fontSize: 13,
      textAlign: "right",
      fontFamily: "RobotoCondensedRegular",
    },
    trashContainer: {
      flex: 1,
      position: "absolute",
      zIndex: -10,
      width: "100%",
      height: "100%",
      borderWidth: 1,
      borderColor: "red",
      borderRadius: 12,
    },
    trashButton: {
      flex: 1,
      alignItems: "flex-end",
      justifyContent: "center",
      paddingRight: "6%",
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.topContainer, animStyle]}>
        <TouchableOpacity
          style={styles.topButton}
          onPress={() => {
            // loadWorkoutData(name);
            navigation.navigate("WorkoutScreen", {
              id: id,
              isTemplate: false,
            });
          }}
          onLongPress={handleLongPress}
          delayLongPress={400}
        >
          <View style={styles.left}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.date}>LAST PERFORMED: {lastPerformed}</Text>
          </View>
          <View style={styles.right}>
            {workoutInfo.map((exer, i) =>
              i < 4 ? (
                <Text key={i} style={styles.preview}>
                  {exer.exercise}
                </Text>
              ) : i < 5 ? (
                <Text key={i} style={styles.dots}>
                  ...
                </Text>
              ) : null
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.trashContainer}>
        <TouchableOpacity
          style={styles.trashButton}
          onPress={handleDeleteWorkout}
        >
          <View>
            <Feather name="trash" color="red" size={25} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WorkoutComponent;
