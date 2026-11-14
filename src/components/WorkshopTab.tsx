import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Wrench, Fuel, Plus, Trash2, Calendar, DollarSign, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { ServiceLineItem } from '../types';

export const WorkshopTab: React.FC = () => {
  const { state, addServiceRecord, deleteServiceRecord, addFuelRecord, deleteFuelRecord } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'service' | 'fuel'>('service');
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showFuelModal, setShowFuelModal] = useState(false);

  // Service form state
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [serviceOdo, setServiceOdo] = useState(state.bike.odoCurrent.toString());
  const [workshopName, setWorkshopName] = useState('');
  const [mechanicName, setMechanicName] = useState('');
  const [serviceNotes, setServiceNotes] = useState('');
  
  const [products, setProducts] = useState<Array<{ name: string; cost: string }>>([{ name: '', cost: '' }]);
  const [parts, setParts] = useState<Array<{ name: string; partNo: string; cost: string }>>([{ name: '', partNo: '', cost: '' }]);

  // Fuel form state
  const [fuelDate, setFuelDate] = useState(new Date().toISOString().split('T')[0]);
  const [fuelOdo, setFuelOdo] = useState(state.bike.odoCurrent.toString());
  const [liters, setLiters] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [station, setStation] = useState('');
  const [fullTank, setFullTank] = useState(true);

  // Expanded ledger items
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

  const handleAddProductRow = () => setProducts([...products, { name: '', cost: '' }]);
  const handleAddPartRow = () => setParts([...parts, { name: '', partNo: '', cost: '' }]);

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedProducts: ServiceLineItem[] = products
      .filter(p => p.name.trim() && !isNaN(parseFloat(p.cost)))
      .map((p, idx) => ({ id: `p-${idx}`, name: p.name, cost: parseFloat(p.cost) }));

    const formattedParts: ServiceLineItem[] = parts
      .filter(pt => pt.name.trim() && !isNaN(parseFloat(pt.cost)))
      .map((pt, idx) => ({ id: `pr-${idx}`, name: pt.name, partNo: pt.partNo, cost: parseFloat(pt.cost) }));

    const productTotal = formattedProducts.reduce((acc, p) => acc + p.cost, 0);
    const partTotal = formattedParts.reduce((acc, pt) => acc + pt.cost, 0);
    const totalCostSum = productTotal + partTotal;

    addServiceRecord({
      date: serviceDate,
      odo: parseInt(serviceOdo) || state.bike.odoCurrent,
      workshop: workshopName || 'Authorised Workshop',
      mechanicName,
      notes: serviceNotes,
      productsUsed: formattedProducts,
      partsReplaced: formattedParts,
      totalCost: totalCostSum,
    });

    setShowServiceModal(false);
    setWorkshopName('');
    setMechanicName('');
    setServiceNotes('');
    setProducts([{ name: '', cost: '' }]);
    setParts([{ name: '', partNo: '', cost: '' }]);
  };

  const handleFuelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const l = parseFloat(liters);
    const c = parseFloat(totalCost);
    const o = parseInt(fuelOdo);
    if (!isNaN(l) && !isNaN(c) && !isNaN(o)) {
      addFuelRecord({
        date: fuelDate,
        odo: o,
        liters: l,
        totalCost: c,
        station: station || 'Local Fuel Pump',
        fullTank,
        pricePerLiter: Number((c / l).toFixed(2)),
      });
      setShowFuelModal(false);
      setLiters('');
      setTotalCost('');
      setStation('');
    }
  };

  // Cumulative sums
  const totalServiceSpend = state.serviceLogs.reduce((acc, s) => acc + s.totalCost, 0);
  const totalFuelSpend = state.fuelLogs.reduce((acc, f) => acc + f.totalCost, 0);
  const totalLiters = state.fuelLogs.reduce((acc, f) => acc + f.liters, 0);
  const totalFuelDist = state.fuelLogs.length > 1 ? (state.fuelLogs[0].odo - state.fuelLogs[state.fuelLogs.length - 1].odo) : 1200;

  return (
    <div className="space-y-6">
      
      {/* Sub-tab Switcher */}
      <div className="flex items-center justify-between bg-[#180b07] p-2 rounded-xl border border-[#372621]">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab('service')}
            className={`px-5 py-2 rounded-lg text-sm font-bold font-mono transition-all flex items-center gap-2 ${
              activeSubTab === 'service'
                ? 'bg-[#372621] text-[#ffb5a0] border border-[#5b4039] shadow-inner'
                : 'text-[#ab8980] hover:text-[#fadcd4]'
            }`}
          >
            <Wrench className="w-4 h-4 text-[#ff5722]" />
            <span>Service History & Parts Ledger ({state.serviceLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('fuel')}
            className={`px-5 py-2 rounded-lg text-sm font-bold font-mono transition-all flex items-center gap-2 ${
              activeSubTab === 'fuel'
                ? 'bg-[#372621] text-[#ffb5a0] border border-[#5b4039] shadow-inner'
                : 'text-[#ab8980] hover:text-[#fadcd4]'
            }`}
          >
            <Fuel className="w-4 h-4 text-[#e9c349]" />
            <span>Fuel Log & Economy ({state.fuelLogs.length})</span>
          </button>
        </div>

        <div>
          {activeSubTab === 'service' ? (
            <button
              onClick={() => setShowServiceModal(true)}
              className="tactile-btn px-4 py-2 rounded-lg bg-[#ff5722] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Log Service Record</span>
            </button>
          ) : (
            <button
              onClick={() => setShowFuelModal(true)}
              className="tactile-btn px-4 py-2 rounded-lg bg-[#e9c349] text-[#241a00] text-xs font-bold flex items-center gap-1.5 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Log Fuel Fill</span>
            </button>
          )}
        </div>
      </div>

      {/* SERVICE HISTORY LEDGER */}
      {activeSubTab === 'service' && (
        <div className="workshop-paper p-6 rounded-2xl border-2 border-[#b5a687] relative">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#d8ccb2]">
            <div>
              <h3 className="text-xl font-black text-[#271c14] font-mono">WORKSHOP MAINTENANCE LEDGER</h3>
              <p className="text-xs text-[#705c44]">Itemized products & parts replacement records</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#705c44] uppercase block">Lifetime Maintenance Spend</span>
              <span className="text-xl font-black text-[#93000a] font-mono">₹ {totalServiceSpend.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-4">
            {state.serviceLogs.map(log => {
              const isExpanded = expandedServiceId === log.id;
              return (
                <div key={log.id} className="bg-white/90 p-5 rounded-xl border border-[#d8ccb2] shadow-sm">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-[#372621] text-[#ffb5a0] font-mono font-bold text-xs">
                        {log.odo.toLocaleString()} km
                      </div>
                      <div>
                        <h4 className="font-bold text-[#271c14] font-mono text-base">{log.workshop}</h4>
                        <p className="text-xs text-[#705c44]">Date: {log.date} {log.mechanicName ? `| Mechanic: ${log.mechanicName}` : ''}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-lg font-black font-mono text-[#93000a]">₹ {log.totalCost.toLocaleString()}</span>
                      <button
                        onClick={() => setExpandedServiceId(isExpanded ? null : log.id)}
                        className="p-1.5 rounded bg-[#f7f3eb] text-[#271c14] hover:bg-[#e5dec9]"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteServiceRecord(log.id)}
                        className="p-1.5 rounded text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#483530] italic mb-3">"{log.notes}"</p>

                  {/* Expanded Breakdown */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-[#d8ccb2] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="bg-[#f7f3eb] p-3 rounded-lg border border-[#e5dec9]">
                        <span className="font-bold text-[#271c14] block mb-2 uppercase text-[10px] text-[#705c44]">Products & Consumables Used</span>
                        {log.productsUsed.length > 0 ? (
                          <ul className="space-y-1">
                            {log.productsUsed.map((p, idx) => (
                              <li key={idx} className="flex justify-between text-[#271c14]">
                                <span>• {p.name}</span>
                                <span className="font-bold">₹ {p.cost}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400 italic">No consumables logged</span>
                        )}
                      </div>

                      <div className="bg-[#f7f3eb] p-3 rounded-lg border border-[#e5dec9]">
                        <span className="font-bold text-[#271c14] block mb-2 uppercase text-[10px] text-[#705c44]">Parts Replaced</span>
                        {log.partsReplaced.length > 0 ? (
                          <ul className="space-y-1">
                            {log.partsReplaced.map((pr, idx) => (
                              <li key={idx} className="flex justify-between text-[#271c14]">
                                <span>• {pr.name} {pr.partNo ? `(PN: ${pr.partNo})` : ''}</span>
                                <span className="font-bold">₹ {pr.cost}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400 italic">No hard parts replaced</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FUEL LOG TAB */}
      {activeSubTab === 'fuel' && (
        <div className="space-y-6">
          {/* Fuel Stats Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="brushed-aluminum p-5 rounded-xl border border-[#5b4039]">
              <span className="text-xs text-[#ab8980] block font-mono uppercase mb-1">Total Fuel Expenditure</span>
              <div className="text-3xl font-extrabold font-mono text-[#fadcd4]">₹ {totalFuelSpend.toLocaleString()}</div>
              <span className="text-xs text-[#ab8980]">{totalLiters.toFixed(1)} Liters consumed</span>
            </div>
            <div className="brushed-aluminum p-5 rounded-xl border border-[#5b4039]">
              <span className="text-xs text-[#ab8980] block font-mono uppercase mb-1">Average Fuel Economy</span>
              <div className="text-3xl font-extrabold font-mono text-[#00E676]">
                {totalLiters > 0 ? (totalFuelDist / totalLiters).toFixed(1) : '32.5'} <span className="text-sm">km/L</span>
              </div>
              <span className="text-xs text-[#ab8980]">Calculated across logged segments</span>
            </div>
            <div className="brushed-aluminum p-5 rounded-xl border border-[#5b4039]">
              <span className="text-xs text-[#ab8980] block font-mono uppercase mb-1">Cost Per Kilometer</span>
              <div className="text-3xl font-extrabold font-mono text-[#e9c349]">
                ₹ {totalFuelDist > 0 ? (totalFuelSpend / totalFuelDist).toFixed(2) : '3.20'} <span className="text-sm">/ km</span>
              </div>
              <span className="text-xs text-[#ab8980]">Fuel operational cost</span>
            </div>
          </div>

          {/* Fuel Records Table */}
          <div className="brushed-aluminum p-6 rounded-2xl border border-[#5b4039]">
            <h3 className="text-lg font-bold text-[#fadcd4] font-mono uppercase tracking-wider mb-4">Fuel Log History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm font-mono">
                <thead>
                  <tr className="border-b border-[#372621] text-xs text-[#ab8980]">
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Odometer</th>
                    <th className="pb-3">Station</th>
                    <th className="pb-3">Liters</th>
                    <th className="pb-3">Price/L</th>
                    <th className="pb-3">Total Cost</th>
                    <th className="pb-3">Full Tank</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#372621]/50">
                  {state.fuelLogs.map(fuel => (
                    <tr key={fuel.id} className="hover:bg-[#271813]">
                      <td className="py-3 text-[#fadcd4]">{fuel.date}</td>
                      <td className="py-3 text-[#00E676]">{fuel.odo.toLocaleString()} km</td>
                      <td className="py-3 text-[#ab8980]">{fuel.station}</td>
                      <td className="py-3 text-[#fadcd4]">{fuel.liters} L</td>
                      <td className="py-3 text-[#ab8980]">₹ {fuel.pricePerLiter}</td>
                      <td className="py-3 text-[#fadcd4] font-bold">₹ {fuel.totalCost.toLocaleString()}</td>
                      <td className="py-3">
                        {fuel.fullTank ? (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-[#00E676]/20 text-[#00E676]">Full</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-[#e9c349]/20 text-[#e9c349]">Top-up</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => deleteFuelRecord(fuel.id)}
                          className="p-1 rounded text-red-400 hover:bg-red-950/40"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SERVICE RECORD MODAL */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="brushed-aluminum max-w-2xl w-full p-6 rounded-2xl border border-[#5b4039] max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-[#fadcd4] mb-4 font-mono">Log Workshop Service Record</h3>
            <form onSubmit={handleServiceSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Service Date</label>
                  <input
                    type="date"
                    value={serviceDate}
                    onChange={e => setServiceDate(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Odometer (km)</label>
                  <input
                    type="number"
                    value={serviceOdo}
                    onChange={e => setServiceOdo(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Workshop / Service Center Name</label>
                  <input
                    type="text"
                    value={workshopName}
                    onChange={e => setWorkshopName(e.target.value)}
                    placeholder="e.g. RE Authorised Service Center"
                    className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Mechanic Name (Optional)</label>
                  <input
                    type="text"
                    value={mechanicName}
                    onChange={e => setMechanicName(e.target.value)}
                    placeholder="e.g. Santosh"
                    className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Service Notes & Work Done</label>
                <textarea
                  rows={2}
                  value={serviceNotes}
                  onChange={e => setServiceNotes(e.target.value)}
                  placeholder="General inspection, chain adjustment, oil flush..."
                  className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                />
              </div>

              {/* Products / Consumables */}
              <div className="bg-[#180b07] p-4 rounded-xl border border-[#372621]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono font-bold text-[#ffb5a0] uppercase">Products & Consumables Used</span>
                  <button type="button" onClick={handleAddProductRow} className="text-xs text-[#ff5722] hover:underline">+ Add Product</button>
                </div>
                {products.map((p, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Product Name (e.g. Motul 7100 Oil)"
                      value={p.name}
                      onChange={e => {
                        const arr = [...products];
                        arr[idx].name = e.target.value;
                        setProducts(arr);
                      }}
                      className="flex-1 px-3 py-1.5 rounded bg-[#241410] text-xs text-[#fadcd4] border border-[#5b4039]"
                    />
                    <input
                      type="number"
                      placeholder="Cost (₹)"
                      value={p.cost}
                      onChange={e => {
                        const arr = [...products];
                        arr[idx].cost = e.target.value;
                        setProducts(arr);
                      }}
                      className="w-28 px-3 py-1.5 rounded bg-[#241410] text-xs text-[#fadcd4] border border-[#5b4039]"
                    />
                  </div>
                ))}
              </div>

              {/* Parts Replaced */}
              <div className="bg-[#180b07] p-4 rounded-xl border border-[#372621]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono font-bold text-[#86cfff] uppercase">Hard Parts Replaced</span>
                  <button type="button" onClick={handleAddPartRow} className="text-xs text-[#86cfff] hover:underline">+ Add Part</button>
                </div>
                {parts.map((pt, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Part Name (e.g. Brake Pads)"
                      value={pt.name}
                      onChange={e => {
                        const arr = [...parts];
                        arr[idx].name = e.target.value;
                        setParts(arr);
                      }}
                      className="flex-1 px-3 py-1.5 rounded bg-[#241410] text-xs text-[#fadcd4] border border-[#5b4039]"
                    />
                    <input
                      type="text"
                      placeholder="Part No."
                      value={pt.partNo}
                      onChange={e => {
                        const arr = [...parts];
                        arr[idx].partNo = e.target.value;
                        setParts(arr);
                      }}
                      className="w-28 px-3 py-1.5 rounded bg-[#241410] text-xs text-[#fadcd4] border border-[#5b4039]"
                    />
                    <input
                      type="number"
                      placeholder="Cost (₹)"
                      value={pt.cost}
                      onChange={e => {
                        const arr = [...parts];
                        arr[idx].cost = e.target.value;
                        setParts(arr);
                      }}
                      className="w-24 px-3 py-1.5 rounded bg-[#241410] text-xs text-[#fadcd4] border border-[#5b4039]"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="px-4 py-2 rounded bg-[#372621] text-[#ab8980] text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#ff5722] text-white text-sm font-bold shadow-lg"
                >
                  Save Service Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FUEL FILL MODAL */}
      {showFuelModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="brushed-aluminum max-w-md w-full p-6 rounded-2xl border border-[#5b4039]">
            <h3 className="text-lg font-bold text-[#fadcd4] mb-4 font-mono">Log Fuel Pump Fill</h3>
            <form onSubmit={handleFuelSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Date</label>
                <input
                  type="date"
                  value={fuelDate}
                  onChange={e => setFuelDate(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Current Odometer (km)</label>
                <input
                  type="number"
                  value={fuelOdo}
                  onChange={e => setFuelOdo(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Liters Filled</label>
                  <input
                    type="number"
                    step="0.01"
                    value={liters}
                    onChange={e => setLiters(e.target.value)}
                    placeholder="14.5"
                    className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Total Cost (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={totalCost}
                    onChange={e => setTotalCost(e.target.value)}
                    placeholder="1515"
                    className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#ab8980] mb-1 font-mono uppercase">Petrol Pump Station</label>
                <input
                  type="text"
                  value={station}
                  onChange={e => setStation(e.target.value)}
                  placeholder="Indian Oil, Manali"
                  className="w-full px-3 py-2 rounded bg-[#180b07] text-[#fadcd4] text-sm border border-[#5b4039]"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="fullTank"
                  checked={fullTank}
                  onChange={e => setFullTank(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#180b07] border-[#5v4039] text-[#ff5722]"
                />
                <label htmlFor="fullTank" className="text-xs text-[#fadcd4] font-mono">Full Tank Fill-up (for accurate mileage calculation)</label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFuelModal(false)}
                  className="px-4 py-2 rounded bg-[#372621] text-[#ab8980] text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#e9c349] text-[#241a00] text-sm font-bold shadow-lg"
                >
                  Save Fuel Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
