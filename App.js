import React from "react";
import { SafeAreaView, Text, StyleSheet, StatusBar } from "react-native";
import { View } from "react-native-web";

import RootStack from "./navigators/RootStack";

export default function App() {
  return <RootStack />;
}
