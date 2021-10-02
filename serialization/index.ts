export const replacer = (key, value) => {
    if (value instanceof Map) {
        return {
            dataType: 'Map',
            value: [...value],
        }
    } else {
        return value
    }
}
export const reviver = (key, value) => {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value)
        }
    }
    return value
}
