import type { BaseComponent as BaseComponentMin } from '@control.ts/min'
import type { BaseComponent as BaseComponent$ } from '@control.ts/signals'

/**
 * Any BaseComponent
 */
export type BaseComponent<T extends HTMLElement = HTMLElement> = BaseComponentMin<T> | BaseComponent$<T>
