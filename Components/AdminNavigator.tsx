import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../app/login";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useRoute } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native";
import { Header } from "@rneui/base";
import AdminNavigator from "./AdminNavigator";
import AdminDashboard from "../app/(admin)/AdminDashboard";

const Navigation = createNativeStackNavigator();
const MainStack = () => {
  return (
    <Navigation.Navigator>
      <Navigation.Screen
        name="AdminDashboard"
        component={AdminDashboard}
        options={{
          title: "AdminDashboard",
          headerShown: false,
        }}
      />
      <Navigation.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false, // Hide the header for the login screen
        }}
      />
    </Navigation.Navigator>
  );
};
const styles = StyleSheet.create({
  list: {
    width: "100%",
    backgroundColor: "#000",
  },
  item: {
    aspectRatio: 1,
    width: "100%",
    flex: 1,
  },
});
export default MainStack;
