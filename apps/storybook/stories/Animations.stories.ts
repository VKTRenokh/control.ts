import './animation.css';

import { Transition, type TransitionProps, test } from '@control.ts/animations';
import { $ as reactive, $$ as computed, BaseComponent, button, isSignal } from '@control.ts/signals';
import type { Meta, StoryObj } from '@storybook/html';

type AnimationStoryProps = TransitionProps & { component: BaseComponent };

type Story = StoryObj<AnimationStoryProps>;

const meta: Meta<AnimationStoryProps> = {
  title: 'example/Animation',
  tags: ['autodocs'],
  render: (args) => {
    return args.component.node;
  },
};

const createToggle = () => {
  const shouldShow = reactive(true);
  const div = computed(() => (shouldShow.value ? new BaseComponent({ tag: 'div', txt: 'hello' }) : null));
  console.log(Reflect.getPrototypeOf(div), isSignal(div), isSignal(Reflect.getPrototypeOf(div)));

  return new BaseComponent(
    { tag: 'div' },
    Transition({}, div),
    button({
      onclick: () => (shouldShow.value = !shouldShow.value),
    }),
  );
};
export const Toggle: Story = {
  args: {
    component: createToggle(),
  },
};

export default meta;
