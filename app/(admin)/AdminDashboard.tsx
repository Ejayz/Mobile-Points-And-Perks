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
  Alert,
  BackHandler,
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
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SuperAdminDashboard({ navigation }: any) {
  const [showCamera, setShowCamera] = useState(false);
  const [hasPermission, setCameraPermission] =
    useState<CameraPermissionStatus>("not-determined");
  const device = useCameraDevice("back");
  const [isActive, setIsActive] = useState(true);
  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: (codes) => {
      try {
        if (typeof codes[0].value != "string") {
          return false;
        }
        if (!codes[0].value.includes('"user_id":')) {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Invalid QR Code",
            text2: "Scanned QR Code is not compatibe. Please try again!",
          });
          return false;
        }
        if (codes[0].value == undefined) {
          return false;
        }

        if (codes[0].value == null) {
          return false;
        }
        if (codes[0].value == "") {
          return false;
        }
        console.log(codes[0].value);
        const qr_data = JSON.parse(codes[0].value);
        navigation.reset({
          index: 1,
          routes: [
            {
              name: "AdminCustomerAccount",
              params: {
                user_id: qr_data.user_id,
              },
            },
          ],
        });
      } catch (e) {
        console.log(e);
        Toast.show({
          type: "error",
          position: "top",
          text1: "Error Occured",
          text2: "Something went wrong. Please try again!",
        });
      }
    },
  });

  const isFocused = useIsFocused();
  const appState = useAppState();
  useEffect(() => {
    if (isFocused && appState === "active") {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [isFocused && appState === "active"]);
  const requestPermissions = async () => {
    console.log("Requesting camera permission");
    const permission = await Camera.requestCameraPermission();
    console.log("Permission given: ", permission);
    if (permission === "denied") {
      Toast.show({
        type: "error",
        text1: "Permission Required",
        text2:
          "To use camera please give the application permission to use camera.",
      });
      navigation.navigate("login");
    } else {
      const is_first_time = await AsyncStorage.getItem("alreadySetup");
      if (is_first_time == null) {
        setCameraPermission(permission);
        setShowCamera(true);
        Alert.alert(
          "First Time Setup",
          "For camera to work properly, please restart the application.",
          [
            {
              text: "Ok",
              onPress: () => {
                AsyncStorage.setItem("alreadySetup", "true");
                BackHandler.exitApp();
              },
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
      }
    }
  };
  useEffect(() => {
    requestPermissions();
  }, []);

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
      <View
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      >
        {hasPermission && device ? (
          <Camera
            style={{
              width: "100%",
              height: "100%",
              left: 0,
              right: 0,
              overflow: "hidden",
            }}
            device={device}
            isActive={isActive}
            codeScanner={codeScanner}
            resizeMode="cover"
          />
        ) : (
          <View>
            <Text>Camera not available</Text>
          </View>
        )}
      </View>
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
