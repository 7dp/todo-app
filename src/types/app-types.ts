type NotificationType = "pesan_baru";

type Task = {
  id: string;
  name: string;
  createdAt: string;
  remindAt: string;
  isCompleted: boolean;
};

type StorageKey = {
  BACKGROUND_PRESS_NOTIFICATION_TYPE: NotificationType;
};

export { Task };
export type { NotificationType, StorageKey };
