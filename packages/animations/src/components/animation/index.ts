import type { BaseComponentChild } from '@control.ts/min'

/** @internal */
export interface AnimationProps {
  /** Animation Name that should be used to find css classes. */
  name?: string
}

export const state = () => {}

export const Animation = (props: AnimationProps, ...children: BaseComponentChild[]) => {
  console.log(props, children)
}
