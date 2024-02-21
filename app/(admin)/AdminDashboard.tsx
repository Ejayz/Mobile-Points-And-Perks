import { Button } from "@rneui/base";
import React from "react";
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
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";

export default function SuperAdminDashboard({ navigation }: any) {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");

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
          <Camera
            style={{ width: "100%", height: "100%" }}
            device={device}
            isActive={true}
          />
        ) : (
          <Text>Camera not available</Text>
        )}
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
            console.log("Button pressed");
          }}
        />

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
