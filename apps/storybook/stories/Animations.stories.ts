import type { TransitionProps } from '@control.ts/animations';
import { Transition } from '@control.ts/animations';
import { BaseComponent } from '@control.ts/min';
import type { Meta, StoryObj } from '@storybook/html';

type Story = StoryObj<TransitionProps>;

const meta: Meta<TransitionProps> = {
  title: 'example/Animation',
  tags: ['autodocs'],
  render: (args) => {
    args;
    const element = new BaseComponent({ tag: 'div' });
    const shitToRender = Transition({}, element);

    element.destroy();
    return shitToRender[0].node;
  },
  argTypes: {},
};

export const Toggle: Story = {};

export default meta;
