"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/Api_instance/api";
import { toast } from "sonner";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { CheckCircle2, Clock, CreditCard, Loader2, ArrowLeft, ShieldCheck, Lock } from "lucide-react";
import { socket } from "@/utils/socket";

export default function CheckoutPage() {
  const { id } = useParams();
  const router = useRouter();
  const containerRef = useRef(null);

  const [meal, setMeal] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderCode, setOrderCode] = useState("");
  const [securityPin, setSecurityPin] = useState("");
  const [isBitePaySelected, setIsBitePaySelected] = useState(false);

  // FETCH MEAL DATA
  useEffect(() => {
    if (id) {
      api.get(`/meals/${id}`)
        .then((res) => setMeal(res.data))
        .catch(() => toast.error("Could not load meal data"));
    }
  }, [id]);

  // ANIMATION
  useGSAP(() => {
    if (!orderComplete && meal) {
      gsap.from(".reveal-stack", {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power4.out"
      });
    }
  }, { scope: containerRef, dependencies: [meal, orderComplete] });

  // 1. LOADING STATE (Prevents black screen on refresh)
  if (!meal && !orderComplete) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-white font-black uppercase tracking-widest text-[10px]">Verifying Meal Details...</h2>
      </div>
    );
  }

  const handleVerifyAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBitePaySelected) return toast.error("Please select BitePay");

    setLoading(true);
    const storedUser = JSON.parse(localStorage.getItem("bitehub_user") || "{}");

    if (securityPin !== storedUser.pin && securityPin !== "1234") {
      toast.error("Invalid PIN");
      setLoading(false);
      return;
    }
    if (securityPin.length < 4) {
      toast.error("PIN must be 4 digits");
      setLoading(false);
      return;
    }
    if (securityPin === "") {
      toast.error("create a PIN in your profile for quick checkout or use '1234' for testing");
      setLoading(false);
      return;
    }


    const uniqueCode = `BITE-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    try {
      const response = await api.post("/mealsOrdered", {
        mealId: id,
        mealName: meal.foodName,
        hotelName: meal.hotelName,
        price: meal.price,
        customerName: storedUser.name || "Guest",
        customerEmail: storedUser.email || "guest@example.com",
        bookingRef: uniqueCode,
        paymentStatus: "paid",
        timestamp: new Date().toISOString(),
        status: "processing",
        restaurantId: meal.restaurantId || meal.hotelId, // Adding this so we know who to notify
      });

      // EMIT THE SOCKET EVENT TO NOTIFY THE HOTEL INSTANTLY
      socket.emit("newOrder", {
        hotelId: meal.restaurantId || meal.hotelId,
        order: response.data
      });

      setOrderCode(uniqueCode);
      setOrderComplete(true);
    } catch (err) {
      toast.error("Transaction Error");
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <div className="bg-[#0d0d0d] border border-white/10 p-10 rounded-[3rem] text-center max-w-sm w-full shadow-2xl flex flex-col items-center">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6"><CheckCircle2 size={40} /></div>
          <h2 className="text-3xl font-black uppercase italic text-white mb-8 tracking-tighter">Verified</h2>
          <div className="w-full bg-black border-2 border-dashed border-orange-500/30 p-8 rounded-3xl mb-8 relative">
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#0d0d0d] rounded-full" />
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#0d0d0d] rounded-full" />
            <h3 className="text-5xl font-mono font-black text-orange-500 tracking-tighter">{orderCode}</h3>
          </div>
          <button onClick={() => router.push("/studentMeals")} className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-500 hover:text-white transition-all">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-4 md:px-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="reveal-stack">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest"><ArrowLeft size={16} /> Back</button>
        </div>

        <div className="reveal-stack bg-[#0d0d0d] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
          <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-8 italic">01. Summary</h3>
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

        <div className="reveal-stack bg-[#0d0d0d] border border-white/5 p-8 rounded-[2.5rem] space-y-8 shadow-2xl">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest italic ml-1">02. Payment</label>
            <div onClick={() => setIsBitePaySelected(true)} className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex items-center justify-between ${isBitePaySelected ? 'border-orange-500 bg-orange-500/5' : 'border-white/5 bg-black/40'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isBitePaySelected ? 'bg-orange-500 text-white' : 'bg-white/5 text-gray-500'}`}><CreditCard size={24} /></div>
                <span className="font-black uppercase text-sm tracking-tight">BitePay Wallet</span>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isBitePaySelected ? 'border-orange-500' : 'border-white/10'}`}>{isBitePaySelected && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />}</div>
            </div>
          </div>
          <div className={`space-y-4 transition-all duration-500 ${isBitePaySelected ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 flex items-center gap-2 italic"><Lock size={12} /> 03. PIN</label>
            <input type="password" maxLength={4} value={securityPin} onChange={(e) => setSecurityPin(e.target.value)} className="w-full bg-black border border-white/10 p-6 rounded-2xl text-center text-4xl font-black tracking-[0.8em] focus:border-orange-500 outline-none transition-all" placeholder="****" />
          </div>
          <button onClick={handleVerifyAndPay} disabled={loading || securityPin.length < 4} className="w-full bg-orange-600 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-orange-500 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-30">
            {loading ? <Loader2 className="animate-spin" /> : "Verify & Pay"}
          </button>
        </div>
      </div>
    </div>
  );
}