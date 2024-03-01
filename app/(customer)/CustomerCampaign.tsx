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
import { Card, PricingCard } from "@rneui/themed";

type Action = {
  id: number;
  quantity: number;
  status: string;
  action_id: number;
  reward_id: number;
  employee_id: number;
  campaign_id: number;
  created_at: string;
  updated_at: string | null;
  removed_at: string | null;
  is_exist: number;
  name: string;
  description: string;
  reward_type_id: number;
  ActionName: string;
  ActionDescription: string;
  RewardName: string;
  RewardDescription: string;
};

type actionList = {
  actions: Action[];
};

type DialogData = {
  DialogActionList: Action[];
  campaign_id: number;
};

type Campaign = {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  package_id: number;
  employee_id: number;
  created_at: string;
  updated_at: string | null;
  removed_at: string | null;
  is_exist: number;
  actions: Action[];
};

interface CampaignData {
  code: number;
  data: Campaign[];
}

export default function CustomerCampaign({ navigation }: any) {
  const [data, setData] = useState<CampaignData>();
  const [page, setPage] = useState(0);
  const [isRequestion, setIsRequesting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [action, setAction] = useState<DialogData>();
  const [noNetwork, setNoNetwork] = useState(false);
  const [transactionNumber, setTransactionNumber] = useState("");
  const [showTransactionInstruction, setShowTransactionInstruction] =
    useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    dialogState: false,
    campaign_id: 0,
  });
  const fetchData = async () => {
    try {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };

      let response = await fetch(
        `https://pointsandperks.ca/api/private/getCampaignList/?page=${page}`,
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
      fetchData();
    }
    init();
  }, [page]);

  const createCampaignTransaction = async (campaign_id: number) => {
    let headersList = {
      Accept: "*/*",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      "Content-Type": "application/json",
    };
    setConfirmDialog({ dialogState: false, campaign_id: 0 });
    let response = await fetch(
      `https://pointsandperks.ca/api/private/createCampaignTransaction`,
      {
        method: "POST",
        headers: headersList,
        body: JSON.stringify({ campaign_id }),
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

      if (data.code == 200) {
        setShowDialog(!showDialog);
        setTransactionNumber(data.data);
        setShowTransactionInstruction(true);
        setAction(undefined);
        Toast.show({
          type: "success",
          text1: "Transaction Created",
          text2: "Transaction has been created successfully.",
        });
      } else {
        setShowDialog(!showDialog);
        console.log(data.code);
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
          <Text>Are you sure you want to claim this campaign?</Text>
          <Dialog.Actions>
            <Dialog.Button
              title="CONFIRM"
              onPress={() => {
                setIsRequesting(true);
                createCampaignTransaction(confirmDialog.campaign_id);
              }}
            />
            <Dialog.Button
              title="CANCEL"
              onPress={() => {
                setConfirmDialog({ dialogState: false, campaign_id: 0 });
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
                setTransactionNumber("");
                setShowTransactionInstruction(!showTransactionInstruction);
              }}
            />
          </Dialog.Actions>
        </Dialog>
        <Dialog
          isVisible={showDialog}
          onBackdropPress={() => setShowDialog(!showDialog)}
          overlayStyle={{
            backgroundColor: "white",
          }}
          onShow={() => {
            console.log(action);
          }}
        >
          <ScrollView>
            <Dialog.Title title="Campaign Actions and Rewards" />
            <Text>Complete all of actions to get rewards.</Text>
            {action == undefined
              ? null
              : action.DialogActionList.map((act, index) => {
                return (
                  <Card key={index} containerStyle={{}} wrapperStyle={{}}>
                    <Card.FeaturedTitle
                      style={{
                        color: "black",
                        fontSize: 15,
                      }}
                    >
                      Action:{" "}
                      <Text
                        style={{
                          color: "black",
                          fontSize: 13,
                        }}
                      >
                        {act.name}
                      </Text>
                    </Card.FeaturedTitle>
                    <Card.FeaturedSubtitle
                      style={{
                        color: "black",
                        fontSize: 14,
                      }}
                    >
                      Description:{" "}
                      <Text
                        style={{
                          color: "black",
                          fontSize: 13,
                        }}
                      >
                        {act.description}
                      </Text>
                    </Card.FeaturedSubtitle>
                    <Card.Title
                      style={{
                        fontSize: 12,
                        textAlign: "left",
                      }}
                    >
                      Reward:{" "}
                      <Text
                        style={{
                          fontSize: 13,
                        }}
                      >
                        {act.RewardName}
                      </Text>
                    </Card.Title>

                    <View
                      style={{
                        flex: 1,
                        flexDirection: "column",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                        }}
                      >
                        Reward Description
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                        }}
                      >
                        {act.RewardName}
                      </Text>
                    </View>
                  </Card>
                );
              })}

            <Dialog.Actions>
              <Dialog.Button
                title="CREATE TRANSACTION"
                disabled={action == undefined ? true : false}
                onPress={() =>
                  setConfirmDialog({
                    dialogState: true,
                    campaign_id: action == undefined ? 0 : action.campaign_id,
                  })
                }
              />
              <Dialog.Button
                title="CANCEL"
                onPress={() => setShowDialog(!showDialog)}
              />
            </Dialog.Actions>
          </ScrollView>
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
          {data == null ? (
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
                No Campaigns
              </Text>
            </View>
          ) : (
            <ScrollView
            >
              {data.data.map((campaign, index) => {
                return (
                  <Card
                    key={index}
                    containerStyle={{
                      borderRadius: 10,
                    }}
                    wrapperStyle={{}}
                  >
                    <Card.Title>{campaign.name}</Card.Title>
                    <Badge
                      status={campaign.status == "active" ? "success" : "error"}
                      containerStyle={{
                        position: "absolute",
                        top: 5,
                        right: 40,
                      }}
                      value={campaign.status.toUpperCase()}
                    />
                    <View
                      style={{
                        position: "relative",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          marginTop: 10,
                          marginBottom: 10,
                        }}
                      >
                        {campaign.description}
                      </Text>
                      <View
                        style={{
                          marginTop: 10,
                          marginBottom: 10,
                        }}
                      >
                        <Button
                          title="View Actions"
                          disabled={campaign.status == "active" ? false : true}
                          onPress={() => {
                            setAction({
                              DialogActionList: campaign.actions,
                              campaign_id: campaign.id,
                            });
                            setShowDialog(!showDialog);
                          }}
                        />
                      </View>
                    </View>
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
