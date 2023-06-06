export default function smoothReset(device, varName, value = null) {
    if (value === null) {
        value = device.getVar(varName);
    }
    const followVarName = `${varName}__follow`;
    device.setVar(followVarName, value);
    return value;
}