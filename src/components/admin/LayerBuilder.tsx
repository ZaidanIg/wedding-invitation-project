'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Rnd } from 'react-rnd';
import { 
  ChevronLeft, Save, Plus, Type, Image as ImageIcon, Circle, 
  Trash2, ArrowUp, ArrowDown, Settings 
} from 'lucide-react';

export interface CanvasLayer {
  id: string;
  type: 'text' | 'image' | 'shape';
  name: string;
  x: number; // px relative to section 375x812
  y: number; // px
  width: number; // px
  height: number; // px
  zIndex: number;
  
  content?: string;
  fontSize?: number; // px
  color?: string;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  
  imageUrl?: string;
  borderRadius?: number;
  opacity?: number;
  
  shapeType?: 'rectangle' | 'circle';
  backgroundColor?: string;
}

export interface CanvasSection {
  id: string;
  name: string;
  height: number; // px
  backgroundColor: string;
  layers: CanvasLayer[];
}

export default function LayerBuilder() {
  const [sections, setSections] = useState<CanvasSection[]>([{
    id: 'sec-1',
    name: 'Cover Screen',
    height: 812,
    backgroundColor: '#f5f3ee',
    layers: []
  }]);
  
  const [activeSectionId, setActiveSectionId] = useState<string>('sec-1');
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  
  // Mounted check
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const activeSection = sections.find(s => s.id === activeSectionId);
  const activeLayer = activeSection?.layers.find(l => l.id === activeLayerId);

  const addLayer = (type: 'text' | 'image' | 'shape') => {
    if (!activeSection) return;
    
    const newLayer: CanvasLayer = {
      id: `layer-${Date.now()}`,
      name: `New ${type}`,
      type,
      x: 50,
      y: 100,
      width: type === 'text' ? 200 : 100,
      height: type === 'text' ? 50 : 100,
      zIndex: activeSection.layers.length + 1,
      
      content: type === 'text' ? 'Double click to edit' : undefined,
      fontSize: type === 'text' ? 24 : undefined,
      color: type === 'text' ? '#000000' : undefined,
      fontFamily: type === 'text' ? 'Playfair Display' : undefined,
      textAlign: type === 'text' ? 'center' : undefined,
      
      imageUrl: type === 'image' ? '/assets/dummy-image.png' : undefined,
      
      shapeType: type === 'shape' ? 'rectangle' : undefined,
      backgroundColor: type === 'shape' ? '#cccccc' : undefined,
    };

    setSections(sections.map(s => {
      if (s.id === activeSectionId) {
        return { ...s, layers: [...s.layers, newLayer] };
      }
      return s;
    }));
    setActiveLayerId(newLayer.id);
  };

  const updateLayer = (id: string, updates: Partial<CanvasLayer>) => {
    setSections(sections.map(s => {
      if (s.id === activeSectionId) {
        return {
          ...s,
          layers: s.layers.map(l => l.id === id ? { ...l, ...updates } : l)
        };
      }
      return s;
    }));
  };

  const deleteLayer = (id: string) => {
    setSections(sections.map(s => {
      if (s.id === activeSectionId) {
        return { ...s, layers: s.layers.filter(l => l.id !== id) };
      }
      return s;
    }));
    if (activeLayerId === id) setActiveLayerId(null);
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen w-full bg-[#1c1c1c] text-white overflow-hidden">
      
      {/* ── HEADER ── */}
      <header className="h-14 bg-[#2a2a2a] border-b border-white/10 flex items-center justify-between px-6 shrink-0 z-50 shadow-md">
        <div className="flex items-center gap-4">
          <Link href="/admin/themes" className="text-white/70 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-bold">Layer-Based Theme Builder (Canva Style)</h1>
            <p className="text-[10px] text-white/50">Mobile-first visual editor</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors">
          <Save className="w-4 h-4" />
          Simpan JSON
        </button>
      </header>

      {/* ── WORKSPACE ── */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* ── LEFT PANEL (Layers) ── */}
        <aside className="w-64 bg-[#2a2a2a] border-r border-white/10 flex flex-col shrink-0">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3">Add Layer</h2>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => addLayer('text')} className="flex flex-col items-center justify-center p-2 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors">
                <Type className="w-4 h-4 mb-1" />
                <span className="text-[10px]">Text</span>
              </button>
              <button onClick={() => addLayer('image')} className="flex flex-col items-center justify-center p-2 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors">
                <ImageIcon className="w-4 h-4 mb-1" />
                <span className="text-[10px]">Image</span>
              </button>
              <button onClick={() => addLayer('shape')} className="flex flex-col items-center justify-center p-2 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors">
                <Circle className="w-4 h-4 mb-1" />
                <span className="text-[10px]">Shape</span>
              </button>
            </div>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3">Layers</h2>
            <div className="space-y-1">
              {[...(activeSection?.layers || [])].sort((a,b) => b.zIndex - a.zIndex).map(layer => (
                <div 
                  key={layer.id}
                  onClick={() => setActiveLayerId(layer.id)}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer border ${activeLayerId === layer.id ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                >
                  <span className="text-xs truncate font-medium">{layer.name}</span>
                  <button onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id); }} className="text-white/40 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {activeSection?.layers.length === 0 && (
                <p className="text-xs text-white/30 text-center py-4">Belum ada layer</p>
              )}
            </div>
          </div>
        </aside>

        {/* ── CENTER PANEL (Canvas) ── */}
        <main className="flex-1 bg-[#1a1a1a] relative overflow-auto flex items-center justify-center p-8">
          <div 
            className="relative shadow-2xl overflow-hidden ring-1 ring-white/10"
            style={{ 
              width: 375, 
              height: activeSection?.height || 812, 
              backgroundColor: activeSection?.backgroundColor 
            }}
            onClick={() => setActiveLayerId(null)}
          >
            {activeSection?.layers.map(layer => (
              <Rnd
                key={layer.id}
                size={{ width: layer.width, height: layer.height }}
                position={{ x: layer.x, y: layer.y }}
                onDrag={(e, d) => {
                  // Only update if it actually moved to prevent lag
                  if (d.x !== layer.x || d.y !== layer.y) {
                    updateLayer(layer.id, { x: d.x, y: d.y });
                  }
                }}
                onDragStop={(e, d) => {
                  updateLayer(layer.id, { x: d.x, y: d.y });
                }}
                onResize={(e, direction, ref, delta, position) => {
                  updateLayer(layer.id, {
                    width: parseInt(ref.style.width),
                    height: parseInt(ref.style.height),
                    ...position,
                  });
                }}
                style={{ zIndex: layer.zIndex }}
                className={activeLayerId === layer.id ? 'ring-2 ring-emerald-500' : ''}
                onDragStart={(e: any) => { e.stopPropagation(); setActiveLayerId(layer.id); }}
              >
                {/* Render Layer Content based on type */}
                <div className="w-full h-full relative pointer-events-none select-none" style={{ opacity: layer.opacity ?? 1 }}>
                  {layer.type === 'shape' && (
                    <div 
                      className="w-full h-full"
                      style={{ 
                        backgroundColor: layer.backgroundColor,
                        borderRadius: layer.shapeType === 'circle' ? '50%' : (layer.borderRadius || 0),
                      }}
                    />
                  )}
                  {layer.type === 'image' && (
                    <div className="w-full h-full bg-stone-300 flex items-center justify-center overflow-hidden" style={{ borderRadius: layer.borderRadius || 0 }}>
                      <span className="text-[10px] text-stone-500">Img Placeholder</span>
                    </div>
                  )}
                  {layer.type === 'text' && (
                    <div 
                      className="w-full h-full flex flex-col items-center justify-center leading-none"
                      style={{ 
                        color: layer.color, 
                        fontSize: layer.fontSize,
                        fontFamily: layer.fontFamily,
                        textAlign: layer.textAlign,
                      }}
                    >
                      {layer.content}
                    </div>
                  )}
                </div>
              </Rnd>
            ))}
          </div>
        </main>

        {/* ── RIGHT PANEL (Properties) ── */}
        <aside className="w-72 bg-[#2a2a2a] border-l border-white/10 shrink-0 overflow-y-auto">
          {activeLayer ? (
            <div className="p-4 space-y-6">
              <h2 className="text-sm font-bold border-b border-white/10 pb-2">Properties</h2>
              
              {/* Position & Size */}
              <div className="space-y-3">
                <h3 className="text-[10px] uppercase tracking-wider text-white/50">Layout</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-white/50 mb-1 block">X (px)</label>
                    <input type="number" value={Math.round(activeLayer.x)} onChange={e => updateLayer(activeLayer.id, { x: Number(e.target.value) })} className="w-full bg-[#1c1c1c] border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/50 mb-1 block">Y (px)</label>
                    <input type="number" value={Math.round(activeLayer.y)} onChange={e => updateLayer(activeLayer.id, { y: Number(e.target.value) })} className="w-full bg-[#1c1c1c] border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/50 mb-1 block">Width</label>
                    <input type="number" value={activeLayer.width} onChange={e => updateLayer(activeLayer.id, { width: Number(e.target.value) })} className="w-full bg-[#1c1c1c] border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/50 mb-1 block">Height</label>
                    <input type="number" value={activeLayer.height} onChange={e => updateLayer(activeLayer.id, { height: Number(e.target.value) })} className="w-full bg-[#1c1c1c] border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-emerald-500" />
                  </div>
                </div>
              </div>

              {/* Type Specific */}
              {activeLayer.type === 'text' && (
                <div className="space-y-3">
                  <h3 className="text-[10px] uppercase tracking-wider text-white/50">Text</h3>
                  <div>
                    <label className="text-[10px] text-white/50 mb-1 block">Content</label>
                    <textarea value={activeLayer.content} onChange={e => updateLayer(activeLayer.id, { content: e.target.value })} className="w-full bg-[#1c1c1c] border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-emerald-500 h-20 resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-white/50 mb-1 block">Font Size</label>
                      <input type="number" value={activeLayer.fontSize} onChange={e => updateLayer(activeLayer.id, { fontSize: Number(e.target.value) })} className="w-full bg-[#1c1c1c] border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/50 mb-1 block">Color</label>
                      <input type="color" value={activeLayer.color} onChange={e => updateLayer(activeLayer.id, { color: e.target.value })} className="w-full h-7 cursor-pointer bg-transparent" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/50 mb-1 block">Font Family</label>
                    <select value={activeLayer.fontFamily} onChange={e => updateLayer(activeLayer.id, { fontFamily: e.target.value })} className="w-full bg-[#1c1c1c] border border-white/10 rounded px-2 py-1.5 text-xs outline-none focus:border-emerald-500">
                      <option value="Playfair Display">Playfair Display</option>
                      <option value="Inter">Inter</option>
                      <option value="Dancing Script">Dancing Script</option>
                    </select>
                  </div>
                </div>
              )}

              {activeLayer.type === 'shape' && (
                <div className="space-y-3">
                  <h3 className="text-[10px] uppercase tracking-wider text-white/50">Shape</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-white/50 mb-1 block">Type</label>
                      <select value={activeLayer.shapeType} onChange={e => updateLayer(activeLayer.id, { shapeType: e.target.value as any })} className="w-full bg-[#1c1c1c] border border-white/10 rounded px-2 py-1.5 text-xs outline-none focus:border-emerald-500">
                        <option value="rectangle">Rectangle</option>
                        <option value="circle">Circle</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-white/50 mb-1 block">Color</label>
                      <input type="color" value={activeLayer.backgroundColor} onChange={e => updateLayer(activeLayer.id, { backgroundColor: e.target.value })} className="w-full h-7 cursor-pointer bg-transparent" />
                    </div>
                  </div>
                  {activeLayer.shapeType === 'rectangle' && (
                    <div>
                      <label className="text-[10px] text-white/50 mb-1 block">Border Radius</label>
                      <input type="number" value={activeLayer.borderRadius || 0} onChange={e => updateLayer(activeLayer.id, { borderRadius: Number(e.target.value) })} className="w-full bg-[#1c1c1c] border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-emerald-500" />
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div className="p-8 flex flex-col items-center justify-center h-full text-center opacity-50">
              <Settings className="w-8 h-8 mb-4" />
              <p className="text-xs">Pilih sebuah layer untuk melihat dan mengubah propertinya</p>
            </div>
          )}
        </aside>

      </div>
    </div>
  );
}
