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
import { socket } from "@/utils/socket";

export default function PreBookMenuPage() {
    const { id } = useParams();
    const router = useRouter();
    const containerRef = useRef(null);

    const [menuItem, setMenuItem] = useState<any>(null);
    const [bookingDate, setBookingDate] = useState("");
    const [bookingTime, setBookingTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderCode, setOrderCode] = useState("");

    useEffect(() => {
        if (id) {
            api.get(`/menus/${id}`).then((res) => setMenuItem(res.data)).catch(() => toast.error("Could not load item"));
        }
    }, [id]);

    useGSAP(() => {
        if (menuItem) {
            gsap.from(".reveal-animate", {
                y: 20,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: "power4.out"
            });
        }
    }, { scope: containerRef, dependencies: [menuItem] });

    const handlePreBook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bookingDate || !bookingTime) return toast.error("Select date and time");

        setLoading(true);
        const storedUser = JSON.parse(localStorage.getItem("bitehub_user") || "{}");

        try {
            const bRef = `RES-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
            setOrderCode(bRef);

            const response = await api.post("/preBookedMeals", {
                mealId: id,
                mealName: menuItem.foodName,
                hotelName: menuItem.hotelName,
                restaurantId: menuItem.hotelId, // ensure hotel can be notified
                customerName: storedUser.name,
                customerEmail: storedUser.email,
                date: bookingDate,
                time: bookingTime,
                status: "booked",
                bookingRef: bRef
            });

            // Emit the socket event to notify the hotel instantly about the prebook
            socket.emit("newOrder", {
                hotelId: menuItem.hotelId,
                order: { ...response.data, type: "prebook" }
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
                <div className="bg-[#0d0d0d] border border-white/5 p-12 rounded-[3rem] text-center max-w-sm w-full shadow-2xl">
                    <CheckCircle className="text-green-500 mx-auto mb-6" size={50} />
                    <h2 className="text-3xl font-black uppercase italic text-[#fafafa] mb-2 tracking-tighter">Reserved</h2>
                    <div className="w-full bg-black border-2 border-dashed border-orange-500/30 p-6 rounded-3xl mb-8 relative mt-6">
                        <h3 className="text-4xl font-mono font-black text-orange-500 tracking-tighter">{orderCode}</h3>
                    </div>
                    <p className="text-gray-500 text-xs mb-8 uppercase tracking-widest font-bold">Show this code at the restaurant</p>
                    <button onClick={() => router.push("/StudentProfile")} className="w-full bg-orange-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] text-[#fafafa] hover:bg-orange-500 transition-all">Go to Profile</button>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-[#050505] text-[#fafafa] pt-32 pb-20 px-4 md:px-10">
            <div className="max-w-6xl mx-auto">

                {/* Navigation */}
                <div className="reveal-animate mb-10">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-[#fafafa] transition-colors text-[10px] font-black uppercase tracking-widest">
                        <ArrowLeft size={14} /> Back to Menu
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                    <div className="lg:col-span-7 space-y-10 reveal-animate">
                        <div className="space-y-4">
                            <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85]">
                                Book <br /> <span className="text-orange-500">Your Menu</span>
                            </h1>
                            <p className="text-gray-500 uppercase tracking-[0.4em] text-[10px] font-bold">Reserve from the standard menu</p>
                        </div>

                        <form onSubmit={handlePreBook} className="bg-[#0d0d0d] border border-white/5 p-8 md:p-12 rounded-[3rem] space-y-8 shadow-2xl mt-12">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 flex items-center gap-2">
                                    <Calendar size={14} className="text-orange-500" /> Select Date
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
                                    <Clock size={14} className="text-orange-500" /> Select Time
                                </label>
                                <input
                                    type="time"
                                    className="w-full bg-black border border-white/5 p-5 rounded-2xl outline-none focus:border-orange-500 transition-all text-[#fafafa] font-bold"
                                    onChange={(e) => setBookingTime(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !menuItem}
                                className="w-full bg-orange-600 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-orange-500 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-orange-600/20"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <>Confirm Reservation <ChevronRight size={18} /></>}
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-5 reveal-animate lg:sticky lg:top-32 mt-12 lg:mt-0">
                        {menuItem && (
                            <div className="bg-[#0d0d0d] border border-white/5 p-8 rounded-[3rem] shadow-2xl space-y-8">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest italic">Reviewing Order</span>
                                    <UtensilsCrossed size={16} className="text-orange-500" />
                                </div>

                                <div className="flex flex-col gap-6 mb-4">
                                    <div className="w-full h-48 rounded-3xl overflow-hidden border border-white/5 shrink-0 shadow-lg">
                                        <img src={menuItem.image} className="w-full h-full object-cover" alt={menuItem.foodName} />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <h4 className="font-black uppercase text-3xl leading-[1.1] truncate">{menuItem.foodName}</h4>
                                        <p className="text-xs text-orange-500 font-bold italic mt-2">{menuItem.hotelName}</p>
                                    </div>
                                </div>

                                <div className="border-t border-white/5 pt-8 space-y-4">
                                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500"><span>Price</span><span>₹{menuItem.price}</span></div>
                                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500"><span>Fee</span><span>₹2.00</span></div>
                                    <div className="pt-6 mt-6 border-t border-white/5 flex justify-between items-end">
                                        <div><p className="text-[10px] font-black uppercase text-gray-500 mb-1">Total</p><span className="text-5xl font-black text-[#fafafa] tracking-tighter leading-none">₹{Number(menuItem.price) + 2}</span></div>
                                        <ShieldCheck size={24} className="text-green-500 mb-1" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
