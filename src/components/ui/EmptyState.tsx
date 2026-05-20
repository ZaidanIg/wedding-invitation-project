import React from 'react';
import { FileQuestion, Plus } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-zinc-200 rounded-lg bg-zinc-50">
      <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
        <FileQuestion className="h-6 w-6 text-zinc-400" />
      </div>
      <h3 className="text-lg font-medium text-zinc-900 mb-1">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-sm mb-6">{description}</p>
      
      {actionLabel && actionHref && (
        <Link 
          href={actionHref}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-800 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
