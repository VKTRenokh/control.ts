import type { Signal } from '@control.ts/signals'

const isNonNullable = <T>(value: T): value is NonNullable<T> => value !== null && value !== undefined

/** @internal */
export const optionSubscribe = <T>(signal: Signal<T>, subscriber: (value: NonNullable<T>) => void) =>
  signal.subscribe((value) => isNonNullable(value) && subscriber(value))
