'use client';

import { FOOTER_LINKS } from '@/types/constant';
import Link from 'next/link';
import { usePathname } from 'next/navigation';



const Footer = () => {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/mini-admin')) return null;

  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col items-center gap-5">
          <Link href="/" className="text-lg font-bold text-foreground tracking-tight">
            VideoHub
          </Link>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {FOOTER_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} VideoHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
