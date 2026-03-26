
// "use client";
// import { useEffect, useRef, useState } from "react";
// import { gsap } from "gsap";
// import { toast } from "sonner";
// import api from "@/app/Api_instance/api";
// import Link from "next/link";
// import { useCountdown } from "@/app/hook/useCountdown";
// import { useUserLocation } from "@/app/hook/useUserLocation";
// import { getDistance } from "@/utils/distanceCalc";


// interface Meal {
//   id: string;
//   hotelName: string;
//   foodName: string;
//   price: number;
//   distance: number;
//   type: "veg" | "non-veg";
//   image: string;
//   expiryTime: string;
// }

// export default function StudentMeals() {
//   const [meals, setMeals] = useState<Meal[]>([]);
//   const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
//   const [search, setSearch] = useState("");
//   const [maxDistance, setMaxDistance] = useState(10);
//   const [maxPrice, setMaxPrice] = useState(200);

//   useEffect(() => {
//     const fetchMeals = async () => {
//       try {
//         const res = await api.get("/meals");
//         setMeals(res.data);
//         setFilteredMeals(res.data);
//       } catch (err) {
//         toast.error("Failed to load meals");
//       }
//     };
//     fetchMeals();
//   }, []);

//   useEffect(() => {
//     const result = meals.filter((meal) => {
//       return (
//         meal.foodName.toLowerCase().includes(search.toLowerCase()) &&
//         meal.distance <= maxDistance &&
//         meal.price <= maxPrice
//       );
//     });

//     gsap.to(".meal-card", {
//       opacity: 0,
//       y: 10,
//       duration: 0.2,
//       onComplete: () => {
//         setFilteredMeals(result);
//         gsap.to(".meal-card", {
//           opacity: 1,
//           y: 0,
//           duration: 0.4,
//           stagger: 0.05,
//         });
//       },
//     });
//   }, [search, maxDistance, maxPrice, meals]);

//   return (
//     <div className="min-h-screen bg-[#050505] text-[#fafafa] p-6 pt-32 selection:bg-orange-500/30">
//       <div className="max-w-7xl mx-auto">
//         {/* --- FILTER CONTROL CENTER --- */}
//         <section className="bg-[#0d0d0d] border border-white/5 p-8 rounded-[2.5rem] mb-12 shadow-2xl relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 blur-[80px] rounded-full" />

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
//             <div className="space-y-3">
//               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
//                 Search Dish
//               </label>
//               <input
//                 type="text"
//                 placeholder="Biryani, Mandi..."
//                 className="w-full bg-[#141414] border border-white/5 p-4 rounded-2xl outline-none focus:border-orange-500 transition-all placeholder:text-gray-700"
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>

//             <div className="space-y-3">
//               <div className="flex justify-between">
//                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
//                   Range
//                 </label>
//                 <span className="text-orange-500 font-bold text-xs">
//                   {maxDistance} KM
//                 </span>
//               </div>
//               <input
//                 type="range"
//                 min="1"
//                 max="20"
//                 value={maxDistance}
//                 className="w-full accent-orange-500 cursor-pointer h-1"
//                 onChange={(e) => setMaxDistance(Number(e.target.value))}
//               />
//             </div>

//             <div className="space-y-3">
//               <div className="flex justify-between">
//                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
//                   Budget
//                 </label>
//                 <span className="text-orange-500 font-bold text-xs">
//                   ₹{maxPrice}
//                 </span>
//               </div>
//               <input
//                 type="range"
//                 min="0"
//                 max="500"
//                 step="10"
//                 value={maxPrice}
//                 className="w-full accent-orange-500 cursor-pointer h-1"
//                 onChange={(e) => setMaxPrice(Number(e.target.value))}
//               />
//             </div>
//           </div>
//         </section>

//         {/* --- MEALS FEED --- */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {filteredMeals.map((meal) => (
//             <MealCard key={meal.id} meal={meal} />
//           ))}

//           {filteredMeals.length === 0 && (
//             <div className="col-span-full py-32 text-center bg-[#0d0d0d] border border-dashed border-white/5 rounded-[3rem]">
//               <span className="text-4xl mb-4 block">🔍</span>
//               <p className="text-gray-500 font-bold uppercase tracking-widest">
//                 No delicious matches found
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ///////// MEAL CARD //////////

// function MealCard({ meal }: { meal: Meal }) {
//   const timeLeft = useCountdown(meal.expiryTime);

//   return (
//     <div className="meal-card group bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-orange-500/30 transition-all duration-500 shadow-xl">
//       {/* IMAGE HEADER */}
//       <div className="relative h-56 w-full overflow-hidden">
//         <img
//           src={meal.image}
//           alt={meal.foodName}
//           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />

//         <div className="absolute top-4 left-4 flex gap-2">
//           <span className="bg-black/60 backdrop-blur-md text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/5">
//             {meal.distance} KM
//           </span>
//           <span
//             className={`${
//               meal.type === "veg" ? "bg-green-600" : "bg-red-600"
//             } text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg`}
//           >
//             {meal.type}
//           </span>
//         </div>

//         <div className="absolute bottom-4 right-6 text-orange-500 font-black text-2xl drop-shadow-lg">
//           ₹{meal.price}
//         </div>
//       </div>

//       {/* CONTENT */}
//       <div className="p-8 pt-4">
//         <div className="flex items-center gap-2 mb-2">
//           <div className="w-1 h-1 bg-orange-500 rounded-full" />
//           <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
//             {meal.hotelName}
//           </h3>
//         </div>

//         <h2 className="text-2xl font-bold mb-6 group-hover:text-orange-500 transition-colors leading-tight min-h-[64px]">
//           {meal.foodName}
//         </h2>

//         <div className="flex items-center justify-between gap-4">
//           <div className="text-[10px] font-bold text-gray-500 uppercase">
//             Ends in{" "}
//             <span
//               className={timeLeft === "Expired" ? "text-red-500" : "text-[#fafafa]"}
//             >
//               {timeLeft}
//             </span>
//           </div>

//           {timeLeft === "Expired" ? (
//             <button
//               onClick={() => toast.error("Meal is closed")}
//               className="flex-1 bg-red-600 text-[#fafafa] py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest  text-center"
//             >
//               Closed
//             </button>
//           ) : (
//             <Link
//               href={`/studentMeals/${meal.id}`}
//               className="flex-1 bg-white text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-500 hover:text-[#fafafa] transition-all text-center"
//             >
//               Claim Meal
//             </Link>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { toast } from "sonner";
import api from "@/app/Api_instance/api";

gsap.registerPlugin(ScrollTrigger);
import Link from "next/link";
import { useCountdown } from "@/app/hook/useCountdown";
import { useUserLocation } from "@/app/hook/useUserLocation";
import { getDistance } from "@/utils/distanceCalc";
import { Search, MapPin, Banknote, Clock, ChevronRight, Filter } from "lucide-react";

interface Meals {
  id: string;
  restaurantId: string;
  hotelName: string;
  foodName: string;
  price: number;
  distance?: number;
  type: "veg" | "non-veg";
  image: string;
  expiryTime: string;
}

export default function StudentMeals() {
  const userLocation = useUserLocation();
  const [meals, setMeals] = useState<Meals[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<Meals[]>([]);
  const [search, setSearch] = useState("");
  const [maxDistance, setMaxDistance] = useState(30);
  const [maxPrice, setMaxPrice] = useState(200);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Top-down staggered reveal on load
    gsap.fromTo(".page-header",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
    );

    gsap.fromTo(".filter-panel",
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, delay: 0.2, ease: "back.out(1.5)" }
    );
  }, { scope: containerRef });

  // ==============================
  // FETCH MEALS + DISTANCE LOGIC
  // ==============================
  // useEffect(() => {
  //   const fetchMealsWithDistance = async () => {
  //     try {
  //       const [mealsRes, restRes] = await Promise.all([
  //         api.get("/meals"),
  //         api.get("/restaurants")
  //       ]);

  //       const restaurants = restRes.data;

  //       const updatedMeals = mealsRes.data.map((meal: any) => {
  //         const restaurant = restaurants.find((r: any) => r.id === meal.restaurantId);

  //         let distance = undefined;
  //         if (userLocation && restaurant) {
  //           distance = Number(getDistance(
  //             userLocation.lat,
  //             userLocation.lng,
  //             Number(restaurant.lat),
  //             Number(restaurant.lng)
  //           ));
  //         }

  //         return { ...meal, distance };
  //       });

  //       // SORT NEAREST FIRST (If distance exists)
  //       updatedMeals.sort((a: any, b: any) => (a.distance ?? 999) - (b.distance ?? 999));

  //       setMeals(updatedMeals);
  //       setFilteredMeals(updatedMeals);
  //     } catch (err) {
  //       toast.error("Failed to load meals");
  //     }
  //   };

  //   fetchMealsWithDistance();
  // }, [userLocation]); // Re-runs when location is found
  useEffect(() => {
    const fetchAndProcessMeals = async () => {
      try {
        const [mealsRes, restRes] = await Promise.all([
          api.get("/meals"),
          api.get("/restaurants"),
        ]);

        const restaurants = restRes.data;
        const now = new Date().getTime();

        // 🔥 1️⃣ CHECK & UPDATE EXPIRED MEALS
        await Promise.all(
          mealsRes.data.map(async (meal: any) => {
            if (!meal.expired && meal.expiryTime) {
              const expireTime = new Date(meal.expiryTime).getTime();

              if (expireTime <= now) {
                await api.patch(`/meals/${meal.id}`, {
                  expired: true,
                });
              }
            }
          })
        );

        // 🔥 2️⃣ FETCH UPDATED MEALS AGAIN
        const updatedMealsRes = await api.get("/meals");

        const processedMeals = updatedMealsRes.data
          //  FILTER OUT EXPIRED
          .filter((meal: any) => !meal.expired)

          //  ADD DISTANCE
          .map((meal: any) => {
            const restaurant = restaurants.find(
              (r: any) => r.id === meal.restaurantId
            );

            let distance = undefined;

            if (userLocation && restaurant) {
              distance = Number(
                getDistance(
                  userLocation.lat,
                  userLocation.lng,
                  Number(restaurant.lat),
                  Number(restaurant.lng)
                )
              );
            }

            return { ...meal, distance };
          });

        // SORT BY DISTANCE
        processedMeals.sort(
          (a: any, b: any) => (a.distance ?? 999) - (b.distance ?? 999)
        );

        setMeals(processedMeals);
        setFilteredMeals(processedMeals);

      } catch (err) {
        toast.error("Failed to load meals");
      }
    };

    fetchAndProcessMeals();

    // 🔁 Auto re-check every 30 seconds
    const interval = setInterval(fetchAndProcessMeals, 30000);

    return () => clearInterval(interval);

  }, [userLocation]);
  // ==============================
  // FILTER + GSAP ANIMATION
  // ==============================
  useEffect(() => {
    const result = meals.filter((meal) => {
      const matchesSearch = meal.foodName.toLowerCase().includes(search.toLowerCase());
      const matchesPrice = meal.price <= maxPrice;
      const matchesDistance = meal.distance ? meal.distance <= maxDistance : true;
      return matchesSearch && matchesPrice && matchesDistance;
    });

    gsap.to(".meal-card", {
      opacity: 0,
      y: 10,
      duration: 0.2,
      onComplete: () => {
        setFilteredMeals(result);
        gsap.to(".meal-card", {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.05,
        });
      },
    });
  }, [search, maxDistance, maxPrice, meals]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-[#fafafa] p-6 pt-32 pb-20 selection:bg-orange-500/30">
      <div className="max-w-7xl mx-auto">

        {/* HEADER SECTION */}
        <div className="page-header mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none">
              Explore <br /> <span className="text-orange-500">BiteHub</span>
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 flex items-center gap-2">
              <MapPin size={12} className="text-orange-500" />
              {userLocation ? "Location Synced" : "Fetching Location..."}
            </p>
          </div>
        </div>

        {/* --- FILTER CONTROL PANEL --- */}
        <section className="filter-panel bg-[#0d0d0d] border border-white/5 p-8 rounded-[2.5rem] mb-16 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 blur-[80px] rounded-full group-hover:bg-orange-600/10 transition-all" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {/* Search Box */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <Search size={14} /> Search Dish
              </label>
              <input
                type="text"
                placeholder="What are you craving?"
                className="w-full bg-[#141414] border border-white/5 p-4 rounded-2xl outline-none focus:border-orange-500 transition-all placeholder:text-gray-700 font-bold"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Distance Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                  <MapPin size={14} /> Range
                </label>
                <span className="text-orange-500 font-black text-xs">{maxDistance} KM</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={maxDistance}
                className="w-full accent-orange-500 cursor-pointer h-1.5 bg-white/5 rounded-full appearance-none"
                onChange={(e) => setMaxDistance(Number(e.target.value))}
              />
            </div>

            {/* Price Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                  <Banknote size={14} /> Max Budget
                </label>
                <span className="text-orange-500 font-black text-xs">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={maxPrice}
                className="w-full accent-orange-500 cursor-pointer h-1.5 bg-white/5 rounded-full appearance-none"
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
            </div>
          </div>
        </section>

        {/* --- MEALS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredMeals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}

          {filteredMeals.length === 0 && (
            <div className="col-span-full py-32 text-center bg-[#0d0d0d] border border-dashed border-white/5 rounded-[3rem]">
              <div className="text-5xl mb-6">🔍</div>
              <p className="text-gray-500 font-black uppercase tracking-widest text-xs">
                No bites found in this range. <br /> Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ///////// MODERN MEAL CARD //////////

function MealCard({ meal }: { meal: Meals }) {
  const timeLeft = useCountdown(meal.expiryTime);


  return (
    <div className="meal-card group bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-orange-500/30 transition-all duration-500 shadow-xl relative">

      {/* Image Section */}
      <div className="relative h-64 w-full overflow-hidden">
        <img
          src={meal.image}
          alt={meal.foodName}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent opacity-90" />

        {/* Distance Badge */}
        <div className="absolute top-6 left-6">
          <span className="bg-black/60 backdrop-blur-xl text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest border border-white/5 flex items-center gap-2">
            <MapPin size={10} className="text-orange-500" />
            {typeof meal.distance === "number" ? `${meal.distance.toFixed(1)} KM` : "--- KM"}
          </span>
        </div>

        {/* Veg/Non-Veg Indicator */}
        <div className="absolute top-6 right-6">
          <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] border border-white/20 ${meal.type === 'veg' ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>

        <div className="absolute bottom-6 left-8">
          <span className="text-4xl font-black text-[#fafafa] tracking-tighter">₹{meal.price}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-1 bg-orange-500 rounded-full animate-pulse" />
          <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] truncate">
            {meal.hotelName}
          </h3>
        </div>

        <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none mb-8 group-hover:text-orange-500 transition-colors">
          {meal.foodName}
        </h2>

        <div className="flex items-center justify-between gap-4 border-t border-white/5 pt-8">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Time Remaining</span>
            <div className={`text-xs font-bold flex items-center gap-2 ${timeLeft === "Expired" ? "text-red-500" : "text-[#fafafa]"}`}>
              <Clock size={12} /> {timeLeft}
            </div>
          </div>

          {timeLeft === "Expired" ? (
            <button className="px-6 py-4 bg-red-600/10 border border-red-500/20 text-red-500 rounded-2xl font-black uppercase text-[10px] tracking-widest">
              Closed
            </button>
          ) : (
            <Link
              href={`/studentMeals/${meal.id}`}
              className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-500 hover:text-[#fafafa] transition-all shadow-lg active:scale-95"
            >
              Claim <ChevronRight className="inline ml-1" size={14} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}