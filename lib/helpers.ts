export function prevent(evt: Event) {
  evt.cancelable !== false && evt.preventDefault()
}

export const stop = (evt: Event) => {
  evt.cancelable !== false && evt.preventDefault()
  evt.stopPropagation()
}
