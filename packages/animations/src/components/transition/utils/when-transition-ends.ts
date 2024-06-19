import type { BaseComponent } from '@control.ts/signals'

export const whenTransitionEnds = (bc: BaseComponent, fn: (event: Event) => void): void => {
  bc.once('transitionend', fn)
}
