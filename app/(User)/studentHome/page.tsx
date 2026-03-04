"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { toast } from "sonner";
import api from "@/app/Api_instance/api";
import Footer from "@/app/components/footer";
import { useRouter } from "next/navigation";
import NavbarPersonalized from "@/app/components/navbar";
import RestaurantList from "../studentRestaurants/page";

gsap.registerPlugin(ScrollTrigger);

export default function StudentHome() {
  const [meals, setMeals] = useState<any[]>([]);
  const containerRef = useRef(null);
  const horizontalRef = useRef(null);
  const heroRef = useRef(null);
  const router = useRouter();

  useGSAP(() => {
    // 1. STICKY REVEAL LOGIC
    // This pins the hero at the top but allows following content to overlap it
    ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      pin: true,
      pinSpacing: false, // Essential: allows next section to move UP over the hero
    });

    // 2. HERO REVEAL: Text entrance
    const tl = gsap.timeline();
    tl.fromTo(".hero-title", 
      { y: 120, opacity: 0, skewY: 10 }, 
      { y: 0, opacity: 1, skewY: 0, duration: 1.5, ease: "expo.out", delay: 0.5 }
    ).fromTo(".hero-sub", 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 1 }, "-=1"
    );

    // 3. OPTIONAL: Hero Fade/Scale on scroll
    // Makes the hero feel like it's receding as it gets covered
    gsap.to(".hero-inner", {
      opacity: 0,
      scale: 0.9,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });

    // 4. HORIZONTAL SCROLL
    const sections = gsap.utils.toArray(".step-card");
    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: ".horizontal-trigger",
        pin: true,
        scrub: 1,
        snap: 1 / (sections.length - 1),
        start: "top top",
        end: () => "+=" + (horizontalRef.current as any).offsetWidth,
      }
    });

    // 5. STATS COUNTER
    gsap.from(".stat-number", {
      textContent: 0,
      duration: 2,
      ease: "power2.out",
      snap: { textContent: 1 },
      scrollTrigger: {
        trigger: ".stats-section",
        start: "top 80%",
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-white selection:bg-orange-500/30 overflow-x-hidden">
      <NavbarPersonalized />

      {/* --- HERO SECTION (Pinned/Sticky) --- */}
      {/* z-0 ensures it sits behind the content that will cover it */}
      <section 
        ref={heroRef} 
        className="relative h-screen flex items-center justify-center overflow-hidden z-0"
      >
        <div className="hero-bg absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80"
            className="w-full h-full object-cover opacity-20 grayscale"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/60 to-[#050505]" />
        </div>

        <div className="hero-inner relative z-10 text-center px-6 md:px-12">
          <h1 className="hero-title text-[15vw] md:text-[10vw] font-black tracking-tighter italic leading-[0.85] uppercase">
            BITE<span className="text-orange-500">HUB</span>
          </h1>
          <p className="hero-sub text-gray-500 font-bold tracking-[0.5em] uppercase text-[10px] md:text-sm mt-8">
            Zero Waste • Full Plates • 2026
          </p>
          <div className="mt-12 flex justify-center">
             <button onClick={() => router.push("/studentMeals")} className="group px-10 py-4 bg-orange-600 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-orange-600 transition-all duration-500">
               Live Feed
             </button>
          </div>
        </div>
      </section>

      {/* --- COVER CONTENT WRAPPER --- */}
      {/* relative z-10 and bg color are mandatory to successfully cover the hero */}
      <div className="relative z-10 bg-[#050505] shadow-[0_-50px_100px_rgba(0,0,0,0.9)]">
        
        {/* STATS SECTION */}
        <section className="stats-section py-32 border-y border-white/5 bg-[#080808]">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <div className="flex flex-col items-center">
              <h2 className="text-6xl font-black text-orange-500 mb-2"><span className="stat-number">1240</span>+</h2>
              <p className="text-gray-500 font-black text-[10px] uppercase tracking-widest">Meals Saved</p>
            </div>
            <div className="flex flex-col items-center">
              <h2 className="text-6xl font-black text-orange-500 mb-2"><span className="stat-number">45</span></h2>
              <p className="text-gray-500 font-black text-[10px] uppercase tracking-widest">Hotel Partners</p>
            </div>
            <div className="flex flex-col items-center">
              <h2 className="text-6xl font-black text-orange-500 mb-2"><span className="stat-number">820</span>kg</h2>
              <p className="text-gray-500 font-black text-[10px] uppercase tracking-widest">CO2 Reduced</p>
            </div>
          </div>
        </section>

        {/* HORIZONTAL STEPPER */}
        <section ref={horizontalRef} className="horizontal-trigger bg-[#050505] overflow-hidden">
          <div className="flex h-screen items-center w-[300vw]">
            <div className="step-card w-screen h-full flex flex-col items-center justify-center p-20 relative">
               <span className="absolute top-40 left-20 text-[20vw] font-black text-white/[0.02] pointer-events-none">01</span>
               <div className="z-10 text-center max-w-xl">
                  <h3 className="text-6xl font-black mb-6">Hotels Post <span className="text-orange-500">Excess</span></h3>
                  <p className="text-gray-500 font-bold leading-relaxed tracking-wide">When a banquet or restaurant has safe, surplus food, they list it on the BiteHub dashboard in seconds.</p>
               </div>
            </div>
            <div className="step-card w-screen h-full flex flex-col items-center justify-center p-20 relative">
               <span className="absolute top-40 left-20 text-[20vw] font-black text-white/[0.02] pointer-events-none">02</span>
               <div className="z-10 text-center max-w-xl">
                  <h3 className="text-6xl font-black mb-6">Students <span className="text-orange-500">Claim</span></h3>
                  <p className="text-gray-500 font-bold leading-relaxed tracking-wide">Students check the live feed. Using GPS, they find the nearest available meals and claim them instantly.</p>
               </div>
            </div>
            <div className="step-card w-screen h-full flex flex-col items-center justify-center p-20 relative">
               <span className="absolute top-40 left-20 text-[20vw] font-black text-white/[0.02] pointer-events-none">03</span>
               <div className="z-10 text-center max-w-xl">
                  <h3 className="text-6xl font-black mb-6">Secure <span className="text-orange-500">Pickup</span></h3>
                  <p className="text-gray-500 font-bold leading-relaxed tracking-wide">A unique digital code is generated. Students show this code at the hotel to collect their fresh meal privately.</p>
               </div>
            </div>
          </div>
        </section>

        <RestaurantList />
        <Footer />
      </div>
    </div>
  );
}