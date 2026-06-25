import { useState } from 'react';

export function useDisclosure(defaultOpen = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return { isOpen, toggle: () => setIsOpen((v) => !v) };
}
