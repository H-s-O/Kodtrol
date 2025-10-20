import { ReduxWebSocketClient } from "@bucky24/redux-websocket";

import { DEFAULT_WS_PORT } from "../common/constants";
import { AppStore, createKodtrolStore } from "../common/store/store";
import { setCurrentProjectFileAction } from "../common/store/slices/currentProjectFile";
import rootReducer from "../common/store/rootReducer";
import Logger from "../common/lib/Logger";

const logger = new Logger("ENGINE");

/*
Size in Bytes   Description
1               Start of message delimiter, hex 7E.
1               Label to identify type of message.
                See below for value.
1               Data length LSB.
                Valid range for data length is 0 to 600.
1               Data length MSB.
data_length     Data bytes.
1               End of message delimiter, hex E7
*/
let testPort: SerialPort | undefined;
const doPortTest = async (port: SerialPort) => {
  testPort = port;
  testPort
    .open({ baudRate: 9600, dataBits: 8, stopBits: 2, parity: "none" })
    // testPort.open({ baudRate: 9600 })
    .then(async () => {
      console.log("opened!");

      const cmd = new Uint8Array([
        0x7e,

        10, 0, 0,

        0xe7,
      ]);

      // const cmd = new Uint8Array([
      //   0x7e,

      //   0x06,
      //   31,
      //   0,

      //   0, // start code?
      //   0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      //   0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      //   0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

      //   0xe7,
      // ]);

      // cmd[1] = 0x06;

      // cmd[2] = 30;
      // cmd[3] = 0;

      // cmd[4] = 0;
      // cmd[5] = 0;
      // cmd[6] = 0;
      // cmd[7] = 0;
      // cmd[8] = 0;
      // cmd[9] = 0;
      // cmd[10] = 0;
      // cmd[11] = 0;
      // cmd[12] = 0;
      // cmd[13] = 0;

      // cmd[14] = 0;
      // cmd[15] = 0;
      // cmd[16] = 0;
      // cmd[17] = 0;
      // cmd[18] = 0;
      // cmd[19] = 0;
      // cmd[20] = 0;
      // cmd[21] = 0;
      // cmd[22] = 0;
      // cmd[23] = 0;

      // cmd[24] = 0;
      // cmd[25] = 0;
      // cmd[26] = 0;
      // cmd[27] = 0;
      // cmd[28] = 0;
      // cmd[29] = 0;
      // cmd[30] = 0;
      // cmd[31] = 0;
      // cmd[32] = 0;
      // cmd[33] = 0;

      // cmd[34] = 0xe7;
      testPort?.writable
        ?.getWriter()
        .write(cmd)
        .then(async () => {
          console.log("cmd sent!", cmd.toString());

          const reader = testPort?.readable?.getReader();
          try {
            while (true) {
              console.log("reading...");
              const { done, value } = await reader?.read();
              console.log("received:");
              console.log(" done:", done);
              console.log(" value:", value.toString());
              console.log(" serial:", decodeEnttecSerial(value.slice(4, -1)));
              if (done) break;
            }
          } catch (err) {
            console.error("err", err);
          }
        })
        .catch((err) => console.error("err", err));
    })
    .catch((err) => console.error("open error:", err));
};

const decodeEnttecSerial = (arr: number[]) => {
  let chars: string[] = [];
  for (let i = 0; i < arr.length; i++) {
    chars.unshift((arr[i] & 0b1111).toString());
    chars.unshift(((arr[i] >> 4) & 0b1111).toString());
  }
  return chars.join("");
};

const listWebSerialPorts = () => {
  navigator.serial.getPorts().then((ports) => {
    // console.group('serial ports');
    // ports.forEach((port) => console.log(port.getInfo()));
    // console.groupEnd();

    testPort || doPortTest(ports[0]);
  });
};

const listWebUsbDevices = () => {
  navigator.usb.getDevices().then((devices) => {
    // console.group('usb devices');
    // devices.forEach((device) => console.log(device.productName, device.manufacturerName, device.productId, device.vendorId, device.serialNumber));
    // console.groupEnd();
  });
};

setInterval(listWebSerialPorts, 2000);
setInterval(listWebUsbDevices, 2000);

console.log("engine session", window.kodtrol_bridge.wsSession);
const wsPort = DEFAULT_WS_PORT;
const wsUrl = `ws://localhost:${wsPort}`;
const socketHandler = new ReduxWebSocketClient(wsUrl, "protocol", {
  specialActions: [],
  debug: false,
});
socketHandler.setAuthentication(window.kodtrol_bridge.wsSession);
socketHandler.setReducers(rootReducer);
let store: AppStore;
socketHandler.on("stateReceived", ({ reducers, initialState }) => {
  logger.log("on stateReceived", reducers, initialState);
  store = createKodtrolStore(initialState, reducers, [socketHandler.getMiddleware()]);
  store.subscribe(() => {
    logger.log("store change:", store.getState());
  });

  const btn = document.createElement("button");
  btn.innerText = "######";
  btn.onclick = () => {
    store.dispatch(setCurrentProjectFileAction("/tst.kodtrol"));
  };
  document.body.appendChild(btn);

  return store;
});
