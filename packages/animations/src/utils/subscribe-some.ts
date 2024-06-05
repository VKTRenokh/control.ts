import { isNotNullable } from '@control.ts/control'
import type { Signal } from '@control.ts/signals'

/**
 * Subscribes to a signal and invokes the subscriber callback only if the signal's value is not `null` or `undefined`.
 *
 * This function is useful when working with signals that may emit nullable values,
 * ensuring that the subscriber is only called with non-nullable values.
 * @internal
 */
export const subscribeSome = <T>(signal: Signal<T>, subscriber: (value: NonNullable<T>) => void) =>
  signal.subscribe((value) => {
    if (!isNotNullable(value)) {
      return
    }
    subscriber(value)
  })
