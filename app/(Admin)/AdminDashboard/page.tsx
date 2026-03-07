// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import { gsap } from "gsap";
// import { 
//   Hotel, Users, TrendingUp, Leaf, 
//   PackageCheck, Hash, UtensilsCrossed 
// } from "lucide-react";
// import api from "@/app/Api_instance/api";
// import { AdminSidebar } from "@/app/components/Slidebar";


// export default function AdminDashboard() {
//   const containerRef = useRef(null);
//   const [stats, setStats] = useState({
//     mealsSaved: 0,
//     activeStudents: 0,
//     hotelPartners: 0,
//     carbonOffset: 0
//   });
//   const [recentOrders, setRecentOrders] = useState([]);
//   const [loading, setLoading] = useState(true);


//   useEffect(() => {
//     const fetchAdminData = async () => {
//       try {
//         const [ordersRes, studentsRes, hotelsRes] = await Promise.all([
//           api.get("/mealsOrdered"),
//           api.get("/users"),
//           api.get("/restaurants")
//         ]);

//         const totalOrders = ordersRes.data.length;

//         setStats({
//           mealsSaved: totalOrders,
//           activeStudents: studentsRes.data.length,
//           hotelPartners: hotelsRes.data.length,
//           carbonOffset: totalOrders * 0.5 
//         });

//         setRecentOrders(ordersRes.data.slice(-5).reverse());
//         setLoading(false);
//       } catch (err) {
//         setLoading(false);
//       }
//     };

//     fetchAdminData();
//   }, []);

//   useEffect(() => {
//     if (!loading) {
//       const ctx = gsap.context(() => {
//         // --- THE FIX ---
//         // We use fromTo to explicitly define the start and end states.
//         // clearProps: "all" ensures the div stays visible after the animation.
//         gsap.fromTo(".stat-card", 
//           { opacity: 0, y: 40 },
//           { 
//             opacity: 1, 
//             y: 0, 
//             duration: 0.8, 
//             stagger: 0.15, 
//             ease: "power4.out",
//             clearProps: "opacity,transform" 
//           }
//         );

//         gsap.from(".chart-bar", {
//           height: 0,
//           duration: 1.2,
//           stagger: 0.1,
//           ease: "back.out(1.7)",
//           delay: 0.3
//         });
//       }, containerRef);
//       return () => ctx.revert();
//     }
//   }, [loading]);

//   return (
//     <div ref={containerRef} className="flex min-h-screen bg-[#050505] text-[#fafafa] font-sans">
//       <AdminSidebar />

//       <main className="flex-1 p-10 overflow-y-auto">
//         <header className="flex justify-between items-end mb-12">
//           <div>
//             <h1 className="text-4xl font-black uppercase tracking-tighter italic">Global <span className="text-orange-500">Command</span></h1>
//             <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">Real-time ecosystem monitoring</p>
//           </div>
//           <div className="bg-[#0d0d0d] border border-white/5 px-4 py-2 rounded-xl flex items-center gap-3">
//              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
//              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">System Online</span>
//           </div>
//         </header>

//         {/* --- STAT GRID --- */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//           <StatCard label="Meals Saved" value={stats.mealsSaved} icon={<PackageCheck className="text-orange-500" />} trend="+12%" />
//           <StatCard label="Active Students" value={stats.activeStudents} icon={<Users className="text-blue-500" />} trend="+5%" />
//           <StatCard label="Hotel Partners" value={stats.hotelPartners} icon={<Hotel className="text-purple-500" />} trend="+2" />
//           <StatCard label="CO2 Offset" value={`${stats.carbonOffset}kg`} icon={<Leaf className="text-green-500" />} trend="+18%" />
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] p-10">
//             <h3 className="text-sm font-black uppercase tracking-widest mb-10">Weekly Distribution</h3>
//             <div className="flex items-end justify-between h-64 gap-4">
//               {[60, 40, 85, 50, 95, 70, 45].map((height, i) => (
//                 <div key={i} className="flex-1 flex flex-col items-center gap-4">
//                   <div 
//                     className="chart-bar w-full bg-gradient-to-t from-orange-600/20 to-orange-500 rounded-t-xl"
//                     style={{ height: `${height}%` }}
//                   />
//                   <span className="text-[10px] font-bold text-[#404040]">DAY {i+1}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] p-8">
//             <h3 className="text-sm font-black uppercase tracking-widest mb-8 text-orange-500">Live Collections</h3>
//             <div className="space-y-4">
//               {recentOrders.map((order: any) => (
//                 <div key={order.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
//                   <div className="flex items-center gap-3">
//                     <UtensilsCrossed size={14} className="text-gray-500" />
//                     <div>
//                       <p className="text-xs font-black text-[#fafafa]">{order.mealName}</p>
//                       <p className="text-[10px] text-gray-500 uppercase font-bold">{order.customerName}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-1 bg-[#141414] px-2 py-1 rounded-lg border border-white/5">
//                     <Hash size={10} className="text-orange-500" />
//                     <span className="font-mono font-bold text-[10px]">{order.orderCode}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// function StatCard({ label, value, icon, trend }: any) {
//   return (
//     <div className="stat-card bg-[#0d0d0d] border border-white/5 p-8 rounded-[2rem] hover:border-orange-500/20 transition-all group">
//       <div className="flex justify-between items-start mb-4">
//         <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
//         <span className="text-green-500 text-[10px] font-bold bg-green-500/10 px-2 py-1 rounded-lg">{trend}</span>
//       </div>
//       <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</p>
//       <h4 className="text-3xl font-black tracking-tighter italic">{value}</h4>
//     </div>
//   );
// }




"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  Hotel, Users, Leaf, PackageCheck, Hash, UtensilsCrossed
} from "lucide-react";
import api from "@/app/Api_instance/api";
import { AdminSidebar } from "@/app/components/Slidebar";

export default function AdminDashboard() {
  const containerRef = useRef(null);
  const [stats, setStats] = useState({
    mealsSaved: 0,
    activeStudents: 0,
    hotelPartners: 0,
    carbonOffset: 0,
    successRate: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [ordersRes, studentsRes, hotelsRes, liveMealsRes] = await Promise.all([
          api.get("/mealsOrdered"),
          api.get("/users"),
          api.get("/restaurants"),
          api.get("/meals")
        ]);

        const totalOrdered = ordersRes.data.length;
        const totalLive = liveMealsRes.data.length;
        const rate = totalOrdered > 0 ? Math.round((totalOrdered / (totalOrdered + totalLive)) * 100) : 0;

        setStats({
          mealsSaved: totalOrdered,
          activeStudents: studentsRes.data.length,
          hotelPartners: hotelsRes.data.length,
          carbonOffset: totalOrdered * 0.5,
          successRate: rate
        });

        setRecentOrders(ordersRes.data.slice(-5).reverse());
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  useEffect(() => {
    if (!loading) {
      const ctx = gsap.context(() => {

        // --- FIXED STAT CARD ANIMATION ---
        // 1. We use fromTo to ensure it STARTS at 0 and ENDS at 1 opacity.
        // 2. clearProps: "all" deletes the GSAP styles after 0.8s so they stay visible.
        gsap.fromTo(".stat-card",
          { opacity: 0, y: 40, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)",
            clearProps: "all" // CRITICAL: This removes the GSAP styles after completion
          }
        );

        // Radial Progress Animation
        gsap.fromTo(".progress-ring",
          { strokeDashoffset: 440 },
          {
            strokeDashoffset: 440 - (440 * stats.successRate) / 100,
            duration: 2,
            ease: "power4.out",
            delay: 0.5
          }
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading, stats.successRate]);

  return (
    <div ref={containerRef} className="flex min-h-screen bg-[#050505] text-[#fafafa] font-sans">
      <AdminSidebar />

      <main className="flex-1 ml-16 md:ml-20 p-4 md:p-10 overflow-x-hidden overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 md:gap-0">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">
              Global <span className="text-orange-500">Command</span>
            </h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Kozhikode Distribution Node</p>
          </div>
          <div className="bg-[#0d0d0d] border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/50">System Live</span>
          </div>
        </header>

        {/* --- STAT GRID (FIXED) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard label="Meals Saved" value={stats.mealsSaved} icon={<PackageCheck className="text-orange-500" />} trend="+12%" />
          <StatCard label="Active Students" value={stats.activeStudents} icon={<Users className="text-blue-500" />} trend="+5%" />
          <StatCard label="Hotel Partners" value={stats.hotelPartners} icon={<Hotel className="text-purple-500" />} trend="+2" />
          <StatCard label="CO2 Offset" value={`${stats.carbonOffset}kg`} icon={<Leaf className="text-green-500" />} trend="+18%" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] p-6 md:p-10 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-600/10 blur-[100px] rounded-full" />

            <div className="text-center mb-8">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Ecosystem Efficiency</h3>
              <p className="text-[10px] text-orange-500 font-bold uppercase mt-2">Real-time Successful Claims</p>
            </div>

            <div className="relative flex items-center justify-center">
              {/* SVG Background Circle */}
              <svg className="w-64 h-64 transform -rotate-90">
                <circle cx="128" cy="128" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/[0.03]" />
                <circle
                  cx="128" cy="128" r="70" stroke="currentColor" strokeWidth="12" fill="transparent"
                  strokeDasharray="440" strokeDashoffset="440"
                  className="progress-ring text-orange-500 transition-all duration-500"
                  strokeLinecap="round"
                />
              </svg>
              {/* Percentage in center */}
              <div className="absolute flex flex-col items-center">
                <span className="rate-number text-6xl font-black italic tracking-tighter">{stats.successRate}</span>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-[-5px]">% SUCCESS</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-6 sm:gap-12 border-t border-white/5 pt-8 w-full justify-center items-center">
              <div className="text-center">
                <p className="text-[10px] font-black text-[#404040] uppercase tracking-widest mb-1">Total Posts</p>
                <p className="text-xl font-bold">{stats.mealsSaved + recentOrders.length}</p>
              </div>
              <div className="text-center sm:border-x border-y sm:border-y-0 border-white/5 px-0 py-4 sm:px-12 sm:py-0 w-full sm:w-auto">
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Impact Rank</p>
                <p className="text-xl font-bold">GOLD</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-[#404040] uppercase tracking-widest mb-1">Waste Prevented</p>
                <p className="text-xl font-bold">{stats.mealsSaved} Meals</p>
              </div>
            </div>
          </div>

          {/* Live Feed */}
          <div className="bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] p-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-gray-500">Live Feed</h3>
            <div className="space-y-4">
              {recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-5 bg-[#141414]/50 border border-white/5 rounded-[1.5rem] group hover:border-orange-500/20 transition-all">
                  <div className="flex items-center gap-4">
                    <UtensilsCrossed size={16} className="text-orange-500" />
                    <div>
                      <p className="text-xs font-black text-[#fafafa]">{order.mealName}</p>
                      <p className="text-[9px] text-[#404040] uppercase font-black">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-black px-2 py-1 rounded-lg border border-white/5">
                    <Hash size={10} className="text-orange-500" />
                    <span className="font-mono font-bold text-[10px]">{order.bookingRef}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Fixed StatCard Component
function StatCard({ label, value, icon, trend }: any) {
  return (
    <div className="stat-card bg-[#0d0d0d] border border-white/5 p-8 rounded-[2.5rem] group hover:border-orange-500/20 transition-all shadow-xl">
      <div className="flex justify-between items-start mb-6">
        <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
        <span className="text-green-500 text-[9px] font-black bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">{trend}</span>
      </div>
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{label}</p>
      <h4 className="text-3xl font-black tracking-tighter italic">{value}</h4>
    </div>
  );
}