let __onceWhenFalse = {}
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