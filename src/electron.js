// Workaround for what looks like a bug in the child_process.fork method,
// which always spawns the main process no matter what are its settings.
if (process.env.MANUSCRIT_RENDERER) {
  const renderer = new (require('./renderer/Renderer').default)();
} else {
  const main = new (require('./main/Main').default)();
}