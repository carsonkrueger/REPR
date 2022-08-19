import { useEffect, useRef } from "react";
import React, {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";

import * as SQLite from "expo-sqlite";

const BackComponent = ({
  saveNewData,
  updateData,
  savePrevData,
  workoutName,
  id,
  navigation,
  isTemplate,
}) => {
  const isWorkoutUnique = () => {
    // console.log(templateNames);
    if (workoutName == null || workoutName.trim() === "") {
      Alert.alert(null, "Please change your workout name");
      return false; // not unique
    }
    return true;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "flex-end",
      justifyContent: "center",
    },
    text: {
      color: "white", //"#2494f0",
      fontSize: 18,
      fontFamily: "RobotoCondensedRegular",
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={async () => {
          if (isWorkoutUnique()) {
            id == null || isTemplate ? saveNewData() : updateData();
            await savePrevData();
          }
        }}
      >
        <Text style={styles.text}>FINISH</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BackComponent;
