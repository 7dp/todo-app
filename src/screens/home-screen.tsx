import { Screen } from "@/types";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen: Screen<"Home"> = () => {
  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={style.root}
    ></SafeAreaView>
  );
};

const style = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'cyan',
  },
});

export { HomeScreen };
