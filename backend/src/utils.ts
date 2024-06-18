export function removeExtraSpaces(text: string) {
    let value = text.replace(/\s\s+/g, ' ')
    if (value.startsWith(' ')) {
        value = value.substring(1);
    }
    return value
}