import { Task } from "@/types";
import notifee, { TimestampTrigger, TriggerType } from "@notifee/react-native";
import dayjs from "dayjs";

async function scheduleNotification(task: Task) {
  if (!task.remindAt) {
    return;
  }
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: dayjs(task.remindAt).valueOf(),
  };

  await notifee.createTriggerNotification(
    {
      id: task.id,
      title: task.name,
      body: dayjs(task.remindAt).format("dddd, DD MMMM, HH.mm"),
      android: {
        channelId: "your-channel-id",
      },
      ios: {
        sound: "default",
        foregroundPresentationOptions: {
          badge: true,
          banner: true,
          list: true,
          sound: true,
        },
      },
    },
    trigger
  );
}

async function unscheduleNotification(taskId: string) {
  await notifee.cancelNotification(taskId);
}

export { scheduleNotification, unscheduleNotification };
