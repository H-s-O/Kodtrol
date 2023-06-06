import { WindowAdditionalArgs } from '../../common/types';

declare global {
  interface Window {
    kodtrol_splash: {
      mainRequestQuit(): void
      mainRequestCreateProject(): void
      mainRequestLoadProject(): void
    } & WindowAdditionalArgs
  }
}

export { };
