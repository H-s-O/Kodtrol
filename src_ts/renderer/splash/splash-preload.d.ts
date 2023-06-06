declare global {
  interface Window {
    kodtrol_splash: {
      mainRequestQuit(): void
      mainRequestCreateProject(): void
      mainRequestLoadProject(): void
    }
  }
}

export { };
