/**
 * @function smoothValue
 * @param {*} device 
 * @param {String} varName 
 * @returns {*}
 */
export default function smoothValue(device, varName) {
    const followVarName = `${varName}__follow`;
    return device.getVar(followVarName);
}
