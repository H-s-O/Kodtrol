let __onceWhenTrue = {}
export default function onceWhenTrue(value, id, callback) {
    if (value === true) {
        if (__onceWhenTrue[id] !== false) {
            callback()
            __onceWhenTrue[id] = false
        }
    } else {
        __onceWhenTrue[id] = true
    }
}