import type { BaseComponent } from '@control.ts/signals'

/** @internal */
export type DestroyListener<T = BaseComponent> = (bc: T, destroy: () => void) => void | boolean

const addListener =
  <T extends BaseComponent>(bc: T, listener: DestroyListener<T>, originalFn: () => void) =>
  () => {
    if (listener(bc, originalFn)) {
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
export const listenDestroy = <T extends BaseComponent>(bc: T, listener: DestroyListener<T>) =>
  replaceDestroy(bc, listener)
