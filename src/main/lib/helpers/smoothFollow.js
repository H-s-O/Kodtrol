export default function smoothFollow(device, varName, divider = 1, value = null, initValue = null) {
    if (value === null) {
        value = device.getVar(varName);
    }
    const followVarName = `${varName}__follow`;
    if (!device.varIsSet(followVarName)) {
        device.setVar(followVarName, initValue !== null ? initValue : value);
    }
    let follow = device.getVar(followVarName);
    const diff = value - follow;
    follow += diff / divider;
    device.setVar(followVarName, follow);
    return follow;
}