import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { DashboardTab } from './components/DashboardTab';
import { GarageTab } from './components/GarageTab';
import { WorkshopTab } from './components/WorkshopTab';
import { TouringTab } from './components/TouringTab';
import { EmergencyTab } from './components/EmergencyTab';
import { SaddlebagTab } from './components/SaddlebagTab';
import { MotoBotChat } from './components/MotoBotChat';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <AppProvider>
      <div className="min-h-screen leather-texture text-[#fadcd4] flex flex-col selection:bg-[#ff5722] selection:text-white">
        
        {/* Navigation & Odometer HUD */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenChat={() => setIsChatOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
          {activeTab === 'dashboard' && (
            <DashboardTab
              setActiveTab={setActiveTab}
              onOpenChat={() => setIsChatOpen(true)}
            />
          )}
          {activeTab === 'garage' && <GarageTab />}
          {activeTab === 'workshop' && <WorkshopTab />}
          {activeTab === 'touring' && <TouringTab />}
          {activeTab === 'emergency' && <EmergencyTab />}
          {activeTab === 'saddlebag' && <SaddlebagTab />}
        </main>

        {/* Footer */}
        <footer className="brushed-aluminum border-t border-[#372621] py-4 px-4 text-center text-xs text-[#ab8980] font-mono">
          MotoVault Skeuomorphic Motorcycle Management & Touring Co-Pilot • Built for Riders
        </footer>

        {/* Slide-over MotoBot AI Chat Drawer */}
        <MotoBotChat
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />

      </div>
    </AppProvider>
  );
}
