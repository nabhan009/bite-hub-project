"use client";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { gsap } from "gsap";
import api from "@/app/Api_instance/api";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Info,
  ShoppingCart,
  CalendarCheck,
} from "lucide-react";
import { toast } from "sonner";
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
  description?: string;
}

export default function MealDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [meal, setMeal] = useState<Meal | null>(null);
  const containerRef = useRef(null);
  const timeLeft = useCountdown(meal?.expiryTime || "");
  useEffect(() => {
    const fetchMealDetails = async () => {
      try {
        // Fetch specific meal by ID
        const res = await api.get(`/meals/${id}`);
        setMeal(res.data);
      } catch (err) {
        toast.error("Meal not found");
        router.push("/studentMeals");
      }
    };
    fetchMealDetails();
  }, [id]);

  useLayoutEffect(() => {
    if (!meal) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".animate-up",
        {
          y: 80,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 1,
          ease: "power4.out",
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [meal]);

  if (!meal)
    return (
      <div className="h-screen bg-[#050505] flex items-center justify-center text-orange-500 font-black italic">
        LOADING...
      </div>
    );

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#050505] text-white p-6 pt-32 selection:bg-orange-500/30"
    >
      <div className="max-w-6xl mx-auto">
        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors mb-12 uppercase text-[10px] font-black tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Meals
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT: IMAGE SECTION */}
          <div className="animate-up relative aspect-square lg:aspect-auto lg:h-[70vh] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
            <img
              src={meal.image}
              className="w-full h-full object-cover"
              alt={meal.foodName}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-10 left-10">
              <span
                className={`${meal.type === "veg" ? "bg-green-600" : "bg-red-600"} px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl`}
              >
                {meal.type}
              </span>
            </div>
          </div>

          {/* RIGHT: CONTENT SECTION */}
          <div className="space-y-8">
            <div className="animate-up flex gap-4">
              <span className="flex items-center gap-1 text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-500/10 px-4 py-2 rounded-full border border-orange-500/20">
                <MapPin size={12} /> {meal.distance} KM
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">
                <Clock size={12} /> {timeLeft}
              </span>
            </div>

            <div className="animate-up">
              <h3 className="text-gray-500 text-xs font-black uppercase tracking-[0.4em] mb-3">
                {meal.hotelName}
              </h3>
              <h1 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-none">
                {meal.foodName.split(" ")[0]} <br />
                <span className="text-orange-500 italic">
                  {meal.foodName.split(" ").slice(1).join(" ")}
                </span>
              </h1>
              <p className="text-4xl font-black mt-6 text-white tracking-tight">
                ₹{meal.price}
              </p>
            </div>

            <div className="animate-up space-y-4 pt-4 border-t border-white/5">
              <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                <Info size={16} /> About this meal
              </h4>
              <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                {meal.description ||
                  "A masterfully crafted student meal prepared with fresh ingredients. High protein, balanced nutrition, and delivered straight from the kitchen of " +
                    meal.hotelName +
                    "."}
              </p>
            </div>

            {/* BUTTON ACTIONS */}
            <div className="animate-up flex flex-col sm:flex-row gap-4 pt-8">
              <button
                onClick={() => router.push(`/Checkout/${meal.id}`)}
                className="flex-1 bg-orange-600 hover:bg-orange-500 text-white py-6 rounded-[1.5rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                <ShoppingCart size={18} /> Buy Now
              </button>
              <button
              onClick={() => router.push(`/prebook/${meal.id}`)}
              className="flex-1 border border-white/20 hover:bg-white hover:text-black text-white py-6 rounded-[1.5rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95">
                <CalendarCheck size={18} /> Pre-Book
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
