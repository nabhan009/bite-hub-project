"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

export default function HeroScroll() {
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1, 
      wheelMultiplier: 1.2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=6000", // Increased for 3 distinct steps
          pin: true,
          scrub: 1,
        }
      });

      // --- STEP 1: SIGN UP ---
      tl.to(".step-1", { opacity: 0, y: -50, filter: "blur(10px)", duration: 1 }, 0.5)
        .to(".text-1", { opacity: 0, scale: 2, filter: "blur(20px)", duration: 1 }, 0.5)
        .to(".img-step-1", { opacity: 0, scale: 0.5, rotate: -10, duration: 1 }, 0.5)

      // --- STEP 2: PICK PRODUCT ---
      tl.fromTo(".step-2", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, 1)
        .fromTo(".text-2", { opacity: 0, scale: 0.5, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1 }, 1)
        .fromTo(".img-step-2", { opacity: 0, x: 200, rotate: 20 }, { opacity: 1, x: 0, rotate: 0, duration: 1 }, 1)
        .to(".step-2", { opacity: 0, y: -50, filter: "blur(10px)", duration: 1 }, 2)
        .to(".text-2", { opacity: 0, scale: 2, filter: "blur(20px)", duration: 1 }, 2)
        .to(".img-step-2", { opacity: 0, x: -200, rotate: -20, duration: 1 }, 2)

      // --- STEP 3: ENJOY JOURNEY ---
      tl.fromTo(".step-3", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, 2.5)
        .fromTo(".text-3", { opacity: 0, scale: 0.5, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1 }, 2.5)
        .fromTo(".img-step-3", { opacity: 0, y: 200, scale: 1.5 }, { opacity: 1, y: 0, scale: 1, duration: 1 }, 2.5);

    }, containerRef);

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} className="bg-[#050505]">
      <section ref={triggerRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        
        {/* --- Dynamic Background Images --- */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="img-step-1 absolute w-[40vw] h-[50vh] rounded-[3rem] overflow-hidden border border-white/10 opacity-40">
            <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800" className="w-full h-full object-cover" alt="S1" />
          </div>
          <div className="img-step-2 absolute w-[40vw] h-[50vh] rounded-[3rem] overflow-hidden border border-white/10 opacity-0">
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800" className="w-full h-full object-cover" alt="S2" />
          </div>
          <div className="img-step-3 absolute w-[40vw] h-[50vh] rounded-[3rem] overflow-hidden border border-white/10 opacity-0">
            <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800" className="w-full h-full object-cover" alt="S3" />
          </div>
        </div>

        {/* --- Content Layers --- */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          
          {/* Step 1 Content */}
          <div className="absolute flex flex-col items-center">
            <p className="step-1 text-orange-500 font-black tracking-[0.5em] uppercase text-xs mb-4">Step 01</p>
            <h2 className="text-1 text-[12vw] font-black text-white tracking-tighter italic uppercase leading-none">Sign Up</h2>
          </div>

          {/* Step 2 Content */}
          <div className="absolute flex flex-col items-center">
            <p className="step-2 opacity-0 text-orange-500 font-black tracking-[0.5em] uppercase text-xs mb-4">Step 02</p>
            <h2 className="text-2 opacity-0 text-[10vw] font-black text-white tracking-tighter italic uppercase leading-none text-center">Pick Product</h2>
          </div>

          {/* Step 3 Content */}
          <div className="absolute flex flex-col items-center">
            <p className="step-3 opacity-0 text-orange-500 font-black tracking-[0.5em] uppercase text-xs mb-4">Step 03</p>
            <h2 className="text-3 opacity-0 text-[10vw] font-black text-white tracking-tighter italic uppercase leading-none text-center">Enjoy Journey</h2>
          </div>

        </div>

        {/* Ambient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/20 via-transparent to-[#050505] pointer-events-none" />
      </section>
      
      <div className="h-screen flex items-center justify-center bg-[#050505]">
         <p className="text-gray-800 font-black uppercase tracking-[1em] text-xs">Section End</p>
      </div>
    </div>
  );
}