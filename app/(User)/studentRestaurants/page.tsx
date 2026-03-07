// "use client";
"use client";
import { useLayoutEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Clock, Star, UtensilsCrossed,Store } from "lucide-react";
import api from "@/app/Api_instance/api";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Restaurant {
  id: string;
  hotelName: string;
  location: string;
  image: string;
  description: string;
  distance: number;
  closingTime: string;
  rating: number;
}

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Fetch Restaurants
  useLayoutEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get("/restaurants");
        setRestaurants(res.data.slice(0, 3)); // Show only first 3 restaurants
        console.log(res.data);
      } catch (err) {
        toast.error("Failed to load restaurant partners");
      }
    };
    fetchRestaurants();
  }, []);

  // Entrance Animation
  useLayoutEffect(() => {
    if (restaurants.length > 0) {
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        gsap.from(".res-card", {
          y: 80,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".res-grid",
            start: "top 85%",
          }
        });
      }, containerRef);

      return () => ctx.revert();
    }
  }, [restaurants]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-[#fafafa] p-6 pt-32">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="space-y-2">
            <h1 className="text-6xl font-black uppercase tracking-tighter">
              Bite<span className="text-orange-500 italic">Partners</span>
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">
              Explore {restaurants.length} kitchens working with BiteHub
            </p>
          </div>
        </header>

        {/* RESTAURANT GRID */}
        <div className="res-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {restaurants.map((res) => (
            <Link href={`/restaurants/${res.id}`} key={res.id} className="res-card group">
              <div className="bg-[#0d0d0d] border border-white/5 rounded-[3rem] overflow-hidden hover:border-orange-500/30 transition-all duration-500 shadow-2xl">

                {/* Image Section */}
                <div className="relative h-72 overflow-hidden">
                  {/* <img
                    src={res.image}
                    alt={res.hotelName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  /> */}
                  <Store size={48} className="w-full h-full object-cover text-gray-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />

                  {/* Status Badges */}
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    {/* <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5">
                      <MapPin size={12} className="text-orange-500" /> {res.distance} KM
                    </span> */}
                    <span className="flex items-center gap-1.5 bg-red-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      <Clock size={12} /> Closes {res.closingTime}
                    </span>
                  </div>

                  <div className="absolute bottom-6 left-8">
                    {/* <div className="flex items-center gap-1 bg-orange-500 px-3 py-1 rounded-lg w-fit mb-2">
                      <Star size={12} fill="white" />
                      <span className="text-[10px] font-black">{res.rating}</span>
                    </div> */}
                    <h2 className="text-3xl font-black uppercase tracking-tighter leading-none group-hover:text-orange-500 transition-colors">
                      {res.hotelName}
                    </h2>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-8">
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2 italic">
                    "{res.description}"
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* MORE BUTTON */}
        <div className="mt-12 flex justify-center gap-6">
          <button
            onClick={() => router.push("/studentRestaurants")}
            className="group px-10 py-4 bg-orange-600 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-orange-600 transition-all duration-500"
          >
            More
          </button>
        </div>

        {/* EMPTY STATE */}
        {restaurants.length === 0 && (
          <div className="text-center py-40 bg-[#0d0d0d] rounded-[4rem] border border-dashed border-white/5 mt-10">
            <UtensilsCrossed size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-500 font-black uppercase tracking-widest">
              No restaurants found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
