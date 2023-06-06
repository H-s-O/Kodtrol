// import { version } from '../../package.json'

export const IS_DEV = process.env.KODTROL_DEV === 'true';
export const IS_WINDOWS = process.platform === 'win32';
export const IS_MAC = process.platform === 'darwin';
export const IS_LINUX = process.platform === 'linux';

// Do not use app.getVersion(), as it returns Electron's version in 
// dev instead of the actual app version
export const APP_VERSION = 'lol';
