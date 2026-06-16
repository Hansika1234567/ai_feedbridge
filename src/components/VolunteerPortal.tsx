/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Navigation, 
  Route, 
  Award, 
  Truck, 
  Sparkles, 
  MapPin, 
  RotateCw, 
  CheckSquare, 
  TrendingUp,
  Map,
  ChevronRight,
  Clock
} from "lucide-react";
import { Delivery, Donation, NGO } from "../types";

interface VolunteerPortalProps {
  deliveries: Delivery[];
  donations: Donation[];
  ngos: NGO[];
  onUpdateDeliveryStatus: (id: string, nextStatus: Delivery["status"]) => void;
  onRefreshAllData: () => void;
}

export default function VolunteerPortal({ deliveries, donations, ngos, onUpdateDeliveryStatus, onRefreshAllData }: VolunteerPortalProps) {
  // Local score states
  const [level, setLevel] = useState(3);
  const [points, setPoints] = useState(820);
  const [completedRunsCount, setCompletedRunsCount] = useState(24);
  const [streakDays, setStreakDays] = useState(6);
  
  // Selected Delivery to view details/map
  const [selectedDelIndex, setSelectedDelIndex] = useState<number>(0);

  const activeDel = deliveries[selectedDelIndex] || deliveries[0];
  const associatedDonation = donations.find(d => d.id === activeDel?.donationId);
  const associatedNgo = ngos.find(n => n.id === activeDel?.ngoId);

  const simulateStatusProgress = (delId: string, currentStatus: Delivery["status"]) => {
    let next: Delivery["status"] = "Assigned";
    if (currentStatus === "Assigned") next = "Picked Up";
    else if (currentStatus === "Picked Up") next = "In Transit";
    else if (currentStatus === "In Transit") next = "Delivered";

    onUpdateDeliveryStatus(delId, next);

    if (next === "Delivered") {
      setPoints(p => p + 120);
      setCompletedRunsCount(c => c + 1);
      setStreakDays(s => s + 1);
      alert("Congratulations! Calorie cargo safely cleared. You earned 120 Reward Points and offset landfill carbon!");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Visual Pilot Header banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-lg border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] bg-slate-850 px-2 py-0.5 rounded text-emerald-400 font-extrabold tracking-widest font-mono uppercase">Logistics Field Pilot Terminal</span>
          </div>
          <h3 className="font-display font-bold text-white text-lg tracking-tight mt-1.5">Volunteer Dispatches Control Seat</h3>
          <p className="text-xs text-slate-400">Accept assigned hot surplus logistics pick-ups, optimize city street routes, and claim nutritional points</p>
        </div>

        {/* Gamified HUD */}
        <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-850 select-none">
          <div className="text-center">
            <span className="block text-[9px] text-slate-500 uppercase font-black">PILOT CLASS</span>
            <span className="text-emerald-450 text-emerald-400 font-bold font-mono text-sm">LEVEL {level}</span>
          </div>
          <div className="text-center border-l border-slate-850 pl-4 pr-4">
            <span className="block text-[9px] text-slate-500 uppercase font-black">POINTS HUD</span>
            <span className="text-teal-400 text-base font-extrabold font-mono">{points} XP</span>
          </div>
          <div className="text-center border-l border-slate-850 pl-4 hidden md:block">
            <span className="block text-[9px] text-slate-500 uppercase font-black">SAVED STREAK</span>
            <span className="text-amber-500 text-base font-extrabold font-mono flex items-center gap-0.5 justify-center">
              🔥 {streakDays}-day
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Assigned deliveries */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-subtle">
            <div className="flex justify-between items-center pb-2 border-b">
              <h4 className="font-display font-medium text-slate-950 text-sm">Assigned Delivery Shipments</h4>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                {deliveries.length} ROUTED LOGS
              </span>
            </div>

            <div className="space-y-3">
              {deliveries.length > 0 ? (
                deliveries.map((del, index) => {
                  const don = donations.find(d => d.id === del.donationId);
                  const shelter = ngos.find(n => n.id === del.ngoId);
                  const isSelected = selectedDelIndex === index;
                  return (
                    <div 
                      key={del.id}
                      onClick={() => setSelectedDelIndex(index)}
                      className={`border p-4 rounded-2xl cursor-pointer transition-all space-y-3 flex flex-col justify-between hover:border-emerald-400 ${
                        isSelected 
                          ? "ring-1 ring-emerald-500 border-emerald-500 bg-slate-50" 
                          : "bg-white"
                      }`}
                    >
                      <div>
                        <div className="flex justify-between text-[10px] items-center">
                          <span className="bg-slate-200 text-slate-600 font-mono px-1.5 py-0.5 rounded-sm">ID: {del.id}</span>
                          <span className={`px-2 py-0.5 rounded-full border font-bold uppercase select-none text-[9px] ${
                            del.status === "Delivered" 
                              ? "bg-slate-100 text-slate-400 border-slate-200" 
                              : "bg-blue-50 text-blue-700 border-blue-200 animate-pulse"
                          }`}>
                            {del.status}
                          </span>
                        </div>

                        <h5 className="font-bold text-slate-900 text-xs mt-2.5 leading-tight">
                          {don?.donorName} ──▶ {shelter?.name}
                        </h5>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">Cargo: {don?.foodType || "Edible Caloric Package"}</p>
                      </div>

                      {del.status !== "Delivered" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            simulateStatusProgress(del.id, del.status);
                          }}
                          className="w-full bg-slate-900 hover:bg-slate-950 text-white text-xs font-semibold py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 select-none"
                        >
                          <Clock className="w-3.5 h-3.5 text-emerald-400" />
                          Advance state index (➔ {
                            del.status === "Assigned" ? "Picked Up" : del.status === "Picked Up" ? "In Transit" : "Delivered/Arrived"
                          })
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center p-8 text-slate-400 text-xs space-y-2 border-2 border-dashed rounded-xl">
                  <Truck className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>You have no current dispatch routes assigned. Coordinate with shelter managers to pull fresh claims!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Mini Pilot Maps HUD & step routing */}
        <div className="lg:col-span-6 space-y-6">
          {activeDel ? (
            <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-xl border border-slate-850 space-y-5">
              <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono font-bold tracking-widest px-2.5 py-1 rounded-sm uppercase">ACTIVE FIELD NAVIGATION HUD</span>
                <span className="text-xs text-slate-500 font-mono">ETA: {activeDel.etaMinutes} mins</span>
              </div>

              {/* Graphical Simulation of Routing map */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl h-44 p-4 flex flex-col justify-between relative overflow-hidden select-none">
                <div className="absolute inset-0 opacity-10 font-mono text-[9px] pointer-events-none leading-none select-none">
                  GPS_TRANS_INDEX: Lat 14.882 Long 4.1923 GRID_SECT_A
                  ROUTE_STATE_ONLINE TRANSIT_SECURED COLD_SHELF_STABLE
                </div>

                <span className="text-[9px] text-slate-450 uppercase font-black text-slate-400 flex items-center gap-1">
                  <Map className="w-4 h-4 text-emerald-400 animate-pulse" /> Live Street Pilot Coordinates
                </span>

                <div className="flex justify-center items-center h-20">
                  <div className="relative w-full max-w-[260px] h-1.5 bg-slate-950 rounded-full flex items-center justify-between">
                    <div className="bg-emerald-500 w-3 h-3 rounded-full border border-white flex justify-center items-center text-[8px] font-bold">A</div>
                    
                    {/* Animated moving vehicle indicator */}
                    <div className="flex-1 relative mx-2">
                      <div className="absolute -top-3 left-[40%] text-emerald-400 transition-all z-10 animate-pulse">
                        <Truck className="w-6 h-6 rotate-12" />
                      </div>
                      <div className="w-full border-t border-dashed border-slate-700 h-0" />
                    </div>

                    <div className="bg-teal-500 w-3 h-3 rounded-full border border-white flex justify-center items-center text-[8px] font-bold">B</div>
                  </div>
                </div>

                <div className="flex justify-between text-[9px] font-semibold text-slate-400">
                  <span className="truncate max-w-[120px]">Pickup: {associatedDonation?.donorName || "Donor Hub"}</span>
                  <span className="truncate max-w-[120px]">Shelter: {associatedNgo?.name || "Hope Shelter"}</span>
                </div>
              </div>

              {/* Step checklist */}
              <div className="space-y-3 font-mono">
                <span className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider block">ROUTE ENGINE CHECKPOINTS CHECKLIST</span>
                
                <div className="bg-slate-900 rounded-2xl p-4 border border-slate-850 text-xs text-slate-350 space-y-3 text-slate-300">
                  {activeDel.routePlan.map((step, idx) => (
                    <div key={idx} className="flex gap-2.5 items-center">
                      <div className="rounded bg-slate-950 w-5 h-5 flex justify-center items-center text-[10px] font-extrabold text-emerald-400 font-mono">
                        {idx + 1}
                      </div>
                      <span className="leading-tight text-slate-100">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center py-12 text-slate-400 space-y-4 shadow-subtle">
              <Navigation className="w-10 h-10 text-slate-350 mx-auto" />
              <div>
                <h4 className="font-semibold text-slate-900">No Dispatched Route Loaded</h4>
                <p className="text-xs">Select an assigned shipment courier block on the left and our street routing index calculator will overlay directions here.</p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
