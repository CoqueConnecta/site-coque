import { useOutletContext } from 'react-router-dom';
import { PageShell } from '../components/ui/PageShell';
import { WaysToHelpSection } from '../components/sections/WaysToHelpSection';
import type { PublicLayoutContextValue } from './PublicLayout';
import { useCmsWaysToHelpData } from '../hooks/useCmsWaysToHelpData';

export default function WaysToHelpPage() {
  const { language } = useOutletContext<PublicLayoutContextValue>();
  const { data, isLoading } = useCmsWaysToHelpData(language);

  if (isLoading) return null;

  return (
    <PageShell>
      <WaysToHelpSection data={data} />
    </PageShell>
  );
}
