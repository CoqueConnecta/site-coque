import type { Meta, StoryObj } from '@storybook/react-vite';

import { SectionContainer } from './SectionContainer';

const meta: Meta<typeof SectionContainer> = {
  title: 'UI/SectionContainer',
  component: SectionContainer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof SectionContainer>;

const demoBlockClass = 'rounded-[var(--radius-md)] border border-black/10 bg-white p-6';

export const Default: Story = {
  render: () => (
    <SectionContainer>
      <div className={demoBlockClass}>Container default com gutter e espaco vertical.</div>
    </SectionContainer>
  ),
};

export const Widths: Story = {
  render: () => (
    <div className="space-y-4 bg-[color:var(--color-surface-page)]">
      <SectionContainer width="narrow" spacing="sm">
        <div className={demoBlockClass}>Narrow</div>
      </SectionContainer>
      <SectionContainer width="default" spacing="sm">
        <div className={demoBlockClass}>Default</div>
      </SectionContainer>
      <SectionContainer width="wide" spacing="sm">
        <div className={demoBlockClass}>Wide</div>
      </SectionContainer>
    </div>
  ),
};
