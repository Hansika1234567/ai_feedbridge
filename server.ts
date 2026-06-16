/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Users JSON Database Configuration
const USERS_FILE_PATH = path.join(process.cwd(), "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "foodbridge_secret_jwt_key_2026";

function readUsers() {
  try {
    if (fs.existsSync(USERS_FILE_PATH)) {
      const data = fs.readFileSync(USERS_FILE_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading users database:", error);
  }
  return [];
}

function writeUsers(usersList: any[]) {
  try {
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(usersList, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing users database:", error);
  }
}

function hashPassword(pwd: string): string {
  return crypto.createHash("sha256").update(pwd).digest("hex");
}

// ---------------- AUTH ROUTES & MIDDLEWARES ----------------

// 1. JWT Authentication Middleware
const authenticateJWT = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: "Authorization token is required" });
  }
};

// 2. Role Verification Middleware
const requireRole = (allowedRoles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied: insufficient permissions for this role" });
    }
    next();
  };
};

// 3. User Registration Endpoint
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, role, contact, location } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Missing required registration parameters. Please complete all fields." });
  }

  const usersList = readUsers();
  const existingUser = usersList.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ error: "Email is already registered. Please login instead." });
  }

  // Map incoming simple role names to matching UI roles
  const mapRole = (r: string) => {
    const rLower = r.toLowerCase();
    if (rLower === "admin") return "Super Admin";
    if (rLower === "donor") return "Food Donor";
    if (rLower === "ngo") return "NGO Admin";
    if (rLower === "volunteer") return "Volunteer";
    if (rLower === "beneficiary") return "Beneficiary/Shelter";
    return r; // Fallback
  };

  const finalRole = mapRole(role);

  // Generate a mock avatar based on index or category
  const avatars = [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=120&auto=format&fit=crop&q=80"
  ];
  const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

  const newUser = {
    id: `usr-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    password: hashPassword(password),
    role: finalRole,
    contact: contact || "+91 99999 88888",
    location: location || "Hyderabad, Telangana",
    avatarUrl: randomAvatar,
    joinedDate: new Date().toISOString().substring(0, 10),
    points: finalRole === "Volunteer" ? 120 : 250
  };

  usersList.push(newUser);
  writeUsers(usersList);

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  const { password: _, ...userWithoutPassword } = newUser;

  res.status(201).json({
    success: true,
    token,
    user: userWithoutPassword
  });
});

// 4. User Login Endpoint
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required fields." });
  }

  const usersList = readUsers();
  const user = usersList.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user || user.password !== hashPassword(password)) {
    return res.status(404).json({ error: "Invalid email or password credentials. Please verify your info." });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  const { password: _, ...userWithoutPassword } = user;

  res.json({
    success: true,
    token,
    user: userWithoutPassword
  });
});

// 5. Get Loaded User Authorized Profile
app.get("/api/auth/profile", authenticateJWT, (req: any, res: any) => {
  const usersList = readUsers();
  const user = usersList.find((u: any) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: "A authenticated user node was not found. Please register again." });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

// 6. Forgot Password Simulated Gateway
app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "An authorized email coordinate is required." });
  }

  const usersList = readUsers();
  const user = usersList.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: "This email address is not registered in our community servers." });
  }

  res.json({ success: true, message: "A secure verification code has been dispatched to your email." });
});

// In-Memory Database collections
let donations = [
  {
    id: "don-1",
    donorName: "Grand Palace Banquets",
    donorType: "Hotel",
    contact: "+91 91923 43501",
    foodType: "Cooked Basmati Rice & Paneer Biryani",
    quantity: 25,
    prepTime: "2 hours ago",
    expiryHours: 6,
    location: "Road No. 12, Gachibowli, Hyderabad, Telangana",
    suitabilityStatus: "Approved",
    classificationStr: "Perishable - Cooked Grains & Dairy",
    carbonFootprintSaved: 107.5, // 25kg * 4.3 kg CO2/kg
    matchingStatus: "Matched",
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString()
  },
  {
    id: "don-2",
    donorName: "Heritage Fresh Premium Supermarket",
    donorType: "Supermarket",
    contact: "+91 94405 12112",
    foodType: "Fresh Organic Apple & Pear Crate",
    quantity: 45,
    prepTime: "1 day ago",
    expiryHours: 72,
    location: "Road No. 36, Jubilee Hills, Hyderabad, Telangana",
    suitabilityStatus: "Approved",
    classificationStr: "Non-Perishable - Fresh Produce",
    carbonFootprintSaved: 94.5, // 45kg * 2.1
    matchingStatus: "Unmatched",
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: "don-3",
    donorName: "Bella Italia Restaurant",
    donorType: "Restaurant",
    contact: "+91 99002 44355",
    foodType: "Fresh Garlic Naan & Dal Makhani",
    quantity: 12,
    prepTime: "Recent (30 mins)",
    expiryHours: 4,
    location: "Midtown Mall, Banjara Hills, Hyderabad, Telangana",
    suitabilityStatus: "Approved",
    classificationStr: "Perishable - Vegetarian Cooked",
    carbonFootprintSaved: 25.2, // 12kg * 2.1
    matchingStatus: "Unmatched",
    createdAt: new Date().toISOString()
  },
  {
    id: "don-4",
    donorName: "Secunderabad Seafood Wharf",
    donorType: "Restaurant",
    contact: "+91 98877 66554",
    foodType: "Raw Prawns display (Warm fridge)",
    quantity: 8,
    prepTime: "Expired display",
    expiryHours: -1, // Expired
    location: "MG Road, Secunderabad, Telangana",
    suitabilityStatus: "Rejected",
    classificationStr: "High Risk - Spoiled Seafood",
    carbonFootprintSaved: 0,
    matchingStatus: "Unmatched",
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString()
  }
];

let ngos = [
  {
    id: "ngo-1",
    name: "Hope Community Shelter",
    location: "Ameerpet Metro Pillar 1140, Hyderabad, Telangana",
    contact: "+91 80088 12345",
    requestedFoodTypes: ["Perishable - Cooked Grains & Dairy", "Perishable - Vegetarian Cooked"],
    quantityRequested: 30,
    urgencyLevel: "Critical",
    predictedMonthlyNeed: 820,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: "ngo-2",
    name: "Sunnyside Orphanage & Community Kitchen",
    location: "Near JNTU Road, Kukatpally, Hyderabad, Telangana",
    contact: "+91 73311 98765",
    requestedFoodTypes: ["Non-Perishable - Fresh Produce", "Bread & Bakery Items"],
    quantityRequested: 50,
    urgencyLevel: "High",
    predictedMonthlyNeed: 1200,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
  },
  {
    id: "ngo-3",
    name: "Beacon Outreach Center",
    location: "Amberpet Main Road, Hyderabad, Telangana",
    contact: "+91 90001 55432",
    requestedFoodTypes: ["Perishable - Cooked Grains & Dairy", "Dry Goods & Pantry"],
    quantityRequested: 20,
    urgencyLevel: "Medium",
    predictedMonthlyNeed: 500,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  }
];

let deliveries = [
  {
    id: "del-1",
    donationId: "don-1",
    ngoId: "ngo-1",
    routePlan: ["Pickup: Grand Palace Banquets in Gachibowli", "Route: Via Begumpet flyover and Raj Bhavan Road", "Dropoff: Hope Community Shelter in Ameerpet"],
    spoilageRisk: "Low",
    etaMinutes: 18,
    volunteerName: "Rakesh Kumar (E-Auto Pilot)",
    vehicleType: "Electric Auto",
    status: "In Transit"
  }
];

// Lazy Gemini API Client Initialization helper
let aiInstance: GoogleGenAI | null = null;
const isGeminiEnabled = () => !!process.env.GEMINI_API_KEY;

function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY. Please provide this key in AI Studio Secrets to unlock the live Multi-Agent capabilities.");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiInstance;
}

// REST ENDPOINTS

// 1. Get Donations
app.get("/api/donations", (req, res) => {
  res.json({ donations });
});

// 2. Submit Manual donation
app.post("/api/donations", (req, res) => {
  const { donorName, donorType, contact, foodType, quantity, prepTime, expiryHours, location } = req.body;
  
  if (!donorName || !foodType || !quantity || !location) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Basic classification and green carbon math
  const suitability = expiryHours > 0 ? "Approved" : "Rejected";
  // Chicken/beef/etc. cooked meals are usually high value with 4.3kg CO2 impact per kg. Produce is ~2.1.
  const lowercaseFood = foodType.toLowerCase();
  let co2 = 0;
  let classification = "General Edible";
  
  if (suitability === "Approved") {
    if (lowercaseFood.includes("meat") || lowercaseFood.includes("chicken") || lowercaseFood.includes("rice") || lowercaseFood.includes("buffet")) {
      co2 = Number((quantity * 4.3).toFixed(1));
      classification = "Perishable - Cooked Meat & Grain";
    } else if (lowercaseFood.includes("fruit") || lowercaseFood.includes("vegetable") || lowercaseFood.includes("apple") || lowercaseFood.includes("produce")) {
      co2 = Number((quantity * 2.1).toFixed(1));
      classification = "Non-Perishable - Fresh Produce";
    } else {
      co2 = Number((quantity * 2.5).toFixed(1));
      classification = "Perishable - Mixed Cooked";
    }
  }

  const newDonation = {
    id: `don-${donations.length + 1}`,
    donorName,
    donorType: donorType || "Restaurant",
    contact,
    foodType,
    quantity: Number(quantity),
    prepTime: prepTime || "Just now",
    expiryHours: Number(expiryHours),
    location,
    suitabilityStatus: suitability,
    classificationStr: classification,
    carbonFootprintSaved: co2,
    matchingStatus: "Unmatched",
    createdAt: new Date().toISOString()
  };

  donations.push(newDonation);
  res.json({ success: true, donation: newDonation });
});

// 3. AI Smart Classification (Natural Language donation)
app.post("/api/donations/smart-classify", async (req, res) => {
  const { textDescription, donorName, contact, location, donorType } = req.body;
  if (!textDescription) {
    return res.status(400).json({ error: "No donation text description provided." });
  }

  try {
    if (isGeminiEnabled()) {
      const ai = getGeminiClient();
      const prompt = `You are the Donor Agent for FoodBridge AI. Analyze the following natural language request to donate surplus food. Extrapolate structured data.
      Analyze whether the food is suitable/unsuitable for donation (e.g. if it is reported as rotten, sour, long-expired, mouldy, left outside for 8 hours without fridge, or safety compromised, mark suitabilityStatus as Rejected, otherwise Approved).
      Estimate the carbon footprint saved in kg of CO2 equivalent based on standard equivalents: Meat/dense cooked proteins (4.3kg per kg), Fruit/veg/fresh produce (2.1kg per kg), Bakery/Grains (2.5kg per kg).
      
      User donation text: "${textDescription}"`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              foodType: { type: Type.STRING, description: "Detailed naming of the food being donated" },
              quantity: { type: Type.NUMBER, description: "Estimated quantity in kilograms (number only)" },
              expiryHours: { type: Type.NUMBER, description: "Safety consumption expiry window in hours from now (an integer)" },
              suitabilityStatus: { type: Type.STRING, description: "Must be 'Approved' or 'Rejected' (if unsafe / moldy / sour / expired)" },
              suitabilityReason: { type: Type.STRING, description: "Brief explanation of safety verification or rejection criteria" },
              classificationStr: { type: Type.STRING, description: "Food category like 'Perishable - Cooked Meat & Grain', 'Non-Perishable - Fresh Produce', 'Bakery', etc." },
              carbonFootprintSaved: { type: Type.NUMBER, description: "Estimated kg of carbon CO2 emissions offset (number only)" }
            },
            required: ["foodType", "quantity", "expiryHours", "suitabilityStatus", "suitabilityReason", "classificationStr", "carbonFootprintSaved"]
          }
        }
      });

      const structuredResult = JSON.parse(response.text || "{}");
      
      const newDonation = {
        id: `don-${donations.length + 1}`,
        donorName: donorName || "Surplus Donor",
        donorType: donorType || "Restaurant",
        contact: contact || "Unspecified Contact",
        foodType: structuredResult.foodType,
        quantity: structuredResult.quantity,
        prepTime: "Under review",
        expiryHours: structuredResult.expiryHours,
        location: location || "Kukatpally, Hyderabad, Telangana",
        suitabilityStatus: structuredResult.suitabilityStatus,
        classificationStr: `${structuredResult.classificationStr} (${structuredResult.suitabilityReason})`,
        carbonFootprintSaved: structuredResult.carbonFootprintSaved,
        matchingStatus: "Unmatched",
        createdAt: new Date().toISOString()
      };

      donations.push(newDonation);
      return res.json({ success: true, donation: newDonation, aiParsed: true });
    } else {
      // Graceful fallback for demo
      const fallbackDonation = {
        id: `don-${donations.length + 1}`,
        donorName: donorName || "Pista House Hyderabad",
        donorType: donorType || "Restaurant",
        contact: contact || "+91 99887 76655",
        foodType: "Surplus Biryani and Haleem Crate",
        quantity: 15,
        prepTime: "2 hours ago",
        expiryHours: 8,
        location: location || "Gachibowli Circle, Hyderabad, Telangana",
        suitabilityStatus: "Approved",
        classificationStr: "Halal Rice & Meat (Fallback Simulation Mode - Enable Gemini Key to use smart voice/text parsing!)",
        carbonFootprintSaved: 37.5,
        matchingStatus: "Unmatched",
        createdAt: new Date().toISOString()
      };
      donations.push(fallbackDonation);
      return res.json({ success: true, donation: fallbackDonation, aiParsed: false, note: "Running in Demo Simulation Mode. Set GEMINI_API_KEY to activate." });
    }
  } catch (error: any) {
    console.error("AI Smart Classify Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Get NGOs & Demand
app.get("/api/ngos", (req, res) => {
  res.json({ ngos });
});

// 5. Register NGO Demand
app.post("/api/ngos", (req, res) => {
  const { name, location, contact, requestedFoodTypes, quantityRequested, urgencyLevel } = req.body;
  if (!name || !location || !quantityRequested) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Simulate NGO demand prediction based on historical size
  const predictedNeed = Math.floor(Number(quantityRequested) * 20 + Math.random() * 200);

  const newNgo = {
    id: `ngo-${ngos.length + 1}`,
    name,
    location,
    contact: contact || "General Shelter Phone",
    requestedFoodTypes: requestedFoodTypes || ["General Edible"],
    quantityRequested: Number(quantityRequested),
    urgencyLevel: urgencyLevel || "Medium",
    predictedMonthlyNeed: predictedNeed,
    createdAt: new Date().toISOString()
  };

  ngos.push(newNgo);
  res.json({ success: true, ngo: newNgo });
});

// 6. Get Deliveries
app.get("/api/deliveries", (req, res) => {
  res.json({ deliveries });
});

app.post("/api/deliveries", (req, res) => {
  const { donationId, ngoId, volunteerName, vehicleType } = req.body;
  if (!donationId || !ngoId) {
    return res.status(400).json({ error: "Missing donationId or ngoId" });
  }

  const donation = donations.find(d => d.id === donationId);
  const ngo = ngos.find(n => n.id === ngoId);

  if (!donation || !ngo) {
    return res.status(404).json({ error: "Donation or NGO not found" });
  }

  // Create delivery
  const deliveryId = `del-${deliveries.length + 1}`;
  const newDelivery = {
    id: deliveryId,
    donationId,
    ngoId,
    routePlan: [
      `Pickup: ${donation.donorName} at [${donation.location}]`,
      `Transit via Highway Sector`,
      `Deliver: ${ngo.name} at [${ngo.location}]`
    ],
    spoilageRisk: donation.expiryHours < 3 ? "High" : ("Low" as const),
    etaMinutes: 25,
    volunteerName: volunteerName || "Emma Rogers (Volunteer)",
    vehicleType: vehicleType || "Car",
    status: "Assigned" as const
  };

  donation.matchingStatus = "Matched";
  deliveries.push(newDelivery);
  res.json({ success: true, delivery: newDelivery });
});

// 7. Route Optimization (Logistics Agent)
app.post("/api/deliveries/optimize-route", async (req, res) => {
  const { donationId, ngoId, vehicleType } = req.body;

  const donation = donations.find(d => d.id === donationId);
  const ngo = ngos.find(n => n.id === ngoId);

  if (!donation || !ngo) {
    return res.status(404).json({ error: "Donation or NGO not found" });
  }

  try {
    if (isGeminiEnabled()) {
      const ai = getGeminiClient();
      const prompt = `You are the Logistics Agent for FoodBridge AI. Optimize the pickup and delivery route.
      Donor Location: "${donation.location}"
      NGO Location: "${ngo.location}"
      Surplus food is "${donation.foodType}" with quantity ${donation.quantity} kg and expiry window of ${donation.expiryHours} hours.
      Volunteer vehicle matches: "${vehicleType || "Motorcycle"}".
      Analyze traffic parameters, spoilage risk level (Low, Medium, or High) depending on refrigeration speed in summer heat, and create structured route instructions with exact estimated time in minutes.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              routePlan: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Sequential list of steps or checkpoints for the route"
              },
              spoilageRisk: {
                type: Type.STRING,
                description: "Low, Medium, or High based on vehicle speed, ambient temp, and food expiry"
              },
              etaMinutes: {
                type: Type.NUMBER,
                description: "Predicted delivery transit time in minutes"
              },
              optimizationRationale: {
                type: Type.STRING,
                description: "Rationale including road blockages or high priority bypasses chosen"
              }
            },
            required: ["routePlan", "spoilageRisk", "etaMinutes", "optimizationRationale"]
          }
        }
      });

      const optimizationData = JSON.parse(response.text || "{}");
      return res.json({ success: true, optimization: optimizationData, aiComputed: true });
    } else {
      // Graceful fallback
      return res.json({
        success: true,
        aiComputed: false,
        optimization: {
          routePlan: [
            `1. Start at ${donation.donorName} (${donation.location})`,
            "2. Head north on Main Boulevard avoiding city center congestion",
            "3. Take secondary bypass road to sunny avenue",
            `4. Complete fresh transport at ${ngo.name} (${ngo.location})`
          ],
          spoilageRisk: donation.expiryHours < 4 ? "High" : "Low",
          etaMinutes: 22,
          optimizationRationale: "Simulated fallback route: Prioritizing local highways to avoid red light bottlenecks."
        }
      });
    }
  } catch (error: any) {
    console.error("AI Transit Routing Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 8. Smart Matcher (NGO Coordination + Beneficiary Agent)
app.post("/api/match-donations", async (req, res) => {
  const unmatched = donations.filter(d => d.matchingStatus === "Unmatched" && d.suitabilityStatus === "Approved");
  const availableNgos = ngos;

  if (unmatched.length === 0) {
    return res.json({ success: true, matches: [], message: "All fit donations are already matched!" });
  }

  try {
    if (isGeminiEnabled()) {
      const ai = getGeminiClient();
      const prompt = `You are the NGO Coordination Agent working with the Beneficiary Agent.
      Please execute a smart pairing/matching algorithm between these available food donations, and the registered community shelter needs.
      Pair unmatched items based on proximity (locations), food suitability categories (requestedFoodTypes), and volume/quantity capacity.
      
      Available Donations:
      ${JSON.stringify(unmatched)}
      
      Sheltor & NGO Requirements:
      ${JSON.stringify(availableNgos)}
      
      Generate a list of optimal pairs, assigning a matchScore (0-100) and logical reasoning.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                donationId: { type: Type.STRING },
                donationName: { type: Type.STRING },
                ngoId: { type: Type.STRING },
                ngoName: { type: Type.STRING },
                matchScore: { type: Type.NUMBER, description: "Degree of compatibility (0-100)" },
                matchingRational: { type: Type.STRING, description: "Detailed matching rationale matching categories and urgent supply limits" }
              },
              required: ["donationId", "donationName", "ngoId", "ngoName", "matchScore", "matchingRational"]
            }
          }
        }
      });

      const recommendationList = JSON.parse(response.text || "[]");
      return res.json({ success: true, recommendations: recommendationList, aiComputed: true });
    } else {
      // Fallback pairing heuristics
      const matches: any[] = [];
      unmatched.forEach((d) => {
        // match by simple index matching or string likeness
        const foundNgo = availableNgos[Math.floor(Math.random() * availableNgos.length)];
        matches.push({
          donationId: d.id,
          donationName: d.donorName,
          ngoId: foundNgo.id,
          ngoName: foundNgo.name,
          matchScore: 85,
          matchingRational: `Safe calorie match based on quantity of ${d.quantity}kg allocated for ${foundNgo.name}'s high urgency demand.`
        });
      });
      return res.json({ success: true, recommendations: matches, aiComputed: false });
    }
  } catch (error: any) {
    console.error("AI Matching Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 9. Multi-Agent conversational chatbot playground agent
app.post("/api/chat", async (req, res) => {
  const { messages, activeDemands, activeStock } = req.body;
  if (!messages || messages.length === 0) {
    return res.status(400).json({ error: "Missing chat session context" });
  }

  const latestUserText = messages[messages.length - 1].text;

  try {
    if (isGeminiEnabled()) {
      const ai = getGeminiClient();
      const prompt = `You represent FoodBridge AI's unified coordinator framework.
      We have multiple virtual agents monitoring this channel:
      1. Donor Agent: Oversees inbound leftovers, verifies food safety and spoilage validation, classifications, and carbon.
      2. NGO Coordinator: Manages matchmaking index, coordinates with community kitchens of high urgency.
      3. Logistics Agent: Directs optimized truck / rider routes, ETAs, refrigerated speeds, traffic bypasses.
      4. Beneficiary Agent: Ensures fair equity, tracking nutritional targets and tracking community plate demands.
      5. Analytics Agent: Summarizes metrics like kg saved, hungry people served (about 0.5kg per meal average), and CO2 offsets.

      Current Live Inventory Stock: ${JSON.stringify(donations)}
      Current Active Shelter Demands: ${JSON.stringify(ngos)}
      
      Respond to the user with a collaborative, multi-agent conversation. Highlight how distinct agents analyzed the request.
      You must reply in a structural format.
      You must generate BOTH the textual response to show the user, AND the multi-agent execution chain indicating what actions they simulated internally (agentName, action, output)!
      For the user visible text, format it professionally with neat dialog labels, like:
      - **Donor Agent**: "..."
      - **Logistics Agent**: "..."
      Include at least 2 relevant agents collaborating to answer.
      
      User message: "${latestUserText}"`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              responseText: {
                type: Type.STRING,
                description: "The formatted collaborative chatter dialog that will display safely in the chat box"
              },
              chain: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    agent: { type: Type.STRING, description: "Name of the agent participating" },
                    action: { type: Type.STRING, description: "Internal process performed (e.g., 'Routing check', 'CO2 recalculation')" },
                    output: { type: Type.STRING, description: "Internal analytical result or decision score" }
                  },
                  required: ["agent", "action", "output"]
                }
              }
            },
            required: ["responseText", "chain"]
          }
        }
      });

      const parsedObj = JSON.parse(response.text || "{}");
      return res.json({
        success: true,
        responseText: parsedObj.responseText,
        agentChain: parsedObj.chain,
        aiComputed: true
      });
    } else {
      // Fallback conversational chatter
      const simulatedText = `- **Donor Agent**: We have classified your inquiry. Active stock lists quantities of ${donations.reduce((acc, curr) => acc + (curr.suitabilityStatus === "Approved" ? curr.quantity : 0), 0)}kg of fresh surplus food ready for ingestion!
- **NGO Coordinator**: High priority routing is assigned. Shelters are waiting for matching profiles.
- **Logistics Agent**: A courier can reach locations in draft ETA grids of ~20mins.

*(Note: Provide a Gemini API secret key to enable highly detailed analytical multi-agent dialog streams!)*`;
      return res.json({
        success: true,
        responseText: simulatedText,
        agentChain: [
          { agent: "Donor Agent", action: "Inventory Scan", output: `Identified ${donations.length} total food submissions.` },
          { agent: "NGO Coordinator", action: "Demand Analysis", output: `Match matching metrics for ${ngos.length} NGO points.` },
          { agent: "Logistics Agent", action: "ETA Calculation", output: "Calculated general transit window at 21 minutes." }
        ],
        aiComputed: false
      });
    }
  } catch (error: any) {
    console.error("AI Unified Coordinator error: ", error);
    res.status(500).json({ error: error.message });
  }
});

// 10. Dashboard Analytics calculations
app.get("/api/analytics", (req, res) => {
  const approved = donations.filter(d => d.suitabilityStatus === "Approved");
  const totalSavedKg = approved.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalPeopleServed = Math.floor(totalSavedKg * 2); // 1kg can feed 2 people (0.5kg per meal)
  const totalCo2Saved = approved.reduce((acc, d) => acc + d.carbonFootprintSaved, 0);

  // Categorize food saved by classification
  const categories: Record<string, number> = {};
  approved.forEach(d => {
    const rawClass = d.classificationStr.split(" (")[0];
    categories[rawClass] = (categories[rawClass] || 0) + d.quantity;
  });

  const chartData = Object.entries(categories).map(([name, value]) => ({
    name,
    value: Number(value.toFixed(1))
  }));

  // Historical simulation data
  const historicalMonthly = [
    { month: "Jan", saved: 320, CO2: 780, served: 640 },
    { month: "Feb", saved: 450, CO2: 1090, served: 900 },
    { month: "Mar", saved: 610, CO2: 1475, served: 1220 },
    { month: "Apr", saved: 850, CO2: 2050, served: 1700 },
    { month: "May", saved: 1100, CO2: 2660, served: 2200 },
    { month: "Jun", saved: totalSavedKg + 1200, CO2: totalCo2Saved + 2900, served: totalPeopleServed + 2400 }
  ];

  res.json({
    metrics: {
      totalSavedKg: Number(totalSavedKg.toFixed(1)),
      totalPeopleServed,
      totalCo2Saved: Number(totalCo2Saved.toFixed(1)),
      activeDonors: donations.length,
      activeNgos: ngos.length,
      activeVolunteers: 18
    },
    categoryDistribution: chartData,
    historicalMonthly
  });
});

// VITE MIDDLEWARE INTERCEPT
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FoodBridge AI Server successfully listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
