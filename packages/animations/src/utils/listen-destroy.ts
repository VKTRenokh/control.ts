import type { BaseComponent as BaseComponentMin } from '@control.ts/min'
import type { BaseComponent as BaseComponent$ } from '@control.ts/signals'

type BaseComponent = BaseComponentMin | BaseComponent$

/** @internal */
export const noop = () => {}

/** @internal */
export type DestroyListener<T = BaseComponent> = (bc: T, destroy: () => void) => void | boolean

const addListener =
  <T extends BaseComponent>(node: T, listener: DestroyListener<T>, originalFn: () => void) =>
  () => {
    if (listener(node, originalFn)) {
      return
    }
    originalFn()
  }

const replaceDestroy = <T extends BaseComponent>(bc: T, listener: DestroyListener<T>) => {
  const originalDestroy = bc.destroy.bind(bc)

  bc.destroy = addListener(bc, listener, originalDestroy)

  return () => (bc.destroy = originalDestroy)
}

/** @internal */
export const listenDestroy =
  <T extends BaseComponent = BaseComponent>(listener: DestroyListener<T>) =>
  (node: T) =>
    replaceDestroy(node, listener)

/** @internal */
export const listenDestroyUncurried = <T extends BaseComponent>(node: T, listener: DestroyListener<T>) => {
  replaceDestroy(node, listener)
}
