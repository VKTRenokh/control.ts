import type { BaseComponent } from '@control.ts/min'

/**
 * @internal
 */
export const noop = () => {}

/** @internal */
export const listenDestroy =
  <T extends BaseComponent>(before: (bc: T) => void | boolean, after?: (bc: T) => void) =>
  (bc: T) => {
    const originalDestroy = bc.destroy.bind(bc)
    bc.destroy = () => {
      before(bc)
      originalDestroy()
      after?.(bc)
    }

    return bc
  }
