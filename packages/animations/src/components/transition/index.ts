import type { BaseComponentChild } from '@control.ts/min'
import type { BaseComponent } from '@control.ts/min'

import { listenDestroy } from ':)/utils/listen-destroy'

import { nextFrame } from './utils/next-frame'

export interface TransitionProps {
  name?: string
}

const formatTransitionName = (name?: string) => (name ? `-${name}` : '')

const formatClassName = (name?: string) => (stage: string) => `ct-tr${formatTransitionName(name)}-${stage}`

export type LazyBaseComponentChild = () => BaseComponentChild

const scheduleClassNameRemoval = (node: BaseComponent, className: string) => nextFrame(node.addClass(className))

export const Transition = (props: TransitionProps, ...children: BaseComponent[]) => {
  const format = formatClassName(props.name)

  return children.map(
    listenDestroy((node) => {
      const deactivate = node.addClass(format('leave-active'))

      scheduleClassNameRemoval(node, format('leave-from'))

      node.on('transitionend', () => {
        deactivate()
      })

      return true
    }),
  )
}
