type ValidationObject = {
  [k: string]: boolean
}

export const validateAll = <T extends ValidationObject>(resultObj: T): T & { __all_fields: boolean } => ({
  ...resultObj,
  __all_fields: Object.values(resultObj).every((value) => value === true),
});
