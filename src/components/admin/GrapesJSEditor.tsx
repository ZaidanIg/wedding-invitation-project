'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Save, Maximize, Laptop, Smartphone, Tablet } from 'lucide-react';
import Link from 'next/link';

// We need to dynamically load grapesjs to avoid SSR issues
// since it relies heavily on window and document
let grapesjs: any;

export default function GrapesJSEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only load in browser
    if (typeof window !== 'undefined') {
      import('grapesjs').then((gjs) => {
        import('grapesjs-preset-webpage').then((preset) => {
          grapesjs = gjs.default;
          
          if (!editorRef.current) return;
          
          const e = grapesjs.init({
            container: editorRef.current,
            height: '100%',
            width: '100%',
            storageManager: false, // For PoC, disable storage manager. We could implement custom save to our DB.
            plugins: [preset.default],
            pluginsOpts: {
              'gjs-preset-webpage': {
                // Plugin options here
              }
            },
            canvas: {
              styles: [
                'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600&display=swap'
              ]
            }
          });

          setEditor(e);
          setLoading(false);
        });
      });
    }

    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, []);

  const handleSave = () => {
    if (!editor) return;
    const html = editor.getHtml();
    const css = editor.getCss();
    const components = editor.getComponents();
    const style = editor.getStyle();
    
    // In a real app, we would send this to our API
    console.log('Saved data:', { html, css, components, style });
    alert('Desain berhasil disimpan (lihat console untuk detail JSON & HTML/CSS)');
  };

  const setDevice = (device: 'Desktop' | 'Tablet' | 'Mobile portrait') => {
    if (!editor) return;
    editor.setDevice(device);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#1c1c1c] text-white">
      {/* Top Navbar outside of GrapesJS */}
      <div className="h-14 bg-[#2a2a2a] border-b border-white/10 flex items-center justify-between px-4 shrink-0 z-50 shadow-md">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/themes/builder"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Kembali ke Theme Builder</span>
          </Link>
          <div className="h-4 w-[1px] bg-white/20 mx-2" />
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest bg-emerald-500/20 text-emerald-400 uppercase border border-emerald-500/20">
              Experimental GrapesJS
            </div>
            <span className="text-sm font-medium">Untitled Theme</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Device Controls */}
          <div className="flex items-center bg-black/40 rounded-lg p-1 mr-4 border border-white/5">
            <button onClick={() => setDevice('Desktop')} className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors" title="Desktop">
              <Laptop className="w-4 h-4" />
            </button>
            <button onClick={() => setDevice('Tablet')} className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors" title="Tablet">
              <Tablet className="w-4 h-4" />
            </button>
            <button onClick={() => setDevice('Mobile portrait')} className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors" title="Mobile">
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>Simpan</span>
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="flex-1 w-full relative overflow-hidden bg-[#242424]">
        {loading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#242424]">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm text-white/60 animate-pulse">Memuat GrapesJS Editor...</p>
          </div>
        )}
        
        {/* We need to inject GrapesJS CSS locally since we disabled SSR import */}
        <link rel="stylesheet" href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" />
        
        <div ref={editorRef} className="h-full w-full" />
      </div>
    </div>
  );
}
