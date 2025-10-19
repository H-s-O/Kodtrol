import { contextBridge } from "electron";

import { getKodtrolProcessArg } from "../common/lib/renderers";

const kodtrol = JSON.parse(getKodtrolProcessArg(process.argv) ?? "{}");

contextBridge.exposeInMainWorld("kodtrol_bridge", kodtrol);
