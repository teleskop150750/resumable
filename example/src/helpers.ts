export const configureDrop = (drop: HTMLDivElement) => {
  ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
    drop.addEventListener(eventName, preventDefaults, false)
  })
  ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName: string) => {
    drop.addEventListener(eventName, () => drop.classList.add('drop--dragover'))
  })
  ;['dragleave', 'drop'].forEach((eventName) => {
    drop.addEventListener(eventName, () => drop.classList.remove('drop--dragover'))
  })
}

function preventDefaults(e: Event) {
  e.preventDefault()
  e.stopPropagation()
}

export function hide(el: HTMLElement) {
  el.style.display = 'none'
}

export function show(el: HTMLElement) {
  el.style.display = 'block'
}
