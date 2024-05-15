import type { BaseComponentChild } from '@control.ts/min'
import type { BaseComponent } from '@control.ts/min'

import { listenDestroy } from ':)/utils/listen-destroy'

export interface TransitionProps {
  name?: string
}

const formatTransitionName = (name?: string) => (name ? `-${name}` : '')

const formatClassName = (name?: string) => (stage: string) => `ct-tr-${formatTransitionName(name)}-${stage}`

export type LazyBaseComponentChild = () => BaseComponentChild

export const Transition = (props: TransitionProps, ...children: BaseComponent[]) => {
  const format = formatClassName(props.name)

  return children.map(
    listenDestroy((node) => {
      const removeFrom = node.addClass(format('from'))
      requestAnimationFrame(removeFrom)

      return true
    }),
  )
}
