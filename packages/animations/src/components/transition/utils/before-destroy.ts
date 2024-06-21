import type { ControlEvent } from '@control.ts/control'
import type { BaseComponent } from '@control.ts/signals'

export const beforeDestroy = (bc: BaseComponent, listener: (event: ControlEvent) => void) => {
  bc.events.once('beforeDestory', (event) => {
    listener(event)
  })
}
