import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { GoogleGenAI } from '@google/genai';
import { Bot, X, Send, Sparkles, Wrench, Shield, Compass, Fuel, Radio } from 'lucide-react';
import { ChatMessage } from '../types';

interface MotoBotChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MotoBotChat: React.FC<MotoBotChatProps> = ({ isOpen, onClose }) => {
  const { state } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'motobot',
      text: `Greetings Rider! I am MotoBot, your AI Mechanic & Touring Co-Pilot for your ${state.bike.make} ${state.bike.model}. I have full visibility of your live odometer (${state.bike.odoCurrent.toLocaleString()} km), maintenance ledger, tool kit compartments, and active trip. How can I assist you on the road today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickPrompts = [
    "Check what's due for service",
    "Tools needed for chain slack?",
    "Summarize my active trip",
    "Emergency numbers for Ladakh",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const promptText = textToSend || input;
    if (!promptText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
      const ai = new GoogleGenAI({ apiKey });

      // Serialize app state for system instructions
      const stateSummary = JSON.stringify({
        bike: state.bike,
        serviceLogsSummary: state.serviceLogs.map(s => ({ date: s.date, odo: s.odo, workshop: s.workshop, cost: s.totalCost, parts: s.partsReplaced.map(p => p.name) })),
        fuelStats: { totalLogs: state.fuelLogs.length, lastFuel: state.fuelLogs[0] },
        activeTrip: state.trips.find(t => t.id === state.activeTripId),
        rsaProviders: state.emergency.rsaProviders,
        stateEmergencyDirectory: state.emergency.stateDirectory,
        toolkit: state.toolkit.map(t => ({ name: t.name, location: t.location, carried: t.carried })),
        luggagePackedCount: state.luggage.filter(l => l.packed).length,
      });

      const systemInstruction = `You are MotoBot, an expert motorcycle mechanic, touring guide, and roadside co-pilot. 
You are assisting a rider on a ${state.bike.make} ${state.bike.model} (${state.bike.year}), currently at odometer ${state.bike.odoCurrent} km.
Here is the complete live JSON state of the rider's MotoVault application:
${stateSummary}

Guidelines:
- Answer with expert technical precision regarding motorcycle troubleshooting, torques, oil grades, chain slack, suspension tuning, and high-altitude touring preparation.
- When the rider asks about tools for a repair, check their exact toolkit inventory and tell them the exact compartment / storage location where the tool is stored (e.g. Under-seat cavity, Left Pannier, Tank bag pouch).
- When asked about emergency assistance or helplines, pull up their active RSA policy or the relevant state emergency directory from the state data.
- Maintain a rugged, experienced, supportive motorcycle brotherhood tone.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nRider Query: ${promptText}` }] }
        ],
      });

      const replyText = response.text || "I'm receiving static on the intercom. Could you repeat that query?";

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'motobot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Gemini API Error:', error);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'motobot',
        text: "Intercom connection error. Please ensure your Gemini API key is configured correctly in environment variables or AI Studio secrets.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[480px] brushed-aluminum border-l border-[#5b4039] z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="p-4 bg-[#180b07] border-b border-[#372621] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#ff5722] text-white flex items-center justify-center font-bold shadow-md">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#fadcd4] font-mono flex items-center gap-2">
              <span>MotoBot AI Co-Pilot</span>
              <span className="w-2 h-2 rounded-full bg-[#00E676] animate-ping"></span>
            </h3>
            <p className="text-xs text-[#ab8980]">Live State Connected • Gemini 2.5 Flash</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-[#372621] text-[#ab8980] hover:text-[#fadcd4]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Prompt Chips */}
      <div className="p-3 bg-[#241410] border-b border-[#372621] flex gap-2 overflow-x-auto">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qp)}
            className="px-3 py-1 rounded-full bg-[#372621] text-[#ffb5a0] text-xs font-mono whitespace-nowrap hover:bg-[#483530] border border-[#5b4039] shadow-sm"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 text-[10px] text-[#ab8980] font-mono">
              <span>{msg.sender === 'user' ? 'Rider' : 'MotoBot Co-Pilot'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>
            <div
              className={`max-w-[85%] p-3.5 rounded-xl text-sm font-mono leading-relaxed shadow-md ${
                msg.sender === 'user'
                  ? 'bg-[#ff5722] text-white rounded-tr-none'
                  : 'bg-[#271813] text-[#fadcd4] border border-[#5b4039] rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#ab8980] font-mono animate-pulse p-2">
            <Sparkles className="w-4 h-4 text-[#ff5722]" />
            <span>MotoBot is diagnosing live telemetry & manual specs...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 bg-[#180b07] border-t border-[#372621]">
        <form onSubmit={e => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask mechanic, toolkit storage, or trip safety..."
            className="flex-1 px-4 py-2.5 rounded-lg bg-[#241410] text-[#fadcd4] text-sm font-mono border border-[#5b4039] focus:outline-none focus:border-[#ff5722]"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="tactile-btn px-4 py-2.5 rounded-lg bg-[#ff5722] text-white font-bold flex items-center justify-center shadow-lg disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
