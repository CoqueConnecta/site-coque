import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NewsletterSection } from './NewsletterSection';
import { subscribeToNewsletter } from '../../../services/newsletterService';
import type { ResolvedNewsletterData } from '../../../types/cms';

vi.mock('../../../services/newsletterService', () => ({
  subscribeToNewsletter: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn() },
}));

const data: ResolvedNewsletterData = {
  headlineAccent: '',
  headline: 'Junte-se a nós',
  description: 'Faça parte da comunidade.',
  buttonText: 'RECEBER',
  placeholderEmail: 'Seu melhor e-mail',
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('NewsletterSection', () => {
  it('does not call the newsletter service when consent is missing', () => {
    const { container } = render(<NewsletterSection data={data} />);
    fireEvent.submit(container.querySelector('form')!);
    expect(subscribeToNewsletter).not.toHaveBeenCalled();
  });

  it('submits the form data and shows the success state', async () => {
    vi.mocked(subscribeToNewsletter).mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<NewsletterSection data={data} />);

    await user.type(screen.getByLabelText('Nome'), 'Ana');
    await user.type(screen.getByLabelText('Sobrenome'), 'Silva');
    await user.type(screen.getByLabelText('E-mail'), 'ana@example.com');
    await user.selectOptions(screen.getByLabelText('Tipo de participante'), 'donor');
    await user.click(screen.getByRole('checkbox'));

    await user.click(screen.getByRole('button', { name: 'RECEBER' }));

    await waitFor(() => {
      expect(subscribeToNewsletter).toHaveBeenCalledWith({
        firstName: 'Ana',
        lastName: 'Silva',
        email: 'ana@example.com',
        type: 'donor',
      });
    });

    expect(await screen.findByText('Inscrição confirmada!')).toBeInTheDocument();
  });
});
