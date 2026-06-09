'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';

interface CheckoutButtonProps {
  plan: 'BASIC' | 'PREMIUM' | 'ULTIMATE' | 'PRO_PLAN' | 'ENTERPRISE';
  invitationId?: string;
  className?: string;
  children: React.ReactNode;
}

export default function CheckoutButton({ plan, invitationId, className, children }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const _router = useRouter();

  const handleCheckout = async () => {
    const planNames: Record<string, string> = {
      BASIC: 'Minimalist Plan',
      PREMIUM: 'Premium Plan',
      ULTIMATE: 'Ultimate Plan',
      PRO_PLAN: 'Paket Pro (Bulanan)',
      ENTERPRISE: 'Enterprise (Seumur Hidup)'
    };
    const planName = planNames[plan] || plan;
    const confirmed = window.confirm(`Apakah benar Anda akan membeli item ${planName} ini?`);
    if (!confirmed) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, invitationId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Checkout failed');
      }

      if (data.success && data.data.redirect_url) {
        // Redirect to Midtrans payment page
        window.location.href = data.data.redirect_url;
      }
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      className={className} 
      onClick={handleCheckout} 
      isLoading={isLoading}
      disabled={isLoading}
    >
      {children}
    </Button>
  );
}
