"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/Api_instance/api";
import { toast } from "sonner";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  ArrowLeft, 
  Loader2, 
  CheckCircle,
  UtensilsCrossed,
  ShieldCheck
} from "lucide-react";

export default function PreBookPage() {
  const { id } = useParams();
  const router = useRouter();
  const containerRef = useRef(null);

  const [meal, setMeal] = useState<any>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      api.get(`/meals/${id}`).then((res) => setMeal(res.data));
    }
  }, [id]);

  useGSAP(() => {
    if (meal) {
      gsap.from(".reveal-animate", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power4.out"
      });
    }
  }, { scope: containerRef, dependencies: [meal] });

  const handlePreBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime) return toast.error("Select date and time");

    setLoading(true);
    const storedUser = JSON.parse(localStorage.getItem("bitehub_user") || "{}");

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
        bookingRef: `RES-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
      });
      setIsSuccess(true);
    } catch (err) {
      toast.error("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <div className="bg-[#0d0d0d] border border-white/10 p-12 rounded-[3rem] text-center max-w-sm w-full shadow-2xl">
          <CheckCircle className="text-green-500 mx-auto mb-6" size={50} />
          <h2 className="text-3xl font-black uppercase italic text-white mb-2 tracking-tighter">Reserved</h2>
          <p className="text-gray-500 text-xs mb-8 uppercase tracking-widest font-bold">Check your profile for the code</p>
          <button onClick={() => router.push("/StudentProfile")} className="w-full bg-orange-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] text-white hover:bg-orange-500 transition-all">Go to Profile</button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation - Properly Aligned to Left */}
        <div className="reveal-animate mb-10">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
            <ArrowLeft size={14} /> Back to Meals
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: FORM (7 Columns) */}
          <div className="lg:col-span-7 space-y-10 reveal-animate">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85]">
                Book <br/> <span className="text-orange-500">Your Bite</span>
              </h1>
              <p className="text-gray-500 uppercase tracking-[0.4em] text-[10px] font-bold">Reserved Student Dining</p>
            </div>
            <br />
                      <div className="lg:col-span-5 reveal-animate sticky top-32">
            {meal && (
              <div className="bg-[#0d0d0d] border border-white/5 p-8 rounded-[3rem] shadow-2xl space-y-8">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest italic">Reviewing Order</span>
                  <UtensilsCrossed size={16} className="text-orange-500" />
                </div>
        <div className="reveal-stack bg-[#0d0d0d] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
          {/* <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-8 italic">01. Summary</h3> */}
          <div className="flex items-center gap-6 mb-10">
            <div className="w-24 h-24 rounded-3xl overflow-hidden border border-white/10 shrink-0 shadow-lg">
              <img src={meal.image} className="w-full h-full object-cover" alt={meal.foodName} />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <h4 className="font-black uppercase text-2xl leading-[1.1] truncate">{meal.foodName}</h4>
              <p className="text-xs text-orange-500 font-bold italic mt-1">{meal.hotelName}</p>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 space-y-4">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500"><span>Price</span><span>₹{meal.price}</span></div>
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500"><span>Fee</span><span>₹2.00</span></div>
            <div className="pt-6 mt-6 border-t border-white/5 flex justify-between items-end">
               <div><p className="text-[10px] font-black uppercase text-gray-500 mb-1">Total</p><span className="text-5xl font-black text-white tracking-tighter leading-none">₹{meal.price + 2}</span></div>
               <ShieldCheck size={24} className="text-green-500 mb-1" />
            </div>
          </div>
        </div>
              </div>
            )}
          </div>
<br />
            <form onSubmit={handlePreBook} className="bg-[#0d0d0d] border border-white/5 p-8 md:p-12 rounded-[3rem] space-y-8 shadow-2xl">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 flex items-center gap-2">
                  <Calendar size={14} className="text-orange-500"/> Select Date
                </label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-orange-500 transition-all text-white font-bold"
                  onChange={(e) => setBookingDate(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 flex items-center gap-2">
                  <Clock size={14} className="text-orange-500"/> Select Time
                </label>
                <input 
                  type="time" 
                  className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-orange-500 transition-all text-white font-bold"
                  onChange={(e) => setBookingTime(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || !meal}
                className="w-full bg-orange-600 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-orange-500 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-orange-600/20"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Confirm Reservation <ChevronRight size={18}/></>}
              </button>
            </form>
          </div>

          {/* RIGHT: PREVIEW (5 Columns) - Aligned to Form Top */}
        </div>
      </div>
    </div>
  );
}