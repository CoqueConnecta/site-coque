import { PageShell } from '../components/ui/PageShell';
import { TransparencySection } from '../components/sections/TransparencySection';
import { useOutletContext } from 'react-router-dom';
import type { PublicLayoutContextValue } from './PublicLayout';
import { useCmsTransparencyData } from '../hooks/useCmsTransparencyData';

export default function TransparencyPage() {
  const { language } = useOutletContext<PublicLayoutContextValue>();
  const { data: transparency, isLoading } = useCmsTransparencyData(language);

  if (isLoading) return null;

  return (
    <PageShell className="max-w-4xl">
      <TransparencySection data={transparency} />
    </PageShell>
  );
}
