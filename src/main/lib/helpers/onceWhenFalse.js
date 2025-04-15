let __onceWhenFalse = {}
/**
 * @function onceWhenFalse
 * @description Invokes a callback once for each time that the checked `value` becomes `false`.
 * @param {*} value The value to check
 * @param {String} id The identifier for the check
 * @param {Function} callback The function to be invoked when the check succeeds
 */
export default function onceWhenFalse(value, id, callback) {
    if (value === false) {
        if (__onceWhenFalse[id] !== false) {
            callback()
            __onceWhenFalse[id] = false
        }
    } else {
        __onceWhenFalse[id] = true
    }
}
