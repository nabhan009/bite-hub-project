// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import { gsap } from "gsap";
// import {
//     UtensilsCrossed, Search, MapPin, Clock, Hotel, ArrowLeft, Building2
// } from "lucide-react";
// import api from "@/app/Api_instance/api";
// import { AdminSidebar } from "@/app/components/Slidebar";
// import {useCountdown} from "@/app/hook/useCountdown";

// interface Meal {
//     id: string;
//     restaurantId: string;
//     expiryTime: string;
// }
// export default function MealsManagement() {
//     const [meals, setMeals] = useState<any[]>([]);
//     const [hotels, setHotels] = useState<any[]>([]);
//     const [filterHotel, setFilterHotel] = useState("All");
//     const [search, setSearch] = useState("");
//     const [loading, setLoading] = useState(true);
//     const containerRef = useRef(null);

//     useEffect(() => {
//         const fetchMealsAndHotels = async () => {
//             try {
//                 const [mealsRes, hotelsRes] = await Promise.all([
//                     api.get("/meals"),
//                     api.get("/restaurants")
//                 ]);
//                 setMeals(mealsRes.data);
//                 setHotels(hotelsRes.data);
//             } catch (err) {
//                 console.error("Failed to fetch meals", err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchMealsAndHotels();
//     }, []);

//     useEffect(() => {
//         if (!loading) {
//             gsap.fromTo(".meal-card",
//                 { opacity: 0, y: 20 },
//                 { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power2.out", clearProps: "all" }
//             );
//         }
//     }, [loading, filterHotel, search]);

//     const filteredMeals = meals.filter(meal => {
//         const mealName = (meal.foodName || "").toLowerCase();
//         const hotelName = (meal.hotelName || "").toLowerCase();
//         const searchLower = search.toLowerCase();

//         const matchesSearch = mealName.includes(searchLower) || hotelName.includes(searchLower);
//         const matchesFilter = filterHotel === "All" || meal.hotelName === filterHotel;

//         return matchesSearch && matchesFilter;
//     });
//         const timeLeft = useCountdown(meals.expiryTime);
//     return (
//         <div ref={containerRef} className="flex min-h-screen bg-[#050505] text-[#fafafa] font-sans">
//             <AdminSidebar />

//             <main className="flex-1 ml-16 md:ml-20 p-4 md:p-10 overflow-x-hidden overflow-y-auto">
//                 <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
//                     <div>
//                         <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">
//                             Platform <span className="text-orange-500">Meals</span>
//                         </h1>
//                         <p className="text-[#737373] text-[10px] md:text-xs font-bold uppercase tracking-widest mt-2">
//                             Centralized view of all surplus food across the network
//                         </p>
//                     </div>
//                 </header>

//                 {/* --- FILTERS --- */}
//                 <div className="flex flex-col xl:flex-row gap-4 mb-8 w-full">
//                     <div className="relative flex-1">
//                         <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#404040]" size={18} />
//                         <input
//                             className="w-full bg-[#0d0d0d] border border-white/5 p-4 pl-14 rounded-2xl outline-none focus:border-orange-500/50 transition-all font-bold text-sm"
//                             placeholder="Search by meal name or hotel..."
//                             onChange={(e) => setSearch(e.target.value)}
//                         />
//                     </div>

//                     <div className="flex items-center bg-[#0d0d0d] p-1.5 rounded-2xl border border-white/5 group relative min-w-[200px]">
//                         <Building2 className="absolute left-4 text-[#404040]" size={16} />
//                         <select
//                             className="w-full bg-transparent appearance-none pl-12 pr-4 py-3 text-xs font-bold uppercase tracking-widest text-[#737373] focus:text-white outline-none cursor-pointer"
//                             value={filterHotel}
//                             onChange={(e) => setFilterHotel(e.target.value)}
//                         >
//                             <option value="All" className="bg-[#0d0d0d] text-white">All Hotels</option>
//                             {hotels.map((h, i) => (
//                                 <option key={i} value={h.hotelName} className="bg-[#0d0d0d] text-white">
//                                     {h.hotelName}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 {/* --- MEALS GRID --- */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                     {filteredMeals.map((meal, index) => (
//                         <div key={index} className="meal-card bg-[#0d0d0d] border border-white/5 rounded-[2rem] overflow-hidden group hover:border-orange-500/30 transition-all shadow-xl flex flex-col">
//                             <div className="relative h-48 w-full overflow-hidden">
//                                 <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent z-10" />
//                                 <img src={meal.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} alt={meal.foodName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
//                                 <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
//                                     <UtensilsCrossed size={12} className={meal.type === 'veg' ? 'text-green-500' : 'text-red-500'} />
//                                     <span className="text-[9px] font-black uppercase tracking-widest">{meal.type || 'Unknown'}</span>
//                                 </div>
//                             </div>

//                             <div className="p-6 flex flex-col flex-1">
//                                 <h2 className="text-xl font-black uppercase leading-tight tracking-tight text-white mb-2">{meal.foodName}</h2>

//                                 <div className="flex items-center gap-2 text-orange-500 mb-6 focus-within:">
//                                     <Hotel size={14} />
//                                     <span className="text-xs font-bold uppercase tracking-widest">{meal.hotelName}</span>
//                                 </div>

//                                 <div className="mt-auto space-y-3 pt-4 border-t border-white/5">
//                                     <div className="flex justify-between items-center">
//                                         <span className="text-[10px] text-[#737373] font-bold uppercase tracking-widest">Price</span>
//                                         <span className="text-lg font-black italic">₹{meal.price}</span>
//                                     </div>
//                                     <div className="flex justify-between items-center bg-white/5 px-4 py-2 rounded-xl">
//                                         <div className="flex items-center gap-2 text-[#737373]">
//                                             <Clock size={12} />
//                                             <span className="text-[9px] font-bold uppercase tracking-widest">Expires</span>
//                                         </div>
//                                         <span className="text-[10px] font-bold text-white uppercase">{timeLeft}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {filteredMeals.length === 0 && !loading && (
//                     <div className="py-24 text-center border border-white/5 rounded-[2.5rem] bg-white/[0.01] mt-6">
//                         <UtensilsCrossed size={40} className="mx-auto mb-4 text-[#202020]" />
//                         <p className="text-[10px] font-black text-[#404040] uppercase tracking-[0.3em]">No Meals Found</p>
//                     </div>
//                 )}

//             </main>
//         </div>
//     );
// }



"use client";
import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import {
    UtensilsCrossed, Search, Hotel, Clock, Building2
} from "lucide-react";
import api from "@/app/Api_instance/api";
import { AdminSidebar } from "@/app/components/Slidebar";
import { useCountdown } from "@/app/hook/useCountdown";

// 1. Create a separate component for each card to handle its own countdown logic
const MealCard = ({ meal }: { meal: any }) => {
    // Each instance of this component will now call the hook correctly
    const timeLeft = useCountdown(meal.expiryTime);

    return (
        <div className="meal-card bg-[#0d0d0d] border border-white/5 rounded-[2rem] overflow-hidden group hover:border-orange-500/30 transition-all shadow-xl flex flex-col h-full">
            <div className="relative h-48 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent z-10" />
                <img 
                    src={meal.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} 
                    alt={meal.foodName} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
                    <UtensilsCrossed size={12} className={meal.type === 'veg' ? 'text-green-500' : 'text-red-500'} />
                    <span className="text-[9px] font-black uppercase tracking-widest">{meal.type || 'Unknown'}</span>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
                <h2 className="text-xl font-black uppercase leading-tight tracking-tight text-white mb-2 truncate">
                    {meal.foodName}
                </h2>

                <div className="flex items-center gap-2 text-orange-500 mb-6">
                    <Hotel size={14} />
                    <span className="text-xs font-bold uppercase tracking-widest">{meal.hotelName}</span>
                </div>

                <div className="mt-auto space-y-3 pt-4 border-t border-white/5">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-[#737373] font-bold uppercase tracking-widest">Price</span>
                        <span className="text-lg font-black italic">₹{meal.price}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 px-4 py-2 rounded-xl">
                        <div className="flex items-center gap-2 text-[#737373]">
                            <Clock size={12} />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Expires</span>
                        </div>
                        <span className={`text-[10px] font-bold uppercase ${timeLeft === "Expired" ? "text-red-500" : "text-white"}`}>
                            {timeLeft}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function MealsManagement() {
    const [meals, setMeals] = useState<any[]>([]);
    const [hotels, setHotels] = useState<any[]>([]);
    const [filterHotel, setFilterHotel] = useState("All");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchMealsAndHotels = async () => {
            try {
                const [mealsRes, hotelsRes] = await Promise.all([
                    api.get("/meals"),
                    api.get("/restaurants")
                ]);
                setMeals(mealsRes.data);
                setHotels(hotelsRes.data);
            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMealsAndHotels();
    }, []);

    useEffect(() => {
        if (!loading) {
            gsap.fromTo(".meal-card",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power2.out", clearProps: "all" }
            );
        }
    }, [loading, filterHotel, search]);

    const filteredMeals = meals.filter(meal => {
        const mealName = (meal.foodName || "").toLowerCase();
        const hotelName = (meal.hotelName || "").toLowerCase();
        const searchLower = search.toLowerCase();
        const matchesSearch = mealName.includes(searchLower) || hotelName.includes(searchLower);
        const matchesFilter = filterHotel === "All" || meal.hotelName === filterHotel;
        return matchesSearch && matchesFilter;
    });

    return (
        <div ref={containerRef} className="flex min-h-screen bg-[#050505] text-[#fafafa] font-sans">
            <AdminSidebar />
            <main className="flex-1 ml-16 md:ml-20 p-4 md:p-10 overflow-x-hidden overflow-y-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">
                        Platform <span className="text-orange-500">Meals</span>
                    </h1>
                    <p className="text-[#737373] text-[10px] md:text-xs font-bold uppercase tracking-widest mt-2">
                        Centralized view of all surplus food across the network
                    </p>
                </header>

                <div className="flex flex-col xl:flex-row gap-4 mb-8 w-full">
                    <div className="relative flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#404040]" size={18} />
                        <input
                            className="w-full bg-[#0d0d0d] border border-white/5 p-4 pl-14 rounded-2xl outline-none focus:border-orange-500/50 transition-all font-bold text-sm"
                            placeholder="Search by meal name or hotel..."
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center bg-[#0d0d0d] p-1.5 rounded-2xl border border-white/5 group relative min-w-[200px]">
                        <Building2 className="absolute left-4 text-[#404040]" size={16} />
                        <select
                            className="w-full bg-transparent appearance-none pl-12 pr-4 py-3 text-xs font-bold uppercase tracking-widest text-[#737373] focus:text-white outline-none cursor-pointer"
                            value={filterHotel}
                            onChange={(e) => setFilterHotel(e.target.value)}
                        >
                            <option value="All" className="bg-[#0d0d0d] text-white">All Hotels</option>
                            {hotels.map((h, i) => (
                                <option key={i} value={h.hotelName} className="bg-[#0d0d0d] text-white">{h.hotelName}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredMeals.map((meal) => (
                        <MealCard key={meal.id} meal={meal} />
                    ))}
                </div>

                {filteredMeals.length === 0 && !loading && (
                    <div className="py-24 text-center border border-white/5 rounded-[2.5rem] bg-white/[0.01] mt-6">
                        <UtensilsCrossed size={40} className="mx-auto mb-4 text-[#202020]" />
                        <p className="text-[10px] font-black text-[#404040] uppercase tracking-[0.3em]">No Meals Found</p>
                    </div>
                )}
            </main>
        </div>
    );
}