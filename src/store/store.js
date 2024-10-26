import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducers"; // import your root reducer
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Use AsyncStorage for React Native

const persistConfig = {
  key: "root",
  storage: AsyncStorage, // Use AsyncStorage for storing state
  whitelist: ["user"], // add any other reducers to whitelist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,     // Disable immutability checks
      serializableCheck: false, // Disable the serializable state invariant middleware
    }),
});

const persistor = persistStore(store);

export { store, persistor };
