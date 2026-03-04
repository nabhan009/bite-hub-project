"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import { PlusCircle, TrendingUp, Users, Leaf, ChevronRight } from "lucide-react";
import Footer from "@/app/components/footer";
import NavbarRestaurant from "@/app/components/NavbarRestaurant";
import api from "@/app/Api_instance/api";

gsap.registerPlugin(ScrollTrigger);

export default function HotelHome() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [meals, setMeals] = useState([]);

  useEffect(() => {
  const fetchUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data);
  };
  fetchUsers();
  const fetchMeals = async () => {
    const res1 = await api.get("/meals");
    setMeals(res1.data);
  };
  fetchMeals();
  // const impact = users.length === 0 ? 0 : (meals.length / users.length).toFixed(2);
}, []);
  useGSAP(() => {
    // 1. Sticky Reveal Logic
    ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      pin: true,
      pinSpacing: false,
    });

    // 2. Text Entrance
    const tl = gsap.timeline();
    tl.from(".hero-title span", {
      y: 100,
      opacity: 0,
      stagger: 0.1,
      duration: 1.2,
      ease: "power4.out"
    })
    .from(".hero-cta", {
      scale: 0.8,
      opacity: 0,
      duration: 0.8
    }, "-=0.5");

    // 3. Staggered Card Reveal on Scroll
    gsap.from(".action-card", {
      y: 50,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      scrollTrigger: {
        trigger: ".action-grid",
        start: "top 80%",
      }
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-[#050505] text-white overflow-x-hidden">
      <NavbarRestaurant />

      {/* --- HERO SECTION (Sticky) --- */}
      <section 
        ref={heroRef} 
        className="relative h-screen flex items-center justify-center overflow-hidden z-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
        
        <div className="relative z-10 text-center px-6">
          <h1 className="hero-title text-6xl md:text-[8vw] font-black leading-none uppercase tracking-tighter italic">
            <span className="block">Grow Your</span>
            <span className="block text-orange-500 underline decoration-orange-500/30">Impact.</span>
          </h1>
          <p className="mt-8 text-gray-500 font-bold uppercase tracking-[0.4em] text-xs">
            BiteHub Provider Portal • Est. 2026
          </p>
          <div className="hero-cta mt-12">
            <button 
              onClick={() => router.push("/HotelMealAdd")}
              className="group flex items-center gap-3 px-12 py-5 bg-white text-black rounded-full font-black uppercase text-xs tracking-widest hover:bg-orange-500 hover:text-white transition-all duration-500 shadow-2xl"
            >
              Post Surplus Meal <PlusCircle size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* --- DASHBOARD CONTENT --- */}
      <div className="relative z-10 bg-[#050505] shadow-[0_-50px_100px_rgba(0,0,0,0.9)] rounded-t-[3rem] border-t border-white/5">
        
        {/* Quick Stats */}
        <div className="max-w-7xl mx-auto px-6 -translate-y-1/2 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Meals Saved", value: `${meals.length || 0}`, icon: <Leaf className="text-orange-500" /> },
            { label: "Community Reach", value:`${users?.length || 0}`, icon: <Users className="text-orange-500" /> },
            { label: "Impact Score", value: `${users.length === 0 ? 0 : (meals.length / users.length).toFixed(2)}%`, icon: <TrendingUp className="text-orange-500" /> },
          ].map((stat, i) => (
            <div key={i} className="bg-[#0d0d0d] p-8 rounded-3xl border border-white/5 flex items-center justify-between backdrop-blur-xl">
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <h2 className="text-4xl font-bold italic">{stat.value}</h2>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl">{stat.icon}</div>
            </div>
          ))}
        </div>

        {/* Action Grid */}
        <section className="action-grid max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Action Card 1 */}
            <div 
              onClick={() => router.push("/HotelMealAdd")}
              className="action-card group relative h-[400px] rounded-[3rem] overflow-hidden border border-white/5 cursor-pointer"
            >
              <img src="https://assets.bonappetit.com/photos/5aa7f1636ed79626bc262b97/4:3/w_3024,h_2268,c_limit/healthyish-micahmealprep2.jpg" className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt="Post Meal" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10">
                <h3 className="text-4xl font-black uppercase italic mb-4">Post a <span className="text-orange-500">New Meal</span></h3>
                <p className="text-gray-400 max-w-xs mb-6">Instantly list your surplus food to the live student feed in under 30 seconds.</p>
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <ChevronRight />
                </div>
              </div>
            </div>

            {/* Action Card 2 */}
            <div 
              onClick={() => router.push(`/HotelHistory`)}
              className="action-card group relative h-[400px] rounded-[3rem] overflow-hidden border border-white/5 cursor-pointer"
            >
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800" className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt="Analytics" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10">
                <h3 className="text-4xl font-black uppercase italic mb-4">View <span className="text-orange-500">History</span></h3>
                <p className="text-gray-400 max-w-xs mb-6">Track your donation metrics and see your sustainability impact.</p>
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <ChevronRight />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Live Status Section */}
        <section className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5">
           <div className="bg-orange-500/5 rounded-[4rem] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between border border-orange-500/10">
              <div className="text-center md:text-left">
                <h2 className="text-4xl md:text-6xl font-black uppercase italic mb-4">Ready to <span className="text-orange-500">Donate?</span></h2>
                <p className="text-gray-400 font-medium">Your surplus could be someone's next meal. Start the cycle now.</p>
              </div>
              {/* <button 
                onClick={() => router.push("/hotelPostMeal")}
                className="mt-8 md:mt-0 px-10 py-5 bg-orange-500 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(249,115,22,0.2)]"
              >
                Go Live Now
              </button> */}
           </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}