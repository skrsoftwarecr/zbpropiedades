'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Breadcrumb {
  label: string;
  href: string;
  isCurrent?: boolean;
}

export function Breadcrumbs({ crumbs }: { crumbs: Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm">
        {crumbs.map((crumb, index) => (
          <li key={index}>
            <div className="flex items-center">
              <Link
                href={crumb.href}
                className={
                  crumb.isCurrent
                    ? 'font-medium text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }
              >
                {crumb.label}
              </Link>
              {index < crumbs.length - 1 ? (
                <ChevronRight className="flex-shrink-0 h-4 w-4 text-muted-foreground mx-2" />
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
