import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";

type ScreenParams = {
  Home: undefined;
};

type Screen<T extends keyof ScreenParams> = FC<
  NativeStackScreenProps<ScreenParams, T>
>;

export { Screen, ScreenParams };
