import type { Meta, StoryObj } from '@storybook/react-vite';

function FoundationsPreview() {
  return (
    <div className="container-max section-space" style={{ fontFamily: 'var(--font-body)' }}>
      <h1 style={{ margin: 0, color: 'var(--color-text-primary)' }}>Foundations</h1>
      <p style={{ color: 'var(--color-text-secondary)' }}>
        Phase 1 base styles loaded with tokens and typography.
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <span style={{ background: 'var(--color-surface-accent)', color: '#fff', padding: '8px 14px', borderRadius: 'var(--radius-pill)' }}>
          Accent
        </span>
        <span style={{ background: 'var(--color-tag-bg)', color: 'var(--color-tag-text)', padding: '8px 14px', borderRadius: 'var(--radius-pill)' }}>
          Tag
        </span>
        <span style={{ background: 'var(--color-surface-card)', color: 'var(--color-text-primary)', padding: '8px 14px', borderRadius: 'var(--radius-pill)' }}>
          Surface
        </span>
      </div>
    </div>
  );
}

const meta: Meta<typeof FoundationsPreview> = {
  title: 'Foundations/Theme',
  component: FoundationsPreview,
};

export default meta;

type Story = StoryObj<typeof FoundationsPreview>;

export const Default: Story = {};
