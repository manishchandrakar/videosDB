"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const ConditionalMain = (props: { children: ReactNode }) => {
  const { children } = props;
  const pathname = usePathname();
  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/mini-admin") ||
    pathname?.startsWith("/videos/")
  ) {
    return <main className="min-h-screen bg-[#0f0f0f]">{children}</main>;
  }
  return <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>;
};

export default ConditionalMain;
