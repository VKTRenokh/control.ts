import { type BaseComponent, isExternalSignal, type Signal } from '@control.ts/signals'

import { type DestroyListener, listenDestroy } from ':)/utils/listen-destroy'
import { subscribeSome } from ':)/utils/subscribe-some'

import { nextFrame } from './utils/next-frame'
import { whenTransitionEnds } from './utils/when-transition-ends'

/**
 * Props for `Transition` component wrapper
 *
 * @see {@link Transition}
 */
export interface TransitionProps {
  /**
   * Specifies transition name. Default is `ct`
   */
  name?: string

  /**
   * Specifies whether the transition should work on component destroy.
   */
  onDestroy?: boolean

  /**
   * Specifies whether the transition should work when component changes.
   */
  onChange?: boolean
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
    console.log('createDestructionListener')

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

const onCreate = (format: ClassNameFormatters, bc: BaseComponent) => {
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

  onCreate(formatters, bc)

  listenDestroy(bc, createDestrucitonListener(formatters))
}

/**
 * Elementes that can be transitioned using `Transition`
 * @see {@link Transition}
 */
export type Transitiable<T extends HTMLElement = HTMLElement> = Signal<BaseComponent<T> | null> | BaseComponent<T>

/**
 * Transition component wrapper. Used for easier animation on component destroy/create
 *
 * Animation States
 * - `${name}`-leave-active
 * - `${name}`-leave-from
 * - `${name}`-leave-to
 *
 * - `${name}`-enter-active
 * - `${name}`-enter-from
 * - `${name}`-enter-to
 *
 * @example Appear and disappear animation
 *
 * import {Transition} from "@control.ts/animations"
 *
 * Transition({name: 'my-custom-transition-name'}, new BaseComponent({tag: 'div', txt: "I'm animated!"}))
 *
 * // add this somewhere in css:
 *
 * .my-custom-transition-name-leave-active,
 * .my-custom-transition-name-enter-active {
 *   transition: 0.5s ease;
 * }
 *
 * .my-custom-transition-name-leave-from,
 * .my-custom-transition-name-enter-to {
 *   opacity: 1
 * }
 *
 * .my-custom-transition-name-leave-to,
 * .my-custom-transition-name-enter-from {
 *   opacity: 0
 * }
 */
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
