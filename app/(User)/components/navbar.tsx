"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
interface UserData {
  name: string;
  role: string;
  email: string;
}

export default function NavbarPersonalized() {
  const [user, setUser] = useState<UserData | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Retrieve user data from local storage
    const storedUser = localStorage.getItem("bitehub_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // GSAP: Moving the "Liquid" highlight
  useEffect(() => {
    if (hoveredIndex !== null) {
      gsap.to(bgRef.current, {
        x: hoveredIndex * 100,
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
      });
    } else {
      gsap.to(bgRef.current, { opacity: 0, duration: 0.3 });
    }
  }, [hoveredIndex]);

  // GSAP: Reveal name on profile hover
  const handleProfileHover = (isEntering: boolean) => {
    gsap.to(nameRef.current, {
      width: isEntering ? "auto" : 0,
      opacity: isEntering ? 1 : 0,
      marginLeft: isEntering ? 8 : 0,
      duration: 0.4,
      ease: "power3.out"
    });
  };

  const navLinks = [
      { name: "Meals", path: "/studentMeals" },
      { name: "About", path: "/studentAbout" },
      // { name: "Restaurants", path: "/studentRestaurants" },
      { name: "Contact", path: "/studentContact" },
  ];

  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 w-full justify-center px-4">
      
      {/* 1. Logo Island */}
      <Link href="/" className="bg-[#0d0d0d]/80 backdrop-blur-md border border-white/10 w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl group  transition-all">
        <span className="text-orange-500 font-black text-xl group-hover:scale-110 transition-transform">B</span>
      </Link>

      {/* 2. Navigation Pill */}
      <div className="relative bg-[#0d0d0d]/80 backdrop-blur-xl border border-white/5 p-1.5 rounded-[2rem] flex items-center shadow-2xl overflow-hidden">
        <div 
          ref={bgRef}
          className="absolute h-10 w-24 bg-orange-600/20 rounded-full blur-[2px] border border-orange-500/30"
          style={{ pointerEvents: 'none', opacity: 0 }}
        />

        {navLinks.map((link, i) => (
          <Link
            key={link.path}
            href={link.path}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`relative z-10 w-[100px] py-2 text-center text-[10px] italic font-black uppercase tracking-widest transition-colors duration-300 ${
              pathname === link.path ? "text-orange-500" : "text-gray-400 hover:text-white"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* 3. User Identity Island */}
      <div 
      onClick={() => router.push("/StudentProfile")}
        onMouseEnter={() => handleProfileHover(true)}
        onMouseLeave={() => handleProfileHover(false)}
        className="bg-[#0d0d0d]/80 backdrop-blur-md border border-white/10 h-12 px-2 rounded-2xl flex items-center shadow-xl cursor-pointer group  transition-all"
      >
        {/* Profile Avatar / Initials */}
        <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-orange-500/20">
          {user?.name.charAt(0).toUpperCase() || "U"}
        </div>

        {/* Dynamic Name Reveal */}
        <span 
          ref={nameRef}
          className="overflow-hidden whitespace-nowrap opacity-0 w-0 text-[10px] font-black uppercase tracking-widest text-gray-200"
        >
          {user?.name || "BiteHub User"}
        </span>

        {/* Live Indicator */}
        <div className="ml-3 pr-2 flex items-center">
          {user ? (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          ) : <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
        </div>
      </div>

    </nav>
  );
}