import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Gauge, Shield, Wrench, MapPin, PhoneCall, Backpack, Bot, Download, Upload, RefreshCw, Edit3, Menu, X } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenChat }) => {
  const { state, updateOdometer, exportBackup, importBackup, resetToDefaults } = useApp();
  const [isEditingOdo, setIsEditingOdo] = useState(false);
  const [newOdoVal, setNewOdoVal] = useState(state.bike.odoCurrent.toString());
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleOdoSave = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(newOdoVal);
    if (!isNaN(val) && val >= 0) {
      updateOdometer(val);
      setIsEditingOdo(false);
    }
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (importBackup(jsonText)) {
      setImportModalOpen(false);
      setJsonText('');
      alert('Vault state restored successfully!');
    } else {
      alert('Invalid JSON backup format.');
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Gauge },
    { id: 'garage', label: 'Garage & Spec', icon: Shield },
    { id: 'workshop', label: 'Workshop & Fuel', icon: Wrench },
    { id: 'touring', label: 'Touring & Trip', icon: MapPin },
    { id: 'emergency', label: 'Emergency (Red Box)', icon: PhoneCall },
    { id: 'saddlebag', label: 'Saddlebag & Kit', icon: Backpack },
  ];

  return (
    <header className="brushed-aluminum border-b border-[#5b4039] sticky top-0 z-40 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Bike Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff5722] to-[#b02f00] flex items-center justify-center shadow-inner border border-[#ffb5a0]/30 text-white font-bold text-xl">
            MV
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-wider text-[#fadcd4] font-mono uppercase">
                MotoVault
              </h1>
              <span className="px-2 py-0.5 text-xs rounded bg-[#483530] text-[#ffb5a0] border border-[#5b4039] font-mono">
                {state.bike.make} {state.bike.model}
              </span>
            </div>
            <p className="text-xs text-[#ab8980]">Skeuomorphic Motorcycle Management & Touring Co-Pilot</p>
          </div>
        </div>

        {/* Odometer Quick HUD & Backup Actions */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {/* Odometer HUD */}
          <div className="recessed-gauge px-4 py-1.5 rounded-md flex items-center gap-3 border border-[#5b4039]">
            <span className="text-xs text-[#ab8980] font-mono uppercase tracking-widest">ODO:</span>
            {isEditingOdo ? (
              <form onSubmit={handleOdoSave} className="flex items-center gap-1">
                <input
                  type="number"
                  value={newOdoVal}
                  onChange={e => setNewOdoVal(e.target.value)}
                  className="w-24 px-2 py-0.5 text-sm bg-[#1e100c] text-[#00E676] font-mono rounded border border-[#ff5722] focus:outline-none"
                  autoFocus
                />
                <button type="submit" className="text-xs px-2 py-0.5 bg-[#ff5722] text-white rounded font-bold">
                  Save
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 cursor-pointer group" onClick={() => { setNewOdoVal(state.bike.odoCurrent.toString()); setIsEditingOdo(true); }}>
                <span className="text-lg font-mono font-bold text-[#00E676] tracking-wider">
                  {state.bike.odoCurrent.toLocaleString()} <span className="text-xs text-[#ab8980]">km</span>
                </span>
                <Edit3 className="w-3.5 h-3.5 text-[#ab8980] group-hover:text-[#ffb5a0]" />
              </div>
            )}
          </div>

          {/* MotoBot AI Walkie-Talkie Button */}
          <button
            onClick={onOpenChat}
            className="tactile-btn px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold text-[#ffb5a0] bg-gradient-to-r from-[#3e2723] to-[#4e342e] border border-[#ffb5a0]/30 hover:border-[#ff5722] shadow-lg animate-pulse"
          >
            <Bot className="w-4 h-4 text-[#ff5722]" />
            <span>MotoBot Co-Pilot</span>
          </button>

          {/* Backup Dropdown / Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={exportBackup}
              title="Export JSON Backup"
              className="p-2 rounded bg-[#372621] text-[#ab8980] hover:text-[#fadcd4] hover:bg-[#43302b] border border-[#5b4039]"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => setImportModalOpen(true)}
              title="Import JSON Backup"
              className="p-2 rounded bg-[#372621] text-[#ab8980] hover:text-[#fadcd4] hover:bg-[#43302b] border border-[#5b4039]"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (confirm('Reset all vault data to default demo state?')) resetToDefaults();
              }}
              title="Reset to Defaults"
              className="p-2 rounded bg-[#372621] text-[#ab8980] hover:text-[#fadcd4] hover:bg-[#43302b] border border-[#5b4039]"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Navigation Tabs (Desktop) & Mobile Hamburger Toggle */}
      <div className="bg-[#180b07] border-t border-[#372621] px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-2">
          {/* Desktop Nav Tabs */}
          <div className="hidden md:flex space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#372621] text-[#ffb5a0] border border-[#5b4039] shadow-inner'
                      : 'text-[#ab8980] hover:text-[#fadcd4] hover:bg-[#271813]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#ff5722]' : 'text-[#ab8980]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Current Active Tab & Hamburger Toggle */}
          <div className="flex md:hidden items-center justify-between w-full py-1">
            <div className="flex items-center gap-2">
              {(() => {
                const activeItem = navItems.find(i => i.id === activeTab);
                const ActiveIcon = activeItem ? activeItem.icon : Gauge;
                return (
                  <>
                    <ActiveIcon className="w-4 h-4 text-[#ff5722]" />
                    <span className="text-sm font-bold font-mono text-[#fadcd4] uppercase">
                      {activeItem?.label || 'Dashboard'}
                    </span>
                  </>
                );
              })()}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="tactile-btn px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold text-[#ffb5a0] bg-[#372621] border border-[#5b4039]"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4 text-[#ff5722]" /> : <Menu className="w-4 h-4 text-[#ff5722]" />}
              <span>{isMobileMenuOpen ? 'Close Menu' : 'Modules Menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-[#372621] space-y-1 animate-in slide-in-from-top duration-200">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#372621] text-[#ffb5a0] border border-[#5b4039]'
                      : 'text-[#ab8980] hover:text-[#fadcd4] hover:bg-[#271813]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#ff5722]' : 'text-[#ab8980]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="brushed-aluminum max-w-lg w-full p-6 rounded-xl border border-[#5b4039]">
            <h3 className="text-lg font-bold text-[#fadcd4] mb-2 font-mono">Import Vault JSON Backup</h3>
            <p className="text-xs text-[#ab8980] mb-4">Paste your exported JSON configuration below to restore your motorcycle vault state.</p>
            <form onSubmit={handleImportSubmit}>
              <textarea
                rows={8}
                value={jsonText}
                onChange={e => setJsonText(e.target.value)}
                placeholder="Paste JSON here..."
                className="w-full p-3 rounded bg-[#180b07] text-[#fadcd4] font-mono text-xs border border-[#5b4039] mb-4 focus:outline-none focus:border-[#ff5722]"
                required
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setImportModalOpen(false)}
                  className="px-4 py-2 rounded bg-[#372621] text-[#ab8980] text-sm hover:bg-[#43302b]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#ff5722] text-white text-sm font-bold shadow-lg"
                >
                  Restore Backup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
