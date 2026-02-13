"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { toast } from "sonner"
import {
  LogOut,
  LogIn,
  User,
  Package,
  Calendar,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { useAuth } from "@/app/(auth)/Context";
import api from "@/app/Api_instance/api";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"booked" | "bought">("booked");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { isAuthenticated, logout, user, updateUser  } = useAuth();

  // Local editable state
  const [userData, setUserData] = useState({
    name: "",
    password: "",
  });

  // Sync local state when user loads from context
  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        password: "",
      });
    }
  }, [user]);

  // GSAP Entrance Animation
  useGSAP(
    () => {
      gsap.from(".profile-card", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });
    },
    { scope: containerRef }
  );

  const saveProfile = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!user) return;

  const updatedUser = {
    ...user,
    name: userData.name,
    ...(userData.password ? { password: userData.password } : {}),
  };

  try {
    // 1) Update JSON Server
    await api.patch(`/users/${user.id}`, updatedUser);

    // 2) Update Context + localStorage in ONE place
    updateUser({
      name: userData.name,
      ...(userData.password ? { password: userData.password } : {}),
    });

    setIsEditing(false);
    toast.success("Profile updated successfully!");
  } catch (err: any) {
    console.error("Update error:", err);
    toast.error(err?.message || "Failed to update profile.");
  }
};


  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#050505] text-white p-6 md:p-12 lg:p-20"
    >
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <header className="flex justify-between items-end mb-12 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter">
              My <span className="text-orange-500 italic">Bite</span>
            </h1>
            <p className="text-gray-500 uppercase tracking-widest text-xs mt-2 font-bold">
              User Dashboard
            </p>
          </div>

          {isAuthenticated ? (
            <button
              onClick={logout}
              className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-full transition-all"
            >
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <button
              onClick={() => (window.location.href = "/Login")}
              className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-green-500 hover:bg-green-500/10 px-4 py-2 rounded-full transition-all"
            >
              <LogIn size={16} /> Login
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT COLUMN: PROFILE EDIT */}
          <div className="profile-card bg-[#0c0c0c] p-8 rounded-[2rem] border border-white/5 h-fit">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
                <User className="text-orange-500" size={20} /> Identity
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <Edit3 size={18} />
                </button>
              )}
            </div>

            <form onSubmit={saveProfile} className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold block mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={userData.name}
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold block mb-2">
                  Password
                </label>
                <input
                  type="password"
                  disabled={!isEditing}
                  placeholder="New Password"
                  value={userData.password}
                  onChange={(e) =>
                    setUserData({ ...userData, password: e.target.value })
                  }
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50"
                />
              </div>

              {isEditing && (
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-orange-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-500 transition-all"
                  >
                    <Save size={18} /> Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    type="button"
                    className="px-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* RIGHT COLUMN: ACTIVITY */}
          <div className="profile-card lg:col-span-2 space-y-6">
            {/* Tab Toggles */}
            <div className="flex gap-4 p-1 bg-[#0c0c0c] rounded-2xl w-fit border border-white/5">
              <button
                onClick={() => setActiveTab("booked")}
                className={`px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${
                  activeTab === "booked"
                    ? "bg-orange-600 text-white"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                Booked Meals
              </button>
              <button
                onClick={() => setActiveTab("bought")}
                className={`px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${
                  activeTab === "bought"
                    ? "bg-orange-600 text-white"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                Purchase History
              </button>
            </div>

            <div className="bg-[#0c0c0c] rounded-[2rem] border border-white/5 overflow-hidden">
              <div className="p-8">
                {activeTab === "booked" ? (
                  <div className="space-y-4">
                    <MealItem
                      icon={<Calendar />}
                      title="Gourmet Truffle Pasta"
                      date="Tomorrow, 7:00 PM"
                      status="Confirmed"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <MealItem
                      icon={<Package />}
                      title="Wagyu Beef Burger"
                      date="Yesterday"
                      status="Delivered"
                      price="$24.00"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component
function MealItem({
  icon,
  title,
  date,
  status,
  price,
}: {
  icon: React.ReactNode;
  title: string;
  date: string;
  status: string;
  price?: string;
}) {
  return (
    <div className="flex items-center justify-between p-5 bg-black/40 border border-white/5 rounded-2xl group hover:border-orange-500/50 transition-all">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-lg">{title}</h4>
          <p className="text-gray-500 text-xs uppercase tracking-tighter">
            {date}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">
          {status}
        </p>
        {price && (
          <p className="font-mono font-bold mt-1 text-white">{price}</p>
        )}
      </div>
    </div>
  );
}
