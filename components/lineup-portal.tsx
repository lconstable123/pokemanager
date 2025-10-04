import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type PortalProps = {
  children: React.ReactNode;
};

export default function Portal({ children }: PortalProps) {
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const node = document.getElementById("portal"); // <-- your layout id
    setPortalNode(node);
  }, []);

  if (!portalNode) return null; // wait until mounted

  return createPortal(children, portalNode);
}
