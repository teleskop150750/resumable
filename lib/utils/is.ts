export const isFunction = <T extends Function>(val: any): val is T => typeof val === 'function'
