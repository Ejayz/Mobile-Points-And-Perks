import { useRoute } from "@react-navigation/native";
import { Camera } from "expo-camera";
import { Formik, FormikHelpers, FormikValues } from "formik";
import React from "react";
import {
  Button,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const Login = ({ navigation }: any) => {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  console.log(permission)
  const [isRequesting, setIsRequesting] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const loginHandler = async (values: any, navigate: any) => {
    setIsRequesting(true);
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

    let data = await response.json();
    console.log(data);
    if(response){
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
        navigation.navigate("SuperAdminDrawer");
      } else if (token.role == 3) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Privillage Required",
          text2: "You do not have the privilege to access this page.",
        });
      } else if (token.role == 4) {
        navigation.navigate("SuperAdminDrawer");
      }
    }
  };
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
          onSubmit={(values: any) => {
            loginHandler(values, navigation);
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "80%",
                height: "100%",
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
                labelStyle={{ color: "black" }}
                disabledInputStyle={{ backgroundColor: "#ddd" }}
                leftIcon={<Icon name="email" size={20} />}
                placeholder="Email"
                label="Email"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                keyboardType="email-address"
                autoCapitalize="none"
                textContentType="emailAddress"
              />
              <Input
                leftIcon={<Icon name={"password"}></Icon>}
                placeholder="Password"
                secureTextEntry={showPassword}
                label="Password"
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
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
                title="Submit"
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
