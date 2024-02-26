import * as React from "react";
import { Card } from "@rneui/base";
import { View, Image, Text } from "react-native";
import { SpeedDial } from "@rneui/themed";

export default function AdminCustomerAccount({ navigation }: any) {
  const [OpenEdit, setOpenEdit] = React.useState(false);

  return (
    <>
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
      <SpeedDial
        isOpen={OpenEdit}
        openIcon={{ name: "close", color: "#fff" }}
        onOpen={() => console.log("onOpen()")}
        onClose={() => console.log("onClose()")}
        onPressIn={() => setOpenEdit(!OpenEdit)}
        transitionDuration={150}
        icon={{ name: "menu", color: "#fff" }}
      >
        <SpeedDial.Action
          icon={{ name: "add", color: "#fff" }}
          title="Add Points"
          onPress={() => console.log("Add Something")}
        />
        <SpeedDial.Action
          icon={{ name: "edit", color: "#fff" }}
          title="Edit Points"
          onPress={() => console.log("Delete Something")}
        />
      </SpeedDial>
    </>
  );
}
