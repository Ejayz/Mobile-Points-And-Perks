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
import { View, Text, TouchableHighlight, StatusBar, Alert } from "react-native";
import { SpeedDial } from "@rneui/themed";
import { DateTime } from "luxon";
import { Form, Formik, FormikHelpers, FormikProps, FormikValues } from "formik";
import * as Yup from "yup";
import Toast from "react-native-toast-message";
interface UserData {
  code: number;
  data: {
    address_1: string | null;
    address_2: string | null;
    city: string | null;
    country: string | null;
    created_at: string;
    email: string;
    first_name: string;
    last_name: string;
    middle_name: string | null;
    name: string;
    phone_number: string;
    points: number;
    state_province: string | null;
    suffix: string;
    zip_code: string | null;
    multiplier: number;
  };
  message: string;
}

export default function AdminCustomerAccount({ route, navigation }: any) {
  const [OpenEdit, setOpenEdit] = React.useState(false);
  const { user_id } = route.params;
  const [data, setData] = React.useState<UserData>();
  const [loading, setLoading] = React.useState(true);
  const AddPointsForm = React.useRef<FormikProps<any>>(null);
  const [AddFormDefault, setAddFormDefault] = React.useState({
    points: "0",
    multiplier: data == undefined ? "0" : data.data.multiplier,
    total_points: 0,
  });
  const UpdatePointsForm = React.useRef<FormikProps<any>>(null);
  const [showUpdatePoints, setShowUpdatePoints] = React.useState(false);

  const fetchData = async () => {
    let headersList = {
      Accept: "*/*",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      "Content-Type": "application/json",
    };

    let response = await fetch(
      `https://pointsandperks.ca/api/private/getCustomerProfileCardMobile?user_id=${user_id}`,
      {
        method: "GET",
        headers: headersList,
      }
    );
    console.log(response);
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
    fetchData();
  }, []);

  const [showAddPoints, setShowAddPoints] = React.useState(false);


  const calculatePoints = (values: any) => {
    console.log(values);
    const { points, multiplier } = values;
    const convertedPoints = parseFloat(points);
    const calculatedAmount =
      convertedPoints * parseFloat(multiplier) + convertedPoints;
    if (isNaN(calculatedAmount)) {
      AddPointsForm.current?.setFieldValue("total_points", "0");
      return
    } else {
      AddPointsForm.current?.setFieldValue(
        "total_points",
        calculatedAmount.toFixed(2).toString() 
      );
      return
    }
  };

  const AddFormValidation = Yup.object({
    points: Yup.number()
      .required("Points is a required Field")
      .typeError("Points must be a number"),
    total_points: Yup.number().required().typeError("Points must be a number"),
    multiplier: Yup.number().required().typeError("Points must be a number"),
  });
  const UpdateFormValidation = Yup.object({
    points: Yup.number()
      .required("Points is a required Field")
      .typeError("Points must be a number"),
  });

  const addPoints = async (values: any) => {
    let headersList = {
      Accept: "*/*",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      "Content-Type": "application/json",
    };

    let bodyContent = JSON.stringify({
      points: values.points,
      multiplier: values.multiplier,
      total_points: values.total_points,
      customer_id: user_id,
    });

    let response = await fetch(
      "https://pointsandperks.ca/api/private/AddPointsMobile",
      {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      }
    );

    let data = await response.json();
    if (data.code == 200) {
      await fetchData();
      setShowAddPoints(!showAddPoints);

      Toast.show({
        type: "success",
        text1: "Add Success",
        text2: data.message,
      });

      AddPointsForm.current?.resetForm();
    } else {
      Toast.show({
        type: "error",
        text1: "Add Error",
        text2: data.message,
      });
    }
  };

  const updatePoints = async (values: any) => {
    let headersList = {
      Accept: "*/*",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      "Content-Type": "application/json",
    };

    let bodyContent = JSON.stringify({
      points: values.points,
      customer_id: user_id,
    });

    let response = await fetch(
      "https://pointsandperks.ca/api/private/UpdatePointsMobile",
      {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      }
    );

    if (response.status == 502) {
      Toast.show({
        type: "error",
        text1: "Connection Error",
        text2:
          "Cannot connect to server . Please contact server administrator.",
      });
    } else {
      let data = await response.json();
      if (data.code == 200) {
        await fetchData();
        setShowUpdatePoints(!showUpdatePoints);

        Toast.show({
          type: "success",
          text1: "Update Success",
          text2: data.message,
        });

        AddPointsForm.current?.resetForm();
      } else {
        Toast.show({
          type: "error",
          text1: "Update Error",
          text2: data.message,
        });
      }
    }
  };

  return (
    <>
      <StatusBar
        barStyle={"dark-content"}
        translucent
        backgroundColor={"transparent"}
        hidden={true}
      />
      <Dialog
        style={{
          backgroundColor: "white",
        }}
        isVisible={showAddPoints}
        onBackdropPress={() => setShowAddPoints(!showAddPoints)}
        overlayStyle={{
          backgroundColor: "white",
        }}
      >
        <Dialog.Title title="Add Points" />
        <Formik
          enableReinitialize={true}
          initialValues={{
            points: 0,
            total_points: 0,
            multiplier:
              data == undefined ? "0" : data.data.multiplier.toString(),
          }}
          innerRef={AddPointsForm}
          onSubmit={async (values) => {
            await addPoints(values);
          }}
          validationSchema={AddFormValidation}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setValues,
          }) => (
            <>
              <Input
                style={{
                  flex: 2,
                  paddingVertical: 10,
                  width: "60%",
                  color: "black",
                }}
                labelStyle={{ color: "black", fontSize: 15 }}
                label="Points"
                disabledInputStyle={{ backgroundColor: "#ddd" }}
                placeholder="Points"
                onChangeText={handleChange("points")}
                onBlur={handleBlur("points")}
                value={values.points.toString()}
                keyboardType="numeric"
                autoCapitalize="none"
                placeholderTextColor={"black"}
                renderErrorMessage={
                  errors.points && touched.points ? true : false
                }
                errorMessage={`${errors.points && touched.points ? errors.points : ""
                  }`}
                errorStyle={{ color: "red", fontSize: 15 }}
                onTextInput={() => calculatePoints(values)}
              />
              <Dialog.Actions>
                <Dialog.Button
                  title="Add"
                  onPress={(e: any) => {
                   Alert.alert("Add Points",`Points will be multiplied to ${ data == undefined ? "0" : data.data.multiplier.toString()}`,[
                    {
                      
                        text: "Cancel",
                        onPress: () => {},
                        style: "cancel",
                      
                    },{
                      text:"CONFIRM",
                      onPress:()=>{
                        handleChange(e)
                      },
                      style:"default"
                    }
                   ])
                  }}
                />
                <Dialog.Button
                  title="Cancel"
                  onPress={() => setShowAddPoints(!showAddPoints)}
                />
              </Dialog.Actions>
            </>
          )}
        </Formik>
      </Dialog>
      <Dialog
        style={{
          backgroundColor: "white",
        }}
        isVisible={showUpdatePoints}
        onBackdropPress={() => setShowUpdatePoints(!showUpdatePoints)}
        overlayStyle={{
          backgroundColor: "white",
        }}
      >
        <Dialog.Title title="Add Points" />
        <Formik
          enableReinitialize={true}
          initialValues={{
            points: data == undefined ? "0" : data.data.points.toString(),
          }}
          innerRef={UpdatePointsForm}
          onSubmit={async (values: any) => {
            const data = await updatePoints(values);
          }}
          validationSchema={UpdateFormValidation}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setValues,
          }) => (
            <>
              <Input
                style={{
                  flex: 2,
                  paddingVertical: 10,
                  width: "60%",
                  color: "black",
                }}
                labelStyle={{ color: "black", fontSize: 15 }}
                label="Points"
                disabledInputStyle={{ backgroundColor: "#ddd" }}
                placeholder="Points"
                onChangeText={handleChange("points")}
                onBlur={handleBlur("points")}
                value={values.points.toString()}
                keyboardType="numeric"
                autoCapitalize="none"
                placeholderTextColor={"black"}
                renderErrorMessage={
                  errors.points && touched.points ? true : false
                }
                errorMessage={`${errors.points && touched.points ? errors.points : ""
                  }`}
                errorStyle={{ color: "red", fontSize: 15 }}
              />
              <Dialog.Actions>
                <Dialog.Button
                  title="Update"
                  onPress={(e: any) => {
                    handleSubmit(e);
                  }}
                />
                <Dialog.Button
                  title="Cancel"
                  onPress={() => setShowUpdatePoints(!showUpdatePoints)}
                />
              </Dialog.Actions>
            </>
          )}
        </Formik>
      </Dialog>
      {data == undefined ? (
        <Text>Loading...</Text>
      ) : (
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
              title={`${data == undefined
                  ? "L"
                  : `${data.data.first_name.charAt(
                    0
                  )}${data.data.last_name.charAt(0)}`
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
                : `${data.data.first_name} ${data.data.middle_name} ${data.data.last_name}`}
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
                {data == undefined ? "Loading" : `${data.data.phone_number}`}
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
                Email:
              </Text>
              <Text>
                {data == undefined ? "Loading" : `${data.data.email}`}
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
                Address:
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "left",
                }}
              >
                {data == undefined ? "Loading..." : data.data.address_1}{" "}
                {data == undefined ? "Loading..." : data.data.address_2}{" "}
                {data == undefined ? "Loading..." : data.data.city}{" "}
                {data == undefined ? "Loading..." : data.data.state_province}{" "}
                {data == undefined ? "Loading..." : data.data.zip_code}{" "}
                {data == undefined ? "Loading..." : data.data.country}
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
                    : DateTime.fromISO(data.data.created_at).toLocaleString(
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

                <Text>{data == undefined ? "Loading..." : data.data.name}</Text>
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
                  {data == undefined ? "Loading..." : data.data.points}{" "}
                  Fronteirs
                </Text>
              </View>
            </Card>
          </View>
        </Card>
      )}
      <SpeedDial
        isOpen={OpenEdit}
        openIcon={{ name: "close", color: "#fff" }}
        onOpen={() => {
          AddPointsForm.current?.setFieldValue(
            "multiplier",
            data == undefined ? 0 : data.data.multiplier
          );
        }}
        onClose={() => console.log("onClose()")}
        onPressIn={() => setOpenEdit(!OpenEdit)}
        transitionDuration={150}
        icon={{ name: "menu", color: "#fff" }}
      >
        <SpeedDial.Action
          icon={{ name: "add", color: "#fff" }}
          title="Add Points"
          onPress={() => {
            setOpenEdit(!OpenEdit);
            setShowAddPoints(true);
          }}
        />
        <SpeedDial.Action
          icon={{ name: "edit", color: "#fff" }}
          title="Edit Points"
          onPress={() => {
            setOpenEdit(!OpenEdit);
            setShowUpdatePoints(!showUpdatePoints);
          }}
        />
      </SpeedDial>
    </>
  );
}
