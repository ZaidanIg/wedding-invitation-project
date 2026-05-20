import React from 'react';
import { ProjectForm } from '@/components/dashboard/ProjectForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function NewProjectPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link 
          href="/dashboard/projects" 
          className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Projects
        </Link>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Create New Project</h2>
        <p className="text-sm text-zinc-500">
          Set up a new wedding project and generate client credentials instantly.
        </p>
      </div>

      <ProjectForm />
    </div>
  );
}
