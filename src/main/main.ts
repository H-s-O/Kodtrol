import { app } from "electron";
import { join } from "path";
import { BrowserWindow } from "electron/main";
import { createWithPort } from "@bucky24/redux-websocket/server";
import { ReduxWebSocketClient } from "@bucky24/redux-websocket";
import WebSocket from "ws";
import { randomUUID } from "crypto";

import { envIsDev, envUiPort, envWsPort } from "./lib/env";
import { APP_NAME, DEFAULT_WS_PORT } from "../common/constants";
import { AppStore, createKodtrolStore } from "../common/store/store";
import rootReducer from "../common/store/rootReducer";
import Logger from "../common/lib/Logger";

const logger = new Logger("MAIN");

// homemade polyfill
(global as any).WebSocket = WebSocket;

console.group("KODTROL env vars");
console.info("is dev:", envIsDev);
console.info("ws port:", envWsPort);
console.info("ui port:", envUiPort);
console.groupEnd();

app
  .whenReady()
  .then(() => {
    logger.log("KODTROL app ready");

    process.once("SIGINT", () => {
      logger.log("/!\\ GOT SIGINT");
      app.quit();
    });
    process.once("SIGTERM", () => {
      logger.log("/!\\ GOT SIGTERM");
      app.quit();
    });

    const wsPort = envWsPort ?? DEFAULT_WS_PORT;
    const wsUrl = `ws://localhost:${wsPort}`;
    const wsProtocol = "protocol";
    const wsSession = randomUUID();

    const reduxWsServer = createWithPort(wsPort);
    reduxWsServer.on("getInitialState", ({ session }) => {
      logger.debug("on getInitialState", session);
      return {};
    });

    let store: AppStore;

    const reduxMainClient = new ReduxWebSocketClient(wsUrl, wsProtocol, {
      specialActions: [],
      debug: false,
    });
    reduxMainClient.setAuthentication(wsSession);
    reduxMainClient.setReducers(rootReducer);
    reduxMainClient.on("stateReceived", ({ reducers, initialState }) => {
      logger.debug("on stateReceived", initialState);
      store = createKodtrolStore(initialState, reducers, [reduxMainClient.getMiddleware()]);
      store.subscribe(() => {
        logger.debug("store change", store.getState());
      });
      return store;
    });

    const engineWindow = new BrowserWindow({
      title: `${APP_NAME} - Engine`,
      show: envIsDev,
      webPreferences: {
        preload: join(__dirname, "..", "engine", "engine-preload.js"),
        additionalArguments: [
          `--kodtrol=${JSON.stringify({
            wsSession,
          })}`,
        ],
      },
    });
    engineWindow.webContents.session.setPermissionCheckHandler(() => true);
    engineWindow.webContents.session.setDevicePermissionHandler(() => true);
    engineWindow.webContents.loadFile(join(__dirname, "..", "engine", "engine.html"));
    if (envIsDev) engineWindow.webContents.openDevTools();

    app.once("will-quit", () => {
      logger.log("WILL QUIT");
    });
  })
  .catch((err) => {
    console.error("---------------------------------");
    console.error("KODTROL main error:");
    console.error(err);
    process.exit(1);
  });
