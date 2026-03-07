"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, MapPin, Clock, ImageIcon, Star } from "lucide-react";
import api from "@/app/Api_instance/api";
import { toast } from "sonner";

export default function RestaurantMenuPage() {
    const { id } = useParams();
    const router = useRouter();
    const containerRef = useRef(null);

    const [restaurant, setRestaurant] = useState<any>(null);
    const [menus, setMenus] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        try {
            const resData = await api.get(`/restaurants/${id}`);
            setRestaurant(resData.data);

            const menuData = await api.get(`/menus?hotelId=${id}`);
            setMenus(menuData.data);
        } catch (err) {
            toast.error("Failed to load restaurant details");
        } finally {
            setLoading(false);
        }
    };

    useGSAP(() => {
        if (!loading) {
            const tl = gsap.timeline();
            tl.fromTo(".header-elements",
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power4.out", clearProps: "all" }
            );
            tl.fromTo(".menu-card",
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power4.out", clearProps: "all" },
                "-=0.4"
            );
        }
    }, { scope: containerRef, dependencies: [loading, menus] });

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h2 className="text-[#fafafa] font-black uppercase tracking-widest text-[10px]">Loading Kitchen...</h2>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
                Restaurant not found!
            </div>
        );
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-[#050505] text-[#fafafa] pt-32 pb-20 px-4 md:px-10">
            <div className="max-w-6xl mx-auto">
                <div className="header-elements mb-10">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-[#fafafa] transition-colors text-[10px] font-black uppercase tracking-widest">
                        <ArrowLeft size={14} /> Back to Kitchens
                    </button>
                </div>

                {/* Restaurant Header */}
                <div className="header-elements bg-[#0d0d0d] border border-white/5 p-8 md:p-12 rounded-[3rem] shadow-2xl space-y-8 flex flex-col md:flex-row gap-8 items-center md:items-start mb-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                    <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-white/5 shrink-0 bg-black">
                        {restaurant.image ? (
                            <img src={restaurant.image} className="w-full h-full object-cover" alt={restaurant.hotelName} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20"><ImageIcon size={48} /></div>
                        )}
                    </div>

                    <div className="flex-1 space-y-6 text-center md:text-left relative z-10">
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                <span className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-[10px] font-black">
                                    <Star size={12} className="fill-yellow-500" /> {restaurant.rating || "New"}
                                </span>
                                {restaurant.status === "verified" && (
                                    <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                                        Verified
                                    </span>
                                )}
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none italic">
                                {restaurant.hotelName}
                            </h1>
                        </div>

                        <p className="text-gray-500 text-sm italic line-clamp-2 md:line-clamp-none">
                            {restaurant.description || "Serving delicious meals to the community. Check out our regular menu below and pre-book your favorite dishes!"}
                        </p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl"><MapPin size={14} className="text-orange-500" /> {restaurant.address || "Local Campus"}</span>
                            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl"><Clock size={14} className="text-orange-500" /> Opens 10:00 AM</span>
                        </div>
                    </div>
                </div>

                {/* Menu Section */}
                <div className="header-elements space-y-4 mb-10">
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
                        Menu <span className="text-orange-500">Card</span>
                    </h2>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">
                        Pre-order directly from the kitchen
                    </p>
                </div>

                {menus.length === 0 ? (
                    <div className="header-elements text-center py-20 bg-[#0d0d0d] rounded-[3rem] border border-dashed border-white/5">
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">This kitchen hasn't posted their regular menu yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {menus.map((item) => (
                            <div key={item.id} className="menu-card bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl group flex flex-col h-full hover:border-orange-500/30 transition-all duration-500">
                                <div className="relative h-48 sm:h-56 bg-black overflow-hidden shrink-0">
                                    {item.image ? (
                                        <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/10"><ImageIcon size={48} /></div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-lg backdrop-blur-md ${item.type === 'veg' ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-red-500/20 border-red-500/30 text-red-400'}`}>
                                            {item.type}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 md:p-8 flex flex-col flex-1">
                                    <h3 className="text-xl font-black uppercase tracking-tight mb-2 truncate group-hover:text-orange-500 transition-colors">{item.foodName}</h3>
                                    <p className="text-gray-500 text-xs line-clamp-2 flex-1 italic">{item.description}</p>

                                    <div className="border-t border-white/5 pt-6 mt-6 flex items-center justify-between">
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-0.5">Price</p>
                                            <span className="text-3xl font-black text-[#fafafa] tracking-tighter leading-none">₹{item.price}</span>
                                        </div>

                                        <button
                                            onClick={() => router.push(`/prebookMenu/${item.id}`)}
                                            className="bg-orange-600 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest text-[#fafafa] hover:bg-orange-500 transition-all active:scale-95 shadow-xl shadow-orange-600/20"
                                        >
                                            Pre-Book
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
