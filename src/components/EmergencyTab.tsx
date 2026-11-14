import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PhoneCall, ShieldAlert, Heart, Plus, Trash2, MapPin, ExternalLink } from 'lucide-react';
import { RSAProvider } from '../types';

export const EmergencyTab: React.FC = () => {
  const { state, addRSAProvider, deleteRSAProvider } = useApp();
  const emergency = state.emergency;

  const [selectedStateId, setSelectedStateId] = useState(emergency.stateDirectory[0]?.id || '');
  const [showRSAModal, setShowRSAModal] = useState(false);

  // New RSA form
  const [providerName, setProviderName] = useState('');
  const [planId, setPlanId] = useState('');
  const [tollFreeNumber, setTollFreeNumber] = useState('');
  const [coverageNotes, setCoverageNotes] = useState('');
  const [validTill, setValidTill] = useState('2027-08-14');

  const selectedState = emergency.stateDirectory.find(s => s.id === selectedStateId) || emergency.stateDirectory[0];

  const handleRSASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (providerName && tollFreeNumber) {
      addRSAProvider({
        providerName,
        planId: planId || 'POLICY-VIP',
        tollFreeNumber,
        coverageNotes,
        validTill,
      });
      setShowRSAModal(false);
      setProviderName('');
      setPlanId('');
      setTollFreeNumber('');
      setCoverageNotes('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Personal ICE & Blood Group Badge */}
      <div className="brushed-aluminum p-6 rounded-2xl border-2 border-[#ff5722]/40 shadow-2xl relative">
        <div className="absolute top-4 right-4 bg-[#ff5722] text-white px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 shadow-md">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>ICE & MEDICAL ID</span>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-xl bg-[#93000a] text-[#ffdad6] flex flex-col items-center justify-center font-mono font-black text-xl border border-[#ffb4ab]">
            <span>{emergency.bloodGroup.split(' ')[0]}</span>
            <span className="text-[10px] tracking-tight">{emergency.bloodGroup.split(' ')[1] || ''}</span>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#fadcd4] font-mono">In Case of Emergency (ICE)</h3>
            <p className="text-xs text-[#ab8980] mt-0.5">Medical Info: <strong className="text-[#fadcd4]">{emergency.medicalConditions}</strong></p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#180b07] p-4 rounded-xl border border-[#372621] flex justify-between items-center">
            <div>
              <span className="text-xs text-[#ab8980] block font-mono">Primary Contact ({emergency.primaryContact.relation})</span>
              <strong className="text-base text-[#fadcd4] font-mono">{emergency.primaryContact.name}</strong>
            </div>
            <a
              href={`tel:${emergency.primaryContact.phone}`}
              className="tactile-btn px-4 py-2 rounded-lg bg-[#ff5722] text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{emergency.primaryContact.phone}</span>
            </a>
          </div>

          <div className="bg-[#180b07] p-4 rounded-xl border border-[#372621] flex justify-between items-center">
            <div>
              <span className="text-xs text-[#ab8980] block font-mono">Secondary Contact ({emergency.secondaryContact.relation})</span>
              <strong className="text-base text-[#fadcd4] font-mono">{emergency.secondaryContact.name}</strong>
            </div>
            <a
              href={`tel:${emergency.secondaryContact.phone}`}
              className="tactile-btn px-4 py-2 rounded-lg bg-[#372621] text-[#ffb5a0] text-xs font-bold flex items-center gap-1.5 border border-[#5b4039]"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{emergency.secondaryContact.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Multi-RSA Wallet Section */}
      <div className="brushed-aluminum p-6 rounded-2xl border border-[#5b4039]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-[#fadcd4] font-mono uppercase tracking-wider">Roadside Assistance (RSA) Wallet</h3>
          <button
            onClick={() => setShowRSAModal(true)}
            className="tactile-btn px-4 py-2 rounded-lg bg-[#ff5722] text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add RSA Card</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergency.rsaProviders.map(rsa => (
            <div key={rsa.id} className="laminated-card p-5 rounded-xl border border-[#5b4039] relative flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[#fadcd4] font-mono text-sm">{rsa.providerName}</h4>
                  <button
                    onClick={() => deleteRSAProvider(rsa.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1 text-xs font-mono text-[#ab8980] mb-4">
                  <div>Policy ID: <strong className="text-[#00E676]">{rsa.planId}</strong></div>
                  <div>Valid Till: {rsa.validTill}</div>
                  <p className="mt-2 text-[#fadcd4] italic">{rsa.coverageNotes}</p>
                </div>
              </div>

              <a
                href={`tel:${rsa.tollFreeNumber}`}
                className="w-full py-2 rounded bg-[#ff5722] text-white font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-lg hover:bg-[#e0481b]"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Toll-Free: {rsa.tollFreeNumber}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* State-Wise Emergency Directory */}
      <div className="brushed-aluminum p-6 rounded-2xl border border-[#5b4039]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#fadcd4] font-mono uppercase tracking-wider">State-Wise Emergency Directory</h3>
            <p className="text-xs text-[#ab8980]">Highway patrol, police, ambulance & regional towing contacts</p>
          </div>

          <select
            value={selectedStateId}
            onChange={e => setSelectedStateId(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[#180b07] text-[#fadcd4] font-mono text-sm border border-[#5b4039] focus:outline-none"
          >
            {emergency.stateDirectory.map(st => (
              <option key={st.id} value={st.id}>{st.stateName}</option>
            ))}
          </select>
        </div>

        {selectedState && (
          <div className="bg-[#180b07] p-6 rounded-xl border border-[#372621]">
            <div className="flex items-center gap-2 text-xs text-[#ff5722] font-mono uppercase mb-4">
              <MapPin className="w-4 h-4" />
              <span>Region: {selectedState.stateName}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              
              <div className="bg-[#241410] p-4 rounded-xl border border-[#5b4039]">
                <span className="text-xs text-[#ab8980] block font-mono uppercase mb-1">Police / Emergency</span>
                <a href={`tel:${selectedState.policeNumber.split('/')[0].trim()}`} className="text-base font-bold text-[#fadcd4] font-mono hover:text-[#ff5722] flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-[#ff5722]" />
                  <span>{selectedState.policeNumber}</span>
                </a>
              </div>

              <div className="bg-[#241410] p-4 rounded-xl border border-[#5b4039]">
                <span className="text-xs text-[#ab8980] block font-mono uppercase mb-1">Highway Patrol</span>
                <a href={`tel:${selectedState.highwayPatrolNumber.split('/')[0].trim()}`} className="text-base font-bold text-[#fadcd4] font-mono hover:text-[#ff5722] flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-[#e9c349]" />
                  <span>{selectedState.highwayPatrolNumber}</span>
                </a>
              </div>

              <div className="bg-[#241410] p-4 rounded-xl border border-[#5b4039]">
                <span className="text-xs text-[#ab8980] block font-mono uppercase mb-1">Ambulance & Trauma</span>
                <a href={`tel:${selectedState.ambulanceNumber.split('/')[0].trim()}`} className="text-base font-bold text-[#00E676] font-mono hover:underline flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-[#00E676]" />
                  <span>{selectedState.ambulanceNumber}</span>
                </a>
              </div>

              <div className="bg-[#241410] p-4 rounded-xl border border-[#5b4039]">
                <span className="text-xs text-[#ab8980] block font-mono uppercase mb-1">Local Towing & Rescue</span>
                <a href={`tel:${selectedState.towingContact.split(': ')[1] || selectedState.towingContact}`} className="text-sm font-bold text-[#ffb5a0] font-mono hover:underline flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-[#ffb5a0]" />
                  <span>{selectedState.towingContact}</span>
                </a>
              </div>

            </div>

            <p className="text-xs text-[#ab8980] italic">
              <strong>Regional Notes:</strong> {selectedState.localServiceNotes}
            </p>
          </div>
        )}
      </div>

      {/* ADD RSA MODAL */}
      {showRSAModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="brushed-aluminum max-w-md w-full p-6 rounded-2xl border border-[#5b4039]">
            <h3 className="text-lg font-bold text-[#fadcd4] mb-4 font-mono">Add Roadside Assistance Membership</h3>
            <form onSubmit={handleRSASubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Provider Name</label>
                <input
                  type="text"
                  value={providerName}
                  onChange={e => setProviderName(e.target.value)}
                  placeholder="TVS Auto Assist / Allianz"
                  className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Plan / Policy ID</label>
                <input
                  type="text"
                  value={planId}
                  onChange={e => setPlanId(e.target.value)}
                  placeholder="TVS-RSA-88219"
                  className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Toll-Free Helpline Number</label>
                <input
                  type="text"
                  value={tollFreeNumber}
                  onChange={e => setTollFreeNumber(e.target.value)}
                  placeholder="1800-425-2000"
                  className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Coverage Notes</label>
                <textarea
                  rows={2}
                  value={coverageNotes}
                  onChange={e => setCoverageNotes(e.target.value)}
                  placeholder="Unlimited towing, flatbed pickup..."
                  className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Valid Till</label>
                <input
                  type="date"
                  value={validTill}
                  onChange={e => setValidTill(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRSAModal(false)}
                  className="px-4 py-2 rounded bg-[#372621] text-[#ab8980] text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#ff5722] text-white text-sm font-bold shadow-lg"
                >
                  Save RSA Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
