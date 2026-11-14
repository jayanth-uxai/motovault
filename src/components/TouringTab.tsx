import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Calendar, Plus, Trash2, CheckCircle2, Compass, Edit3 } from 'lucide-react';
import { Trip, ItineraryDay } from '../types';

export const TouringTab: React.FC = () => {
  const { state, addTrip, updateTrip, deleteTrip, setActiveTrip } = useApp();
  const [showNewTripModal, setShowNewTripModal] = useState(false);
  const [showAddDayModal, setShowAddDayModal] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(state.activeTripId);

  // New Trip form state
  const [tripTitle, setTripTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // New Itinerary Day form state
  const [dayNum, setDayNum] = useState(1);
  const [route, setRoute] = useState('');
  const [distanceKm, setDistanceKm] = useState('');
  const [stayDetails, setStayDetails] = useState('');
  const [dayNotes, setDayNotes] = useState('');

  const currentTrip = state.trips.find(t => t.id === selectedTripId) || state.trips[0];

  const handleTripSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tripTitle && destination) {
      addTrip({
        title: tripTitle,
        destination,
        startDate,
        endDate,
        status: 'planned',
        currentDayLeg: 1,
        totalDistancePlanned: 1500,
        itinerary: [
          {
            day: 1,
            route: `${destination} - Initial Leg`,
            distanceKm: 250,
            stayDetails: 'Local Lodge / Camp',
            notes: 'Start of expedition. Check tire pressures and chain lube.',
          },
        ],
      });
      setShowNewTripModal(false);
      setTripTitle('');
      setDestination('');
    }
  };

  const handleAddDaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTrip && route) {
      const newDay: ItineraryDay = {
        day: parseInt(dayNum.toString()) || currentTrip.itinerary.length + 1,
        route,
        distanceKm: parseInt(distanceKm) || 200,
        stayDetails,
        notes: dayNotes,
      };
      const updated: Trip = {
        ...currentTrip,
        itinerary: [...currentTrip.itinerary, newDay].sort((a, b) => a.day - b.day),
      };
      updateTrip(updated);
      setShowAddDayModal(false);
      setRoute('');
      setDistanceKm('');
      setStayDetails('');
      setDayNotes('');
    }
  };

  const handleDeleteItineraryDay = (dayIndex: number) => {
    if (currentTrip) {
      const updatedItinerary = currentTrip.itinerary.filter((_, idx) => idx !== dayIndex);
      updateTrip({ ...currentTrip, itinerary: updatedItinerary });
    }
  };

  const handleUpdateLeg = (newLeg: number) => {
    if (currentTrip) {
      updateTrip({ ...currentTrip, currentDayLeg: newLeg });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Trip Selector & Header */}
      <div className="brushed-aluminum p-6 rounded-2xl border border-[#5b4039] flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#ff5722] font-mono uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Touring Command Center</span>
          </div>
          <h3 className="text-2xl font-extrabold text-[#fadcd4] font-mono">Expedition Itineraries</h3>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={selectedTripId}
            onChange={e => setSelectedTripId(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[#180b07] text-[#fadcd4] font-mono text-sm border border-[#5b4039] focus:outline-none"
          >
            {state.trips.map(t => (
              <option key={t.id} value={t.id}>
                {t.title} {t.id === state.activeTripId ? ' (ACTIVE)' : ''}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowNewTripModal(true)}
            className="tactile-btn px-4 py-2 rounded-lg bg-[#ff5722] text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>New Expedition</span>
          </button>
        </div>
      </div>

      {currentTrip && (
        <div className="space-y-6">
          
          {/* Active Trip Banner card */}
          <div className="leather-texture p-6 rounded-2xl border-2 border-[#5b4039] shadow-2xl relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#ff5722]/20 text-[#ffb5a0] border border-[#ff5722]/40">
                  {currentTrip.status === 'active' ? 'ACTIVE EXPEDITION' : 'PLANNED / COMPLETED'}
                </span>
                <h2 className="text-3xl font-extrabold text-[#fadcd4] font-mono mt-2">{currentTrip.title}</h2>
                <p className="text-sm text-[#ab8980]">Destination: <strong className="text-[#fadcd4]">{currentTrip.destination}</strong> ({currentTrip.startDate} to {currentTrip.endDate})</p>
              </div>

              <div className="flex items-center gap-3">
                {currentTrip.id !== state.activeTripId && (
                  <button
                    onClick={() => setActiveTrip(currentTrip.id)}
                    className="tactile-btn px-4 py-2 rounded-lg bg-[#00E676] text-[#180b07] text-xs font-bold shadow-md"
                  >
                    Set as Active Trip
                  </button>
                )}
                <button
                  onClick={() => deleteTrip(currentTrip.id)}
                  className="p-2 rounded bg-[#372621] text-red-400 hover:bg-red-950/40 border border-[#5b4039]"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Current Day Progress Controller */}
            <div className="bg-[#180b07] p-4 rounded-xl border border-[#372621] flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#ab8980] font-mono uppercase">Current Leg Day:</span>
                <select
                  value={currentTrip.currentDayLeg}
                  onChange={e => handleUpdateLeg(parseInt(e.target.value))}
                  className="px-3 py-1 rounded bg-[#241410] text-[#00E676] font-mono font-bold text-sm border border-[#ff5722]"
                >
                  {currentTrip.itinerary.map(day => (
                    <option key={day.day} value={day.day}>Day {day.day}: {day.route}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setDayNum(currentTrip.itinerary.length + 1);
                  setShowAddDayModal(true);
                }}
                className="tactile-btn px-3 py-1.5 rounded bg-[#372621] text-[#ffb5a0] text-xs font-bold flex items-center gap-1 border border-[#5b4039]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Itinerary Day</span>
              </button>
            </div>
          </div>

          {/* Itinerary Timeline */}
          <div className="brushed-aluminum p-6 rounded-2xl border border-[#5b4039]">
            <h3 className="text-lg font-bold text-[#fadcd4] font-mono uppercase tracking-wider mb-6">Day-by-Day Route Itinerary</h3>
            
            <div className="space-y-4">
              {currentTrip.itinerary.map((item, idx) => {
                const isCurrent = currentTrip.currentDayLeg === item.day;
                return (
                  <div
                    key={idx}
                    className={`p-5 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-[#2e1d17] border-[#ff5722] shadow-lg shadow-[#ff5722]/10'
                        : 'bg-[#180b07] border-[#372621]'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-sm ${isCurrent ? 'bg-[#ff5722] text-white' : 'bg-[#372621] text-[#ab8980]'}`}>
                          D{item.day}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#fadcd4] font-mono text-base">{item.route}</h4>
                          <span className="text-xs text-[#00E676] font-mono">Distance: ~{item.distanceKm} km</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-[#ab8980] bg-[#241410] px-3 py-1 rounded-full border border-[#5b4039]">
                          Stay: {item.stayDetails}
                        </span>
                        <button
                          onClick={() => handleDeleteItineraryDay(idx)}
                          className="p-1 rounded text-red-400 hover:bg-red-950/40"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#ab8980] mt-2 italic bg-[#241410]/50 p-2.5 rounded border border-[#372621]/50">
                      Notes: {item.notes}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* NEW EXPEDITION MODAL */}
      {showNewTripModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="brushed-aluminum max-w-md w-full p-6 rounded-2xl border border-[#5b4039]">
            <h3 className="text-lg font-bold text-[#fadcd4] mb-4 font-mono">Plan New Expedition</h3>
            <form onSubmit={handleTripSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Expedition Title</label>
                <input
                  type="text"
                  value={tripTitle}
                  onChange={e => setTripTitle(e.target.value)}
                  placeholder="Spiti Valley Circuit 2025"
                  className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Primary Destination</label>
                <input
                  type="text"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  placeholder="Kaza - Chandratal"
                  className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTripModal(false)}
                  className="px-4 py-2 rounded bg-[#372621] text-[#ab8980] text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#ff5722] text-white text-sm font-bold shadow-lg"
                >
                  Create Expedition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD ITINERARY DAY MODAL */}
      {showAddDayModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="brushed-aluminum max-w-md w-full p-6 rounded-2xl border border-[#5b4039]">
            <h3 className="text-lg font-bold text-[#fadcd4] mb-4 font-mono">Add Itinerary Day Leg</h3>
            <form onSubmit={handleAddDaySubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Day Number</label>
                <input
                  type="number"
                  value={dayNum}
                  onChange={e => setDayNum(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Route (From &rarr; To)</label>
                <input
                  type="text"
                  value={route}
                  onChange={e => setRoute(e.target.value)}
                  placeholder="Leh &rarr; Nubra via Khardung La"
                  className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Distance (km)</label>
                <input
                  type="number"
                  value={distanceKm}
                  onChange={e => setDistanceKm(e.target.value)}
                  placeholder="120"
                  className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Stay / Hotel / Camp Details</label>
                <input
                  type="text"
                  value={stayDetails}
                  onChange={e => setStayDetails(e.target.value)}
                  placeholder="Nubra Organic Camp, Hunder"
                  className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Route Notes & Warnings</label>
                <textarea
                  rows={2}
                  value={dayNotes}
                  onChange={e => setDayNotes(e.target.value)}
                  placeholder="High altitude pass. Watch for black ice."
                  className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDayModal(false)}
                  className="px-4 py-2 rounded bg-[#372621] text-[#ab8980] text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#ff5722] text-white text-sm font-bold shadow-lg"
                >
                  Add Day Leg
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
