"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { toast } from "sonner";
import api from "@/app/Api_instance/api";
import Footer from "./(User)/components/footer";
import HeroScroll from "./(User)/stepScrolling";
import { useRouter } from "next/navigation";
import NavbarPersonalized from "./(User)/components/navbar";
import RestaurantList from "./(User)/studentRestaurants/page";
gsap.registerPlugin(ScrollTrigger);

export default function StudentHome() {
  const [meals, setMeals] = useState<any[]>([]);
  const containerRef = useRef(null);
  const horizontalRef = useRef(null);
  const heroRef = useRef(null);
  const router = useRouter();
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. HERO REVEAL: Text skew and fade
      const tl = gsap.timeline();
      tl.fromTo(".hero-title", 
        { y: 120, opacity: 0, skewY: 10 }, 
        { y: 0, opacity: 1, skewY: 0, duration: 1.5, ease: "expo.out", delay: 0.5 }
      ).fromTo(".hero-sub", 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 1 }, "-=1"
      );

      // 2. HERO PARALLAX: Background moves slower
      gsap.to(".hero-bg", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // 3. HORIZONTAL SCROLL: "How it Works"
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

      // 4. STATS COUNTER: Numbers ticking up
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

      // 5. GRID REVEAL: Cards tilting in
      gsap.from(".meal-card", {
        opacity: 0,
        y: 80,
        rotateX: -10,
        stagger: 0.1,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".meals-grid",
          start: "top 85%",
        }
      });
    }, containerRef);

    // Fetching data
    const fetchMeals = async () => {
      try {
        const res = await api.get("/meals");
        setMeals(res.data.slice(0, 4)); // Show only first 6 for demo
      } catch (err) {
        toast.error("Live feed unavailable. Using offline cache.");
      }
    };
    fetchMeals();

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-white selection:bg-orange-500/30 overflow-x-hidden">
      <NavbarPersonalized/>
      {/* --- HERO SECTION --- */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="hero-bg absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80"
            className="w-full h-[130%] object-cover opacity-20 grayscale"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/60 to-[#050505]" />
        </div>

        <div className="relative z-10 text-center px-6 md:px-12">
          <div>
            <h1 className="hero-title text-[15vw] md:text-[10vw] font-black tracking-tighter italic leading-[0.85] uppercase">
              BITE<span className="text-orange-500">HUB</span>
            </h1>
          </div>
          <p className="hero-sub text-gray-500 font-bold tracking-[0.5em] uppercase text-[10px] md:text-sm mt-8">
            Zero Waste • Full Plates  • 2026
          </p>
          <div className="mt-12 flex justify-center gap-6">
             <button onClick={()=>router.push("/studentMeals")} className="group px-10 py-4 bg-orange-600 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-orange-600 transition-all duration-500">
               Live Feed
             </button>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
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
          <div className="flex flex-col items-center border-orange-500/20">
            <h2 className="text-6xl font-black text-orange-500 mb-2"><span className="stat-number">820</span>kg</h2>
            <p className="text-gray-500 font-black text-[10px] uppercase tracking-widest">CO2 Reduced</p>
          </div>
        </div>
      </section>

      {/* --- HORIZONTAL STEPPER --- */}
      <section ref={horizontalRef} className="horizontal-trigger bg-[#050505] overflow-hidden">
        <div className="flex h-screen items-center w-[300vw]">
          {/* Step 01 */}
          <div className="step-card w-screen h-full flex flex-col items-center justify-center p-20 relative">
             <span className="absolute top-40 left-20 text-[20vw] font-black text-white/[0.02] pointer-events-none">01</span>
             <div className="z-10 text-center max-w-xl">
                <h3 className="text-6xl font-black mb-6">Hotels Post <span className="text-orange-500">Excess</span></h3>
                <p className="text-gray-500 font-bold leading-relaxed tracking-wide">When a banquet or restaurant has safe, surplus food, they list it on the BiteHub dashboard in seconds.</p>
             </div>
          </div>
          {/* Step 02 */}
          <div className="step-card w-screen h-full flex flex-col items-center justify-center p-20 relative">
             <span className="absolute top-40 left-20 text-[20vw] font-black text-white/[0.02] pointer-events-none">02</span>
             <div className="z-10 text-center max-w-xl">
                <h3 className="text-6xl font-black mb-6">Students <span className="text-orange-500">Claim</span></h3>
                <p className="text-gray-500 font-bold leading-relaxed tracking-wide">Students check the live feed. Using GPS, they find the nearest available meals and claim them instantly.</p>
             </div>
          </div>
          {/* Step 03 */}
          <div className="step-card w-screen h-full flex flex-col items-center justify-center p-20 relative">
             <span className="absolute top-40 left-20 text-[20vw] font-black text-white/[0.02] pointer-events-none">03</span>
             <div className="z-10 text-center max-w-xl">
                <h3 className="text-6xl font-black mb-6">Secure <span className="text-orange-500">Pickup</span></h3>
                <p className="text-gray-500 font-bold leading-relaxed tracking-wide">A unique digital code is generated. Students show this code at the hotel to collect their fresh meal privately.</p>
             </div>
          </div>
        </div>
      </section>

      {/* --- LIVE GRID --- */}
      {/* <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-20">
          <h2 className="text-5xl font-black tracking-tighter uppercase">Live <span className="text-orange-500">Feed</span></h2>
          <div className="hidden md:block h-px flex-1 mx-10 bg-white/5" />
          <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Updated 2m ago</p>
        </div>

        <div className="meals-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {meals.map((meal) => (
            <div key={meal.id} className="meal-card group bg-[#0d0d0d] rounded-[2.5rem] p-8 border border-white/5 hover:border-orange-500/30 transition-all duration-700">
              <div className="flex justify-between items-start mb-10">
                <div className="text-[10px] font-black bg-orange-600/10 text-orange-500 px-4 py-2 rounded-full uppercase tracking-widest">
                  {meal.distance} KM
                </div>
                <div className={`w-2 h-2 rounded-full ${meal.type === 'veg' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
              </div>
              <h3 className="text-[#737373] text-[10px] font-black uppercase tracking-widest mb-2">{meal.hotelName}</h3>
              <h2 className="text-3xl font-bold mb-8 group-hover:text-orange-500 transition-colors leading-tight">{meal.foodName}</h2>
              
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Ends in {meal.expiryTime}</span>
                <button 
                  onClick={() => toast.success("Claiming successful!")}
                  className="bg-white text-black font-black text-[10px] uppercase px-6 py-3 rounded-xl hover:bg-orange-500 hover:text-white transition-all active:scale-95"
                >
                  Claim
                </button>
              </div>
            </div>
          ))}
        </div>
      </section> */}
      <RestaurantList />
      {/* <HeroScroll /> */}
    <Footer />
    </div>
  );
}