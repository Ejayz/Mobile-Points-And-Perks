import { useAppState } from "@react-native-community/hooks";
import { Badge, Button, Dialog, Skeleton } from "@rneui/base";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
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
import { Card, LinearProgress, PricingCard } from "@rneui/themed";
import QRCode from "react-native-qrcode-svg";

export default function CustomerQRCode({ navigation }: any) {
  const [data, setData] = useState<any>();
  const [noNetwork, setNoNetwork] = useState(false);

  const [showTransactionInstruction, setShowTransactionInstruction] =
    useState(false);
  const fetchData = async () => {
    let headersList = {
      Accept: "*/*",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      "Content-Type": "application/json",
    };

    let response = await fetch(
      `https://pointsandperks.ca/api/private/getCustomerProfileCardCustomer?user_id=null`,
      {
        method: "GET",
        headers: headersList,
      }
    );
    console.log(response.text);
    if (response.status == 502) {
      Toast.show({
        type: "error",
        text1: "Connection Error",
        text2:
          "Cannot connect to server . Please contact server administrator.",
      });
    } else {
      let data = await response.json();
      setData(data);
      console.log(data);
    }
  };

  useEffect(() => {
    function init() {
      fetchData();
    }
    init();
  }, []);

  if (noNetwork) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StatusBar
          barStyle={"dark-content"}
          translucent
          backgroundColor={"transparent"}
          hidden={true}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Connection Error
        </Text>
        <Text
          style={{
            width: "80%",
            textAlign: "center",
          }}
        >
          Either you do not have internet connection or server is down.
        </Text>
      </View>
    );
  } else {
    return (
      <>
        <StatusBar
          barStyle={"dark-content"}
          translucent
          backgroundColor={"transparent"}
          hidden={true}
        />
        {data == null ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Skeleton width={200} height={200} />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {data == undefined ? null : (
              <>
                <QRCode
                  value={`{"user_id": ${data.data[0].CustomerID}}`}
                  size={200}
                  color={"black"}
                  backgroundColor={"yellow"}
                  quietZone={20}
                />
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                  }}
                >
                  {data.data[0].first_name} {data.data[0].middle_name}{" "}
                  {data.data[0].last_name} {data.data[0].suffix}
                </Text>
                <Badge
                  value={data.data[0].name}
                  textStyle={{
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                  badgeStyle={{
                    width: "auto",
                    height: "auto",
                    borderColor: "black",
                  }}
                />
              </>
            )}
          </View>
        )}
      </>
    );
  }
}
const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
};
