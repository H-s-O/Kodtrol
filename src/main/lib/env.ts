export const envIsDev = typeof process.env.KODTROL_DEV !== "undefined";
export const envWsPort =
  typeof process.env.KODTROL_WS_PORT !== "undefined"
    ? parseInt(process.env.KODTROL_WS_PORT)
    : undefined;
export const envUiPort =
  typeof process.env.KODTROL_UI_PORT !== "undefined"
    ? parseInt(process.env.KODTROL_UI_PORT)
    : undefined;
