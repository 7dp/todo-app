import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";

import { persistStorage } from "../utils/persist-storage";
import { persistMigrate, persistVersion } from "./persist-migration";
import { taskReducer, taskSlice } from "./slices";

const rootReducer = combineReducers({
  [taskSlice.name]: taskReducer,
});

// #region Persisted reducer
const whitelist: string[] = [taskSlice.name];
const persistedReducer = persistReducer(
  {
    key: "root",
    migrate: persistMigrate,
    storage: persistStorage,
    version: persistVersion,
    whitelist,
  },
  rootReducer
);
// #endregion

// #region Store
const store = configureStore({
  reducer: persistedReducer,
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });
  },
});
// #endregion

// Enable listener behavior for the store
setupListeners(store.dispatch);

// Persisted version of the store
const persistor = persistStore(store);

// #region Store utils
const dispatchStore = store.dispatch;
const getStoreState = store.getState;
// #endregion

export { dispatchStore, getStoreState, persistor, rootReducer, store };
