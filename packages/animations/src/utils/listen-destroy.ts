import type { BaseComponent } from '@control.ts/min'

/** @internal */
export const noop = () => {}

/** @internal */
export type BeforeDestroyFn<T extends BaseComponent = BaseComponent> = (bc: T, destroy: () => void) => void | boolean
export type AfterDestroyFn<T extends BaseComponent = BaseComponent> = (bc: T) => void

/** @internal */
export const listenDestroy = <T extends BaseComponent = BaseComponent>(
  before: BeforeDestroyFn<T>,
  after?: AfterDestroyFn<T>,
) => {
  return (bc: T) => {
    const originalDestroy = bc.destroy.bind(bc)

    bc.destroy = () => {
      if (before(bc, originalDestroy)) {
        return
      }
      originalDestroy()
      after?.(bc)
    }

    return bc
  }
}
