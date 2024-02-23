import { useAppState } from "@react-native-community/hooks";
import { Button } from "@rneui/base";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";
import {
  Camera,
  CameraPermissionStatus,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import { useIsFocused } from '@react-navigation/native';

export default function SuperAdminDashboard({ navigation }: any) {
  const [showCamera, setShowCamera] = useState(true);
  const [hasPermission, setCameraPermission] =
    useState<CameraPermissionStatus>("not-determined");
  const device = useCameraDevice("back");
  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: (codes) => {
      console.log("Scanned code: ", codes);
    },
  });
  const isFocused = useIsFocused()
  const appState = useAppState()
  const isActive = isFocused && appState === "active"
  return (
    <ImageBackground
      source={require("../../assets/images/car-bg.png")}
      style={{ width: "100%", height: "100%" }}
    >
      <View
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        {hasPermission && device ? (
          <>
            <Camera
              style={{ width: "100%", height: "100%" }}
              device={device}
              isActive={showCamera}
              codeScanner={codeScanner}
            />
          </>
        ) : (
          <Text>Camera not available</Text>
        )}
        {showCamera ? (
          <Button
            buttonStyle={{
              width: 98,
              height: 99,
              padding: 0,
              margin: 0,
              backgroundColor: "transparent",
            }}
            containerStyle={{
              position: "absolute",
              bottom: 0,
              zIndex: 1,
              left: 0,
              right: 0,
              alignItems: "center",
            }}
            disabledStyle={{
              borderWidth: 2,
              borderColor: "#00F",
            }}
            disabledTitleStyle={{ color: "#00F" }}
            icon={
              <Image
                style={{
                  width: 98,
                  height: 99,
                }}
                source={require("../../assets/ui/qr_code_btn.png")}
                width={98}
                height={99}
              ></Image>
            }
            loadingProps={{ animating: true }}
            loadingStyle={{}}
            onPress={() => {
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
                }
                setCameraPermission(permission);
                setShowCamera(true);
              };
              requestPermissions();
            }}
          />
        ) : (
          <Button
            buttonStyle={{
              width: 98,
              height: 99,
              padding: 0,
              margin: 0,
              backgroundColor: "transparent",
            }}
            containerStyle={{
              position: "absolute",
              bottom: 0,
              zIndex: 1,
              left: 0,
              right: 0,
              alignItems: "center",
            }}
            disabledStyle={{
              borderWidth: 2,
              borderColor: "#00F",
            }}
            disabledTitleStyle={{ color: "#00F" }}
            icon={
              <Image
                style={{
                  width: 98,
                  height: 99,
                }}
                source={require("../../assets/ui/qr_code_btn_stop.png")}
                width={98}
                height={99}
              ></Image>
            }
            loadingProps={{ animating: true }}
            loadingStyle={{}}
            onPress={() => {
              setShowCamera(false);
            }}
          />
        )}

        <Image
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 59,
          }}
          source={require("../../assets/ui/reactable_bar_yellow.png")}
          width={360}
          height={59}
        ></Image>
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
