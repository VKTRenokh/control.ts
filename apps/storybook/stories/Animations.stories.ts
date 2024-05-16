import type { TransitionProps } from '@control.ts/animations';
import { Transition } from '@control.ts/animations';
import { BaseComponent } from '@control.ts/min';
import type { Meta, StoryObj } from '@storybook/html';

type AnimationStoryProps = TransitionProps & { component: BaseComponent };

type Story = StoryObj<AnimationStoryProps>;

const meta: Meta<AnimationStoryProps> = {
  title: 'example/Animation',
  tags: ['autodocs'],
  render: (args) => {
    const transitioned = Transition({}, args.component);

    setTimeout(() => transitioned[0]?.destroy(), 500);

    new MutationObserver((mutations) => {
      mutations.forEach(console.log);
    }).observe(document.body, { attributes: true });

    return transitioned[0]!.node;
  },
};

export const Toggle: Story = {
  args: {
    component: new BaseComponent({ tag: 'div', txt: 'hello' }),
  },
};

export default meta;
