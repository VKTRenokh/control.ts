import type { BaseComponentChild } from '@control.ts/min'
import type { BaseComponent } from '@control.ts/min'

import { listenDestroy } from ':)/utils/listen-destroy'

export interface TransitionProps {
  name?: string
}

export type LazyBaseComponentChild = () => BaseComponentChild

export const Transition = (props: TransitionProps, ...children: BaseComponent[]) => {
  console.log(props)
  return children.map(
    listenDestroy((node) => {
      const removeFrom = node.addClass('control-leave-from')
      requestAnimationFrame(removeFrom)

      return true
    }),
  )
}
