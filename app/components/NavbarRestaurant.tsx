"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, History, PlusCircle, UserCircle, List } from "lucide-react";

interface RestaurantData {
  id: string;
  hotelName: string;
  role: string;
}

export default function NavbarRestaurant() {
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check for restaurant-specific session
    const storedUser = localStorage.getItem("bitehub_user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.role === "hotel" || parsed.role === "restaurant") {
        setRestaurant(parsed);
      }
    }
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (hoveredIndex !== null && !isMobile) {
      gsap.to(bgRef.current, {
        x: hoveredIndex * 110, // Adjusted for slightly wider restaurant links
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
      });
    } else {
      gsap.to(bgRef.current, { opacity: 0, duration: 0.3 });
    }
  }, [hoveredIndex]);

  const navLinks = restaurant ? [
    { name: "Dashboard", path: "/HotelDashboard", icon: <LayoutDashboard size={14} /> },
    { name: "Post Meal", path: "/HotelMealAdd", icon: <PlusCircle size={14} /> },
    { name: "Menu", path: "/HotelMenu", icon: <List size={14} /> },
    { name: "Orders", path: `/HotelHistory/${restaurant.id}`, icon: <History size={14} /> },
  ] : [];

  return (
    <nav className="fixed top-4 md:top-8 left-0 right-0 z-[100] flex items-center justify-center gap-2 md:gap-4 px-2">

      {/* 1. Admin Logo Island */}
      <Link href="/hotelDashboard" className="bg-[#0d0d0d]/90 backdrop-blur-md border border-orange-500/20 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl group transition-all shrink-0">
        <span className="text-orange-500 font-black text-lg md:text-xl group-hover:rotate-12 transition-transform">B</span>
      </Link>

      {/* 2. Management Pill */}
      <div className="relative bg-[#0d0d0d]/80 backdrop-blur-xl border border-white/5 p-1 md:p-1.5 rounded-full flex items-center shadow-2xl">
        <div
          ref={bgRef}
          className="hidden md:block absolute h-10 w-28 bg-orange-600/10 rounded-full blur-[2px] border border-orange-500/30"
          style={{ pointerEvents: 'none', opacity: 0 }}
        />

        {navLinks.map((link, i) => (
          <Link
            key={link.path}
            href={link.path}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`relative z-10 px-4 md:w-[110px] py-2 flex flex-col items-center justify-center transition-all duration-300 ${pathname === link.path ? "text-orange-500" : "text-gray-500 hover:text-[#fafafa]"
              }`}
          >
            <span className="mb-0.5 hidden md:block">{link.icon}</span>
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">{link.name}</span>
          </Link>
        ))}
      </div>

      {/* 3. Business Identity Island */}
      <div
        onClick={() => router.push("/HotelProfile")}
        className="bg-[#0d0d0d]/90 backdrop-blur-md border border-white/5 h-10 md:h-12 px-2 md:px-3 rounded-xl md:rounded-2xl flex items-center shadow-xl cursor-pointer group"
      >
        <div className="flex flex-col items-end mr-3 hidden sm:block">
          <span className="text-[9px] font-black uppercase tracking-tighter text-[#fafafa] group-hover:text-orange-500 transition-colors">
            {restaurant?.hotelName || "Partner"}
          </span>
          {/* <span className="text-[7px] font-bold uppercase text-gray-500">Business Account</span> */}
        </div>
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
          <UserCircle size={18} className="text-[#fafafa]" />
        </div>
      </div>

    </nav>
  );
}