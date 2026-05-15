import { Suspense } from 'react';
import ResetPasswordClient from './ResetPasswordClient.tsx';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}