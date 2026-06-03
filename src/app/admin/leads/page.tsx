import React from 'react';
import Card from '@/components/ui/Card';

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-[#1c1c1c] capitalize">{`$dir`.replace('-', ' ')}</h1>
        <p className="text-sm text-[#6b6b6b] mt-1">Module is under construction.</p>
      </div>
      <Card className="p-6 bg-white border-[#eceae4] rounded-3xl shadow-sm">
        <div className="flex items-center justify-center h-64 text-[#6b6b6b] font-medium">
          Coming Soon
        </div>
      </Card>
    </div>
  );
}
