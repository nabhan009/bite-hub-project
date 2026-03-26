// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import api from "@/app/Api_instance/api";
// import { gsap } from "gsap";
// import {
//   CheckCircle2,
//   CalendarClock,
//   Hash,
//   User,
//   UtensilsCrossed,
//   ArrowLeft,
// } from "lucide-react";
// import { useRouter } from "next/navigation";

// interface Order {
//   id: number;
//   date: string;
//   time: string;
//   mealName: string;
//   customerName: string;
//   bookingRef: string;
//   restaurantId: string;
//   orderComplete?: boolean;
// }

// const RestaurantHistory = ({ id }: { id: string }) => {
//   const [booked, setBooked] = useState<Order[]>([]);
//   const [collected, setCollected] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const container = useRef<HTMLDivElement>(null);

//   // 🔥 LOAD DATA
//   useEffect(() => {
//     if (!id) return;

//     const loadData = async () => {
//       try {
//         const [res1, res2] = await Promise.all([
//           api.get(`/preBookedMeals?restaurantId=${id}`),
//           api.get(`/mealsOrdered?restaurantId=${id}`),
//         ]);

//         setBooked(res1.data);
//         setCollected(res2.data);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, [id]);

//   // 🔥 ENTRY ANIMATION
//   useEffect(() => {
//     if (!loading) {
//       gsap.from(".order-column", {
//         opacity: 0,
//         y: 30,
//         duration: 0.8,
//         stagger: 0.2,
//         ease: "power4.out",
//       });
//     }
//   }, [loading]);

//   // 🔥 VERIFY ORDER FUNCTION
//   const verifyOrder = async (order: Order, inputCode: string) => {
//     if (inputCode.trim() !== order.bookingRef) {
//       alert("Invalid Code ❌");
//       return;
//     }

//     try {
//       // Remove from preBooked
//       await api.delete(`/preBookedMeals/${order.id}`);

//       // Add to mealsOrdered
//       await api.post("/mealsOrdered", {
//         ...order,
//         orderComplete: true,
//       });

//       // Update UI instantly
//       setBooked((prev) => prev.filter((o) => o.id !== order.id));
//       setCollected((prev) => [
//         ...prev,
//         { ...order, orderComplete: true },
//       ]);

//       alert("Order Completed Successfully ✅");
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong");
//     }
//   };

//   if (loading) return <LoadingSkeleton />;

//   return (
//     <div
//       ref={container}
//       className="min-h-screen bg-[#050505] text-[#fafafa] p-4 md:p-10 relative"
//     >
//       <button
//         onClick={() => router.back()}
//         className="flex items-center gap-2 text-gray-500 hover:text-[#fafafa] transition-colors mb-10 text-[10px] font-black uppercase tracking-widest"
//       >
//         <ArrowLeft size={16} /> Back to Dashboard
//       </button>

//       <div className="max-w-7xl mx-auto">
//         <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
//           <div>
//             <h1 className="text-4xl font-black tracking-tighter italic uppercase">
//               Order <span className="text-orange-500">History</span>
//             </h1>
//           </div>
//           <div className="flex gap-4">
//             <StatBox
//               label="Active Pre-books"
//               value={booked.length}
//               color="text-blue-400"
//             />
//             <StatBox
//               label="Total Success"
//               value={collected.length}
//               color="text-orange-500"
//             />
//           </div>
//         </header>

//         <div className="grid lg:grid-cols-2 gap-10">
//           {/* PRE BOOKED */}
//           <div className="order-column">
//             <h2 className="text-xl font-black mb-6">Pre-booked</h2>
//             <div className="space-y-4">
//               {booked.map((order) => (
//                 <OrderCard
//                   key={order.id}
//                   order={order}
//                   status="booked"
//                   onVerify={verifyOrder}
//                 />
//               ))}
//               {booked.length === 0 && <EmptyState />}
//             </div>
//           </div>

//           {/* COLLECTED */}
//           <div className="order-column">
//             <h2 className="text-xl font-black mb-6">Collected</h2>
//             <div className="space-y-4">
//               {collected.map((order) => (
//                 <OrderCard
//                   key={order.id}
//                   order={order}
//                   status="collected"
//                 />
//               ))}
//               {collected.length === 0 && <EmptyState />}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const OrderCard = ({
//   order,
//   status,
//   onVerify,
// }: {
//   order: Order;
//   status: "booked" | "collected";
//   onVerify?: (order: Order, inputCode: string) => void;
// }) => {
//   const [inputCode, setInputCode] = useState("");
//   const [verifying, setVerifying] = useState(false);
//   const isBooked = status === "booked";

//   const handleVerify = async () => {
//     if (!onVerify) return;
//     setVerifying(true);
//     await onVerify(order, inputCode);
//     setVerifying(false);
//   };

//   return (
//     <div className="bg-[#0d0d0d] border border-white/[0.05] p-6 rounded-[2rem] shadow-xl">
//       <div className="flex justify-between mb-4">
//         <span className="text-xs font-bold uppercase tracking-wide">
//           {order.mealName}
//         </span>
//         <span className="text-xs font-mono text-orange-500">
//           {order.bookingRef}
//         </span>
//       </div>

//       <div className="text-sm text-gray-500 mb-4">
//         <User size={14} className="inline mr-1" />
//         {order.customerName}
//       </div>

//       {isBooked && (
//         <div className="flex gap-3">
//           <input
//             type="text"
//             placeholder="Enter Unique Code"
//             value={inputCode}
//             onChange={(e) => setInputCode(e.target.value)}
//             className="flex-1 bg-[#141414] border border-white/5 px-4 py-2 rounded-xl text-xs outline-none focus:border-orange-500"
//           />
//           <button
//             onClick={handleVerify}
//             disabled={verifying}
//             className="px-4 py-2 bg-orange-500 text-black text-xs font-black uppercase rounded-xl hover:bg-orange-400 disabled:opacity-50"
//           >
//             {verifying ? "Verifying..." : "Verify"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// const StatBox = ({
//   label,
//   value,
//   color,
// }: {
//   label: string;
//   value: number;
//   color: string;
// }) => (
//   <div className="bg-[#0d0d0d] px-6 py-4 rounded-2xl border border-white/[0.05] shadow-xl">
//     <p className="text-xs text-gray-500 uppercase">{label}</p>
//     <p className={`text-3xl font-black ${color}`}>{value}</p>
//   </div>
// );

// const EmptyState = () => (
//   <div className="py-16 border border-dashed border-white/5 rounded-[2rem] text-center text-gray-500">
//     No Records
//   </div>
// );

// const LoadingSkeleton = () => (
//   <div className="p-10 animate-pulse min-h-screen bg-[#050505]" />
// );

// export default RestaurantHistory;



"use client";
import React, { useEffect, useState, useRef } from "react";
import api from "@/app/Api_instance/api";
import { gsap } from "gsap";
import {
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

  // LOAD DATA
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

  // ENTRY ANIMATION
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

  // VERIFY ORDER
  const verifyOrder = async (order: Order, inputCode: string) => {
    if (inputCode.trim() !== order.bookingRef) {
      alert("Invalid Code ❌");
      return;
    }

    try {
      await api.delete(`/preBookedMeals/${order.id}`);

      await api.post("/mealsOrdered", {
        ...order,
        orderComplete: true,
      });

      setBooked((prev) => prev.filter((o) => o.id !== order.id));
      setCollected((prev) => [...prev, { ...order, orderComplete: true }]);

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
      className="min-h-screen bg-[#050505] text-white p-4 md:p-10 relative"
    >
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-10 text-xs font-black uppercase tracking-widest"
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
          {/* PREBOOKED */}
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
    <div className="bg-[#0d0d0d] border border-white/10 p-6 rounded-[2rem] shadow-xl space-y-4">

      {/* MEAL + REF */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold uppercase flex items-center gap-2">
          <UtensilsCrossed size={14} />
          {order.mealName}
        </span>

        <span className="text-xs font-mono text-orange-500 flex items-center gap-1">
          <Hash size={12} />
          {order.bookingRef}
        </span>
      </div>

      {/* CUSTOMER */}
      <div className="text-sm text-gray-300 flex items-center gap-2">
        <User size={14} />
        {order.customerName}
      </div>

      {/* DATE + TIME */}
      <div className="text-xs text-gray-400 flex items-center gap-2">
        <CalendarClock size={14} />
        {order.date} • {order.time}
      </div>

      {/* VERIFY */}
      {isBooked && (
        <div className="flex gap-3 pt-2">
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
  <div className="bg-[#0d0d0d] px-6 py-4 rounded-2xl border border-white/10 shadow-xl">
    <p className="text-xs text-gray-400 uppercase">{label}</p>
    <p className={`text-3xl font-black ${color}`}>{value}</p>
  </div>
);

const EmptyState = () => (
  <div className="py-16 border border-dashed border-white/10 rounded-[2rem] text-center text-gray-400">
    No Records
  </div>
);

const LoadingSkeleton = () => (
  <div className="p-10 animate-pulse min-h-screen bg-[#050505]" />
);

export default RestaurantHistory;