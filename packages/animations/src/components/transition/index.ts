import type { BaseComponentChild } from '@control.ts/min'
import type { BaseComponent } from '@control.ts/min'

import { listenDestroy } from ':)/utils/listen-destroy'

import { nextFrame } from './utils/next-frame'

export interface TransitionProps {
  name?: string
}

type ClassNameFormatter = (stage: string) => string

interface ClassNameFormatters {
  leave: ClassNameFormatter
  enter: ClassNameFormatter
}
const formatTransitionName = (name?: string) => (name ? `-${name}` : '')

const formatClassName = (name?: string) => ({
  leave: (stage: string) => `ct${formatTransitionName(name)}-leave-${stage}`,
  enter: (stage: string) => `ct${formatTransitionName(name)}-enter-${stage}`,
})

export type LazyBaseComponentChild = () => BaseComponentChild

const createDestrucitonListener = (format: ClassNameFormatters) => (node: BaseComponent) => {
  const deactivate = node.addClass(format.leave('active'))

  node.once('transitionstart', () => {
    nextFrame(node.addClass(format.leave('from')))
  })

  node.once('transitionend', () => {
    deactivate()

    const removeTo = node.addClass(format.leave('to'))

    nextFrame(() => {
      removeTo()
      node.destroy()
    })
  })

  return true
}

export const Transition = (props: TransitionProps, ...children: BaseComponent[]) => {
  return children.map(listenDestroy(createDestrucitonListener(formatClassName(props.name))))
}
