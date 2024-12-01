import { useMemo } from "react";
import { ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const paddingBottomStyle = (bottomInset: number) =>
  ({
    paddingBottom: bottomInset || 16,
  } as ViewStyle);

const usePaddingBottom = () => {
  const { bottom } = useSafeAreaInsets();
  const style = useMemo(() => paddingBottomStyle(bottom), [bottom]);
  return style;
};

export { usePaddingBottom };
