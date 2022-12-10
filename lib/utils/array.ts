export const arrayWrap = <T>(val: T | T[]) => (Array.isArray(val) ? [...val] : [val])
