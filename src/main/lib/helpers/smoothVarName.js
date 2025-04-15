/**
 * @function smoothVarName
 * @param {*} device 
 * @param {String} varName 
 * @returns {String}
 */
export default function smoothVarName(device, varName) {
    const followVarName = `${varName}__follow`;
    return followVarName;
}
