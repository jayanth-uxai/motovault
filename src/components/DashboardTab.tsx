import React from 'react';
import { useApp } from '../context/AppContext';
import { Gauge, MapPin, Wrench, Fuel, ShieldAlert, CheckCircle2, ArrowRight, ShieldCheck, Backpack } from 'lucide-react';

interface DashboardTabProps {
  setActiveTab: (tab: string) => void;
  onOpenChat: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ setActiveTab, onOpenChat }) => {
  const { state } = useApp();
  const currentOdo = state.bike.odoCurrent;

  // Find active trip
  const activeTrip = state.trips.find(t => t.id === state.activeTripId) || state.trips[0];

  // Calculate maintenance health based on last service or default intervals
  // Oil change interval: 5000 km
  // Chain service / replacement interval: 10000 km
  // Brake pads interval: 12000 km
  // Tires interval: 15000 km
  const lastOilServiceOdo = state.serviceLogs.find(s => s.productsUsed.some(p => p.name.toLowerCase().includes('oil')))?.odo || 0;
  const oilKmSince = currentOdo - lastOilServiceOdo;
  const oilHealth = Math.max(0, Math.min(100, Math.round((1 - (oilKmSince / 5000)) * 100)));

  const lastChainServiceOdo = 3000; // estimated last chain replacement
  const chainKmSince = currentOdo - lastChainServiceOdo;
  const chainHealth = Math.max(0, Math.min(100, Math.round((1 - (chainKmSince / 10000)) * 100)));

  const lastBrakeOdo = state.serviceLogs.find(s => s.partsReplaced.some(p => p.name.toLowerCase().includes('brake')))?.odo || 0;
  const brakeKmSince = currentOdo - lastBrakeOdo;
  const brakeHealth = Math.max(0, Math.min(100, Math.round((1 - (brakeKmSince / 12000)) * 100)));

  const tireHealth = Math.max(0, Math.min(100, Math.round((1 - (currentOdo / 18000)) * 100)));

  // Total spend calculations
  const totalServiceSpend = state.serviceLogs.reduce((acc, s) => acc + s.totalCost, 0);
  const totalFuelSpend = state.fuelLogs.reduce((acc, f) => acc + f.totalCost, 0);
  const totalFuelLiters = state.fuelLogs.reduce((acc, f) => acc + f.liters, 0);
  const totalFuelDistance = state.fuelLogs.length > 1 ? (state.fuelLogs[state.fuelLogs.length - 1].odo - state.fuelLogs[0].odo) : 1200;
  const avgMileage = totalFuelLiters > 0 ? (totalFuelDistance / totalFuelLiters).toFixed(1) : '32.5';

  // Packing percentage
  const totalPackedItems = state.luggage.filter(l => l.packed).length;
  const luggagePct = Math.round((totalPackedItems / (state.luggage.length || 1)) * 100);

  // Tools count
  const toolsCarriedCount = state.toolkit.filter(t => t.carried).length;

  return (
    <div className="space-y-6">
      
      {/* Embossed Spec Plate Banner */}
      <div className="brushed-aluminum p-6 rounded-xl border border-[#5b4039] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff5722]/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-xl embossed-plate flex flex-col items-center justify-center p-2 text-center shadow-lg">
            <span className="text-[10px] font-bold text-[#b02f00] tracking-widest uppercase">REG NO</span>
            <span className="text-xs font-black tracking-tight">{state.bike.regNumber}</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#ff5722] text-white">
                {state.bike.year} Model
              </span>
              <span className="text-xs text-[#ab8980] font-mono">VIN: {state.bike.vin.slice(0, 10)}...</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-wide text-[#fadcd4] font-mono">
              {state.bike.make} {state.bike.model}
            </h2>
            <p className="text-sm text-[#ab8980] mt-1">
              Engine: <strong className="text-[#fadcd4]">{state.bike.engineNo}</strong> | Spec Oil: <strong className="text-[#ffb5a0]">{state.bike.specs.oilGrade}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenChat}
            className="tactile-btn px-5 py-3 rounded-xl bg-gradient-to-r from-[#ff5722] to-[#b02f00] text-white font-bold flex items-center gap-2 shadow-xl hover:scale-105 transition-transform"
          >
            <Wrench className="w-5 h-5" />
            <span>Consult MotoBot AI</span>
          </button>
        </div>
      </div>

      {/* Active Trip Banner ("Where I am heading currently") */}
      {activeTrip && (
        <div className="leather-texture p-6 rounded-xl border-2 border-[#5b4039] shadow-xl relative">
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#00E676]/20 text-[#00E676] border border-[#00E676]/40 flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#00E676]"></span>
              LIVE EXPEDITION ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#ffb5a0] font-mono uppercase tracking-widest mb-1">
            <MapPin className="w-4 h-4 text-[#ff5722]" />
            <span>Current Destination & Itinerary</span>
          </div>
          <h3 className="text-2xl font-extrabold text-[#fadcd4] font-mono mb-2">{activeTrip.title}</h3>
          <p className="text-sm text-[#ab8980] mb-4">Heading to: <strong className="text-[#fadcd4]">{activeTrip.destination}</strong></p>

          {/* Current Leg Progress */}
          <div className="bg-[#180b07] p-4 rounded-lg border border-[#372621] mb-4">
            <div className="flex justify-between items-center mb-2 text-xs font-mono">
              <span className="text-[#ab8980]">Day {activeTrip.currentDayLeg} of {activeTrip.itinerary.length}</span>
              <span className="text-[#00E676]">
                {activeTrip.itinerary[activeTrip.currentDayLeg - 1]?.route || 'Route in progress'}
              </span>
            </div>
            <div className="w-full bg-[#372621] h-3 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-[#ff5722] to-[#00E676] h-full rounded-full transition-all duration-500"
                style={{ width: `${(activeTrip.currentDayLeg / activeTrip.itinerary.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-[#ab8980] mt-2 italic">
              Today's Stay: {activeTrip.itinerary[activeTrip.currentDayLeg - 1]?.stayDetails || 'Standard Camping / Lodge'}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('touring')}
            className="text-xs font-bold text-[#ffb5a0] hover:text-[#ff5722] flex items-center gap-1"
          >
            <span>View Full Itinerary & Waypoints</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Maintenance Health Gauges & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Oil Health Gauge */}
        <div className="brushed-aluminum p-5 rounded-xl border border-[#5b4039] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs text-[#ab8980] font-mono uppercase">Engine Oil Health</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${oilHealth > 30 ? 'bg-[#00E676]/20 text-[#00E676]' : 'bg-[#ffb4ab]/20 text-[#ffb4ab]'}`}>
              {oilHealth}%
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold font-mono text-[#fadcd4]">
              {5000 - (oilKmSince % 5000)} km <span className="text-xs font-normal text-[#ab8980]">until change</span>
            </div>
            <div className="w-full bg-[#180b07] h-2 rounded-full overflow-hidden mt-3">
              <div className={`h-full rounded-full ${oilHealth > 30 ? 'bg-[#00E676]' : 'bg-[#ffb4ab]'}`} style={{ width: `${oilHealth}%` }}></div>
            </div>
          </div>
          <p className="text-[11px] text-[#ab8980] mt-2">Last changed at {lastOilServiceOdo} km</p>
        </div>

        {/* Chain & Sprocket Health */}
        <div className="brushed-aluminum p-5 rounded-xl border border-[#5b4039] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs text-[#ab8980] font-mono uppercase">Chain & Sprocket</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${chainHealth > 30 ? 'bg-[#00E676]/20 text-[#00E676]' : 'bg-[#ffb4ab]/20 text-[#ffb4ab]'}`}>
              {chainHealth}%
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold font-mono text-[#fadcd4]">
              {chainHealth > 40 ? 'Good Tension' : 'Inspect Slack'}
            </div>
            <div className="w-full bg-[#180b07] h-2 rounded-full overflow-hidden mt-3">
              <div className="bg-[#e9c349] h-full rounded-full" style={{ width: `${chainHealth}%` }}></div>
            </div>
          </div>
          <p className="text-[11px] text-[#ab8980] mt-2">Recommended slack: {state.bike.specs.chainSlack}</p>
        </div>

        {/* Brake Pads Health */}
        <div className="brushed-aluminum p-5 rounded-xl border border-[#5b4039] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs text-[#ab8980] font-mono uppercase">Brake Pads Wear</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${brakeHealth > 30 ? 'bg-[#00E676]/20 text-[#00E676]' : 'bg-[#ffb4ab]/20 text-[#ffb4ab]'}`}>
              {brakeHealth}%
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold font-mono text-[#fadcd4]">
              {brakeHealth > 30 ? 'Optimal Bite' : 'Replace Soon'}
            </div>
            <div className="w-full bg-[#180b07] h-2 rounded-full overflow-hidden mt-3">
              <div className="bg-[#86cfff] h-full rounded-full" style={{ width: `${brakeHealth}%` }}></div>
            </div>
          </div>
          <p className="text-[11px] text-[#ab8980] mt-2">ABS Enabled Dual Channel</p>
        </div>

        {/* Tire Tread Health */}
        <div className="brushed-aluminum p-5 rounded-xl border border-[#5b4039] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs text-[#ab8980] font-mono uppercase">Tire Tread (F/R)</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#00E676]/20 text-[#00E676]">
              {tireHealth}%
            </span>
          </div>
          <div className="my-2">
            <div className="text-xl font-extrabold font-mono text-[#fadcd4]">
              {state.bike.specs.frontPsi} / {state.bike.specs.rearPsi} <span className="text-xs text-[#ab8980]">PSI</span>
            </div>
            <div className="w-full bg-[#180b07] h-2 rounded-full overflow-hidden mt-3">
              <div className="bg-[#00E676] h-full rounded-full" style={{ width: `${tireHealth}%` }}></div>
            </div>
          </div>
          <p className="text-[11px] text-[#ab8980] mt-2">Tubeless Spoke Rims</p>
        </div>

      </div>

      {/* Financial & Saddlebag Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Lifetime Maintenance Spend */}
        <div className="brushed-aluminum p-5 rounded-xl border border-[#5b4039]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#ab8980] font-mono uppercase">Lifetime Maintenance</span>
            <Wrench className="w-4 h-4 text-[#ff5722]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#fadcd4] mb-1">
            ₹ {totalServiceSpend.toLocaleString()}
          </div>
          <p className="text-xs text-[#ab8980]">Across {state.serviceLogs.length} workshop service logs</p>
          <button
            onClick={() => setActiveTab('workshop')}
            className="mt-4 text-xs font-bold text-[#ffb5a0] hover:text-[#ff5722] flex items-center gap-1"
          >
            <span>View Workshop Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Fuel Spend & Economy */}
        <div className="brushed-aluminum p-5 rounded-xl border border-[#5b4039]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#ab8980] font-mono uppercase">Fuel Spend & Economy</span>
            <Fuel className="w-4 h-4 text-[#e9c349]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#fadcd4] mb-1">
            ₹ {totalFuelSpend.toLocaleString()}
          </div>
          <p className="text-xs text-[#ab8980]">Avg Mileage: <strong className="text-[#00E676]">{avgMileage} km/L</strong> ({totalFuelLiters.toFixed(1)} L)</p>
          <button
            onClick={() => setActiveTab('workshop')}
            className="mt-4 text-xs font-bold text-[#ffb5a0] hover:text-[#ff5722] flex items-center gap-1"
          >
            <span>View Fuel Logs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Saddlebag Packing & Toolkit Status */}
        <div className="brushed-aluminum p-5 rounded-xl border border-[#5b4039]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#ab8980] font-mono uppercase">Saddlebag & Toolkit</span>
            <Backpack className="w-4 h-4 text-[#86cfff]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#fadcd4] mb-1">
            {luggagePct}% <span className="text-xs font-normal text-[#ab8980]">Packed</span>
          </div>
          <p className="text-xs text-[#ab8980]">{toolsCarriedCount} essential tools mapped in compartments</p>
          <button
            onClick={() => setActiveTab('saddlebag')}
            className="mt-4 text-xs font-bold text-[#ffb5a0] hover:text-[#ff5722] flex items-center gap-1"
          >
            <span>Manage Toolkit & Luggage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
