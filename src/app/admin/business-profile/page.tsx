'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';
import { 
  Building2, 
  Save, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign, 
  CreditCard 
} from 'lucide-react';

export default function BusinessProfilePage() {
  const [companyName, setCompanyName] = useState('Sahinaja Wedding Corp');
  const [supportPhone, setSupportPhone] = useState('+62 812-3456-7890');
  const [supportEmail, setSupportEmail] = useState('support@sahinaja.com');
  const [address, setAddress] = useState('Mampang Prapatan, Jakarta Selatan, Indonesia');
  
  // Finance targets
  const [targetRevenue, setTargetRevenue] = useState('20000000'); // 20 Juta
  const [bankName, setBankName] = useState('Bank Mandiri');
  const [bankAccount, setBankAccount] = useState('123-45-67890-1');
  const [bankHolder, setBankHolder] = useState('PT Sahinaja Digital Utama');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load configurations from localStorage if they exist
    const savedName = localStorage.getItem('erp_company_name');
    const savedPhone = localStorage.getItem('erp_support_phone');
    const savedEmail = localStorage.getItem('erp_support_email');
    const savedAddress = localStorage.getItem('erp_address');
    const savedTarget = localStorage.getItem('erp_target_revenue');
    const savedBankName = localStorage.getItem('erp_bank_name');
    const savedBankAccount = localStorage.getItem('erp_bank_account');
    const savedBankHolder = localStorage.getItem('erp_bank_holder');

    if (savedName) setCompanyName(savedName);
    if (savedPhone) setSupportPhone(savedPhone);
    if (savedEmail) setSupportEmail(savedEmail);
    if (savedAddress) setAddress(savedAddress);
    if (savedTarget) setTargetRevenue(savedTarget);
    if (savedBankName) setBankName(savedBankName);
    if (savedBankAccount) setBankAccount(savedBankAccount);
    if (savedBankHolder) setBankHolder(savedBankHolder);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      localStorage.setItem('erp_company_name', companyName);
      localStorage.setItem('erp_support_phone', supportPhone);
      localStorage.setItem('erp_support_email', supportEmail);
      localStorage.setItem('erp_address', address);
      localStorage.setItem('erp_target_revenue', targetRevenue);
      localStorage.setItem('erp_bank_name', bankName);
      localStorage.setItem('erp_bank_account', bankAccount);
      localStorage.setItem('erp_bank_holder', bankHolder);

      showToast('success', 'Profil bisnis berhasil diperbarui!');
    } catch {
      showToast('error', 'Gagal menyimpan konfigurasi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-[#1c1c1c]">Profil Bisnis Platform</h1>
        <p className="text-sm text-[#6b6b6b] mt-1">Konfigurasi informasi legalitas perusahaan, rekening pembayaran manual, dan target keuangan platform.</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Identity */}
        <Card className="p-6 bg-white border-[#eceae4] rounded-3xl shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-[#1c1c1c] mb-4 flex items-center gap-2 border-b border-stone-100 pb-2">
            <Building2 className="w-5 h-5 text-rose-500" />
            Identitas Perusahaan (SaaS)
          </h3>
          
          <div className="space-y-3 text-sm">
            <div>
              <label className="block text-xs font-bold text-[#6b6b6b] uppercase tracking-wider mb-1">Nama Perusahaan / Brand</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full h-11 bg-white border border-[#eceae4] rounded-xl px-3 font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6b6b6b] uppercase tracking-wider mb-1">Nomor WhatsApp Support</label>
              <div className="flex items-center gap-2 bg-white border border-[#eceae4] px-3 rounded-xl">
                <Phone className="w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full h-11 bg-transparent border-none outline-none font-semibold text-[#1c1c1c]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6b6b6b] uppercase tracking-wider mb-1">Email Support</label>
              <div className="flex items-center gap-2 bg-white border border-[#eceae4] px-3 rounded-xl">
                <Mail className="w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full h-11 bg-transparent border-none outline-none font-semibold text-[#1c1c1c]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6b6b6b] uppercase tracking-wider mb-1">Alamat Kantor Utama</label>
              <div className="flex items-center gap-2 bg-white border border-[#eceae4] px-3 rounded-xl">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-11 bg-transparent border-none outline-none font-semibold text-[#1c1c1c]"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Finance & Target Settings */}
        <Card className="p-6 bg-white border-[#eceae4] rounded-3xl shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#1c1c1c] mb-4 flex items-center gap-2 border-b border-stone-100 pb-2">
              <DollarSign className="w-5 h-5 text-rose-500" />
              Target Finansial &amp; Rekening Bank
            </h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-bold text-[#6b6b6b] uppercase tracking-wider mb-1">Target Pendapatan Bulanan (Rupiah)</label>
                <input
                  type="number"
                  value={targetRevenue}
                  onChange={(e) => setTargetRevenue(e.target.value)}
                  className="w-full h-11 bg-white border border-[#eceae4] rounded-xl px-3 font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#6b6b6b] uppercase tracking-wider mb-1">Nama Bank</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full h-11 bg-white border border-[#eceae4] rounded-xl px-3 font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6b6b6b] uppercase tracking-wider mb-1">Nomor Rekening</label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full h-11 bg-white border border-[#eceae4] rounded-xl px-3 font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6b6b6b] uppercase tracking-wider mb-1">Nama Pemilik Rekening</label>
                <div className="flex items-center gap-2 bg-white border border-[#eceae4] px-3 rounded-xl">
                  <CreditCard className="w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={bankHolder}
                    onChange={(e) => setBankHolder(e.target.value)}
                    className="w-full h-11 bg-transparent border-none outline-none font-semibold text-[#1c1c1c]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Button
              type="submit"
              disabled={saving}
              className="w-full h-12 rounded-xl bg-[#1c1c1c] text-white font-bold text-sm hover:bg-[#2c2a29] transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Menyimpan...' : 'Simpan Profil Bisnis'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
