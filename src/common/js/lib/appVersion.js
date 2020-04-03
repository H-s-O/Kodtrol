import { app, remote } from 'electron';

const appVersion = (app || remote.app).getVersion();

export default appVersion;
