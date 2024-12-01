import RNBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetProps,
  BottomSheetView,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet";
import React, { ReactNode, forwardRef, useCallback } from "react";
import { Keyboard, StyleSheet, ViewStyle } from "react-native";
import {
  SafeAreaView,
  SafeAreaViewProps,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type Props = {
  props?: Partial<BottomSheetProps>;
  children?: ReactNode;
  safeAreaProps?: SafeAreaViewProps;
  isDismissible?: boolean;
};

const BottomSheet = forwardRef<RNBottomSheet, Props>(function Component(
  props,
  ref
) {
  const { props: sheetProps, children, safeAreaProps, isDismissible } = props;

  const { bottom } = useSafeAreaInsets();

  const onChange = useCallback((index: number) => {
    const isOpened = index === 0;
    const isClosed = index === -1;
    if (isOpened || isClosed) Keyboard.dismiss();

    sheetProps?.onChange?.(index);
  }, []);

  const safeAreaStyle: ViewStyle = {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: bottom ? 0 : 16,
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.4}
      />
    ),
    []
  );

  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 23,
    stiffness: 225,
  });

  return (
    <RNBottomSheet
      ref={ref}
      animationConfigs={animationConfigs}
      backdropComponent={renderBackdrop}
      backgroundStyle={style.background}
      enableDynamicSizing
      enablePanDownToClose={isDismissible ?? true}
      handleIndicatorStyle={style.handleIndicator}
      index={-1}
      keyboardBlurBehavior="restore"
      onChange={onChange}
      {...sheetProps}
    >
      <BottomSheetView style={style.sheetView}>
        <SafeAreaView
          edges={["bottom", "left", "right"]}
          {...safeAreaProps}
          style={[safeAreaStyle, { ...safeAreaProps }?.style]}
        >
          {children}
        </SafeAreaView>
      </BottomSheetView>
    </RNBottomSheet>
  );
});

const style = StyleSheet.create({
  background: {
    backgroundColor: "white",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleIndicator: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  sheetView: {
    // workaround for this issue: https://github.com/gorhom/react-native-bottom-sheet/issues/1573#issue-1936697973
    minHeight: 31,
  },
});

export { BottomSheet };
