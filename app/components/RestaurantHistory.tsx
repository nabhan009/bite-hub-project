// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import api from "@/app/Api_instance/api";
// import { gsap } from "gsap";
// import { CheckCircle2, CalendarClock, Hash, User, UtensilsCrossed, ArrowRight,ArrowLeft } from "lucide-react";
// import { useRouter } from "next/navigation";
// interface Order {
//   id: number;
//   date: string;
//   time: string;
//   mealName: string;
//   customerName: string;
//   orderCode: string;
//   bookingRef: string;
//   restaurantId: string;
// }

// const RestaurantHistory = ({ id }: { id: string }) => {
//   const [booked, setBooked] = useState<Order[]>([]);
//   const [collected, setCollected] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const container = useRef<HTMLDivElement>(null);
//   const router = useRouter();
//   useEffect(() => {
//     if (!id) return;
//     const loadData = async () => {
//       try {
//         const [res1, res2] = await Promise.all([
//           api.get(`/preBookedMeals?restaurantId=${id}`),
//           api.get(`/mealsOrdered?restaurantId=${id}`)
//         ]);
//         setBooked(res1.data);
//         setCollected(res2.data);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadData();
//   }, [id]);

//   useEffect(() => {
//     if (!loading) {
//       gsap.from(".order-column", {
//         opacity: 0,
//         y: 30,
//         duration: 0.8,
//         stagger: 0.2,
//         ease: "power4.out"
//       });
//     }
//   }, [loading]);

//   if (loading) return <LoadingSkeleton />;

//   return (
//     <div ref={container} className="min-h-screen bg-[#050505] text-[#fafafa] p-4 md:p-10 font-sans relative overflow-hidden">
//       {/* Background Glows */}
//       <div className="absolute top-1/4 -right-20 w-96 h-96 bg-orange-600/5 blur-[120px] rounded-full pointer-events-none" />
//                     <button
//           onClick={() => router.back()}
//           className="animate-item flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-10 text-[10px] font-black uppercase tracking-widest"
//         >
//           <ArrowLeft size={16} /> Back to Dashboard
//         </button>
//       <div className="max-w-7xl mx-auto relative z-10">
//         {/* Header Section */}
//         <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
//           <div>
//             <h1 className="text-4xl font-black tracking-tighter italic uppercase leading-none">
//               Order <span className="text-orange-500">History</span>
//             </h1>
//             <p className="text-[#737373] text-sm font-bold uppercase tracking-widest mt-2">
//               Tracking surplus food impact in Kozhikode.
//             </p>
//           </div>
//           <div className="flex gap-4">
//             <StatBox label="Active Pre-books" value={booked.length} color="text-blue-400" />
//             <StatBox label="Total Success" value={collected.length} color="text-orange-500" />
//           </div>
//         </header>

//         <div className="grid lg:grid-cols-2 gap-10">
//           {/* Pre-booked Column */}
//           <div className="order-column">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
//                 <CalendarClock size={20} />
//               </div>
//               <h2 className="text-xl font-black uppercase tracking-tight">Pre-booked</h2>
//             </div>
//             <div className="space-y-4">
//               {booked.map((order) => (
//                 <OrderCard key={order.id} order={order} status="booked" />
//               ))}
//               {booked.length === 0 && <EmptyState />}
//             </div>
//           </div>

//           {/* Collected Column */}
//           <div className="order-column">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="p-3 bg-orange-500/10 text-orange-500 rounded-2xl border border-orange-500/20">
//                 <CheckCircle2 size={20} />
//               </div>
//               <h2 className="text-xl font-black uppercase tracking-tight">Collected</h2>
//             </div>
//             <div className="space-y-4">
//               {collected.map((order) => (
//                 <OrderCard key={order.id} order={order} status="collected" />
//               ))}
//               {collected.length === 0 && <EmptyState />}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const OrderCard = ({ order, status }: { order: Order; status: "booked" | "collected" }) => {
//   const isBooked = status === "booked";

//   return (
//     <div className="data-row group relative bg-[#0d0d0d] border border-white/[0.05] p-6 rounded-[2rem] transition-all hover:border-orange-500/30 shadow-2xl">
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center gap-3">
//           <div className={`p-2 rounded-lg ${isBooked ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-500'}`}>
//             <UtensilsCrossed size={16} />
//           </div>
//           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#737373]">
//             {isBooked ? "Waiting for Student" : "Collection Success"}
//           </span>
//         </div>
//         <div className="flex items-center gap-1 text-[#fafafa] bg-[#141414] px-3 py-1 rounded-full border border-white/5">
//           <Hash size={12} className="text-orange-500" />
//           <span className="font-mono font-bold text-xs">{order.bookingRef}</span>
//         </div>
//       </div>

//       <h3 className="text-xl font-bold text-[#fafafa] mb-1 group-hover:text-orange-500 transition-colors tracking-tight">
//         {order.mealName}
//       </h3>

//       <div className="flex items-center gap-2 text-[#737373] mb-4">
//         <User size={14} />
//         <span className="text-xs font-bold uppercase tracking-wide">{order.customerName}</span>
//       </div>
//         {/* <p className="text-gray-500 text-xs uppercase tracking-tighter">{`${order.date} @ ${order.time}`}</p> */}

//       <div className="pt-4 border-t border-white/[0.03] flex justify-between items-center">
//         <span className="text-[9px] font-black text-[#404040] uppercase tracking-widest">Verified by BiteHub</span>
//         {/* {isBooked && (
//           <button className="flex items-center gap-2 text-[10px] font-black text-orange-500 hover:gap-3 transition-all uppercase tracking-widest">
//             MANAGE <ArrowRight size={12} />
//           </button>
//         )} */}
//       </div>
//     </div>
//   );
// };

// const StatBox = ({ label, value, color }: { label: string; value: number; color: string }) => (
//   <div className="bg-[#0d0d0d] px-6 py-4 rounded-2xl border border-white/[0.05] shadow-xl">
//     <p className="text-[9px] font-black text-[#737373] uppercase tracking-[0.2em] mb-1">{label}</p>
//     <p className={`text-3xl font-black ${color} tracking-tighter`}>{value}</p>
//   </div>
// );

// const EmptyState = () => (
//   <div className="py-16 border border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center text-[#404040] bg-[#0d0d0d]/50">
//     <UtensilsCrossed size={32} className="mb-3 opacity-20" />
//     <p className="text-[10px] font-black uppercase tracking-widest">Empty Records</p>
//   </div>
// );

// const LoadingSkeleton = () => (
//   <div className="p-10 max-w-7xl mx-auto space-y-8 animate-pulse bg-[#050505] min-h-screen">
//     <div className="h-12 w-64 bg-[#0d0d0d] rounded-2xl" />
//     <div className="grid lg:grid-cols-2 gap-10">
//       <div className="h-64 bg-[#0d0d0d] rounded-[2rem]" />
//       <div className="h-64 bg-[#0d0d0d] rounded-[2rem]" />
//     </div>
//   </div>
// );

// export default RestaurantHistory;




"use client";

import React, { useEffect, useState, useRef } from "react";
import api from "@/app/Api_instance/api";
import { gsap } from "gsap";
import {
  CheckCircle2,
  CalendarClock,
  Hash,
  User,
  UtensilsCrossed,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Order {
  id: number;
  date: string;
  time: string;
  mealName: string;
  customerName: string;
  bookingRef: string;
  restaurantId: string;
  orderComplete?: boolean;
}

const RestaurantHistory = ({ id }: { id: string }) => {
  const [booked, setBooked] = useState<Order[]>([]);
  const [collected, setCollected] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const container = useRef<HTMLDivElement>(null);

  // 🔥 LOAD DATA
  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const [res1, res2] = await Promise.all([
          api.get(`/preBookedMeals?restaurantId=${id}`),
          api.get(`/mealsOrdered?restaurantId=${id}`),
        ]);

        setBooked(res1.data);
        setCollected(res2.data);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // 🔥 ENTRY ANIMATION
  useEffect(() => {
    if (!loading) {
      gsap.from(".order-column", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: "power4.out",
      });
    }
  }, [loading]);

  // 🔥 VERIFY ORDER FUNCTION
  const verifyOrder = async (order: Order, inputCode: string) => {
    if (inputCode.trim() !== order.bookingRef) {
      alert("Invalid Code ❌");
      return;
    }

    try {
      // Remove from preBooked
      await api.delete(`/preBookedMeals/${order.id}`);

      // Add to mealsOrdered
      await api.post("/mealsOrdered", {
        ...order,
        orderComplete: true,
      });

      // Update UI instantly
      setBooked((prev) => prev.filter((o) => o.id !== order.id));
      setCollected((prev) => [
        ...prev,
        { ...order, orderComplete: true },
      ]);

      alert("Order Completed Successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div
      ref={container}
      className="min-h-screen bg-[#050505] text-[#fafafa] p-4 md:p-10 relative"
    >
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-10 text-[10px] font-black uppercase tracking-widest"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter italic uppercase">
              Order <span className="text-orange-500">History</span>
            </h1>
          </div>
          <div className="flex gap-4">
            <StatBox
              label="Active Pre-books"
              value={booked.length}
              color="text-blue-400"
            />
            <StatBox
              label="Total Success"
              value={collected.length}
              color="text-orange-500"
            />
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* PRE BOOKED */}
          <div className="order-column">
            <h2 className="text-xl font-black mb-6">Pre-booked</h2>
            <div className="space-y-4">
              {booked.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  status="booked"
                  onVerify={verifyOrder}
                />
              ))}
              {booked.length === 0 && <EmptyState />}
            </div>
          </div>

          {/* COLLECTED */}
          <div className="order-column">
            <h2 className="text-xl font-black mb-6">Collected</h2>
            <div className="space-y-4">
              {collected.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  status="collected"
                />
              ))}
              {collected.length === 0 && <EmptyState />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderCard = ({
  order,
  status,
  onVerify,
}: {
  order: Order;
  status: "booked" | "collected";
  onVerify?: (order: Order, inputCode: string) => void;
}) => {
  const [inputCode, setInputCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const isBooked = status === "booked";

  const handleVerify = async () => {
    if (!onVerify) return;
    setVerifying(true);
    await onVerify(order, inputCode);
    setVerifying(false);
  };

  return (
    <div className="bg-[#0d0d0d] border border-white/[0.05] p-6 rounded-[2rem] shadow-xl">
      <div className="flex justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-wide">
          {order.mealName}
        </span>
        <span className="text-xs font-mono text-orange-500">
          {order.bookingRef}
        </span>
      </div>

      <div className="text-sm text-gray-400 mb-4">
        <User size={14} className="inline mr-1" />
        {order.customerName}
      </div>

      {isBooked && (
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter Unique Code"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="flex-1 bg-[#141414] border border-white/10 px-4 py-2 rounded-xl text-xs outline-none focus:border-orange-500"
          />
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="px-4 py-2 bg-orange-500 text-black text-xs font-black uppercase rounded-xl hover:bg-orange-400 disabled:opacity-50"
          >
            {verifying ? "Verifying..." : "Verify"}
          </button>
        </div>
      )}
    </div>
  );
};

const StatBox = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <div className="bg-[#0d0d0d] px-6 py-4 rounded-2xl border border-white/[0.05] shadow-xl">
    <p className="text-xs text-gray-400 uppercase">{label}</p>
    <p className={`text-3xl font-black ${color}`}>{value}</p>
  </div>
);

const EmptyState = () => (
  <div className="py-16 border border-dashed border-white/10 rounded-[2rem] text-center text-gray-500">
    No Records
  </div>
);

const LoadingSkeleton = () => (
  <div className="p-10 animate-pulse min-h-screen bg-[#050505]" />
);

export default RestaurantHistory;