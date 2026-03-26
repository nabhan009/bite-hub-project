// "use client";
// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import api from "@/app/Api_instance/api";
// import { toast } from "sonner";
// import {
//   Calendar,
//   Clock,
//   ChevronRight,
//   ArrowLeft,
//   Loader2,
//   CheckCircle,
//   UtensilsCrossed,
//   ShieldCheck
// } from "lucide-react";

// export default function PreBookPage() {

//   const params = useParams();
//   const router = useRouter();

//   const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

//   const [meal, setMeal] = useState<any>(null);
//   const [bookingDate, setBookingDate] = useState("");
//   const [bookingTime, setBookingTime] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [mealLoading, setMealLoading] = useState(true);
//   const [isSuccess, setIsSuccess] = useState(false);

//   // FETCH MEAL
//   useEffect(() => {

//     if (!id) return;

//     api.get(`/meals/${id}`)
//       .then((res) => {
//         setMeal(res.data);
//       })
//       .catch(() => {
//         toast.error("Meal not found");
//       })
//       .finally(() => {
//         setMealLoading(false);
//       });

//   }, [id]);

//   const handlePreBook = async (e: React.FormEvent) => {

//     e.preventDefault();

//     if (!bookingDate || !bookingTime) {
//       return toast.error("Select date and time");
//     }

//     if (!meal) {
//       return toast.error("Meal not loaded");
//     }

//     setLoading(true);

//     const storedUser = JSON.parse(
//       localStorage.getItem("bitehub_user") || "{}"
//     );

//     try {

//       await api.post("/preBookedMeals", {
//         mealId: id,
//         mealName: meal.foodName,
//         hotelName: meal.hotelName,
//         customerName: storedUser.name,
//         customerEmail: storedUser.email,
//         date: bookingDate,
//         time: bookingTime,
//         status: "booked",
//         bookingRef: `RES-${Math.random()
//           .toString(36)
//           .substring(2, 7)
//           .toUpperCase()}`
//       });

//       setIsSuccess(true);

//     } catch {

//       toast.error("Booking failed");

//     } finally {

//       setLoading(false);

//     }

//   };

//   // SUCCESS SCREEN
//   if (isSuccess) {
//     return (
//       <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">

//         <div className="bg-[#0d0d0d] border border-white/5 p-12 rounded-[3rem] text-center max-w-sm w-full shadow-2xl">

//           <CheckCircle className="text-green-500 mx-auto mb-6" size={50} />

//           <h2 className="text-3xl font-black uppercase italic text-[#fafafa] mb-2 tracking-tighter">
//             Reserved
//           </h2>

//           <p className="text-gray-500 text-xs mb-8 uppercase tracking-widest font-bold">
//             Check your profile for the code
//           </p>

//           <button
//             onClick={() => router.push("/StudentProfile")}
//             className="w-full bg-orange-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] text-[#fafafa] hover:bg-orange-500 transition-all"
//           >
//             Go to Profile
//           </button>

//         </div>

//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#050505] to-[#0b0b0b] text-[#fafafa] pt-32 pb-20 px-4 md:px-10">

//       <div className="max-w-6xl mx-auto">

//         {/* NAVIGATION */}
//         <div className="mb-10">

//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-2 text-gray-500 hover:text-[#fafafa] transition-colors text-[10px] font-black uppercase tracking-widest"
//           >
//             <ArrowLeft size={14} />
//             Back to Meals
//           </button>

//         </div>

//         {/* LOADING */}
//         {mealLoading && (
//           <div className="flex items-center justify-center py-40">
//             <Loader2 className="animate-spin text-orange-500" size={40} />
//           </div>
//         )}

//         {/* CONTENT */}
//         {!mealLoading && meal && (
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

//             <div className="lg:col-span-7 space-y-10">

//               <div className="space-y-4">

//                 <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85]">
//                   Book <br />
//                   <span className="text-orange-500">Your Bite</span>
//                 </h1>

//                 <p className="text-gray-500 uppercase tracking-[0.4em] text-[10px] font-bold">
//                   Reserved Student Dining
//                 </p>

//               </div>

//               {/* ORDER REVIEW */}
//               <div className="bg-[#0d0d0d] border border-white/5 p-8 rounded-[3rem] shadow-2xl space-y-8">

//                 <div className="flex items-center justify-between">
//                   <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest italic">
//                     Reviewing Order
//                   </span>
//                   <UtensilsCrossed size={16} className="text-orange-500" />
//                 </div>

//                 <div className="flex items-center gap-6 mb-6">

//                   <div className="w-24 h-24 rounded-3xl overflow-hidden border border-white/5 shrink-0 shadow-lg">
//                     <img
//                       src={meal.image}
//                       className="w-full h-full object-cover"
//                       alt={meal.foodName}
//                     />
//                   </div>

//                   <div>
//                     <h4 className="font-black uppercase text-2xl leading-[1.1] truncate">
//                       {meal.foodName}
//                     </h4>

//                     <p className="text-xs text-orange-500 font-bold italic mt-1">
//                       {meal.hotelName}
//                     </p>
//                   </div>

//                 </div>

//                 <div className="border-t border-white/5 pt-6 space-y-4">

//                   <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500">
//                     <span>Price</span>
//                     <span>₹{meal.price}</span>
//                   </div>

//                   <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500">
//                     <span>Fee</span>
//                     <span>₹2</span>
//                   </div>

//                   <div className="pt-6 border-t border-white/5 flex justify-between items-end">

//                     <div>
//                       <p className="text-[10px] font-black uppercase text-gray-500 mb-1">
//                         Total
//                       </p>

//                       <span className="text-5xl font-black tracking-tighter">
//                         ₹{Number(meal.price) + 2}
//                       </span>
//                     </div>

//                     <ShieldCheck size={24} className="text-green-500 mb-1" />

//                   </div>

//                 </div>

//               </div>

//               {/* FORM */}
//               <form
//                 onSubmit={handlePreBook}
//                 className="bg-[#0d0d0d] border border-white/5 p-8 md:p-12 rounded-[3rem] space-y-8 shadow-2xl"
//               >

//                 <div className="space-y-3">

//                   <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 flex items-center gap-2">
//                     <Calendar size={14} className="text-orange-500" />
//                     Select Date
//                   </label>

//                   <input
//                     type="date"
//                     min={new Date().toISOString().split("T")[0]}
//                     className="w-full bg-black border border-white/5 p-5 rounded-2xl outline-none focus:border-orange-500 transition-all text-[#fafafa] font-bold"
//                     onChange={(e) => setBookingDate(e.target.value)}
//                   />

//                 </div>

//                 <div className="space-y-3">

//                   <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 flex items-center gap-2">
//                     <Clock size={14} className="text-orange-500" />
//                     Select Time
//                   </label>

//                   <input
//                     type="time"
//                     className="w-full bg-black border border-white/5 p-5 rounded-2xl outline-none focus:border-orange-500 transition-all text-[#fafafa] font-bold"
//                     onChange={(e) => setBookingTime(e.target.value)}
//                   />

//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-orange-600 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-orange-500 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-orange-600/20"
//                 >

//                   {loading ? (
//                     <Loader2 className="animate-spin" />
//                   ) : (
//                     <>
//                       Confirm Reservation
//                       <ChevronRight size={18} />
//                     </>
//                   )}

//                 </button>

//               </form>

//             </div>

//           </div>
//         )}

//       </div>

//     </div>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ remove useParams
import api from "@/app/Api_instance/api";
import { toast } from "sonner";
import {
  Calendar, Clock, ChevronRight, ArrowLeft,
  Loader2, CheckCircle, UtensilsCrossed, ShieldCheck
} from "lucide-react";

// ✅ Accept id as a prop instead of reading from useParams
export default function PreBookPage({ id }: { id: string }) {

  const router = useRouter();

  const [meal, setMeal] = useState<any>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [mealLoading, setMealLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  // ✅ id is always available on first render — no hydration delay
  useEffect(() => {
    if (!id) return;

    setMealLoading(true);

    api.get(`/meals/${id}`)
      .then((res) => setMeal(res.data))
      .catch(() => toast.error("Meal not found"))
      .finally(() => setMealLoading(false));

  }, [id]);

  const handlePreBook = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!bookingDate || !bookingTime) {
      return toast.error("Select date and time");
    }

    if (!meal) {
      return toast.error("Meal not loaded");
    }

    setLoading(true);

    const storedUser = JSON.parse(
      localStorage.getItem("bitehub_user") || "{}"
    );

    try {

      await api.post("/preBookedMeals", {
        mealId: id,
        mealName: meal.foodName,
        hotelName: meal.hotelName,
        customerName: storedUser.name,
        customerEmail: storedUser.email,
        date: bookingDate,
        time: bookingTime,
        status: "booked",
        bookingRef: `RES-${Math.random()
          .toString(36)
          .substring(2, 7)
          .toUpperCase()}`
      });

      setIsSuccess(true);

    } catch {

      toast.error("Booking failed");

    } finally {

      setLoading(false);

    }

  };

  // SUCCESS SCREEN
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">

        <div className="bg-[#0d0d0d] border border-white/5 p-12 rounded-[3rem] text-center max-w-sm w-full shadow-2xl">

          <CheckCircle className="text-green-500 mx-auto mb-6" size={50} />

          <h2 className="text-3xl font-black uppercase italic text-[#fafafa] mb-2 tracking-tighter">
            Reserved
          </h2>

          <p className="text-gray-500 text-xs mb-8 uppercase tracking-widest font-bold">
            Check your profile for the code
          </p>

          <button
            onClick={() => router.push("/StudentProfile")}
            className="w-full bg-orange-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] text-[#fafafa] hover:bg-orange-500 transition-all"
          >
            Go to Profile
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050505] to-[#0b0b0b] text-[#fafafa] pt-32 pb-20 px-4 md:px-10">

      <div className="max-w-6xl mx-auto">

        {/* NAVIGATION */}
        <div className="mb-10">

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-[#fafafa] transition-colors text-[10px] font-black uppercase tracking-widest"
          >
            <ArrowLeft size={14} />
            Back to Meals
          </button>

        </div>

        {/* LOADING */}
        {mealLoading && (
          <div className="flex items-center justify-center py-40">
            <Loader2 className="animate-spin text-orange-500" size={40} />
          </div>
        )}

        {/* CONTENT */}
        {!mealLoading && meal && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            <div className="lg:col-span-7 space-y-10">

              <div className="space-y-4">

                <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85]">
                  Book <br />
                  <span className="text-orange-500">Your Bite</span>
                </h1>

                <p className="text-gray-500 uppercase tracking-[0.4em] text-[10px] font-bold">
                  Reserved Student Dining
                </p>

              </div>

              {/* ORDER REVIEW */}
              <div className="bg-[#0d0d0d] border border-white/5 p-8 rounded-[3rem] shadow-2xl space-y-8">

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest italic">
                    Reviewing Order
                  </span>
                  <UtensilsCrossed size={16} className="text-orange-500" />
                </div>

                <div className="flex items-center gap-6 mb-6">

                  <div className="w-24 h-24 rounded-3xl overflow-hidden border border-white/5 shrink-0 shadow-lg">
                    <img
                      src={meal.image}
                      className="w-full h-full object-cover"
                      alt={meal.foodName}
                    />
                  </div>

                  <div>
                    <h4 className="font-black uppercase text-2xl leading-[1.1] truncate">
                      {meal.foodName}
                    </h4>

                    <p className="text-xs text-orange-500 font-bold italic mt-1">
                      {meal.hotelName}
                    </p>
                  </div>

                </div>

                <div className="border-t border-white/5 pt-6 space-y-4">

                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500">
                    <span>Price</span>
                    <span>₹{meal.price}</span>
                  </div>

                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500">
                    <span>Fee</span>
                    <span>₹2</span>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex justify-between items-end">

                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-500 mb-1">
                        Total
                      </p>

                      <span className="text-5xl font-black tracking-tighter">
                        ₹{Number(meal.price) + 2}
                      </span>
                    </div>

                    <ShieldCheck size={24} className="text-green-500 mb-1" />

                  </div>

                </div>

              </div>

              {/* FORM */}
              <form
                onSubmit={handlePreBook}
                className="bg-[#0d0d0d] border border-white/5 p-8 md:p-12 rounded-[3rem] space-y-8 shadow-2xl"
              >

                <div className="space-y-3">

                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 flex items-center gap-2">
                    <Calendar size={14} className="text-orange-500" />
                    Select Date
                  </label>

                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-black border border-white/5 p-5 rounded-2xl outline-none focus:border-orange-500 transition-all text-[#fafafa] font-bold"
                    onChange={(e) => setBookingDate(e.target.value)}
                  />

                </div>

                <div className="space-y-3">

                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 flex items-center gap-2">
                    <Clock size={14} className="text-orange-500" />
                    Select Time
                  </label>

                  <input
                    type="time"
                    className="w-full bg-black border border-white/5 p-5 rounded-2xl outline-none focus:border-orange-500 transition-all text-[#fafafa] font-bold"
                    onChange={(e) => setBookingTime(e.target.value)}
                  />

                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-600 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-orange-500 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-orange-600/20"
                >

                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      Confirm Reservation
                      <ChevronRight size={18} />
                    </>
                  )}

                </button>

              </form>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}