/**
 * @function smoothReset
 * @param {*} device 
 * @param {String} varName 
 * @param {*} value 
 * @returns {*}
 */
export default function smoothReset(device, varName, value = null) {
    if (value === null) {
        value = device.getVar(varName);
    }
    const followVarName = `${varName}__follow`;
    device.setVar(followVarName, value);
    return value;
}
