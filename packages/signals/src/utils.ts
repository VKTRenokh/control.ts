import { isNotNullable } from '@control.ts/control';

import { Signal } from './signals';

export function isSignal<T>(value: T | Signal<T>): value is Signal<T> {
  return value instanceof Signal;
}

function hasBrand(value: object) {
  return 'brand' in value && typeof value.brand === 'symbol';
}

/**
 * Determines whether a given value is an external signal from another build.
 *
 * This function is intended for use in scenarios where you have a clear
 * understanding of the value's context and type. It checks if the value is an
 * object, is not null or undefined, and possesses a specific branding property
 * indicating it is an external signal
 */
export function isExternalSignal<T>(value: T | Signal<T>): value is Signal<T> {
  return typeof value === 'object' && isNotNullable(value) && hasBrand(value);
}

export function getValue$<T>(value: T | Signal<T>): T {
  return isSignal(value) ? value.value : value;
}

export type Signalize<T> = T | Signal<T>;
