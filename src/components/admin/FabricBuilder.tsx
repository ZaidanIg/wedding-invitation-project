'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, Save, Type, Image as ImageIcon, Circle, 
  Trash2, Square, Settings, ArrowUp, ArrowDown, Scissors, MinusCircle, Blend, RotateCcw,
  MousePointer2, LayoutGrid, Link2
} from 'lucide-react';
import * as fabric from 'fabric';

export type SectionType = 'HeroSection' | 'CoupleSection' | 'EventSection' | 'LocationSection' | 'LoveStorySection' | 'GiftSection' | 'RSVPSection' | 'FooterSection';

export interface ThemeSection {
  id: string;
  type: SectionType;
  height: number;
}

export default function FabricBuilder() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [sections, setSections] = useState<ThemeSection[]>([
    { id: 'sec-init', type: 'HeroSection', height: 812 }
  ]);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);
  const [canvasObjects, setCanvasObjects] = useState<fabric.Object[]>([]);
  
  const [mounted, setMounted] = useState(false);
  const [assets, setAssets] = useState<string[]>([]);
  const [isEditingMask, setIsEditingMask] = useState(false);

  const canvasHeight = sections.reduce((sum, sec) => sum + sec.height, 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    const fCanvas = new fabric.Canvas(canvasRef.current, {
      width: 375,
      height: canvasHeight,
      backgroundColor: '#f5f3ee',
      preserveObjectStacking: true,
    });

    setCanvas(fCanvas);

    fCanvas.on('selection:created', () => setActiveObject(fCanvas.getActiveObject() || null));
    fCanvas.on('selection:updated', () => setActiveObject(fCanvas.getActiveObject() || null));
    fCanvas.on('selection:cleared', () => setActiveObject(null));
    
    fCanvas.on('mouse:down', (e) => {
      const target = e.target as any;
      if (target && target.id) {
        target.__lastLeft = target.left;
        target.__lastTop = target.top;
      }
    });

    fCanvas.on('object:moving', (e) => {
      const target = e.target as any;
      if (!target || !target.id) return;
      
      const deltaX = target.left - (target.__lastLeft || target.left);
      const deltaY = target.top - (target.__lastTop || target.top);
      
      const children = fCanvas.getObjects().filter(o => (o as any).parentId === target.id);
      children.forEach(child => {
        child.set({ left: (child.left || 0) + deltaX, top: (child.top || 0) + deltaY });
        child.setCoords();
      });
      
      target.__lastLeft = target.left;
      target.__lastTop = target.top;
    });

    fCanvas.on('object:modified', (e) => {
      setActiveObject(fCanvas.getActiveObject() || null);
      setCanvasObjects([...fCanvas.getObjects()].reverse());
      
      const target = e.target as any;
      if (target && target.parentId) {
        // Child was modified, we need to update container bounds
        // Since we don't have updateContainerBounds here, we duplicate logic briefly or just trigger a custom event
        const container = fCanvas.getObjects().find(o => (o as any).id === target.parentId);
        if (container) {
          const children = fCanvas.getObjects().filter(o => (o as any).parentId === target.parentId);
          let minLeft = Infinity;
          let minTop = Infinity;
          let maxRight = -Infinity;
          let maxBottom = -Infinity;
          const padding = 20;
          children.forEach(child => {
            child.setCoords();
            const rect = child.getBoundingRect();
            if (rect.left < minLeft) minLeft = rect.left;
            if (rect.top < minTop) minTop = rect.top;
            if (rect.left + rect.width > maxRight) maxRight = rect.left + rect.width;
            if (rect.top + rect.height > maxBottom) maxBottom = rect.top + rect.height;
          });
          container.set({
            left: minLeft - padding,
            top: minTop - padding,
            width: maxRight - minLeft + (padding * 2),
            height: maxBottom - minTop + (padding * 2),
            scaleX: 1,
            scaleY: 1
          });
          container.setCoords();
          fCanvas.renderAll();
        }
      }
    });
    
    const syncLayers = () => setCanvasObjects([...fCanvas.getObjects()].reverse());
    fCanvas.on('object:added', syncLayers);
    fCanvas.on('object:removed', syncLayers);

    return () => {
      fCanvas.dispose();
    };
  }, [mounted]); // Initialize once

  // Update canvas height dynamically when sections change
  useEffect(() => {
    if (canvas) {
      canvas.setDimensions({ width: 375, height: canvasHeight });
    }
  }, [canvasHeight, canvas]);

  const addSection = (type: SectionType) => {
    setSections(prev => [...prev, { id: `sec-${Date.now()}`, type, height: 812 }]);
    setShowSectionDropdown(false);
    
    setTimeout(() => {
      document.getElementById('canvas-scroll-container')?.scrollTo({
        top: document.getElementById('canvas-scroll-container')?.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  const updateSectionHeight = (id: string, height: number) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, height: Math.max(100, height) } : s));
  };

  const deleteSection = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (sections.length === 1) return alert('Tidak bisa menghapus section terakhir.');
    if (confirm('Hapus section ini?')) {
      setSections(prev => prev.filter(s => s.id !== id));
    }
  };

  // -- Toolbar Actions --

  const addText = () => {
    if (!canvas) return;
    const scrollContainer = document.getElementById('canvas-scroll-container');
    const scrollTop = scrollContainer ? scrollContainer.scrollTop : 0;
    
    const text = new fabric.IText('Teks Baru', {
      left: 100, top: scrollTop + 100, fontFamily: 'Playfair Display', fill: '#000000', fontSize: 32,
    }) as any;
    text.customType = 'Text Layer';
    
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const addRectangle = () => {
    if (!canvas) return;
    const scrollContainer = document.getElementById('canvas-scroll-container');
    const scrollTop = scrollContainer ? scrollContainer.scrollTop : 0;

    const rect = new fabric.Rect({
      left: 100, top: scrollTop + 100, fill: '#cccccc', width: 100, height: 100, rx: 8, ry: 8,
    }) as any;
    rect.customType = 'Shape Layer';
    
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
  };

  const addCircle = () => {
    if (!canvas) return;
    const scrollContainer = document.getElementById('canvas-scroll-container');
    const scrollTop = scrollContainer ? scrollContainer.scrollTop : 0;

    const circle = new fabric.Circle({
      left: 100, top: scrollTop + 100, fill: '#cccccc', radius: 50,
    }) as any;
    circle.customType = 'Shape Layer';
    
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
  };

  const addButton = () => {
    if (!canvas) return;
    const scrollContainer = document.getElementById('canvas-scroll-container');
    const scrollTop = scrollContainer ? scrollContainer.scrollTop : 0;

    const rect = new fabric.Rect({
      left: 100, top: scrollTop + 100, width: 160, height: 48, fill: '#10b981', rx: 24, ry: 24
    }) as any;
    rect.customType = 'Shape Layer';
    
    const text = new fabric.IText('Button', {
      left: 140, top: scrollTop + 115, fontFamily: 'Inter', fill: '#ffffff', fontSize: 16, fontWeight: 'bold'
    }) as any;
    text.customType = 'Text Layer';
    
    canvas.add(rect, text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const addGallery = () => {
    if (!canvas) return;
    const scrollContainer = document.getElementById('canvas-scroll-container');
    const scrollTop = scrollContainer ? scrollContainer.scrollTop : 0;

    const containerId = 'gal_' + Date.now();
    const rect = new fabric.Rect({
      left: 37.5, top: scrollTop + 100, width: 300, height: 200, fill: '#f0f0f0', stroke: '#cccccc', strokeDashArray: [5, 5], strokeWidth: 2
    }) as any;
    
    rect.customType = 'Gallery Layer';
    rect.id = containerId;
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
  };

  const updateContainerBounds = (containerId: string) => {
    if (!canvas) return;
    const container = canvas.getObjects().find(o => (o as any).id === containerId);
    if (!container) return;
    
    const children = canvas.getObjects().filter(o => (o as any).parentId === containerId);
    if (children.length === 0) return;
    
    let minLeft = Infinity;
    let minTop = Infinity;
    let maxRight = -Infinity;
    let maxBottom = -Infinity;
    
    const padding = 20; // Padding inside container
    
    children.forEach(child => {
      child.setCoords();
      const rect = child.getBoundingRect();
      
      if (rect.left < minLeft) minLeft = rect.left;
      if (rect.top < minTop) minTop = rect.top;
      if (rect.left + rect.width > maxRight) maxRight = rect.left + rect.width;
      if (rect.top + rect.height > maxBottom) maxBottom = rect.top + rect.height;
    });
    
    container.set({
      left: minLeft - padding,
      top: minTop - padding,
      width: maxRight - minLeft + (padding * 2),
      height: maxBottom - minTop + (padding * 2),
      scaleX: 1,
      scaleY: 1
    });
    
    container.setCoords();
  };

  const autoLayoutGalleryChildren = (containerId: string) => {
    if (!canvas) return;
    const container = canvas.getObjects().find(o => (o as any).id === containerId);
    if (!container) return;
    
    const cLeft = container.left || 0;
    const cTop = container.top || 0;
    const cWidth = (container.width || 0) * (container.scaleX || 1);
    
    const children = canvas.getObjects().filter(o => (o as any).parentId === containerId);
    if (children.length === 0) return;
    
    const gap = 10;
    const padding = 10;
    
    children.forEach((child, i) => {
      (child as any).dataBinding = `gallery.images[${i}]`;
    });
    
    if (children.length === 1) {
      const child = children[0] as fabric.Image;
      const targetW = cWidth * 0.8;
      child.scaleToWidth(targetW);
      child.set({
        left: cLeft + padding,
        top: cTop + padding
      });
    } else if (children.length === 2) {
      const availW = cWidth - (padding * 2) - gap;
      const colW = availW / 2;
      children.forEach((child, i) => {
        const img = child as fabric.Image;
        img.scaleToWidth(colW);
        img.set({
          left: cLeft + padding + (i * (colW + gap)),
          top: cTop + padding
        });
      });
    } else {
      const cols = 2;
      const availW = cWidth - (padding * 2) - gap;
      const colW = availW / cols;
      
      children.forEach((child, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const img = child as fabric.Image;
        img.scaleToWidth(colW);
        img.set({
          left: cLeft + padding + (col * (colW + gap)),
          top: cTop + padding + (row * (colW + gap))
        });
      });
    }
    
    updateContainerBounds(containerId);
    canvas.renderAll();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon unggah file gambar yang valid.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setAssets(prev => [...prev, dataUrl]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleGalleryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvas || !activeObject || (activeObject as any).customType !== 'Gallery Layer') return;

    const containerId = (activeObject as any).id;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      
      const imgElement = new window.Image();
      imgElement.src = dataUrl;
      imgElement.onload = () => {
        const fabricImage = new fabric.Image(imgElement, {
          left: 0,
          top: 0
        }) as any;
        fabricImage.customType = 'Gallery Image';
        fabricImage.parentId = containerId;
        
        canvas.add(fabricImage);
        
        // Auto layout
        autoLayoutGalleryChildren(containerId);
        
        // Refresh properties panel
        setCanvasObjects([...canvas.getObjects()].reverse());
      };
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const addImageFromAsset = (dataUrl: string) => {
    if (!canvas) return;
    const scrollContainer = document.getElementById('canvas-scroll-container');
    const scrollTop = scrollContainer ? scrollContainer.scrollTop : 0;

    const imgElement = new window.Image();
    imgElement.src = dataUrl;
    imgElement.onload = () => {
      const img = new fabric.Image(imgElement, { left: 50, top: scrollTop + 50 }) as any;
      img.customType = 'Image Layer';
      if (img.width && img.width > 250) {
        img.scaleToWidth(250);
      }
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
    };
  };

  const deleteActiveObject = () => {
    if (!canvas || !activeObject) return;
    if (activeObject.type === 'activeSelection') {
      const objects = (activeObject as fabric.ActiveSelection).getObjects();
      objects.forEach(obj => canvas.remove(obj));
    } else {
      canvas.remove(activeObject);
    }
    canvas.discardActiveObject();
    canvas.renderAll();
    setActiveObject(null);
  };

  const handleSave = () => {
    if (!canvas) return;
    
    const exportData = {
      version: '1.0',
      canvasHeight,
      sections,
      config: canvas.toObject(['customType', 'dataBinding', 'galleryLayout', 'id', 'parentId'])
    };
    
    console.log('Fabric Theme Export:', exportData);
    alert('Desain disimpan (lihat di Browser Console)');
  };

  const updateActiveObject = (property: string, value: any) => {
    if (!canvas || !activeObject) return;
    
    if (property.startsWith('shadow.')) {
      const shadowProp = property.split('.')[1];
      const currentShadow = activeObject.shadow as fabric.Shadow || new fabric.Shadow({ color: 'rgba(0,0,0,0.5)', blur: 10, offsetX: 5, offsetY: 5 });
      (currentShadow as any)[shadowProp] = value;
      activeObject.set('shadow', currentShadow);
    } else {
      activeObject.set(property as keyof fabric.Object, value);
    }
    
    canvas.renderAll();
    setActiveObject(canvas.getActiveObject() || null);
    setCanvasObjects([...canvas.getObjects()].reverse());
  };

  // -- Advanced Compositing & Masking --

  const isMultiSelection = activeObject?.type === 'activeSelection';
  const selectedObjects = isMultiSelection ? (activeObject as fabric.ActiveSelection).getObjects() : [];
  const canMask = isMultiSelection && selectedObjects.length === 2 && 
                  selectedObjects.some(o => o.type === 'image') && 
                  selectedObjects.some(o => o.type === 'rect' || o.type === 'circle');
  const hasMask = !isMultiSelection && activeObject && !!activeObject.clipPath;

  const createMask = () => {
    if (!canvas || !canMask || !isMultiSelection) return;
    const img = selectedObjects.find(o => o.type === 'image') as fabric.Image;
    const shape = selectedObjects.find(o => o.type === 'rect' || o.type === 'circle') as fabric.Object;
    
    // Simpan properti asli ke variabel custom agar bisa dikembalikan saat release
    shape.set({
      __origFill: shape.fill,
      __origStroke: shape.stroke,
      __origOpacity: shape.opacity,
    } as any);

    // Hitung posisi relatif shape terhadap image (agar absolutePositioned = false)
    const imgCenter = img.getCenterPoint();
    const shapeCenter = shape.getCenterPoint();

    // Remove shape from canvas because it becomes a clipPath
    canvas.remove(shape);
    
    // Deselect all
    canvas.discardActiveObject();
    
    // Normalisasi shape agar tidak mencemari warna gambar dan ubah jadi relatif
    shape.set({
      left: shapeCenter.x - imgCenter.x,
      top: shapeCenter.y - imgCenter.y,
      originX: 'center',
      originY: 'center',
      fill: '#000000',
      stroke: null,
      opacity: 1,
      globalCompositeOperation: 'source-over',
      shadow: null,
      absolutePositioned: false
    });
    
    img.set('clipPath', shape);
    
    // Select image
    canvas.setActiveObject(img);
    canvas.renderAll();
    setActiveObject(img);
    setCanvasObjects([...canvas.getObjects()].reverse());
  };

  const applyBooleanOperation = (operation: 'destination-out' | 'destination-in' | 'source-over') => {
    if (!canvas || !activeObject) return;
    
    activeObject.set('globalCompositeOperation', operation);
    canvas.renderAll();
    setActiveObject(activeObject);
    setCanvasObjects([...canvas.getObjects()].reverse());
  };

  const releaseMask = () => {
    if (!canvas || !activeObject || !activeObject.clipPath) return;
    
    const shape = activeObject.clipPath as fabric.Object;
    activeObject.set('clipPath', undefined);
    
    const imgCenter = activeObject.getCenterPoint();
    
    // Kembalikan properti aslinya dan posisikan absolut kembali di kanvas
    const anyShape = shape as any;
    shape.set({
      left: shape.absolutePositioned ? shape.left : imgCenter.x + (shape.left || 0),
      top: shape.absolutePositioned ? shape.top : imgCenter.y + (shape.top || 0),
      originX: 'center',
      originY: 'center',
      absolutePositioned: false,
      fill: anyShape.__origFill || '#cccccc',
      stroke: anyShape.__origStroke || null,
      opacity: anyShape.__origOpacity ?? 1
    });

    setIsEditingMask(false);
    activeObject.set('opacity', 1);

    // Add shape back to canvas
    canvas.add(shape);
    canvas.renderAll();
    
    // Update state
    setActiveObject(activeObject);
    setCanvasObjects([...canvas.getObjects()].reverse());
  };

  const toggleEditMask = () => {
    if (!canvas || !activeObject || !activeObject.clipPath) return;
    const shape = activeObject.clipPath;

    if (isEditingMask) {
      // Done editing. Convert from absolute back to relative.
      const imgCenter = activeObject.getCenterPoint();
      shape.set({
        left: (shape.left || 0) - imgCenter.x,
        top: (shape.top || 0) - imgCenter.y,
        absolutePositioned: false
      });
      setIsEditingMask(false);
      activeObject.set('opacity', 1);
    } else {
      // Start editing. Convert from relative to absolute.
      const imgCenter = activeObject.getCenterPoint();
      shape.set({
        left: imgCenter.x + (shape.left || 0),
        top: imgCenter.y + (shape.top || 0),
        absolutePositioned: true
      });
      setIsEditingMask(true);
      activeObject.set('opacity', 0.5);
    }
    canvas.renderAll();
  };

  const selectLayer = (obj: fabric.Object) => {
    if (!canvas) return;
    canvas.setActiveObject(obj);
    canvas.renderAll();
  };

  const moveLayerUp = (e: React.MouseEvent, obj: fabric.Object) => {
    e.stopPropagation();
    if (!canvas) return;
    canvas.bringObjectForward(obj);
    canvas.renderAll();
    setCanvasObjects([...canvas.getObjects()].reverse());
  };

  const moveLayerDown = (e: React.MouseEvent, obj: fabric.Object) => {
    e.stopPropagation();
    if (!canvas) return;
    canvas.sendObjectBackwards(obj);
    canvas.renderAll();
    setCanvasObjects([...canvas.getObjects()].reverse());
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen w-full bg-[#1c1c1c] text-white overflow-hidden">
      <header className="h-14 bg-[#2a2a2a] border-b border-white/10 flex items-center justify-between px-6 shrink-0 z-50 shadow-md">
        <div className="flex items-center gap-4">
          <Link href="/admin/themes" className="text-white/70 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-bold">Fabric.js Theme Builder (Figma Clone)</h1>
            <p className="text-[10px] text-white/50">Single Contiguous Canvas Mode</p>
          </div>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors">
          <Save className="w-4 h-4" />
          Export JSON
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT PANEL ── */}
        <aside className="w-64 bg-[#2a2a2a] border-r border-white/10 flex flex-col shrink-0 p-4 relative z-20">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3">Add Elements</h2>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={addText} className="flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors">
              <Type className="w-5 h-5 mb-2" />
              <span className="text-[10px]">Text</span>
            </button>
            <button onClick={addRectangle} className="flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors">
              <Square className="w-5 h-5 mb-2" />
              <span className="text-[10px]">Shape</span>
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors">
              <ImageIcon className="w-5 h-5 mb-2" />
              <span className="text-[10px]">Image</span>
            </button>
            <button onClick={addButton} className="flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors">
              <MousePointer2 className="w-5 h-5 mb-2" />
              <span className="text-[10px]">Button</span>
            </button>
            <button onClick={addGallery} className="flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors">
              <LayoutGrid className="w-5 h-5 mb-2" />
              <span className="text-[10px]">Gallery</span>
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
          </div>

          <div className="mt-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3">My Assets</h2>
            {assets.length === 0 ? (
              <div className="p-4 border border-dashed border-white/10 rounded text-center">
                <p className="text-[10px] text-white/40">Belum ada aset. Klik tombol Image di atas untuk mengunggah.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto pr-1">
                {assets.map((asset, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => addImageFromAsset(asset)}
                    className="aspect-square bg-black/30 border border-white/10 rounded overflow-hidden hover:border-emerald-500 transition-colors relative group"
                  >
                    <img src={asset} alt="asset" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-[8px] font-bold">+ ADD</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-3 relative">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white/50">Sections</h2>
              <button 
                onClick={() => setShowSectionDropdown(!showSectionDropdown)}
                className="text-emerald-400 hover:text-emerald-300 text-[10px] font-bold px-2 py-1 bg-emerald-400/10 rounded"
              >
                + ADD
              </button>
              
              {showSectionDropdown && (
                <div className="absolute top-6 right-0 w-48 bg-[#333] border border-white/10 rounded-md shadow-2xl z-50 py-1 overflow-hidden">
                  {['HeroSection', 'CoupleSection', 'EventSection', 'LocationSection', 'LoveStorySection', 'GiftSection', 'RSVPSection', 'FooterSection'].map(type => (
                    <button 
                      key={type}
                      onClick={() => addSection(type as SectionType)}
                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-2 mb-6">
              {sections.map((sec, idx) => (
                <div 
                  key={sec.id}
                  className="p-2 rounded bg-white/5 border border-transparent space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium truncate">{sec.type}</span>
                    <button onClick={(e) => deleteSection(e, sec.id)} className="text-white/40 hover:text-red-400 p-1">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] text-white/50 w-16">Tinggi (px):</label>
                    <input 
                      type="number" 
                      value={sec.height} 
                      onChange={(e) => updateSectionHeight(sec.id, Number(e.target.value))}
                      className="w-full bg-[#1c1c1c] border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto border-t border-white/10 pt-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3">Layer Tree</h2>
            <div className="space-y-4">
              {sections.map((sec) => {
                // Hitung posisi absolut Y untuk mendeteksi objek di section ini
                let currentTop = 0;
                for (const s of sections) {
                  if (s.id === sec.id) break;
                  currentTop += s.height;
                }
                const sectionBottom = currentTop + sec.height;
                
                // Cari objek top-level yang berada di section ini
                const sectionTopLevelObjects = canvasObjects.filter(obj => {
                  const anyObj = obj as any;
                  if (anyObj.parentId) return false; // Skip children, we render them nested
                  const objTop = obj.top || 0;
                  return objTop >= currentTop && objTop < sectionBottom;
                });

                return (
                  <div key={sec.id} className="space-y-1">
                    <div className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded">
                      <ChevronLeft className="w-3 h-3 -rotate-90 text-white/50" />
                      <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">{sec.type}</span>
                    </div>
                    
                    {sectionTopLevelObjects.length === 0 ? (
                      <div className="pl-6 py-1"><span className="text-[10px] text-white/20 italic">Kosong</span></div>
                    ) : (
                      sectionTopLevelObjects.map((layer, idx) => {
                        const anyLayer = layer as any;
                        const isMaskedImage = layer.type === 'image' && layer.clipPath;
                        const layerName = anyLayer.customType || (isMaskedImage ? 'Frame Layer' : (layer.type === 'i-text' || layer.type === 'text' ? 'Text Layer' : 'Layer'));
                        
                        // Find children for this layer
                        const layerChildren = canvasObjects.filter(obj => (obj as any).parentId === anyLayer.id).reverse();
                        
                        return (
                          <div key={idx} className="pl-4 space-y-1">
                            <div 
                              onClick={() => selectLayer(layer)}
                              className={`flex items-center justify-between p-1.5 rounded cursor-pointer border ${activeObject === layer ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="text-[10px] truncate font-medium">
                                  {layerName === 'Text Layer' ? (layer as fabric.IText).text : layerName}
                                </span>
                                {anyLayer.dataBinding && (
                                  <span title={`Terikat ke: ${anyLayer.dataBinding}`} className="flex shrink-0">
                                    <Link2 className="w-3 h-3 text-emerald-400" />
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 shrink-0 ml-2">
                                <button onClick={(e) => moveLayerUp(e, layer)} className="text-white/40 hover:text-white p-1">
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button onClick={(e) => moveLayerDown(e, layer)} className="text-white/40 hover:text-white p-1">
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            
                            {/* Render children of this container */}
                            {layerChildren.length > 0 && (
                              <div className="pl-4 space-y-1">
                                {layerChildren.map((child, cIdx) => {
                                  const anyChild = child as any;
                                  const childName = anyChild.customType || 'Layer';
                                  return (
                                    <div 
                                      key={`child-${cIdx}`}
                                      onClick={() => selectLayer(child)}
                                      className={`flex items-center justify-between p-1.5 rounded cursor-pointer border ${activeObject === child ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-black/20 border-l border-white/10 hover:bg-white/5'}`}
                                    >
                                      <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <span className="text-[10px] text-white/70 truncate">↳ {childName}</span>
                                        {anyChild.dataBinding && (
                                          <span title={`Terikat ke: ${anyChild.dataBinding}`} className="flex shrink-0">
                                            <Link2 className="w-3 h-3 text-emerald-400" />
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Render nested Image conceptually for Frame Layer */}
                            {isMaskedImage && (
                              <div className="pl-4">
                                <div className="flex items-center justify-between p-1.5 rounded bg-black/20 border-l border-white/10">
                                  <span className="text-[10px] text-white/50 truncate">↳ Image</span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ── CENTER PANEL (Scrollable Contiguous Canvas) ── */}
        <main id="canvas-scroll-container" className="flex-1 bg-[#1a1a1a] relative overflow-auto p-12 flex flex-col items-center">
          <div className="relative shadow-2xl ring-1 ring-white/10 bg-[#f5f3ee]" style={{ width: 375, height: canvasHeight }}>
            
            {/* Fabric Canvas Wrapper (React should not mutate siblings here) */}
            <div className="absolute inset-0 z-10">
              <canvas ref={canvasRef} />
            </div>

            {/* Visual Section Dividers Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              {sections.map((sec, idx) => {
                const top = sections.slice(0, idx).reduce((sum, s) => sum + s.height, 0);
                return (
                  <div 
                    key={sec.id} 
                    className="absolute w-full border-t border-dashed border-emerald-500/50 flex items-center justify-center"
                    style={{ top }}
                  >
                    {idx > 0 && (
                      <span className="text-[10px] text-emerald-600/50 bg-[#f5f3ee] px-2 font-bold uppercase mt-[-7px]">
                        {sec.type}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </main>

        {/* ── RIGHT PANEL (Properties) ── */}
        <aside className="w-72 bg-[#2a2a2a] border-l border-white/10 shrink-0 overflow-y-auto relative z-20">
          {isMultiSelection ? (
            <div className="p-4 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h2 className="text-sm font-bold">Multiple Selection</h2>
                <button onClick={deleteActiveObject} className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-400/10 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="text-xs text-white/50 bg-white/5 p-3 rounded border border-white/10">
                <p>{selectedObjects.length} objects selected</p>
              </div>

              {canMask && (
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <h3 className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Clipping Mask</h3>
                  <p className="text-[10px] text-white/50 leading-relaxed">
                    Kombinasi Gambar dan Shape terdeteksi. Anda bisa menjadikan shape tersebut sebagai wadah (clipping mask) untuk gambar.
                  </p>
                  <button 
                    onClick={createMask}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    <Scissors className="w-4 h-4" /> Create Clipping Mask
                  </button>
                </div>
              )}
            </div>
          ) : activeObject ? (
            <div className="p-4 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h2 className="text-sm font-bold">Properties</h2>
                <button onClick={deleteActiveObject} className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-400/10 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Data Binding Panel */}
              <div className="space-y-3 pt-2">
                <h3 className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold border-b border-white/10 pb-2 flex items-center gap-2">
                  <Link2 className="w-3 h-3" /> Data Binding
                </h3>
                <div>
                  <label className="text-[10px] text-white/50 mb-1 block">Tautkan ke Data Pengantin</label>
                  <select 
                    value={(activeObject as any).dataBinding || ''} 
                    onChange={e => updateActiveObject('dataBinding', e.target.value)} 
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded px-2 py-1.5 text-xs outline-none focus:border-emerald-500"
                  >
                    <option value="">-- Tidak Ada (Statis) --</option>
                    <optgroup label="Pengantin Pria">
                      <option value="couple.groom.nickname">Nama Panggilan Pria</option>
                      <option value="couple.groom.fullname">Nama Lengkap Pria</option>
                      <option value="couple.groom.father">Nama Ayah Pria</option>
                      <option value="couple.groom.mother">Nama Ibu Pria</option>
                    </optgroup>
                    <optgroup label="Pengantin Wanita">
                      <option value="couple.bride.nickname">Nama Panggilan Wanita</option>
                      <option value="couple.bride.fullname">Nama Lengkap Wanita</option>
                      <option value="couple.bride.father">Nama Ayah Wanita</option>
                      <option value="couple.bride.mother">Nama Ibu Wanita</option>
                    </optgroup>
                    <optgroup label="Acara & Lokasi">
                      <option value="event.date">Tanggal Acara</option>
                      <option value="event.time">Waktu Acara</option>
                      <option value="event.location_name">Nama Tempat/Gedung</option>
                      <option value="event.location_address">Alamat Lengkap</option>
                      <option value="event.google_maps_url">Link Google Maps (Tombol)</option>
                    </optgroup>
                    <optgroup label="Media & Galeri">
                      <option value="couple.hero_image">Foto Utama (Hero)</option>
                      <option value="couple.gallery_images">Semua Galeri (Grid/Carousel Dinamis)</option>
                      <option value="gallery.images[0]">Foto Galeri 1 (Indeks 0)</option>
                      <option value="gallery.images[1]">Foto Galeri 2 (Indeks 1)</option>
                      <option value="gallery.images[2]">Foto Galeri 3 (Indeks 2)</option>
                      <option value="gallery.images[3]">Foto Galeri 4 (Indeks 3)</option>
                      <option value="gallery.images[4]">Foto Galeri 5 (Indeks 4)</option>
                      <option value="gallery.images[5]">Foto Galeri 6 (Indeks 5)</option>
                    </optgroup>
                  </select>
                  <p className="text-[8px] text-white/40 mt-1 leading-tight">Jika ditautkan, teks/gambar ini akan diganti secara otomatis saat undangan dirender.</p>
                </div>
              </div>

              {/* Masking & Boolean Operations Panel */}
              <div className="space-y-3 pt-2">
                <h3 className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold border-b border-white/10 pb-2">Masking & Boolean</h3>
                <div className="grid grid-cols-4 gap-2">
                  <button 
                    onClick={hasMask ? toggleEditMask : undefined}
                    title={hasMask ? (isEditingMask ? "Done Editing" : "Edit Mask") : "Tidak ada mask"}
                    disabled={!hasMask}
                    className={`flex flex-col items-center justify-center p-2 rounded transition-colors ${hasMask ? (isEditingMask ? 'bg-emerald-500 text-white' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30') : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                  >
                    <Scissors className="w-4 h-4 mb-1" />
                    <span className="text-[8px] font-bold text-center leading-tight">{isEditingMask ? 'Done' : 'Edit'}</span>
                  </button>

                  <button 
                    onClick={() => applyBooleanOperation('destination-out')}
                    title="Subtract (Erase Below)"
                    disabled={activeObject.type !== 'rect' && activeObject.type !== 'circle'}
                    className={`flex flex-col items-center justify-center p-2 rounded transition-colors ${(activeObject.type === 'rect' || activeObject.type === 'circle') ? (activeObject.globalCompositeOperation === 'destination-out' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10') : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                  >
                    <MinusCircle className="w-4 h-4 mb-1" />
                    <span className="text-[8px] font-bold text-center leading-tight">Subtract</span>
                  </button>

                  <button 
                    onClick={() => applyBooleanOperation('destination-in')}
                    title="Intersect (Mask Below)"
                    disabled={activeObject.type !== 'rect' && activeObject.type !== 'circle'}
                    className={`flex flex-col items-center justify-center p-2 rounded transition-colors ${(activeObject.type === 'rect' || activeObject.type === 'circle') ? (activeObject.globalCompositeOperation === 'destination-in' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10') : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                  >
                    <Blend className="w-4 h-4 mb-1" />
                    <span className="text-[8px] font-bold text-center leading-tight">Intersect</span>
                  </button>

                  <button 
                    onClick={() => {
                      if (hasMask) releaseMask();
                      else applyBooleanOperation('source-over');
                    }}
                    title="Release / Normal"
                    className="flex flex-col items-center justify-center p-2 rounded bg-white/5 text-white/70 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 mb-1" />
                    <span className="text-[8px] font-bold text-center leading-tight">Release</span>
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-[10px] uppercase tracking-wider text-white/50">Layout</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-white/50 mb-1 block">X (px)</label>
                    <input type="number" value={Math.round(activeObject.left || 0)} onChange={e => updateActiveObject('left', Number(e.target.value))} className="w-full bg-[#1c1c1c] border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/50 mb-1 block">Y (px)</label>
                    <input type="number" value={Math.round(activeObject.top || 0)} onChange={e => updateActiveObject('top', Number(e.target.value))} className="w-full bg-[#1c1c1c] border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/50 mb-1 block">Width</label>
                    <input type="number" value={Math.round((activeObject.width || 0) * (activeObject.scaleX || 1))} disabled className="w-full bg-[#1c1c1c] border border-white/10 rounded px-2 py-1 text-xs opacity-50 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/50 mb-1 block">Height</label>
                    <input type="number" value={Math.round((activeObject.height || 0) * (activeObject.scaleY || 1))} disabled className="w-full bg-[#1c1c1c] border border-white/10 rounded px-2 py-1 text-xs opacity-50 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/50 mb-1 block">Rotation (deg)</label>
                    <input type="number" value={Math.round(activeObject.angle || 0)} onChange={e => updateActiveObject('angle', Number(e.target.value))} className="w-full bg-[#1c1c1c] border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/50 mb-1 block">Opacity</label>
                    <input type="number" step="0.1" max="1" min="0" value={activeObject.opacity ?? 1} onChange={e => updateActiveObject('opacity', Number(e.target.value))} className="w-full bg-[#1c1c1c] border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-emerald-500" />
                  </div>
                </div>
              </div>

              {/* Blend Modes */}
              <div className="space-y-3">
                <h3 className="text-[10px] uppercase tracking-wider text-white/50">Blend Mode</h3>
                <div>
                  <select 
                    value={activeObject.globalCompositeOperation || 'source-over'} 
                    onChange={e => updateActiveObject('globalCompositeOperation', e.target.value)} 
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded px-2 py-1.5 text-xs outline-none focus:border-emerald-500"
                  >
                    <optgroup label="Standard">
                      <option value="source-over">Normal</option>
                      <option value="multiply">Multiply</option>
                      <option value="screen">Screen</option>
                      <option value="overlay">Overlay</option>
                      <option value="darken">Darken</option>
                      <option value="lighten">Lighten</option>
                      <option value="color-dodge">Color Dodge</option>
                      <option value="color-burn">Color Burn</option>
                      <option value="hard-light">Hard Light</option>
                      <option value="soft-light">Soft Light</option>
                      <option value="difference">Difference</option>
                      <option value="exclusion">Exclusion</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              {activeObject.type === 'i-text' || activeObject.type === 'text' ? (
                <div className="space-y-3">
                  <h3 className="text-[10px] uppercase tracking-wider text-white/50">Text</h3>
                  <div>
                    <label className="text-[10px] text-white/50 mb-1 block">Text Content</label>
                    <textarea value={(activeObject as fabric.IText).text} onChange={e => updateActiveObject('text', e.target.value)} className="w-full bg-[#1c1c1c] border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-emerald-500 h-20 resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-white/50 mb-1 block">Font Size</label>
                      <input type="number" value={(activeObject as fabric.IText).fontSize} onChange={e => updateActiveObject('fontSize', Number(e.target.value))} className="w-full bg-[#1c1c1c] border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/50 mb-1 block">Color</label>
                      <input type="color" value={(activeObject.fill as string) || '#000000'} onChange={e => updateActiveObject('fill', e.target.value)} className="w-full h-7 cursor-pointer bg-transparent" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/50 mb-1 block">Font Family</label>
                    <select value={(activeObject as fabric.IText).fontFamily} onChange={e => updateActiveObject('fontFamily', e.target.value)} className="w-full bg-[#1c1c1c] border border-white/10 rounded px-2 py-1.5 text-xs outline-none focus:border-emerald-500">
                      <option value="Playfair Display">Playfair Display</option>
                      <option value="Inter">Inter</option>
                      <option value="Dancing Script">Dancing Script</option>
                    </select>
                  </div>
                </div>
              ) : null}

              {(activeObject.type === 'rect' || activeObject.type === 'circle') && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-[10px] uppercase tracking-wider text-white/50">Shape</h3>
                  <div>
                    <label className="text-[10px] text-white/50 mb-1 block">Fill Color</label>
                    <input type="color" value={(activeObject.fill as string) || '#000000'} onChange={e => updateActiveObject('fill', e.target.value)} className="w-full h-7 cursor-pointer bg-transparent" />
                  </div>
                  {activeObject.type === 'rect' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-white/50 mb-1 block">Radius X</label>
                        <input type="number" value={(activeObject as fabric.Rect).rx || 0} onChange={e => updateActiveObject('rx', Number(e.target.value))} className="w-full bg-[#1c1c1c] border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-emerald-500" />
                      </div>
                      <div>
                        <label className="text-[10px] text-white/50 mb-1 block">Radius Y</label>
                        <input type="number" value={(activeObject as fabric.Rect).ry || 0} onChange={e => updateActiveObject('ry', Number(e.target.value))} className="w-full bg-[#1c1c1c] border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-emerald-500" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Smart Gallery Container Properties */}
              {(activeObject as any).customType === 'Gallery Layer' && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold border-b border-white/10 pb-2">Smart Gallery Container</h3>
                  <p className="text-[10px] text-white/50 leading-tight">Unggah foto ke wadah ini. Gambar akan ditambahkan ke kanvas dengan auto layout dan diikat secara otomatis.</p>
                  
                  <div className="pt-2">
                    <button 
                      onClick={() => galleryFileInputRef.current?.click()} 
                      className="w-full bg-white/5 border border-dashed border-white/20 rounded py-3 flex flex-col items-center justify-center hover:bg-white/10 hover:border-emerald-500 transition-colors group"
                    >
                      <ImageIcon className="w-5 h-5 mb-1 text-white/30 group-hover:text-emerald-400" />
                      <span className="text-[10px] font-bold text-white/50 group-hover:text-emerald-400">+ Add Photo to Container</span>
                    </button>
                  </div>
                  <input type="file" accept="image/*" ref={galleryFileInputRef} onChange={handleGalleryImageUpload} className="hidden" />
                </div>
              )}

              {/* Shadow Properties */}
              <div className="space-y-3 pt-2">
                <h3 className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold border-b border-white/10 pb-2">Drop Shadow</h3>
                <div className="flex items-center gap-2 mb-2">
                  <input 
                    type="checkbox" 
                    checked={!!activeObject.shadow} 
                    onChange={e => {
                      if (e.target.checked) {
                        updateActiveObject('shadow', new fabric.Shadow({ color: 'rgba(0,0,0,0.5)', blur: 10, offsetX: 5, offsetY: 5 }));
                      } else {
                        updateActiveObject('shadow', null);
                      }
                    }} 
                    className="accent-emerald-500"
                  />
                  <span className="text-[10px] text-white/70">Enable Shadow</span>
                </div>
                {activeObject.shadow && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-white/50 mb-1 block">Color (Hex)</label>
                      <input type="color" value={(activeObject.shadow as fabric.Shadow).color || '#000000'} onChange={e => updateActiveObject('shadow.color', e.target.value)} className="w-full h-7 cursor-pointer bg-transparent" />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/50 mb-1 block">Blur</label>
                      <input type="number" value={(activeObject.shadow as fabric.Shadow).blur || 0} onChange={e => updateActiveObject('shadow.blur', Number(e.target.value))} className="w-full bg-[#1c1c1c] border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/50 mb-1 block">Offset X</label>
                      <input type="number" value={(activeObject.shadow as fabric.Shadow).offsetX || 0} onChange={e => updateActiveObject('shadow.offsetX', Number(e.target.value))} className="w-full bg-[#1c1c1c] border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/50 mb-1 block">Offset Y</label>
                      <input type="number" value={(activeObject.shadow as fabric.Shadow).offsetY || 0} onChange={e => updateActiveObject('shadow.offsetY', Number(e.target.value))} className="w-full bg-[#1c1c1c] border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-emerald-500" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 flex flex-col items-center justify-center h-full text-center opacity-50">
              <Settings className="w-8 h-8 mb-4" />
              <p className="text-xs">Pilih elemen di atas kanvas untuk melihat propertinya.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
