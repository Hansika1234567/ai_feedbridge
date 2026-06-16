/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ShieldAlert, 
  Users, 
  ClipboardCheck, 
  MapPin, 
  FileSpreadsheet, 
  AlertTriangle,
  UserCheck,
  CheckCircle,
  XCircle,
  TrendingDown,
  Activity,
  UserX,
  FileCheck
} from "lucide-react";
import { Donation, NGO, Delivery } from "../types";

interface SuperAdminPortalProps {
  donations: Donation[];
  ngos: NGO[];
  deliveries: Delivery[];
  onRefresh: () => void;
}

export default function SuperAdminPortal({ donations, ngos, deliveries, onRefresh }: SuperAdminPortalProps) {
  const [ngoListSetting, setNgoListSetting] = useState<NGO[]>(ngos);
  const [adminUsers, setAdminUsers] = useState<any[]>([
    { id: "usr-1", name: "Jonathan Vance", role: "Super Admin", email: "jonathan.admin@foodbridge.ai", active: true },
    { id: "usr-2", name: "Sarah Jenkins", role: "Volunteer", email: "sarah.volunteer@foodbridge.ai", active: true },
    { id: "usr-3", name: "Marcus Aurelius", role: "Food Donor", email: "chef.marcus@palacebanquet.com", active: true },
    { id: "usr-4", name: "Sister Clara", role: "NGO Admin", email: "sister.clara@hopepantry.org", active: true },
    { id: "usr-5", name: "Emergency Shelter", role: "Beneficiary/Shelter", email: "emergency.shelter@citysafe.net", active: true }
  ]);
  const [selectedSubTab, setSelectedSubTab] = useState<"approvals" | "users" | "fraud" | "monitoring" | "reports">("approvals");
  const [isDownloading, setIsDownloading] = useState(false);
  const [reportLog, setReportLog] = useState<string | null>(null);

  // Simulated Fraud anomalies
  const suspiciousDonations = [
    {
      id: "anom-1",
      donorName: "Rogue Buffet Inc",
      problem: "Massive volume anomaly & temperature fluctuation",
      weight: 1540, // 1.5 tons of cooked burgers!
      classification: "Unvalidated Bulk Cooked",
      reportedBy: "Food Validation Agent",
      relevanceScore: 98,
      status: "Flagged"
    },
    {
      id: "anom-2",
      donorName: "Warm Storage Produce Hub",
      problem: "Reported prepTime is 8 hours at 32°C. Elevated spoilage coefficient.",
      weight: 140,
      classification: "Perishable Bakery-Lactose Item",
      reportedBy: "Logistics Agent",
      relevanceScore: 84,
      status: "Investigating"
    }
  ];

  const handleApproveNGO = (id: string, status: 'Approved' | 'Rejected') => {
    setNgoListSetting(prev => 
      prev.map(item => item.id === id ? { ...item, urgencyLevel: status === 'Approved' ? 'Critical' : 'Low' } : item)
    );
  };

  const handleToggleUserStatus = (id: string) => {
    setAdminUsers(prev => 
      prev.map(user => user.id === id ? { ...user, active: !user.active } : user)
    );
  };

  const generateReport = () => {
    setIsDownloading(true);
    setReportLog(null);
    setTimeout(() => {
      setIsDownloading(false);
      const generated = {
        timestamp: new Date().toISOString(),
        totalPreservedKg: donations.reduce((sum, d) => sum + (d.suitabilityStatus === "Approved" ? d.quantity : 0), 0),
        activeCouriers: deliveries.length,
        certifiedCarbonReductionCo2: donations.reduce((sum, d) => sum + d.carbonFootprintSaved, 0).toFixed(1),
        resolvedNgoCount: ngoListSetting.length,
        rejectionQuotient: "7.2%"
      };
      setReportLog(JSON.stringify(generated, null, 2));
    }, 1300);
  };

  return (
    <div className="space-y-6">
      
      {/* Super Admin Title & Segment controller */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-lg border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <h3 className="font-display font-black text-white text-lg tracking-tight uppercase">Super Admin Security HQ</h3>
          </div>
          <p className="text-xs text-slate-400">Global audit commands, pending NGO applications, fraud telemetry logs</p>
        </div>

        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-850">
          {[
            { id: "approvals", label: "NGO Approval Hub", icon: ClipboardCheck },
            { id: "users", label: "User Accounts", icon: Users },
            { id: "fraud", label: "Fraud Telemetry", icon: ShieldAlert },
            { id: "monitoring", label: "Dispatches Map", icon: Activity },
            { id: "reports", label: "Reports Desk", icon: FileSpreadsheet },
          ].map((sub) => {
            const Icon = sub.icon;
            const active = selectedSubTab === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubTab(sub.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  active 
                    ? "bg-emerald-600 text-white shadow-xs" 
                    : "text-slate-450 text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {sub.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* PENDING APPROVAL QUEUE */}
      {selectedSubTab === "approvals" && (
        <div className="bg-white rounded-2xl border border-slate-105 border-slate-100 p-6 space-y-4 shadow-subtle">
          <div>
            <h4 className="font-display font-bold text-slate-900 text-base">Registered Shelters & Critical NGO Approval Queue</h4>
            <p className="text-xs text-slate-400">Validate facility credentials, food handling certifications, and target delivery addresses</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ngoListSetting.map((ngo) => (
              <div key={ngo.id} className="bg-slate-50 border rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] text-slate-400">DEMAND CODE: {ngo.id}</span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase ${
                      ngo.urgencyLevel === "Critical" 
                        ? "bg-emerald-100 text-emerald-800 border-emerald-250 font-bold" 
                        : "bg-amber-100 text-amber-800 border-amber-200"
                    }`}>
                      {ngo.urgencyLevel === "Critical" ? "Approved Verified" : "Verification Pending"}
                    </span>
                  </div>

                  <h5 className="font-bold text-slate-900 text-sm mt-3 leading-tight">{ngo.name}</h5>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {ngo.location}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Contact: {ngo.contact}</p>

                  <div className="bg-white border rounded-xl p-3 mt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Requested Target:</span>
                      <span className="font-bold text-slate-800">{ngo.quantityRequested} kg/batch</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Certified Profile types:</span>
                      <span className="font-mono text-[10px] text-slate-600 truncate">{ngo.requestedFoodTypes.join(", ")}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/60 flex items-center gap-2">
                  <button
                    onClick={() => handleApproveNGO(ngo.id, 'Approved')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <UserCheck className="w-3.5 h-3.5" /> Approved NGO
                  </button>
                  <button
                    onClick={() => handleApproveNGO(ngo.id, 'Rejected')}
                    className="px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 border border-rose-220 border-rose-200"
                  >
                    <UserX className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USER MANAGEMENT */}
      {selectedSubTab === "users" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5 shadow-subtle">
          <div>
            <h4 className="font-display font-bold text-slate-950 text-base">Unified User Node Registries</h4>
            <p className="text-xs text-slate-400">Enable/disable registered entities, modify role-based privilege variables</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3 px-2">Account Member</th>
                  <th className="pb-3">Functional Assignment Role</th>
                  <th className="pb-3">Registered secure email</th>
                  <th className="pb-3">Status Index</th>
                  <th className="pb-3 text-right">Emergency Suspension Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {adminUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-2 font-bold text-slate-900">{user.name}</td>
                    <td className="py-3">
                      <span className="bg-slate-100 text-slate-700 border px-2 py-0.5 rounded-md font-semibold text-[10px]">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-slate-500">{user.email}</td>
                    <td className="py-3">
                      {user.active ? (
                        <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-sm">● Active System State</span>
                      ) : (
                        <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-sm">● Deactivated Auth Node</span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleToggleUserStatus(user.id)}
                        className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          user.active 
                            ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-220 border-rose-200" 
                            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {user.active ? "Suspend Account" : "Activate Account"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FRAUD DETECTION DASHBOARD */}
      {selectedSubTab === "fraud" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5 shadow-subtle">
          <div className="flex gap-2 items-center text-rose-700 font-bold">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <h4 className="font-display text-slate-900 text-base">Automated Agent-Driven Fraud Detection</h4>
          </div>
          <p className="text-xs text-slate-400">Our Donor validation safety agent flags anomalies including massive suspicious weights, long-expired temperature logs, or frequent double delivery claims.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suspiciousDonations.map((anom) => (
              <div key={anom.id} className="bg-red-50/40 border border-red-150 border-red-100 rounded-2xl p-5 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-100 text-red-700 font-mono text-[9px] font-bold px-3.5 py-1 rounded-bl-xl uppercase tracking-wider">
                  Risk Factor: {anom.relevanceScore}%
                </div>
                
                <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest font-mono">
                  ANOMALY DETECTED BY: {anom.reportedBy}
                </span>

                <h5 className="font-bold text-slate-950 text-sm mt-1">{anom.donorName}</h5>
                <p className="text-xs text-red-855 text-red-900 font-medium">{anom.problem}</p>
                <div className="text-xs text-slate-500 font-mono mt-2">
                  <div>• Spec Weight: {anom.weight} kg</div>
                  <div>• Spec category: {anom.classification}</div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button className="flex-1 bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs py-2 rounded-lg transition-all cursor-pointer">
                    Suppress False Alarm
                  </button>
                  <button className="flex-1 bg-red-650 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 rounded-lg transition-all cursor-pointer">
                    Quarantine Donation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DISPATCH MONITORING MAP HUD */}
      {selectedSubTab === "monitoring" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-subtle">
          <div>
            <h4 className="font-display font-bold text-slate-900 text-base">Active Food Distribution Pipeline Monitoring</h4>
            <p className="text-xs text-slate-450 text-slate-400">Monitoring real-time cold chain logistics transits between donors and shelters</p>
          </div>

          <div className="bg-slate-950 rounded-2xl p-6 border text-white relative">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase font-bold px-3 py-1 rounded-md">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              Live Transits Telemetry Grid
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs font-mono">
              <div className="space-y-4">
                <span className="text-[10px] text-slate-450 text-slate-400 block uppercase font-bold tracking-wider">Transit Pipeline logs</span>
                {deliveries.length > 0 ? (
                  deliveries.map((del) => (
                    <div key={del.id} className="border-l-2 border-emerald-500 pl-4 space-y-1">
                      <div className="font-bold text-slate-100">Dispatched ID: {del.id}</div>
                      <div className="text-slate-400">Volunteer Pilot: {del.volunteerName}</div>
                      <div className="text-slate-400">Vehicle Mode: {del.vehicleType}</div>
                      <div className="text-emerald-400 font-bold uppercase text-[9px] mt-1 pr-1.5 bg-emerald-500/10 w-fit rounded-xs">STATUS: {del.status}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500">No active volunteer transits detected. Dispatched riders are idle.</div>
                )}
              </div>

              {/* Graphical simulation of map */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between h-48 select-none">
                <span className="text-[9px] text-slate-450 uppercase font-black text-slate-400 tracking-wider">Vector Hub Coordinate Map</span>
                
                <div className="flex justify-center items-center py-6">
                  <div className="relative w-full max-w-[280px] h-10 border border-slate-800 rounded-full flex items-center justify-between px-4 bg-slate-950">
                    <span className="w-3 h-3 bg-emerald-500 rounded-full text-[9px] font-bold text-white flex justify-center items-center">A</span>
                    <div className="h-0.5 flex-1 border-t-2 border-dashed border-emerald-500/40 relative mx-2">
                      <span className="absolute -top-1.5 left-1/3 w-3 h-3 bg-indigo-400 rounded-full animate-bounce" />
                    </div>
                    <span className="w-3 h-3 bg-teal-500 rounded-full text-[9px] font-bold text-white flex justify-center items-center">B</span>
                  </div>
                </div>

                <div className="flex justify-between text-[9px] text-slate-500">
                  <span>A: Donor coordinates point</span>
                  <span>B: Recipient Shelter coordinates point</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORTS AND STATISTICS */}
      {selectedSubTab === "reports" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5 shadow-subtle">
          <div>
            <h4 className="font-display font-medium text-slate-950 text-base">Simulated Platform Reports & CSV Export Desk</h4>
            <p className="text-xs text-slate-400">Compile aggregated metrics including carbon index saving, calories balanced, and NGO rejection graphs</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center">
            <button
              onClick={generateReport}
              disabled={isDownloading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-55"
            >
              <FileCheck className="w-4 h-4" />
              {isDownloading ? "Assembling records indexes..." : "Simulate Assembled PDF Report Ledger"}
            </button>
            <p className="text-[11px] text-slate-455 text-slate-400 italic">Dispatches structured diagnostic JSON representing current local node parameters.</p>
          </div>

          {reportLog && (
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-900 font-mono text-[11px] text-slate-300 animate-fade-in">
              <span className="text-[9px] block text-slate-500 uppercase font-bold mb-3">// CERTIFIED AUDIT TELEMETRY LEDGER</span>
              <pre className="overflow-x-auto whitespace-pre">{reportLog}</pre>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
