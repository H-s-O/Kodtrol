export default function smoothValue(device, varName) {
    const followVarName = `${varName}__follow`;
    return device.getVar(followVarName);
}