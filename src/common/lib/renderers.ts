const kodtrolArgPrefix = `--kodtrol=`;

export const getKodtrolProcessArg = (argv: string[]) => {
  const arg = argv.find((val) => val.indexOf(kodtrolArgPrefix) !== -1);
  if (arg) {
    return arg.substring(kodtrolArgPrefix.length);
  }
  return undefined;
};
