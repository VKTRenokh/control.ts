import './animation.css';

import { Transition, type TransitionProps } from '@control.ts/animations';
import { $ as reactive, $$ as computed, BaseComponent, button, effect } from '@control.ts/signals';
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

  effect(() => {
    console.log(shouldShow.value);
    console.log(div.value);
  });

  return new BaseComponent(
    { tag: 'div' },
    ...Transition({}, div),
    button({
      onclick: () => (shouldShow.value = !shouldShow.value),
      txt: 'toggle',
    }),
  );
};
export const Toggle: Story = {
  args: {
    component: createToggle(),
  },
};

export default meta;
