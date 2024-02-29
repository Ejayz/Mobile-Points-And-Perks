import { useRoute } from "@react-navigation/native";
import { Avatar, CheckBox, Icon, Input } from "@rneui/themed";
import { Formik, FormikHelpers, FormikValues, FormikProps } from "formik";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { Camera } from "react-native-vision-camera";
import * as Yup from "yup";
const Login = ({ navigation }: any) => {
  const [showPassword, setShowPassword] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const forms = useRef<FormikProps<any>>(null);
  const loginHandler = async (values: any, navigate: any) => {
    setIsRequesting(true);
    try {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",

        "Content-Type": "application/json",
      };
      let bodyContent = JSON.stringify({
        email: values.email,
        password: values.password,
      });
      let response = await fetch(
        "https://pap.pointsandperks.ca/api/private/authentication/login",
        {
          method: "POST",
          body: bodyContent,
          headers: headersList,
        }
      );

      if (response.status == 502) {
        throw new Error("Cannot Connect to Server . Please try again.");
      } else {
        let data = await response.json();

        if (response) {
          setIsRequesting(false);
        }

        if (data.code == 200 && data.token) {
          const token = data.token;
          if (token.role == 1) {
            Toast.show({
              type: "error",
              position: "top",
              text1: "Privillage Required",
              text2: "You do not have the privilege to access this page.",
            });
          } else if (token.role == 2) {
            navigation.navigate("AdminDashboard");
            forms.current?.resetForm();
          } else if (token.role == 3) {
            Toast.show({
              type: "error",
              position: "top",
              text1: "Privillage Required",
              text2: "You do not have the privilege to access this page.",
            });
          } else if (token.role == 4) {
            navigation.navigate("CustomerDrawerNavigator");
            forms.current?.resetForm();
          }
        } else {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Login Error",
            text2: data.message,
          });
        }
      }
    } catch (error: any) {
      setIsRequesting(false);
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Connection Error",
        text2:
          "Cannot connect to server . Please contact server administrator.",
      });
    }
  };

  useEffect(() => {
    const requestPermissions = async () => {
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
      }
    };
    requestPermissions();
  }, []);

  return (
    <ImageBackground
      source={require("../assets/images/car-bg.png")}
      style={{ width: "100%", height: "100%" }}
    >
      <View style={styles.container}>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          innerRef={forms}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email("Email must be a valid.")
              .required("Email is required"),
            password: Yup.string().required("Password is required"),
          })}
          onSubmit={(values: any) => {
            loginHandler(values, navigation);
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "80%",
                height: "80%",
              }}
            >
              <Avatar
                size={120}
                source={require("../assets/images/logo.png")}
              />
              <Input
                style={{
                  flex: 2,
                  paddingVertical: 10,
                  width: "60%",
                  color: "black",
                }}
                labelStyle={{ color: "black", fontSize: 20 }}
                disabledInputStyle={{ backgroundColor: "#ddd" }}
                leftIcon={<Icon name="email" size={20} />}
                placeholder="Email"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                keyboardType="email-address"
                autoCapitalize="none"
                textContentType="emailAddress"
                placeholderTextColor={"black"}
                renderErrorMessage={
                  errors.email && touched.email ? true : false
                }
                errorMessage={`${
                  errors.email && touched.email ? errors.email : ""
                }`}
                errorStyle={{ color: "red", fontSize: 15 }}
              />
              <Input
                leftIcon={<Icon name={"password"}></Icon>}
                placeholder="Password"
                secureTextEntry={showPassword}
                placeholderTextColor={"black"}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                renderErrorMessage={
                  errors.password && touched.password ? true : false
                }
                errorMessage={`${
                  errors.password && touched.password ? errors.password : ""
                }`}
                errorStyle={{ color: "red", fontSize: 15 }}
              />
              <CheckBox
                checked={!showPassword}
                onIconPress={() => {
                  setShowPassword(!showPassword);
                }}
                title="Show Password"
              />
              <Button
                onPress={(values: any) => {
                  handleSubmit(values);
                }}
                title="Login"
                disabled={isRequesting}
              />
            </View>
          )}
        </Formik>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
});
export default Login;
