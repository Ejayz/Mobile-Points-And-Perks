import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../app/login";
import SuperAdminDashboard from "../app/(admin)/AdminDashboard";
import { Button, Header } from "@rneui/themed";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import { useRoute } from "@react-navigation/native";
import CustomerCampaign from "../app/(customer)/CustomerCampaign";
const Drawer = createDrawerNavigator();
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomerRedeem from "../app/(customer)/CustomerRedeem";
import CustomerQRCode from "../app/(customer)/CustomerQRCode";
import CustomerProfile from "../app/(customer)/CustomerProfile";
import Toast from "react-native-toast-message";
const CustomerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => {
        return (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem
              label="Logout"
              onPress={async () => {
                const response = await fetch("https://pointsandperks.ca/api/private/logout", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
                const data = await response.json();
                if (data.code == 200) {
                  Toast.show({
                    type: "success",
                    text1: "Logout",
                    text2: "You have been logged out",
                  });

                  props.navigation.reset({
                    index: 0,
                    routes: [{ name: "Login" }],
                  });
                } else {
                  Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "Could not log out",
                  });
                }
              }}
            />
          </DrawerContentScrollView>
        );
      }}
    >
      <Drawer.Screen
        name="Campaigns"
        component={CustomerCampaign}
        options={({ navigation, route }) => ({
          title: "Campaigns",
          headerShown: true,
          headerTitleAlign: "center",
          headerTitle: "Points and Perks",
          headerStyle: {
            backgroundColor: "yellow",
          },
          headerRight: () => {
            return (
              <Button
                icon={
                  <MaterialCommunityIcons
                    name="restart"
                    size={30}
                    color="black"
                  />
                }
                type="clear"
                onPress={() => {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Campaigns" }],
                  });
                }}
              />
            );
          },
        })}
      />
      <Drawer.Screen
        name="Redeems"
        component={CustomerRedeem}
        options={({ navigation, route }) => ({
          title: "Redeems",
          headerShown: true,
          headerTitleAlign: "center",
          headerTitle: "Points and Perks",
          headerStyle: {
            backgroundColor: "yellow",
          },
          headerRight: () => {
            return (
              <Button
                icon={
                  <MaterialCommunityIcons
                    name="restart"
                    size={30}
                    color="black"
                  />
                }
                type="clear"
                onPress={() => {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Redeems" }],
                  });
                }}
              />
            );
          },
        })}
      />
      <Drawer.Screen
        name="Qr Code"
        component={CustomerQRCode}
        options={({ navigation, route }) => ({
          title: "Qr Code",
          headerShown: true,
          headerTitleAlign: "center",
          headerTitle: "Points and Perks",
          headerStyle: {
            backgroundColor: "yellow",
          },
          headerRight: () => {
            return (
              <Button
                icon={
                  <MaterialCommunityIcons
                    name="restart"
                    size={30}
                    color="black"
                  />
                }
                type="clear"
                onPress={() => {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Qr Code" }],
                  });
                }}
              />
            );
          },
        })}
      />
      <Drawer.Screen
        name="Profile"
        component={CustomerProfile}
        options={({ navigation, route }) => ({
          title: "Profile",
          headerShown: true,
          headerTitleAlign: "center",
          headerTitle: "Points and Perks",
          headerStyle: {
            backgroundColor: "yellow",
          },
          headerRight: () => {
            return (
              <Button
                icon={
                  <MaterialCommunityIcons
                    name="restart"
                    size={30}
                    color="black"
                  />
                }
                type="clear"
                onPress={() => {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Profile" }],
                  });
                }}
              />
            );
          },
        })}
      />
    </Drawer.Navigator>
  );
};

export default CustomerNavigator;
