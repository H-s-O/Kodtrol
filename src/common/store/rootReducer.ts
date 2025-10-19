import { WebSocketReducer } from "@bucky24/redux-websocket";

import currentProjectFile from "./slices/currentProjectFile";

const rootReducer = {
  currentProjectFile,
  __websocket: WebSocketReducer,
};

export default rootReducer;
