import React from "react";

import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

const TemplateComponent = ({ navigation, name, workoutInfo }) => {
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
      flex: 1,
      paddingLeft: 10,
      justifyContent: "center",
    },
    right: {
      flex: 2,
      paddingRight: 10,
    },
    title: {
      fontSize: 15,
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
  });

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.topButton}
          onPress={() => {
            // loadWorkoutData(name);
            navigation.navigate("WorkoutScreen", {
              id: null,
              name: name,
              isTemplate: true,
            });
          }}
          delayLongPress={500}
        >
          <View style={styles.left}>
            <Text style={styles.title}>{name}</Text>
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
      </View>
    </View>
  );
};

export default TemplateComponent;
