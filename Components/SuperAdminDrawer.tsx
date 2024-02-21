import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../app/login";
import SuperAdminDashboard from "../app/(admin)/AdminDashboard";
import { Header } from "@rneui/themed";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useRoute } from "@react-navigation/native";
const Drawer = createDrawerNavigator();

const MainStack = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Dashboard"
        component={SuperAdminDashboard}
        options={{
          title: "Dashboard",
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
};

export default MainStack;
