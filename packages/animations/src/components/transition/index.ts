import { type BaseComponent, isSignal, type Signal } from '@control.ts/signals'

import { type DestroyListener, listenDestroyUncurried } from ':)/utils/listen-destroy'

import { nextFrame } from './utils/next-frame'

export interface TransitionProps {
  name?: string
}

type ClassNameFormatter = (stage: string) => string

interface ClassNameFormatters {
  leave: ClassNameFormatter
  enter: ClassNameFormatter
}

const formatTransitionName = (name?: string) => (name ? name : 'ct')

const formatClassName = (name?: string) => {
  const transitionName = formatTransitionName(name)

  return {
    leave: (stage: string) => `${transitionName}-leave-${stage}`,
    enter: (stage: string) => `${transitionName}-enter-${stage}`,
  }
}

const createDestrucitonListener =
  (format: ClassNameFormatters): DestroyListener =>
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

type Transitiable = Array<BaseComponent | Signal<BaseComponent>>

const transitionLogic = (props: TransitionProps, bc: BaseComponent) => {
  listenDestroyUncurried(bc, createDestrucitonListener(formatClassName(props.name)))
}

export const Transition = (props: TransitionProps, ...bc: Transitiable) => {
  return bc.map((bc) => {
    if (isSignal(bc)) {
      return bc.subscribe((bc) => transitionLogic(props, bc))
    }
    transitionLogic(props, bc)
  })
}
