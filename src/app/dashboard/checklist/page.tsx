'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import { Check, Plus, Trash2, GripVertical, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface CheckItem {
  id: string;
  text: string;
  done: boolean;
  category: string;
}

const STORAGE_KEY = 'sahinaja-wedding-checklist';

const CATEGORIES: { id: string; label: string }[] = [
  { id: 'venue', label: 'Venue & Lokasi' },
  { id: 'fashion', label: 'Busana & Penampilan' },
  { id: 'catering', label: 'Katering & Menu' },
  { id: 'documentation', label: 'Dokumentasi' },
  { id: 'invitation', label: 'Undangan & Tamu' },
  { id: 'other', label: 'Lainnya' },
];

const DEFAULT_ITEMS: Omit<CheckItem, 'id'>[] = [
  { text: 'Tentukan tanggal dan hari pernikahan', done: false, category: 'venue' },
  { text: 'Booking gedung / lokasi acara', done: false, category: 'venue' },
  { text: 'Survey dan tentukan katering', done: false, category: 'catering' },
  { text: 'Booking dekorasi pelaminan', done: false, category: 'venue' },
  { text: 'Fitting gaun pengantin wanita', done: false, category: 'fashion' },
  { text: 'Fitting jas / baju pengantin pria', done: false, category: 'fashion' },
  { text: 'Booking fotografer & videografer', done: false, category: 'documentation' },
  { text: 'Tentukan tema & dekorasi pernikahan', done: false, category: 'venue' },
  { text: 'Buat dan bagikan undangan digital', done: true, category: 'invitation' },
  { text: 'Kirim undangan ke keluarga dan teman', done: false, category: 'invitation' },
  { text: 'Konfirmasi jumlah tamu undangan', done: false, category: 'invitation' },
  { text: 'Atur MC dan rundown acara', done: false, category: 'other' },
  { text: 'Booking penginapan untuk keluarga dari luar kota', done: false, category: 'other' },
  { text: 'Persiapkan souvenir tamu undangan', done: false, category: 'other' },
  { text: 'Percobaan riasan pengantin (make-up trial)', done: false, category: 'fashion' },
  { text: 'Tentukan menu katering & uji coba rasa', done: false, category: 'catering' },
  { text: 'Pastikan konsumsi untuk panitia', done: false, category: 'catering' },
  { text: 'Buat album foto pra-nikah', done: false, category: 'documentation' },
];

export default function WeddingChecklistPage() {
  const [items, setItems] = useState<CheckItem[]>([]);
  const [mounted, setMounted] = useState(false);
  
  // Ref to track inputs for focus management
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [focusNext, setFocusNext] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    setTimeout(() => { setMounted(true); }, 0);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      } else {
        const defaults = DEFAULT_ITEMS.map((item, i) => ({
          ...item,
          id: `default-${i}`,
        }));
        setItems(defaults);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
      }
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    if (focusNext && inputRefs.current[focusNext]) {
      inputRefs.current[focusNext]?.focus();
      setFocusNext(null);
    }
  }, [items, focusNext]);

  // Persist to localStorage
  const saveItems = useCallback((newItems: CheckItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    } catch { /* ignore */ }
  }, []);

  const handleReorder = (categoryId: string, newOrder: CheckItem[]) => {
    const otherItems = items.filter(i => i.category !== categoryId);
    saveItems([...otherItems, ...newOrder]);
  };

  const toggleItem = (id: string) => {
    saveItems(items.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const updateItemText = (id: string, newText: string) => {
    saveItems(items.map(item => item.id === id ? { ...item, text: newText } : item));
  };

  const deleteItem = (id: string) => {
    saveItems(items.filter(item => item.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string, category: string, text: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Add new item below this one
      const newId = `custom-${Date.now()}`;
      const newItem: CheckItem = { id: newId, text: '', done: false, category };
      const index = items.findIndex(i => i.id === id);
      const newItems = [...items];
      newItems.splice(index + 1, 0, newItem);
      saveItems(newItems);
      setFocusNext(newId);
    } else if (e.key === 'Backspace' && text === '') {
      e.preventDefault();
      // Find previous item to focus
      const index = items.findIndex(i => i.id === id);
      if (index > 0) {
        const prevId = items[index - 1].id;
        setFocusNext(prevId);
      }
      deleteItem(id);
    }
  };

  const addEmptyTask = (category: string) => {
    const newId = `custom-${Date.now()}`;
    const newItem: CheckItem = { id: newId, text: '', done: false, category };
    saveItems([...items, newItem]);
    setFocusNext(newId);
  };

  if (!mounted) return null;

  const doneCount = items.filter(i => i.done).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#fcfbf8] mt-8">
      <div className="max-w-[700px] mx-auto px-6 py-16 sm:py-24">
        
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-sm font-medium text-[#6b6b6b] hover:text-[#1c1c1c] transition-colors bg-white hover:bg-stone-50 px-4 py-2 rounded-full border border-[#eceae4] shadow-sm w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Dashboard
          </Link>
        </motion.div>

        {/* Cover / Header Area (Notion style) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-[#1c1c1c] mb-4 tracking-tight outline-none w-full" contentEditable suppressContentEditableWarning>
            Persiapan Pernikahan
          </h1>
          <p className="text-[#6b6b6b] text-base mb-8 outline-none" contentEditable suppressContentEditableWarning>
            Tulis dan atur apa saja yang perlu disiapkan untuk hari bahagia Anda.
          </p>
          
          {/* Subtle Progress Bar */}
          <div className="flex items-center gap-4 mb-2 text-sm text-[#6b6b6b]">
            <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-stone-800 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <span className="font-mono text-xs">{progressPercent}% ({doneCount}/{totalCount})</span>
          </div>
        </motion.div>

        {/* Categories as Blocks */}
        <div className="space-y-12">
          {CATEGORIES.map((category) => {
            const categoryItems = items.filter(item => item.category === category.id);
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="group/category bg-white rounded-[2rem] border border-[#eceae4] shadow-sm p-6 sm:p-8"
              >
                {/* Category Header (H3 style) */}
                <h3 className="text-xl font-bold text-[#1c1c1c] mb-3 flex items-center gap-2 group-hover/category:text-stone-600 transition-colors">
                  {category.label}
                </h3>
                
                {/* Items List */}
                <div className="space-y-0.5">
                  <Reorder.Group axis="y" values={categoryItems} onReorder={(newOrder) => handleReorder(category.id, newOrder)}>
                    <AnimatePresence>
                      {categoryItems.map((item) => (
                        <ChecklistItem 
                          key={item.id} 
                          item={item}
                          category={category}
                          inputRef={(el) => { inputRefs.current[item.id] = el; }}
                          toggleItem={toggleItem}
                          updateItemText={updateItemText}
                          handleKeyDown={handleKeyDown}
                          deleteItem={deleteItem}
                        />
                      ))}
                    </AnimatePresence>
                  </Reorder.Group>
                </div>

                {/* Add New Item Button (Notion style) */}
                <button
                  onClick={() => addEmptyTask(category.id)}
                  className="flex items-center gap-2 mt-1 py-1.5 px-2 -ml-2 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition-colors text-[15px] font-medium cursor-pointer opacity-0 group-hover/category:opacity-100"
                >
                  <Plus className="h-4 w-4" /> Tambah tugas baru
                </button>
              </motion.div>
            );
          })}
        </div>

      </div>
    </main>
  );
}

// Sub-component for individual items to manage drag controls
function ChecklistItem({ 
  item, 
  category, 
  inputRef, 
  toggleItem, 
  updateItemText, 
  handleKeyDown, 
  deleteItem 
}: { 
  item: CheckItem;
  category: typeof CATEGORIES[number];
  inputRef: (el: HTMLInputElement | null) => void;
  toggleItem: (id: string) => void;
  updateItemText: (id: string, text: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, id: string, categoryId: string, text: string) => void;
  deleteItem: (id: string) => void;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      dragListener={false} // Only drag using the grip handle
      dragControls={controls}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      whileDrag={{ 
        scale: 1.02,
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        backgroundColor: "#ffffff",
        zIndex: 50,
      }}
      className="group flex items-start gap-2 py-1 -ml-6 pl-6 pr-2 rounded-lg hover:bg-stone-50 transition-colors relative bg-transparent"
    >
      {/* Drag Handle */}
      <div 
        onPointerDown={(e) => controls.start(e)}
        className="absolute left-1 top-1.5 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing text-stone-300 hover:text-stone-500 transition-colors p-0.5 rounded touch-none"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Notion-style Checkbox */}
      <button
        onClick={() => toggleItem(item.id)}
        className={`
          mt-1 w-[18px] h-[18px] shrink-0 rounded-[4px] border flex items-center justify-center transition-all cursor-pointer
          ${item.done 
            ? 'bg-rose-500 border-rose-500 text-white' 
            : 'bg-white border-stone-300 text-transparent hover:border-stone-400 hover:bg-stone-50'
          }
        `}
      >
        <Check className="h-3 w-3 stroke-[3]" />
      </button>

      {/* Editable Text */}
      <div className={`flex-1 min-w-0 transition-opacity ${item.done ? 'opacity-50 line-through' : 'opacity-100'}`}>
        <input
          ref={inputRef}
          type="text"
          value={item.text}
          onChange={(e) => updateItemText(item.id, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, item.id, category.id, item.text)}
          placeholder="Ketik tugas di sini..."
          className="w-full bg-transparent border-none outline-none focus:ring-0 p-0 text-[15px] text-[#1c1c1c] placeholder:text-stone-300 font-medium leading-relaxed resize-none"
        />
      </div>

      {/* Delete Button */}
      <button
        onClick={() => deleteItem(item.id)}
        className="opacity-0 group-hover:opacity-100 shrink-0 p-1 rounded hover:bg-stone-200 text-stone-400 hover:text-rose-500 transition-colors cursor-pointer mt-0.5"
        title="Hapus"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </Reorder.Item>
  );
}

