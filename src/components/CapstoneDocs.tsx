/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Network, 
  Bot, 
  FolderTree, 
  Database, 
  Radio, 
  CalendarClock, 
  CloudLightning, 
  Globe2, 
  CheckCircle,
  FileCode,
  Map,
  Settings,
  ChevronRight
} from "lucide-react";

export default function CapstoneDocs() {
  return (
    <div className="space-y-8 animate-fade-in text-gray-800">
      
      {/* Header Banner */}
      <div className="bg-linear-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-6">
          <Bot size={280} />
        </div>
        <div className="relative z-10 max-w-3xl">
          <span className="bg-emerald-500/30 text-emerald-100 text-xs uppercase font-semibold px-3 py-1 rounded-full tracking-wider">
            Academic Capstone Thesis & Integration Spec
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mt-3 tracking-tight">
            FoodBridge AI — Technical Blueprint
          </h1>
          <p className="text-emerald-100/90 mt-2 text-sm md:text-base leading-relaxed">
            Multi-Agent Logistics & Fair Calorie Allocation Optimizer designed to connect industrial 
            and commercial food surplus providers with community benefit centers and shelters.
          </p>
        </div>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-2">
          <p className="text-xs uppercase font-bold tracking-wider text-gray-400 px-3">Sections</p>
          <a href="#architecture" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-emerald-50 text-gray-700 hover:text-emerald-700">
            <Network className="w-4 h-4 text-emerald-600" />
            System Architecture
          </a>
          <a href="#workflow" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-emerald-50 text-gray-700 hover:text-emerald-700">
            <Bot className="w-4 h-4 text-emerald-600" />
            Multi-Agent Workflow
          </a>
          <a href="#folders" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-emerald-50 text-gray-700 hover:text-emerald-700">
            <FolderTree className="w-4 h-4 text-emerald-600" />
            Folder Structure
          </a>
          <a href="#database" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-emerald-50 text-gray-700 hover:text-emerald-700">
            <Database className="w-4 h-4 text-emerald-600" />
            Database Schema
          </a>
          <a href="#endpoints" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-emerald-50 text-gray-700 hover:text-emerald-700">
            <Radio className="w-4 h-4 text-emerald-600" />
            API Endpoints
          </a>
          <a href="#implementation" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-emerald-50 text-gray-700 hover:text-emerald-700">
            <CalendarClock className="w-4 h-4 text-emerald-600" />
            Step-by-Step Plan
          </a>
          <a href="#deployment" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-emerald-50 text-gray-700 hover:text-emerald-700">
            <CloudLightning className="w-4 h-4 text-emerald-600" />
            Cloud Run Deployment
          </a>
          <a href="#kaggle" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-emerald-50 text-gray-700 hover:text-emerald-700">
            <Globe2 className="w-4 h-4 text-emerald-600" />
            Kaggle Submission
          </a>
        </aside>

        {/* Full Document Body */}
        <main className="lg:col-span-9 space-y-12">
          
          {/* 1. System Architecture */}
          <section id="architecture" className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 scroll-mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-700">
                <Network className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">1. Complete System Architecture</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              FoodBridge AI uses a modular, multi-tier architecture designed for low-latency operational 
              decisions and security. Commercial clients write request bundles handled by an API Gateway. 
              The application translates tasks to appropriate downstream agent executors backed by Gemini.
            </p>

            {/* Architecture diagram */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 font-mono text-xs text-gray-700 overflow-x-auto space-y-2 select-none">
              <div className="text-center font-bold text-emerald-800 mb-2">// HIGH LEVEL BLOCK DIAGRAM</div>
              <div className="flex justify-center items-center gap-2">
                <div className="border border-teal-600 bg-teal-50 px-3 py-1.5 rounded-md shadow-xs">[ Donor / NGO Clients ]</div>
                <div className="text-teal-600">◀ ── HTTPS / WebSockets ── ▶</div>
                <div className="border border-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-md shadow-xs">[ API Gateway & Router ]</div>
              </div>
              <div className="flex justify-center my-1 select-none">
                <div className="text-gray-400">│</div>
              </div>
              <div className="flex justify-center items-center gap-1">
                <div className="border-2 border-dashed border-gray-300 p-3 rounded-lg flex flex-col items-center bg-white">
                  <div className="font-bold text-gray-800 mb-1">State & Storage Management</div>
                  <div className="flex gap-2">
                    <div className="border border-purple-500 bg-purple-50 px-1.5 py-1 rounded-sm">PostgreSQL DB</div>
                    <div className="border border-amber-500 bg-amber-50 px-1.5 py-1 rounded-sm">Redis Cache</div>
                  </div>
                </div>
                <div className="text-gray-400 mx-2">◀ ── ── ▶</div>
                <div className="border-2 border-emerald-600 p-3 rounded-lg flex flex-col items-center bg-emerald-50">
                  <div className="font-bold text-emerald-900 mb-1">Multi-Agent Engine (Gemini)</div>
                  <div className="grid grid-cols-2 gap-1 text-[10px]">
                    <div className="bg-white/80 p-0.5 border rounded-sm">Donor Agent</div>
                    <div className="bg-white/80 p-0.5 border rounded-sm">Logistics Agent</div>
                    <div className="bg-white/80 p-0.5 border rounded-sm">NGO Matcher</div>
                    <div className="bg-white/80 p-0.5 border rounded-sm">Beneficiary Agent</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-xs">
              <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100">
                <h4 className="font-bold text-teal-900 mb-1">Interactive Presentation Tier</h4>
                <p className="text-teal-700 leading-relaxed">
                  Engineered with React 19, Tailwind CSS, and Recharts, providing responsive mobile dashboards for couriers and inventory consoles for donors.
                </p>
              </div>
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                <h4 className="font-bold text-indigo-900 mb-1">Service & Controller Tier</h4>
                <p className="text-indigo-700 leading-relaxed">
                  FastAPI on Python or Express.js on Node.js delivering secure REST endpoints, structured schemas, and lazy authorization routines.
                </p>
              </div>
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                <h4 className="font-bold text-emerald-900 mb-1">AI Orchestration Tier</h4>
                <p className="text-emerald-700 leading-relaxed">
                  Powered by <code className="bg-white px-1 py-0.5 border rounded-sm">gemini-3.5-flash</code> for rapid real-time structured classification, matching scores, and route logic.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Multi-Agent Workflow */}
          <section id="workflow" className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 scroll-mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-700">
                <Bot className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">2. Multi-Agent Workflow Diagram</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              When a surplus food alert is issued, it sets off an asynchronous reaction across the specialized agent cells. Each agent evaluates its specific parameter boundaries, then passes JSON-structured telemetry to the next coordinator cell:
            </p>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">1</div>
                  <div className="w-0.5 h-12 bg-gray-200"></div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Donor Agent (Ingestion & Classification)</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Accepts text declarations or receipts. Validates temperature state, allergen properties, and estimates expiration window. Rejects unsuitable items immediately.
                  </p>
                </div>
              </div>
              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm">2</div>
                  <div className="w-0.5 h-12 bg-gray-200"></div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">NGO Coordination Agent (Smart Calorie Matchmaker)</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Scans registered demands. Factors in shelter urgency coefficients (e.g. "Critical" when supply is dry) and geographical distances to calculate the compatibility scores.
                  </p>
                </div>
              </div>
              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">3</div>
                  <div className="w-0.5 h-12 bg-gray-200"></div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Logistics Agent (Transit & Cold-chain Optimization)</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Computes waypoint directions, matches correct transport modes (refrigerated van for perishable dairy vs. bicycle for dry goods), and estimates travel latency.
                  </p>
                </div>
              </div>
              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm">4</div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Beneficiary & Analytics Agents (Delivery & Ecological Audit)</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Completes receipt tracking, predicts community needs, recalculates aggregated methane gas avoidance calculations, and streams the outcomes dynamically back to the user logs.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Folder Structure */}
          <section id="folders" className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 scroll-mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-700">
                <FolderTree className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">3. Backend & Frontend Directory Blueprints</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Standard structured directory layouts used to cleanly divide frontend client systems, backend API routers, models, and worker scripts.
            </p>

            <div className="bg-slate-900 rounded-xl p-4 text-slate-100 font-mono text-xs overflow-x-auto">
              <pre className="leading-relaxed">
{`foodbridge-ai-system/
├── backend/                  # FastAPI / Python Services
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py           # Ingestion Server Setup
│   │   ├── config.py         # App secrets & Key verification
│   │   ├── agents/           # Specialized AI Agent Modules
│   │   │   ├── donor_agent.py
│   │   │   ├── ngo_coord_agent.py
│   │   │   ├── logistics_agent.py
│   │   │   └── analytics_agent.py
│   │   ├── routers/          # API Route Controllers
│   │   │   ├── donations.py
│   │   │   ├── matching.py
│   │   │   └── analytics.py
│   │   └── models/           # SQLAlchemy / tortoise schemas
│   │       └── database.py
│   ├── requirements.txt
│   └── Dockerfile            # Container definition
├── frontend/                 # Interactive Client Console
│   ├── src/
│   │   ├── components/       # Interface partitions
│   │   ├── App.tsx           # Dashboard Orchestrator
│   │   └── index.css         # Styling directives
│   ├── package.json
│   └── vite.config.ts
└── README.md`}
              </pre>
            </div>
          </section>

          {/* 4. Database Schema */}
          <section id="database" className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 scroll-mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-700">
                <Database className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">4. Relational Database Schema Blueprints</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              A high-precision database architecture modeling donations, shelter request logs, logistics transit plans, and carbon offset aggregate metrics.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Table 1: Donations */}
              <div className="border border-gray-100 rounded-xl bg-gray-50/50 p-4">
                <h4 className="font-bold text-xs font-mono text-indigo-700 mb-2">TABLE: donations</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-mono text-gray-700">id</span>
                    <span className="text-gray-400">UUID (PK, NOT NULL)</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-mono text-gray-700">donor_name</span>
                    <span className="text-gray-400">VARCHAR(255)</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-mono text-gray-700">food_type</span>
                    <span className="text-gray-400">VARCHAR(500)</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-mono text-gray-700">quantity_kg</span>
                    <span className="text-gray-400">DECIMAL(10, 2)</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-mono text-gray-700">expiry_window</span>
                    <span className="text-gray-400">INT (hours)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-gray-700">carbon_saved</span>
                    <span className="text-gray-400">DECIMAL(8,2)</span>
                  </div>
                </div>
              </div>

              {/* Table 2: NGOs / Shelters */}
              <div className="border border-gray-100 rounded-xl bg-gray-50/50 p-4">
                <h4 className="font-bold text-xs font-mono text-indigo-700 mb-2">TABLE: ngos</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-mono text-gray-700">id</span>
                    <span className="text-gray-400">UUID (PK, NOT NULL)</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-mono text-gray-700">name</span>
                    <span className="text-gray-400">VARCHAR(255)</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-mono text-gray-700">location</span>
                    <span className="text-gray-400">TEXT</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-mono text-gray-700">requested_type</span>
                    <span className="text-gray-400">VARCHAR(100)[]</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-gray-700">urgency</span>
                    <span className="text-gray-400">VARCHAR(20)</span>
                  </div>
                </div>
              </div>

              {/* Table 3: Deliveries */}
              <div className="border border-gray-100 rounded-xl bg-gray-50/50 p-4">
                <h4 className="font-bold text-xs font-mono text-indigo-700 mb-2">TABLE: deliveries</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-mono text-gray-700">id</span>
                    <span className="text-gray-400">UUID (PK)</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-mono text-gray-700">donation_id</span>
                    <span className="text-gray-400">UUID (FK -&gt; donations)</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-mono text-gray-700">ngo_id</span>
                    <span className="text-gray-400">UUID (FK -&gt; ngos)</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-mono text-gray-700">spoilage_risk</span>
                    <span className="text-gray-400">VARCHAR(20)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-gray-700">eta_minutes</span>
                    <span className="text-gray-400">INTEGER</span>
                  </div>
                </div>
              </div>

              {/* Table 4: Metrics */}
              <div className="border border-gray-100 rounded-xl bg-gray-50/50 p-4">
                <h4 className="font-bold text-xs font-mono text-indigo-700 mb-2">TABLE: carbon_metrics</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-mono text-gray-700">track_id</span>
                    <span className="text-gray-400">SERIAL (PK)</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-mono text-gray-700">total_saved_kg</span>
                    <span className="text-gray-400">DECIMAL(12, 2)</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-mono text-gray-700">co2_saving_kg</span>
                    <span className="text-gray-400">DECIMAL(12, 2)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-gray-700">last_updated</span>
                    <span className="text-gray-400">TIMESTAMP</span>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* 5. API Endpoints */}
          <section id="endpoints" className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 scroll-mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-700">
                <Radio className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">5. REST API Interface Specification</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b text-gray-400 font-semibold uppercase tracking-wider">
                    <th className="py-2.5 font-medium">Method</th>
                    <th className="py-2.5 font-medium">Endpoint</th>
                    <th className="py-2.5 font-medium">Description</th>
                    <th className="py-2.5 font-medium">Payload / Returns</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-gray-700">
                  <tr>
                    <td className="py-3 font-semibold text-emerald-600">GET</td>
                    <td className="py-3 font-mono">/api/donations</td>
                    <td className="py-3">Lists food deposits on the board</td>
                    <td className="py-3 font-mono text-[10px] text-gray-500">{"{ donations: [...] }"}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-blue-600">POST</td>
                    <td className="py-3 font-mono">/api/donations/smart-classify</td>
                    <td className="py-3">Extracts details from natural descriptions using Gemini</td>
                    <td className="py-3 font-mono text-[10px] text-gray-500">{"{ textDescription, location }"}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-emerald-600">GET</td>
                    <td className="py-3 font-mono">/api/ngos</td>
                    <td className="py-3">Lists active shelter demands</td>
                    <td className="py-3 font-mono text-[10px] text-gray-500">{"{ ngos: [...] }"}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-blue-600">POST</td>
                    <td className="py-3 font-mono">/api/deliveries/optimize-route</td>
                    <td className="py-3">Computes routing logic and safety spoilage bounds</td>
                    <td className="py-3 font-mono text-[10px] text-gray-500">{"{ donationId, ngoId }"}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-blue-600">POST</td>
                    <td className="py-3 font-mono">/api/match-donations</td>
                    <td className="py-3">Performs automated pairing scoring</td>
                    <td className="py-3 font-mono text-[10px] text-gray-500">{"{ recommendations: [...] }"}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-blue-600">POST</td>
                    <td className="py-3 font-mono">/api/chat</td>
                    <td className="py-3">Sends messages to the multi-agent chatbot and returns logic</td>
                    <td className="py-3 font-mono text-[10px] text-gray-500">{"{ responseText, chain: [] }"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 6. Step-by-Step implementation plan */}
          <section id="implementation" className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 scroll-mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-700">
                <CalendarClock className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">6. Step-by-Step Implementation Sprints</h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border border-emerald-100 bg-emerald-50/30 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-sm font-semibold">Sprint 1 (Weeks 1-2)</span>
                  <span className="text-xs text-emerald-600 font-bold">100% Completed</span>
                </div>
                <h4 className="font-bold text-sm text-gray-900">Environment Bootstrap & Mock Database Design</h4>
                <p className="text-xs text-gray-600 mt-1">Configure TSX, Express endpoints, setup relational/in-memory data tables, and pre-populate mock donor profiles.</p>
              </div>

              <div className="p-4 border border-gray-100 bg-gray-50/50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-sm font-semibold">Sprint 2 (Weeks 3-4)</span>
                  <span className="text-xs text-indigo-600 font-bold">In Progress</span>
                </div>
                <h4 className="font-bold text-sm text-gray-900">Donor Ingestion & NLP LLM Classifier Integration</h4>
                <p className="text-xs text-gray-600 mt-1">Implement Gemini prompt schemas, set up automated suitability and expiration evaluators, and construct the emission savings algorithms.</p>
              </div>

              <div className="p-4 border border-gray-100 bg-gray-50/50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded-sm font-semibold">Sprint 3 (Weeks 5-6)</span>
                  <span className="text-xs text-gray-400 font-bold">Upcoming</span>
                </div>
                <h4 className="font-bold text-sm text-gray-900">Matchmaker, Logistics & Live Route Optimization</h4>
                <p className="text-xs text-gray-600 mt-1">Enable live waypoint routing calculations, transport constraints scoring, and smart multi-agent communication modules.</p>
              </div>
            </div>
          </section>

          {/* 7. Google Cloud Run Deployment */}
          <section id="deployment" className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 scroll-mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-700">
                <CloudLightning className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">7. Google Cloud Run Deployment Guide</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              FoodBridge AI uses Google Cloud Run for scale-to-zero serving, ensuring zero cost when idle. Follow this container blueprint:
            </p>

            <div className="bg-slate-900 rounded-xl p-4 text-slate-100 font-mono text-xs space-y-3">
              <div>
                <span className="text-emerald-400"># Step 1: Write a Dockerfile</span>
                <pre>{`FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]`}</pre>
              </div>
              <div>
                <span className="text-emerald-400"># Step 2: Build container via Google Cloud Build</span>
                <pre>{`gcloud builds submit --tag gcr.io/foodbridge-ai-4503/server`}</pre>
              </div>
              <div>
                <span className="text-emerald-400"># Step 3: Launch container on Cloud Run alongside secret credentials</span>
                <pre>{`gcloud run deploy foodbridge-service \\
  --image gcr.io/foodbridge-ai-4503/server \\
  --platform managed \\
  --region us-central1 \\
  --allow-unauthenticated \\
  --set-env-vars GEMINI_API_KEY="YOUR_SECURE_API_KEY_HERE"`}</pre>
              </div>
            </div>
          </section>

          {/* 8. Kaggle Capstone Strategy */}
          <section id="kaggle" className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 scroll-mt-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-700">
                <Globe2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">8. Kaggle Capstone Submission Strategy</h2>
            </div>
            
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              To secure a top scoring placement in Kaggle capstones for NGO resource tracking, package the dataset telemetry and agent decisions using the following steps:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700">
              <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-100">
                <h4 className="font-bold text-amber-900 mb-1">📋 Dataset Aggregations</h4>
                <p className="leading-relaxed">
                  Export donations history as structured CSV arrays recording: <code className="bg-white px-1">food_type</code>, <code className="bg-white px-1">expiry_hours</code>, <code className="bg-white px-1">co2_saved</code>, and matching delays. This dataset satisfies a major need for realistic food loss benchmarks.
                </p>
              </div>
              <div className="bg-teal-50/40 p-4 rounded-xl border border-teal-100">
                <h4 className="font-bold text-teal-900 mb-1">📓 Notebook presentation</h4>
                <p className="leading-relaxed">
                  Publish a python-jupyter notebook showing: a) Carbon footprint formulas, b) Heuristics routing charts compared with Gemini LLM routes, and c) Demand forecasting accuracy of NGOs.
                </p>
              </div>
            </div>
          </section>

        </main>
      </div>

    </div>
  );
}
