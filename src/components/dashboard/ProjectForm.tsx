"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createAgencyProject } from '@/actions/project';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  brideName: z.string().min(1, "Bride name is required"),
  groomName: z.string().min(1, "Groom name is required"),
  eventDate: z.string().min(1, "Event date is required"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-z0-9]+$/, "Username must be lowercase alphanumeric only"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export function ProjectForm() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brideName: '',
      groomName: '',
      eventDate: '',
      username: '',
      password: '',
    }
  });

  const onSubmit = async (data: FormValues) => {
    setErrorMsg(null);
    try {
      const res = await createAgencyProject(data);
      if (res.success) {
        router.push('/dashboard/projects');
        router.refresh();
      } else {
        setErrorMsg(res.message || res.error || "An error occurred");
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-white p-6 md:p-8 rounded-lg shadow-sm border border-zinc-200">
      
      {errorMsg && (
        <div className="p-4 rounded-md bg-rose-50 text-rose-700 text-sm font-medium border border-rose-200">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-900">Groom's Name</label>
          <input
            {...register('groomName')}
            className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
            placeholder="Nama Mempelai Pria"
          />
          {errors.groomName && <p className="text-xs text-rose-500">{errors.groomName.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-900">Bride's Name</label>
          <input
            {...register('brideName')}
            className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
            placeholder="Nama Mempelai Wanita"
          />
          {errors.brideName && <p className="text-xs text-rose-500">{errors.brideName.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-900">Event Date</label>
        <input
          type="date"
          {...register('eventDate')}
          className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
        />
        {errors.eventDate && <p className="text-xs text-rose-500">{errors.eventDate.message}</p>}
      </div>

      <div className="pt-6 border-t border-zinc-200">
        <h3 className="text-lg font-medium text-zinc-900 mb-4">Client Access Credentials</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900">Username</label>
            <input
              {...register('username')}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
              placeholder="username akun klien"
            />
            {errors.username && <p className="text-xs text-rose-500">{errors.username.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900">Password</label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-rose-500">{errors.password.message}</p>}
          </div>
        </div>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row sm:justify-end gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 sm:py-2.5 text-sm font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Create Project
        </button>
      </div>
    </form>
  );
}
