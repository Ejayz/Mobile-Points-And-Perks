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
  Alert,
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

interface Reward {
  id: number;
  name: string;
  description: string;
  point_cost: number;
  status: string;
  package_id: number;
  reward_id: number;
  employee_id: number;
  created_at: string;
  updated_at: string | null;
  removed_at: string | null;
  is_exist: number;
  reward_type_id: number;
  quantity: number;
  RedeemID: number;
  RewardName: string;
  RewardDescription: string;
  RedeemName: string;
  RedeemDescription: string;
}

interface RewardResponse {
  code: number;
  data: Reward[];
}

export default function CustomerRedeem({ navigation }: any) {
  const [data, setData] = useState<RewardResponse>();
  const [page, setPage] = useState(0);
  const [isRequestion, setIsRequesting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [noNetwork, setNoNetwork] = useState(false);
  const [transactionNumber, setTransactionNumber] = useState("");
  const [points, setPoints] = useState();
  const [confirmDialog, setConfirmDialog] = useState({
    dialogState: false,
    redeem: 0,
  });

  const [showTransactionInstruction, setShowTransactionInstruction] =
    useState(false);
  const fetchCustomerPoints = async () => {
    const headersList = {
      Accept: "*/*",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    };

    let response = await fetch(
      `https://pointsandperks.ca/api/private/getUserPoints`,
      {
        method: "GET",
        headers: headersList,
      }
    );

    let data = await response.json();
    setPoints(data.data);
  };

  const fetchData = async () => {
    try {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };
      const response = await fetch(
        `https://pointsandperks.ca/api/private/getRedeemList/?page=${page}`,
        {
          method: "GET",
          headers: headersList,
        }
      );
      if (response.status == 502) {
        throw new Error("Cannot Connect to Server . Please try again.");
      } else {
        let data = await response.json();
        console.log(data);
        setData(data);
      }
    } catch (error: any) {
      setNoNetwork(true);
      setIsRequesting(false);
    }
  };

  useEffect(() => {
    function init() {
      fetchCustomerPoints();
      fetchData();
    }
    init();
  }, [page]);

  const createRedeemTransaction = async (id: number) => {
    console.log(id);
    setConfirmDialog({ dialogState: false, redeem: 0 });
    let headersList = {
      Accept: "*/*",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      "Content-Type": "application/json",
    };
    let response = await fetch(
      `https://pointsandperks.ca/api/private/createRedeemTransaction`,
      {
        method: "POST",
        headers: headersList,
        body: JSON.stringify({ redeem_id: id }),
      }
    );
    if (response.status == 502) {
      setIsRequesting(false);
      Toast.show({
        type: "error",
        text1: "Connection Error",
        text2:
          "Cannot connect to server . Please contact server administrator.",
      });
    } else {
      let data = await response.json();
      console.log(data);
      if (data.code == 200) {
        setShowDialog(!showDialog);
        setTransactionNumber(data.data);
        setShowTransactionInstruction(true);
        Toast.show({
          type: "success",
          text1: "Transaction Created",
          text2: "Transaction has been created successfully.",
        });
      } else {
        console.log(data.code);
        setIsRequesting(false);
        if (data.code == 400) {
          Toast.show({
            type: "error",
            text1: "Transaction Error",
            text2: "You have already completed this transaction.",
          });
        } else if (data.code == 401) {
          Toast.show({
            type: "error",
            text1: "Transaction Error",
            text2: data.message,
          });
        }
      }
    }
  };
  const calculateCompletionPercentage = (
    currentPoints: number,
    requiredPoints: number
  ) => {
    const percentage = (currentPoints / requiredPoints) * 100;
    const calculated = percentage / 100;
    return calculated;
  };
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
        <Dialog
          overlayStyle={{
            backgroundColor: "white",
          }}
          isVisible={confirmDialog.dialogState}
        >
          <Dialog.Title title="Confirm Action" />
          <Text>Are you sure you want to redeem this reward?</Text>
          <Dialog.Actions>
            <Dialog.Button
              title="CONFIRM"
              onPress={() => {
                setIsRequesting(true);
                createRedeemTransaction(confirmDialog.redeem);
              }}
            />
            <Dialog.Button
              title="CANCEL"
              onPress={() => {
                setConfirmDialog({ dialogState: false, redeem: 0 });
              }}
            />
          </Dialog.Actions>
        </Dialog>

        <Dialog
          overlayStyle={{
            backgroundColor: "white",
          }}
          isVisible={showTransactionInstruction}
        >
          <Dialog.Title title="Transaction ID" />
          <Text>
            Take a screenshot of this transaction ID, go to our nearest branch,
            and follow the necessary steps to claim your rewards. Finally,
            present it to our staff.
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            {transactionNumber == "Please wait..."
              ? "Transaction ID"
              : transactionNumber}
          </Text>
          <Dialog.Actions>
            <Dialog.Button
              title="DONE"
              onPress={() => {
                fetchCustomerPoints();
                fetchData();
                setData(undefined);
                setPoints(undefined);
                setIsRequesting(false);
                setTransactionNumber("");
                setShowTransactionInstruction(!showTransactionInstruction);
              }}
            />
          </Dialog.Actions>
        </Dialog>
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
          {data == null || points == undefined ? (
            <ScrollView
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <Skeleton
                animation="pulse"
                style={{
                  width: "90%",
                  marginTop: 10,
                  marginBottom: 10,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                width={80}
                height={40}
              />
              <Skeleton
                animation="pulse"
                style={{
                  width: "90%",
                  marginTop: 10,
                  marginBottom: 10,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                width={80}
                height={40}
              />
              <Skeleton
                animation="pulse"
                style={{
                  width: "90%",
                  marginTop: 10,
                  marginBottom: 10,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                width={80}
                height={40}
              />
              <Skeleton
                animation="pulse"
                style={{
                  width: "90%",
                  marginTop: 10,
                  marginBottom: 10,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                width={80}
                height={40}
              />
              <Skeleton
                animation="pulse"
                style={{
                  width: "90%",
                  marginTop: 10,
                  marginBottom: 10,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                width={80}
                height={40}
              />
              <Skeleton
                animation="pulse"
                style={{
                  width: "90%",
                  marginTop: 10,
                  marginBottom: 10,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                width={80}
                height={40}
              />
              <Skeleton
                animation="pulse"
                style={{
                  width: "90%",
                  marginTop: 10,
                  marginBottom: 10,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                width={80}
                height={40}
              />
              <Skeleton
                animation="pulse"
                style={{
                  width: "90%",
                  marginTop: 10,
                  marginBottom: 10,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                width={80}
                height={40}
              />
            </ScrollView>
          ) : data.data.length == 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                No redeems availabe.
              </Text>
            </View>
          ) : (
            <ScrollView>
              {data.data.map((redeem, index) => {
                const percentage = calculateCompletionPercentage(
                  points,
                  redeem.point_cost
                );

                return (
                  <Card key={index} containerStyle={{ borderRadius: 10 }}>
                    <Card.Title>{redeem.RedeemName}</Card.Title>
                    <Badge
                      status={
                        redeem.status == "available" ? "success" : "error"
                      }
                      containerStyle={{
                        position: "absolute",
                        top: 5,
                        right: 40,
                      }}
                      value={redeem.status.toUpperCase()}
                    />
                    <Card.Divider />
                    <View style={{ alignItems: "center" }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "bold",
                        }}
                      >
                        {redeem.point_cost} Frontier Points
                      </Text>
                      <Text style={{}}>Reward: {redeem.RewardName}</Text>
                      <Text style={{}}>
                        Description: {redeem.RedeemDescription}
                      </Text>
                      <Text style={{}}>
                        {points} of {redeem.point_cost} Frontier Points
                      </Text>

                      <LinearProgress
                        variant="determinate"
                        style={{ width: "50%" }}
                        color="secondary"
                        value={percentage}
                      />
                    </View>
                    <Button
                      title={"Redeem"}
                      buttonStyle={{ borderRadius: 10, marginTop: 20 }}
                      onPress={() => {
                        Alert.alert(
                          "Redeem",
                          "Are you sure you want to redeem this reward?",
                          [
                            {
                              text: "CANCEL",
                              onPress: () => {},
                              style: "cancel",
                            },
                            {
                              text: "CONFIRM",
                              onPress: () => {
                                createRedeemTransaction(redeem.RedeemID);
                              },
                            },
                          ]
                        );
                      }}
                      disabled={
                        points < redeem.point_cost ||
                        isRequestion ||
                        redeem.status == "out of stock"
                          ? true
                          : false
                      }
                    />
                  </Card>
                );
              })}
              <View
                style={{
                  marginTop: 10,
                  width: "100%",
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <Button
                  title="Back"
                  style={{
                    marginBottom: 10,
                  }}
                  disabled={
                    data == undefined || data.data.length < 10 ? true : false
                  }
                  onPress={() => {
                    setPage(page - 1);
                  }}
                />
                <Text
                  style={{
                    marginTop: "auto",
                    marginBottom: "auto",
                    marginLeft: 10,
                    marginRight: 10,
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  {page + 1}
                </Text>
                <Button
                  title="Next"
                  style={{
                    marginBottom: 10,
                  }}
                  disabled={
                    data == undefined || data.data.length < 10 ? true : false
                  }
                  onPress={() => {
                    setPage(page + 1);
                  }}
                />
              </View>
            </ScrollView>
          )}
        </ImageBackground>
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
