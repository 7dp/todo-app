import { useAppDispatch } from "@/store";
import { taskActions } from "@/store/slices";
import { Task } from "@/types";
import { Feather } from "@expo/vector-icons";
import dayjs from "dayjs";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  item: Task;
  onMorePress: (item: Task) => void;
};

const TaskItem = ({ item, onMorePress }: Props) => {
  const dispatch = useAppDispatch();

  const markAsDoneOrUndone = () => {
    dispatch(taskActions.toggleTaskStatus(item));
  };

  const _onMorePress = () => {
    onMorePress(item);
  };

  const getPrettyDate = () => {
    const now = dayjs();
    const reminderDate = dayjs(item.remindAt);
    if (reminderDate.isSame(now, "day")) {
      return `Hari ini, ${reminderDate.format("HH.mm")}`;
    }
    if (reminderDate.isSame(now, "year")) {
      return reminderDate.format("dddd, DD MMM, HH.mm");
    }
    return reminderDate.format("dddd, DD MMM YYYY, HH.mm");
  };

  return (
    <View style={style.root}>
      <TouchableOpacity
        onPress={markAsDoneOrUndone}
        style={style.toggleCompleteIcon}
      >
        <Feather
          name={item.isCompleted ? "check" : "circle"}
          size={22}
          color={"rgba(0, 0, 0, 0.55)"}
        />
      </TouchableOpacity>
      <View style={style.containerText}>
        <View style={style.containerName}>
          <Text style={[style.name, item.isCompleted && style.textCompleted]}>
            {item.name}
          </Text>
        </View>
        {!!item.remindAt && (
          <Text style={[style.remind, item.isCompleted && style.textCompleted]}>
            {getPrettyDate()}
          </Text>
        )}
      </View>
      <View style={style.containerButton}>
        <TouchableOpacity onPress={_onMorePress} style={style.editIcon}>
          <Feather
            name={"more-horizontal"}
            size={18}
            color={"rgba(0, 0, 0, 0.6)"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  toggleCompleteIcon: {
    alignItems: "center",
    justifyContent: "center",
    height: 28,
    width: 28,
  },
  containerButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  containerName: {
    minHeight: 28,
    flex: 1,
    justifyContent: "center",
  },
  editIcon: {
    alignItems: "center",
    justifyContent: "center",
    height: 24,
    width: 24,
  },
  containerText: {
    gap: 4,
    flex: 1,
  },
  root: {
    backgroundColor: "white",
    borderRadius: 6,
    flexDirection: "row",
    gap: 10,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 14,
    paddingBottom: 13,
  },
  name: {
    color: "rgba(0, 0, 0, 0.85)",
    fontSize: 15,
  },
  textCompleted: {
    textDecorationLine: "line-through",
  },
  remind: {
    color: "dodgerblue",
    fontSize: 14,
    flex: 1,
  },
});

export { TaskItem };
