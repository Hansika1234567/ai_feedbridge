/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Utensils, 
  Activity, 
  Plus, 
  AlertTriangle, 
  HeartHandshake, 
  MapPin, 
  Clock, 
  Compass, 
  QrCode,
  CheckCircle,
  Truck
} from "lucide-react";
import { Delivery, Donation, NGO } from "../types";

interface BeneficiaryPortalProps {
  deliveries: Delivery[];
  donations: Donation[];
  onAddNgoDemand: (demand: any) => void;
}

export default function BeneficiaryPortal({ deliveries, donations, onAddNgoDemand }: BeneficiaryPortalProps) {
  // Local states for demand requests
  const [shelterName, setShelterName] = useState("");
  const [address, setAddress] = useState("");
  const [quantRequested, setQuantRequested] = useState("");
  const [urgency, setUrgency] = useState<NGO["urgencyLevel"]>("Medium");
  
  const [showRequestForm, setShowRequestForm] = useState(false);

  const handleClaimRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shelterName || !address || !quantRequested) return;

    onAddNgoDemand({
      name: shelterName,
      location: address,
      quantityRequested: Number(quantRequested),
      urgencyLevel: urgency,
      requestedFoodTypes: urgency === "Critical" ? ["Perishable - Cooked Meat & Grain", "Emergency Intake"] : ["General Caloric intake"]
    });

    setShelterName("");
    setAddress("");
    setQuantRequested("");
    setUrgency("Medium");
    setShowRequestForm(false);
    alert(`Success: Your ${urgency === "Critical" ? "👑 EMERGENCY " : ""}calorie intake voucher has been registered on the coordinator matrix!`);
  };

  const handleTriggerEmergencyMock = () => {
    setShelterName("St. Vincent's Emergency Winter Shelter");
    setAddress("505 Homeless Shelter Street");
    setQuantRequested("45");
    setUrgency("Critical");
    setShowRequestForm(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Beneficiary Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-lg border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <span className="text-[10px] bg-slate-850 px-2 py-0.5 rounded text-amber-500 font-extrabold tracking-widest font-mono uppercase">BENEFICIARY DESK MODE</span>
          </div>
          <h3 className="font-display font-bold text-white text-lg tracking-tight mt-1.5">Recipient Shelter Intake Console</h3>
          <p className="text-xs text-slate-400">Pledge emergency food requests, check real-time transit handovers, and hold safe handover QR verification</p>
        </div>

        {/* Quick Emergency button */}
        <button
          onClick={handleTriggerEmergencyMock}
          className="bg-amber-600 hover:bg-amber-700 text-slate-900 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md flex-shrink-0"
        >
          <AlertTriangle className="w-4 h-4 text-slate-950 animate-bounce" /> Trigger Emergency Food Request
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Request Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-subtle">
            <div className="flex justify-between items-center pb-2 border-b">
              <h4 className="font-display font-medium text-slate-955 text-slate-900 text-sm">Submit New Intake Demand Voucher</h4>
              {!showRequestForm && (
                <button
                  onClick={() => setShowRequestForm(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-850 p-2 rounded-xl text-xs font-bold transition-all cursor-pointer border"
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" /> New Request Form
                </button>
              )}
            </div>

            {showRequestForm && (
              <form onSubmit={handleClaimRequest} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 block uppercase tracking-wider">Shelter Name/Organization *</label>
                    <input
                      type="text"
                      value={shelterName}
                      onChange={(e) => setShelterName(e.target.value)}
                      placeholder="St. Jude Soup Kitchen"
                      className="block w-full px-3 py-2.5 bg-slate-50 border rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 block uppercase tracking-wider">Required Payload (kg) *</label>
                    <input
                      type="number"
                      value={quantRequested}
                      onChange={(e) => setQuantRequested(e.target.value)}
                      placeholder="25"
                      className="block w-full px-3 py-2.5 bg-slate-50 border rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 block uppercase tracking-wider">Urgency coefficient</label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value as any)}
                      className="block w-full px-3 py-2.5 bg-slate-50 border rounded-xl"
                    >
                      <option value="Low">Low Intake (Weekly backup)</option>
                      <option value="Medium">Medium Intake (Standard cycle)</option>
                      <option value="High">High Intake (Short of stock)</option>
                      <option value="Critical">👑 Critical Intake (Emergency Dispatch)</option>
                    </select>
                  </div>

                  <div className="space-y-1 col-span-2">
                    <label className="text-[10px] font-bold text-slate-700 block uppercase tracking-wider">Street delivery address *</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Room 400 Building 12, West End Street"
                      className="block w-full px-3 py-2.5 bg-slate-50 border rounded-xl"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer flex justify-center items-center gap-1.5"
                >
                  <Utensils className="w-4 h-4 text-emerald-450 text-emerald-400" />
                  Pledge Caloric Intakes Request Voucher
                </button>
              </form>
            )}

            {!showRequestForm && (
              <div className="border border-slate-100 bg-slate-50 rounded-2xl p-6 text-center text-slate-400 space-y-2 py-10">
                <HeartHandshake className="w-8 h-8 text-emerald-500 mx-auto animate-pulse" />
                <h5 className="font-bold text-slate-700">Need immediate calorie balancing?</h5>
                <p className="text-xs">Submit standard or Critical emergency forms to let our coordinating matchmakers resolve surplus food lines.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live handovers and QR verifications */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-subtle">
            <h4 className="font-display font-medium text-slate-950 text-sm">Secure Handover Handshaking Verification</h4>
            <p className="text-xs text-slate-400">To secure cold chain validation, display this encrypted QR handover matrix to your volunteer pilot on arrival:</p>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center text-white space-y-4 flex flex-col items-center">
              
              <div className="bg-white p-3 rounded-2xl w-fit mx-auto shadow-inner">
                <QrCode className="w-32 h-32 text-slate-905 text-slate-950" />
              </div>

              <div className="space-y-1 text-center font-mono text-[9px] text-slate-450 text-slate-400">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-widest font-sans">TOKEN: QR-FB-INTAKE-SECURED</span>
                <div>LATLONG_BOUND_VERIFIED // SECURE_SHA256</div>
                <div>Rotates automatically every 180 seconds</div>
              </div>

            </div>
          </div>

          {/* Active incoming map and track status */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-subtle">
            <h4 className="font-display font-medium text-slate-955 text-slate-950 text-sm">Incoming Shipments Trackers</h4>
            
            <div className="space-y-3.5 text-xs">
              {deliveries.filter(d => d.status !== "Delivered").length > 0 ? (
                deliveries.filter(d => d.status !== "Delivered").map((del) => (
                  <div key={del.id} className="bg-slate-50 border rounded-2xl p-4 space-y-3 relative overflow-hidden">
                    <span className="absolute top-2 right-4 bg-emerald-50 border border-emerald-250 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                      In Transit Status
                    </span>
                    
                    <h5 className="font-bold text-slate-900 text-xs pr-20 pt-1 flex items-center gap-1">
                      <Truck className="w-4 h-4 text-emerald-600 animate-bounce" /> {del.volunteerName} ({del.vehicleType})
                    </h5>

                    <p className="text-[11px] text-slate-400 italic">"Delivering surplus food reserves optimized for safe refrigeration limits."</p>
                    
                    {/* Visual Progress bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-mono text-[9px] text-slate-500 uppercase font-black">
                        <span>Transit progress index:</span>
                        <span>{del.status === "Assigned" ? "Dispached" : "En-route"}</span>
                      </div>
                      <div className="w-full bg-slate-205 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full animate-pulse" style={{ width: del.status === "Assigned" ? "30%" : "75%" }} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-400 py-3 italic">No incoming pilot transits are currently active. Claim/Request items to initiate dispatch telemetry.</div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
