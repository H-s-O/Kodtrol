let __onceWhenZero = {}
export default function onceWhenZero(value, id, callback) {
    if (value === 0) {
        if (__onceWhenZero[id] !== false) {
            callback()
            __onceWhenZero[id] = false
        }
    } else {
        __onceWhenZero[id] = true
    }
}