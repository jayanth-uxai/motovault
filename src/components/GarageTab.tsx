import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, BookOpen, Plus, Trash2, FileText, CheckCircle, AlertTriangle, PhoneCall } from 'lucide-react';

export const GarageTab: React.FC = () => {
  const { state, addNote, deleteNote } = useApp();
  const bike = state.bike;
  const insurance = bike.insurance;

  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);

  // Calculate insurance expiry countdown
  const expiryDate = new Date(insurance.expiryDate);
  const today = new Date();
  const diffTime = expiryDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isExpiringSoon = daysRemaining <= 30;

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNoteTitle.trim() && newNoteContent.trim()) {
      addNote(newNoteTitle, newNoteContent);
      setNewNoteTitle('');
      setNewNoteContent('');
      setShowNoteModal(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Section: Laminated Insurance Card & Spec Plate */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Laminated Insurance Card (Glovebox style) */}
        <div className="laminated-card p-6 rounded-2xl lg:col-span-1 border-2 border-[#5b4039] shadow-2xl relative">
          <div className="absolute top-4 right-4 bg-[#ff5722]/20 text-[#ffb5a0] px-3 py-1 rounded-full text-xs font-mono font-bold border border-[#ff5722]/40">
            GLOVEBOX VAULT
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-[#ff5722]" />
            <h3 className="text-lg font-bold text-[#fadcd4] font-mono uppercase tracking-wider">Insurance Card</h3>
          </div>

          <div className="space-y-3 mb-6 text-sm font-mono">
            <div>
              <span className="text-xs text-[#ab8980] block">Provider</span>
              <strong className="text-[#fadcd4]">{insurance.provider}</strong>
            </div>
            <div>
              <span className="text-xs text-[#ab8980] block">Policy Number</span>
              <span className="text-[#00E676]">{insurance.policyNo}</span>
            </div>
            <div>
              <span className="text-xs text-[#ab8980] block">Insured Declared Value (IDV)</span>
              <span className="text-[#fadcd4] font-bold">{insurance.idv}</span>
            </div>
            <div>
              <span className="text-xs text-[#ab8980] block">Coverage Type</span>
              <span className="text-xs text-[#ffb5a0]">{insurance.coverage}</span>
            </div>
          </div>

          {/* Expiry Countdown Badge */}
          <div className={`p-3 rounded-xl border flex items-center justify-between mb-4 ${isExpiringSoon ? 'bg-[#93000a]/30 border-[#ffb4ab]' : 'bg-[#180b07] border-[#372621]'}`}>
            <div>
              <span className="text-[10px] text-[#ab8980] uppercase block">Validity Expiry</span>
              <span className="text-sm font-mono font-bold text-[#fadcd4]">{insurance.expiryDate}</span>
            </div>
            <div className={`text-right ${isExpiringSoon ? 'text-[#ffb4ab]' : 'text-[#00E676]'}`}>
              <span className="text-lg font-black font-mono">{daysRemaining}</span>
              <span className="text-xs block">days left</span>
            </div>
          </div>

          <a
            href={`tel:${insurance.helpline}`}
            className="w-full py-2.5 rounded-lg bg-[#372621] hover:bg-[#483530] text-[#ffb5a0] font-bold text-xs uppercase flex items-center justify-center gap-2 border border-[#5b4039] transition-colors"
          >
            <PhoneCall className="w-4 h-4 text-[#ff5722]" />
            <span>Call Helpline: {insurance.helpline}</span>
          </a>
        </div>

        {/* Vehicle Spec Plate & Factory Specifications */}
        <div className="brushed-aluminum p-6 rounded-2xl lg:col-span-2 border border-[#5b4039] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#fadcd4] font-mono uppercase tracking-wider">Factory Specification Plate</h3>
              <span className="px-3 py-1 rounded bg-[#180b07] text-xs font-mono text-[#00E676] border border-[#372621]">
                Verified OEM Specs
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#180b07] p-3.5 rounded-xl border border-[#372621]">
                <span className="text-xs text-[#ab8980] block mb-1">Recommended Tire Pressure</span>
                <div className="text-base font-mono font-bold text-[#fadcd4]">
                  Front: <span className="text-[#00E676]">{bike.specs.frontPsi} PSI</span> | Rear: <span className="text-[#00E676]">{bike.specs.rearPsi} PSI</span>
                </div>
              </div>

              <div className="bg-[#180b07] p-3.5 rounded-xl border border-[#372621]">
                <span className="text-xs text-[#ab8980] block mb-1">Engine Oil Grade & Capacity</span>
                <div className="text-sm font-mono font-bold text-[#fadcd4] truncate">
                  {bike.specs.oilGrade}
                </div>
              </div>

              <div className="bg-[#180b07] p-3.5 rounded-xl border border-[#372621]">
                <span className="text-xs text-[#ab8980] block mb-1">Chain Slack Standard</span>
                <div className="text-sm font-mono font-bold text-[#fadcd4]">
                  {bike.specs.chainSlack}
                </div>
              </div>

              <div className="bg-[#180b07] p-3.5 rounded-xl border border-[#372621]">
                <span className="text-xs text-[#ab8980] block mb-1">Coolant Specification</span>
                <div className="text-sm font-mono font-bold text-[#fadcd4]">
                  {bike.specs.coolantType}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4 border-t border-[#372621] text-xs font-mono text-[#ab8980]">
            <div>Chassis/VIN: <strong className="text-[#fadcd4] block">{bike.vin}</strong></div>
            <div>Engine No: <strong className="text-[#fadcd4] block">{bike.engineNo}</strong></div>
            <div>Registration: <strong className="text-[#fadcd4] block">{bike.regNumber}</strong></div>
          </div>
        </div>

      </div>

      {/* Owner's Manual & Quick-Reference Notes */}
      <div className="brushed-aluminum p-6 rounded-2xl border border-[#5b4039]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#ff5722]" />
            <h3 className="text-lg font-bold text-[#fadcd4] font-mono uppercase tracking-wider">Owner's Manual & Quick Reference Notes</h3>
          </div>
          <button
            onClick={() => setShowNoteModal(true)}
            className="tactile-btn px-4 py-2 rounded-lg bg-[#ff5722] text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Manual Note</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bike.notes.map(note => (
            <div key={note.id} className="bg-[#180b07] p-4 rounded-xl border border-[#372621] relative group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[#fadcd4] font-mono text-sm">{note.title}</h4>
                  <span className="text-[10px] text-[#ab8980] font-mono">{note.date}</span>
                </div>
                <p className="text-xs text-[#ab8980] leading-relaxed whitespace-pre-wrap">{note.content}</p>
              </div>
              <div className="flex justify-end mt-4 pt-2 border-t border-[#271813]">
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-xs text-[#ffb4ab] hover:text-red-400 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="brushed-aluminum max-w-lg w-full p-6 rounded-xl border border-[#5b4039]">
            <h3 className="text-lg font-bold text-[#fadcd4] mb-4 font-mono">Add Quick-Reference Note</h3>
            <form onSubmit={handleAddNoteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Note Title (e.g. Torque Specs, Fuse Box)</label>
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={e => setNewNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039] focus:outline-none focus:border-[#ff5722]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Content / Reference Values</label>
                <textarea
                  rows={4}
                  value={newNoteContent}
                  onChange={e => setNewNoteContent(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039] focus:outline-none focus:border-[#ff5722]"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 rounded bg-[#372621] text-[#ab8980] text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#ff5722] text-white text-sm font-bold shadow-lg"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
