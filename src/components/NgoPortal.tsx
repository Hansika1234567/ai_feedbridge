/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  HeartHandshake, 
  Plus, 
  Users, 
  Boxes, 
  Calendar, 
  Sparkles, 
  Clock, 
  ThermometerSnowflake, 
  ListCollapse, 
  ArrowUpRight, 
  Utensils, 
  UserPlus,
  MapPin
} from "lucide-react";
import { Donation, NGO, Delivery, CampaignDrive, FoodInventoryItem } from "../types";

interface NgoPortalProps {
  donations: Donation[];
  ngos: NGO[];
  deliveries: Delivery[];
  onRefreshAll: () => void;
}

export default function NgoPortal({ donations, ngos, deliveries, onRefreshAll }: NgoPortalProps) {
  // Mock inventory list
  const [inventory, setInventory] = useState<FoodInventoryItem[]>([
    { id: "inv-1", name: "High Grade Basmati Grains", quantity: 60, category: "Grains/Starch", storedTempCelsius: 18, isInspected: true, notes: "Shelf dry food safe" },
    { id: "inv-2", name: "Hilton Cooked Pastries & Focaccia", quantity: 15, category: "Bakery", storedTempCelsius: 16, isInspected: true, notes: "Needs distribution within 24h" },
    { id: "inv-3", name: "Dairy Organic Liquid Yogurt Packs", quantity: 24, category: "Dairy", storedTempCelsius: 3, isInspected: true, notes: "Stored in Refrigerator Node 1" }
  ]);

  // Mock campaigns
  const [campaigns, setCampaigns] = useState<CampaignDrive[]>([
    { id: "camp-1", title: "Sunday Caloric Warm Meal Drive", targetKg: 200, currentKg: 85, date: "2026-06-21", location: "Ameerpet Metro Station Shelter, Hyderabad, Telangana", status: "Active", registeredVolunteers: 4 },
    { id: "camp-2", title: "Organic Fruit & Salad Gathering", targetKg: 100, currentKg: 45, date: "2026-06-30", location: "Kukatpally Community Kitchen, Hyderabad", status: "Draft", registeredVolunteers: 1 }
  ]);

  // Claims tracker state
  const [claimsLog, setClaimsLog] = useState<any[]>([]);

  // Form states for creating campaign
  const [showCampForm, setShowCampForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newLoc, setNewLoc] = useState("");
  const [newDate, setNewDate] = useState("");

  const [activeNgoTab, setActiveNgoTab] = useState<"inventory" | "campaigns" | "claims" | "recom">("claims");

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newTarget || !newLoc || !newDate) return;
    
    setCampaigns(prev => [
      ...prev,
      {
        id: `camp-${Date.now()}`,
        title: newTitle,
        targetKg: Number(newTarget),
        currentKg: 0,
        date: newDate,
        location: newLoc,
        status: "Draft",
        registeredVolunteers: 0
      }
    ]);
    setNewTitle("");
    setNewTarget("");
    setNewLoc("");
    setNewDate("");
    setShowCampForm(false);
  };

  const claimSurplusDonation = (donation: Donation) => {
    // Add to local claims state
    setClaimsLog(prev => [...prev, donation]);
    // Also decrease quantity or mark claim
    alert(`Success: claimed ${donation.quantity} kg of "${donation.foodType}" from ${donation.donorName}. A volunteer courier is automatically scheduled to coordinate transit!`);
  };

  return (
    <div className="space-y-6">
      
      {/* NGO Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-lg border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] bg-slate-850 px-2 py-0.5 rounded text-emerald-450 text-emerald-400 font-extrabold tracking-widest font-mono uppercase">NGO CONSOLE SHIELD</span>
          </div>
          <h3 className="font-display font-bold text-white text-lg tracking-tight mt-1.5">Shelter & Food Kitchen Operations Portal</h3>
          <p className="text-xs text-slate-450 text-slate-400">Claim incoming high-quality surplus batches, organize volunteer campaign drives, and track local cold shelf stocks</p>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-850">
          {[
            { id: "claims", label: "Claim Surplus", icon: HeartHandshake },
            { id: "inventory", label: "Cold/Dry Inventory", icon: Boxes },
            { id: "campaigns", label: "Campaign Drives", icon: Calendar },
            { id: "recom", label: "AI Recommendations", icon: Sparkles }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeNgoTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveNgoTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  active ? "bg-emerald-600 text-white shadow-xs" : "text-slate-450 text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* RECOM: NGO MATCHING AGENT INTELLIGENT COMPANION */}
      {activeNgoTab === "recom" && (
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-3xl p-6 space-y-4 shadow-lg border border-teal-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Sparkles className="w-48 h-48 animate-pulse text-emerald-300" />
          </div>

          <div className="space-y-1.5 z-10">
            <span className="text-[9px] bg-emerald-500/20 text-emerald-350 border border-emerald-500/30 font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              NGO Matching Agent Heuristics Alert
            </span>
            <h4 className="font-display font-medium text-white text-base">Intelligent Demand-Matching Insights</h4>
            <p className="text-xs text-teal-150 leading-relaxed max-w-2xl text-teal-150">
              Analyzing upcoming regional climate forecast metrics, target shelter sizes, and caloric breakdown variables to maximize nutrition efficiency:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-xs space-y-2">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                <ThermometerSnowflake className="w-4 h-4 text-emerald-400 animate-bounce" /> Temperature warning indicator
              </span>
              <p className="text-slate-205 text-slate-300 pr-2">
                Unusually hot weekend indices expected (ambient peak 36°C). Logistics and Matching agents recommend claiming raw meats or protein meals only if you can assign refrigerated vans immediately. Avoid open-cart transport to prevent thermal degradation.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-xs space-y-2">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-emerald-400" /> Optimal Caloric Selections
              </span>
              <p className="text-slate-205 text-slate-300">
                Saint Jude community current tracking lists severe protein carbohydrate deficiency tags. Prioritize Hilton Cooked Basmati Chicken or grain rice batches on of unmatched list items over simple sugar bakeries.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: CLAIM SURPLUS DONATIONS */}
      {activeNgoTab === "claims" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5 shadow-subtle">
          <div>
            <h4 className="font-display font-bold text-slate-950 text-base">Unmatched High Quality Food Surplus Surplus</h4>
            <p className="text-xs text-slate-400">Review safe leftovers submitted by local hotels, diners, and commercial supermarkets. Click "Claim to Shelter" to coordinate immediate courier pilot transit.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {donations.filter(d => d.matchingStatus === "Unmatched" && d.suitabilityStatus === "Approved").length > 0 ? (
              donations.filter(d => d.matchingStatus === "Unmatched" && d.suitabilityStatus === "Approved").map((d) => (
                <div key={d.id} className="bg-slate-50 border rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="bg-slate-200 text-slate-700 font-mono text-[9px] font-bold px-2 py-0.5 rounded-sm">CODE: {d.id}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d.donorType} Node</span>
                    </div>

                    <h5 className="font-bold text-slate-900 text-sm leading-tight">{d.donorName}</h5>

                    <div className="text-xs text-slate-700 font-mono bg-white border rounded-xl p-3 space-y-1">
                      <div className="font-bold text-slate-900">{d.foodType}</div>
                      <div className="text-slate-500 mt-1 flex justify-between">
                        <span>Quantity payload:</span>
                        <span className="text-slate-800 font-semibold">{d.quantity} kg</span>
                      </div>
                      <div className="text-slate-500 flex justify-between">
                        <span>Safe expiry window:</span>
                        <span className="text-amber-700 font-bold">{d.expiryHours} hours remaining</span>
                      </div>
                      <div className="text-slate-550 flex justify-between">
                        <span>Storage Temperature:</span>
                        <span className="text-slate-650 text-slate-600">Ambient / Chilled Shelf</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => claimSurplusDonation(d)}
                    className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Claim Calories and Dispatch Logistics Pilot
                    <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-2 bg-slate-50 border p-12 rounded-2xl text-center space-y-3">
                <Utensils className="w-8 h-8 text-slate-400 mx-auto" />
                <h5 className="font-semibold text-slate-900">All available food claimed!</h5>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">There are currently no unclaimed, validated food submissions available in local Hyderabad city grids. Check back shortly!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inventory levels and Thermal sensors */}
      {activeNgoTab === "inventory" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5 shadow-subtle">
          <div className="flex justify-between items-center pb-3 border-b">
            <div>
              <h4 className="font-display font-medium text-slate-950 text-sm">Cold Chain Storage & Shelf Inventory Ledger</h4>
              <p className="text-xs text-slate-400">Tracking safe refrigeration temperatures of claimed supplies</p>
            </div>
            <button className="bg-slate-100 hover:bg-slate-200 border p-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-slate-800 flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Log local items manually
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {inventory.map((inv) => (
              <div key={inv.id} className="bg-slate-50 border rounded-2xl p-4 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-slate-200 text-slate-600 font-mono text-[9px] font-bold px-3 py-1 rounded-bl-sm uppercase">{inv.category}</div>
                
                <h5 className="font-bold text-slate-900 text-sm leading-tight pr-10 pt-1">{inv.name}</h5>
                
                <div className="bg-white border rounded-lg p-2.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Stored Weight:</span>
                    <span className="font-bold text-slate-800">{inv.quantity} kg</span>
                  </div>
                  <div className="flex justify-between text-slate-400 mt-1">
                    <span>Refrig Temp:</span>
                    <span className={`font-bold font-mono ${inv.storedTempCelsius < 5 ? "text-blue-600 animate-pulse" : "text-amber-600"}`}>
                      {inv.storedTempCelsius}°C
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 italic pr-4">
                  "{inv.notes}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Campaigns drives tab */}
      {activeNgoTab === "campaigns" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5 shadow-subtle">
          <div className="flex justify-between items-center pb-3 border-b">
            <div>
              <h4 className="font-display font-medium text-slate-950 text-sm">Create Food Distribution Drives</h4>
              <p className="text-xs text-slate-400">Organize neighborhood outreach drives and assign local volunteers</p>
            </div>
            <button
              onClick={() => setShowCampForm(!showCampForm)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Establish Drive
            </button>
          </div>

          {showCampForm && (
            <form onSubmit={handleCreateCampaign} className="bg-slate-50 border p-5 rounded-2xl space-y-4 max-w-xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-extrabold text-slate-700 block">Campaign Title *</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="E.g. West End Bread & Pastry Gathering"
                    className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 block">Caloric Weight Target *</label>
                  <input
                    type="number"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    placeholder="150 (in kg)"
                    className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 block">Drive Date *</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    required
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-extrabold text-slate-700 block">Target Location *</label>
                  <input
                    type="text"
                    value={newLoc}
                    onChange={(e) => setNewLoc(e.target.value)}
                    placeholder="42 High Street Park Shelter"
                    className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-950 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Register Campaign
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map((camp) => (
              <div key={camp.id} className="bg-slate-50 border rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-[10px] text-slate-400">DRIVE CODE: {camp.id}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                      camp.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse" : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}>{camp.status}</span>
                  </div>

                  <h5 className="font-bold text-slate-950 text-sm leading-tight">{camp.title}</h5>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {camp.location}</p>
                  <p className="text-xs text-slate-450 text-slate-400">Outreach Date: {camp.date}</p>

                  <div className="mt-4">
                    <div className="flex justify-between text-xs font-mono font-bold mb-1.5">
                      <span>Calorie target balanced:</span>
                      <span>{camp.currentKg} / {camp.targetKg} kg</span>
                    </div>
                    {/* Visual progress bar */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full" style={{ width: `${Math.min(100, (camp.currentKg / camp.targetKg) * 100)}%` }} />
                    </div>
                  </div>
                </div>

                <button className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-emerald-450 text-emerald-400" /> Deploy Volunteers Pilot to campaign
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
