import { ReactNode, useMemo } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children?: ReactNode;
  elementId: string;
}

export function Portal({ children, elementId }: PortalProps) {
  const rootElement = useMemo(
    () => document.getElementById(elementId),
    [elementId],
  );

  if (rootElement === null) return <></>;

  return createPortal(children, rootElement);
}
