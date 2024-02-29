import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../app/login";
import SuperAdminDashboard from "../app/(admin)/AdminDashboard";
import { Button, Header } from "@rneui/themed";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useRoute } from "@react-navigation/native";
import CustomerCampaign from "../app/(customer)/CustomerCampaign";
const Drawer = createDrawerNavigator();
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomerRedeem from "../app/(customer)/CustomerRedeem";
const CustomerNavigator = () => {
  return (
    <Drawer.Navigator>
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
    </Drawer.Navigator>
  );
};

export default CustomerNavigator;
