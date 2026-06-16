/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Upload, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Download, 
  Scale, 
  MapPin, 
  Activity, 
  Leaf, 
  CheckCircle,
  FileBadge,
  X
} from "lucide-react";
import { Donation } from "../types";

interface DonorPortalProps {
  donations: Donation[];
  onAddManualDonation: (don: any) => void;
  onClassifySmartDonation: (desc: string) => Promise<any>;
}

export default function DonorPortal({ donations, onAddManualDonation, onClassifySmartDonation }: DonorPortalProps) {
  // Local form states
  const [foodTypeInput, setFoodTypeInput] = useState("");
  const [qtyInput, setQtyInput] = useState("");
  const [expiryInput, setExpiryInput] = useState("6");
  const [locationInput, setLocationInput] = useState("");
  const [donorType, setDonorType] = useState<'Restaurant' | 'Hotel' | 'Supermarket' | 'Caterer' | 'Individual'>("Restaurant");
  
  // Natural language chat box inside donor portal
  const [natLangDesc, setNatLangDesc] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Uploaded Image Simulator
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageAnalysisResult, setImageAnalysisResult] = useState<any | null>(null);
  const [analyzingImage, setAnalyzingImage] = useState(false);

  // Exemption Certificates States
  const [activeCertificate, setActiveCertificate] = useState<Donation | null>(null);

  const filterPastDonations = donations.filter(d => d.donorName.includes("Grand") || d.donorName.includes("Bella") || d.donorName.includes("Hyatt"));

  const triggerUploadSimulator = () => {
    // Pick from preconfigured beautiful food items
    setAnalyzingImage(true);
    setImageAnalysisResult(null);
    
    setTimeout(() => {
      setAnalyzingImage(false);
      setSelectedImage("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80"); // hot salad bowl
      setImageAnalysisResult({
        detectedItem: "Fresh Quinoa Salad Bowl & Charred Roast Vegetables",
        estimatedWeightKg: 14.5,
        approxCalories: 8200,
        tempCelsius: 12.4,
        confidenceScore: 97.4,
        spoiledProbability: 0.05,
        recomShelfHours: 12,
        unsuitableRiskFactor: "Low - Fully preserved in airtight insulated containers"
      });
      // Fill the form fields!
      setFoodTypeInput("Fresh Quinoa Salad Bowl & Charred Vegetables");
      setQtyInput("15");
      setExpiryInput("12");
    }, 1500);
  };

  const handleSimpleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodTypeInput || !qtyInput || !locationInput) {
      alert("Please complete required asterisks.");
      return;
    }

    onAddManualDonation({
      foodType: foodTypeInput,
      quantity: Number(qtyInput),
      expiryHours: Number(expiryInput),
      location: locationInput,
      donorType: donorType
    });

    setFoodTypeInput("");
    setQtyInput("");
    setLocationInput("");
    setSelectedImage(null);
    setImageAnalysisResult(null);
  };

  const handleSmartTextIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!natLangDesc.trim()) return;

    setIsAiLoading(true);
    try {
      await onClassifySmartDonation(natLangDesc);
      setNatLangDesc("");
    } catch (e) {
      console.log(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Donor Brand Header banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-lg border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] bg-slate-850 px-2 py-0.5 rounded text-emerald-400 font-extrabold tracking-widest font-mono uppercase">Donor Ingestion Terminal</span>
          </div>
          <h3 className="font-display font-bold text-white text-lg tracking-tight mt-1.5">Registered Professional Donor Desk</h3>
          <p className="text-xs text-slate-400">Pledge surplus stocks, validate safety with the image analyser, and print ESG/Tax deduction certificates</p>
        </div>

        <div className="flex gap-4 text-xs font-semibold font-mono bg-slate-950 p-4 border border-slate-850 rounded-2xl">
          <div className="text-center">
            <span className="block text-[10px] text-slate-500 uppercase">PLEDGED</span>
            <span className="text-emerald-400 text-lg font-bold">{filterPastDonations.reduce((sum, d) => sum + d.quantity, 0)} kg</span>
          </div>
          <div className="text-center border-l border-slate-850 pl-4">
            <span className="block text-[10px] text-slate-500 uppercase">OFFSETS</span>
            <span className="text-teal-400 text-lg font-bold">{filterPastDonations.reduce((sum, d) => sum + d.carbonFootprintSaved, 0).toFixed(1)} CO₂e</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Register Surplus Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-subtle">
            <h4 className="font-display font-medium text-slate-950 text-sm">Register Leftover Batch Form</h4>
            
            <form onSubmit={handleSimpleDonateSubmit} className="space-y-4 text-xs">
              
              {/* IMAGE ANALYSER SIMULATOR */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Food Verification AI Lab</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Drop zone clicker */}
                  <div 
                    onClick={triggerUploadSimulator}
                    className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col justify-center items-center space-y-2 bg-slate-50"
                  >
                    {analyzingImage ? (
                      <div className="animate-pulse space-y-2 text-slate-500">
                        <Activity className="w-8 h-8 mx-auto text-emerald-500 animate-spin" />
                        <span className="font-mono text-[9px] block">Agent examining nutrients & temperatures...</span>
                      </div>
                    ) : selectedImage ? (
                      <div className="relative group w-full h-24 rounded-lg overflow-hidden border">
                        <img src={selectedImage} alt="detected food payload" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center font-bold text-white text-[10px]">
                          Re-analyze payload image
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="font-bold text-slate-700">Simulate Upload Leftover Image</p>
                        <p className="text-[10px] text-slate-400">Click to run virtual Food Validation scanning</p>
                      </>
                    )}
                  </div>

                  {/* AI Scan feedback overlays */}
                  {imageAnalysisResult ? (
                    <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2 font-mono text-[10px] animate-fade-in">
                      <span className="text-[9px] text-emerald-450 text-emerald-450 uppercase font-black tracking-widest block font-bold text-emerald-400">🤖 validation logs</span>
                      <div className="text-xs font-semibold font-sans text-slate-100">{imageAnalysisResult.detectedItem}</div>
                      <div className="border-t border-slate-800 pt-2 space-y-1.5 font-mono text-slate-400 text-[10.5px]">
                        <div className="flex justify-between"><span>Weight Extracted:</span> <span className="text-slate-200">{imageAnalysisResult.estimatedWeightKg} kg</span></div>
                        <div className="flex justify-between"><span>Thermal Index:</span> <span className="text-slate-200">{imageAnalysisResult.tempCelsius}°C</span></div>
                        <div className="flex justify-between"><span>Safety Verification:</span> <span className="text-emerald-400 font-bold">{imageAnalysisResult.unsuitableRiskFactor}</span></div>
                        <div className="flex justify-between"><span>Agent Assurance:</span> <span className="text-slate-250 text-slate-300">{imageAnalysisResult.confidenceScore}% certainty</span></div>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-slate-100 bg-slate-50 rounded-2xl p-5 flex flex-col justify-center items-center text-center text-slate-400">
                      <ShieldCheck className="w-6 h-6 mb-2" />
                      <p className="text-[11px]">Deploy our virtual scanning agent to instantly pre-fill descriptions, quantities and calculate food safeness limits.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Standard inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block uppercase tracking-wider">Leftover Description *</label>
                  <input
                    type="text"
                    value={foodTypeInput}
                    onChange={(e) => setFoodTypeInput(e.target.value)}
                    placeholder="E.g. Roast Chicken & Potatoes"
                    className="block w-full px-3 py-2.5 bg-slate-50 border rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block uppercase tracking-wider">Weight payload (kg) *</label>
                  <input
                    type="number"
                    value={qtyInput}
                    onChange={(e) => setQtyInput(e.target.value)}
                    placeholder="15"
                    className="block w-full px-3 py-2.5 bg-slate-50 border rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block uppercase tracking-wider">Estimated consumption window (Hours) *</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="range"
                      min="1"
                      max="48"
                      value={expiryInput}
                      onChange={(e) => setExpiryInput(e.target.value)}
                      className="flex-1 accent-emerald-600 cursor-pointer"
                    />
                    <span className="font-mono text-slate-800 font-bold bg-slate-100 border px-2.5 py-1 rounded">{expiryInput} hours</span>
                  </div>
                </div>

                <div className="space-y-1 col-span-1">
                  <label className="text-[10px] font-bold text-slate-700 block uppercase tracking-wider">Facility Type</label>
                  <select
                    value={donorType}
                    onChange={(e) => setDonorType(e.target.value as any)}
                    className="block w-full px-3 py-2.5 bg-slate-50 border rounded-xl"
                  >
                    <option value="Restaurant">Restaurant</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Supermarket">Supermarket</option>
                    <option value="Caterer">Caterer</option>
                    <option value="Individual">Individual</option>
                  </select>
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-bold text-slate-700 block uppercase tracking-wider">Facilities pick-up address *</label>
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="Room 885 Royal Suite Buffet lobby, Grand Palace"
                    className="block w-full px-3 py-2.5 bg-slate-50 border rounded-xl"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                Pledge Surplus Reserves
              </button>
            </form>

          </div>
        </div>

        {/* Right Column: Dynamic Exemption certificates & History */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Certificate Generation Board */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-subtle">
            <h4 className="font-display font-medium text-slate-950 text-sm">Download ESG/Tax Deduction Certificates</h4>
            <p className="text-xs text-slate-400">Click any past approved donation batch to generate a verified carbon allocation certificate:</p>

            <div className="divide-y text-xs">
              {filterPastDonations.map((pastDonation) => (
                <div key={pastDonation.id} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-mono text-[9px] text-slate-450 block text-slate-400">CODE: {pastDonation.id}</span>
                    <span className="font-bold text-slate-800">{pastDonation.foodType}</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{pastDonation.quantity} kg ──▶ {pastDonation.carbonFootprintSaved} kg CO₂</span>
                  </div>
                  <button
                    onClick={() => setActiveCertificate(pastDonation)}
                    className="bg-slate-100 hover:bg-slate-200 hover:text-emerald-800 p-2 rounded-xl transition-all cursor-pointer border flex items-center gap-1 font-bold text-[10px]"
                  >
                    <Award className="w-3.5 h-3.5" /> Certificate
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Certificate HUD Modal inside */}
          {activeCertificate && (
            <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-2xl border border-slate-850 animate-fade-in relative z-10 space-y-4">
              <button 
                onClick={() => setActiveCertificate(null)}
                className="absolute top-4 right-4 text-slate-450 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center pb-2 border-b border-slate-900 space-y-2">
                <div className="bg-emerald-500/10 text-emerald-400 p-2.5 rounded-full w-fit mx-auto border border-emerald-500/20">
                  <FileBadge className="w-8 h-8" />
                </div>
                <h5 className="font-display font-bold text-slate-50 text-sm uppercase tracking-wide">CERTIFICATION OF ECOLOGICAL EXEMPTION</h5>
                <p className="text-[10px] text-slate-500 select-none">FOODBRIDGE DECAY PREVENTION INDEX - TAX CODE IRS § 170(E)(3)</p>
              </div>

              <div className="text-xs font-mono space-y-2 leading-relaxed text-slate-300">
                <div className="justify-between flex text-slate-500"><span className="font-bold">DONATION ID:</span> <span className="text-white">{activeCertificate.id}</span></div>
                <div className="justify-between flex text-slate-500"><span>DONATED FROM:</span> <span className="text-white truncate">{activeCertificate.donorName}</span></div>
                <div className="justify-between flex text-slate-500"><span>SURPLUS TYPE:</span> <span className="text-white truncate">{activeCertificate.foodType}</span></div>
                <div className="justify-between flex text-slate-500"><span>PLEDGED VOLUME:</span> <span className="text-emerald-400 font-bold">{activeCertificate.quantity} kg</span></div>
                <div className="justify-between flex text-slate-500"><span>CARBON OFFSET (WARM):</span> <span className="text-emerald-400 font-bold">{activeCertificate.carbonFootprintSaved} kg CO₂e</span></div>
                <div className="justify-between flex text-slate-500"><span>ISSUED STAMP DATE:</span> <span className="text-slate-400">{new Date().toISOString().substring(0, 10)}</span></div>
              </div>

              <div className="bg-slate-900 rounded-xl p-3 border border-slate-850 text-[10px] text-slate-400 text-center select-none font-sans italic pr-2">
                "Verified safe redistribution. This pledge prevents active municipal organic decomposition, diverting equivalent landfill methane into community nutrients preservation indices."
              </div>

              <button
                onClick={() => alert("Verification code generated: FBAI-CO2-OFF-2026. This receipt survived cryptography validation!")}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2"
              >
                <Download className="w-4 h-4" /> Download Certified ESG Code Receipt
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
