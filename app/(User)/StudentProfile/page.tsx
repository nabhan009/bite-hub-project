// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { gsap } from "gsap";
// import { useGSAP } from "@gsap/react";
// import { toast } from "sonner";
// import {
//   LogOut,
//   LogIn,
//   User,
//   Edit3,
//   Save,
//   X,
//   Eye,
//   EyeOff,
//   Lock,
// } from "lucide-react";
// import { useAuth } from "@/app/(auth)/Context";
// import api from "@/app/Api_instance/api";

// export default function ProfilePage() {
//   const [isEditing, setIsEditing] = useState(false);
//   const [showPin, setShowPin] = useState(false);
//   const [activeTab, setActiveTab] = useState<"booked" | "bought">("booked");
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   const { isAuthenticated, logout, user, updateUser } = useAuth();

//   // Local editable state including the manual PIN
//   const [userData, setUserData] = useState({
//     name: "",
//     password: "",
//     pin: "",
//   });

//   // Sync from DB to local state
//   useEffect(() => {
//     if (user) {
//       setUserData({
//         name: user.name || "",
//         password: "",
//         pin: user.pin || "", // Load the existing pin from db.json via context
//       });
//     }
//   }, [user]);

//   useGSAP(() => {
//     gsap.from(".profile-card", {
//       y: 50,
//       opacity: 0,
//       duration: 0.8,
//       stagger: 0.2,
//       ease: "power3.out",
//     });
//   }, { scope: containerRef });

//   const saveProfile = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) return;

//     // Validation: PIN must be 4 digits
//     if (userData.pin.length !== 4) {
//       toast.error("Security PIN must be exactly 4 digits.");
//       return;
//     }

//     const updatedUser = {
//       ...user,
//       name: userData.name,
//       pin: userData.pin, // This maps to your db.json field
//       ...(userData.password ? { password: userData.password } : {}),
//     };

//     try {
//       // 1) Update JSON Server (db.json)
//       await api.patch(`/users/${user.id}`, updatedUser);

//       // 2) Update Local Context
//       updateUser({
//         name: userData.name,
//         pin: userData.pin,
//         ...(userData.password ? { password: userData.password } : {}),
//       });

//       setIsEditing(false);
//       setShowPin(false);
//       toast.success("Identity & PIN updated successfully!");
//     } catch (err: any) {
//       toast.error("Failed to sync data with server.");
//     }
//   };

//   return (
//     <div ref={containerRef} className="min-h-screen bg-[#050505] text-white p-6 md:p-12 lg:p-20 pt-32">
//       <div className="max-w-6xl mx-auto">
        
//         {/* HEADER SECTION */}
//         <header className="flex justify-between items-end mb-12 border-b border-white/10 pb-8">
//           <div>
//             <h1 className="text-5xl font-black uppercase tracking-tighter">
//               My <span className="text-orange-500 italic">Bite</span>
//             </h1>
//             <p className="text-gray-500 uppercase tracking-widest text-[10px] mt-2 font-bold italic">User Dashboard</p>
//           </div>
//           <button onClick={logout} className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-full transition-all">
//             <LogOut size={16} /> Logout
//           </button>
//         </header>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
//           {/* LEFT COLUMN: IDENTITY & PIN */}
//           <div className="profile-card bg-[#0c0c0c] p-8 rounded-[2.5rem] border border-white/5 h-fit shadow-2xl">
//             <div className="flex justify-between items-center mb-8">
//               <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
//                 <User className="text-orange-500" size={20} /> Identity
//               </h3>
//               {!isEditing && (
//                 <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-white transition-colors">
//                   <Edit3 size={18} />
//                 </button>
//               )}
//             </div>

//             <form onSubmit={saveProfile} className="space-y-6">
//               {/* Name */}
//               <div className="space-y-2">
//                 <label className="text-[10px] uppercase tracking-widest text-gray-600 font-black ml-1">Full Name</label>
//                 <input
//                   type="text"
//                   disabled={!isEditing}
//                   value={userData.name}
//                   onChange={(e) => setUserData({ ...userData, name: e.target.value })}
//                   className="w-full bg-black border border-white/5 rounded-2xl px-5 py-4 focus:border-orange-500 outline-none transition-all disabled:opacity-30"
//                 />
//               </div>

//               {/* Manual Security PIN */}
//               <div className="space-y-2">
//                 <label className="text-[10px] uppercase tracking-widest text-gray-600 font-black ml-1 flex items-center gap-2">
//                   <Lock size={12}/> Security PIN (4 Digits)
//                 </label>
//                 <div className="relative flex items-center">
//                   <input
//                     type={showPin ? "text" : "password"}
//                     disabled={!isEditing}
//                     maxLength={4}
//                     value={userData.pin}
//                     onChange={(e) => {
//                         const val = e.target.value.replace(/\D/g, ""); // Only numbers
//                         setUserData({ ...userData, pin: val });
//                     }}
//                     placeholder="****"
//                     className="w-full bg-black border border-white/5 rounded-2xl px-5 py-4 focus:border-orange-500 outline-none transition-all disabled:opacity-30 font-mono tracking-[1em] text-lg text-orange-500"
//                   />
//                   <button 
//                     type="button"
//                     onClick={() => setShowPin(!showPin)}
//                     className="absolute right-0 p-6 text-gray-500 hover:text-white transition-colors"
//                   >
//                     {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>
//               </div>

//               {/* Password */}
//               <div className="space-y-2">
//                 <label className="text-[10px] uppercase tracking-widest text-gray-600 font-black ml-1">New Password</label>
//                 <input
//                   type="password"
//                   disabled={!isEditing}
//                   placeholder="••••••••"
//                   value={userData.password}
//                   onChange={(e) => setUserData({ ...userData, password: e.target.value })}
//                   className="w-full bg-black border border-white/5 rounded-2xl px-5 py-4 focus:border-orange-500 outline-none transition-all disabled:opacity-30"
//                 />
//               </div>

//               {isEditing && (
//                 <div className="flex gap-3 pt-4">
//                   <button type="submit" className="flex-1 bg-orange-600 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-xl shadow-orange-600/20">
//                     <Save size={16} /> Save Changes
//                   </button>
//                   <button onClick={() => { setIsEditing(false); setShowPin(false); }} type="button" className="px-5 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
//                     <X size={18} />
//                   </button>
//                 </div>
//               )}
//             </form>
//           </div>

//           {/* RIGHT COLUMN: HISTORY */}
//           <div className="profile-card lg:col-span-2 space-y-6">
//             <div className="flex gap-4 p-1 bg-[#0c0c0c] rounded-2xl w-fit border border-white/5">
//                 <button onClick={() => setActiveTab("booked")} className={`px-8 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${activeTab === "booked" ? "bg-orange-600 text-white shadow-lg" : "text-gray-500 hover:text-white"}`}>Reservations</button>
//                 <button onClick={() => setActiveTab("bought")} className={`px-8 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${activeTab === "bought" ? "bg-orange-600 text-white shadow-lg" : "text-gray-500 hover:text-white"}`}>History</button>
//             </div>
            
//             <div className="bg-[#0c0c0c] rounded-[2.5rem] border border-white/5 p-8 h-[50vh] flex items-center justify-center text-gray-600 font-bold uppercase tracking-widest text-[10px]">
//                 No {activeTab} activity found
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { toast } from "sonner";
import {
  LogOut,
  LogIn,
  User,
  Package,
  Calendar,
  Edit3,
  Save,
  X,
  Ticket,
} from "lucide-react";
import { useAuth } from "@/app/(auth)/Context";
import api from "@/app/Api_instance/api";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"booked" | "bought">("booked");
  const [purchasedMeals, setPurchasedMeals] = useState<any[]>([]);
  const [bookedMeals, setBookedMeals] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { isAuthenticated, logout, user, updateUser } = useAuth();

  const [userData, setUserData] = useState({
    name: "",
    password: "",
    pin: "",
  });

  // Sync state and Fetch Data
useEffect(() => {
  if (!user?.email) return;

  setUserData({
    name: user.name || "",
    password: "",
    pin: user.pin || "",
  });

  const fetchHistory = async () => {
    try {
      const boughtRes = await api.get("/mealsOrdered");
      const bookedRes = await api.get("/preBookedMeals");
// console.log("Fetched Meals:", boughtRes.data, bookedRes.data);

      const myBoughtMeals = boughtRes.data.filter(
        (m: any) => m.customerEmail === user.email
      );

      const myBookedMeals = bookedRes.data.filter(
        (b: any) => b.customerEmail === user.email
      );

      setPurchasedMeals(myBoughtMeals.reverse());
      setBookedMeals(myBookedMeals.reverse());

    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  fetchHistory();

}, [user?.email]);

  useGSAP(() => {
    gsap.from(".profile-card", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updatedUser = {
      ...user,
      name: userData.name,
      pin: userData.pin,
      ...(userData.password ? { password: userData.password } : {}),
    };

    try {
      await api.patch(`/users/${user.id}`, updatedUser);
      updateUser(updatedUser);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-white p-6 md:p-12 lg:p-20 pt-32">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-12 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter">
              My <span className="text-orange-500 italic">Bite</span>
            </h1>
            <p className="text-gray-500 uppercase tracking-widest text-xs mt-2 font-bold">User Dashboard</p>
          </div>

          {isAuthenticated ? (
            <button onClick={logout} className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-full transition-all">
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <button onClick={() => (window.location.href = "/Login")} className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-green-500 hover:bg-green-500/10 px-4 py-2 rounded-full transition-all">
              <LogIn size={16} /> Login
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="profile-card bg-[#0c0c0c] p-8 rounded-[2rem] border border-white/5 h-fit">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
                <User className="text-orange-500" size={20} /> Identity
              </h3>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-white transition-colors">
                  <Edit3 size={18} />
                </button>
              )}
            </div>

            <form onSubmit={saveProfile} className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold block mb-2">Full Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold block mb-2">Security Pin</label>
                <input
                  type="text"
                  maxLength={4}
                  disabled={!isEditing}
                  value={userData.pin}
                  onChange={(e) => setUserData({ ...userData, pin: e.target.value.replace(/\D/g, "") })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50 font-mono tracking-widest"
                />
              </div>

              {isEditing && (
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-orange-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-500 transition-all"><Save size={18} /> Save</button>
                  <button onClick={() => setIsEditing(false)} type="button" className="px-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all"><X size={18} /></button>
                </div>
              )}
            </form>
          </div>

          <div className="profile-card lg:col-span-2 space-y-6">
            <div className="flex gap-4 p-1 bg-[#0c0c0c] rounded-2xl w-fit border border-white/5">
              <button onClick={() => setActiveTab("booked")} className={`px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${activeTab === "booked" ? "bg-orange-600 text-white" : "text-gray-500 hover:text-white"}`}>Booked Meals</button>
              <button onClick={() => setActiveTab("bought")} className={`px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${activeTab === "bought" ? "bg-orange-600 text-white" : "text-gray-500 hover:text-white"}`}>Purchase History</button>
            </div>

            <div className="bg-[#0c0c0c] rounded-[2rem] border border-white/5 overflow-hidden">
              <div className="p-8 space-y-4">
                {activeTab === "booked" ? (
                  bookedMeals.length > 0 ? bookedMeals.map((item) => (
                    <MealItem key={item.id} icon={<Calendar />} title={item.mealName} date={`${item.date} @ ${item.time}`} status="Reserved" code={item.bookingRef} />
                  )) : <p className="text-gray-600 text-center py-10">No reservations found.</p>
                ) : (
                  purchasedMeals.length > 0 ? purchasedMeals.map((item) => (
                    <MealItem key={item.id} icon={<Package />} title={item.mealName} date={new Date(item.timestamp).toLocaleDateString()} status="Paid" price={`₹${item.price}`} code={item.orderCode} />
                  )) : <p className="text-gray-600 text-center py-10">No purchase history found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MealItem({ icon, title, date, status, price, code }: any) {
  return (
    <div className="flex items-center justify-between p-5 bg-black/40 border border-white/5 rounded-2xl group hover:border-orange-500/50 transition-all">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">{icon}</div>
        <div>
          <h4 className="font-bold text-lg">{title}</h4>
          <p className="text-gray-500 text-xs uppercase tracking-tighter">{date}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-2 justify-end mb-1">
          <Ticket size={12} className="text-orange-500" />
          <span className="font-mono text-sm font-bold text-white tracking-widest">{code}</span>
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">{status} {price && `• ${price}`}</p>
      </div>
    </div>
  );
}