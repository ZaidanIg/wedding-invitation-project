'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Save, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  Upload, 
  Plus, 
  LayoutGrid, 
  RotateCcw,
  Palette,
  Code,
  Settings,
  Layers
} from 'lucide-react';
import { showToast } from '@/components/ui/Toast';
import DynamicThemeRenderer from '@/components/layouts/DynamicThemeRenderer';
import { MOCK_INVITATION } from '@/constants/demoData';
import type { Invitation } from '@/types';

// Supported sections for builder
const AVAILABLE_SECTION_TYPES = [
  { type: 'hero', label: 'Hero Cover', desc: 'Gambar & nama pengantin utama' },
  { type: 'quote', label: 'Greeting & Quotes', desc: 'Teks salam pembuka & kutipan suci' },
  { type: 'couple', label: 'Mempelai Profile', desc: 'Foto & nama kedua mempelai' },
  { type: 'countdown', label: 'Countdown Timer', desc: 'Jadwal hitung mundur acara' },
  { type: 'divider-image', label: 'Divider Foto', desc: 'Foto pembatas paralaks' },
  { type: 'event', label: 'Detail Acara & Maps', desc: 'Waktu, lokasi, & petunjuk peta' },
  { type: 'story', label: 'Kisah Cinta (Timeline)', desc: 'Kronik cerita cinta' },
  { type: 'gallery', label: 'Galeri Foto', desc: 'Kolase foto kebahagiaan' },
  { type: 'video', label: 'Video Embed', desc: 'Tautan video Youtube/Vimeo' },
  { type: 'gifts', label: 'Kado Digital (Multi Rek)', desc: 'Nomor rekening & alamat kado' },
  { type: 'wishes', label: 'RSVP & Guestbook', desc: 'Form konfirmasi & daftar ucapan' },
  { type: 'divider-wave', label: 'Divider Wave', desc: 'Pembatas lekukan gelombang' },
  { type: 'divider-curved', label: 'Divider Curved', desc: 'Pembatas lekukan lengkung' },
  { type: 'canvas', label: 'Figma Canvas', desc: 'Seksi bebas dengan layer absolut ala Figma' },
  { type: 'custom-text', label: 'Teks Bebas', desc: 'Menambahkan paragraf & judul kustom' },
  { type: 'custom-image', label: 'Gambar/Aset Bebas', desc: 'Menambahkan gambar/sticker baru kustom' },
  { type: 'custom-shape', label: 'Shape & Garis', desc: 'Menambahkan bentuk lingkaran, kotak, atau garis' }
];

export interface CanvasLayer {
  id: string;
  type: 'text' | 'image' | 'shape';
  left: number;
  top: number;
  width: number;
  height: number;
  rotate?: number;
  zIndex?: number;
  position?: 'absolute' | 'relative';

  // text
  textTitle?: string;
  fontSize?: string;
  color?: string;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';

  // image
  imageUrl?: string;
  borderRadius?: number;
  opacity?: number;

  // shape
  shapeType?: 'circle' | 'rectangle' | 'line';
  shapeColor?: string;
  borderRadiusShape?: number;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: string;
}

interface ThemeSection {
  id: string;
  type: string;
  animation: 'up' | 'left' | 'right' | 'scale' | 'fade' | 'down' | 'flip' | 'rotate' | 'none';
  delay: string;
  paddingY: string;
  layout: string;

  // Custom style overrides
  backgroundColor?: string;
  textColor?: string;
  bgImage?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: string;
  opacity?: number;
  shadowBlur?: number;
  shadowColor?: string;
  shadowOffsetX?: number;
  shadowOffsetY?: number;

  // custom-text fields
  textTitle?: string;
  textBody?: string;
  titleFontSize?: string;
  bodyFontSize?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';

  // custom-image fields
  imageUrl?: string;
  imageWidth?: string;
  imageHeight?: string;
  imageAlign?: 'left' | 'center' | 'right';

  // custom-shape fields
  shapeType?: 'circle' | 'rectangle' | 'line' | 'card';
  shapeWidth?: string;
  shapeHeight?: string;
  shapeColor?: string;
  shapeAlign?: 'left' | 'center' | 'right';

  // Divider fill
  dividerFill?: string;

  // Figma Canvas fields
  layers?: CanvasLayer[];
  canvasHeight?: string;
}

interface ThemeConfig {
  thumbnail?: string | null;
  name: string;
  slug: string;
  category: string;
  isPremium: boolean;
  style: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    fontFamilyTitle: string;
    fontFamilyBody: string;
    fontFamilyScript: string;
    customCss: string;
  };
  ambientEffect: 'sparkles' | 'gold-dust' | 'snow' | 'none';
  sections: ThemeSection[];
}

const DEFAULT_CONFIG: ThemeConfig = {
  name: 'Tema Kustom Baru',
  slug: 'new-custom-theme',
  category: 'Modern',
  isPremium: false,
  style: {
    backgroundColor: '#fdfcf9',
    textColor: '#1c1c1c',
    accentColor: '#f43f5e',
    fontFamilyTitle: 'Playfair Display',
    fontFamilyBody: 'Inter',
    fontFamilyScript: 'Dancing Script',
    customCss: '',
  },
  ambientEffect: 'none',
  sections: [
    { id: '1', type: 'hero', animation: 'none', delay: '', paddingY: 'py-0', layout: 'classic' },
    { id: '2', type: 'countdown', animation: 'scale', delay: '', paddingY: 'py-12', layout: 'classic' },
    { id: '3', type: 'quote', animation: 'up', delay: '', paddingY: 'py-16', layout: 'classic' },
    { id: '4', type: 'couple', animation: 'up', delay: '', paddingY: 'py-20', layout: 'classic' },
    { id: '5', type: 'event', animation: 'up', delay: '', paddingY: 'py-16', layout: 'classic' },
    { id: '6', type: 'wishes', animation: 'up', delay: '', paddingY: 'py-16', layout: 'classic' },
  ],
  thumbnail: null
};

export default function ThemeBuilderPage() {
  const [config, setConfig] = useState<ThemeConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<'widgets' | 'styles' | 'css'>('widgets');
  const [activeSectionId, setActiveSectionId] = useState<string | null>('1');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  const handleUpdateLayer = (sectionId: string, layerId: string, updates: any) => {
    updateConfig(prev => {
      const nextSections = [...prev.sections];
      const sIdx = nextSections.findIndex(s => s.id === sectionId);
      if (sIdx !== -1) {
        const nextLayers = [...(nextSections[sIdx].layers || [])];
        const lIdx = nextLayers.findIndex(l => l.id === layerId);
        if (lIdx !== -1) {
          nextLayers[lIdx] = { ...nextLayers[lIdx], ...updates };
          nextSections[sIdx] = { ...nextSections[sIdx], layers: nextLayers };
        }
      }
      return { ...prev, sections: nextSections };
    });
  };

  const addLayer = (type: 'text' | 'image' | 'shape') => {
    if (!activeSectionId) return;
    const activeSection = config.sections.find(s => s.id === activeSectionId);
    const newId = `layer-${Date.now()}`;
    const newLayer: any = {
      id: newId,
      type,
      left: 30,
      top: 30,
      width: 40,
      height: 15,
      zIndex: (activeSection?.layers?.length || 0) + 1,
      ...(type === 'text' && { textTitle: 'Teks Bebas Baru', fontSize: '1rem', color: '#1c1c1c', fontWeight: 'bold' }),
      ...(type === 'image' && { imageUrl: '', borderRadius: 0, opacity: 100 }),
      ...(type === 'shape' && { shapeType: 'rectangle', shapeColor: '#f43f5e', borderRadiusShape: 0, borderWidth: 1, borderColor: '#eceae4', borderStyle: 'solid' })
    };
    
    updateConfig(prev => {
      const nextSections = [...prev.sections];
      const idx = nextSections.findIndex(s => s.id === activeSectionId);
      if (idx !== -1) {
        const nextLayers = [...(nextSections[idx].layers || []), newLayer];
        nextSections[idx] = { ...nextSections[idx], layers: nextLayers };
      }
      return { ...prev, sections: nextSections };
    });
    setSelectedLayerId(newId);
    showToast('success', `Layer ${type} ditambahkan`);
  };

  const deleteLayer = (layerId: string) => {
    if (!activeSectionId) return;
    updateConfig(prev => {
      const nextSections = [...prev.sections];
      const idx = nextSections.findIndex(s => s.id === activeSectionId);
      if (idx !== -1) {
        const nextLayers = (nextSections[idx].layers || []).filter(l => l.id !== layerId);
        nextSections[idx] = { ...nextSections[idx], layers: nextLayers };
      }
      return { ...prev, sections: nextSections };
    });
    setSelectedLayerId(null);
    showToast('success', 'Layer berhasil dihapus');
  };

  const alignLayer = (alignment: 'left' | 'h-center' | 'right' | 'top' | 'v-center' | 'bottom') => {
    if (!activeSectionId || !selectedLayerId || !activeSection) return;
    const layers = activeSection.layers || [];
    const layer = layers.find(l => l.id === selectedLayerId);
    if (!layer) return;

    let updates = {};
    switch (alignment) {
      case 'left':
        updates = { left: 0 };
        break;
      case 'h-center':
        updates = { left: Math.round((50 - layer.width / 2) * 10) / 10 };
        break;
      case 'right':
        updates = { left: 100 - layer.width };
        break;
      case 'top':
        updates = { top: 0 };
        break;
      case 'v-center':
        updates = { top: Math.round((50 - layer.height / 2) * 10) / 10 };
        break;
      case 'bottom':
        updates = { top: 100 - layer.height };
        break;
    }

    handleUpdateLayer(activeSectionId, selectedLayerId, updates);
  };
  
  // Debounced input state for preventing UI lag on fast keystrokes
  const [cssValue, setCssValue] = useState(DEFAULT_CONFIG.style.customCss);
  const cssDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Load draft from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sahinaja_theme_builder_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig(parsed);
        setCssValue(parsed.style.customCss || '');
        showToast('success', 'Draf tema dipulihkan dari penyimpanan lokal!');
      } catch (err) {
        console.error('Failed to parse draft config:', err);
      }
    }
  }, []);

  // Save to localStorage on config changes
  const saveDraftLocally = (newConfig: ThemeConfig) => {
    localStorage.setItem('sahinaja_theme_builder_draft', JSON.stringify(newConfig));
  };

  const updateConfig = (updater: (prev: ThemeConfig) => ThemeConfig) => {
    setConfig(prev => {
      const next = updater(prev);
      saveDraftLocally(next);
      return next;
    });
  };

  // Debounce CSS input updates to keep typing lag-free
  const handleCssChange = (val: string) => {
    setCssValue(val);
    if (cssDebounceRef.current) clearTimeout(cssDebounceRef.current);
    cssDebounceRef.current = setTimeout(() => {
      updateConfig(prev => ({
        ...prev,
        style: { ...prev.style, customCss: val }
      }));
    }, 300);
  };

  // Handle uploading files directly to local server storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'music' | 'bg' | 'thumbnail' | 'imageUrl' | 'sectionBg') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const res = await fetch('/api/admin/upload-theme-asset', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.success && data.data) {
        showToast('success', 'Berkas berhasil diunggah ke server!');
        if (targetField === 'thumbnail') {
          updateConfig(prev => ({ ...prev, thumbnail: data.data.fileUrl }));
        } else if (targetField === 'music') {
          // Trigger a dummy update to mockup musicUrl in mock data
          showToast('success', `Musik disetel ke: ${data.data.filename}`);
        } else if (targetField === 'imageUrl') {
          if (activeSectionId) {
            updateConfig(prev => {
              const next = [...prev.sections];
              const idx = next.findIndex(s => s.id === activeSectionId);
              if (idx !== -1) {
                next[idx] = { ...next[idx], imageUrl: data.data.fileUrl };
              }
              return { ...prev, sections: next };
            });
          }
        } else if (targetField === 'sectionBg') {
          if (activeSectionId) {
            updateConfig(prev => {
              const next = [...prev.sections];
              const idx = next.findIndex(s => s.id === activeSectionId);
              if (idx !== -1) {
                next[idx] = { ...next[idx], bgImage: data.data.fileUrl };
              }
              return { ...prev, sections: next };
            });
          }
        }
      } else {
        showToast('error', data.message || 'Gagal mengunggah berkas');
      }
    } catch (err: unknown) {
      showToast('error', `Kesalahan unggah: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Save layout configuration to PostgreSQL database
  const saveThemeToDb = async () => {
    setIsSaving(true);
    try {
      // 1. First search if theme exists by slug (hybrid update/create)
      const resList = await fetch('/api/admin/themes');
      const listJson = await resList.json();
      const existingTheme = listJson.success 
        ? (listJson.data as any[]).find(t => t.slug === config.slug) 
        : null;

      const endpoint = existingTheme ? `/api/admin/themes/${existingTheme.id}` : '/api/admin/themes';
      const method = existingTheme ? 'PATCH' : 'POST';

      const saveRes = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: config.name,
          slug: config.slug,
          category: config.category,
          isPremium: config.isPremium,
          thumbnail: config.thumbnail || null,
          config: {
            style: config.style,
            ambientEffect: config.ambientEffect,
            sections: config.sections
          }
        })
      });

      const saveJson = await saveRes.json();
      if (saveJson.success) {
        showToast('success', existingTheme ? 'Tema berhasil diperbarui di server!' : 'Tema baru berhasil diterbitkan!');
        localStorage.removeItem('sahinaja_theme_builder_draft');
      } else {
        showToast('error', saveJson.message || 'Gagal menyimpan tema');
      }
    } catch (err) {
      showToast('error', 'Terjadi kesalahan sistem saat menyimpan');
    } finally {
      setIsSaving(false);
    }
  };

  // Section arrangement actions
  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === config.sections.length - 1) return;

    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    updateConfig(prev => {
      const nextSections = [...prev.sections];
      const temp = nextSections[index];
      nextSections[index] = nextSections[swapIndex];
      nextSections[swapIndex] = temp;
      return { ...prev, sections: nextSections };
    });
  };

  const deleteSection = (id: string) => {
    updateConfig(prev => {
      const filtered = prev.sections.filter(s => s.id !== id);
      return { ...prev, sections: filtered };
    });
    if (activeSectionId === id) setActiveSectionId(null);
    showToast('success', 'Seksi tata letak dihapus');
  };

  const addSection = (type: string) => {
    const newId = `${Date.now()}`;
    const newSect: ThemeSection = {
      id: newId,
      type,
      animation: 'up',
      delay: '',
      paddingY: 'py-16',
      layout: 'classic'
    };

    updateConfig(prev => ({
      ...prev,
      sections: [...prev.sections, newSect]
    }));
    setActiveSectionId(newId);
    showToast('success', `Seksi ${type.toUpperCase()} ditambahkan`);
  };

  // Re-map mock data with custom settings to feed Live Preview
  const mockInvitation: Invitation = useMemo(() => {
    return {
      ...MOCK_INVITATION,
      layout: config.slug as any, // force renderer to match styles
      groomName: MOCK_INVITATION.groomName || 'Yusuf',
      brideName: MOCK_INVITATION.brideName || 'Fatimah',
    };
  }, [config.slug]);

  const activeSection = config.sections.find(s => s.id === activeSectionId);

  return (
    <div className="flex flex-col h-full bg-[#f5f3ee] text-[#1c1c1c] overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-[#eceae4] bg-white px-6 flex items-center justify-between z-40 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/admin/themes" className="p-2 hover:bg-stone-100 rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5 text-[#6b6b6b]" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-[#1c1c1c]">Elementor Theme Builder</h1>
            <p className="text-[10px] text-[#6b6b6b]">Rancang tema premium tanpa kode secara instan.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin mengatur ulang ke tema default? Semua draf Anda akan dihapus.')) {
                setConfig(DEFAULT_CONFIG);
                setCssValue(DEFAULT_CONFIG.style.customCss);
                localStorage.removeItem('sahinaja_theme_builder_draft');
                showToast('success', 'Draf diatur ulang ke bawaan');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 text-stone-600 rounded-lg text-xs font-semibold hover:bg-stone-200 transition-colors"
            title="Reset to default template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          
          <button
            onClick={saveThemeToDb}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 bg-[#1c1c1c] text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors shadow-md shadow-black/10 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Menyimpan...' : 'Simpan & Publikasikan'}
          </button>
        </div>
      </header>

      {/* Main Visual Editor Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* PANEL KIRI: Elementor Widget Selector */}
        <aside className="w-80 border-r border-[#eceae4] bg-white flex flex-col z-30 shrink-0 select-none">
          {/* Tabs */}
          <div className="grid grid-cols-3 border-b border-[#eceae4] text-xs font-bold h-12 shrink-0">
            <button
              onClick={() => setActiveTab('widgets')}
              className={`flex flex-col items-center justify-center gap-1 border-b-2 transition-all ${
                activeTab === 'widgets' ? 'border-rose-500 text-rose-500 bg-rose-500/[0.01]' : 'border-transparent text-[#6b6b6b] hover:text-[#1c1c1c]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Seksi
            </button>
            <button
              onClick={() => setActiveTab('styles')}
              className={`flex flex-col items-center justify-center gap-1 border-b-2 transition-all ${
                activeTab === 'styles' ? 'border-rose-500 text-rose-500 bg-rose-500/[0.01]' : 'border-transparent text-[#6b6b6b] hover:text-[#1c1c1c]'
              }`}
            >
              <Palette className="w-4 h-4" />
              Gaya Global
            </button>
            <button
              onClick={() => setActiveTab('css')}
              className={`flex flex-col items-center justify-center gap-1 border-b-2 transition-all ${
                activeTab === 'css' ? 'border-rose-500 text-rose-500 bg-rose-500/[0.01]' : 'border-transparent text-[#6b6b6b] hover:text-[#1c1c1c]'
              }`}
            >
              <Code className="w-4 h-4" />
              Custom CSS
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {activeTab === 'widgets' && (
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-[#6b6b6b] uppercase tracking-wider">Seret atau Klik untuk Tambah Seksi</h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {AVAILABLE_SECTION_TYPES.map((widget) => (
                    <button
                      key={widget.type}
                      onClick={() => addSection(widget.type)}
                      className="flex items-center gap-3 p-3.5 bg-stone-50 border border-[#eceae4] hover:border-rose-300 hover:bg-rose-50/20 text-left rounded-xl transition-all cursor-pointer group"
                    >
                      <div className="p-2 bg-white rounded-lg border border-[#eceae4] group-hover:border-rose-200 transition-colors">
                        <Plus className="w-4 h-4 text-rose-500" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1c1c1c]">{widget.label}</div>
                        <div className="text-[9px] text-[#6b6b6b] mt-0.5">{widget.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'styles' && (
              <div className="space-y-6 text-xs font-semibold">
                <h3 className="text-[10px] font-bold text-[#6b6b6b] uppercase tracking-wider mb-2">Metadata Tema</h3>
                <div className="space-y-4 border-b border-[#eceae4] pb-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#6b6b6b] mb-1.5">Nama Tema</label>
                    <input
                      type="text"
                      className="w-full h-10 border border-[#eceae4] rounded-lg px-3 focus:outline-none focus:border-rose-500 font-semibold"
                      value={config.name}
                      onChange={(e) => updateConfig(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#6b6b6b] mb-1.5">Slug URL Unik</label>
                    <input
                      type="text"
                      className="w-full h-10 border border-[#eceae4] rounded-lg px-3 focus:outline-none focus:border-rose-500 font-semibold font-mono"
                      value={config.slug}
                      onChange={(e) => updateConfig(prev => ({ ...prev, slug: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center justify-between bg-stone-50 p-3 rounded-xl border border-[#eceae4]">
                    <div>
                      <div className="font-bold text-[#1c1c1c]">Tema Premium</div>
                      <div className="text-[9px] text-[#6b6b6b] font-medium mt-0.5">Membatasi akses hanya untuk paket premium.</div>
                    </div>
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded text-rose-500 focus:ring-rose-500"
                      checked={config.isPremium}
                      onChange={(e) => updateConfig(prev => ({ ...prev, isPremium: e.target.checked }))}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#6b6b6b] mb-1.5">Aset Gambar Pratinjau (Thumbnail)</label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 flex items-center justify-center gap-1.5 h-10 border border-dashed border-[#eceae4] hover:border-rose-300 hover:bg-rose-50/10 rounded-lg cursor-pointer transition-colors font-bold text-stone-600 bg-white">
                        <Upload className="w-3.5 h-3.5" />
                        Unggah Foto
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'thumbnail')}
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                    {config.thumbnail && (
                      <div className="mt-2 text-[9px] text-emerald-600 flex items-center gap-1 font-bold">
                        <span>✓</span> Terunggah: {String(config.thumbnail).substring(String(config.thumbnail).lastIndexOf('/') + 1)}
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-[10px] font-bold text-[#6b6b6b] uppercase tracking-wider mb-2">Palet Warna Global</h3>
                <div className="space-y-4 border-b border-[#eceae4] pb-5">
                  <div className="flex items-center justify-between">
                    <span>Latar Belakang (BG)</span>
                    <input
                      type="color"
                      className="w-10 h-8 border border-[#eceae4] rounded cursor-pointer"
                      value={config.style.backgroundColor}
                      onChange={(e) => updateConfig(prev => ({
                        ...prev,
                        style: { ...prev.style, backgroundColor: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Teks Utama</span>
                    <input
                      type="color"
                      className="w-10 h-8 border border-[#eceae4] rounded cursor-pointer"
                      value={config.style.textColor}
                      onChange={(e) => updateConfig(prev => ({
                        ...prev,
                        style: { ...prev.style, textColor: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Warna Aksen</span>
                    <input
                      type="color"
                      className="w-10 h-8 border border-[#eceae4] rounded cursor-pointer"
                      value={config.style.accentColor}
                      onChange={(e) => updateConfig(prev => ({
                        ...prev,
                        style: { ...prev.style, accentColor: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <h3 className="text-[10px] font-bold text-[#6b6b6b] uppercase tracking-wider mb-2">Font Keluarga Google</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] text-[#6b6b6b] font-bold mb-1 uppercase">Font Judul Utama (Title)</label>
                    <select
                      className="w-full h-10 border border-[#eceae4] rounded-lg px-2 text-[#1c1c1c] font-semibold"
                      value={config.style.fontFamilyTitle}
                      onChange={(e) => updateConfig(prev => ({
                        ...prev,
                        style: { ...prev.style, fontFamilyTitle: e.target.value }
                      }))}
                    >
                      <option value="Playfair Display">Playfair Display (Elegant Serif)</option>
                      <option value="Cinzel">Cinzel (Roman Classical)</option>
                      <option value="Cormorant Garamond">Cormorant Garamond (Premium Garamond)</option>
                      <option value="Montserrat">Montserrat (Modern Clean)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] text-[#6b6b6b] font-bold mb-1 uppercase">Font Sambung (Script)</label>
                    <select
                      className="w-full h-10 border border-[#eceae4] rounded-lg px-2 text-[#1c1c1c] font-semibold"
                      value={config.style.fontFamilyScript}
                      onChange={(e) => updateConfig(prev => ({
                        ...prev,
                        style: { ...prev.style, fontFamilyScript: e.target.value }
                      }))}
                    >
                      <option value="Dancing Script">Dancing Script (Playful Script)</option>
                      <option value="Alex Brush">Alex Brush (Classical Calligraphy)</option>
                      <option value="Great Vibes">Great Vibes (Luxurious Elegant)</option>
                      <option value="Parisienne">Parisienne (Romantic Parisian)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] text-[#6b6b6b] font-bold mb-1 uppercase">Font Paragraf (Body)</label>
                    <select
                      className="w-full h-10 border border-[#eceae4] rounded-lg px-2 text-[#1c1c1c] font-semibold"
                      value={config.style.fontFamilyBody}
                      onChange={(e) => updateConfig(prev => ({
                        ...prev,
                        style: { ...prev.style, fontFamilyBody: e.target.value }
                      }))}
                    >
                      <option value="Inter">Inter (Clean Sans)</option>
                      <option value="Outfit">Outfit (Geometric Minimal)</option>
                      <option value="Montserrat">Montserrat (Readable Bold)</option>
                      <option value="Roboto">Roboto (Neutral Sans)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'css' && (
              <div className="space-y-4 h-full flex flex-col">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#6b6b6b] uppercase tracking-wider shrink-0">
                  <Code className="w-3.5 h-3.5 text-rose-500" />
                  Suntikkan Custom CSS Kustom
                </div>
                <p className="text-[9px] text-[#6b6b6b] leading-relaxed shrink-0">
                  {"Tulis kode CSS di bawah untuk menimpa elemen visual secara presisi. (e.g. .dynamic-theme-wrapper .animate-sparkle { ... })."}
                </p>
                <div className="flex-1 min-h-[300px]">
                  <textarea
                    className="w-full h-full p-4 border border-[#eceae4] rounded-xl focus:outline-none focus:border-rose-500 font-mono text-[10px] font-semibold bg-stone-900 text-stone-200"
                    placeholder="/* Masukkan CSS Anda di sini */"
                    value={cssValue}
                    onChange={(e) => handleCssChange(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* KANVAS TENGAH: Live Phone Workspace */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto select-none relative">
          
          <div className="relative w-[360px] h-[720px] rounded-[3rem] border-8 border-[#1c1c1c] bg-white shadow-2xl flex flex-col overflow-hidden relative ring-1 ring-black/10 scale-[0.9] lg:scale-100 transition-transform">
            
            {/* Speaker & Sensor Mockup notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-5 bg-[#1c1c1c] rounded-b-xl z-[1000] flex items-center justify-center">
              <div className="w-12 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Simulated Frame Screen Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 w-full dynamic-canvas-container">
              {/* Direct React Render of Layout */}
              <DynamicThemeRenderer 
                invitation={mockInvitation} 
                config={config} 
                isPreview={true} 
                editingMode={true}
                selectedLayerId={selectedLayerId}
                onSelectLayer={(sectId, layId) => setSelectedLayerId(layId)}
                onUpdateLayer={handleUpdateLayer}
              />
            </div>
          </div>
        </main>

        {/* PANEL KANAN: Inspector Panel & Section Reorder */}
        <aside className="w-80 border-l border-[#eceae4] bg-white flex flex-col z-30 shrink-0 select-none">
          <div className="h-12 border-b border-[#eceae4] px-4 flex items-center shrink-0">
            <h3 className="text-xs font-bold text-[#1c1c1c] uppercase tracking-wider flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-rose-500" />
              Konfigurasi Seksi
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs font-semibold custom-scrollbar">
            
            {/* List of active sections in canvas for re-ordering */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-[#6b6b6b] uppercase tracking-wider mb-2">Susunan Tata Letak</h4>
              <div className="space-y-1.5">
                {config.sections.map((sect, idx) => {
                  const isActive = activeSectionId === sect.id;
                  const label = AVAILABLE_SECTION_TYPES.find(w => w.type === sect.type)?.label || sect.type;

                  return (
                    <div
                      key={sect.id}
                      onClick={() => setActiveSectionId(sect.id)}
                      className={`flex items-center justify-between p-2.5 border rounded-xl cursor-pointer transition-all ${
                        isActive 
                          ? 'border-rose-400 bg-rose-50/20 text-[#1c1c1c]' 
                          : 'border-[#eceae4] hover:bg-stone-50 text-stone-600'
                      }`}
                    >
                      <span className="font-bold truncate max-w-[130px]">{label}</span>
                      
                      {/* Controls */}
                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => moveSection(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 hover:bg-stone-100 disabled:opacity-35 rounded text-stone-500 transition-colors"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveSection(idx, 'down')}
                          disabled={idx === config.sections.length - 1}
                          className="p-1 hover:bg-stone-100 disabled:opacity-35 rounded text-stone-500 transition-colors"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteSection(sect.id)}
                          className="p-1 hover:bg-rose-50 text-rose-500 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active section inspector */}
            {activeSection ? (
              <div className="border-t border-[#eceae4] pt-5 space-y-4">
                <div className="bg-stone-50 border border-[#eceae4] p-3 rounded-xl mb-4">
                  <div className="text-[10px] font-bold text-[#6b6b6b] uppercase">Tipe Seksi Seleksi</div>
                  <div className="text-xs font-bold text-[#1c1c1c] mt-0.5 uppercase tracking-wide">
                    {AVAILABLE_SECTION_TYPES.find(w => w.type === activeSection.type)?.label || activeSection.type}
                  </div>
                </div>

                {/* Entrance Animation Config */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#6b6b6b] mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                    Animasi Masuk (Scroll)
                  </label>
                  <select
                    className="w-full h-10 border border-[#eceae4] rounded-lg px-2 text-[#1c1c1c] font-semibold"
                    value={activeSection.animation}
                    onChange={(e) => updateConfig(prev => {
                      const next = [...prev.sections];
                      const idx = next.findIndex(s => s.id === activeSection.id);
                      if (idx !== -1) {
                        next[idx] = { ...next[idx], animation: e.target.value as any };
                      }
                      return { ...prev, sections: next };
                    })}
                  >
                    <option value="none">Tanpa Animasi (Statis)</option>
                    <option value="up">Slide Up (Ke Atas)</option>
                    <option value="left">Slide Left (Masuk Kiri)</option>
                    <option value="right">Slide Right (Masuk Kanan)</option>
                    <option value="scale">Zoom In (Perbesaran 3D)</option>
                    <option value="fade">Fade In (Memudar)</option>
                    <option value="down">Slide Down (Ke Bawah)</option>
                    <option value="flip">Flip (Putar 3D)</option>
                    <option value="rotate">Rotate Zoom (Putar Membesar)</option>
                  </select>
                </div>

                {/* Delay Config */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#6b6b6b] mb-1.5">Jeda Animasi (Delay)</label>
                  <select
                    className="w-full h-10 border border-[#eceae4] rounded-lg px-2 text-[#1c1c1c] font-semibold"
                    value={activeSection.delay || ''}
                    onChange={(e) => updateConfig(prev => {
                      const next = [...prev.sections];
                      const idx = next.findIndex(s => s.id === activeSection.id);
                      if (idx !== -1) {
                        next[idx] = { ...next[idx], delay: e.target.value };
                      }
                      return { ...prev, sections: next };
                    })}
                  >
                    <option value="">Tanpa Jeda (Instan)</option>
                    <option value="delay-100">100ms</option>
                    <option value="delay-200">200ms</option>
                    <option value="delay-300">300ms</option>
                    <option value="delay-400">400ms</option>
                    <option value="delay-500">500ms</option>
                  </select>
                </div>

                {/* Section Padding Config */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#6b6b6b] mb-1.5">Ketebalan Spacing (Padding Vertikal)</label>
                  <select
                    className="w-full h-10 border border-[#eceae4] rounded-lg px-2 text-[#1c1c1c] font-semibold"
                    value={activeSection.paddingY}
                    onChange={(e) => updateConfig(prev => {
                      const next = [...prev.sections];
                      const idx = next.findIndex(s => s.id === activeSection.id);
                      if (idx !== -1) {
                        next[idx] = { ...next[idx], paddingY: e.target.value };
                      }
                      return { ...prev, sections: next };
                    })}
                  >
                    <option value="py-0">Tanpa Jarak (0px)</option>
                    <option value="py-6">Kecil (24px)</option>
                    <option value="py-12">Sedang (48px)</option>
                    <option value="py-16">Lebar (64px)</option>
                    <option value="py-20">Sangat Lebar (80px)</option>
                  </select>
                </div>

                {/* ── SECTION STYLING OVERRIDES (FULL CUSTOMIZE) ── */}
                <div className="border-t border-[#eceae4] pt-4 space-y-4">
                  <h4 className="text-[10px] font-bold text-[#6b6b6b] uppercase tracking-wider">Gaya & Desain Seksi</h4>
                  
                  {/* Colors */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">BG Color</label>
                      <div className="flex gap-1.5">
                        <input
                          type="color"
                          className="w-7 h-7 border border-[#eceae4] rounded cursor-pointer shrink-0"
                          value={activeSection.backgroundColor || '#ffffff'}
                          onChange={(e) => updateConfig(prev => {
                            const next = [...prev.sections];
                            const idx = next.findIndex(s => s.id === activeSection.id);
                            if (idx !== -1) next[idx] = { ...next[idx], backgroundColor: e.target.value };
                            return { ...prev, sections: next };
                          })}
                        />
                        <button 
                          onClick={() => updateConfig(prev => {
                            const next = [...prev.sections];
                            const idx = next.findIndex(s => s.id === activeSection.id);
                            if (idx !== -1) delete next[idx].backgroundColor;
                            return { ...prev, sections: next };
                          })}
                          className="text-[9px] text-rose-500 underline font-medium hover:text-rose-600 cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Warna Teks</label>
                      <div className="flex gap-1.5">
                        <input
                          type="color"
                          className="w-7 h-7 border border-[#eceae4] rounded cursor-pointer shrink-0"
                          value={activeSection.textColor || '#1c1c1c'}
                          onChange={(e) => updateConfig(prev => {
                            const next = [...prev.sections];
                            const idx = next.findIndex(s => s.id === activeSection.id);
                            if (idx !== -1) next[idx] = { ...next[idx], textColor: e.target.value };
                            return { ...prev, sections: next };
                          })}
                        />
                        <button 
                          onClick={() => updateConfig(prev => {
                            const next = [...prev.sections];
                            const idx = next.findIndex(s => s.id === activeSection.id);
                            if (idx !== -1) delete next[idx].textColor;
                            return { ...prev, sections: next };
                          })}
                          className="text-[9px] text-rose-500 underline font-medium hover:text-rose-600 cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Background Image Upload */}
                  <div>
                    <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Gambar Latar Belakang (Section BG)</label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 flex items-center justify-center gap-1.5 h-8 border border-dashed border-[#eceae4] hover:border-rose-300 hover:bg-rose-50/10 rounded-lg cursor-pointer transition-colors text-[10px] font-bold text-stone-600 bg-white">
                        <Upload className="w-3 h-3" />
                        Unggah BG
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'sectionBg')}
                          disabled={isUploading}
                        />
                      </label>
                      {activeSection.bgImage && (
                        <button 
                          onClick={() => updateConfig(prev => {
                            const next = [...prev.sections];
                            const idx = next.findIndex(s => s.id === activeSection.id);
                            if (idx !== -1) delete next[idx].bgImage;
                            return { ...prev, sections: next };
                          })}
                          className="px-2 py-1 bg-rose-50 text-rose-500 rounded border border-rose-100 text-[10px] font-bold hover:bg-rose-100 transition-colors"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Borders & Rounding */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Tepi Bulat (Radius)</label>
                      <input
                        type="text"
                        placeholder="e.g. 12"
                        className="w-full h-8 border border-[#eceae4] rounded-lg px-2 text-[10px] font-semibold text-[#1c1c1c] focus:outline-none"
                        value={activeSection.borderRadius || ''}
                        onChange={(e) => updateConfig(prev => {
                          const next = [...prev.sections];
                          const idx = next.findIndex(s => s.id === activeSection.id);
                          if (idx !== -1) next[idx] = { ...next[idx], borderRadius: e.target.value };
                          return { ...prev, sections: next };
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Ketebalan Garis</label>
                      <input
                        type="text"
                        placeholder="e.g. 2"
                        className="w-full h-8 border border-[#eceae4] rounded-lg px-2 text-[10px] font-semibold text-[#1c1c1c] focus:outline-none"
                        value={activeSection.borderWidth || ''}
                        onChange={(e) => updateConfig(prev => {
                          const next = [...prev.sections];
                          const idx = next.findIndex(s => s.id === activeSection.id);
                          if (idx !== -1) next[idx] = { ...next[idx], borderWidth: e.target.value };
                          return { ...prev, sections: next };
                        })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Warna Border</label>
                      <input
                        type="color"
                        className="w-full h-8 border border-[#eceae4] rounded cursor-pointer"
                        value={activeSection.borderColor || '#eceae4'}
                        onChange={(e) => updateConfig(prev => {
                          const next = [...prev.sections];
                          const idx = next.findIndex(s => s.id === activeSection.id);
                          if (idx !== -1) next[idx] = { ...next[idx], borderColor: e.target.value };
                          return { ...prev, sections: next };
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Model Border</label>
                      <select
                        className="w-full h-8 border border-[#eceae4] rounded-lg px-1 text-[10px] font-semibold"
                        value={activeSection.borderStyle || 'none'}
                        onChange={(e) => updateConfig(prev => {
                          const next = [...prev.sections];
                          const idx = next.findIndex(s => s.id === activeSection.id);
                          if (idx !== -1) next[idx] = { ...next[idx], borderStyle: e.target.value };
                          return { ...prev, sections: next };
                        })}
                      >
                        <option value="none">None</option>
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                        <option value="double">Double</option>
                      </select>
                    </div>
                  </div>

                  {/* Opacity */}
                  <div>
                    <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Transparansi (Opacity): {activeSection.opacity !== undefined ? activeSection.opacity : 100}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      className="w-full accent-rose-500 cursor-pointer"
                      value={activeSection.opacity !== undefined ? activeSection.opacity : 100}
                      onChange={(e) => updateConfig(prev => {
                        const next = [...prev.sections];
                        const idx = next.findIndex(s => s.id === activeSection.id);
                        if (idx !== -1) next[idx] = { ...next[idx], opacity: parseInt(e.target.value, 10) };
                        return { ...prev, sections: next };
                      })}
                    />
                  </div>

                  {/* Shadow */}
                  <div className="border-t border-[#eceae4] pt-3 space-y-2">
                    <label className="block text-[9px] text-[#6b6b6b] uppercase font-bold">Drop Shadow (Bayangan)</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <div>
                        <label className="block text-[8px] text-[#6b6b6b] mb-0.5">Blur (px)</label>
                        <input
                          type="number"
                          className="w-full h-7 border border-[#eceae4] rounded px-1 text-[10px]"
                          value={activeSection.shadowBlur || 0}
                          onChange={(e) => updateConfig(prev => {
                            const next = [...prev.sections];
                            const idx = next.findIndex(s => s.id === activeSection.id);
                            if (idx !== -1) next[idx] = { ...next[idx], shadowBlur: parseInt(e.target.value, 10) };
                            return { ...prev, sections: next };
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] text-[#6b6b6b] mb-0.5">X (px)</label>
                        <input
                          type="number"
                          className="w-full h-7 border border-[#eceae4] rounded px-1 text-[10px]"
                          value={activeSection.shadowOffsetX || 0}
                          onChange={(e) => updateConfig(prev => {
                            const next = [...prev.sections];
                            const idx = next.findIndex(s => s.id === activeSection.id);
                            if (idx !== -1) next[idx] = { ...next[idx], shadowOffsetX: parseInt(e.target.value, 10) };
                            return { ...prev, sections: next };
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] text-[#6b6b6b] mb-0.5">Y (px)</label>
                        <input
                          type="number"
                          className="w-full h-7 border border-[#eceae4] rounded px-1 text-[10px]"
                          value={activeSection.shadowOffsetY || 0}
                          onChange={(e) => updateConfig(prev => {
                            const next = [...prev.sections];
                            const idx = next.findIndex(s => s.id === activeSection.id);
                            if (idx !== -1) next[idx] = { ...next[idx], shadowOffsetY: parseInt(e.target.value, 10) };
                            return { ...prev, sections: next };
                          })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[8px] text-[#6b6b6b] mb-1">Warna Shadow</label>
                      <input
                        type="color"
                        className="w-full h-8 border border-[#eceae4] rounded cursor-pointer"
                        value={activeSection.shadowColor || '#000000'}
                        onChange={(e) => updateConfig(prev => {
                          const next = [...prev.sections];
                          const idx = next.findIndex(s => s.id === activeSection.id);
                          if (idx !== -1) next[idx] = { ...next[idx], shadowColor: e.target.value };
                          return { ...prev, sections: next };
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* ── WIDGET SPECIFIC SETTINGS ── */}
                
                {/* For custom-text widget */}
                {activeSection.type === 'custom-text' && (
                  <div className="border-t border-[#eceae4] pt-4 space-y-4">
                    <h4 className="text-[10px] font-bold text-[#6b6b6b] uppercase tracking-wider">Pengaturan Teks Kustom</h4>
                    <div>
                      <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Judul Utama (Title)</label>
                      <input
                        type="text"
                        className="w-full h-9 border border-[#eceae4] rounded-lg px-2 text-[10px] font-semibold"
                        value={activeSection.textTitle || ''}
                        onChange={(e) => updateConfig(prev => {
                          const next = [...prev.sections];
                          const idx = next.findIndex(s => s.id === activeSection.id);
                          if (idx !== -1) next[idx] = { ...next[idx], textTitle: e.target.value };
                          return { ...prev, sections: next };
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Isi Paragraf (Body)</label>
                      <textarea
                        className="w-full h-20 border border-[#eceae4] rounded-lg p-2 text-[10px] font-semibold"
                        value={activeSection.textBody || ''}
                        onChange={(e) => updateConfig(prev => {
                          const next = [...prev.sections];
                          const idx = next.findIndex(s => s.id === activeSection.id);
                          if (idx !== -1) next[idx] = { ...next[idx], textBody: e.target.value };
                          return { ...prev, sections: next };
                        })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Font Judul (rem)</label>
                        <input
                          type="text"
                          placeholder="e.g. 1.75rem"
                          className="w-full h-8 border border-[#eceae4] rounded-lg px-2 text-[10px]"
                          value={activeSection.titleFontSize || ''}
                          onChange={(e) => updateConfig(prev => {
                            const next = [...prev.sections];
                            const idx = next.findIndex(s => s.id === activeSection.id);
                            if (idx !== -1) next[idx] = { ...next[idx], titleFontSize: e.target.value };
                            return { ...prev, sections: next };
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Font Body (rem)</label>
                        <input
                          type="text"
                          placeholder="e.g. 0.875rem"
                          className="w-full h-8 border border-[#eceae4] rounded-lg px-2 text-[10px]"
                          value={activeSection.bodyFontSize || ''}
                          onChange={(e) => updateConfig(prev => {
                            const next = [...prev.sections];
                            const idx = next.findIndex(s => s.id === activeSection.id);
                            if (idx !== -1) next[idx] = { ...next[idx], bodyFontSize: e.target.value };
                            return { ...prev, sections: next };
                          })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Perataan Teks</label>
                      <select
                        className="w-full h-8 border border-[#eceae4] rounded-lg px-1 text-[10px] font-semibold"
                        value={activeSection.textAlign || 'center'}
                        onChange={(e) => updateConfig(prev => {
                          const next = [...prev.sections];
                          const idx = next.findIndex(s => s.id === activeSection.id);
                          if (idx !== -1) next[idx] = { ...next[idx], textAlign: e.target.value as any };
                          return { ...prev, sections: next };
                        })}
                      >
                        <option value="left">Kiri</option>
                        <option value="center">Tengah</option>
                        <option value="right">Kanan</option>
                        <option value="justify">Rata Kiri-Kanan</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* For custom-image widget */}
                {activeSection.type === 'custom-image' && (
                  <div className="border-t border-[#eceae4] pt-4 space-y-4">
                    <h4 className="text-[10px] font-bold text-[#6b6b6b] uppercase tracking-wider">Pengaturan Gambar/Aset</h4>
                    <div>
                      <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Unggah Gambar Aset</label>
                      <div className="flex items-center gap-2">
                        <label className="flex-1 flex items-center justify-center gap-1.5 h-10 border border-dashed border-[#eceae4] hover:border-rose-300 hover:bg-rose-50/10 rounded-lg cursor-pointer transition-colors text-[10px] font-bold text-stone-600 bg-white">
                          <Upload className="w-3.5 h-3.5" />
                          Pilih File Gambar
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'imageUrl')}
                            disabled={isUploading}
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Atau Tulis URL Gambar</label>
                      <input
                        type="text"
                        placeholder="https://..."
                        className="w-full h-9 border border-[#eceae4] rounded-lg px-2 text-[10px]"
                        value={activeSection.imageUrl || ''}
                        onChange={(e) => updateConfig(prev => {
                          const next = [...prev.sections];
                          const idx = next.findIndex(s => s.id === activeSection.id);
                          if (idx !== -1) next[idx] = { ...next[idx], imageUrl: e.target.value };
                          return { ...prev, sections: next };
                        })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Lebar (e.g. 100px / 80%)</label>
                        <input
                          type="text"
                          className="w-full h-8 border border-[#eceae4] rounded-lg px-2 text-[10px]"
                          value={activeSection.imageWidth || ''}
                          onChange={(e) => updateConfig(prev => {
                            const next = [...prev.sections];
                            const idx = next.findIndex(s => s.id === activeSection.id);
                            if (idx !== -1) next[idx] = { ...next[idx], imageWidth: e.target.value };
                            return { ...prev, sections: next };
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Tinggi (e.g. 200px / auto)</label>
                        <input
                          type="text"
                          className="w-full h-8 border border-[#eceae4] rounded-lg px-2 text-[10px]"
                          value={activeSection.imageHeight || ''}
                          onChange={(e) => updateConfig(prev => {
                            const next = [...prev.sections];
                            const idx = next.findIndex(s => s.id === activeSection.id);
                            if (idx !== -1) next[idx] = { ...next[idx], imageHeight: e.target.value };
                            return { ...prev, sections: next };
                          })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Perataan Gambar</label>
                      <select
                        className="w-full h-8 border border-[#eceae4] rounded-lg px-1 text-[10px] font-semibold"
                        value={activeSection.imageAlign || 'center'}
                        onChange={(e) => updateConfig(prev => {
                          const next = [...prev.sections];
                          const idx = next.findIndex(s => s.id === activeSection.id);
                          if (idx !== -1) next[idx] = { ...next[idx], imageAlign: e.target.value as any };
                          return { ...prev, sections: next };
                        })}
                      >
                        <option value="left">Kiri</option>
                        <option value="center">Tengah</option>
                        <option value="right">Kanan</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* For custom-shape widget */}
                {activeSection.type === 'custom-shape' && (
                  <div className="border-t border-[#eceae4] pt-4 space-y-4">
                    <h4 className="text-[10px] font-bold text-[#6b6b6b] uppercase tracking-wider">Pengaturan Shape & Garis</h4>
                    <div>
                      <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Tipe Shape</label>
                      <select
                        className="w-full h-8 border border-[#eceae4] rounded-lg px-1 text-[10px] font-semibold"
                        value={activeSection.shapeType || 'rectangle'}
                        onChange={(e) => updateConfig(prev => {
                          const next = [...prev.sections];
                          const idx = next.findIndex(s => s.id === activeSection.id);
                          if (idx !== -1) next[idx] = { ...next[idx], shapeType: e.target.value as any };
                          return { ...prev, sections: next };
                        })}
                      >
                        <option value="rectangle">Kotak / Card</option>
                        <option value="circle">Lingkaran</option>
                        <option value="line">Garis Pembatas (Line)</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Lebar (px/%)</label>
                        <input
                          type="text"
                          placeholder="e.g. 60px"
                          className="w-full h-8 border border-[#eceae4] rounded-lg px-2 text-[10px]"
                          value={activeSection.shapeWidth || ''}
                          onChange={(e) => updateConfig(prev => {
                            const next = [...prev.sections];
                            const idx = next.findIndex(s => s.id === activeSection.id);
                            if (idx !== -1) next[idx] = { ...next[idx], shapeWidth: e.target.value };
                            return { ...prev, sections: next };
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Tinggi (px)</label>
                        <input
                          type="text"
                          placeholder="e.g. 60px"
                          className="w-full h-8 border border-[#eceae4] rounded-lg px-2 text-[10px]"
                          value={activeSection.shapeHeight || ''}
                          onChange={(e) => updateConfig(prev => {
                            const next = [...prev.sections];
                            const idx = next.findIndex(s => s.id === activeSection.id);
                            if (idx !== -1) next[idx] = { ...next[idx], shapeHeight: e.target.value };
                            return { ...prev, sections: next };
                          })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Warna Shape</label>
                      <input
                        type="color"
                        className="w-full h-8 border border-[#eceae4] rounded cursor-pointer"
                        value={activeSection.shapeColor || '#f43f5e'}
                        onChange={(e) => updateConfig(prev => {
                          const next = [...prev.sections];
                          const idx = next.findIndex(s => s.id === activeSection.id);
                          if (idx !== -1) next[idx] = { ...next[idx], shapeColor: e.target.value };
                          return { ...prev, sections: next };
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Perataan Shape</label>
                      <select
                        className="w-full h-8 border border-[#eceae4] rounded-lg px-1 text-[10px] font-semibold"
                        value={activeSection.shapeAlign || 'center'}
                        onChange={(e) => updateConfig(prev => {
                          const next = [...prev.sections];
                          const idx = next.findIndex(s => s.id === activeSection.id);
                          if (idx !== -1) next[idx] = { ...next[idx], shapeAlign: e.target.value as any };
                          return { ...prev, sections: next };
                        })}
                      >
                        <option value="left">Kiri</option>
                        <option value="center">Tengah</option>
                        <option value="right">Kanan</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* For canvas widget */}
                {activeSection.type === 'canvas' && (
                  <div className="border-t border-[#eceae4] pt-4 space-y-4">
                    <h4 className="text-[10px] font-bold text-[#6b6b6b] uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-500" />
                      Pengaturan Figma Canvas
                    </h4>

                    {/* Canvas Height */}
                    <div>
                      <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Tinggi Kanvas (e.g. 500px / 80vh)</label>
                      <input
                        type="text"
                        placeholder="e.g. 500px"
                        className="w-full h-8 border border-[#eceae4] rounded-lg px-2 text-[10px]"
                        value={activeSection.canvasHeight || '500px'}
                        onChange={(e) => updateConfig(prev => {
                          const next = [...prev.sections];
                          const idx = next.findIndex(s => s.id === activeSection.id);
                          if (idx !== -1) next[idx] = { ...next[idx], canvasHeight: e.target.value };
                          return { ...prev, sections: next };
                        })}
                      />
                    </div>

                    {/* Add Layer Section */}
                    <div className="bg-[#fcfbfa] border border-[#eceae4] p-3 rounded-xl space-y-2">
                      <div className="text-[9px] font-bold text-[#6b6b6b] uppercase">Tambah Layer Baru</div>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          onClick={() => addLayer('text')}
                          className="flex flex-col items-center justify-center p-2 border border-[#eceae4] hover:border-blue-400 hover:bg-blue-50/10 rounded-lg transition-colors text-[9px] font-bold text-stone-600 cursor-pointer"
                        >
                          <span className="text-xs font-mono mb-0.5">T</span>
                          Teks
                        </button>
                        <button
                          onClick={() => addLayer('image')}
                          className="flex flex-col items-center justify-center p-2 border border-[#eceae4] hover:border-blue-400 hover:bg-blue-50/10 rounded-lg transition-colors text-[9px] font-bold text-stone-600 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5 mb-0.5" />
                          Gambar
                        </button>
                        <button
                          onClick={() => addLayer('shape')}
                          className="flex flex-col items-center justify-center p-2 border border-[#eceae4] hover:border-blue-400 hover:bg-blue-50/10 rounded-lg transition-colors text-[9px] font-bold text-stone-600 cursor-pointer"
                        >
                          <span className="w-3.5 h-3.5 border border-stone-600 rounded-sm mb-0.5" />
                          Shape
                        </button>
                      </div>
                    </div>

                    {/* Layers List */}
                    <div className="space-y-2">
                      <div className="text-[9px] font-bold text-[#6b6b6b] uppercase">Daftar Layer ({activeSection.layers?.length || 0})</div>
                      <div className="max-h-40 overflow-y-auto border border-[#eceae4] rounded-lg divide-y divide-[#eceae4]">
                        {(activeSection.layers || []).length === 0 ? (
                          <div className="p-3 text-center text-[10px] text-stone-400 font-medium">Belum ada layer. Klik tambah di atas!</div>
                        ) : (
                          (activeSection.layers || []).map((layer) => {
                            const isSelected = selectedLayerId === layer.id;
                            const displayName = layer.type === 'text' 
                              ? `Teks: ${layer.textTitle || 'untitled'}`
                              : layer.type === 'image' 
                                ? 'Gambar Asset'
                                : `Shape: ${layer.shapeType || 'rectangle'}`;

                            return (
                              <div
                                key={layer.id}
                                onClick={() => setSelectedLayerId(layer.id)}
                                className={`flex items-center justify-between p-2 cursor-pointer transition-colors ${
                                  isSelected ? 'bg-blue-50/30 text-blue-600 font-bold' : 'hover:bg-stone-50 text-stone-600 font-normal'
                                }`}
                              >
                                <span className="text-[10px] truncate flex-1 pr-2">{displayName}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteLayer(layer.id);
                                  }}
                                  className="text-stone-400 hover:text-rose-500 p-0.5 cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Layer Inspector Panel */}
                    {(() => {
                      const layer = (activeSection.layers || []).find(l => l.id === selectedLayerId);
                      if (!layer) {
                        return (
                          <div className="bg-stone-50 border border-[#eceae4] p-3 rounded-xl text-center text-[10px] text-stone-500 leading-normal font-normal">
                            Pilih salah satu layer di atas untuk memunculkan Figma properties panel.
                          </div>
                        );
                      }

                      return (
                        <div className="border-t border-[#eceae4] pt-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">Figma Properties Inspector</div>
                            <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-mono font-bold uppercase">{layer.type}</span>
                          </div>

                          {/* Position Type Toggle */}
                          <div className="space-y-1.5">
                            <label className="block text-[8px] text-[#6b6b6b] uppercase">Positioning (Tata Letak)</label>
                            <div className="grid grid-cols-2 gap-1 border border-[#eceae4] p-1 rounded-lg bg-stone-50 text-[9px] font-bold">
                              <button
                                onClick={() => handleUpdateLayer(activeSection.id, layer.id, { position: 'absolute' })}
                                className={`py-1.5 rounded transition-all cursor-pointer text-center ${
                                  layer.position !== 'relative' 
                                    ? 'bg-blue-500 text-white shadow-sm' 
                                    : 'text-stone-600 hover:bg-stone-200'
                                }`}
                              >
                                Absolute (Bebas)
                              </button>
                              <button
                                onClick={() => handleUpdateLayer(activeSection.id, layer.id, { position: 'relative' })}
                                className={`py-1.5 rounded transition-all cursor-pointer text-center ${
                                  layer.position === 'relative' 
                                    ? 'bg-blue-500 text-white shadow-sm' 
                                    : 'text-stone-600 hover:bg-stone-200'
                                }`}
                              >
                                Relative (Flow)
                              </button>
                            </div>
                          </div>

                          {/* Alignment Row */}
                          {layer.position !== 'relative' && (
                            <div className="space-y-1.5">
                              <label className="block text-[8px] text-[#6b6b6b] uppercase">Alignment</label>
                              <div className="grid grid-cols-6 gap-1 border border-[#eceae4] p-1 rounded-lg bg-stone-50">
                                <button
                                  onClick={() => alignLayer('left')}
                                  title="Align Left"
                                  className="flex justify-center items-center h-6 hover:bg-stone-200 rounded text-stone-600 cursor-pointer font-bold"
                                >
                                  |←
                                </button>
                                <button
                                  onClick={() => alignLayer('h-center')}
                                  title="Align Horizontal Center"
                                  className="flex justify-center items-center h-6 hover:bg-stone-200 rounded text-stone-600 font-bold cursor-pointer"
                                >
                                  →|←
                                </button>
                                <button
                                  onClick={() => alignLayer('right')}
                                  title="Align Right"
                                  className="flex justify-center items-center h-6 hover:bg-stone-200 rounded text-stone-600 font-bold cursor-pointer"
                                >
                                  →|
                                </button>
                                <button
                                  onClick={() => alignLayer('top')}
                                  title="Align Top"
                                  className="flex justify-center items-center h-6 hover:bg-stone-200 rounded text-stone-600 rotate-90 cursor-pointer font-bold"
                                >
                                  |←
                                </button>
                                <button
                                  onClick={() => alignLayer('v-center')}
                                  title="Align Vertical Center"
                                  className="flex justify-center items-center h-6 hover:bg-stone-200 rounded text-stone-600 rotate-90 font-bold cursor-pointer"
                                >
                                  →|←
                                </button>
                                <button
                                  onClick={() => alignLayer('bottom')}
                                  title="Align Bottom"
                                  className="flex justify-center items-center h-6 hover:bg-stone-200 rounded text-stone-600 rotate-90 cursor-pointer font-bold"
                                >
                                  →|
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Dimension Grid X Y W H R Z */}
                          <div className="space-y-1.5">
                            <label className="block text-[8px] text-[#6b6b6b] uppercase">Tata Letak & Ukuran (%)</label>
                            <div className="grid grid-cols-3 gap-1.5">
                              <div>
                                <label className="block text-[8px] text-stone-500 mb-0.5">X (Left %)</label>
                                {layer.position === 'relative' ? (
                                  <input
                                    type="text"
                                    disabled
                                    className="w-full h-7 border border-[#eceae4] rounded px-1 text-[9px] font-semibold bg-stone-100 text-stone-400 select-none cursor-not-allowed"
                                    value="Auto (Center)"
                                  />
                                ) : (
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    className="w-full h-7 border border-[#eceae4] rounded px-1 text-[10px] font-mono font-semibold"
                                    value={layer.left}
                                    onChange={(e) => handleUpdateLayer(activeSection.id, layer.id, { left: parseFloat(e.target.value) || 0 })}
                                  />
                                )}
                              </div>
                              <div>
                                <label className="block text-[8px] text-stone-500 mb-0.5">Y (Top %)</label>
                                {layer.position === 'relative' ? (
                                  <input
                                    type="text"
                                    disabled
                                    className="w-full h-7 border border-[#eceae4] rounded px-1 text-[9px] font-semibold bg-stone-100 text-stone-400 select-none cursor-not-allowed"
                                    value="Auto (Flow)"
                                  />
                                ) : (
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    className="w-full h-7 border border-[#eceae4] rounded px-1 text-[10px] font-mono font-semibold"
                                    value={layer.top}
                                    onChange={(e) => handleUpdateLayer(activeSection.id, layer.id, { top: parseFloat(e.target.value) || 0 })}
                                  />
                                )}
                              </div>
                              <div>
                                <label className="block text-[8px] text-stone-500 mb-0.5">W (Width %)</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="100"
                                  step="0.1"
                                  className="w-full h-7 border border-[#eceae4] rounded px-1 text-[10px] font-mono font-semibold"
                                  value={layer.width}
                                  onChange={(e) => handleUpdateLayer(activeSection.id, layer.id, { width: parseFloat(e.target.value) || 5 })}
                                />
                              </div>
                              <div>
                                <label className="block text-[8px] text-stone-500 mb-0.5">H (Height %)</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="100"
                                  step="0.1"
                                  className="w-full h-7 border border-[#eceae4] rounded px-1 text-[10px] font-mono font-semibold"
                                  value={layer.height}
                                  onChange={(e) => handleUpdateLayer(activeSection.id, layer.id, { height: parseFloat(e.target.value) || 5 })}
                                />
                              </div>
                              <div>
                                <label className="block text-[8px] text-stone-500 mb-0.5">R (Rotasi deg)</label>
                                <input
                                  type="number"
                                  min="0"
                                  max="360"
                                  className="w-full h-7 border border-[#eceae4] rounded px-1 text-[10px] font-mono font-semibold"
                                  value={layer.rotate || 0}
                                  onChange={(e) => handleUpdateLayer(activeSection.id, layer.id, { rotate: parseInt(e.target.value, 10) || 0 })}
                                />
                              </div>
                              <div>
                                <label className="block text-[8px] text-stone-500 mb-0.5">Z (Index)</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="999"
                                  className="w-full h-7 border border-[#eceae4] rounded px-1 text-[10px] font-mono font-semibold"
                                  value={layer.zIndex || 1}
                                  onChange={(e) => handleUpdateLayer(activeSection.id, layer.id, { zIndex: parseInt(e.target.value, 10) || 1 })}
                                />
                              </div>
                            </div>
                          </div>

                          {/* ── TYPE SPECIFIC PROPERTIES ── */}

                          {/* TEXT LAYER inspector */}
                          {layer.type === 'text' && (
                            <div className="space-y-3 border-t border-[#eceae4] pt-3">
                              <div>
                                <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Konten Teks</label>
                                <textarea
                                  className="w-full h-16 border border-[#eceae4] rounded p-1.5 text-[10px] font-semibold bg-white"
                                  value={layer.textTitle || ''}
                                  onChange={(e) => handleUpdateLayer(activeSection.id, layer.id, { textTitle: e.target.value })}
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1 font-bold">Warna Font</label>
                                  <input
                                    type="color"
                                    className="w-full h-7 border border-[#eceae4] rounded cursor-pointer bg-white"
                                    value={layer.color || '#1c1c1c'}
                                    onChange={(e) => handleUpdateLayer(activeSection.id, layer.id, { color: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1 font-bold">Perataan</label>
                                  <select
                                    className="w-full h-7 border border-[#eceae4] rounded text-[10px] font-bold px-1 bg-white"
                                    value={layer.textAlign || 'center'}
                                    onChange={(e) => handleUpdateLayer(activeSection.id, layer.id, { textAlign: e.target.value as any })}
                                  >
                                    <option value="left">Kiri</option>
                                    <option value="center">Tengah</option>
                                    <option value="right">Kanan</option>
                                  </select>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Font Family</label>
                                  <select
                                    className="w-full h-7 border border-[#eceae4] rounded text-[10px] font-bold px-1 bg-white"
                                    value={layer.fontFamily || ''}
                                    onChange={(e) => handleUpdateLayer(activeSection.id, layer.id, { fontFamily: e.target.value })}
                                  >
                                    <option value="">Default (Inherit)</option>
                                    <option value="Playfair Display">Playfair Display (Serif)</option>
                                    <option value="Dancing Script">Dancing Script (Script)</option>
                                    <option value="Montserrat">Montserrat (Modern)</option>
                                    <option value="Inter">Inter (Sleek)</option>
                                    <option value="Great Vibes">Great Vibes (Elegant)</option>
                                    <option value="Alex Brush">Alex Brush (Calligraphy)</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Ketebalan</label>
                                  <select
                                    className="w-full h-7 border border-[#eceae4] rounded text-[10px] font-bold px-1 bg-white"
                                    value={layer.fontWeight || 'bold'}
                                    onChange={(e) => handleUpdateLayer(activeSection.id, layer.id, { fontWeight: e.target.value })}
                                  >
                                    <option value="normal">Normal</option>
                                    <option value="semibold">Semibold</option>
                                    <option value="bold">Bold</option>
                                    <option value="extrabold">Extra Bold</option>
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Ukuran Font (e.g. 1.2rem, 16px)</label>
                                <input
                                  type="text"
                                  className="w-full h-7 border border-[#eceae4] rounded px-2 text-[10px] bg-white font-semibold"
                                  value={layer.fontSize || '1.2rem'}
                                  onChange={(e) => handleUpdateLayer(activeSection.id, layer.id, { fontSize: e.target.value })}
                                />
                              </div>
                            </div>
                          )}

                          {/* IMAGE LAYER inspector */}
                          {layer.type === 'image' && (
                            <div className="space-y-3 border-t border-[#eceae4] pt-3">
                              <div>
                                <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Unggah Aset Gambar</label>
                                <label className="flex items-center justify-center gap-1.5 h-8 border border-dashed border-[#eceae4] hover:border-blue-400 hover:bg-blue-50/10 rounded-lg cursor-pointer transition-colors text-[10px] font-bold text-stone-600 bg-white">
                                  <Upload className="w-3 h-3" />
                                  Pilih Gambar
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                      const files = e.target.files;
                                      if (!files || files.length === 0) return;
                                      setIsUploading(true);
                                      const formData = new FormData();
                                      formData.append('file', files[0]);
                                      try {
                                        const res = await fetch('/api/admin/upload-theme-asset', {
                                          method: 'POST',
                                          body: formData
                                        });
                                        const data = await res.json();
                                        if (data.success && data.data) {
                                          handleUpdateLayer(activeSection.id, layer.id, { imageUrl: data.data.fileUrl });
                                          showToast('success', 'Gambar layer berhasil diunggah!');
                                        } else {
                                          showToast('error', data.message || 'Gagal mengunggah');
                                        }
                                      } catch (err) {
                                        showToast('error', 'Gagal mengunggah');
                                      } finally {
                                        setIsUploading(false);
                                      }
                                    }}
                                    disabled={isUploading}
                                  />
                                </label>
                              </div>

                              <div>
                                <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">URL Gambar</label>
                                <input
                                  type="text"
                                  placeholder="https://..."
                                  className="w-full h-7 border border-[#eceae4] rounded px-2 text-[10px] bg-white font-semibold"
                                  value={layer.imageUrl || ''}
                                  onChange={(e) => handleUpdateLayer(activeSection.id, layer.id, { imageUrl: e.target.value })}
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Corner Radius (px)</label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="w-full h-7 border border-[#eceae4] rounded px-2 text-[10px] bg-white font-semibold"
                                    value={layer.borderRadius || 0}
                                    onChange={(e) => handleUpdateLayer(activeSection.id, layer.id, { borderRadius: parseInt(e.target.value, 10) || 0 })}
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1 font-bold font-mono">Opacity (%)</label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="w-full h-7 border border-[#eceae4] rounded px-2 text-[10px] bg-white font-semibold"
                                    value={layer.opacity !== undefined ? layer.opacity : 100}
                                    onChange={(e) => handleUpdateLayer(activeSection.id, layer.id, { opacity: parseInt(e.target.value, 10) || 0 })}
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* SHAPE LAYER inspector */}
                          {layer.type === 'shape' && (
                            <div className="space-y-3 border-t border-[#eceae4] pt-3">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Tipe Shape</label>
                                  <select
                                    className="w-full h-7 border border-[#eceae4] rounded text-[10px] font-bold px-1 bg-white"
                                    value={layer.shapeType || 'rectangle'}
                                    onChange={(e) => handleUpdateLayer(activeSection.id, layer.id, { shapeType: e.target.value as any })}
                                  >
                                    <option value="rectangle">Kotak (Rectangle)</option>
                                    <option value="circle">Lingkaran (Circle)</option>
                                    <option value="line">Garis (Line)</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1 font-bold font-mono">Warna Fill</label>
                                  <input
                                    type="color"
                                    className="w-full h-7 border border-[#eceae4] rounded cursor-pointer bg-white"
                                    value={layer.shapeColor || '#f43f5e'}
                                    onChange={(e) => handleUpdateLayer(activeSection.id, layer.id, { shapeColor: e.target.value })}
                                    disabled={layer.shapeType === 'line'}
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1 font-bold">Bordir Style</label>
                                  <select
                                    className="w-full h-7 border border-[#eceae4] rounded text-[10px] font-bold px-1 bg-white"
                                    value={layer.borderStyle || 'solid'}
                                    onChange={(e) => handleUpdateLayer(activeSection.id, layer.id, { borderStyle: e.target.value })}
                                  >
                                    <option value="solid">Solid</option>
                                    <option value="dashed">Dashed</option>
                                    <option value="dotted">Dotted</option>
                                    <option value="double">Double</option>
                                    <option value="none">None</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1 font-bold">Warna Bordir</label>
                                  <input
                                    type="color"
                                    className="w-full h-7 border border-[#eceae4] rounded cursor-pointer bg-white"
                                    value={layer.borderColor || '#eceae4'}
                                    onChange={(e) => handleUpdateLayer(activeSection.id, layer.id, { borderColor: e.target.value })}
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Tebal Bordir (px)</label>
                                  <input
                                    type="number"
                                    min="0"
                                    className="w-full h-7 border border-[#eceae4] rounded px-2 text-[10px] bg-white font-semibold"
                                    value={layer.borderWidth || 1}
                                    onChange={(e) => handleUpdateLayer(activeSection.id, layer.id, { borderWidth: parseInt(e.target.value, 10) || 0 })}
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1 font-mono">Corner Radius (px)</label>
                                  <input
                                    type="number"
                                    min="0"
                                    className="w-full h-7 border border-[#eceae4] rounded px-2 text-[10px] bg-white font-semibold"
                                    value={layer.borderRadiusShape || 0}
                                    onChange={(e) => handleUpdateLayer(activeSection.id, layer.id, { borderRadiusShape: parseInt(e.target.value, 10) || 0 })}
                                    disabled={layer.shapeType === 'circle' || layer.shapeType === 'line'}
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1 font-mono">Opacity (%)</label>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  className="w-full h-7 border border-[#eceae4] rounded px-2 text-[10px] bg-white font-semibold"
                                  value={layer.opacity !== undefined ? layer.opacity : 100}
                                  onChange={(e) => handleUpdateLayer(activeSection.id, layer.id, { opacity: parseInt(e.target.value, 10) || 0 })}
                                />
                              </div>
                            </div>
                          )}

                        </div>
                      );
                    })()}

                  </div>
                )}

                {/* For wave & curved dividers */}
                {(activeSection.type === 'divider-wave' || activeSection.type === 'divider-curved' || activeSection.type === 'event' || activeSection.type === 'gifts') && (
                  <div className="border-t border-[#eceae4] pt-4 space-y-4">
                    <h4 className="text-[10px] font-bold text-[#6b6b6b] uppercase tracking-wider">Desain Lengkungan Divider</h4>
                    <div>
                      <label className="block text-[9px] text-[#6b6b6b] uppercase mb-1">Warna Isi Divider (Fill)</label>
                      <input
                        type="color"
                        className="w-full h-8 border border-[#eceae4] rounded cursor-pointer"
                        value={activeSection.dividerFill || '#fdfcf9'}
                        onChange={(e) => updateConfig(prev => {
                          const next = [...prev.sections];
                          const idx = next.findIndex(s => s.id === activeSection.id);
                          if (idx !== -1) next[idx] = { ...next[idx], dividerFill: e.target.value };
                          return { ...prev, sections: next };
                        })}
                      />
                      <p className="text-[8px] text-[#6b6b6b] mt-1 leading-normal">
                        Atur warna ini sama dengan warna latar seksi di atas/bawahnya agar batas lengkungan menyatu sempurna!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="border-t border-[#eceae4] pt-10 text-center text-[#6b6b6b] font-medium leading-relaxed">
                Pilih salah satu seksi di atas untuk mulai menyesuaikan konfigurasinya.
              </div>
            )}

            {/* Ambient background particles selector */}
            <div className="border-t border-[#eceae4] pt-5 space-y-4">
              <h4 className="text-[10px] font-bold text-[#6b6b6b] uppercase tracking-wider mb-2">Dekorasi Ambien Latar Belakang</h4>
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#6b6b6b] mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  Efek Partikel Latar
                </label>
                <select
                  className="w-full h-10 border border-[#eceae4] rounded-lg px-2 text-[#1c1c1c] font-semibold"
                  value={config.ambientEffect}
                  onChange={(e) => updateConfig(prev => ({
                    ...prev,
                    ambientEffect: e.target.value as any
                  }))}
                >
                  <option value="none">Tanpa Efek Partikel</option>
                  <option value="sparkles">Falling Sparkles (Bintang Javanese)</option>
                  <option value="gold-dust">Gold Dust Particles (Sundanese Gold)</option>
                </select>
              </div>
            </div>

          </div>
        </aside>

      </div>
    </div>
  );
}
