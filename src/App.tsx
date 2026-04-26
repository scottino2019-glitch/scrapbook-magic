/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Image as ImageIcon, 
  Type, 
  Sticker as StickerIcon, 
  Smile, 
  MessageSquare,
  Trash2,
  Layers,
  ChevronRight,
  ChevronLeft,
  Download,
  Palette,
  X
} from 'lucide-react';
import { 
  ScrapbookElement, 
  ScrapbookPage, 
  ARTISTIC_FONTS, 
  COLORS, 
  STICKERS, 
  BACKGROUNDS 
} from './types';

// Mock initial page
const INITIAL_PAGE: ScrapbookPage = {
  id: 'page-1',
  backgroundColor: '#fdf6e3',
  backgroundImage: 'https://www.transparenttextures.com/patterns/paper-fibers.png',
  elements: [
    {
      id: 'welcome-text',
      type: 'text',
      x: 100,
      y: 100,
      width: 300,
      height: 100,
      rotation: -5,
      zIndex: 1,
      content: 'Il Mio Album',
      style: {
        fontSize: 48,
        fontFamily: 'Pacifico',
        color: '#d97706',
      }
    }
  ]
};

export default function App() {
  const [pages, setPages] = useState<ScrapbookPage[]>([INITIAL_PAGE]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [sidebarTab, setSidebarTab] = useState<'add' | 'layers' | 'page'>('add');
  
  const currentPage = pages[currentPageIndex];
  const selectedElement = currentPage.elements.find(el => el.id === selectedElementId);

  const addElement = (type: ScrapbookElement['type'], content: string = '', bubbleType: ScrapbookElement['bubbleType'] = 'classic') => {
    const newElement: ScrapbookElement = {
      id: `el-${Date.now()}`,
      type,
      x: 100, // Fixed starting position to avoid overlap chaos
      y: 100,
      width: type === 'photo' ? 200 : type === 'bubble' ? 180 : 120,
      height: type === 'photo' ? 150 : type === 'bubble' ? 100 : 80,
      rotation: 0,
      zIndex: currentPage.elements.length + 1,
      content: content || (type === 'text' ? 'Modifica Testo' : type === 'bubble' ? 'Ciao!' : ''),
      bubbleType: type === 'bubble' ? bubbleType : undefined,
      style: {
        fontSize: type === 'text' ? 32 : type === 'emoji' ? 60 : 18,
        fontFamily: type === 'text' ? 'Permanent Marker' : 'Fredoka',
        color: '#000000',
        ...(type === 'bubble' ? { backgroundColor: '#ffffff', borderRadius: '20px', padding: '10px' } : {})
      }
    };

    const newPages = [...pages];
    newPages[currentPageIndex].elements.push(newElement);
    setPages(newPages);
    setSelectedElementId(newElement.id);
  };

  const updateElement = (id: string, updates: Partial<ScrapbookElement>) => {
    const newPages = [...pages];
    const page = newPages[currentPageIndex];
    page.elements = page.elements.map(el => el.id === id ? { ...el, ...updates } : el);
    setPages(newPages);
  };

  const deleteElement = (id: string) => {
    const newPages = [...pages];
    const page = newPages[currentPageIndex];
    page.elements = page.elements.filter(el => el.id !== id);
    setPages(newPages);
    setSelectedElementId(null);
  };

  const updatePage = (updates: Partial<ScrapbookPage>) => {
    const newPages = [...pages];
    newPages[currentPageIndex] = { ...newPages[currentPageIndex], ...updates };
    setPages(newPages);
  };

  const handleDragEnd = (id: string, info: any) => {
    // This is simplified, real world would use relative container coords
    // But for now we just update locally via motion's onDrag
  };

  const addPage = () => {
    const newPage: ScrapbookPage = {
      id: `page-${Date.now()}`,
      backgroundColor: '#ffffff',
      elements: []
    };
    setPages([...pages, newPage]);
    setCurrentPageIndex(pages.length);
  };

  return (
    <div className="flex h-screen w-full bg-brand-bg overflow-hidden font-sans">
      {/* Sidebar Tool */}
      <aside className="w-80 bg-white border-r-2 border-gray-100 flex flex-col z-50 print:hidden">
        <div className="p-4 border-b-4 border-pink-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">S</div>
            <h1 className="text-xl font-bold text-gray-800">Scraply <span className="text-xs font-normal text-pink-400">v2.0</span></h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => window.print()}
              className="p-2 hover:bg-pink-50 rounded-lg transition-colors text-pink-500" 
              title="Salva / Stampa"
            >
              <Download size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {[
            { id: 'add', icon: Plus, label: 'Aggiungi' },
            { id: 'layers', icon: Layers, label: 'Livelli' },
            { id: 'page', icon: Palette, label: 'Pagina' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSidebarTab(tab.id as any)}
              className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs font-bold transition-all ${
                sidebarTab === tab.id ? 'bg-white text-pink-500 border-b-2 border-pink-500' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            {sidebarTab === 'add' && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <section>
                  <h3 className="text-sm font-bold text-stone-700 mb-3 uppercase tracking-wider">Elementi Base</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col items-center justify-center p-4 bg-white border border-stone-200 rounded-xl hover:border-amber-400 hover:bg-amber-50 transition-all hover:-translate-y-1 shadow-sm group cursor-pointer text-center">
                      <ImageIcon size={24} className="text-stone-400 group-hover:text-amber-600 mb-2 transition-colors" />
                      <span className="text-xs font-bold text-stone-500 group-hover:text-amber-700">Carica Foto</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            addElement('photo', url);
                          }
                        }}
                      />
                    </label>
                    <ToolButton icon={Type} label="Testo" onClick={() => addElement('text')} />
                    <ToolButton icon={Smile} label="Emoji" onClick={() => addElement('emoji', '✨')} />
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-stone-700 mb-3 uppercase tracking-wider">Fumetti Artistici</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => addElement('bubble', 'Ciao!', 'classic')} className="p-2 border border-gray-100 rounded-lg hover:border-pink-300 hover:bg-pink-50 text-[10px] font-bold">Classico</button>
                    <button onClick={() => addElement('bubble', 'Hmmm...', 'thought')} className="p-2 border border-gray-100 rounded-lg hover:border-pink-300 hover:bg-pink-50 text-[10px] font-bold">Pensiero</button>
                    <button onClick={() => addElement('bubble', 'BOOM!', 'shout')} className="p-2 border border-gray-100 rounded-lg hover:border-pink-300 hover:bg-pink-50 text-[10px] font-bold">Scoppio</button>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-stone-700 mb-3 uppercase tracking-wider">Stickers</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {STICKERS.map(sticker => (
                      <button 
                        key={sticker.id}
                        onClick={() => addElement('sticker', sticker.url)}
                        className="p-2 border border-stone-200 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-all aspect-square flex items-center justify-center p-4 bg-white"
                      >
                        <img src={sticker.url} alt={sticker.name} className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {sidebarTab === 'page' && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <section>
                  <h3 className="text-sm font-bold text-stone-700 mb-3 uppercase tracking-wider">Sfondi Artistici</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {BACKGROUNDS.map(bg => (
                      <button 
                        key={bg.id}
                        onClick={() => updatePage({ backgroundImage: bg.url })}
                        className={`p-1 rounded-lg border-2 transition-all ${currentPage.backgroundImage === bg.url ? 'border-amber-500' : 'border-transparent hover:border-stone-300'}`}
                      >
                        <div className="aspect-video rounded bg-stone-100 flex items-center justify-center mb-1 overflow-hidden">
                          <img src={bg.url} alt={bg.name} className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
                        </div>
                        <span className="text-xs text-stone-600 block text-center font-medium">{bg.name}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-stone-700 mb-3 uppercase tracking-wider">Colore Sfondo</h3>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => updatePage({ backgroundColor: color })}
                        className={`w-8 h-8 rounded-full border border-stone-300 transition-transform hover:scale-110 ${currentPage.backgroundColor === color ? 'ring-2 ring-amber-500 ring-offset-2' : ''}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {sidebarTab === 'layers' && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-2"
              >
                {currentPage.elements.slice().reverse().map((el, i) => (
                  <div 
                    key={el.id}
                    onClick={() => setSelectedElementId(el.id)}
                    className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${selectedElementId === el.id ? 'bg-amber-50 border-amber-200' : 'bg-white border-stone-200 hover:border-stone-300'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-stone-100 flex items-center justify-center">
                        {el.type === 'photo' && <ImageIcon size={14} />}
                        {el.type === 'text' && <Type size={14} />}
                        {el.type === 'sticker' && <StickerIcon size={14} />}
                        {el.type === 'emoji' && <Smile size={14} />}
                        {el.type === 'bubble' && <MessageSquare size={14} />}
                      </div>
                      <span className="text-sm text-stone-700 font-medium truncate max-w-[120px]">
                        {el.type === 'text' || el.type === 'bubble' ? el.content : el.type}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          const maxZ = Math.max(...currentPage.elements.map(e => e.zIndex), 0);
                          updateElement(el.id, { zIndex: maxZ + 1 });
                        }}
                        className="p-1 hover:text-amber-600 text-stone-400"
                        title="Porta in primo piano"
                      >
                        <Layers size={14} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteElement(el.id); }}
                        className="p-1 hover:text-red-500 text-stone-400"
                        title="Elimina"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 relative overflow-hidden flex flex-col items-center justify-center p-12 bg-gray-100 print:p-0 print:bg-white">
        {/* Navigation */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2 z-40 print:hidden flex flex-col gap-4">
          <button 
            disabled={currentPageIndex === 0}
            onClick={() => setCurrentPageIndex(prev => Math.max(0, prev - 1))}
            className="p-3 bg-white shadow-xl rounded-full hover:bg-pink-50 transition-all disabled:opacity-30 border border-gray-100"
          >
            <ChevronLeft size={24} className="text-pink-500" />
          </button>
        </div>
        <div className="absolute top-1/2 right-4 -translate-y-1/2 z-40 print:hidden flex flex-col gap-4">
          <button 
            onClick={addPage}
            className="p-3 bg-pink-500 shadow-xl rounded-full hover:bg-pink-600 hover:scale-105 transition-all text-white"
            title="Aggiungi Pagina"
          >
            <Plus size={24} />
          </button>
          <button 
            disabled={currentPageIndex === pages.length - 1}
            onClick={() => setCurrentPageIndex(prev => Math.min(pages.length - 1, prev + 1))}
            className="p-3 bg-white shadow-xl rounded-full hover:bg-pink-50 transition-all disabled:opacity-30 border border-gray-100"
          >
            <ChevronRight size={24} className="text-pink-500" />
          </button>
        </div>

        <div className="absolute top-8 text-pink-400 font-bold tracking-widest uppercase text-xs print:hidden bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-pink-100 shadow-sm">
          Pagina {currentPageIndex + 1} di {pages.length}
        </div>

        {/* The Page Container */}
        <div 
          key={currentPage.id}
          className={`relative shadow-2xl rounded-sm border-8 border-white ring-1 ring-gray-200 overflow-hidden ${
            currentPage.backgroundImage === 'css-pattern-dots' ? 'pattern-dots' : 
            currentPage.backgroundImage === 'css-pattern-wood' ? 'pattern-wood' : 
            currentPage.backgroundImage === 'css-pattern-paper' ? 'pattern-paper' : ''
          }`}
          style={{ 
            width: '800px', 
            height: '600px', 
            backgroundColor: currentPage.backgroundColor,
            backgroundImage: currentPage.backgroundImage && !currentPage.backgroundImage.startsWith('css-') ? `url(${currentPage.backgroundImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          onMouseDown={() => setSelectedElementId(null)}
        >
          {currentPage.elements.map((el) => (
            <ScrapElement 
              key={el.id} 
              element={el}
              onSelect={(e) => {
                // We don't need propagation stop here as it's handled in handleMouseDown
                setSelectedElementId(el.id);
              }}
              isSelected={selectedElementId === el.id}
              onUpdate={(updates) => updateElement(el.id, updates)}
            />
          ))}
        </div>

        {/* Selected Element Controls - Floating */}
        {selectedElement && (
          <div
            onMouseDown={(e) => e.stopPropagation()} // Prevent deselecting when clicking the bar
            className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl border-2 border-pink-200 p-4 flex items-center gap-6 z-[9999]"
          >
            <div className="flex items-center gap-2 pr-6 border-r border-gray-100">
              <button 
                onMouseDown={(e) => { e.stopPropagation(); deleteElement(selectedElement.id); }}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Elimina"
              >
                <Trash2 size={20} />
              </button>
              <div className="h-6 w-px bg-gray-100 mx-1" />
              <button 
                onMouseDown={(e) => { e.stopPropagation(); updateElement(selectedElement.id, { rotation: selectedElement.rotation - 15 }); }}
                className="p-2 text-gray-400 hover:text-pink-500 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ruota</span>
              <button 
                onMouseDown={(e) => { e.stopPropagation(); updateElement(selectedElement.id, { rotation: selectedElement.rotation + 15 }); }}
                className="p-2 text-gray-400 hover:text-pink-500 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {selectedElement.type === 'photo' && (
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cornice</span>
                  <div className="flex gap-2">
                    {[
                      { id: 'none', label: 'Nuda' },
                      { id: 'polaroid', label: 'Polaroid' },
                      { id: 'classic', label: 'Cornice' },
                      { id: 'wavy', label: 'Ondulata' },
                      { id: 'dashed', label: 'Tratto' }
                    ].map(frame => (
                      <button
                        key={frame.id}
                        onMouseDown={(e) => { e.stopPropagation(); updateElement(selectedElement.id, { frameType: frame.id as any }); }}
                        className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${
                          selectedElement.frameType === frame.id ? 'bg-pink-500 text-white shadow-lg' : 'bg-gray-100 text-gray-400 hover:bg-pink-100'
                        }`}
                      >
                        {frame.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-10 w-px bg-gray-100 mx-2" />
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Grandezza</span>
                  <input 
                    type="range" min="50" max="400" 
                    value={selectedElement.width}
                    onChange={(e) => {
                      const w = parseInt(e.target.value);
                      const ratio = selectedElement.height / selectedElement.width;
                      updateElement(selectedElement.id, { width: w, height: w * ratio });
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="w-32 accent-pink-500"
                  />
                </div>
              </div>
            )}

            {selectedElement.type === 'text' || selectedElement.type === 'bubble' ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Font</span>
                  <select 
                    value={selectedElement.style?.fontFamily}
                    onChange={(e) => updateElement(selectedElement.id, { style: { ...selectedElement.style, fontFamily: e.target.value } })}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="bg-gray-50 border-none text-sm font-bold rounded p-1 outline-none text-gray-700"
                  >
                    {ARTISTIC_FONTS.map(font => (
                      <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dimensione</span>
                  <input 
                    type="range" min="10" max="150" 
                    value={selectedElement.style?.fontSize}
                    onChange={(e) => updateElement(selectedElement.id, { style: { ...selectedElement.style, fontSize: parseInt(e.target.value) } })}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="w-24 accent-pink-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Colore</span>
                  <div className="flex gap-1">
                    {COLORS.slice(0, 5).map(color => (
                      <button
                        key={color}
                        onMouseDown={(e) => { e.stopPropagation(); updateElement(selectedElement.id, { style: { ...selectedElement.style, color } }); }}
                        className={`w-4 h-4 rounded-full border border-gray-200 ${selectedElement.style?.color === color ? 'ring-2 ring-pink-500 ring-offset-1' : ''}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1 min-w-[150px]">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contenuto</span>
                  <textarea 
                    value={selectedElement.content}
                    onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="bg-gray-50 border-none text-sm font-medium rounded p-1 outline-none w-full border-b border-pink-100 focus:border-pink-300 resize-none h-8"
                  />
                </div>
              </div>
            ) : selectedElement.type === 'emoji' ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dimensione</span>
                  <input 
                    type="range" min="20" max="200" 
                    value={selectedElement.style?.fontSize}
                    onChange={(e) => updateElement(selectedElement.id, { style: { ...selectedElement.style, fontSize: parseInt(e.target.value) } })}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="w-32 accent-pink-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Emoji</span>
                  <div className="flex gap-2">
                     {['✨', '❤️', '🌸', '⭐', '🎈', '📷'].map(e => (
                       <button 
                         key={e} 
                         onMouseDown={(eBtn) => { eBtn.stopPropagation(); updateElement(selectedElement.id, { content: e }); }} 
                         className="text-lg hover:scale-125 transition-transform"
                       >
                        {e}
                       </button>
                     ))}
                  </div>
                </div>
              </div>
            ) : null}
            
            <button 
              onMouseDown={(e) => { e.stopPropagation(); setSelectedElementId(null); }}
              className="p-2 bg-gray-100 hover:bg-pink-100 rounded-lg text-gray-400 hover:text-pink-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function ToolButton({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 bg-white border border-gray-100 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all hover:scale-105 shadow-sm group"
    >
      <Icon size={24} className="text-gray-400 group-hover:text-pink-500 mb-2 transition-colors" />
      <span className="text-xs font-bold text-gray-500 group-hover:text-pink-600">{label}</span>
    </button>
  );
}

function ScrapElement({ element, onSelect, isSelected, onUpdate }: { 
  element: ScrapbookElement, 
  onSelect: (e: any) => void, 
  isSelected: boolean,
  onUpdate: (updates: Partial<ScrapbookElement>) => void
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(e);
    setIsDragging(true);
    startPos.current = {
      x: e.clientX,
      y: e.clientY
    };
    setDragOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setDragOffset({
        x: e.clientX - startPos.current.x,
        y: e.clientY - startPos.current.y
      });
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDragging) return;
      const finalX = element.x + (e.clientX - startPos.current.x);
      const finalY = element.y + (e.clientY - startPos.current.y);
      onUpdate({ x: finalX, y: finalY });
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, element.x, element.y, onUpdate]);

  const currentX = element.x + dragOffset.x;
  const currentY = element.y + dragOffset.y;

  const fontStyle = {
    fontFamily: element.style?.fontFamily ? `'${element.style.fontFamily}', cursive` : 'inherit',
    fontSize: `${element.style?.fontSize}px`,
    color: element.style?.color || '#000000',
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        top: currentY,
        left: currentX,
        transform: `rotate(${element.rotation}deg)`,
        zIndex: isSelected ? 2000 : element.zIndex,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none'
      }}
      className={`group transition-none ${isSelected ? 'ring-2 ring-pink-500 rounded-sm' : ''}`}
    >
      <div className="relative pointer-events-none">
        {isSelected && (
          <div className="absolute -top-4 -left-4 -right-4 -bottom-4 border-2 border-pink-400 border-dashed rounded-xl z-50 pointer-events-none" />
        )}
        
        {element.type === 'photo' && (
          <div 
            className={`transition-all ${
              element.frameType === 'polaroid' ? 'p-3 pb-12 bg-white shadow-2xl border-2 border-gray-100' :
              element.frameType === 'classic' ? 'p-6 bg-white shadow-xl border-[12px] border-white' :
              element.frameType === 'wavy' ? 'p-4 bg-white shadow-xl border-4 border-white' :
              element.frameType === 'dashed' ? 'p-4 bg-white shadow-xl border-4 border-pink-300 border-dashed' :
              'p-2 bg-white shadow-xl border-4 border-white'
            }`}
            style={{
              borderRadius: element.frameType === 'wavy' ? '40px 10px 40px 10px' : '0px'
            }}
          >
            {/* Washi Tape - only if not polaroid */}
            {element.frameType !== 'polaroid' && (
              <div className="absolute h-6 w-24 bg-white/40 backdrop-blur-md -top-3 left-1/2 -ml-12 -rotate-3 border border-pink-300 border-dashed z-20 pointer-events-none" />
            )}
            <img 
              src={element.content} 
              alt="" 
              className="object-cover"
              style={{ width: element.width, height: element.height }}
              referrerPolicy="no-referrer"
            />
            {element.frameType === 'polaroid' && (
              <div className="mt-4 w-full h-8 flex items-center justify-center">
                <div className="w-1/2 h-1 bg-gray-100/50 rounded-full" />
              </div>
            )}
          </div>
        )}

        {element.type === 'text' && (
          <div 
            style={fontStyle}
            className="select-none p-2 drop-shadow-sm font-medium leading-none"
          >
            {element.content}
          </div>
        )}

        {element.type === 'sticker' && (
          <img 
            src={element.content} 
            className="pointer-events-none select-none drop-shadow-lg"
            style={{ width: element.width, height: element.width }}
            referrerPolicy="no-referrer" 
          />
        )}

        {element.type === 'emoji' && (
          <div 
            style={{ fontSize: `${element.style?.fontSize}px` }}
            className="select-none pointer-events-none drop-shadow-md"
          >
            {element.content}
          </div>
        )}

        {element.type === 'bubble' && (
          <div className={`relative ${element.bubbleType === 'thought' ? 'thought-bubble' : ''}`}>
             <div 
              style={{ 
                ...fontStyle,
                backgroundColor: element.style?.backgroundColor || '#ffffff',
                borderRadius: element.bubbleType === 'classic' ? '.4em' : element.bubbleType === 'shout' ? '0px' : '50%',
                padding: '16px 32px',
                minWidth: '140px',
                textAlign: 'center',
                clipPath: element.bubbleType === 'shout' ? 'polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%)' : undefined
              }}
              className={`border-4 border-black font-bold ${element.bubbleType === 'classic' ? 'speech-bubble-arrow' : ''}`}
             >
               {element.content}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
