import { type BaseComponent, isExternalSignal, type Signal } from '@control.ts/signals'

import { type DestroyListener, listenDestroyUncurried } from ':)/utils/listen-destroy'
import { subscribeSome } from ':)/utils/subscribe-some'

import { nextFrame } from './utils/next-frame'
import { whenTransitionEnds } from './utils/when-transition-ends'

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

    whenTransitionEnds(bc, () => {
      deactivate()

      nextFrame(() => {
        bc.removeClass(toClassName)
        destroy()
      })
    })

    return true
  }

const createCreationListener = (format: ClassNameFormatters) => (bc: BaseComponent) => {
  const deactivate = bc.addClass(format.enter('active'))
  const removeFrom = bc.addClass(format.enter('from'))
  const toClassName = format.enter('to')

  nextFrame(() => {
    removeFrom()
    bc.addClass(toClassName)
  })

  whenTransitionEnds(bc, () => {
    deactivate()

    nextFrame(() => {
      bc.removeClass(toClassName)
    })
  })
}

const transitionLogic = (props: TransitionProps, bc: BaseComponent) => {
  const formatters = formatClassName(props.name)

  createCreationListener(formatters)(bc)
  listenDestroyUncurried(bc, createDestrucitonListener(formatters))
  console.log(bc)
}

export type Transitiable<T extends HTMLElement = HTMLElement> = Signal<BaseComponent<T> | null> | BaseComponent<T>

export const Transition = (props: TransitionProps, ...components: Transitiable[]) => {
  return components.map((component) => {
    if (isExternalSignal(component)) {
      subscribeSome(component, (bc) => transitionLogic(props, bc))

      return component
    }
    transitionLogic(props, component)

    return component
  })
}
