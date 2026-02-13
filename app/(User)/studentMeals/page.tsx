
"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { toast } from "sonner";
import api from "@/app/Api_instance/api";
import Link from "next/link";
import { useCountdown } from "@/app/hook/useCountdown";

interface Meal {
  id: string;
  hotelName: string;
  foodName: string;
  price: number;
  distance: number;
  type: "veg" | "non-veg";
  image: string;
  expiryTime: string;
}

export default function StudentMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
  const [search, setSearch] = useState("");
  const [maxDistance, setMaxDistance] = useState(10);
  const [maxPrice, setMaxPrice] = useState(200);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await api.get("/meals");
        setMeals(res.data);
        setFilteredMeals(res.data);
      } catch (err) {
        toast.error("Failed to load meals");
      }
    };
    fetchMeals();
  }, []);

  useEffect(() => {
    const result = meals.filter((meal) => {
      return (
        meal.foodName.toLowerCase().includes(search.toLowerCase()) &&
        meal.distance <= maxDistance &&
        meal.price <= maxPrice
      );
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
    <div className="min-h-screen bg-[#050505] text-white p-6 pt-32 selection:bg-orange-500/30">
      <div className="max-w-7xl mx-auto">
        {/* --- FILTER CONTROL CENTER --- */}
        <section className="bg-[#0d0d0d] border border-white/5 p-8 rounded-[2.5rem] mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 blur-[80px] rounded-full" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                Search Dish
              </label>
              <input
                type="text"
                placeholder="Biryani, Mandi..."
                className="w-full bg-[#141414] border border-white/5 p-4 rounded-2xl outline-none focus:border-orange-500 transition-all placeholder:text-gray-700"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                  Range
                </label>
                <span className="text-orange-500 font-bold text-xs">
                  {maxDistance} KM
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={maxDistance}
                className="w-full accent-orange-500 cursor-pointer h-1"
                onChange={(e) => setMaxDistance(Number(e.target.value))}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                  Budget
                </label>
                <span className="text-orange-500 font-bold text-xs">
                  ₹{maxPrice}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={maxPrice}
                className="w-full accent-orange-500 cursor-pointer h-1"
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
            </div>
          </div>
        </section>

        {/* --- MEALS FEED --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMeals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}

          {filteredMeals.length === 0 && (
            <div className="col-span-full py-32 text-center bg-[#0d0d0d] border border-dashed border-white/10 rounded-[3rem]">
              <span className="text-4xl mb-4 block">🔍</span>
              <p className="text-gray-500 font-bold uppercase tracking-widest">
                No delicious matches found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ///////// MEAL CARD //////////

function MealCard({ meal }: { meal: Meal }) {
  const timeLeft = useCountdown(meal.expiryTime);

  return (
    <div className="meal-card group bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-orange-500/30 transition-all duration-500 shadow-xl">
      {/* IMAGE HEADER */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={meal.image}
          alt={meal.foodName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />

        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-black/60 backdrop-blur-md text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/10">
            {meal.distance} KM
          </span>
          <span
            className={`${
              meal.type === "veg" ? "bg-green-600" : "bg-red-600"
            } text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg`}
          >
            {meal.type}
          </span>
        </div>

        <div className="absolute bottom-4 right-6 text-orange-500 font-black text-2xl drop-shadow-lg">
          ₹{meal.price}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-8 pt-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-1 bg-orange-500 rounded-full" />
          <h3 className="text-[#737373] text-[10px] font-black uppercase tracking-[0.2em]">
            {meal.hotelName}
          </h3>
        </div>

        <h2 className="text-2xl font-bold mb-6 group-hover:text-orange-500 transition-colors leading-tight min-h-[64px]">
          {meal.foodName}
        </h2>

        <div className="flex items-center justify-between gap-4">
          <div className="text-[10px] font-bold text-gray-500 uppercase">
            Ends in{" "}
            <span
              className={timeLeft === "Expired" ? "text-red-500" : "text-white"}
            >
              {timeLeft}
            </span>
          </div>

          {timeLeft === "Expired" ? (
            <button
              onClick={() => toast.error("Meal is closed")}
              className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest  text-center"
            >
              Closed
            </button>
          ) : (
            <Link
              href={`/studentMeals/${meal.id}`}
              className="flex-1 bg-white text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-500 hover:text-white transition-all text-center"
            >
              Claim Meal
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}





// "use client";
// import { useEffect, useState } from "react";
// import { gsap } from "gsap";
// import { toast } from "sonner";
// import api from "@/app/Api_instance/api";
// import Link from "next/link";
// import { useCountdown } from "@/app/hook/useCountdown";

// interface Meal {
//   id: string;
//   hotelName: string;
//   foodName: string;
//   price: number;
//   type: "veg" | "non-veg";
//   image: string;
//   expiryTime: string;
//   lat: number;
//   lng: number;
//   distance?: number; // ✅ added
// }

// /* --------- DISTANCE FUNCTION --------- */
// function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
//   const R = 6371; // Earth radius in KM
//   const dLat = (lat2 - lat1) * (Math.PI / 180);
//   const dLon = (lon2 - lon1) * (Math.PI / 180);

//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(lat1 * (Math.PI / 180)) *
//       Math.cos(lat2 * (Math.PI / 180)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }

// export default function StudentMeals() {
//   const [meals, setMeals] = useState<Meal[]>([]);
//   const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
//   const [search, setSearch] = useState("");
//   const [maxDistance, setMaxDistance] = useState(10);
//   const [maxPrice, setMaxPrice] = useState(200);

//   /* -------- FETCH MEALS + CALCULATE DISTANCE -------- */
//   useEffect(() => {
//     const fetchMeals = async () => {
//       try {
//         const res = await api.get("/meals");

//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             const userLat = position.coords.latitude;
//             const userLng = position.coords.longitude;
//             console.log("User Location:", userLat, userLng);
//             const mealsWithDistance = res.data.map((meal: Meal) => ({
//               ...meal,
//               distance: Number(
//                 getDistance(userLat, userLng, meal.lat, meal.lng).toFixed(2)
//               ),
//             }));

//             setMeals(mealsWithDistance);
//             setFilteredMeals(mealsWithDistance);
//           },
//           () => {
//             toast.error("Location permission denied");
//             setMeals(res.data);
//             setFilteredMeals(res.data);
//           }
//         );
//       } catch (err) {
//         toast.error("Failed to load meals");
//       }
//     };

//     fetchMeals();
//   }, []);

//   /* -------- FILTER + GSAP ANIMATION -------- */
// useEffect(() => {
//   const result = meals.filter((meal) => {
//     const distanceOk =
//       meal.distance === undefined || meal.distance <= maxDistance; // ✅ KEY FIX

//     return (
//       meal.foodName.toLowerCase().includes(search.toLowerCase()) &&
//       distanceOk &&
//       meal.price <= maxPrice
//     );
//   });

//   const cards = document.querySelectorAll(".meal-card");

//   if (cards.length === 0) {
//     setFilteredMeals(result);
//     return;
//   }

//   gsap.to(cards, {
//     opacity: 0,
//     y: 10,
//     duration: 0.2,
//     onComplete: () => {
//       setFilteredMeals(result);
//       gsap.to(".meal-card", {
//         opacity: 1,
//         y: 0,
//         duration: 0.4,
//         stagger: 0.05,
//       });
//     },
//   });
// }, [search, maxDistance, maxPrice, meals]);


//   return (
//     <div className="min-h-screen bg-[#050505] text-white p-6 pt-32 selection:bg-orange-500/30">
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
//             <div className="col-span-full py-32 text-center bg-[#0d0d0d] border border-dashed border-white/10 rounded-[3rem]">
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

// /* ---------------- MEAL CARD ---------------- */

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
//           <span className="bg-black/60 backdrop-blur-md text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/10">
//             {meal.distance ?? "--"} KM
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
//           <h3 className="text-[#737373] text-[10px] font-black uppercase tracking-[0.2em]">
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
//               className={timeLeft === "Expired" ? "text-red-500" : "text-white"}
//             >
//               {timeLeft}
//             </span>
//           </div>

//           {timeLeft === "Expired" ? (
//             <button
//               onClick={() => toast.error("Meal is closed")}
//               className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-center"
//             >
//               Closed
//             </button>
//           ) : (
//             <Link
//               href={`/studentMeals/${meal.id}`}
//               className="flex-1 bg-white text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-500 hover:text-white transition-all text-center"
//             >
//               Claim Meal
//             </Link>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
