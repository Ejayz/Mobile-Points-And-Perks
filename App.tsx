import MainStack from "./Components/NavigationStack";
import Toast from "react-native-toast-message";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";

export default function App() {
  return (
    <NavigationContainer>
      <MainStack />
      <Toast />
    </NavigationContainer>
  );
}
