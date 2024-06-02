import type { BaseComponent } from ':)/types'

export const whenTransitionEnds = (bc: BaseComponent, fn: (event: Event) => void): void => {
  bc.once('transitionend', fn)
}
