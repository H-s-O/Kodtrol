export const validateAll = (resultObj) => ({
  ...resultObj,
  all_fields: Object.values(resultObj).every((value) => value === true),
});
