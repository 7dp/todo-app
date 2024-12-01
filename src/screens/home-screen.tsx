import { useAppDispatch, useAppSelector } from "@/store";
import { selectTasks, taskActions } from "@/store/slices";
import { Screen, Task } from "@/types";
import { Feather } from "@expo/vector-icons";
import notifee from "@notifee/react-native";
import dayjs from "dayjs";
import React, { useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import DatePicker from "react-native-date-picker";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { TaskItem } from "./task-item";

const HomeScreen: Screen<"Home"> = () => {
  const tasks = useAppSelector(selectTasks);
  const dispatch = useAppDispatch();

  const [task, setTask] = useState<Task>();
  const [isEditingReminder, setEditingReminder] = useState(false);

  const showTaskInputAlert = (editedTask?: Task) => {
    const isEditMode = !!editedTask;
    Alert.prompt(
      isEditMode ? "Edit tugas" : "Buat tugas baru",
      undefined,
      [
        {
          style: "cancel",
          text: "Batal",
        },
        {
          style: "default",
          onPress(value) {
            if (!value?.trim()) {
              return;
            }
            if (isEditMode) {
              dispatch(
                taskActions.setName({ ...editedTask, name: value.trim() })
              );
            } else {
              const newTask: Task = {
                id: dayjs().valueOf().toString(),
                name: value.trim(),
                createdAt: dayjs().format(),
                remindAt: "",
                isCompleted: false,
              };
              dispatch(taskActions.addTask(newTask));
            }
          },
          text: "Simpan",
        },
      ],
      "plain-text",
      isEditMode ? editedTask.name : undefined
    );
  };

  const handleReminder = async () => {
    try {
      await notifee.requestPermission();
      setEditingReminder(true);
    } catch (error) {
      console.log("handleReminder() error", error);
    }
  };

  const renderItem = ({ item }: ListRenderItemInfo<Task>) => {
    return (
      <TaskItem
        item={item}
        onMorePress={(clickedTask) => {
          setTask(clickedTask);
          const taskHasReminder = !!clickedTask.remindAt;

          const options = [
            "Batal",
            "Edit tugas",
            "Atur pengingat",
            "Hapus pengingat",
            "Hapus tugas",
          ];

          ActionSheetIOS.showActionSheetWithOptions(
            {
              options,
              destructiveButtonIndex: 4,
              cancelButtonIndex: 0,
              disabledButtonIndices: taskHasReminder ? [] : [3],
            },
            (buttonIndex) => {
              if (buttonIndex === 0) {
                // cancel action
              } else if (buttonIndex === 1) {
                showTaskInputAlert(clickedTask);
              } else if (buttonIndex === 2) {
                handleReminder();
              } else if (buttonIndex === 3) {
                dispatch(taskActions.removeReminder(clickedTask));
              } else if (buttonIndex === 4) {
                dispatch(taskActions.removeTask(clickedTask));
              }
            }
          );
        }}
      />
    );
  };

  const renderSeparator = () => <View style={style.separator} />;

  const { bottom } = useSafeAreaInsets();
  const fabStyle: ViewStyle = {
    ...style.fab,
    bottom: bottom ? bottom + 16 : 24,
  };

  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={style.root}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
        contentContainerStyle={style.list}
      />
      <TouchableOpacity
        onPress={() => {
          showTaskInputAlert();
        }}
        style={fabStyle}
      >
        <Feather name="plus" size={28} color={"rgba(0, 0, 0, 0.8)"} />
      </TouchableOpacity>
      <DatePicker
        modal
        open={isEditingReminder}
        mode="datetime"
        date={task?.remindAt ? dayjs(task.remindAt).toDate() : dayjs().toDate()}
        onConfirm={(date) => {
          if (!task) {
            return;
          }
          const editedTask: Task = { ...task, remindAt: dayjs(date).format() };
          dispatch(taskActions.setReminder(editedTask));
          setEditingReminder(false);
        }}
        onCancel={() => {
          setEditingReminder(false);
        }}
      />
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  saveContainer: {
    alignSelf: "flex-end",
  },
  sheetInner: {
    gap: 8,
  },
  root: {
    flex: 1,
  },
  sheetTitle: {
    fontWeight: "500",
    color: "black",
  },
  input: {
    borderRadius: 6,
    backgroundColor: "whitesmoke",
    fontSize: 15,
    lineHeight: 19,
    height: 19 * 1,
  },
  list: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  fab: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    bottom: 24,
    height: 56,
    justifyContent: "center",
    position: "absolute",
    right: 20,
    width: 56,
    shadowColor: "gray",
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  scrollView: {
    flexGrow: 1,
    padding: 24,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "lightgray",
  },
});

export { HomeScreen };
