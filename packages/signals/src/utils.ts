import { isNotNullable } from '@control.ts/control';

import { Signal } from './signals';

export function isSignal<T>(value: T | Signal<T>): value is Signal<T> {
  return value instanceof Signal;
}

function hasAllClassMethods<I, T extends { new (...a: readonly unknown[]): I }>(object: object, clazz: T): boolean {
  const classMethods = Object.getOwnPropertyNames(clazz.prototype).filter(
    (prop) => typeof clazz.prototype[prop] === 'function' && prop !== 'constructor',
  );

  // eslint-disable-next-line
  return classMethods.every((method) => method in object && typeof (object as any)[method] === 'function');
}

export function isExternalSignal<T>(value: T | Signal<T>): value is Signal<T> {
  return typeof value === 'object' && isNotNullable(value) && hasAllClassMethods(value, Signal);
}

export function getValue$<T>(value: T | Signal<T>): T {
  return isSignal(value) ? value.value : value;
}

export type Signalize<T> = T | Signal<T>;
