import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../app/login";
import SuperAdminDashboard from "../app/(admin)/AdminDashboard";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useRoute } from "@react-navigation/native";
import SuperAdminDrawer from "./CustomerNavigator";
import { StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native";
import { Button, Header } from "@rneui/base";
import AdminDashboard from "../app/(admin)/AdminDashboard";
import AdminCustomerAccount from "../app/(admin)/AdminCustomerAccount";
const Navigation = createNativeStackNavigator();
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomerNavigator from "./CustomerNavigator";

const MainStack = () => {
  return (
    <Navigation.Navigator>
      <Navigation.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false, // Hide the header for the login screen
        }}
      />

      <Navigation.Screen
        name="AdminDashboard"
        component={AdminDashboard}
        options={({ navigation, route }) => ({
          title: "AdminDashboard",
          headerShown: true,
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "yellow",
          },
          headerTitle: "Points and Perks",
          headerLeft: () => (
            <Button
              type="clear"
              buttonStyle={{ width: "auto" }}
              containerStyle={{ margin: 5 }}
              disabledStyle={{
                borderWidth: 2,
                borderColor: "#00F",
              }}
              disabledTitleStyle={{ color: "#00F" }}
              icon={
                <MaterialCommunityIcons
                  name="arrow-left-bold-box-outline"
                  size={40}
                  color="black"
                />
              }
              iconContainerStyle={{ backgroundColor: "#000" }}
              loadingProps={{ animating: true }}
              loadingStyle={{}}
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Login" }],
                });
              }}
              titleProps={{}}
              titleStyle={{ marginHorizontal: 5 }}
            />
          ),
        })}
      />
      <Navigation.Screen
        name="AdminCustomerAccount"
        component={AdminCustomerAccount}
        options={({ navigation, route }) => ({
          title: "AdminCustomerAccount",
          headerShown: true,
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "yellow",
          },
          headerLeft: () => (
            <Button
              type="clear"
              buttonStyle={{ width: "auto" }}
              containerStyle={{ margin: 5 }}
              disabledStyle={{
                borderWidth: 2,
                borderColor: "#00F",
              }}
              disabledTitleStyle={{ color: "#00F" }}
              icon={
                <MaterialCommunityIcons
                  name="arrow-left-bold-box-outline"
                  size={40}
                  color="black"
                />
              }
              iconContainerStyle={{ backgroundColor: "#000" }}
              loadingProps={{ animating: true }}
              loadingStyle={{}}
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "AdminDashboard" }],
                });
              }}
            />
          ),
        })}
      />
      <Navigation.Screen
        name="CustomerDrawerNavigator"
        component={CustomerNavigator}
        options={({ navigation, route }) => ({
          title: "AdminCustomerAccount",
          headerShown: false,
          headerTitleAlign: "center",
        })}
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
