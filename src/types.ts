export interface BikeProfile {
  make: string;
  model: string;
  year: number;
  regNumber: string;
  vin: string;
  engineNo: string;
  odoCurrent: number;
  specs: {
    oilGrade: string;
    frontPsi: number;
    rearPsi: number;
    chainSlack: string;
    coolantType: string;
  };
  insurance: {
    provider: string;
    policyNo: string;
    expiryDate: string;
    idv: string;
    coverage: string;
    helpline: string;
  };
  notes: Array<{
    id: string;
    title: string;
    content: string;
    date: string;
  }>;
}

export interface ServiceLineItem {
  id: string;
  name: string;
  cost: number;
  partNo?: string;
}

export interface ServiceRecord {
  id: string;
  date: string;
  odo: number;
  workshop: string;
  mechanicName?: string;
  notes: string;
  productsUsed: ServiceLineItem[];
  partsReplaced: ServiceLineItem[];
  totalCost: number;
}

export interface FuelRecord {
  id: string;
  date: string;
  odo: number;
  liters: number;
  totalCost: number;
  station: string;
  fullTank: boolean;
  pricePerLiter: number;
}

export interface ItineraryDay {
  day: number;
  route: string;
  distanceKm: number;
  stayDetails: string;
  notes: string;
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'planned' | 'completed';
  currentDayLeg: number;
  totalDistancePlanned: number;
  itinerary: ItineraryDay[];
}

export interface RSAProvider {
  id: string;
  providerName: string;
  planId: string;
  tollFreeNumber: string;
  coverageNotes: string;
  validTill: string;
}

export interface StateEmergencyContact {
  id: string;
  stateName: string;
  policeNumber: string;
  highwayPatrolNumber: string;
  ambulanceNumber: string;
  towingContact: string;
  localServiceNotes: string;
}

export interface EmergencyProfile {
  bloodGroup: string;
  medicalConditions: string;
  primaryContact: {
    name: string;
    relation: string;
    phone: string;
  };
  secondaryContact: {
    name: string;
    relation: string;
    phone: string;
  };
  rsaProviders: RSAProvider[];
  stateDirectory: StateEmergencyContact[];
}

export interface ToolItem {
  id: string;
  name: string;
  category: 'Spanners' | 'Punctures' | 'Electrical' | 'General' | 'Emergency';
  location: string; // e.g., 'Under-seat cavity', 'Left Pannier', 'Tank bag pouch'
  carried: boolean;
  notes?: string;
}

export interface LuggageItem {
  id: string;
  item: string;
  category: 'Riding Gear' | 'Electronics' | 'Clothing' | 'Documents' | 'Camping / First Aid';
  bagLocation: string; // e.g., 'Right Pannier', 'Tail Bag', 'Tank Bag'
  packed: boolean;
  weightKg?: number;
}

export interface AppState {
  bike: BikeProfile;
  serviceLogs: ServiceRecord[];
  fuelLogs: FuelRecord[];
  trips: Trip[];
  activeTripId: string;
  emergency: EmergencyProfile;
  toolkit: ToolItem[];
  luggage: LuggageItem[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'motobot';
  text: string;
  timestamp: string;
}
