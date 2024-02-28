import { useAppState } from "@react-native-community/hooks";
import { Button } from "@rneui/base";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import Toast from "react-native-toast-message";
import {
  Camera,
  CameraPermissionStatus,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import { useIsFocused } from "@react-navigation/native";
export default function CustomerCampaign({ navigation }: any) {
  return (
    <ImageBackground
      source={require("../../assets/images/car-bg.png")}
      style={{ width: "100%", height: "100%" }}
    >
      <StatusBar
        barStyle={"dark-content"}
        translucent
        backgroundColor={"transparent"}
        hidden={true}
      />
    </ImageBackground>
  );
}
const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
};
