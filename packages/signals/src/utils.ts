import { isNotNullable } from '@control.ts/control';

import { Signal } from './signals';

export function isSignal<T>(value: T | Signal<T>): value is Signal<T> {
  return value instanceof Signal;
}

function hasBrand(value: object) {
  return 'brand' in value && typeof value.brand === 'symbol';
}

export function isExternalSignal<T>(value: T | Signal<T>): value is Signal<T> {
  return typeof value === 'object' && isNotNullable(value) && hasBrand(value);
}

export function getValue$<T>(value: T | Signal<T>): T {
  return isSignal(value) ? value.value : value;
}

export type Signalize<T> = T | Signal<T>;
