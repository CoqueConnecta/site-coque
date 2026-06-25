import { PageShell } from '../components/ui/PageShell';
import { PrivacySection } from '../components/sections/PrivacySection';
import { useOutletContext } from 'react-router-dom';
import type { PublicLayoutContextValue } from './PublicLayout';
import { useCmsPrivacyData } from '../hooks/useCmsPrivacyData';

export default function PrivacyPage() {
  const { language } = useOutletContext<PublicLayoutContextValue>();
  const { data: privacy, isLoading } = useCmsPrivacyData(language);

  if (isLoading) return null;

  return (
    <PageShell className="max-w-4xl">
      <PrivacySection data={privacy} />
    </PageShell>
  );
}
