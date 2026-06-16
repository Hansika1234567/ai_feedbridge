/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  MapPin, 
  Truck, 
  HeartHandshake, 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  Clock, 
  Utensils, 
  Users, 
  Send, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  X,
  User,
  LogOut,
  Mic,
  MicOff,
  Upload,
  CheckCircle,
  Plus,
  Home,
  Compass,
  Bell,
  History,
  Phone,
  ShieldCheck,
  Award,
  Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Donation, NGO, Delivery, ChatMessage, DashboardMetrics, UserProfile } from "./types";
import AuthInterface from "./components/AuthInterface";
import LandingPage from "./components/LandingPage";
import DonorPortal from "./components/DonorPortal";
import NgoPortal from "./components/NgoPortal";
import VolunteerPortal from "./components/VolunteerPortal";
import BeneficiaryPortal from "./components/BeneficiaryPortal";
import SuperAdminPortal from "./components/SuperAdminPortal";

// Simulated Photo presets matching actual backend values
const PHOTO_PRESETS = [
  {
    id: "photo-biryani",
    label: "🍛 Biryani Rice Crate",
    url: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=80",
    desc: "15 kg of delicious paneer biryani from banquets, cooked 2 hours ago. Safe and hot stored.",
    expectedResult: {
      foodType: "Fresh Banquets Paneer Biryani Rice",
      quantity: 15,
      suitabilityStatus: "Approved",
      expiryHours: 6,
      classificationStr: "Cooked Starch & Veg Paneer (Hot Staple)",
      safetyScore: "98% (Premium Freshness)",
      cautionNote: "Contains dairy paneer. Distribute in thermal containers immediately.",
      carbonOffset: 64.5
    }
  },
  {
    id: "photo-samosa",
    label: "🥟 Warm Potato Samosas",
    url: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=80",
    desc: "40 pieces of clean vegetarian samosas from gathering event. Low perishable risk.",
    expectedResult: {
      foodType: "Crisp Vegetarian Fry Samosas",
      quantity: 8,
      suitabilityStatus: "Approved",
      expiryHours: 12,
      classificationStr: "Fried Appetizers (Dry Shelf-Stable)",
      safetyScore: "95% (Excellent Dry Integrity)",
      cautionNote: "Zero dairy or cooked meat. Highly resilient shelf life.",
      carbonOffset: 20
    }
  },
  {
    id: "photo-veg",
    label: "🥦 Fresh Vegetables",
    url: "https://images.unsplash.com/photo-1557800636-894a64c1696f?w=500&auto=format&fit=crop&q=80",
    desc: "Loose organic bell peppers, carrots and lettuce leaves from cold cellars.",
    expectedResult: {
      foodType: "Cold-Room Organic Vegetables",
      quantity: 22,
      suitabilityStatus: "Approved",
      expiryHours: 48,
      classificationStr: "Raw Produce & Greens (Cold chain recommended)",
      safetyScore: "100% (High Soil Freshness)",
      cautionNote: "Uncooked whole produce. Needs basic washing prior to eating.",
      carbonOffset: 46.2
    }
  },
  {
    id: "photo-spoiled",
    label: "❌ Spoiled Acidic Curry",
    url: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=500&auto=format&fit=crop&q=80",
    desc: "Fermented lentils soup with light grey mold layer on surface cooked 24h ago.",
    expectedResult: {
      foodType: "Fermented Lentils Curry",
      quantity: 6,
      suitabilityStatus: "Rejected",
      expiryHours: 0,
      classificationStr: "Spoiled Acidic Stew",
      safetyScore: "12% (CRITICAL AMBIENT SPOILAGE DETECTED)",
      cautionNote: "Bacteria proliferation detected visually. Unfit for distribution! Reject to landfill garbage.",
      carbonOffset: 0
    }
  }
];

// Multilingual speech simulations
const SPEECH_SIMULATION_PRESETS = {
  English: [
    { text: "I have 30 meals of steamed basmati rice and dal curry left from dinner hall in Jubilee Hills, Hyderabad." },
    { text: "Wedding food surplus! 50 plates of vegetable pulao and samosas prepared 1 hour ago in Banjara Hills, Hyderabad." },
    { text: "We have 10 kg of freshly baked white loaves of bread, shelf stable for 48 hours in Madhapur, Telangana." }
  ],
  Hindi: [
    { text: "Mere paas shadi ka 40 kg khana bacha hai – chole bhature aur dal. Charminar ke paas bilkul fresh hai, abhi pack kiya hai." },
    { text: "Hotel me 15 kg paneer sabji bachi hai Ameerpet me, kripya kisi ashaay ashram me bhej dijiye." },
    { text: "Dukan band hone ke baad 10 kg taaza kheer aur roti bachi hai. Secunderabad me pickup ho sakta hai." }
  ],
  Telugu: [
    { text: "Na daggara kalyana mandapam lo 30 kg safe paneer biryani bachindi. Chala vedi gaa ready ga undi Gachibowli deggara." },
    { text: "Maa daggara 15 kgs fresh vegetables vunnayi. Begumpet deggara delivery dispatch kavali." },
    { text: "Hotel nundi 20 kgs cooked white rice vundi, evaraina help chesthe immediate ga Kukatpally nundi deliver avuthundi." }
  ]
};

// Simulated pre-defined notifications for a real-world feel
const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    time: "2 mins ago",
    title: "🚴 Volunteer Ravi matched your Biryani",
    text: "Ravi Kumar (Bike) has pledged to deliver 25 kg paneer biryani to Hope Community Shelter in Ameerpet, Hyderabad.",
    read: false,
    tag: "matches"
  },
  {
    id: "notif-2",
    time: "25 mins ago",
    title: "🚨 Emergency Flood Triage Active",
    text: "Amberpet & Chaderghat shelters need primary immediate dry food distribution due to Musi River high levels.",
    read: false,
    tag: "emergency"
  },
  {
    id: "notif-3",
    time: "2 hours ago",
    title: "💚 Sisters Clara completed delivery",
    text: "Your previous donation of 12 kg pasta has reached JNTU Kukatpally shelter and fed 24 happy souls!",
    read: true,
    tag: "delivery"
  }
];

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem("facebook_ai_auth_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Bottom Navigation tabs: "home" | "dashboard" | "nearby" | "notifications" | "history" | "profile"
  const [activeTab, setActiveTab] = useState<"home" | "dashboard" | "nearby" | "notifications" | "history" | "profile">("home");

  // Auth screen state toggled from Landing Page: "login" | "register" | null
  const [showAuth, setShowAuth] = useState<"login" | "register" | null>(null);

  // Interaction Flow Controls (Modal/Bottom Sheet toggles)
  const [activeFlow, setActiveFlow] = useState<null | "donate" | "request" | "volunteer" | "voice" | "photo" | "nearby" | "emergency"> (null);

  // Global Central Entity States
  const [donations, setDonations] = useState<Donation[]>([]);
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalSavedKg: 120,
    totalPeopleServed: 240,
    totalCo2Saved: 310,
    activeDonors: 14,
    activeNgos: 8,
    activeVolunteers: 12
  });

  // Emergency Mode states
  const [isDisasterMode, setIsDisasterMode] = useState<boolean>(true);
  const [disasterSlogan, setDisasterSlogan] = useState<string>("🚨 FLOOD EMERGENCY IN HYDERABAD: Musi River water levels rising near Amberpet & Chaderghat. Priority food distribution active for affected shelters.");

  // Multilingual voice flow states
  const [selectedLanguage, setSelectedLanguage] = useState<"English" | "Hindi" | "Telugu">("English");
  const [isListeningSpeech, setIsListeningSpeech] = useState<boolean>(false);
  const [voiceTranscriptResult, setVoiceTranscriptResult] = useState<string>("");
  const [isAiProcessingVoice, setIsAiProcessingVoice] = useState<boolean>(false);

  // Photo Scan flow states
  const [selectedPhoto, setSelectedPhoto] = useState<typeof PHOTO_PRESETS[0] | null>(null);
  const [isScanningPhoto, setIsScanningPhoto] = useState<boolean>(false);
  const [scannedResult, setScannedResult] = useState<any | null>(null);

  // Manual Donate form fields
  const [manualFoodType, setManualFoodType] = useState("");
  const [manualQuantity, setManualQuantity] = useState("");
  const [manualExpiryHours, setManualExpiryHours] = useState("6");
  const [manualLocation, setManualLocation] = useState("");
  const [isSubmittingDonation, setIsSubmittingDonation] = useState(false);

  // Request Food form fields
  const [requestPeople, setRequestPeople] = useState("");
  const [requestLocation, setRequestLocation] = useState("");
  const [requestNotes, setRequestNotes] = useState("");
  const [requestUrgency, setRequestUrgency] = useState<"Medium" | "High" | "Critical">("High");
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  // Volunteer driver focus states (Uber Delivery style)
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);
  const [isCompletingDelivery, setIsCompletingDelivery] = useState(false);

  // Feedbacks
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Initial Boot up fetch
  useEffect(() => {
    refreshAllData();
  }, []);

  const refreshAllData = async () => {
    try {
      const [resDonations, resNgos, resDeliveries, resAnalytics] = await Promise.all([
        fetch("/api/donations").then(r => r.json()),
        fetch("/api/ngos").then(r => r.json()),
        fetch("/api/deliveries").then(r => r.json()),
        fetch("/api/analytics").then(r => r.json())
      ]);

      if (resDonations.donations) setDonations(resDonations.donations);
      if (resNgos.ngos) setNgos(resNgos.ngos);
      if (resDeliveries.deliveries) setDeliveries(resDeliveries.deliveries);
      
      if (resAnalytics.metrics) {
        setMetrics(resAnalytics.metrics);
      }
    } catch (e) {
      console.error("Error synchronizing central databases:", e);
    }
  };

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => setSuccessToast(null), 4500);
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem("facebook_ai_auth_user", JSON.stringify(user));
    showToast(`Welcome back, ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("facebook_ai_auth_user");
    showToast("Logged out safely.");
  };

  // Switch virtual roles quickly on the fly to test flows
  const simulateRoleSwitch = (role: UserProfile["role"]) => {
    if (!currentUser) return;
    const avatars = {
      "Super Admin": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
      "Food Donor": "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=120&auto=format&fit=crop&q=80",
      "NGO Admin": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
      "Volunteer": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
      "Beneficiary/Shelter": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
    };
    const updated = {
      ...currentUser,
      role: role,
      avatarUrl: avatars[role] || currentUser.avatarUrl
    };
    setCurrentUser(updated);
    localStorage.setItem("facebook_ai_auth_user", JSON.stringify(updated));
    showToast(`Switched back-end viewpoint: Now simulation as a ${role}`);
  };

  // HTML5/WebSpeech or fallback preset click for Voice Input
  const triggerVoiceCapture = () => {
    setIsListeningSpeech(true);
    setVoiceTranscriptResult("");
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRec) {
      // Simulate real-time vocal ingestion fallback
      setTimeout(() => {
        const list = SPEECH_SIMULATION_PRESETS[selectedLanguage];
        const randomItem = list[Math.floor(Math.random() * list.length)].text;
        setVoiceTranscriptResult(randomItem);
        setIsListeningSpeech(false);
        showToast("Speech captured & transcribed instantly!");
      }, 1500);
    } else {
      const rec = new SpeechRec();
      rec.lang = selectedLanguage === "Telugu" ? "te-IN" : selectedLanguage === "Hindi" ? "hi-IN" : "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      rec.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setVoiceTranscriptResult(text);
        showToast("Voice transcribed successfully!");
      };
      rec.onend = () => setIsListeningSpeech(false);
      rec.onerror = () => setIsListeningSpeech(false);
      rec.start();
    }
  };

  // Submit spoken text for smart AI translation
  const submitVoiceForAiClassify = async () => {
    if (!voiceTranscriptResult.trim()) return;
    setIsAiProcessingVoice(true);
    try {
      const res = await fetch("/api/donations/smart-classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          textDescription: voiceTranscriptResult,
          donorName: currentUser?.name || "Civic Donor",
          contact: currentUser?.contact || "+91 9192-3435-00",
          location: currentUser?.location || "Kallam Anji Reddy Colony, Hyderabad, Telangana",
          donorType: "Individual"
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`📬 Success! AI registered ${data.donation.foodType} (${data.donation.quantity} kg).`);
        
        // Add a beautiful custom notification
        const newNotif = {
          id: `notif-${Date.now()}`,
          time: "Just now",
          title: "🍛 AI Food Donation listed",
          text: `Your voice description of "${data.donation.foodType}" (${data.donation.quantity} kg) was successfully classified as suitable!`,
          read: false,
          tag: "matches"
        };
        setNotifications(prev => [newNotif, ...prev]);

        setVoiceTranscriptResult("");
        setActiveFlow(null);
        refreshAllData();
      }
    } catch (e) {
      showToast("Verification failed. Please enter the details manually.");
    } finally {
      setIsAiProcessingVoice(false);
    }
  };

  // Photo click preset simulation
  const handlePhotoPresetScan = (preset: typeof PHOTO_PRESETS[0]) => {
    setIsScanningPhoto(true);
    setSelectedPhoto(preset);
    setScannedResult(null);
    setTimeout(() => {
      setScannedResult(preset.expectedResult);
      setIsScanningPhoto(false);
      showToast("Freshness & safety suitability analyzed!");
    }, 1200);
  };

  // Submit photo preset verified donation to backend
  const commitPhotoPresetDonation = async () => {
    if (!scannedResult || scannedResult.suitabilityStatus !== "Approved") return;
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName: currentUser?.name || "Grand Hospitality",
          donorType: "Hotel",
          contact: currentUser?.contact || "+91 9999-0000-11",
          foodType: scannedResult.foodType,
          quantity: scannedResult.quantity,
          prepTime: "2 hours ago",
          expiryHours: scannedResult.expiryHours,
          location: currentUser?.location || "Gachibowli Circle, Hyderabad, Telangana"
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`🎉 Shared! Loaded "${scannedResult.foodType}" of ${scannedResult.quantity} kg to public lists!`);
        
        const newNotif = {
          id: `notif-${Date.now()}`,
          time: "Just now",
          title: "✨ Premium surplus food listed",
          text: `Photo verification approved ${scannedResult.foodType}. Food is certified safe!`,
          read: false,
          tag: "matches"
        };
        setNotifications(prev => [newNotif, ...prev]);

        setSelectedPhoto(null);
        setScannedResult(null);
        setActiveFlow(null);
        refreshAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Quick Manual Form submit
  const handleManualDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualFoodType || !manualQuantity || !manualLocation) {
      showToast("Please provide food name, quantity, and address!");
      return;
    }
    setIsSubmittingDonation(true);
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName: currentUser?.name || "Local Eatery",
          donorType: "Restaurant",
          contact: currentUser?.contact || "+91 8000-1212-34",
          foodType: manualFoodType,
          quantity: Number(manualQuantity),
          prepTime: "Freshly prepared",
          expiryHours: Number(manualExpiryHours),
          location: manualLocation
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`🍛 Success! Listed ${manualQuantity} kg of ${manualFoodType}.`);
        
        const newNotif = {
          id: `notif-${Date.now()}`,
          time: "Just now",
          title: "🍛 Manual Surplus Food Listed",
          text: `Your listing of ${manualFoodType} is now visible to nearby riders and shelters.`,
          read: false,
          tag: "matches"
        };
        setNotifications(prev => [newNotif, ...prev]);

        // Reset
        setManualFoodType("");
        setManualQuantity("");
        setManualLocation("");
        setActiveFlow(null);
        refreshAllData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingDonation(false);
    }
  };

  // Quick Request Food submit (Shelter Need)
  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestPeople || !requestLocation) {
      showToast("Please indicate number of people and delivery address!");
      return;
    }
    setIsSubmittingRequest(true);
    try {
      const reqQty = Math.ceil(Number(requestPeople) * 0.5); // Average 0.5kg raw meal per person
      const res = await fetch("/api/ngos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: currentUser?.name || "Hope Kitchen",
          location: requestLocation,
          contact: currentUser?.contact || "+91 7999-5656-77",
          requestedFoodTypes: ["General Cooked Meals", "Baked Staples"],
          quantityRequested: reqQty,
          urgencyLevel: requestUrgency
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`🍽 Request Submitted! Intake voucher created to feed ${requestPeople} people.`);
        
        const newNotif = {
          id: `notif-${Date.now()}`,
          time: "Just now",
          title: "🍲 Fresh Shelter Request listed",
          text: `Intake requested for ${requestPeople} people in ${requestLocation}. Proximity matching active.`,
          read: false,
          tag: "emergency"
        };
        setNotifications(prev => [newNotif, ...prev]);

        setRequestPeople("");
        setRequestLocation("");
        setRequestNotes("");
        setActiveFlow(null);
        refreshAllData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  // 1-Click claim and match dispatch rider and direct them on routing
  const claimDonationInstantly = async (donationId: string, ngoId: string) => {
    try {
      const res = await fetch("/api/deliveries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donationId,
          ngoId,
          volunteerName: currentUser?.role === "Volunteer" ? currentUser.name : "Kavitha Sharma (E-Auto Pilot)",
          vehicleType: "Motorcycle"
        })
      });
      const data = await res.json();
      if (data.success) {
        // Run optimized routing check
        await fetch("/api/deliveries/optimize-route", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ donationId, ngoId, vehicleType: "Motorcycle" })
        });
        showToast("💖 Pledged! Transit partner dispatch initialized. Route instructions updated!");
        
        const newNotif = {
          id: `notif-${Date.now()}`,
          time: "Just now",
          title: "🚚 Transit Dispatch En-Route",
          text: `Rider assigned for carrying food to the beneficiary shelter. ETA coordinates updated to 25 mins.`,
          read: false,
          tag: "delivery"
        };
        setNotifications(prev => [newNotif, ...prev]);

        refreshAllData();
        // Automatically view nearby or delivery pilot dashboard if volunteer role
        if (currentUser?.role === "Volunteer") {
          setSelectedDeliveryId(data.delivery.id);
          setActiveFlow("volunteer");
        } else {
          setActiveFlow(null);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Progress Rider Status through transit workflow
  const stepRiderStatus = async (delivery: Delivery, nextStatus: Delivery["status"]) => {
    setIsCompletingDelivery(true);
    setTimeout(() => {
      // update state
      setDeliveries(prev => prev.map(d => d.id === delivery.id ? { ...d, status: nextStatus } : d));
      setIsCompletingDelivery(false);
      showToast(`Courier status advanced to "${nextStatus}" successfully!`);
      
      const newNotif = {
        id: `notif-${Date.now()}`,
        time: "Just now",
        title: `🚚 Rider transit: ${nextStatus}`,
        text: `Volunteer marked delivery ID ${delivery.id} as ${nextStatus}. Thanks for your direct service!`,
        read: false,
        tag: "delivery"
      };
      setNotifications(prev => [newNotif, ...prev]);

      if (nextStatus === "Delivered") {
        // reward point stimulation
        if (currentUser) {
          currentUser.points = (currentUser.points || 0) + 150;
          localStorage.setItem("facebook_ai_auth_user", JSON.stringify(currentUser));
        }
        showToast("🌟 Job completed! +150 Impact Points awarded to your driver profile!");
        setSelectedDeliveryId(null);
        setActiveFlow(null);
        refreshAllData();
      }
    }, 1000);
  };

  const addManualLeftoversPledge = async (don: any) => {
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName: currentUser?.name || "Grand Hospitality",
          donorType: don.donorType || "Restaurant",
          contact: currentUser?.contact || "+91 9999-0000-11",
          foodType: don.foodType,
          quantity: don.quantity,
          prepTime: "Freshly prepared",
          expiryHours: don.expiryHours || 6,
          location: don.location || currentUser?.location || "Gachibowli, Hyderabad"
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`🎉 Shared! Loaded "${don.foodType}" of ${don.quantity} kg to public lists!`);
        refreshAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const classifySmartLeftoversDescription = async (desc: string): Promise<any> => {
    try {
      const res = await fetch("/api/donations/smart-classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          textDescription: desc,
          donorName: currentUser?.name || "Civic Donor",
          contact: currentUser?.contact || "+91 9192-3435-00",
          location: currentUser?.location || "Kallam Anji Reddy Colony, Hyderabad, Telangana",
          donorType: "Individual"
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`📬 Classified: ${data.donation.foodType}`);
        refreshAllData();
        return data.donation;
      }
    } catch (e) {
      showToast("Verification failed. Please enter the details manually.");
    }
  };

  const addNgoDemandRequest = async (demand: any) => {
    try {
      const res = await fetch("/api/ngos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: demand.name,
          location: demand.location,
          quantityRequested: demand.quantityRequested,
          urgencyLevel: demand.urgencyLevel,
          requestedFoodTypes: demand.requestedFoodTypes
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`🍲 NGO demand listed: ${demand.name}`);
        refreshAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const advanceDeliveryStatus = async (id: string, nextStatus: Delivery["status"]) => {
    const delivery = deliveries.find(d => d.id === id);
    if (delivery) {
      stepRiderStatus(delivery, nextStatus);
    }
  };

  // Render auth interface if offline/unauthenticated
  if (!currentUser) {
    if (showAuth) {
      return (
        <AuthInterface 
          onLoginSuccess={(user) => {
            handleLoginSuccess(user);
            setShowAuth(null);
            setActiveTab("dashboard");
          }} 
          onCancel={() => setShowAuth(null)}
          initialMode={showAuth}
        />
      );
    }
    return (
      <LandingPage 
        onNavigateToAuth={(mode) => setShowAuth(mode)} 
        currentUser={currentUser} 
        onNavigateToTab={(tab) => {
          setActiveTab(tab as any);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-neutral-900 font-sans flex flex-col pb-24 md:pb-6 selection:bg-[#10B981] selection:text-white relative">
      
      {/* GLOBAL TOAST TELEMETRY NOISE-FREE */}
      <AnimatePresence>
        {successToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-24 right-4 left-4 md:left-auto md:right-8 z-50 bg-[#161615] text-white px-5 py-4 rounded-3xl shadow-2xl flex items-center justify-between gap-4 max-w-sm border border-neutral-800"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center font-bold text-lg">💡</span>
              <div>
                <p className="text-xs font-semibold text-neutral-150">FoodBridge Update</p>
                <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">{successToast}</p>
              </div>
            </div>
            <button onClick={() => setSuccessToast(null)} className="text-neutral-500 hover:text-white shrink-0">
              <X className="w-4.5 h-4.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DISASTER PANIC BUTTON TRIGGER OVERLAY IN HOME HEADER */}
      {isDisasterMode && (
        <div className="bg-[#EF4444] text-white text-xs py-2.5 px-4 font-semibold flex items-center justify-between gap-2 shadow-lg relative z-40 animate-pulse select-none md:rounded-b-2xl max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-white fill-white/10" />
            <span className="text-[11px] tracking-tight">{disasterSlogan}</span>
          </div>
          <button 
            onClick={() => setIsDisasterMode(false)} 
            className="text-[9px] bg-black/20 hover:bg-black/30 font-bold uppercase py-1 px-2.5 rounded-full text-white cursor-pointer transition-colors"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* TOP HEADER MENU */}
      <header className="bg-white border-b border-stone-100 py-4 px-6 sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          
          <div className="flex items-center gap-3">
            <div className="bg-[#10B981] text-white p-2 rounded-2xl shadow-sm">
              <HeartHandshake className="w-5.5 h-5.5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-neutral-900 tracking-tight flex items-center gap-1.5 leading-none">
                FoodBridge AI
                <span className="bg-emerald-50 text-emerald-700 text-[9px] px-2 py-0.5 rounded-full font-black uppercase">COMMUNITY SAFE</span>
              </h1>
              <p className="text-[10px] text-neutral-400 mt-0.5">Share leftover hospitality, zero delay logistics</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick mode indicators */}
            <div className="text-right hidden sm:block">
              <p className="text-[11px] font-bold text-neutral-900 leading-none">{currentUser.name}</p>
              <div className="flex items-center gap-1 mt-0.5 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                <span className="text-[9px] text-[#10B981] font-bold uppercase">{currentUser.role}</span>
              </div>
            </div>
            <img src={currentUser.avatarUrl} alt="Avatar user" className="w-8.5 h-8.5 rounded-full object-cover border border-stone-200" />
            <button 
              onClick={handleLogout} 
              className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-xl transition-colors shrink-0 cursor-pointer"
              title="Logout Profile"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* MIDDLE BODY: CONFLICT-FREE WORK AREA */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-8">
        
        {/* TAB: Secure Role-Based Dashboard Portal */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-fade-in text-neutral-900">
            {(currentUser.role === "Food Donor" || currentUser.role === "Donor") && (
              <DonorPortal 
                donations={donations} 
                onAddManualDonation={addManualLeftoversPledge} 
                onClassifySmartDonation={classifySmartLeftoversDescription} 
              />
            )}
            {(currentUser.role === "NGO Admin" || currentUser.role === "NGO") && (
              <NgoPortal 
                donations={donations} 
                ngos={ngos} 
                deliveries={deliveries} 
                onRefreshAll={refreshAllData} 
              />
            )}
            {currentUser.role === "Volunteer" && (
              <VolunteerPortal 
                deliveries={deliveries} 
                donations={donations} 
                ngos={ngos} 
                onUpdateDeliveryStatus={advanceDeliveryStatus} 
                onRefreshAllData={refreshAllData} 
              />
            )}
            {(currentUser.role === "Beneficiary/Shelter" || currentUser.role === "Beneficiary") && (
              <BeneficiaryPortal 
                deliveries={deliveries} 
                donations={donations} 
                onAddNgoDemand={addNgoDemandRequest} 
              />
            )}
            {(currentUser.role === "Super Admin" || currentUser.role === "Admin") && (
              <SuperAdminPortal 
                donations={donations} 
                ngos={ngos} 
                deliveries={deliveries} 
                onRefresh={refreshAllData} 
              />
            )}
          </div>
        )}

        {/* TAB 1: 🏠 DELIGHTFUL HOME SCREEN */}
        {activeTab === "home" && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Warm Human Welcome Segment */}
            <div className="bg-gradient-to-br from-[#10B981] to-[#047857] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 p-6 opacity-10 pointer-events-none">
                <HeartHandshake className="w-44 h-44 text-white" />
              </div>
              <div className="relative z-10 space-y-1.5 max-w-xl">
                <div className="bg-white/10 backdrop-blur-xs text-[10px] text-emerald-100 font-extrabold uppercase px-2 py-0.5 rounded-lg inline-flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  Local Hero: {currentUser.points || 410} Impact Points
                </div>
                <h2 className="text-lg md:text-2xl font-bold tracking-tight">How would you like to help today, {currentUser.name.split(" ")[0]}?</h2>
                <p className="text-xs text-emerald-100 leading-relaxed font-light">
                  Our friendly system connects you directly with neighborhood donation spots and active helper pilots. Let's minimize food waste together!
                </p>
              </div>
            </div>

            {/* REAL-TIME SHELTER DEMAND TICKER */}
            {ngos.length > 0 && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl shrink-0">🍲</span>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-amber-700 font-bold bg-amber-100 px-1.5 py-0.5 rounded">URGENT SHELTER NEED</span>
                    <p className="text-xs font-bold text-neutral-850 mt-1">
                      "{ngos[0].name}" needs food for {Math.ceil(ngos[0].quantityRequested * 2)} people at {ngos[0].location.split(",")[0]}.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    // Match the first unmatched donation with this urgent shelter
                    const unmatchedDon = donations.find(d => d.matchingStatus === "Unmatched" && d.suitabilityStatus === "Approved");
                    if (unmatchedDon) {
                      claimDonationInstantly(unmatchedDon.id, ngos[0].id);
                    } else {
                      setActiveFlow("donate");
                      showToast("No active leftovers listed. Please fill the quick donation form to help!");
                    }
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] uppercase py-2 px-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                >
                  Fulfill Now
                </button>
              </div>
            )}

            {/* NEW TARGET HOME SCREEN: EXCLUSIVELY THE 7 DELIGHTFUL CARDS */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Main Quick Actions</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                
                {/* 1. 🍛 DONATE SURPLUS FOOD CARD */}
                <button 
                  onClick={() => setActiveFlow("donate")}
                  className="bg-white hover:bg-neutral-50 border border-stone-200 rounded-3xl p-5 text-left transition-all hover:shadow-md cursor-pointer group hover:border-[#10B981] relative overflow-hidden"
                >
                  <div className="text-3xl bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105">🍛</div>
                  <h4 className="font-bold text-sm text-neutral-950 group-hover:text-[#047857] flex items-center gap-1.5">
                    Donate Food
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-1 transition-transform" />
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-2 font-normal leading-relaxed">Have leftovers from dinner, restaurants, or wedding buffets? List it here in seconds!</p>
                </button>

                {/* 2. 🍽 REQUEST SURPLUS FOOD CARD */}
                <button 
                  onClick={() => setActiveFlow("request")}
                  className="bg-white hover:bg-neutral-50 border border-stone-200 rounded-3xl p-5 text-left transition-all hover:shadow-md cursor-pointer group hover:border-amber-500 relative"
                >
                  <div className="text-3xl bg-amber-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105">🍽</div>
                  <h4 className="font-bold text-sm text-neutral-950 group-hover:text-amber-700 flex items-center gap-1.5">
                    Request Food
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-1 transition-transform" />
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-2 font-normal leading-relaxed">NGO soup kitchens, homeless shelters, or families in crisis. Request calories instantly.</p>
                </button>

                {/* 3. 🚚 VOLUNTEER DRIVER CARD */}
                <button 
                  onClick={() => setActiveFlow("volunteer")}
                  className="bg-white hover:bg-neutral-50 border border-stone-200 rounded-3xl p-5 text-left transition-all hover:shadow-md cursor-pointer group hover:border-blue-500 relative"
                >
                  <div className="text-3xl bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105">🚚</div>
                  <h4 className="font-bold text-sm text-neutral-950 group-hover:text-blue-700 flex items-center gap-1.5">
                    Volunteer / Delivery
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-1 transition-transform" />
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-2 font-normal leading-relaxed">Help transport fresh listed meals from donors to needy shelters with our Uber-style map.</p>
                </button>

                {/* 4. 🎤 SPEAK DETAILS CARD */}
                <button 
                  onClick={() => setActiveFlow("voice")}
                  className="bg-white hover:bg-neutral-50 border border-stone-200 rounded-3xl p-5 text-left transition-all hover:shadow-md cursor-pointer group hover:border-violet-500 relative"
                >
                  <div className="text-3xl bg-violet-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105">🎤</div>
                  <h4 className="font-bold text-sm text-neutral-950 group-hover:text-violet-700 flex items-center gap-1.5">
                    Speak Now
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-1 transition-transform" />
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-2 font-normal leading-relaxed">Voice-first experience. Speak in Telugu, Hindi, or English. Our AI fills out everything!</p>
                </button>

                {/* 5. 📷 UPLOAD FOOD PHOTO CARD */}
                <button 
                  onClick={() => setActiveFlow("photo")}
                  className="bg-white hover:bg-neutral-50 border border-stone-200 rounded-3xl p-5 text-left transition-all hover:shadow-md cursor-pointer group hover:border-teal-500 relative"
                >
                  <div className="text-3xl bg-teal-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105">📷</div>
                  <h4 className="font-bold text-sm text-neutral-950 group-hover:text-teal-700 flex items-center gap-1.5">
                    Upload Food Photo
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-1 transition-transform" />
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-2 font-normal leading-relaxed">Snap a picture from banquet or kitchen to check food freshness and list instantly.</p>
                </button>

                {/* 6. 📍 NEARBY DONATIONS CARD */}
                <button 
                  onClick={() => {
                    setActiveTab("nearby");
                    showToast("Interactive Hyderabad neighborhood map node loaded!");
                  }}
                  className="bg-white hover:bg-neutral-50 border border-stone-200 rounded-3xl p-5 text-left transition-all hover:shadow-md cursor-pointer group hover:border-sky-500 relative"
                >
                  <div className="text-3xl bg-sky-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105">📍</div>
                  <h4 className="font-bold text-sm text-neutral-950 group-hover:text-sky-700 flex items-center gap-1.5">
                    Nearby Donations
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-1 transition-transform" />
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-2 font-normal leading-relaxed">Browse surplus meals currently waiting for collection near you in central Hyderabad districts.</p>
                </button>

                {/* 7. 🚨 EMERGENCY DISASTER HELP CARD */}
                <button 
                  onClick={() => {
                    setIsDisasterMode(!isDisasterMode);
                    showToast(isDisasterMode ? "Canceled active flooding response simulation." : "Enabled Hyderabad flooding emergency prioritization!");
                  }}
                  className={`border rounded-3xl p-5 text-left transition-all hover:shadow-md cursor-pointer group select-none relative ${
                    isDisasterMode 
                      ? "bg-rose-50 border-rose-300 hover:bg-rose-100" 
                      : "bg-white border-stone-200 hover:bg-rose-50 hover:border-rose-300"
                  }`}
                >
                  <div className="text-3xl bg-rose-150 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 animate-bounce">🚨</div>
                  <h4 className="font-bold text-sm text-[#B91C1C] flex items-center gap-1.5">
                    {isDisasterMode ? "Emergency Priority Active" : "Trigger Emergency Help"}
                  </h4>
                  <p className="text-[11px] text-rose-850 mt-2 font-medium leading-relaxed">
                    {isDisasterMode ? "Hyderabad flood relief active. Priority ration routing is prioritizing all regional pickups." : "Unleash rapid flood/storm disaster food triage across Hyderabad shelters."}
                  </p>
                </button>

              </div>
            </div>

            {/* SHORTCUT: NEAREST AVAILABLE MEALS WAITLIST FEED */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Active Leftover Grains ready to pickup</h3>
                <button onClick={() => setActiveTab("nearby")} className="text-xs text-[#10B981] font-bold">See Map View</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {donations.filter(d => d.matchingStatus === "Unmatched" && d.suitabilityStatus === "Approved").slice(0, 4).map((d) => {
                  return (
                    <div key={d.id} className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col justify-between hover:border-neutral-400 transition-colors">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-mono bg-stone-100 text-neutral-600 px-2 py-0.5 rounded font-bold uppercase">{d.donorType} Listing</span>
                          <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Expires in {d.expiryHours}h
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-neutral-900 leading-tight">{d.foodType}</h4>
                          <p className="text-[11px] text-neutral-405 text-neutral-400 mt-1 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                            {d.donorName} – {d.location.split(",")[0]}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-xs font-black text-[#10B981]">{d.quantity} kilograms</span>
                        <button
                          onClick={() => {
                            // Automatically match with first NGO shelter or Hope kitchen
                            const defaultNgoId = ngos[0]?.id || "ngo-1";
                            claimDonationInstantly(d.id, defaultNgoId);
                          }}
                          className="bg-[#10B981] hover:bg-[#059669] text-white text-[10px] font-bold uppercase py-1.5 px-3 rounded-xl transition-all cursor-pointer"
                        >
                          Send Rider to Deliver
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: 📍 LIVE GOOGLE MAPS STYLE NEARBY SPOTTER */}
        {activeTab === "nearby" && (
          <div className="space-y-6 animate-fade-in text-neutral-900">
            <div className="bg-white border border-stone-200 rounded-3xl p-6 space-y-4 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">Neighborhood Leftover Spotter Map</h2>
                <p className="text-xs text-neutral-400">Showing active surplus hot spots (yellow pins) and recipient kitchens (green homes) across Hyderabad's local sectors.</p>
              </div>

              {/* Minimal SVG Interactive Coordinate Map */}
              <div className="relative bg-[#FAF9F5] border border-stone-200 rounded-2xl h-[340px] overflow-hidden flex items-center justify-center select-none shadow-inner">
                {/* Simulated Street grid overlay */}
                <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
                  backgroundImage: "radial-gradient(#10B981 1.2px, transparent 1.2px), radial-gradient(#10B981 1.2px, #FAF9F5 1.2px)",
                  backgroundSize: "24px 24px"
                }} />

                {/* Stylized visual sector dividers */}
                <div className="absolute top-1/3 left-0 right-0 h-[3px] bg-white/60" />
                <div className="absolute top-2/3 left-0 right-0 h-[3px] bg-white/60" />
                <div className="absolute top-0 bottom-0 left-1/3 w-[3px] bg-white/60" />
                <div className="absolute top-0 bottom-0 left-2/3 w-[3px] bg-white/60" />

                {/* Map Labels */}
                <div className="absolute top-4 left-6 text-[9px] font-bold uppercase tracking-wider text-neutral-400">Outer Ring Road (ORR) Highway</div>
                <div className="absolute bottom-4 right-6 text-[9px] font-bold uppercase tracking-wider text-neutral-400">Secunderabad Depot Zone</div>

                {/* Active PINS */}
                {/* NGO Hope Kitchen home node */}
                <div className="absolute top-12 left-10 text-center animate-bounce">
                  <div className="bg-[#047857] text-white p-2.5 rounded-full shadow-lg inline-flex" title="Hope shelter">🏠</div>
                  <span className="block text-[9px] font-bold text-[#047857] mt-1 bg-white/80 px-1 rounded">Hope Kitchen</span>
                </div>

                {/* NGO Community Soup kitchen */}
                <div className="absolute bottom-16 right-16 text-center animate-pulse">
                  <div className="bg-[#047857] text-white p-2.5 rounded-full shadow-lg inline-flex" title="Soup shelter">🏚</div>
                  <span className="block text-[9px] font-bold text-[#047857] mt-1 bg-white/80 px-1 rounded">Beacon Center</span>
                </div>

                {/* Leftover Item Pin A */}
                <div className="absolute top-1/2 left-2/5 text-center">
                  <span className="text-2xl animate-pulse block">🍛</span>
                  <div className="bg-white border rounded-lg p-1.5 shadow-md">
                    <p className="text-[8px] font-black leading-none">Biryani Crate</p>
                    <p className="text-[7px] text-[#10B981] font-bold mt-0.5">15 kg leftovers</p>
                  </div>
                </div>

                {/* Leftover Item Pin B */}
                <div className="absolute top-36 right-36 text-center">
                  <span className="text-2xl animate-pulse block">🥟</span>
                  <div className="bg-white border rounded-lg p-1.5 shadow-md">
                    <p className="text-[8px] font-black leading-none">Veggies/Samosas</p>
                    <p className="text-[7px] text-amber-600 font-bold mt-0.5">Warm, 8 kg</p>
                  </div>
                </div>

                {/* Compass visual helper */}
                <div className="absolute bottom-4 left-4 bg-white p-2 rounded-xl border flex items-center gap-1.5 text-[9px] font-bold text-neutral-600">
                  <span className="animate-spin text-[#10B981]">🧭</span> Map Calibrated GPS OK
                </div>
              </div>

              {/* LIST FEED */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">Unclaimed left-over packages near you:</span>
                
                <div className="space-y-2">
                  {donations.filter(d => d.matchingStatus === "Unmatched" && d.suitabilityStatus === "Approved").length > 0 ? (
                    donations.filter(d => d.matchingStatus === "Unmatched" && d.suitabilityStatus === "Approved").map(d => (
                      <div key={d.id} className="bg-stone-50 border border-stone-200 rounded-2xl p-4.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <h4 className="font-bold text-sm text-neutral-900">{d.foodType}</h4>
                          <p className="text-xs text-neutral-402 text-neutral-500 max-w-md flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                            {d.donorName} at <b>{d.location}</b> (0.8 km away)
                          </p>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto self-end">
                          <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl block shrink-0">{d.quantity} kilograms</span>
                          <button
                            onClick={() => {
                              const defaultNgo = ngos[0] || { id: "ngo-1" };
                              claimDonationInstantly(d.id, defaultNgo.id);
                            }}
                            className="w-full sm:w-auto bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer text-center"
                          >
                            Pledge Delivery
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-neutral-400 bg-stone-50 rounded-2xl">
                      <p className="text-xs">Zero unclaimed leftovers currently listed. Check back in a few minutes!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 🔔 ACTIONS FEED (NOTIFICATIONS) */}
        {activeTab === "notifications" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white border border-stone-200 rounded-3xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Notifications Activity Channel</h2>
                  <p className="text-xs text-neutral-400">Activity on your active donations and nearby safety alerts</p>
                </div>
                <button 
                  onClick={() => {
                    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                    showToast("Marked all alerts as read.");
                  }} 
                  className="text-xs text-[#10B981] font-bold cursor-pointer"
                >
                  Mark all read
                </button>
              </div>

              <div className="space-y-3">
                {notifications.map(n => (
                  <div 
                    key={n.id} 
                    className={`p-4 rounded-2xl border transition-colors flex gap-3.5 relative overflow-hidden ${
                      n.read ? "bg-white border-stone-100 text-neutral-700" : "bg-emerald-50/40 border-emerald-100 text-neutral-900"
                    }`}
                  >
                    {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#10B981]" />}
                    <span className="text-2xl shrink-0">
                      {n.tag === "emergency" ? "🚨" : n.tag === "delivery" ? "🚚" : "✨"}
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs">{n.title}</h4>
                        <span className="text-[9px] text-neutral-400 font-medium">{n.time}</span>
                      </div>
                      <p className="text-xs text-neutral-503 text-neutral-500 leading-relaxed font-normal">{n.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: 📜 SOCIAL COMPLETED LEDGER (HISTORY) */}
        {activeTab === "history" && (
          <div className="space-y-6 animate-fade-in text-neutral-900">
            {/* Simple aggregate math display */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white border border-stone-200 rounded-2xl p-4 text-center space-y-1">
                <span className="text-2xl block">🥗</span>
                <p className="text-base font-black text-neutral-950">{metrics.totalSavedKg} kg</p>
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">Food Saved</p>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-4 text-center space-y-1">
                <span className="text-2xl block">🧑‍🤝‍🧑</span>
                <p className="text-base font-black text-neutral-900">{metrics.totalPeopleServed} plates</p>
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">Meals Shared</p>
              </div>

              <div className="bg-[#10B981]/1 bg-emerald-50 text-[#047857] border border-[#10B981]/2 rounded-2xl p-4 text-center space-y-1">
                <span className="text-2xl block">🍃</span>
                <p className="text-base font-black text-[#047857]">-{metrics.totalCo2Saved} kg</p>
                <p className="text-[10px] text-[#047857]/80 uppercase tracking-widest font-semibold">CO2 Prevented</p>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-3xl p-6 space-y-4">
              <div>
                <h3 className="font-bold text-base">Completed Feed History</h3>
                <p className="text-xs text-neutral-400">Vetted and distributed donation timeline logs</p>
              </div>

              <div className="space-y-3">
                {donations.length > 0 ? (
                  donations.map(d => (
                    <div key={d.id} className="border-b border-stone-100 pb-3 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-neutral-900">{d.foodType} ({d.quantity} kg)</p>
                        <p className="text-neutral-400 text-[10px] mt-0.5">Shared by {d.donorName} at {d.location.split(",")[0]}</p>
                      </div>

                      <div className="text-right">
                        <span className={`inline-block py-1 px-2.5 rounded-full font-bold text-[9px] uppercase ${
                          d.suitabilityStatus === "Approved" ? "bg-emerald-100 text-[#047857]" : "bg-rose-100 text-[#B91C1C]"
                        }`}>
                          ● {d.suitabilityStatus === "Approved" ? "Done" : "Rejected"}
                        </span>
                        <p className="text-[9px] text-[#047857] font-bold mt-1">-{d.carbonFootprintSaved} kg CO2e</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-6 text-xs text-neutral-400">No historic entries recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: 👤 PROFILE & SIMULATOR ACCORDION */}
        {activeTab === "profile" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white border border-stone-200 rounded-3xl p-6 space-y-6">
              
              <div className="flex flex-col sm:flex-row items-center gap-4 border-b pb-6">
                <img src={currentUser.avatarUrl} alt="Avatar profile" className="w-16 h-16 rounded-full object-cover border-2 border-[#10B981]" />
                <div className="text-center sm:text-left space-y-1.5">
                  <h2 className="text-lg font-bold text-neutral-950 flex items-center gap-1.5 justify-center sm:justify-start">
                    {currentUser.name}
                    <span className="bg-[#10B981]/15 text-[#10B981] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                      ⭐ Level 3 Hero
                    </span>
                  </h2>
                  <p className="text-xs text-neutral-400 font-medium">Joined {currentUser.joinedDate} • Registered in {currentUser.location.split(",")[0]}</p>
                  <p className="text-xs text-[#047857] font-mono font-bold leading-normal">Phone: {currentUser.contact}</p>
                </div>
              </div>

              {/* DEMO SWITCH PERSONA ACCORDION - USER FRIENDLY SIMULATOR */}
              <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-5 space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded">EASY TESTING CORNER</span>
                  <p className="text-xs font-bold text-neutral-900">Switch current viewpoint configuration to test all different flows:</p>
                  <p className="text-[11px] text-neutral-500 leading-normal font-normal">
                    This single FoodBridge AI app changes based on who is playing. Select your avatar mode below to instantly toggle special functions:
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { label: "🧑‍🍳 Food Donor", role: "Food Donor" },
                    { label: "🏚 NGO Shelter", role: "NGO Admin" },
                    { label: "🛵 Bike Rider", role: "Volunteer" },
                    { label: "👑 Administrator", role: "Super Admin" },
                  ].map(spec => (
                    <button
                      key={spec.role}
                      onClick={() => simulateRoleSwitch(spec.role as any)}
                      className={`py-2.5 px-3 rounded-xl font-bold border transition-all text-center cursor-pointer ${
                        currentUser.role === spec.role 
                          ? "bg-white text-[#047857] border-[#10B981] shadow-sm scale-102 ring-2 ring-[#10B981]/20" 
                          : "bg-white text-stone-600 hover:text-stone-900 border-stone-200"
                      }`}
                    >
                      {spec.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* STATS BREAKDOWN */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FAF9F5] border border-stone-200 rounded-xl p-4 text-center">
                  <span className="text-xl block">🔥</span>
                  <p className="text-base font-bold text-neutral-900 mt-1">12 days</p>
                  <p className="text-[10px] text-neutral-400 uppercase font-semibold">Active Streak</p>
                </div>

                <div className="bg-[#FAF9F5] border border-stone-200 rounded-xl p-4 text-center">
                  <span className="text-xl block">🌿</span>
                  <p className="text-base font-bold text-[#047857] mt-1">{currentUser.points || 410}</p>
                  <p className="text-[10px] text-neutral-450 text-neutral-400 uppercase font-semibold">Impact score</p>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* RIDER FLYING POPUP INDICATOR (IF PENDING DELIVERY EXISTS AND IN TRANSIT ROLE) */}
      {currentUser.role === "Volunteer" && deliveries.some(d => d.status !== "Delivered") && (
        <div className="fixed bottom-20 right-4 left-4 md:left-auto md:right-8 z-45 bg-[#047857] text-white p-4.5 rounded-3xl shadow-xl flex flex-col gap-2.5 max-w-sm border border-emerald-800">
          <div className="flex items-start justify-between">
            <div className="flex gap-2">
              <span className="text-2xl animate-spin">🛵</span>
              <div>
                <p className="text-xs font-bold leading-normal">You have an active Delivery ride!</p>
                <p className="text-[11px] text-emerald-100 mt-0.5">Route mapping instruction loaded.</p>
              </div>
            </div>
            <button 
              onClick={() => {
                const pending = deliveries.find(d => d.status !== "Delivered");
                if (pending) {
                  setSelectedDeliveryId(pending.id);
                  setActiveFlow("volunteer");
                }
              }} 
              className="text-[9px] bg-white text-[#047857] font-black uppercase tracking-wider py-1 px-2.5 rounded-lg shrink-0 cursor-pointer"
            >
              Open Route
            </button>
          </div>
        </div>
      )}

      {/* OVERLAY FLOW BOTTOM SHEETS / MODALS */}
      <AnimatePresence>
        
        {/* A. 🍛 DONATE SURPLUS FOOD DIALOG OVERLAY */}
        {activeFlow === "donate" && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 space-y-5 shadow-2xl relative max-h-[92vh] overflow-y-auto"
            >
              <button 
                onClick={() => setActiveFlow(null)} 
                className="absolute right-4 top-4 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <div className="text-2xl block">🍛</div>
                <h3 className="text-lg font-black text-neutral-900">Pledge Surplus Calorie</h3>
                <p className="text-xs text-neutral-400 leading-normal">
                  Our AI is standing by to safety audit of your food. Fill out the quick form below:
                </p>
              </div>

              {/* Direct links to voice or picture helper */}
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setActiveFlow("voice")}
                  className="bg-violet-50 text-violet-850 hover:bg-violet-100 p-2.5 rounded-2xl text-[11px] font-bold text-center border border-violet-200 cursor-pointer"
                >
                  🎤 Speak Details
                </button>
                <button 
                  onClick={() => setActiveFlow("photo")}
                  className="bg-teal-50 text-teal-850 hover:bg-teal-100 p-2.5 rounded-2xl text-[11px] font-bold text-center border border-teal-200 cursor-pointer"
                >
                  📷 Upload Food Photo
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-100" /></div>
                <span className="relative flex justify-center text-[9px] uppercase tracking-wider text-neutral-400 bg-white px-2">Or simple details</span>
              </div>

              <form onSubmit={handleManualDonationSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 block">What is the food?</label>
                  <input 
                    type="text" 
                    value={manualFoodType}
                    onChange={(e) => setManualFoodType(e.target.value)}
                    placeholder="e.g. Rice Crate, 30 Samosas, Pasta"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-[#10B981] focus:outline-hidden text-neutral-900"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 block">Quantity (kg)</label>
                    <input 
                      type="number" 
                      value={manualQuantity}
                      onChange={(e) => setManualQuantity(e.target.value)}
                      placeholder="e.g. 15"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-neutral-900"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 block">Expiry (Hours)</label>
                    <select 
                      value={manualExpiryHours}
                      onChange={(e) => setManualExpiryHours(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2 py-2.5 text-xs text-neutral-900"
                    >
                      <option value="4">4 Hours (Cooked warm)</option>
                      <option value="6">6 Hours</option>
                      <option value="12">12 Hours (Fried appetizers)</option>
                      <option value="48">48 Hours (Fresh produce)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1 bg-neutral-50 px-3.5 py-2 rounded-xl text-[10px] text-stone-500 leading-normal flex gap-1.5 items-center">
                  <ShieldAlert className="w-4 h-4 text-[#cf9b0c] shrink-0" />
                  Please confirm food is safely covered, and kept sanitary.
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 block font-semibold">Pickup Street Address</label>
                  <input 
                    type="text" 
                    value={manualLocation}
                    onChange={(e) => setManualLocation(e.target.value)}
                    placeholder="e.g. Road No 12, Gachibowli, Hyderabad"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingDonation}
                  className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-3 rounded-xl font-bold text-xs transition-all uppercase tracking-wider cursor-pointer"
                >
                  {isSubmittingDonation ? "Saving to ledger..." : "Confirm & List surplus"}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* B. 🍽 REQUEST SURPLUS FOOD DIALOG OVERLAY */}
        {activeFlow === "request" && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 space-y-5 shadow-2xl relative"
            >
              <button onClick={() => setActiveFlow(null)} className="absolute right-4 top-4 text-stone-400 hover:text-stone-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-2xl block">🍽</span>
                <h3 className="text-lg font-black text-neutral-900">Request Intake Voucher</h3>
                <p className="text-xs text-neutral-400">Request clean meals for regional shelter coordinates easily:</p>
              </div>

              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider block text-neutral-450">Number of People to Nourish</label>
                  <input 
                    type="number" 
                    value={requestPeople}
                    onChange={(e) => setRequestPeople(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900"
                    required
                  />
                  <span className="text-[9px] text-neutral-400 italic block mt-0.5">We will calculate food allocation based on average 0.5kg plates per citizen size.</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider block text-neutral-450">Request Location / Shelter Address</label>
                  <input 
                    type="text" 
                    value={requestLocation}
                    onChange={(e) => setRequestLocation(e.target.value)}
                    placeholder="e.g. Metro Pillar 1140, Ameerpet, Hyderabad"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider block text-neutral-450">Urgency speed</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Medium", "High", "Critical"].map(urg => (
                      <button
                        type="button"
                        key={urg}
                        onClick={() => setRequestUrgency(urg as any)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                          requestUrgency === urg 
                            ? "bg-amber-100 text-amber-800 border-amber-300" 
                            : "bg-stone-50 text-stone-600 border-stone-200"
                        }`}
                      >
                        {urg}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingRequest}
                  className="w-full bg-neutral-900 hover:bg-neutral-950 text-white font-bold text-xs py-3 rounded-xl transition-all uppercase cursor-pointer block text-center"
                >
                  {isSubmittingRequest ? "Registering demand..." : "Submit request"}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* C. 🚲 VOLUNTEER DISPATCH ROUTE INTERACTION SCREEN */}
        {activeFlow === "volunteer" && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl p-6 space-y-5 shadow-2xl relative max-h-[92vh] overflow-y-auto text-neutral-900"
            >
              <button onClick={() => setActiveFlow(null)} className="absolute right-4 top-4 text-stone-400 hover:text-stone-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1 flex justify-between items-start">
                <div>
                  <span className="text-[9px] uppercase tracking-wider bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded">Rider partner portal</span>
                  <h3 className="text-lg font-black text-neutral-900 mt-1">Direct Transit Pilot Board</h3>
                  <p className="text-xs text-neutral-400">Like Swiggy & Uber Delivery. Keep food warm, ride safe.</p>
                </div>
              </div>

              {/* RETAIN LOGISTICS CHANGER GRID */}
              <div className="space-y-4">
                
                {/* Active Deliveries dropdown selector or manual selector */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Choose Assigned Ride:</span>
                  <select 
                    value={selectedDeliveryId || ""}
                    onChange={(e) => setSelectedDeliveryId(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs"
                  >
                    <option value="">-- No active delivery selected --</option>
                    {deliveries.map(d => (
                      <option key={d.id} value={d.id}>Ride ID: {d.id} ({d.volunteerName}) - Status: {d.status}</option>
                    ))}
                  </select>
                </div>

                {selectedDeliveryId ? (() => {
                  const del = deliveries.find(d => d.id === selectedDeliveryId);
                  if (!del) return null;
                  const associatedDonation = donations.find(dn => dn.id === del.donationId);

                  return (
                    <div className="space-y-4 pt-2">
                      <div className="bg-[#FAF9F5] border border-stone-200 rounded-2xl p-4 space-y-3.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold">STATUS:</span>
                          <span className="bg-blue-100 text-blue-800 font-extrabold tracking-wider px-2.5 py-0.5 rounded-full uppercase text-[9px] animate-pulse">
                            ● {del.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs leading-normal">
                          <div className="bg-white p-3 rounded-xl border">
                            <span className="text-[9px] text-neutral-400 block font-bold uppercase tracking-wider">🍛 Pick Up Point Address</span>
                            <span className="font-bold text-neutral-850 block mt-1">{associatedDonation?.donorName || "Grand Buffet"}</span>
                            <span className="text-neutral-500 block text-[10px]">{associatedDonation?.location || "Gachibowli Hospitality Block"}</span>
                          </div>

                          <div className="bg-white p-3 rounded-xl border">
                            <span className="text-[9px] text-[#047857] block font-bold uppercase tracking-wider font-semibold">🏠 Drop Off Shelter Point</span>
                            <span className="font-bold text-neutral-850 block mt-1">Sanjivani Community Kitchen</span>
                            <span className="text-neutral-500 block text-[10px]">{associatedDonation?.location ? "Ameerpet Metro Shelter" : "Secunderabad Depot"}</span>
                          </div>
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border space-y-1">
                          <span className="text-[9px] text-neutral-400 block font-bold uppercase tracking-wider">📦 Transit calorie payload:</span>
                          <span className="font-bold text-xs text-neutral-900">{associatedDonation?.foodType || "Paneer Biryani Rice"} – {associatedDonation?.quantity || 15} kg</span>
                          <span className="text-[10px] text-amber-600 block font-semibold flex items-center gap-1 mt-1">
                            <Clock className="w-3.5 h-3.5" /> Fast Dispatch Window: Remaining {associatedDonation?.expiryHours || 6} hours freshness limits
                          </span>
                        </div>
                      </div>

                      {/* GPS Route instructions simplified Swiggy style */}
                      <div className="bg-white border rounded-2xl p-4.5 space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold leading-none">
                          <span className="flex items-center gap-1"><MapPin className="text-[#10B981] w-4 h-4" /> Live Route Instructions</span>
                          <span className="text-stone-400 text-[10px] font-mono">ETA {del.etaMinutes || 25} minutes</span>
                        </div>

                        <div className="space-y-2 border-l border-dashed border-stone-200 pl-4.5 pt-1.5 ml-2">
                          <div className="relative text-xs">
                            <div className="absolute -left-[24px] top-0 h-4 w-4 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[8px] font-bold">1</div>
                            <p className="font-bold">Locate original donor site</p>
                            <p className="text-[10px] text-neutral-400">Arrive at donor coordinates and query dispatch desk for listed box.</p>
                          </div>

                          <div className="relative text-xs pt-3">
                            <div className="absolute -left-[24px] top-3 h-4 w-4 rounded-full bg-[#cf9b0c] text-white flex items-center justify-center text-[8px] font-bold">2</div>
                            <p className="font-bold">Avoid high red-light bottleneck roads</p>
                            <p className="text-[10px] text-neutral-402 text-neutral-400">Head North-West bypass highway towards regional shelters.</p>
                          </div>

                          <div className="relative text-xs pt-3">
                            <div className="absolute -left-[24px] top-3 h-4 w-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-bold">3</div>
                            <p className="font-bold">Complete safe handover</p>
                            <p className="text-[10px] text-neutral-400">Confirm with shelter coordinator sister Clara and register physical weight on the digital scale.</p>
                          </div>
                        </div>
                      </div>

                      {/* Active Rider Action controls */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        {del.status === "Assigned" && (
                          <button
                            onClick={() => stepRiderStatus(del, "Picked Up")}
                            disabled={isCompletingDelivery}
                            className="w-full col-span-2 bg-[#10B981] hover:bg-[#059669] text-white py-3 rounded-xl text-xs font-bold uppercase transition-colors shrink-0 cursor-pointer"
                          >
                            Mark as Picked Up from Kitchen
                          </button>
                        )}

                        {del.status === "Picked Up" && (
                          <button
                            onClick={() => stepRiderStatus(del, "In Transit")}
                            disabled={isCompletingDelivery}
                            className="w-full col-span-2 bg-[#10B981] hover:bg-[#059669] text-white py-3 rounded-xl text-xs font-bold uppercase transition-colors shrink-0 cursor-pointer"
                          >
                            Start Navigation Route (In Transit)
                          </button>
                        )}

                        {del.status === "In Transit" && (
                          <button
                            onClick={() => stepRiderStatus(del, "Delivered")}
                            disabled={isCompletingDelivery}
                            className="w-full col-span-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="w-5 h-5 text-white" /> Complete Delivery & Claim point rewards!
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })() : (
                  <div className="text-center py-10 bg-[#FAF9F5] border border-dashed rounded-2xl text-stone-400 space-y-2">
                    <Truck className="w-8 h-8 mx-auto text-[#10B981] animate-pulse" />
                    <p className="text-xs">No active ride selected. Select a ride ID above, or visit "Nearby Donations" to claim leftover packages awaiting logistics transport!</p>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}

        {/* D. 🎤 SPEAK DETAILS OVERLAY PANEL */}
        {activeFlow === "voice" && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 space-y-5 shadow-2xl relative"
            >
              <button onClick={() => setActiveFlow(null)} className="absolute right-4 top-4 text-stone-400 hover:text-stone-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1.5">
                <span className="text-xs bg-violet-100 text-violet-800 font-extrabold uppercase px-2 py-0.5 rounded">Voice Ingestion Command</span>
                <h3 className="text-base font-bold text-neutral-900">Speak details naturally</h3>
                <p className="text-xs text-neutral-450 text-neutral-400">Our AI model immediately translates Telugu, Hindi, or English to list calories instantly.</p>
              </div>

              {/* Language selection */}
              <div className="flex items-center gap-1.5">
                {["English", "Hindi", "Telugu"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang as any)}
                    className={`text-[10px] px-3 py-1 rounded-full font-bold transition-all border shrink-0 cursor-pointer ${
                      selectedLanguage === lang 
                        ? "bg-violet-600 text-white border-violet-600" 
                        : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {lang === "English" ? "🇬🇧 English" : lang === "Hindi" ? "🇮🇳 Hindi (हिन्दी)" : "🇮🇳 Telugu (తెలుగు)"}
                  </button>
                ))}
              </div>

              {/* Huge Microphone Button */}
              <div className="py-6 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200/80 flex flex-col items-center justify-center relative overflow-hidden">
                <button
                  onClick={triggerVoiceCapture}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isListeningSpeech 
                      ? "bg-red-500 scale-110 text-white animate-ping" 
                      : "bg-[#10B981] hover:bg-[#059669] text-white shadow-lg active:scale-95"
                  }`}
                >
                  <Mic className="w-7 h-7" />
                </button>
                <span className="text-[11px] font-bold text-neutral-700 mt-3 block">
                  {isListeningSpeech ? "Microphone active... Speak now!" : "Click mic to vocalize details"}
                </span>
                <span className="text-[9px] text-neutral-400 italic mt-0.5">(Supports HTML5 speech transcription)</span>
              </div>

              {/* simulated click preset */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block font-semibold">Or tap instant simulator shortcuts:</span>
                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  {SPEECH_SIMULATION_PRESETS[selectedLanguage].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setVoiceTranscriptResult(preset.text);
                        showToast("Simulated voice loaded successfully!");
                      }}
                      className="text-left bg-stone-50 hover:bg-violet-50 hover:border-violet-300 border rounded-xl p-2.5 transition-colors cursor-pointer truncate block"
                    >
                      "{preset.text}"
                    </button>
                  ))}
                </div>
              </div>

              {/* live transcribed text edit */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-neutral-400 block uppercase tracking-wider font-semibold">Transcribed details result:</span>
                <textarea
                  value={voiceTranscriptResult}
                  onChange={(e) => setVoiceTranscriptResult(e.target.value)}
                  placeholder="transcribed keywords will appear automatically..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-violet-500 font-mono text-neutral-800 text-[11px]"
                  rows={2}
                />
              </div>

              <button
                onClick={submitVoiceForAiClassify}
                disabled={isAiProcessingVoice || !voiceTranscriptResult.trim()}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-45 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isAiProcessingVoice ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    AI Safety Check & Carbon Recalculation...
                  </>
                ) : "Approve & Submit Donation"}
              </button>
            </motion.div>
          </div>
        )}

        {/* E. 📸 UPLOAD FOOD PHOTO OVERLAY PANEL */}
        {activeFlow === "photo" && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 space-y-5 shadow-2xl relative text-neutral-900"
            >
              <button onClick={() => setActiveFlow(null)} className="absolute right-4 top-4 text-stone-400 hover:text-stone-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-xs bg-teal-100 text-teal-800 font-extrabold uppercase px-2 py-0.5 rounded">AI Photo Analysis Scan</span>
                <h3 className="text-base font-bold text-neutral-900 mt-1">Simulate visual food audit</h3>
                <p className="text-xs text-neutral-400">Click any preset recipe to view automated calorie classifications:</p>
              </div>

              {/* Presets Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {PHOTO_PRESETS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handlePhotoPresetScan(p)}
                    className="border rounded-2xl overflow-hidden p-1 bg-stone-50 text-left hover:border-teal-500 transition-all focus:outline-none cursor-pointer group"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden pointer-events-none relative">
                      <img src={p.url} className="w-full h-full object-cover group-hover:scale-103 transition-transform" alt="Preset" />
                      {isScanningPhoto && selectedPhoto?.id === p.id && (
                        <div className="absolute inset-0 bg-teal-600/35 flex items-center justify-center text-white"><RefreshCw className="w-6 h-6 animate-spin" /></div>
                      )}
                    </div>
                    <span className="block text-[10px] font-bold text-stone-800 mt-1 truncate px-1">{p.label}</span>
                  </button>
                ))}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-150" /></div>
                <span className="relative flex justify-center text-[9px] uppercase tracking-wider text-stone-400 bg-white px-2">Freshness Audit</span>
              </div>

              {/* Result box details */}
              <div className="bg-[#FAF9F5] border border-stone-200 rounded-2xl p-4 min-h-[140px] flex items-center justify-center">
                {isScanningPhoto ? (
                  <div className="text-center space-y-2 text-stone-400 py-4">
                    <RefreshCw className="w-6 h-6 text-teal-600 animate-spin mx-auto animate-pulse" />
                    <p className="text-xs">Visualizing thermal layers, pH logs, and storage parameters...</p>
                  </div>
                ) : scannedResult ? (
                  <div className="space-y-3 text-xs w-full">
                    <div className="flex justify-between items-center bg-white border border-stone-200 rounded-xl px-2.5 py-1 text-[10px]">
                      <span className="font-semibold text-neutral-400 font-mono">Scan Suitability:</span>
                      <span className={`font-bold uppercase ${
                        scannedResult.suitabilityStatus === "Approved" ? "text-emerald-700" : "text-rose-700"
                      }`}>{scannedResult.suitabilityStatus}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[10px] leading-tight text-neutral-600 font-mono">
                      <div>
                        <span>Product category:</span>
                        <p className="font-bold text-neutral-850 truncate">{scannedResult.foodType}</p>
                      </div>
                      <div>
                        <span>Estimated Weight:</span>
                        <p className="font-bold text-neutral-850">{scannedResult.quantity} kg</p>
                      </div>
                      <div>
                        <span>Safety Score:</span>
                        <p className="font-bold text-neutral-850">{scannedResult.safetyScore}</p>
                      </div>
                      <div>
                        <span>Carbon Offset:</span>
                        <p className="font-bold text-[#047857]">-{scannedResult.carbonOffset} kg CO2e</p>
                      </div>
                    </div>

                    <div className="bg-white border rounded-xl p-2.5 flex gap-1.5 text-[10px] text-neutral-500 leading-normal">
                      <span>⚠️</span>
                      <p>{scannedResult.cautionNote}</p>
                    </div>

                    {scannedResult.suitabilityStatus === "Approved" && (
                      <button
                        onClick={commitPhotoPresetDonation}
                        className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-2.5 rounded-xl text-xs font-bold uppercase transition-all duration-300 block text-center cursor-pointer"
                      >
                        Pledge Ingested Calories
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-stone-400 text-xs py-5">
                    Click any food preset recipe preset block above to test visual sensor compliance.
                  </div>
                )}
              </div>

              {/* simulated files upload */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-2.5 flex items-center justify-between text-xs text-stone-500">
                <span>Select file from camera roll</span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={() => {
                    showToast("Custom photo loaded successfully. Analyzing pixels...");
                    handlePhotoPresetScan(PHOTO_PRESETS[0]);
                  }}
                  className="opacity-0 absolute scale-0 pointer-events-none w-0 h-0"
                  id="custom-file-upload"
                />
                <label htmlFor="custom-file-upload" className="bg-white px-2.5 py-1.5 border rounded-lg hover:bg-stone-100 cursor-pointer font-bold text-[10px] uppercase">
                  Browse File
                </label>
              </div>

            </motion.div>
          </div>
        )}

      </AnimatePresence>

      {/* FLOAT BOTTOM NAVIGATION PANEL - MOBILE FIRST ACCESSIBLE BAR */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 px-4 py-2.5 shadow-xl md:py-3 select-none">
        <div className="max-w-md mx-auto flex justify-between items-center">
          
          <button 
            onClick={() => {
              setActiveTab("home");
              setActiveFlow(null);
            }} 
            className={`flex flex-col items-center gap-1 shrink-0 cursor-pointer ${
              activeTab === "home" ? "text-[#10B981]" : "text-neutral-400 hover:text-neutral-700"
            }`}
            id="tab-home"
          >
            <Home className="w-5.5 h-5.5" />
            <span className="text-[9px] font-bold tracking-tight">Home</span>
          </button>

          <button 
            onClick={() => {
              setActiveTab("dashboard");
              setActiveFlow(null);
            }} 
            className={`flex flex-col items-center gap-1 shrink-0 cursor-pointer ${
              activeTab === "dashboard" ? "text-[#10B981]" : "text-neutral-400 hover:text-neutral-700"
            }`}
            id="tab-dashboard"
          >
            <ShieldCheck className="w-5.5 h-5.5" />
            <span className="text-[9px] font-bold tracking-tight">Dashboard</span>
          </button>

          <button 
            onClick={() => {
              setActiveTab("nearby");
              setActiveFlow(null);
            }} 
            className={`flex flex-col items-center gap-1 shrink-0 cursor-pointer ${
              activeTab === "nearby" ? "text-[#10B981]" : "text-neutral-400 hover:text-neutral-700"
            }`}
            id="tab-nearby"
          >
            <Compass className="w-5.5 h-5.5" />
            <span className="text-[9px] font-bold tracking-tight">Nearby</span>
          </button>

          <button 
            onClick={() => {
              setActiveTab("notifications");
              setActiveFlow(null);
            }} 
            className={`flex flex-col items-center gap-1 shrink-0 cursor-pointer relative ${
              activeTab === "notifications" ? "text-[#10B981]" : "text-neutral-400 hover:text-neutral-700"
            }`}
            id="tab-notifications"
          >
            {notifications.some(n => !n.read) && (
              <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-[#EF4444]" />
            )}
            <Bell className="w-5.5 h-5.5" />
            <span className="text-[9px] font-bold tracking-tight">Alerts</span>
          </button>

          <button 
            onClick={() => {
              setActiveTab("history");
              setActiveFlow(null);
            }} 
            className={`flex flex-col items-center gap-1 shrink-0 cursor-pointer ${
              activeTab === "history" ? "text-[#10B981]" : "text-neutral-400 hover:text-neutral-700"
            }`}
            id="tab-history"
          >
            <History className="w-5.5 h-5.5" />
            <span className="text-[9px] font-bold tracking-tight">History</span>
          </button>

          <button 
            onClick={() => {
              setActiveTab("profile");
              setActiveFlow(null);
            }} 
            className={`flex flex-col items-center gap-1 shrink-0 cursor-pointer ${
              activeTab === "profile" ? "text-[#10B981]" : "text-neutral-400 hover:text-neutral-700"
            }`}
            id="tab-profile"
          >
            <User className="w-5.5 h-5.5" />
            <span className="text-[9px] font-bold tracking-tight">Profile</span>
          </button>

        </div>
      </footer>

    </div>
  );
}
