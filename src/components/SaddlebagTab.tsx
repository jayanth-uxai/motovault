import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Backpack, Wrench, CheckCircle2, Circle, Plus, Trash2, Search, MapPin } from 'lucide-react';
import { ToolItem, LuggageItem } from '../types';

export const SaddlebagTab: React.FC = () => {
  const { state, toggleToolCarried, addToolItem, deleteToolItem, toggleLuggagePacked, addLuggageItem, deleteLuggageItem } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'toolkit' | 'luggage'>('toolkit');
  const [toolSearch, setToolSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('ALL');

  const [showToolModal, setShowToolModal] = useState(false);
  const [showLuggageModal, setShowLuggageModal] = useState(false);

  // New Tool form
  const [toolName, setToolName] = useState('');
  const [toolCategory, setToolCategory] = useState<ToolItem['category']>('Spanners');
  const [toolLocation, setToolLocation] = useState('');
  const [toolNotes, setToolNotes] = useState('');

  // New Luggage form
  const [lugItemName, setLugItemName] = useState('');
  const [lugCategory, setLugCategory] = useState<LuggageItem['category']>('Riding Gear');
  const [lugBagLocation, setLugBagLocation] = useState('');

  // Filtering tools
  const filteredTools = state.toolkit.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(toolSearch.toLowerCase()) || t.location.toLowerCase().includes(toolSearch.toLowerCase());
    const matchesLocation = locationFilter === 'ALL' || t.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  // Packing stats
  const totalLuggage = state.luggage.length;
  const packedLuggage = state.luggage.filter(l => l.packed).length;
  const packingPct = Math.round((packedLuggage / (totalLuggage || 1)) * 100);

  const handleToolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (toolName && toolLocation) {
      addToolItem({
        name: toolName,
        category: toolCategory,
        location: toolLocation,
        carried: true,
        notes: toolNotes,
      });
      setShowToolModal(false);
      setToolName('');
      setToolLocation('');
      setToolNotes('');
    }
  };

  const handleLuggageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lugItemName && lugBagLocation) {
      addLuggageItem({
        item: lugItemName,
        category: lugCategory,
        bagLocation: lugBagLocation,
        packed: false,
      });
      setShowLuggageModal(false);
      setLugItemName('');
      setLugBagLocation('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Sub-tab Switcher */}
      <div className="flex items-center justify-between bg-[#180b07] p-2 rounded-xl border border-[#372621]">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab('toolkit')}
            className={`px-5 py-2 rounded-lg text-sm font-bold font-mono transition-all flex items-center gap-2 ${
              activeSubTab === 'toolkit'
                ? 'bg-[#372621] text-[#ffb5a0] border border-[#5b4039] shadow-inner'
                : 'text-[#ab8980] hover:text-[#fadcd4]'
            }`}
          >
            <Wrench className="w-4 h-4 text-[#ff5722]" />
            <span>Toolkit & Compartments ({state.toolkit.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('luggage')}
            className={`px-5 py-2 rounded-lg text-sm font-bold font-mono transition-all flex items-center gap-2 ${
              activeSubTab === 'luggage'
                ? 'bg-[#372621] text-[#ffb5a0] border border-[#5b4039] shadow-inner'
                : 'text-[#ab8980] hover:text-[#fadcd4]'
            }`}
          >
            <Backpack className="w-4 h-4 text-[#86cfff]" />
            <span>Things I'm Carrying ({packedLuggage}/{totalLuggage} Packed)</span>
          </button>
        </div>

        <div>
          {activeSubTab === 'toolkit' ? (
            <button
              onClick={() => setShowToolModal(true)}
              className="tactile-btn px-4 py-2 rounded-lg bg-[#ff5722] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add Tool</span>
            </button>
          ) : (
            <button
              onClick={() => setShowLuggageModal(true)}
              className="tactile-btn px-4 py-2 rounded-lg bg-[#86cfff] text-[#001e2e] text-xs font-bold flex items-center gap-1.5 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          )}
        </div>
      </div>

      {/* TOOLKIT TAB */}
      {activeSubTab === 'toolkit' && (
        <div className="space-y-6">
          {/* Search & Location Filter */}
          <div className="brushed-aluminum p-4 rounded-xl border border-[#5b4039] flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#ab8980] absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search tools or storage location..."
                value={toolSearch}
                onChange={e => setToolSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039] focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs text-[#ab8980] font-mono whitespace-nowrap">Location:</span>
              <select
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#180b07] text-[#fadcd4] font-mono text-sm border border-[#5b4039] focus:outline-none"
              >
                <option value="ALL">All Locations</option>
                <option value="Under-seat">Under-seat Cavity</option>
                <option value="Pannier">Panniers</option>
                <option value="Tank Bag">Tank Bag</option>
                <option value="Tail Bag">Tail Bag</option>
              </select>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTools.map(tool => (
              <div
                key={tool.id}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                  tool.carried
                    ? 'brushed-aluminum border-[#5b4039]'
                    : 'bg-[#180b07]/50 border-[#372621] opacity-60'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleToolCarried(tool.id)} className="text-[#00E676]">
                        {tool.carried ? <CheckCircle2 className="w-5 h-5 fill-current text-[#00E676]/20 text-[#00E676]" /> : <Circle className="w-5 h-5 text-[#ab8980]" />}
                      </button>
                      <h4 className={`font-bold font-mono text-base ${tool.carried ? 'text-[#fadcd4]' : 'text-[#ab8980] line-through'}`}>
                        {tool.name}
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#372621] text-[#ffb5a0]">
                      {tool.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#00E676] font-mono my-2 bg-[#180b07] px-3 py-1.5 rounded border border-[#372621]">
                    <MapPin className="w-3.5 h-3.5 text-[#ff5722]" />
                    <span>Exact Location: <strong>{tool.location}</strong></span>
                  </div>

                  {tool.notes && (
                    <p className="text-xs text-[#ab8980] italic mt-1">{tool.notes}</p>
                  )}
                </div>

                <div className="flex justify-end pt-3 mt-3 border-t border-[#372621]">
                  <button
                    onClick={() => deleteToolItem(tool.id)}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LUGGAGE TAB */}
      {activeSubTab === 'luggage' && (
        <div className="space-y-6">
          {/* Packing Progress Bar */}
          <div className="brushed-aluminum p-6 rounded-2xl border border-[#5b4039]">
            <div className="flex justify-between items-center mb-2 font-mono text-sm">
              <span className="text-[#ab8980]">Packing Checklist Completion</span>
              <span className="text-[#00E676] font-bold">{packingPct}% Packed ({packedLuggage}/{totalLuggage} Items)</span>
            </div>
            <div className="w-full bg-[#180b07] h-3 rounded-full overflow-hidden p-0.5 border border-[#372621]">
              <div
                className="bg-gradient-to-r from-[#ff5722] to-[#00E676] h-full rounded-full transition-all duration-500"
                style={{ width: `${packingPct}%` }}
              ></div>
            </div>
          </div>

          {/* Luggage Items List */}
          <div className="brushed-aluminum p-6 rounded-2xl border border-[#5b4039]">
            <h3 className="text-lg font-bold text-[#fadcd4] font-mono uppercase tracking-wider mb-4">Things I'm Carrying</h3>
            <div className="space-y-3">
              {state.luggage.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleLuggagePacked(item.id)}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    item.packed
                      ? 'bg-[#180b07] border-[#00E676]/40 text-[#fadcd4]'
                      : 'bg-[#1e100c] border-[#372621] text-[#ab8980]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={item.packed ? 'text-[#00E676]' : 'text-[#ab8980]'}>
                      {item.packed ? <CheckCircle2 className="w-5 h-5 fill-current text-[#00E676]/20" /> : <Circle className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className={`font-bold font-mono text-sm ${item.packed ? 'text-[#fadcd4]' : 'text-[#ab8980]'}`}>{item.item}</h4>
                      <span className="text-xs text-[#ab8980]">Bag Location: <strong className="text-[#ffb5a0]">{item.bagLocation}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#372621] text-[#86cfff]">
                      {item.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLuggageItem(item.id);
                      }}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADD TOOL MODAL */}
      {showToolModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="brushed-aluminum max-w-md w-full p-6 rounded-2xl border border-[#5b4039]">
            <h3 className="text-lg font-bold text-[#fadcd4] mb-4 font-mono">Add Tool to Compartment</h3>
            <form onSubmit={handleToolSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Tool Name</label>
                <input
                  type="text"
                  value={toolName}
                  onChange={e => setToolName(e.target.value)}
                  placeholder="Master Link Chain Pin"
                  className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Category</label>
                  <select
                    value={toolCategory}
                    onChange={e => setToolCategory(e.target.value as ToolItem['category'])}
                    className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                  >
                    <option value="Spanners">Spanners</option>
                    <option value="Punctures">Punctures</option>
                    <option value="Electrical">Electrical</option>
                    <option value="General">General</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Exact Storage Location</label>
                  <input
                    type="text"
                    value={toolLocation}
                    onChange={e => setToolLocation(e.target.value)}
                    placeholder="Under-seat cavity"
                    className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Notes / Specs</label>
                <input
                  type="text"
                  value={toolNotes}
                  onChange={e => setToolNotes(e.target.value)}
                  placeholder="520 pitch gold master link"
                  className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowToolModal(false)}
                  className="px-4 py-2 rounded bg-[#372621] text-[#ab8980] text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#ff5722] text-white text-sm font-bold shadow-lg"
                >
                  Save Tool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD LUGGAGE MODAL */}
      {showLuggageModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="brushed-aluminum max-w-md w-full p-6 rounded-2xl border border-[#5b4039]">
            <h3 className="text-lg font-bold text-[#fadcd4] mb-4 font-mono">Add Luggage Item</h3>
            <form onSubmit={handleLuggageSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Item Description</label>
                <input
                  type="text"
                  value={lugItemName}
                  onChange={e => setLugItemName(e.target.value)}
                  placeholder="Portable Camping Stove"
                  className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Category</label>
                  <select
                    value={lugCategory}
                    onChange={e => setLugCategory(e.target.value as LuggageItem['category'])}
                    className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                  >
                    <option value="Riding Gear">Riding Gear</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Documents">Documents</option>
                    <option value="Camping / First Aid">Camping / First Aid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Bag Location</label>
                  <input
                    type="text"
                    value={lugBagLocation}
                    onChange={e => setLugBagLocation(e.target.value)}
                    placeholder="Right Pannier"
                    className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLuggageModal(false)}
                  className="px-4 py-2 rounded bg-[#372621] text-[#ab8980] text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#86cfff] text-[#001e2e] text-sm font-bold shadow-lg"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
