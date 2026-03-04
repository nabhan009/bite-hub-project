"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { 
  LayoutDashboard, Hotel, Users, History, 
  Settings, LogOut, TrendingUp, Leaf, 
  PackageCheck, ArrowUpRight 
} from "lucide-react";
import Link from "next/link";
import Slidebar from "@/app/components/Slidebar";

export default function AdminDashboard() {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance Stagger for Cards
      gsap.from(".stat-card", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.1,
        ease: "power4.out",
      });

      // 2. Animated Bar Chart logic
      gsap.from(".chart-bar", {
        height: 0,
        duration: 1.5,
        stagger: 0.1,
        ease: "elastic.out(1, 0.5)",
        delay: 0.5
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="flex min-h-screen bg-[#050505] text-[#fafafa] font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-[#0d0d0d] border-r border-white/5 p-8 flex flex-col sticky top-0 h-screen">
        <div className="mb-12">
          <h2 className="text-2xl font-black italic text-orange-500 tracking-tighter uppercase">
            Admin<span className="text-white">Hub</span>
          </h2>
          <p className="text-[10px] font-black text-[#404040] uppercase tracking-[0.3em] mt-1">Kozhikode Node</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          <SidebarLink icon={<LayoutDashboard size={18} />} label="Overview" active />
          <SidebarLink icon={<Hotel size={18} />} label="Hotels" />
          <SidebarLink icon={<Users size={18} />} label="Students" />
          <SidebarLink icon={<History size={18} />} label="Live Logs" />
          <SidebarLink icon={<Settings size={18} />} label="System" />
        </nav>

        <button className="flex items-center gap-4 px-4 py-4 text-red-500/50 hover:text-red-500 font-black text-[10px] uppercase tracking-widest transition-all mt-auto border-t border-white/5">
          <LogOut size={18} />
          Logout Session
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">Global <span className="text-orange-500">Command</span></h1>
            <p className="text-[#737373] text-xs font-bold uppercase tracking-widest mt-2">Real-time ecosystem monitoring</p>
          </div>
          <div className="bg-[#0d0d0d] border border-white/5 px-4 py-2 rounded-xl flex items-center gap-3">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-[#737373]">System Online</span>
          </div>
        </header>

        {/* --- STAT GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard label="Meals Saved" value="1,240" icon={<PackageCheck className="text-orange-500" />} trend="+12%" />
          <StatCard label="Active Students" value="3,842" icon={<Users className="text-blue-500" />} trend="+5%" />
          <StatCard label="Hotel Partners" value="48" icon={<Hotel className="text-purple-500" />} trend="+2" />
          <StatCard label="CO2 Offset" value="820kg" icon={<Leaf className="text-green-500" />} trend="+18%" />
        </div>

        {/* --- ANALYTICS & ACTIVITY --- */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Chart Card */}
          <div className="lg:col-span-2 bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-sm font-black uppercase tracking-widest">Weekly Distribution</h3>
              <TrendingUp size={16} className="text-orange-500" />
            </div>
            
            <div ref={chartRef} className="flex items-end justify-between h-64 gap-4">
              {[60, 40, 85, 50, 95, 70, 45].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4">
                  <div 
                    className="chart-bar w-full bg-gradient-to-t from-orange-600/20 to-orange-500 rounded-t-xl relative group"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {height}%
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#404040]">DAY {i+1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] p-8">
            <h3 className="text-sm font-black uppercase tracking-widest mb-8">Live Activity</h3>
            <div className="space-y-6">
              <ActivityItem user="Adhil" action="claimed" item="Chicken Biryani" time="2m ago" />
              <ActivityItem user="Nahdi Mandi" action="posted" item="3x Rice Plates" time="5m ago" />
              <ActivityItem user="Paragon" action="verified" item="Order #HB82" time="12m ago" />
              <ActivityItem user="Fathima" action="registered" item="Student User" time="1h ago" />
            </div>
            <button className="w-full mt-10 py-4 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
              View All Logs
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

/* --- SUB-COMPONENTS --- */

function SidebarLink({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <Link href="#" className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest ${active ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-[#737373] hover:text-white hover:bg-white/5'}`}>
      {icon}
      {label}
    </Link>
  );
}

function StatCard({ label, value, icon, trend }: any) {
  return (
    <div className="stat-card bg-[#0d0d0d] border border-white/5 p-8 rounded-[2rem] hover:border-white/10 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
        <span className="text-green-500 text-[10px] font-bold bg-green-500/10 px-2 py-1 rounded-lg">{trend}</span>
      </div>
      <p className="text-[10px] font-black text-[#737373] uppercase tracking-widest mb-1">{label}</p>
      <h4 className="text-3xl font-black tracking-tighter italic">{value}</h4>
    </div>
  );
}

function ActivityItem({ user, action, item, time }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black uppercase">{user[0]}</div>
      <div className="flex-1">
        <p className="text-[11px] leading-relaxed">
          <span className="font-black text-white">{user}</span> 
          <span className="text-[#737373] mx-1 uppercase text-[9px]">{action}</span> 
          <span className="text-orange-500 font-bold">{item}</span>
        </p>
        <p className="text-[9px] text-[#404040] font-bold uppercase mt-1 tracking-tighter">{time}</p>
      </div>
    </div>
  );
}