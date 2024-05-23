import type { BaseComponent } from '@control.ts/min'

import { type BeforeDestroyFn, listenDestroy } from ':)/utils/listen-destroy'

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

const formatClassName = (name?: string) => {
  const transitionName = formatTransitionName(name)

  return {
    leave: (stage: string) => `ct${transitionName}-leave-${stage}`,
    enter: (stage: string) => `ct${transitionName}-enter-${stage}`,
  }
}

const createDestrucitonListener =
  (format: ClassNameFormatters): BeforeDestroyFn =>
  (node, destroy) => {
    const deactivate = node.addClass(format.leave('active'))
    const toClassName = format.leave('to')

    const removeFrom = node.addClass(format.leave('from'))

    nextFrame(() => {
      removeFrom()
      node.addClass(toClassName)
    })

    node.once('transitionend', () => {
      deactivate()

      nextFrame(() => {
        node.removeClass(toClassName)
        destroy()
      })
    })
    return true
  }

/**
 * Transitin wrapper
 */
export const Transition = (props: TransitionProps, ...children: BaseComponent[]) => {
  return children.map(listenDestroy(createDestrucitonListener(formatClassName(props.name))))
}
