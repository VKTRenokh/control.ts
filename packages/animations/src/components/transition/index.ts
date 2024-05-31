import type { BaseComponent as BaseComponentMin } from '@control.ts/min'
import { type BaseComponent as BaseComponent$, isSignal, type Signal } from '@control.ts/signals'

type BaseComponent = BaseComponent$ | BaseComponentMin

import { type DestroyListener, listenDestroyUncurried } from ':)/utils/listen-destroy'
import { subscribeSome } from ':)/utils/subscribe-some'

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
  (bc, destroy) => {
    const deactivate = bc.addClass(format.leave('active'))
    const toClassName = format.leave('to')

    const removeFrom = bc.addClass(format.leave('from'))

    nextFrame(() => {
      removeFrom()
      bc.addClass(toClassName)
    })

    bc.once('transitionend', () => {
      deactivate()

      nextFrame(() => {
        bc.removeClass(toClassName)
        destroy()
      })
    })
    return true
  }

const createCreationListener = (format: ClassNameFormatters) => (bc: BaseComponent) => {
  const removeActive = bc.addClass(format.enter('active'))
  const removeFrom = bc.addClass(format.enter('from'))

  nextFrame(() => {
    removeFrom()
  })
}

type Transitiable = BaseComponent | Signal<BaseComponent | null>

const transitionLogic = (props: TransitionProps, bc: BaseComponent) => {
  listenDestroyUncurried(bc, createDestrucitonListener(formatClassName(props.name)))
}

export const Transition = <T extends Array<Transitiable>>(props: TransitionProps, ...bc: T) => {
  return bc.map((bc) => {
    if (isSignal(bc)) {
      subscribeSome(bc, (bc) => transitionLogic(props, bc))

      return bc
    }
    transitionLogic(props, bc)
    return bc
  })
}
