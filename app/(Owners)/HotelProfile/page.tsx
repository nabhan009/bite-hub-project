// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { gsap } from "gsap";
// import { useGSAP } from "@gsap/react";
// import { toast } from "sonner";
// import {
//   LogOut,
//   Store,
//   MapPin,
//   Save,
//   X,
//   TrendingUp,
//   Utensils,
//   Leaf,
//   ArrowLeft,
//   Info,
//   Navigation,
// } from "lucide-react";
// import { useAuth } from "@/app/(auth)/Context";
// import api from "@/app/Api_instance/api";
// import { useRouter } from "next/navigation";

// // --- UPDATED TYPES ---
// interface HotelData {
//   name: string;
//   address: string;
//   description: string;
//   contact: string;
//   lat: string; // New
//   lng: string; // New
// }

// export default function HotelProfile() {
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [showInfo, setShowInfo] = useState<boolean>(false); // For the Info Tooltip
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const { logout, updateUser } = useAuth();
//   const [currentUser, setCurrentUser] = useState<any>(null);
//   const router = useRouter();

//   const [hotelData, setHotelData] = useState<HotelData>({
//     name: "",
//     address: "",
//     description: "",
//     contact: "",
//     lat: "",
//     lng: "",
//   });

//   const [stats, setStats] = useState({
//     revenue: 0,
//     bitesShared: 0,
//     wastePrevented: "0kg",
//   });

//   useEffect(() => {
//     const storedUser = localStorage.getItem("bitehub_user");
//     if (storedUser) {
//       const parsedUser = JSON.parse(storedUser);
//       console.log("Parsed User from LocalStorage:", parsedUser);
//       if (parsedUser.role === "hotel") {
//         setCurrentUser(parsedUser);
//         setHotelData({
//           name: parsedUser.hotelName || parsedUser.name || "Business Name",
//           address: parsedUser.address || "",
//           description: parsedUser.description || "",
//           contact: parsedUser.contactNumber || parsedUser.contact || "",
//           lat: parsedUser.lat || "",
//           lng: parsedUser.lng || "",
//         });

//         const fetchStats = async () => {
//           try {
//             const res = await api.get("/mealsOrdered");
//             const Orders = res.data;
//             const myOrders = Orders.filter(
//               (order: any) => order.hotelName === parsedUser.hotelName,
//             );
//             const totalRevenue = myOrders.reduce(
//               (acc: number, curr: any) => acc + Number(curr.price || 0),
//               0,
//             );
//             const length = myOrders.length;
//             setStats({
//               revenue: totalRevenue,
//               bitesShared: length,
//               wastePrevented: `${(length * 0.25).toFixed(1)}kg`,
//             });
//           } catch (err) {
//             console.log("Stats error");
//           }
//         };
//         fetchStats();
//       }
//     }
//   }, []);

//   useGSAP(
//     () => {
//       gsap.set(".reveal-profile", { opacity: 0, y: 30 });
//       gsap.to(".reveal-profile", {
//         opacity: 1,
//         y: 0,
//         stagger: 0.1,
//         duration: 0.8,
//         ease: "power4.out",
//       });
//     },
//     { scope: containerRef },
//   );

//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!currentUser?.id) return toast.error("User session not found.");

//     try {
//       const payload = {
//         ...currentUser,
//         hotelName: hotelData.name,
//         address: hotelData.address,
//         description: hotelData.description,
//         contactNumber: hotelData.contact,
//         lat: hotelData.lat,
//         lng: hotelData.lng,
//       };

//       await api.put(`/restaurants/${currentUser.id}`, payload);
//       updateUser(payload);
//       setCurrentUser(payload);
//       setIsEditing(false);
//       toast.success("Merchant profile updated!");
//     } catch (err) {
//       toast.error("Failed to update database.");
//     }
//   };

//   return (
//     <div
//       ref={containerRef}
//       className="min-h-screen bg-[#050505] text-[#fafafa] pt-10 pb-20 px-6"
//     >
//       <div className="max-w-7xl mx-auto">
//         <button
//           onClick={() => router.back()}
//           className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors mb-12 uppercase text-[10px] font-black tracking-widest"
//         >
//           <ArrowLeft size={16} /> Back to Home
//         </button>

//         {/* --- BRAND HEADER --- */}
//         <section className="reveal-profile relative bg-[#0d0d0d] border border-white/5 rounded-[3rem] p-8 md:p-12 mb-10 overflow-hidden shadow-2xl">
//           <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/5 blur-[120px] rounded-full" />
//           <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
//             <div className="w-40 h-40 rounded-[2.5rem] bg-black border border-white/5 flex items-center justify-center overflow-hidden">
//               {currentUser?.image ? (
//                 <img
//                   src={currentUser.image}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <Store size={48} className="text-orange-500/50" />
//               )}
//             </div>
//             <div className="text-center md:text-left flex-1">
//               <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-4">
//                 {hotelData.name}
//               </h1>
//               <div className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">
//                 <span className="flex items-center gap-2">
//                   <MapPin size={14} className="text-orange-500" />{" "}
//                   {hotelData.address}
//                 </span>
//                 <span className="flex items-center gap-2">
//                   <Navigation size={14} className="text-orange-500" />{" "}
//                   {hotelData.lat}, {hotelData.lng}
//                 </span>
//               </div>
//             </div>
//             <button
//               onClick={logout}
//               className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl text-red-500 hover:bg-red-500 hover:text-[#fafafa] transition-all"
//             >
//               <LogOut size={20} />
//             </button>
//           </div>
//         </section>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
//           <div className="reveal-profile lg:col-span-4 space-y-6">
//             <ImpactCard
//               icon={<TrendingUp />}
//               label="Total Revenue"
//               value={`₹${stats.revenue}`}
//               color="text-green-500"
//             />
//             <ImpactCard
//               icon={<Utensils />}
//               label="Meals Claimed"
//               value={stats.bitesShared.toString()}
//               color="text-orange-500"
//             />
//             <ImpactCard
//               icon={<Leaf />}
//               label="Waste Saved"
//               value={stats.wastePrevented}
//               color="text-blue-500"
//             />
//           </div>

//           <div className="lg:col-span-8">
//             <div className="reveal-profile bg-[#0c0c0c] border border-white/5 p-10 rounded-[3rem] shadow-2xl relative">
//               <div className="flex justify-between items-center mb-10">
//                 <h3 className="text-xl font-black uppercase italic flex items-center gap-3 italic text-orange-500">
//                   <Store size={22} /> Storefront Details
//                 </h3>
//                 {!isEditing && (
//                   <button
//                     onClick={() => setIsEditing(true)}
//                     className="px-6 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white text-black transition-all"
//                   >
//                     Edit Identity
//                   </button>
//                 )}
//               </div>

//               <form onSubmit={handleUpdate} className="space-y-8">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                   <ProfileInput
//                     label="Business Name"
//                     value={hotelData.name}
//                     disabled={!isEditing}
//                     onChange={(val) =>
//                       setHotelData({ ...hotelData, name: val })
//                     }
//                   />
//                   <ProfileInput
//                     label="Primary Contact"
//                     value={hotelData.contact}
//                     disabled={!isEditing}
//                     onChange={(val) =>
//                       setHotelData({ ...hotelData, contact: val })
//                     }
//                   />
//                 </div>

//                 <ProfileInput
//                   label="Full Address"
//                   value={hotelData.address}
//                   disabled={!isEditing}
//                   onChange={(val) =>
//                     setHotelData({ ...hotelData, address: val })
//                   }
//                 />

//                 {/* --- COORDINATES SECTION --- */}
//                 <div className="bg-black/40 p-8 rounded-[2rem] border border-white/5 relative">
//                   <div className="flex justify-between items-center mb-6">
//                     <label className="text-[10px] font-black uppercase text-orange-500 tracking-widest flex items-center gap-2">
//                       <Navigation size={14} /> Precise Location Coordinates
//                     </label>
//                     <button
//                       type="button"
//                       onClick={() => setShowInfo(!showInfo)}
//                       className="text-gray-500 hover:text-[#fafafa] transition-colors"
//                     >
//                       <Info size={18} />
//                     </button>
//                   </div>

//                   {showInfo && (
//                     <div className="mb-6 p-6 bg-orange-500/10 border border-orange-500/20 rounded-2xl animate-in fade-in slide-in-from-top-4">
//                       <p className="text-[10px] font-black uppercase text-orange-500 mb-2">
//                         How to find your coordinates:
//                       </p>
//                       <ul className="text-[11px] text-gray-500 space-y-2 list-decimal ml-4 font-medium">
//                         <li>
//                           Open <span className="text-[#fafafa]">Google Maps</span>{" "}
//                           and find your hotel.
//                         </li>
//                         <li>
//                           <span className="text-[#fafafa]">Right-click</span> on
//                           your hotel's exact location.
//                         </li>
//                         <li>
//                           The first numbers you see (e.g., 11.25, 75.78) are
//                           your <span className="text-[#fafafa]">Lat/Lng</span>.
//                         </li>
//                         <li>Click them to copy and paste them below.</li>
//                       </ul>
//                     </div>
//                   )}

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <ProfileInput
//                       label="Latitude"
//                       placeholder="e.g. 11.2588"
//                       value={hotelData.lat}
//                       disabled={!isEditing}
//                       onChange={(val) =>
//                         setHotelData({ ...hotelData, lat: val })
//                       }
//                     />
//                     <ProfileInput
//                       label="Longitude"
//                       placeholder="e.g. 75.7804"
//                       value={hotelData.lng}
//                       disabled={!isEditing}
//                       onChange={(val) =>
//                         setHotelData({ ...hotelData, lng: val })
//                       }
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-3">
//                   <label className="text-[10px] font-black uppercase text-gray-600 tracking-widest ml-1">
//                     Merchant Description
//                   </label>
//                   <textarea
//                     disabled={!isEditing}
//                     value={hotelData.description}
//                     onChange={(e) =>
//                       setHotelData({
//                         ...hotelData,
//                         description: e.target.value,
//                       })
//                     }
//                     className="w-full bg-black border border-white/5 rounded-2xl p-6 focus:border-orange-500 outline-none min-h-[140px] transition-all disabled:opacity-30 font-medium text-[#fafafa]"
//                   />
//                 </div>

//                 {isEditing && (
//                   <div className="flex gap-4 pt-4 animate-reveal">
//                     <button
//                       type="submit"
//                       className="flex-1 bg-orange-600 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-orange-600/20"
//                     >
//                       <Save size={18} /> Update Merchant
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => setIsEditing(false)}
//                       className="px-10 bg-white/5 rounded-2xl hover:bg-white/10 transition-all"
//                     >
//                       <X size={18} />
//                     </button>
//                   </div>
//                 )}
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // --- SUB COMPONENTS ---

// function ImpactCard({
//   icon,
//   label,
//   value,
//   color,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: string;
//   color: string;
// }) {
//   return (
//     <div className="reveal-profile bg-[#0c0c0c] border border-white/5 p-8 rounded-[2.5rem] flex items-center gap-6 group hover:border-orange-500/20 transition-all">
//       <div
//         className={`w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center ${color}`}
//       >
//         {icon}
//       </div>
//       <div>
//         <p className="text-[9px] font-black uppercase text-gray-600 tracking-widest mb-1">
//           {label}
//         </p>
//         <p className="text-4xl font-black italic tracking-tighter">{value}</p>
//       </div>
//     </div>
//   );
// }

// function ProfileInput({
//   label,
//   value,
//   disabled,
//   onChange,
//   placeholder,
// }: {
//   label: string;
//   value: string;
//   disabled: boolean;
//   onChange: (v: string) => void;
//   placeholder?: string;
// }) {
//   return (
//     <div className="space-y-3">
//       <label className="text-[10px] font-black uppercase text-gray-600 tracking-widest ml-1">
//         {label}
//       </label>
//       <input
//         type="text"
//         placeholder={placeholder}
//         disabled={disabled}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full bg-black border border-white/5 rounded-2xl px-6 py-5 focus:border-orange-500 outline-none transition-all disabled:opacity-30 font-bold text-[#fafafa] placeholder:text-gray-800"
//       />
//     </div>
//   );
// }



"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { toast } from "sonner";
import {
  LogOut,
  Store,
  MapPin,
  Save,
  X,
  ArrowLeft,
  Navigation,
} from "lucide-react";
import { useAuth } from "@/app/(auth)/Context";
import api from "@/app/Api_instance/api";
import { useRouter } from "next/navigation";

//  MapPicker dynamic (Leaflet needs client-only)
const MapPicker = dynamic(() => import("@/app/components/MapPicker"), {
  ssr: false,
});

interface HotelData {
  name: string;
  address: string;
  description: string;
  contact: string;
  closingTime: string;
  lat: string;
  lng: string;
}

export default function HotelProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { logout, updateUser } = useAuth();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  const [hotelData, setHotelData] = useState<HotelData>({
    name: "",
    address: "",
    description: "",
    contact: "",
    closingTime: "2 AM",
    lat: "",
    lng: "",
  });

  //  Load User
  useEffect(() => {
    const storedUser = localStorage.getItem("bitehub_user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.role === "hotel") {
        setCurrentUser(parsed);
        setHotelData({
          name: parsed.hotelName || "",
          address: parsed.address || "",
          description: parsed.description || "",
          contact: parsed.contactNumber || "",
          closingTime: parsed.closingTime || "2 AM",
          lat: parsed.lat || "",
          lng: parsed.lng || "",
        });
      }
    }
  }, []);

  //  GSAP
  useGSAP(
    () => {
      gsap.set(".reveal-profile", { opacity: 0, y: 30 });
      gsap.to(".reveal-profile", {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power4.out",
      });
    },
    { scope: containerRef }
  );

  // Update Handler
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.id) return toast.error("Session not found.");

    try {
      const payload = {
        ...currentUser,
        hotelName: hotelData.name,
        address: hotelData.address,
        description: hotelData.description,
        contactNumber: hotelData.contact,
        closingTime: hotelData.closingTime || "2 AM",
        lat: hotelData.lat,
        lng: hotelData.lng,
      };

      await api.put(`/restaurants/${currentUser.id}`, payload);

      updateUser(payload);
      setCurrentUser(payload);
      setIsEditing(false);

      toast.success("Merchant profile updated successfully!");
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#050505] text-[#fafafa] pt-10 pb-20 px-6"
    >
      <div className="max-w-5xl mx-auto">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-orange-500 mb-10 uppercase text-[10px] font-black tracking-widest"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Header */}
        <section className="reveal-profile bg-[#0d0d0d] border border-white/5 rounded-[3rem] p-10 mb-10 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="w-32 h-32 rounded-[2rem] bg-black border border-white/5 flex items-center justify-center">
              <Store size={40} className="text-orange-500/50" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-black uppercase italic mb-3">
                {hotelData.name}
              </h1>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-widest space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-orange-500" />
                  {hotelData.address}
                </div>
                {hotelData.lat && hotelData.lng && (
                  <div className="flex items-center gap-2">
                    <Navigation size={14} className="text-orange-500" />
                    {hotelData.lat}, {hotelData.lng}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={logout}
              className="p-3 bg-red-500/10 rounded-xl text-red-500 hover:bg-red-500 hover:text-[#fafafa] transition"
            >
              <LogOut size={18} />
            </button>
          </div>
        </section>

        {/* Edit Button OUTSIDE FORM */}
        {!isEditing && (
          <div className="flex justify-end mb-6">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white text-black transition-all"
            >
              Edit Profile
            </button>
          </div>
        )}

        {/* FORM */}
        <div className="reveal-profile bg-[#0c0c0c] border border-white/5 p-10 rounded-[3rem] shadow-2xl">
          <form onSubmit={handleUpdate} className="space-y-8">

            <ProfileInput
              label="Business Name"
              value={hotelData.name}
              disabled={!isEditing}
              onChange={(v) => setHotelData({ ...hotelData, name: v })}
            />

            <ProfileInput
              label="Contact"
              value={hotelData.contact}
              disabled={!isEditing}
              onChange={(v) => setHotelData({ ...hotelData, contact: v })}
            />

            <ProfileInput
              label="Address"
              value={hotelData.address}
              disabled={!isEditing}
              onChange={(v) => setHotelData({ ...hotelData, address: v })}
            />
            <ProfileInput
              label="Closing Time"
              value={hotelData.closingTime}
              disabled={!isEditing}
              onChange={(v) => setHotelData({ ...hotelData, closingTime: v })}
            />

            {/* MAP SECTION */}
            {isEditing && (
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-orange-500 tracking-widest">
                  Select Location on Map
                </label>

                <MapPicker
                  initialPosition={
                    hotelData.lat && hotelData.lng
                      ? [Number(hotelData.lat), Number(hotelData.lng)]
                      : undefined
                  }
                  onSelect={(lat, lng) => {
                    setHotelData({
                      ...hotelData,
                      lat: lat.toString(),
                      lng: lng.toString(),
                    });
                    toast.success("Location selected 📍");
                  }}
                />

                {hotelData.lat && hotelData.lng && (
                  <div className="text-xs text-orange-500 font-bold">
                    Selected: {hotelData.lat}, {hotelData.lng}
                  </div>
                )}
              </div>
            )}

            <textarea
              disabled={!isEditing}
              value={hotelData.description}
              onChange={(e) =>
                setHotelData({ ...hotelData, description: e.target.value })
              }
              className="w-full bg-black border border-white/5 rounded-2xl p-6 focus:border-orange-500 outline-none disabled:opacity-30"
            />

            {/* SAVE / CANCEL */}
            {isEditing && (
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest"
                >
                  <Save size={18} /> Save
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-10 bg-white/5 rounded-2xl"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

// 🔹 Reusable Input
function ProfileInput({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  disabled: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase text-gray-600 tracking-widest">
        {label}
      </label>
      <input
        type="text"
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black border border-white/5 rounded-2xl px-6 py-5 focus:border-orange-500 outline-none disabled:opacity-30"
      />
    </div>
  );
}