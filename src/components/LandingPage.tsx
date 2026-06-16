/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Bot, 
  MapPin, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Phone, 
  Leaf, 
  Users, 
  HeartHandshake, 
  ArrowRight, 
  CheckCircle,
  Truck,
  ShieldAlert,
  HelpCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Mail,
  User,
  Map
} from "lucide-react";
import { motion } from "motion/react";

interface LandingPageProps {
  onNavigateToAuth: (mode: "login" | "register") => void;
  currentUser: any;
  onNavigateToTab: (tab: string) => void;
}

export default function LandingPage({ onNavigateToAuth, currentUser, onNavigateToTab }: LandingPageProps) {
  // Contact state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setToast("Thank you for reaching out! Our logistics AI dispatch squad will contact you shortly.");
      setContactName("");
      setContactEmail("");
      setContactMsg("");
      setTimeout(() => setToast(null), 4000);
    }, 1200);
  };

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const stats = [
    { value: "48,290 kg", label: "Surplus Food Restored", desc: "Successfully saved from commercial landfills" },
    { value: "96,580+", label: "Nutritional Meals Served", desc: "Distributed to high-urgency shelters" },
    { value: "120.7 Tons", label: "CO2 Emissions Offset", desc: "Prevented methane equivalent from organic rot" },
    { value: "18 mins", label: "Average Auto-ETA Delivery", desc: "Optimized logistics via volunteer pilots" }
  ];

  const features = [
    {
      icon: <Bot className="w-6 h-6 text-emerald-400" />,
      title: "Autonomous AI Smart Ingest",
      desc: "Upload a photo or submit a brief verbal voice note. Our server-side Gemini backend extracts food classifications, volumes, risk levels, and carbon footprint metrics instantaneously."
    },
    {
      icon: <MapPin className="w-6 h-6 text-teal-400" />,
      title: "Precision Route Optimizations",
      desc: "Our Logistics Agent calculates high-speed regional bypass routes avoiding Hyderabad bottleneck nodes. Real-time GPS navigation ensures prompt delivery for high-perishables."
    },
    {
      icon: <Users className="w-6 h-6 text-sky-400" />,
      title: "Consolidated Role Ecosystem",
      desc: "Designed with distinct operational dashboards. Seamless coordination between Food Donors, NGO shelter admins, Local volunteers, and Beneficiaries."
    },
    {
      icon: <Award className="w-6 h-6 text-amber-400" />,
      title: "Gamified Reputations",
      desc: "Volunteer pilots earn green impact badges, points, and level-ups. Donors receive automated Good Samaritan tax exemption certificates on successful claims."
    }
  ];

  const testimonials = [
    {
      quote: "FoodBridge AI completely streamlined our surplus operations. Instead of discarding premium left-over banquets, the system logs, classifies, and dispatches a cargo pilot in under ten minutes.",
      author: "Chef Marcus Aurelius",
      role: "Grand Imperial Banquets, Gachibowli",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&auto=format&fit=crop&q=80"
    },
    {
      quote: "Before FoodBridge AI, we spent hours calling donors to check for safe leftovers. Now, automated notifications alert us when a matching organic produce batch is cleared for our community kitchen.",
      author: "Sister Clara",
      role: "Director of Hope Shelters, Ameerpet",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80"
    },
    {
      quote: "Navigating my E-Auto through Hyderabad congestion used to be a guessing game. The logistics routing algorithm avoids high-traffic bottlenecks in Secunderabad, preserving ice-creams easily.",
      author: "Sarah Jenkins",
      role: "Certified Green Cargo Volunteer Pilot",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
    }
  ];

  const faqList = [
    { q: "Is FoodBridge AI free for NGOs and shelters?", a: "Yes, completely. Our platform operates on open-collaboration principles. Funding is subsidized via corporate donor sponsorships and environmental carbon carbon-offset grants." },
    { q: "How do you guarantee food safety and quality guidelines?", a: "Each logged donation undergoes rapid AI safety triage assessing storage temperature and freshness window. Reject-triggers automatically flag high-risk spoiled items instantly." },
    { q: "Where can volunteer logistics pilots operate in Hyderabad?", a: "We have active community hubs across Hitech City, Ameerpet, Secunderabad, Jubilee Hills, and Banjara Hills, expanding weekly throughout Telangana." }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Toast banner nested inside landing page */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-850 border border-slate-750 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-200">{toast}</span>
        </div>
      )}

      {/* Modern High-Contrast Decorative grid and glows */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-40 left-10 w-72 h-72 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-96 right-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Floating Header */}
      <header className="sticky top-0 z-40 bg-slate-900/85 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleScrollToSection("hero")}>
            <div className="bg-gradient-to-tr from-emerald-500 to-teal-600 p-2 rounded-xl text-white">
              <Bot className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg font-display tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
              FoodBridge AI
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <button onClick={() => handleScrollToSection("about")} className="hover:text-emerald-400 transition-colors cursor-pointer">About</button>
            <button onClick={() => handleScrollToSection("how-it-works")} className="hover:text-emerald-400 transition-colors cursor-pointer">How It Works</button>
            <button onClick={() => handleScrollToSection("features")} className="hover:text-emerald-400 transition-colors cursor-pointer">Features</button>
            <button onClick={() => handleScrollToSection("stats")} className="hover:text-emerald-400 transition-colors cursor-pointer">Impact</button>
            <button onClick={() => handleScrollToSection("testimonials")} className="hover:text-emerald-400 transition-colors cursor-pointer">Testimonials</button>
            <button onClick={() => handleScrollToSection("contact")} className="hover:text-emerald-400 transition-colors cursor-pointer">Contact</button>
          </nav>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                <img 
                  src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60"} 
                  alt="Avatar" 
                  className="w-5 h-5 rounded-full ring-1 ring-emerald-500" 
                />
                <span className="text-[10px] font-bold hidden sm:inline text-slate-300">{currentUser.name}</span>
                <button 
                  onClick={() => onNavigateToTab("Dashboard")}
                  className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Dashboard <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => onNavigateToAuth("login")}
                  className="text-xs font-semibold text-slate-200 hover:text-white px-3 py-1.5 transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button 
                  onClick={() => onNavigateToAuth("register")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-900/20 flex items-center gap-1 cursor-pointer"
                >
                  Register
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Empowering Hyderabad Surplus Food Logistics
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-display text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            An Autonomous <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 bg-clip-text text-transparent">Multi-Agent Bridge</span> Between Excess & Need
          </h1>
          
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Eliminate operational food wastage. FoodBridge AI dynamically connects banquets, hotels, and supermarkets with local community shelters. Fast, certified, traceably green.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            {currentUser ? (
              <button 
                onClick={() => onNavigateToTab("Dashboard")}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-sm font-bold text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-900/30 cursor-pointer"
              >
                Go to Operational Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button 
                  onClick={() => onNavigateToAuth("register")}
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-sm font-bold text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-900/30 cursor-pointer"
                >
                  Claim & Donate Food Now
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onNavigateToAuth("login")}
                  className="w-full sm:w-auto bg-slate-800 hover:bg-slate-755 text-sm font-semibold text-slate-200 px-8 py-4 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Log In directly 
                </button>
              </>
            )}
          </div>
        </div>

        {/* Elegant Dashboard/Map Mockup representation inside Hero */}
        <div className="max-w-5xl mx-auto mt-12 bg-slate-850/80 border border-slate-800 rounded-3xl p-3 shadow-2xl relative">
          <div className="absolute -top-3 left-6 bg-slate-800 px-3 py-1 rounded-full text-[9px] font-mono text-emerald-400 border border-slate-750 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            COORDINATOR SYSTEM ACTIVE • TELANGANA HYDERABAD HUB
          </div>
          <div className="bg-slate-900 rounded-2xl overflow-hidden aspect-video relative flex flex-col md:flex-row shadow-inner min-h-[300px]">
            {/* Left sidebar simulator */}
            <div className="w-full md:w-64 border-r border-slate-850 p-4 space-y-4 flex flex-col justify-between bg-slate-950/45">
              <div className="space-y-3">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AI AGENTS STANDBY</div>
                <div className="flex items-center gap-2.5 p-2 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-slate-300">Donor Safety Agent</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 bg-teal-500/5 rounded-xl border border-teal-500/10">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                  <span className="text-xs font-semibold text-slate-300">Logistics Routing Agent</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 bg-sky-500/5 rounded-xl border border-sky-500/10">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  <span className="text-xs font-semibold text-slate-300">NGO Matchmaster Agent</span>
                </div>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <div className="text-[9px] font-bold text-slate-500">AUTONOMOUS STATUS</div>
                <div className="text-[11px] font-bold text-emerald-400">100% DISPATCH CAPACITY</div>
              </div>
            </div>

            {/* Right side Map Simulator */}
            <div className="flex-1 relative flex flex-col bg-slate-900 p-4 justify-between">
              {/* Map Canvas Visual Mockup */}
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="z-10 flex justify-between items-start">
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono">ACTIVE DELIVERY HUB:</div>
                  <div className="text-sm font-bold text-white flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    Gachibowli banquets → Ameerpet Shelter
                  </div>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono px-2 py-1 rounded-md">
                  ETA 18 MINS
                </span>
              </div>

              {/* Graphical timeline mockup */}
              <div className="z-10 bg-slate-950/80 border border-slate-850 p-4 rounded-xl space-y-3">
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>DISPATCH CHRONOLOGY</span>
                  <span className="text-emerald-400">OPTIMIZED ROUTE GENERATED</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-[9px] font-semibold text-slate-300">
                  <div className="p-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md">1. Smart Ingest</div>
                  <div className="p-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md">2. Carbon Assessment</div>
                  <div className="p-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md">3. NGO Match</div>
                  <div className="p-1 bg-teal-500/20 border border-teal-500/30 rounded-md animate-pulse">4. Courier Transit</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-950 border-y border-slate-850 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest flex items-center justify-center gap-1">
            <Leaf className="w-4 h-4" /> ABOUT FOODBRIDGE AI
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-display">
            A Collaborative Digital Shield Against Starvation & Carbon Emissions
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed text-left sm:text-center">
            Every day throughout Telangana, commercial banquets, corporate hotels, and local bakeries produce surplus edible proteins, grains, and fresh produce. Simultaneously, dedicated regional community shelters work tirelessly to distribute nourishing meals to the vulnerable. 
          </p>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed text-left sm:text-center">
            Our autonomous platform utilizes **server-side Gemini deep learning integrations** to translate natural voice notes, physical photographs, or raw logs into structured, safe food donations. We bypass standard coordination lag, sending instant E-Auto courier dispatch nodes directly to donors to route surplus ingredients where they can preserve lives, not rot in dumpsters.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 border-b border-slate-850">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-2 mb-16">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">TRANSPARENT SYSTEM ARCHITECTURE</span>
            <h2 className="text-3xl font-bold tracking-tight text-white font-display">How FoodBridge AI Operates</h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">Four transparent steps linking surplus commercial culinary supplies to high-urgency shelters.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: "01", title: "Instant Logger Ingestion", body: "Donors upload high-resolution food photo or a 5-second voice description." },
              { num: "02", title: "Automated Safety Triage", body: "Server algorithms classify category lists, safety expiry threshold guidelines, and CO2 offset weights." },
              { num: "03", title: "Strategic NGO Matchmaking", body: "High-urgency local shelters are immediately matched or recommended by location and capacity criteria." },
              { num: "04", title: "Prompt Fleet Dispatch", body: "Local volunteer green pilots and carbon auto operators receive turn-by-turn route optimizations." }
            ].map((step, sidx) => (
              <div key={sidx} className="bg-slate-850 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                <div className="absolute top-2 right-4 text-5xl font-black text-slate-800 select-none group-hover:text-emerald-500/5 transition-colors">
                  {step.num}
                </div>
                <h3 className="text-sm font-bold text-white mb-2 pt-4 relative z-10">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed relative z-10">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950 border-b border-slate-850">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-2 mb-16">
            <span className="text-xs font-bold text-sky-450 uppercase tracking-widest text-sky-400">ADVANCED CAPABILITIES</span>
            <h2 className="text-3xl font-bold tracking-tight text-white font-display">System Features Engineered to Scale</h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">Providing advanced multi-agent logistics to ordinary volunteers and local kitchen workers alike.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, fidx) => (
              <div key={fidx} className="bg-slate-900 border border-slate-800/80 p-6 rounded-3xl hover:border-emerald-500/20 transition-all space-y-4">
                <div className="p-3 bg-slate-850 rounded-2xl w-fit">
                  {feat.icon}
                </div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Statistics Section */}
      <section id="stats" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-2 mb-16">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">VERIFIED HISTORIC ACCUMULATION</span>
            <h2 className="text-3xl font-bold tracking-tight text-white font-display">The Hyderabad Food Saving Impact</h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">Real numbers representing daily carbon savings and community nutrition support.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((st, sidx) => (
              <div key={sidx} className="bg-slate-850 border border-slate-800/80 rounded-2xl p-6 text-center space-y-2 hover:border-emerald-500/30 transition-all">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-display tracking-tight">{st.value}</div>
                <div className="text-xs font-bold text-white">{st.label}</div>
                <div className="text-[10px] text-slate-400 leading-snug">{st.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950 border-t border-slate-850">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-2 mb-16">
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">COMMUNITY VOICES</span>
            <h2 className="text-3xl font-bold tracking-tight text-white font-display">Endorsed by Partners on the Ground</h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">Read testimony from restaurant chefs, humanitarian shelter admins, and delivery team members.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((test, tidx) => (
              <div key={tidx} className="bg-slate-900 border border-slate-850 p-6 rounded-3xl relative flex flex-col justify-between hover:border-teal-500/20 transition-all">
                <div className="text-xs text-slate-350 italic leading-relaxed mb-6">
                  "{test.quote}"
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-850/60">
                  <img src={test.avatar} alt={test.author} className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/20" />
                  <div>
                    <div className="text-xs font-bold text-white">{test.author}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{test.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions FAQ Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 border-t border-slate-850">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider font-display">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-400">Clear replies regarding platform capabilities, onboarding processes, and operations.</p>
          </div>

          <div className="space-y-4">
            {faqList.map((faq, fidx) => (
              <div key={fidx} className="p-5 bg-slate-850 border border-slate-800 rounded-2xl">
                <h3 className="text-xs font-bold text-slate-150 uppercase tracking-wider text-emerald-450 mb-2 flex items-center gap-1">
                  <HelpCircle className="w-4 h-4 text-emerald-400" />
                  {faq.q}
                </h3>
                <p className="text-xs text-slate-450 text-slate-400 leading-relaxed pl-5">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950 border-t border-slate-850 relative">
        <div className="max-w-xl mx-auto">
          <div className="bg-slate-900/45 border border-slate-850/80 hover:border-emerald-500/10 p-8 rounded-3xl space-y-6 shadow-2xl relative z-10 backdrop-blur-md">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">GET REGISTERED • SECURE IDENTITY CONNECTED</span>
              <h2 className="text-2xl font-bold text-white font-display">Contact FoodBridge AI Dispatch</h2>
              <p className="text-xs text-slate-400">Submit an inquiry on behalf of a restaurant chain, franchise, corporate hotel, or local kitchen hub.</p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Full Human Name</label>
                <input 
                  type="text" 
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Captain Jonathan Vance"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Authorized Email</label>
                <input 
                  type="email" 
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="e.g. jvance@telanganashield.org"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Message / Inquiry Details</label>
                <textarea 
                  rows={3}
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  placeholder="Describe your approximate surplus food volume or NGO shelter needs..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Transmitting Feed..." : "Inquire with AI Logistics squad"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-8 bg-slate-950 border-t border-slate-900 text-center text-[10px] text-slate-500 font-semibold uppercase tracking-widest">
        <span>© 2026 FoodBridge AI Autonomous Framework • Telangana Hyderabad Network</span>
      </footer>
    </div>
  );
}
