import { Block } from '../components/ui/Block';
import { Typography } from '../components/ui/Typography';
import { useOutletContext } from 'react-router-dom';
import type { PublicLayoutContextValue } from './PublicLayout';

export default function TransparencyPage() {
  const { content } = useOutletContext<PublicLayoutContextValue>();
  const transparency = content.transparency;

  return (
    <main className="min-h-screen bg-[#fafafa] pb-24 pt-32">
      <Block className="max-w-4xl">
        <div className="mb-12 border-b border-gray-200 pb-8">
          <Typography variant="h1" className="mb-4 text-[#411409]">
            {transparency.title}
          </Typography>
          <Typography variant="body" className="text-lg text-gray-600">
            {transparency.intro}
          </Typography>
        </div>

        <div className="space-y-6 text-[#101014]">
          {transparency.body.map((paragraph, index) => (
            <Typography key={index} variant="body" className="leading-relaxed">
              {paragraph}
            </Typography>
          ))}
        </div>
      </Block>
    </main>
  );
}
