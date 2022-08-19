import React, { useRef } from "react";

import { Dimensions } from "react-native";

import {
  NavigationContainer,
  cardStyleInterpolator,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

import HomeScreen from "../screens/HomeScreen";
import WorkoutScreen from "../screens/WorkoutScreen";
import PrevScreen from "../screens/PrevScreen";

const Stack = createNativeStackNavigator();

const RootStack = () => {
  const windowHeight = useRef(Dimensions.get("window").height);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          // This style hides the navigation bar at the top of the screen
          headerShown: false,
        }}
      >
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="WorkoutScreen" component={WorkoutScreen} />
        <Stack.Screen name="PrevScreen" component={PrevScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
