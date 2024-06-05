import './animation.css';

import type { TransitionProps } from '@control.ts/animations';
import { Transition } from '@control.ts/animations';
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

  console.log(isSignal(div), 'from storybook', div);

  return new BaseComponent(
    { tag: 'div' },
    Transition({}, div) as unknown as BaseComponent,
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
