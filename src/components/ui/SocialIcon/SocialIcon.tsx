import type { SVGAttributes } from 'react';

export type SocialIconType = 'instagram' | 'globe' | 'twitter' | 'youtube';

export interface SocialIconProps extends SVGAttributes<SVGSVGElement> {
  type: SocialIconType;
  label?: string;
}

export function SocialIcon({ type, label, ...props }: SocialIconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label={label || type}
      {...props}
    >
      {type === 'instagram' && (
        <>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
          <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
        </>
      )}
      
      {type === 'globe' && (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </>
      )}
      
      {type === 'twitter' && (
        <>
          <path d="M4 4l16 16M20 4L4 20" strokeWidth="2" />
        </>
      )}
      
      {type === 'youtube' && (
        <>
          <path d="M10 8v8l5.5-4-5.5-4z" fill="currentColor" />
          <rect x="2" y="3" width="20" height="18" rx="2.18" ry="2.18" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
}
