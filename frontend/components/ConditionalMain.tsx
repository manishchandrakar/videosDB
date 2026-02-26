"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const ConditionalMain = (props: { children: ReactNode }) => {
  const { children } = props;
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/mini-admin")) {
    return <>{children}</>;
  }
  return <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>;
};

export default ConditionalMain;
