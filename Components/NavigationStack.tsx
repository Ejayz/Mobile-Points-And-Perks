import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../app/login";
import SuperAdminDashboard from "../app/(admin)/AdminDashboard";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useRoute } from "@react-navigation/native";
import SuperAdminDrawer from "./SuperAdminDrawer";
import { StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native";
import { Header } from "@rneui/base";
import AdminDashboard from "../app/(admin)/AdminDashboard";
import AdminCustomerAccount from "../app/(admin)/AdminCustomerAccount";
const Navigation = createNativeStackNavigator();

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
        options={{
          title: "AdminDashboard",
          headerShown: true,
          header(props) {
            return (
              <Header
                backgroundImageStyle={{}}
                barStyle="default"
                centerComponent={{
                  text: "Points And Perks",
                  style: { color: "#fff",fontSize: 20},
                }}
                centerContainerStyle={{}}
                containerStyle={{ width: "100%" }}
                leftContainerStyle={{}}
                linearGradientProps={{}}
                placement="center"
                rightContainerStyle={{}}
                statusBarProps={{}}
              />
            );
          },
        }}
      />
       <Navigation.Screen
        name="AdminCustomerAccount"
        component={AdminCustomerAccount}
        options={{
          title: "AdminCustomerAccount",
          headerShown: true,
          header(props) {
            return (
              <Header
                backgroundImageStyle={{}}
                barStyle="default"
                centerComponent={{
                  text: "Points And Perks",
                  style: { color: "#fff",fontSize: 20},
                }}
                centerContainerStyle={{}}
                containerStyle={{ width: "100%" }}
                leftContainerStyle={{}}
                linearGradientProps={{}}
                placement="center"
                rightContainerStyle={{}}
                statusBarProps={{}}
              />
            );
          },
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
