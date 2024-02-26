import * as React from "react";
import { Card } from "@rneui/base";
import { View, Image, Text } from "react-native";
import { SpeedDial } from "@rneui/themed";

export default function AdminCustomerAccount({ navigation }: any) {
  return (
    <SpeedDial
      isOpen
      openIcon={{ name: "close", color: "#fff" }}
      onOpen={() => console.log("onOpen()")}
      onClose={() => console.log("onClose()")}
      transitionDuration={150}
      icon={{ name: "edit", color: "#fff" }}
    >
      <SpeedDial.Action
        icon={{ name: "add", color: "#fff" }}
        title="Add"
        onPress={() => console.log("Add Something")}
      />
      <SpeedDial.Action
        icon={{ name: "delete", color: "#fff" }}
        title="Delete"
        onPress={() => console.log("Delete Something")}
      />

      <Card containerStyle={{}} wrapperStyle={{}}>
        <Card.Title>CARD WITH DIVIDER</Card.Title>
        <Card.Divider />
        <View
          style={{
            position: "relative",
            alignItems: "center",
          }}
        >
          <Image
            style={{ width: "100%", height: 100 }}
            resizeMode="contain"
            source={{
              uri: "https://avatars0.githubusercontent.com/u/32242596?s=460&u=1ea285743fc4b083f95d6ee0be2e7bb8dcfc676e&v=4",
            }}
          />
          <Text>Pranshu Chittora</Text>
        </View>
      </Card>
    </SpeedDial>
  );
}
