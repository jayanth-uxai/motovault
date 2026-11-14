import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, ServiceRecord, FuelRecord, Trip, RSAProvider, ToolItem, LuggageItem } from '../types';
import { initialAppState } from '../data/initialData';

interface AppContextType {
  state: AppState;
  updateOdometer: (newOdo: number) => void;
  addServiceRecord: (record: Omit<ServiceRecord, 'id'>) => void;
  deleteServiceRecord: (id: string) => void;
  addFuelRecord: (record: Omit<FuelRecord, 'id'>) => void;
  deleteFuelRecord: (id: string) => void;
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  updateTrip: (trip: Trip) => void;
  deleteTrip: (id: string) => void;
  setActiveTrip: (id: string) => void;
  addRSAProvider: (rsa: Omit<RSAProvider, 'id'>) => void;
  deleteRSAProvider: (id: string) => void;
  addToolItem: (tool: Omit<ToolItem, 'id'>) => void;
  toggleToolCarried: (id: string) => void;
  deleteToolItem: (id: string) => void;
  toggleLuggagePacked: (id: string) => void;
  addLuggageItem: (item: Omit<LuggageItem, 'id'>) => void;
  deleteLuggageItem: (id: string) => void;
  addNote: (title: string, content: string) => void;
  deleteNote: (id: string) => void;
  exportBackup: () => void;
  importBackup: (jsonData: string) => boolean;
  resetToDefaults: () => void;
}

const STORAGE_KEY = 'motovault_state_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
    return initialAppState;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [state]);

  const updateOdometer = (newOdo: number) => {
    setState(prev => ({
      ...prev,
      bike: { ...prev.bike, odoCurrent: newOdo }
    }));
  };

  const addServiceRecord = (record: Omit<ServiceRecord, 'id'>) => {
    const newRecord: ServiceRecord = {
      ...record,
      id: `srv-${Date.now()}`
    };
    setState(prev => ({
      ...prev,
      serviceLogs: [newRecord, ...prev.serviceLogs]
    }));
  };

  const deleteServiceRecord = (id: string) => {
    setState(prev => ({
      ...prev,
      serviceLogs: prev.serviceLogs.filter(s => s.id !== id)
    }));
  };

  const addFuelRecord = (record: Omit<FuelRecord, 'id'>) => {
    const newRecord: FuelRecord = {
      ...record,
      id: `fuel-${Date.now()}`
    };
    setState(prev => ({
      ...prev,
      fuelLogs: [newRecord, ...prev.fuelLogs]
    }));
  };

  const deleteFuelRecord = (id: string) => {
    setState(prev => ({
      ...prev,
      fuelLogs: prev.fuelLogs.filter(f => f.id !== id)
    }));
  };

  const addTrip = (trip: Omit<Trip, 'id'>) => {
    const newTrip: Trip = {
      ...trip,
      id: `trip-${Date.now()}`
    };
    setState(prev => ({
      ...prev,
      trips: [newTrip, ...prev.trips],
      activeTripId: newTrip.status === 'active' ? newTrip.id : prev.activeTripId
    }));
  };

  const updateTrip = (updatedTrip: Trip) => {
    setState(prev => ({
      ...prev,
      trips: prev.trips.map(t => t.id === updatedTrip.id ? updatedTrip : t)
    }));
  };

  const deleteTrip = (id: string) => {
    setState(prev => ({
      ...prev,
      trips: prev.trips.filter(t => t.id !== id),
      activeTripId: prev.activeTripId === id ? (prev.trips.find(t => t.id !== id)?.id || '') : prev.activeTripId
    }));
  };

  const setActiveTrip = (id: string) => {
    setState(prev => ({
      ...prev,
      activeTripId: id,
      trips: prev.trips.map(t => ({
        ...t,
        status: t.id === id ? 'active' : (t.status === 'active' ? 'completed' : t.status)
      }))
    }));
  };

  const addRSAProvider = (rsa: Omit<RSAProvider, 'id'>) => {
    const newRSA: RSAProvider = {
      ...rsa,
      id: `rsa-${Date.now()}`
    };
    setState(prev => ({
      ...prev,
      emergency: {
        ...prev.emergency,
        rsaProviders: [...prev.emergency.rsaProviders, newRSA]
      }
    }));
  };

  const deleteRSAProvider = (id: string) => {
    setState(prev => ({
      ...prev,
      emergency: {
        ...prev.emergency,
        rsaProviders: prev.emergency.rsaProviders.filter(r => r.id !== id)
      }
    }));
  };

  const addToolItem = (tool: Omit<ToolItem, 'id'>) => {
    const newTool: ToolItem = {
      ...tool,
      id: `tool-${Date.now()}`
    };
    setState(prev => ({
      ...prev,
      toolkit: [...prev.toolkit, newTool]
    }));
  };

  const toggleToolCarried = (id: string) => {
    setState(prev => ({
      ...prev,
      toolkit: prev.toolkit.map(t => t.id === id ? { ...t, carried: !t.carried } : t)
    }));
  };

  const deleteToolItem = (id: string) => {
    setState(prev => ({
      ...prev,
      toolkit: prev.toolkit.filter(t => t.id !== id)
    }));
  };

  const toggleLuggagePacked = (id: string) => {
    setState(prev => ({
      ...prev,
      luggage: prev.luggage.map(l => l.id === id ? { ...l, packed: !l.packed } : l)
    }));
  };

  const addLuggageItem = (item: Omit<LuggageItem, 'id'>) => {
    const newItem: LuggageItem = {
      ...item,
      id: `lug-${Date.now()}`
    };
    setState(prev => ({
      ...prev,
      luggage: [...prev.luggage, newItem]
    }));
  };

  const deleteLuggageItem = (id: string) => {
    setState(prev => ({
      ...prev,
      luggage: prev.luggage.filter(l => l.id !== id)
    }));
  };

  const addNote = (title: string, content: string) => {
    const newNote = {
      id: `note-${Date.now()}`,
      title,
      content,
      date: new Date().toISOString().split('T')[0]
    };
    setState(prev => ({
      ...prev,
      bike: {
        ...prev.bike,
        notes: [newNote, ...prev.bike.notes]
      }
    }));
  };

  const deleteNote = (id: string) => {
    setState(prev => ({
      ...prev,
      bike: {
        ...prev.bike,
        notes: prev.bike.notes.filter(n => n.id !== id)
      }
    }));
  };

  const exportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `motovault_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importBackup = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed && parsed.bike && parsed.serviceLogs && parsed.toolkit) {
        setState(parsed);
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON backup', e);
    }
    return false;
  };

  const resetToDefaults = () => {
    setState(initialAppState);
  };

  return (
    <AppContext.Provider value={{
      state,
      updateOdometer,
      addServiceRecord,
      deleteServiceRecord,
      addFuelRecord,
      deleteFuelRecord,
      addTrip,
      updateTrip,
      deleteTrip,
      setActiveTrip,
      addRSAProvider,
      deleteRSAProvider,
      addToolItem,
      toggleToolCarried,
      deleteToolItem,
      toggleLuggagePacked,
      addLuggageItem,
      deleteLuggageItem,
      addNote,
      deleteNote,
      exportBackup,
      importBackup,
      resetToDefaults
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
