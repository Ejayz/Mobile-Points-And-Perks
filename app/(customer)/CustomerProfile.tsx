import * as React from "react";
import {
  Avatar,
  Badge,
  Card,
  Dialog,
  Icon,
  Input,
  ListItem,
  Tooltip,
} from "@rneui/base";
import { View, Text, TouchableHighlight, StatusBar } from "react-native";
import { SpeedDial } from "@rneui/themed";
import { DateTime } from "luxon";
import { Form, Formik, FormikHelpers, FormikProps, FormikValues } from "formik";
import * as Yup from "yup";
import Toast from "react-native-toast-message";

export default function AdminCustomerAccount({ route, navigation }: any) {
  const [data, setData] = React.useState<any>();

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

  React.useEffect(() => {
    function init() {
      fetchData();
    }
    init();
  }, []);

  return (
    <>
      <StatusBar
        barStyle={"dark-content"}
        translucent
        backgroundColor={"transparent"}
        hidden={true}
      />
      <Card containerStyle={{}} wrapperStyle={{}}>
        <Card.Divider />
        <View
          style={{
            position: "relative",
            alignItems: "center",
          }}
        >
          <Avatar
            size={96}
            rounded
            title={`${
              data == undefined
                ? "L"
                : `${data.data[0].first_name.charAt(
                    0
                  )}${data.data[0].last_name.charAt(0)}`
            }`}
            containerStyle={{ backgroundColor: "purple" }}
            source={{ uri: "https://" }}
          />

          <Card.Title
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 2,
              marginBottom: 10,
            }}
          >
            {" "}
            {data == undefined
              ? "Loading"
              : `${data.data[0].first_name} ${data.data[0].middle_name} ${data.data[0].last_name}`}
          </Card.Title>

          <View
            style={{
              width: "100%",
              flex: 0,
              marginTop: 1,
              marginBottom: 1,
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                marginLeft: 0,
                fontSize: 15,
                fontWeight: "bold",
              }}
            >
              Phone Number:{" "}
            </Text>
            <Text>
              {data == undefined ? "Loading" : `${data.data[0].phone_number}`}
            </Text>
          </View>
          <View
            style={{
              marginTop: 1,
              marginBottom: 1,
              width: "100%",
              flex: 0,
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                marginLeft: 0,
                fontSize: 15,
                fontWeight: "bold",
              }}
            >
              Email:{" "}
            </Text>
            <Text>
              {data == undefined ? "Loading" : `${data.data[0].email}`}
            </Text>
          </View>
          <View
            style={{
              marginTop: 1,
              marginBottom: 1,
              width: "100%",
              flex: 0,
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                marginLeft: 0,
                left: 0,
                fontSize: 15,
                fontWeight: "bold",
              }}
            >
              Address:{" "}
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: "left",
              }}
            >
              {data == undefined ? "Loading..." : data.data[0].address_1}{" "}
              {data == undefined ? "Loading..." : data.data[0].address_2}{" "}
              {data == undefined ? "Loading..." : data.data[0].city}{" "}
              {data == undefined ? "Loading..." : data.data[0].state_province}{" "}
              {data == undefined ? "Loading..." : data.data[0].zip_code}{" "}
              {data == undefined ? "Loading..." : data.data[0].country}
            </Text>
          </View>

          <Card
            containerStyle={{
              width: "100%",
            }}
            wrapperStyle={{}}
          >
            <View
              style={{
                width: "100%",
                flex: 0,
                marginTop: 1,
                marginBottom: 1,
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  marginLeft: 0,
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                Status:{" "}
              </Text>
              <Text>
                <Badge
                  badgeStyle={{
                    borderRadius: 25,
                    marginTop: "auto",
                    marginBottom: "auto",
                  }}
                  containerStyle={{}}
                  onPress={() => {
                    alert("onPress");
                  }}
                  status="success"
                  textProps={{}}
                  textStyle={{ color: "white" }}
                  value="Active"
                />
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                flex: 0,
                marginTop: 1,
                marginBottom: 1,
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  marginLeft: 0,
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                Member Since:{" "}
              </Text>

              <Text>
                {data == undefined
                  ? "Loading..."
                  : DateTime.fromISO(data.data[0].created_at).toLocaleString(
                      DateTime.DATE_MED
                    )}
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                flex: 0,
                marginTop: 1,
                marginBottom: 1,
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  marginLeft: 0,
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                Package:{" "}
              </Text>

              <Text>
                {data == undefined ? "Loading..." : data.data[0].name}
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                flex: 0,
                marginTop: 1,
                marginBottom: 1,
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  marginLeft: 0,
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                Points:{" "}
              </Text>

              <Text>
                {data == undefined ? "Loading..." : data.data[0].points}{" "}
                Fronteirs
              </Text>
            </View>
          </Card>
        </View>
      </Card>
    </>
  );
}
