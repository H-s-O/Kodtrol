let __onceWhenOne = {}
/**
 * @function onceWhenOne
 * @description Invokes a callback once for each time that the checked `value` becomes exactly `1`.
 * @param {*} value The value to check
 * @param {String} id The identifier for the check
 * @param {Function} callback The function to be invoked when the check succeeds
 */
export default function onceWhenOne(value, id, callback) {
    if (value === 1) {
        if (__onceWhenOne[id] !== false) {
            callback()
            __onceWhenOne[id] = false
        }
    } else {
        __onceWhenOne[id] = true
    }
}
