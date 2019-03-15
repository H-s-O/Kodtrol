const APP_VERSION = process.env.npm_package_version;

export default (state = APP_VERSION, {type, payload}) => {
  switch (type) {
    default:
      return state;
      break;
  }
};