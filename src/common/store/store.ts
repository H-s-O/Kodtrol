import { configureStore, Middleware } from "@reduxjs/toolkit";

export const createKodtrolStore = (
  preloadedState = {},
  reducer = {},
  extraMiddlewares: Middleware[] = []
) =>
  configureStore({
    preloadedState,
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(extraMiddlewares),
  });

export type AppStore = ReturnType<typeof createKodtrolStore>;
export type RootState = ReturnType<ReturnType<typeof createKodtrolStore>["getState"]>;
export type AppDispatch = ReturnType<typeof createKodtrolStore>["dispatch"];
