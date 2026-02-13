// "use client";
// import { useEffect, useRef } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import Lenis from "@studio-freight/lenis";

// gsap.registerPlugin(ScrollTrigger);

// export default function HeroScroll() {
//   const containerRef = useRef(null);
//   const triggerRef = useRef(null);

//   useEffect(() => {
//     // 1. IMPROVED SMOOTHING: Adjusted lerp and duration
//     const lenis = new Lenis({
//       duration: 1.2,   // Speed of the scroll animation
//       lerp: 0.08,      // Lower = smoother/floatier (0.1 was snappier)
//       wheelMultiplier: 1, 
//       infinite: false,
//     });

//     function raf(time: number) {
//       lenis.raf(time);
//       requestAnimationFrame(raf);
//     }
//     requestAnimationFrame(raf);

//     const ctx = gsap.context(() => {
//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: triggerRef.current,
//           start: "top top",
//           // 2. INCREASED SPEED: Reduced from 6000 to 3000
//           // This makes the animations trigger with less scroll effort
//           end: "+=3000", 
//           pin: true,
//           scrub: 0.5, // 3. Lower scrub value = more immediate response to scroll
//         }
//       });

//       // --- STEP 1: SIGN UP ---
//       tl.to(".step-1", { opacity: 0, y: -50, filter: "blur(10px)", duration: 1 }, 0.5)
//         .to(".text-1", { opacity: 0, scale: 2, filter: "blur(20px)", duration: 1 }, 0.5)
//         .to(".img-step-1", { opacity: 0, scale: 0.5, rotate: -10, duration: 1 }, 0.5)

//       // --- STEP 2: PICK PRODUCT ---
//       tl.fromTo(".step-2", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, 1)
//         .fromTo(".text-2", { opacity: 0, scale: 0.5, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1 }, 1)
//         .fromTo(".img-step-2", { opacity: 0, x: 200, rotate: 20 }, { opacity: 1, x: 0, rotate: 0, duration: 1 }, 1)
//         .to(".step-2", { opacity: 0, y: -50, filter: "blur(10px)", duration: 1 }, 2)
//         .to(".text-2", { opacity: 0, scale: 2, filter: "blur(20px)", duration: 1 }, 2)
//         .to(".img-step-2", { opacity: 0, x: -200, rotate: -20, duration: 1 }, 2)

//       // --- STEP 3: ENJOY JOURNEY ---
//       tl.fromTo(".step-3", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, 2.5)
//         .fromTo(".text-3", { opacity: 0, scale: 0.5, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1 }, 2.5)
//         .fromTo(".img-step-3", { opacity: 0, y: 200, scale: 1.5 }, { opacity: 1, y: 0, scale: 1, duration: 1 }, 2.5);

//     }, containerRef);

//     return () => {
//       ctx.revert();
//       lenis.destroy();
//     };
//   }, []);

//   return (
//     <div ref={containerRef} className="bg-[#050505] overflow-x-hidden">
//       <section ref={triggerRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        
//         {/* --- Dynamic Background Images --- */}
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="img-step-1 absolute w-[40vw] h-[50vh] rounded-[3rem] overflow-hidden border border-white/10 opacity-40">
//             <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800" className="w-full h-full object-cover" alt="S1" />
//           </div>
//           <div className="img-step-2 absolute w-[40vw] h-[50vh] rounded-[3rem] overflow-hidden border border-white/10 opacity-0">
//             <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800" className="w-full h-full object-cover" alt="S2" />
//           </div>
//           <div className="img-step-3 absolute w-[40vw] h-[50vh] rounded-[3rem] overflow-hidden border border-white/10 opacity-0">
//             <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800" className="w-full h-full object-cover" alt="S3" />
//           </div>
//         </div>

//         {/* --- Content Layers --- */}
//         <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          
//           {/* Step 1 Content */}
//           <div className="absolute flex flex-col items-center">
//             <p className="step-1 text-orange-500 font-black tracking-[0.5em] uppercase text-xs mb-4">Step 01</p>
//             <h2 className="text-1 text-[12vw] font-black text-white tracking-tighter italic uppercase leading-none">Sign Up</h2>
//           </div>

//           {/* Step 2 Content */}
//           <div className="absolute flex flex-col items-center">
//             <p className="step-2 opacity-0 text-orange-500 font-black tracking-[0.5em] uppercase text-xs mb-4">Step 02</p>
//             <h2 className="text-2 opacity-0 text-[10vw] font-black text-white tracking-tighter italic uppercase leading-none text-center">Pick Product</h2>
//           </div>

//           {/* Step 3 Content */}
//           <div className="absolute flex flex-col items-center">
//             <p className="step-3 opacity-0 text-orange-500 font-black tracking-[0.5em] uppercase text-xs mb-4">Step 03</p>
//             <h2 className="text-3 opacity-0 text-[10vw] font-black text-white tracking-tighter italic uppercase leading-none text-center">Enjoy Journey</h2>
//           </div>

//         </div>

//         {/* Ambient Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/20 via-transparent to-[#050505] pointer-events-none" />
//       </section>
      
//       <div className="h-screen flex items-center justify-center bg-[#050505]">
//          <p className="text-gray-800 font-black uppercase tracking-[1em] text-xs">Section End</p>
//       </div>
//     </div>
//   );
// }




"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

export default function RestaurantScroll() {
  const containerRef = useRef(null);
  const heroTrigger = useRef(null);
  const aboutTrigger = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 1,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      // --- HERO: THE TASTE JOURNEY ---
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroTrigger.current,
          start: "top top",
          end: "+=3000", 
          pin: true,
          scrub: 1,
        }
      });

      // Step 1: Fresh Start -> Fade out & Rise
      heroTl.to(".step-1-content", { y: -150, opacity: 0, scale: 0.9 }, 0.5)
            .to(".food-1", { y: -100, opacity: 0, rotate: -10, scale: 0.8 }, 0.5)

      // Step 2: The Sizzle -> Slide in from Right
      heroTl.fromTo(".step-2-content", { x: 100, opacity: 0 }, { x: 0, opacity: 1 }, 1)
            .fromTo(".food-2", { x: 300, rotate: 45, opacity: 0 }, { x: 0, rotate: 0, opacity: 1 }, 1)
            .to(".step-2-content", { x: -100, opacity: 0 }, 1.8)
            .to(".food-2", { x: -300, rotate: -45, opacity: 0 }, 1.8)

      // Step 3: The Feast -> Scale up from Center
      heroTl.fromTo(".step-3-content", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1 }, 2)
            .fromTo(".food-3", { scale: 1.5, filter: "blur(20px)", opacity: 0 }, { scale: 1, filter: "blur(0px)", opacity: 1 }, 2);

      // --- ABOUT: THE KITCHEN STORY (Parallax) ---
      const aboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutTrigger.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });

      aboutTl.from(".about-bg-text", { x: -500, opacity: 0 }, 0)
             .from(".chef-image", { y: 200, scale: 1.2 }, 0)
             .from(".floating-ingredient", { y: 400, rotate: 180, stagger: 0.2 }, 0);

    }, containerRef);

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} className="bg-[#0c0c0c] text-[#f4f4f4]">
      
      {/* SECTION 1: HERO */}
      <section ref={heroTrigger} className="relative h-screen flex items-center justify-center overflow-hidden">
        
        {/* Animated Food Assets */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800" className="food-1 absolute w-[30vw] rounded-full shadow-2xl" alt="Pancakes" />
          <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800" className="food-2 absolute w-[35vw] rounded-3xl shadow-2xl opacity-0" alt="Salad" />
          <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800" className="food-3 absolute w-[40vw] rounded-full shadow-2xl opacity-0" alt="Pizza" />
        </div>

        {/* Floating Text */}
        <div className="relative z-10 text-center pointer-events-none">
          <div className="step-1-content">
            <h1 className="text-[10vw] font-black uppercase leading-[0.8] tracking-tighter">Freshly<br/><span className="text-orange-500">Picked</span></h1>
            <p className="mt-4 text-xl tracking-widest uppercase">Farm to your table</p>
          </div>
          <div className="step-2-content absolute inset-0 opacity-0 flex flex-col items-center justify-center">
            <h1 className="text-[10vw] font-black uppercase leading-[0.8] tracking-tighter">Expertly<br/><span className="text-orange-500">Cooked</span></h1>
            <p className="mt-4 text-xl tracking-widest uppercase">Master Chef Selection</p>
          </div>
          <div className="step-3-content absolute inset-0 opacity-0 flex flex-col items-center justify-center">
            <h1 className="text-[10vw] font-black uppercase leading-[0.8] tracking-tighter">Fastest<br/><span className="text-orange-500">Delivery</span></h1>
            <p className="mt-4 text-xl tracking-widest uppercase">Hot & Ready in 20 mins</p>
          </div>
        </div>
      </section>

      {/* SECTION 2: ABOUT THE RESTAURANT */}
      <section ref={aboutTrigger} className="relative min-h-screen py-32 overflow-hidden bg-[#111]">
        
        {/* Large Decorative Text */}
        <div className="about-bg-text absolute top-0 left-0 text-[25vw] font-black text-white/[0.03] whitespace-nowrap select-none">
          OUR KITCHEN STORY
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            
            {/* Parallax Image Composite */}
            <div className="relative w-full md:w-1/2 h-[70vh]">
              <div className="chef-image w-full h-full rounded-2xl overflow-hidden border border-white/10">
                <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800" className="w-full h-full object-cover" alt="Chef" />
              </div>
              {/* Floating ingredient over the image */}
              <img src="https://pngimg.com/uploads/tomato/tomato_PNG12589.png" className="floating-ingredient absolute -top-10 -right-10 w-32 drop-shadow-2xl" alt="Tomato" />
              <img src="https://pngimg.com/uploads/spinach/spinach_PNG10.png" className="floating-ingredient absolute -bottom-10 -left-10 w-40 drop-shadow-2xl" alt="Leaf" />
            </div>

            {/* Content */}
            <div className="w-full md:w-1/2 space-y-8">
              <h2 className="text-6xl font-bold leading-tight">
                Where <span className="italic text-orange-500 underline decoration-2">Passion</span> <br /> 
                Meets the Plate.
              </h2>
              <p className="text-xl text-gray-400 leading-relaxed">
                Founded in 2024, we set out to redefine the digital dining experience. 
                Our platform isn't just about ordering food; it's about connecting you 
                with the artisans of taste. We prioritize local ingredients, world-class 
                chefs, and lightning-fast logistics.
              </p>
              
              <div className="flex gap-10 border-t border-white/10 pt-10">
                <div>
                  <h4 className="text-4xl font-black text-orange-500">12k+</h4>
                  <p className="text-xs uppercase tracking-widest text-gray-500">Happy Clients</p>
                </div>
                <div>
                  <h4 className="text-4xl font-black text-orange-500">50+</h4>
                  <p className="text-xs uppercase tracking-widest text-gray-500">Top Chefs</p>
                </div>
              </div>

              <button className="px-10 py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-full font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95">
                Explore the Menu
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="h-[40vh] flex flex-col items-center justify-center bg-black">
         <h3 className="text-3xl font-black italic mb-6">Hungry yet?</h3>
         <p className="text-gray-600 uppercase tracking-[1em] text-[10px]">Order Now • 2026</p>
      </footer>
    </div>
  );
}