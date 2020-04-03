import { app, remote } from 'electron';

const isDev = !(app || remote.app).isPackaged;

export default isDev;
