import { redirect } from 'next/navigation';

// Redirect permanently to the consolidated legal page (Privacy section)
export default function PrivacyPage() {
  redirect('/terms#privacy');
}
