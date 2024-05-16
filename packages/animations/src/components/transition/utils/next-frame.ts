export const nextFrame = (cb: (time: number) => void) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb)
  })
}
